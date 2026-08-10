package com.br.oticavitturino.main.model.service.scheduling;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

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

import jakarta.mail.internet.MimeMessage;

@ExtendWith(MockitoExtension.class)
public class SchedulingServiceTest {

    @Mock
    private SchedulingRepository repository;

    @Mock
    private AvailableSlotRepository availableSlotRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private TemplateEngine templateEngine;

    @InjectMocks
    private SchedulingService schedulingService;

    private LocalDateTime testDate;

    @BeforeEach
    void setUp() {
        testDate = LocalDateTime.now().plusDays(1);

        Scheduling scheduling = new Scheduling();
        scheduling.setSchedulingType(SchedulingEnum.CONSULTA);
        scheduling.setSchedulingDate(testDate);
        scheduling.setStatus(StatusEnum.PENDENTE);
        
        ReflectionTestUtils.setField(schedulingService, "fromEmail", "nao-responda@vitturino.com.br");
    }

    @Test
    @DisplayName("Teste de adicionar data disponível para agendamento")
    void testAddDateAvailable() {
        DateAvailableDTO dto = new DateAvailableDTO(testDate);
        List<DateAvailableDTO> result = schedulingService.addDateAvailable(List.of(dto));

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testDate, result.get(0).date_available());
        verify(availableSlotRepository, times(1)).saveAll(any(List.class));
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
    @DisplayName("Teste de confirmar um agendamento")
    void testConfirmOrCancelAppointment() {
        Customer customer = new Customer();
        customer.setEmail("teste@gmail.com");
        customer.setName("John Doe");

        Long id = 1L;
        Scheduling scheduling = new Scheduling(testDate);
        scheduling.setSchedulingType(SchedulingEnum.CONSULTA);
        scheduling.setStatus(StatusEnum.PENDENTE);
        scheduling.setCustomer(customer);
        
        when(repository.findById(id)).thenReturn(Optional.of(scheduling));
        when(mailSender.createMimeMessage()).thenReturn(mock(MimeMessage.class));
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn("Email Content");

        schedulingService.confirmOrCancelAppointment(id, StatusEnum.CONCLUIDO);

        assertEquals(StatusEnum.CONCLUIDO, scheduling.getStatus());
        verify(repository, times(1)).save(scheduling);
        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("Teste de cancelar um agendamento pelo administrador")
    void testConfirmOrCancelAppointment_Cancel() {
        Customer customer = new Customer();
        customer.setEmail("teste@gmail.com");
        customer.setName("John Doe");

        Long id = 1L;
        Scheduling scheduling = new Scheduling(testDate);
        scheduling.setSchedulingType(SchedulingEnum.CONSULTA);
        scheduling.setStatus(StatusEnum.PENDENTE);
        scheduling.setCustomer(customer);
        
        when(repository.findById(id)).thenReturn(Optional.of(scheduling));
        when(mailSender.createMimeMessage()).thenReturn(mock(MimeMessage.class));
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn("Email Content");

        schedulingService.confirmOrCancelAppointment(id, StatusEnum.CANCELADO);

        assertEquals(StatusEnum.CANCELADO, scheduling.getStatus());
        verify(repository, times(1)).save(scheduling);
        verify(mailSender, times(1)).send(any(MimeMessage.class));
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
        Customer customer = new Customer();
        customer.setName("John Doe");
        customer.setPoints(0);

        when(availableSlotRepository.findBySlotDate(testDate)).thenReturn(slot);
        when(customerRepository.findByName("John Doe")).thenReturn(customer);

        SchedulingDTO result = schedulingService.scheduleAppointment(dto);

        assertNotNull(result);
        assertEquals(30, customer.getPoints());
        verify(customerRepository, times(1)).save(customer);
        verify(repository, times(1)).save(any(Scheduling.class));
        verify(availableSlotRepository, times(1)).delete(slot);
    }

    @Test
    @DisplayName("Teste de cancelar um agendamento")
    void testCancelAppointment() {
        Long id = 1L;
        Customer customer = new Customer();
        customer.setPoints(30);
        Scheduling scheduling = new Scheduling(testDate);
        scheduling.setSchedulingType(SchedulingEnum.CONSULTA);
        scheduling.setCustomer(customer);

        when(repository.findById(id)).thenReturn(Optional.of(scheduling));

        schedulingService.cancelAppointment(id);

        assertEquals(StatusEnum.CANCELADO, scheduling.getStatus());
        assertEquals(0, customer.getPoints());
        verify(customerRepository, times(1)).save(customer);
        verify(repository, times(1)).save(scheduling);
    }
}