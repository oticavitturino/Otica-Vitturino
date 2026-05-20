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
import com.br.oticavitturino.main.model.domain.scheduling.DateAvailableDTO;
import com.br.oticavitturino.main.model.domain.scheduling.Scheduling;
import com.br.oticavitturino.main.model.domain.scheduling.SchedulingDTO;
import com.br.oticavitturino.main.model.domain.scheduling.SchedulingEnum;
import com.br.oticavitturino.main.model.domain.scheduling.StatusEnum;
import com.br.oticavitturino.main.model.repository.customer.CustomerRepository;
import com.br.oticavitturino.main.model.repository.scheduling.SchedulingRepository;

import jakarta.mail.internet.MimeMessage;

@ExtendWith(MockitoExtension.class)
public class SchedulingServiceTest {

    @Mock
    private SchedulingRepository repository;

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
        scheduling.setScheduling_type(SchedulingEnum.CONSULTA);
        scheduling.setScheduling_date(testDate);
        scheduling.setStatus(StatusEnum.PENDENTE);
        
        ReflectionTestUtils.setField(schedulingService, "fromEmail", "nao-responda@vitturino.com.br");
    }

    @Test
    @DisplayName("Teste de adicionar data disponível para agendamento")
    void testAddDateAvailable() {
        DateAvailableDTO dto = new DateAvailableDTO(testDate);
        DateAvailableDTO result = schedulingService.addDateAvailable(dto);

        assertNotNull(result);
        assertEquals(testDate, result.date_available());
        verify(repository, times(1)).save(any(Scheduling.class));
    }

    @Test
    @DisplayName("Teste de excluir data disponível para agendamento")
    void testDeleteDateAvailable() {
        DateAvailableDTO dto = new DateAvailableDTO(testDate);
        Scheduling scheduling = new Scheduling(testDate);
        when(repository.findBySchedulingDate(testDate)).thenReturn(scheduling);

        schedulingService.deleteDateAvailable(dto);

        verify(repository, times(1)).delete(scheduling);
    }

    @Test
    @DisplayName("Teste de confirmar um agendamento")
    void testConfirmOrCancelAppointment() {
        Customer customer = new Customer();
        customer.setEmail("teste@gmail.com");
        customer.setName("John Doe");

        Long id = 1L;
        Scheduling scheduling = new Scheduling(testDate);
        scheduling.setScheduling_type(SchedulingEnum.CONSULTA);
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
        scheduling.setScheduling_type(SchedulingEnum.CONSULTA);
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
        Scheduling s1 = new Scheduling(testDate);
        Scheduling s2 = new Scheduling(testDate.plusHours(1));
        when(repository.findAll()).thenReturn(List.of(s1, s2));

        List<DateAvailableDTO> results = schedulingService.getAllDatesAvailable();

        assertEquals(2, results.size());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Teste de agendar um atendimento")
    void testScheduleAppointment() {
        SchedulingDTO dto = new SchedulingDTO("John Doe", SchedulingEnum.CONSULTA, testDate, StatusEnum.PENDENTE);
        Scheduling scheduling = new Scheduling(testDate);
        Customer customer = new Customer();
        customer.setName("John Doe");

        when(repository.findBySchedulingDate(testDate)).thenReturn(scheduling);
        when(customerRepository.findByName("John Doe")).thenReturn(customer);

        SchedulingDTO result = schedulingService.scheduleAppointment(dto);

        assertEquals(customer, scheduling.getCustomer());
        assertEquals(StatusEnum.PENDENTE, scheduling.getStatus());
        verify(repository, times(1)).save(scheduling);
    }

    @Test
    @DisplayName("Teste de cancelar um agendamento")
    void testCancelAppointment() {
        Long id = 1L;
        Scheduling scheduling = new Scheduling(testDate);
        scheduling.setCustomer(new Customer());

        when(repository.findById(id)).thenReturn(Optional.of(scheduling));

        schedulingService.cancelAppointment(id);

        assertNull(scheduling.getCustomer());
        assertEquals(StatusEnum.CANCELADO, scheduling.getStatus());
        verify(repository, times(1)).save(scheduling);
    }
}