package com.br.oticavitturino.main.model.service.scheduling;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.br.oticavitturino.main.model.domain.customer.Customer;
import com.br.oticavitturino.main.model.domain.scheduling.DateAvailableDTO;
import com.br.oticavitturino.main.model.domain.scheduling.Scheduling;
import com.br.oticavitturino.main.model.domain.scheduling.SchedulingDTO;
import com.br.oticavitturino.main.model.domain.scheduling.StatusEnum;
import com.br.oticavitturino.main.model.repository.customer.CustomerRepository;
import com.br.oticavitturino.main.model.repository.scheduling.SchedulingRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class SchedulingService {

    @Autowired
    private SchedulingRepository repository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // Administrador pode adicionar datas disponíveis para agendamento;
    public DateAvailableDTO addDateAvailable(DateAvailableDTO schedulingDTO) {
        Scheduling scheduling = new Scheduling(schedulingDTO.date_available());
        repository.save(scheduling);
        return new DateAvailableDTO(scheduling.getScheduling_date());
    }

    // Administrador pode excluir datas disponíveis para agendamento;
    public void deleteDateAvailable(DateAvailableDTO schedulingDTO) {
        Optional.ofNullable(repository.findBySchedulingDate(schedulingDTO.date_available()))
                .ifPresent(repository::delete);
    }

    // Administrador pode confirmar/cancelar um agendamento;
    public void confirmOrCancelAppointment(Long SchedulingId, StatusEnum status) {
        Scheduling scheduling = Optional.ofNullable(repository.findById(SchedulingId).orElse(null))
                .orElseThrow(() -> new IllegalArgumentException("Scheduling not found in the database!"));

        if (status == StatusEnum.CONCLUIDO) {
            try {
                scheduling.setStatus(StatusEnum.CONCLUIDO);
                sendEmailNotification(scheduling.getCustomer().getEmail(), "Consulta Confirmada", scheduling.getCustomer().getName(), "Seu agendamento foi confirmado com sucesso!");
            } catch (MessagingException e) {
                e.printStackTrace();
            }
        } else if (status == StatusEnum.CANCELADO) {
            try {
                scheduling.setStatus(StatusEnum.CONCLUIDO);
                sendEmailNotification(scheduling.getCustomer().getEmail(), "Consulta Cancelada", scheduling.getCustomer().getName(), "Seu agendamento foi cancelado.");
            } catch (MessagingException e) {
                e.printStackTrace();
            }
        }
        repository.save(scheduling);
    }

    // Cliente pode visualizar as datas disponíveis para agendamento;
    public List<DateAvailableDTO> getAllDatesAvailable() {
        List<Scheduling> schedulings = repository.findAll();
        return schedulings.stream()
                .map(s -> new DateAvailableDTO(s.getScheduling_date()))
                .toList();
    }

    // Cliente pode agendar uma consulta;
    public SchedulingDTO scheduleAppointment(SchedulingDTO schedulingDTO) {
        Scheduling scheduling = Optional.ofNullable(repository.findBySchedulingDate(schedulingDTO.scheduling_date()))
                .orElseThrow(() -> new IllegalArgumentException("Scheduling date not found in the database!"));

        Customer customer = Optional.ofNullable(customerRepository.findByName(schedulingDTO.name()))
                .orElseThrow(() -> new IllegalArgumentException("Customer not found in the database!"));

        scheduling.setCustomer(customer);
        scheduling.setStatus(StatusEnum.PENDENTE);
        repository.save(scheduling);

        return schedulingDTO;
    }

    // Cliente pode cancelar um agendamento;
    public void cancelAppointment(Long schedulingId) {
        Scheduling scheduling = Optional.ofNullable(repository.findById(schedulingId).orElse(null))
                .orElseThrow(() -> new IllegalArgumentException("Scheduling date not found in the database!"));

        scheduling.setCustomer(customerRepository.findById(scheduling.getCustomer().getId()).orElse(null));
        scheduling.setStatus(StatusEnum.CANCELADO);
        repository.save(scheduling);
    }

    private void sendEmailNotification(String to, String subject, String username, String message) throws MessagingException {
         MimeMessage mimeMessage = mailSender.createMimeMessage();
         MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, StandardCharsets.UTF_8.name());

         Context context = new Context();
         context.setVariable("username", username);
         context.setVariable("message", message);

         String emailContent = templateEngine.process("confirmation-email-template.html", context);

         helper.setFrom(fromEmail);
         helper.setTo(to);
         helper.setSubject(subject);
         helper.setText(emailContent, true);
         mailSender.send(mimeMessage);
    }
}