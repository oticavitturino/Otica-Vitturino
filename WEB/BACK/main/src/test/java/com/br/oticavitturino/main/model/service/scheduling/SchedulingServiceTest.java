package com.br.oticavitturino.main.model.service.scheduling;

import com.br.oticavitturino.main.model.domain.customer.Customer;
import com.br.oticavitturino.main.model.domain.scheduling.DateAvailableDTO;
import com.br.oticavitturino.main.model.domain.scheduling.Scheduling;
import com.br.oticavitturino.main.model.domain.scheduling.SchedulingDTO;
import com.br.oticavitturino.main.model.domain.scheduling.StatusEnum;
import com.br.oticavitturino.main.model.repository.customer.CustomerRepository;
import com.br.oticavitturino.main.model.repository.scheduling.SchedulingRepository;

import jakarta.mail.internet.MimeMessage;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.br.oticavitturino.main.model.domain.scheduling.SchedulingEnum;

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
    }

    @Test
    void testAddDateAvailable() {
        DateAvailableDTO dto = new DateAvailableDTO(testDate);
        Scheduling scheduling = new Scheduling(testDate);
        DateAvailableDTO result = schedulingService.addDateAvailable(dto);

        assertNotNull(result);
        assertEquals(testDate, result.date_available());
        verify(repository, times(1)).save(scheduling);
    }

    @Test
    void testDeleteDateAvailable() {
        DateAvailableDTO dto = new DateAvailableDTO(testDate);
        Scheduling scheduling = new Scheduling(testDate);
        when(repository.findBySchedulingDate(testDate)).thenReturn(scheduling);

        schedulingService.deleteDateAvailable(dto);

        verify(repository, times(1)).delete(scheduling);
    }

    @Test
    void testConfirmOrCancelAppointment() {
        Long id = 1L;
        Scheduling scheduling = new Scheduling(testDate);
        scheduling.setStatus(StatusEnum.PENDENTE);
        Customer customer = new Customer();
        customer.setName("John Doe");
        customer.setEmail("john@example.com");
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
    void testGetAllDatesAvailable() {
        Scheduling s1 = new Scheduling(testDate);
        Scheduling s2 = new Scheduling(testDate.plusHours(1));
        when(repository.findAll()).thenReturn(List.of(s1, s2));

        List<DateAvailableDTO> results = schedulingService.getAllDatesAvailable();

        assertEquals(2, results.size());
        verify(repository, times(1)).findAll();
    }

    @Test
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
    void testCancelAppointment() {
        SchedulingDTO dto = new SchedulingDTO(null, SchedulingEnum.CONSULTA, testDate, null);
        Scheduling scheduling = new Scheduling(testDate);
        scheduling.setCustomer(new Customer());

        when(repository.findBySchedulingDate(testDate)).thenReturn(scheduling);

        schedulingService.cancelAppointment(dto);

        assertNull(scheduling.getCustomer());
        assertEquals(StatusEnum.CANCELADO, scheduling.getStatus());
        verify(repository, times(1)).save(scheduling);
    }
}
