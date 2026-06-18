package com.br.oticavitturino.main.model.service.scheduling;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.br.oticavitturino.main.model.domain.customer.Customer;
import com.br.oticavitturino.main.model.domain.scheduling.AvailableSlot;
import com.br.oticavitturino.main.model.domain.scheduling.DateAvailableDTO;
import com.br.oticavitturino.main.model.domain.scheduling.Scheduling;
import com.br.oticavitturino.main.model.domain.scheduling.SchedulingDTO;
import com.br.oticavitturino.main.model.domain.scheduling.StatusEnum;
import com.br.oticavitturino.main.model.repository.customer.CustomerRepository;
import com.br.oticavitturino.main.model.repository.scheduling.AvailableSlotRepository;
import com.br.oticavitturino.main.model.repository.scheduling.SchedulingRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SchedulingService {

    @Autowired
    private SchedulingRepository repository;

    @Autowired
    private AvailableSlotRepository availableSlotRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // Administrador pode adicionar datas disponíveis para agendamento;
    @Transactional
    public List<DateAvailableDTO> addDateAvailable(List<DateAvailableDTO> dateAvailableDTOs) {
        List<AvailableSlot> slots = dateAvailableDTOs.stream()
                .map(dto -> new AvailableSlot(dto.date_available()))
                .collect(Collectors.toList());
        availableSlotRepository.saveAll(slots);
        return slots.stream()
                .map(slot -> new DateAvailableDTO(slot.getSlotDate()))
                .collect(Collectors.toList());
    }

    // Administrador pode excluir datas disponíveis para agendamento;
    @Transactional
    public void deleteDateAvailable(DateAvailableDTO schedulingDTO) {
        Optional.ofNullable(availableSlotRepository.findBySlotDate(schedulingDTO.date_available()))
                .ifPresent(availableSlotRepository::delete);
    }

    // Administrador pode confirmar/cancelar um agendamento;
    @Transactional
    public void confirmOrCancelAppointment(Long SchedulingId, StatusEnum status) {
        Scheduling scheduling = repository.findById(SchedulingId)
                .orElseThrow(() -> new IllegalArgumentException("Scheduling not found in the database!"));

        if (status == StatusEnum.CONCLUIDO) {
            scheduling.setStatus(StatusEnum.CONCLUIDO);
            sendEmailNotification(scheduling.getCustomer().getEmail(), "Consulta Confirmada", scheduling.getCustomer().getName(), "Seu agendamento foi confirmado com sucesso!");
        } else if (status == StatusEnum.CANCELADO) {
            scheduling.setStatus(StatusEnum.CANCELADO);
            sendEmailNotification(scheduling.getCustomer().getEmail(), "Consulta Cancelada", scheduling.getCustomer().getName(), "Seu agendamento foi cancelado.");
        }
        repository.save(scheduling);
    }

    // Administrador pode visualizar todos os agendamentos;
    @Transactional(readOnly = true)
    public List<SchedulingDTO> getAllSchedulings() {
        return repository.findAll().stream()
                .filter(scheduling -> scheduling.getCustomer() != null)
                .map(s -> new SchedulingDTO(
                        s.getCustomer().getName(),
                        s.getSchedulingType(),
                        s.getSchedulingDate(),
                        s.getStatus()))
                .collect(Collectors.toList());
    }

    // Cliente pode visualizar as datas disponíveis para agendamento;
    @Transactional(readOnly = true)
    public List<DateAvailableDTO> getAllDatesAvailable() {
        return availableSlotRepository.findAll().stream()
                .map(slot -> new DateAvailableDTO(slot.getSlotDate()))
                .collect(Collectors.toList());
    }

    // Cliente pode agendar uma consulta;
    @Transactional
    public SchedulingDTO scheduleAppointment(SchedulingDTO schedulingDTO) {
        AvailableSlot slot = Optional.ofNullable(availableSlotRepository.findBySlotDate(schedulingDTO.schedulingDate()))
                .orElseThrow(() -> new IllegalArgumentException("Scheduling date not available!"));

        Customer customer = Optional.ofNullable(customerRepository.findByName(schedulingDTO.name()))
                .orElseThrow(() -> new IllegalArgumentException("Customer not found in the database!"));

        Scheduling scheduling = new Scheduling();
        scheduling.setSchedulingDate(slot.getSlotDate());
        scheduling.setCustomer(customer);
        scheduling.setSchedulingType(schedulingDTO.scheduling_type());
        scheduling.setStatus(StatusEnum.PENDENTE);
        repository.save(scheduling);
        availableSlotRepository.delete(slot);

        return schedulingDTO;
    }

    // Cliente pode cancelar um agendamento;
    @Transactional
    public void cancelAppointment(Long schedulingId) {
        Scheduling scheduling = repository.findById(schedulingId)
                .orElseThrow(() -> new IllegalArgumentException("Scheduling date not found in the database!"));

        scheduling.setStatus(StatusEnum.CANCELADO);
        repository.save(scheduling);
    }

    private void sendEmailNotification(String to, String subject, String username, String message) {
        try {
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
        } catch (MessagingException e) {
            System.err.println("Erro ao tentar enviar e-mail para: " + to + " - Erro: " + e.getMessage());
            e.printStackTrace();
        }
    }
}