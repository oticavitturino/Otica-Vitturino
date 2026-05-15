package com.br.oticavitturino.main.model.service.scheduling;

// import java.io.IOException;
// import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.br.oticavitturino.main.model.domain.customer.Customer;
import com.br.oticavitturino.main.model.domain.scheduling.DateAvailableDTO;
import com.br.oticavitturino.main.model.domain.scheduling.Scheduling;
import com.br.oticavitturino.main.model.domain.scheduling.SchedulingDTO;
import com.br.oticavitturino.main.model.domain.scheduling.StatusEnum;
import com.br.oticavitturino.main.model.repository.customer.CustomerRepository;
import com.br.oticavitturino.main.model.repository.scheduling.SchedulingRepository;

// import jakarta.mail.MessagingException;
// import jakarta.mail.internet.MimeMessage;
// import org.springframework.beans.factory.annotation.Value;

@Service
public class SchedulingService {

    @Autowired
    private SchedulingRepository repository;

     @Autowired
     private CustomerRepository customerRepository;

    // @Autowired
    // private JavaMailSender mailSender;

    // @Autowired
    // private ResourceLoader resourceLoader;

    // @Value("${spring.mail.username}")
    // private String fromEmail;

    // Administrador pode adicionar/excluir datas disponíveis para agendamento;
    public DateAvailableDTO addDateAvailable(DateAvailableDTO schedulingDTO) {
        Scheduling scheduling = new Scheduling(schedulingDTO.date_available());
        repository.save(scheduling);
        return new DateAvailableDTO(scheduling.getScheduling_date());
    }

    public void deleteDateAvailable(DateAvailableDTO schedulingDTO) {
        Scheduling scheduling = repository.findBySchedulingDate(schedulingDTO.date_available());
        if (scheduling != null) {
            repository.delete(scheduling);
        }
    }

    // Cliente pode visualizar as datas disponíveis para agendamento/agendar uma consulta/cancelar um agendamento;
    public List<DateAvailableDTO> getAllDatesAvailable() {
        List<Scheduling> schedulings = repository.findAll();
        return schedulings.stream()
                .map(s -> new DateAvailableDTO(s.getScheduling_date()))
                .toList();
    }

    public SchedulingDTO scheduleAppointment(SchedulingDTO schedulingDTO) {
        Scheduling scheduling = repository.findBySchedulingDate(schedulingDTO.scheduling_date());
        if (scheduling != null) {
            Customer customer = customerRepository.findByName(schedulingDTO.name());
            if (customer == null) {
                throw new IllegalArgumentException("Customer not found in the database!");
            }
            scheduling.setCustomer(customer);
            scheduling.setStatus(StatusEnum.PENDENTE);
            repository.save(scheduling);
        } else {
            throw new IllegalArgumentException("Scheduling date not found in the database!");
        }
        return schedulingDTO;
    }

    public void cancelAppointment(SchedulingDTO schedulingDTO) {
        Scheduling scheduling = repository.findBySchedulingDate(schedulingDTO.scheduling_date());
        if (scheduling != null) {
            scheduling.setCustomer(null);
            scheduling.setStatus(StatusEnum.CANCELADO);
            repository.save(scheduling);
        } else {
            throw new IllegalArgumentException("Scheduling date not found in the database!");
        }
    }

    // private void sendEmailNotification(String to, String subject, String username) throws MessagingException, IOException {

    //     MimeMessage message = mailSender.createMimeMessage();
    //     MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

    //     Resource resource = resourceLoader.getResource("classpath:templates/email_template.html");
    //     String emailContent = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        
    //     emailContent = emailContent.replace("{{username}}", username);

    //     helper.setFrom(fromEmail);
    //     helper.setTo(to);
    //     helper.setSubject(subject);
    //     helper.setText(emailContent, true);
    //     mailSender.send(message);
    // }
}