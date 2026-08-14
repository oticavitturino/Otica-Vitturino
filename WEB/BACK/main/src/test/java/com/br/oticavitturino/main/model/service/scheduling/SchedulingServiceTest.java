package com.br.oticavitturino.main.model.service.scheduling;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.br.oticavitturino.main.infra.email.SendEmailMessage;
import com.br.oticavitturino.main.infra.security.EncryptionService;
import com.br.oticavitturino.main.model.domain.customer.Customer;
import com.br.oticavitturino.main.model.domain.scheduling.AvailableSlot;
import com.br.oticavitturino.main.model.domain.scheduling.DateAvailableDTO;
import com.br.oticavitturino.main.model.domain.scheduling.Scheduling;
import com.br.oticavitturino.main.model.domain.scheduling.SchedulingDTO;
import com.br.oticavitturino.main.model.domain.scheduling.SchedulingEnum;
import com.br.oticavitturino.main.model.domain.scheduling.StatusEnum;
import com.br.oticavitturino.main.model.repository.customer.CustomerRepository;
import com.br.oticavitturino.main.model.repository.scheduling.AvailableSlotRepository;
import com.br.oticavitturino.main.model.repository.scheduling.SchedulingRepository;

@ExtendWith(MockitoExtension.class)
public class SchedulingServiceTest {

    @Mock
    private SchedulingRepository repository;

    @Mock
    private AvailableSlotRepository availableSlotRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private SendEmailMessage sendMailMessage;

    @Mock
    private EncryptionService encryptionService;

    @InjectMocks
    private SchedulingService schedulingService;

    private LocalDateTime testDate;

    @BeforeEach
    void setUp() {
        testDate = LocalDateTime.now().plusDays(1);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Teste de adicionar data disponível para agendamento")
    void testAddDateAvailable() {
        DateAvailableDTO dto = new DateAvailableDTO(testDate);
        List<DateAvailableDTO> result = schedulingService.addDateAvailable(List.of(dto));

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testDate, result.get(0).date_available());
        verify(availableSlotRepository, times(1)).saveAll(anyList());
    }

    @Test
    @DisplayName("Teste de excluir data disponível para agendamento")
    void testDeleteDateAvailable() {
        DateAvailableDTO dto = new DateAvailableDTO(testDate);
        AvailableSlot slot = new AvailableSlot(testDate);
        when(availableSlotRepository.findBySlotDate(testDate)).thenReturn(slot);

        schedulingService.deleteDateAvailable(dto);

        verify(availableSlotRepository, times(1)).delete(slot);
    }

    @Test
    @DisplayName("Confirmar agendamento futuro mantém o registro, soma pontos e envia e-mail")
    void testConfirmAppointment_FutureDateKeepsRecord() {
        Customer customer = customerWithScheduling();
        Scheduling scheduling = scheduling(testDate, customer, SchedulingEnum.CONSULTA);
        stubFindScheduling(1L, scheduling);
        stubDecrypt();

        schedulingService.confirmOrCancelAppointment(1L, StatusEnum.CONCLUIDO);

        assertEquals(StatusEnum.CONCLUIDO, scheduling.getStatus());
        assertEquals(30, customer.getPoints());
        verify(customerRepository, times(1)).save(customer);
        verify(repository, times(1)).save(scheduling);
        verify(repository, never()).delete(scheduling);
        verify(sendMailMessage, times(1)).sendEmailNotification(
                eq("teste@gmail.com"), eq("Consulta Confirmada"), eq("John Doe"), anyString());
    }

    @Test
    @DisplayName("Confirmar agendamento já ocorrido remove o registro sem save posterior")
    void testConfirmAppointment_PastDateRemovesRecord() {
        Customer customer = customerWithScheduling();
        Scheduling scheduling = scheduling(LocalDateTime.now().minusHours(1), customer, SchedulingEnum.MANUTENCAO);
        stubFindScheduling(1L, scheduling);
        stubDecrypt();

        schedulingService.confirmOrCancelAppointment(1L, StatusEnum.CONCLUIDO);

        assertEquals(StatusEnum.CONCLUIDO, scheduling.getStatus());
        assertEquals(15, customer.getPoints());
        assertNull(customer.getScheduling());
        verify(customerRepository, times(1)).save(customer);
        verify(repository, never()).save(scheduling);
        verify(repository, times(1)).delete(scheduling);
        verify(sendMailMessage, times(1)).sendEmailNotification(
                eq("teste@gmail.com"), eq("Consulta Confirmada"), eq("John Doe"), anyString());
    }

    @Test
    @DisplayName("Cancelar agendamento pelo administrador devolve o horário e remove o registro")
    void testConfirmOrCancelAppointment_Cancel() {
        Customer customer = customerWithScheduling();
        Scheduling scheduling = scheduling(testDate, customer, SchedulingEnum.CONSULTA);
        stubFindScheduling(1L, scheduling);
        stubDecrypt();

        schedulingService.confirmOrCancelAppointment(1L, StatusEnum.CANCELADO);

        assertEquals(StatusEnum.CANCELADO, scheduling.getStatus());
        assertNull(customer.getScheduling());
        verify(repository, never()).save(scheduling);
        verify(repository, times(1)).delete(scheduling);
        verify(customerRepository, times(1)).save(customer);

        ArgumentCaptor<AvailableSlot> slotCaptor = ArgumentCaptor.forClass(AvailableSlot.class);
        verify(availableSlotRepository, times(1)).save(slotCaptor.capture());
        assertEquals(testDate, slotCaptor.getValue().getSlotDate());

        verify(sendMailMessage, times(1)).sendEmailNotification(
                eq("teste@gmail.com"), eq("Consulta Cancelada"), eq("John Doe"), anyString());
    }

    @Test
    @DisplayName("Job remove automaticamente agendamentos concluídos cuja data já passou")
    void testRemoveExpiredCompletedSchedulings_PastDate() {
        Customer customer = customerWithScheduling();
        Scheduling expired = scheduling(LocalDateTime.now().minusHours(1), customer, SchedulingEnum.CONSULTA);
        expired.setStatus(StatusEnum.CONCLUIDO);
        when(repository.findByStatusAndSchedulingDateLessThanEqual(eq(StatusEnum.CONCLUIDO), any(LocalDateTime.class)))
                .thenReturn(List.of(expired));

        schedulingService.removeExpiredCompletedSchedulings();

        assertNull(customer.getScheduling());
        assertNull(expired.getCustomer());
        verify(customerRepository, times(1)).save(customer);
        verify(repository, times(1)).delete(expired);
        verify(availableSlotRepository, never()).save(any(AvailableSlot.class));
    }

    @Test
    @DisplayName("Job não remove agendamentos concluídos ainda no futuro")
    void testRemoveExpiredCompletedSchedulings_FutureDate() {
        Customer customer = customerWithScheduling();
        Scheduling upcoming = scheduling(testDate, customer, SchedulingEnum.CONSULTA);
        upcoming.setStatus(StatusEnum.CONCLUIDO);
        when(repository.findByStatusAndSchedulingDateLessThanEqual(eq(StatusEnum.CONCLUIDO), any(LocalDateTime.class)))
                .thenReturn(List.of(upcoming));

        schedulingService.removeExpiredCompletedSchedulings();

        verify(repository, never()).delete(upcoming);
        verify(customerRepository, never()).save(customer);
    }

    @Test
    @DisplayName("Confirmar ou cancelar lança erro quando o agendamento não existe")
    void testConfirmOrCancelAppointment_NotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> schedulingService.confirmOrCancelAppointment(99L, StatusEnum.CONCLUIDO));
        verify(repository, never()).save(any(Scheduling.class));
        verify(repository, never()).delete(any(Scheduling.class));
    }

    @Test
    @DisplayName("Teste de listar todos os agendamentos com cliente")
    void testGetAllSchedulings() {
        Customer customer = newCustomer();
        Scheduling withCustomer = scheduling(testDate, customer, SchedulingEnum.CONSULTA);
        Scheduling withoutCustomer = new Scheduling(testDate.plusHours(1));
        when(repository.findAll()).thenReturn(List.of(withCustomer, withoutCustomer));
        stubDecrypt();

        List<SchedulingDTO> results = schedulingService.getAllSchedulings();

        assertEquals(1, results.size());
        assertEquals("John Doe", results.get(0).name());
        assertEquals(StatusEnum.PENDENTE, results.get(0).status());
    }

    @Test
    @DisplayName("Cliente autenticado visualiza os próprios agendamentos")
    void testGetMySchedulings() {
        Customer customer = newCustomer();
        customer.setId(1L);
        authenticate(customer);
        Scheduling scheduling = scheduling(testDate, customer, SchedulingEnum.LIMPEZA);
        when(repository.findByCustomerId(1L)).thenReturn(List.of(scheduling));
        stubDecrypt();

        List<SchedulingDTO> results = schedulingService.getMySchedulings();

        assertEquals(1, results.size());
        assertEquals(SchedulingEnum.LIMPEZA, results.get(0).scheduling_type());
        assertEquals("John Doe", results.get(0).name());
    }

    @Test
    @DisplayName("Listar os próprios agendamentos exige cliente autenticado")
    void testGetMySchedulings_Unauthenticated() {
        assertThrows(IllegalArgumentException.class, () -> schedulingService.getMySchedulings());
    }

    @Test
    @DisplayName("Teste de obter todas as datas disponíveis para agendamento")
    void testGetAllDatesAvailable() {
        AvailableSlot slot1 = new AvailableSlot(testDate);
        AvailableSlot slot2 = new AvailableSlot(testDate.plusHours(1));
        when(availableSlotRepository.findAll()).thenReturn(List.of(slot1, slot2));

        List<DateAvailableDTO> results = schedulingService.getAllDatesAvailable();

        assertEquals(2, results.size());
        verify(availableSlotRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Teste de agendar um atendimento")
    void testScheduleAppointment() {
        SchedulingDTO dto = new SchedulingDTO(null, "John Doe", SchedulingEnum.CONSULTA, testDate, StatusEnum.PENDENTE);
        AvailableSlot slot = new AvailableSlot(testDate);
        Customer customer = newCustomer();
        when(availableSlotRepository.findBySlotDate(testDate)).thenReturn(slot);
        when(customerRepository.findByName("John Doe")).thenReturn(customer);
        stubDecrypt();

        SchedulingDTO result = schedulingService.scheduleAppointment(dto);

        assertNotNull(result);
        assertEquals(StatusEnum.PENDENTE, result.status());
        assertEquals("John Doe", result.name());
        verify(repository, times(1)).save(any(Scheduling.class));
        verify(availableSlotRepository, times(1)).delete(slot);
    }

    @Test
    @DisplayName("Agendar reutiliza registro cancelado do mesmo cliente")
    void testScheduleAppointment_ReusesCancelledScheduling() {
        SchedulingDTO dto = new SchedulingDTO(null, "John Doe", SchedulingEnum.CONSULTA, testDate, StatusEnum.PENDENTE);
        AvailableSlot slot = new AvailableSlot(testDate);
        Customer customer = newCustomer();
        customer.setId(1L);
        Scheduling cancelled = scheduling(testDate.minusDays(1), customer, SchedulingEnum.CONSULTA);
        cancelled.setStatus(StatusEnum.CANCELADO);

        when(availableSlotRepository.findBySlotDate(testDate)).thenReturn(slot);
        when(customerRepository.findByName("John Doe")).thenReturn(customer);
        when(repository.findByCustomerId(1L)).thenReturn(List.of(cancelled));
        stubDecrypt();

        schedulingService.scheduleAppointment(dto);

        assertEquals(StatusEnum.PENDENTE, cancelled.getStatus());
        assertEquals(testDate, cancelled.getSchedulingDate());
        verify(repository, times(1)).save(cancelled);
    }

    @Test
    @DisplayName("Agendar lança erro quando o cliente já possui agendamento ativo")
    void testScheduleAppointment_ActiveSchedulingExists() {
        SchedulingDTO dto = new SchedulingDTO(null, "John Doe", SchedulingEnum.CONSULTA, testDate, StatusEnum.PENDENTE);
        Customer customer = newCustomer();
        customer.setId(1L);
        Scheduling pending = scheduling(testDate.minusDays(1), customer, SchedulingEnum.CONSULTA);
        when(availableSlotRepository.findBySlotDate(testDate)).thenReturn(new AvailableSlot(testDate));
        when(customerRepository.findByName("John Doe")).thenReturn(customer);
        when(repository.findByCustomerId(1L)).thenReturn(List.of(pending));

        assertThrows(IllegalArgumentException.class, () -> schedulingService.scheduleAppointment(dto));
        verify(repository, never()).save(any(Scheduling.class));
    }

    @Test
    @DisplayName("Agendar lança erro quando o horário não está disponível")
    void testScheduleAppointment_SlotUnavailable() {
        SchedulingDTO dto = new SchedulingDTO(null, "John Doe", SchedulingEnum.CONSULTA, testDate, StatusEnum.PENDENTE);
        when(availableSlotRepository.findBySlotDate(testDate)).thenReturn(null);

        assertThrows(IllegalArgumentException.class, () -> schedulingService.scheduleAppointment(dto));
    }

    @Test
    @DisplayName("Cliente cancela agendamento, devolve o horário e mantém o registro")
    void testCancelAppointment() {
        Long id = 1L;
        Scheduling scheduling = scheduling(testDate, newCustomer(), SchedulingEnum.CONSULTA);
        when(repository.findById(id)).thenReturn(Optional.of(scheduling));

        schedulingService.cancelAppointment(id);

        assertEquals(StatusEnum.CANCELADO, scheduling.getStatus());
        verify(repository, times(1)).save(scheduling);
        verify(repository, never()).delete(scheduling);

        ArgumentCaptor<AvailableSlot> slotCaptor = ArgumentCaptor.forClass(AvailableSlot.class);
        verify(availableSlotRepository, times(1)).save(slotCaptor.capture());
        assertEquals(testDate, slotCaptor.getValue().getSlotDate());
    }

    @Test
    @DisplayName("Cliente não pode cancelar um agendamento já cancelado")
    void testCancelAppointment_AlreadyCancelled() {
        Scheduling scheduling = scheduling(testDate, newCustomer(), SchedulingEnum.CONSULTA);
        scheduling.setStatus(StatusEnum.CANCELADO);
        when(repository.findById(1L)).thenReturn(Optional.of(scheduling));

        assertThrows(IllegalArgumentException.class, () -> schedulingService.cancelAppointment(1L));
        verify(repository, never()).save(scheduling);
    }

    @Test
    @DisplayName("Cancelar pelo cliente lança erro quando o agendamento não existe")
    void testCancelAppointment_NotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> schedulingService.cancelAppointment(1L));
    }

    private Customer newCustomer() {
        Customer customer = new Customer();
        customer.setEmail("teste@gmail.com");
        customer.setName("John Doe");
        return customer;
    }

    private Customer customerWithScheduling() {
        Customer customer = newCustomer();
        customer.setScheduling(new Scheduling());
        return customer;
    }

    private Scheduling scheduling(LocalDateTime date, Customer customer, SchedulingEnum type) {
        Scheduling scheduling = new Scheduling(date);
        scheduling.setSchedulingType(type);
        scheduling.setStatus(StatusEnum.PENDENTE);
        scheduling.setCustomer(customer);
        return scheduling;
    }

    private void stubFindScheduling(Long id, Scheduling scheduling) {
        when(repository.findById(id)).thenReturn(Optional.of(scheduling));
    }

    private void stubDecrypt() {
        when(encryptionService.decrypt(anyString())).thenAnswer(invocation -> invocation.getArgument(0));
    }

    private void authenticate(Customer customer) {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(customer);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }
}
