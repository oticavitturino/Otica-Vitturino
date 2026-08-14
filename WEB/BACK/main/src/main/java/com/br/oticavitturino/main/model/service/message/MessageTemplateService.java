package com.br.oticavitturino.main.model.service.message;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.MonthDay;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.br.oticavitturino.main.infra.email.SendEmailMessage;
import com.br.oticavitturino.main.infra.security.EncryptionService;
import com.br.oticavitturino.main.model.domain.customer.Customer;
import com.br.oticavitturino.main.model.domain.message.MessageTemplate;
import com.br.oticavitturino.main.model.domain.message.MessageTemplateDTO;
import com.br.oticavitturino.main.model.domain.order.Order;
import com.br.oticavitturino.main.model.repository.customer.CustomerRepository;
import com.br.oticavitturino.main.model.repository.message.MessageTemplateRepository;
import com.br.oticavitturino.main.model.domain.message.TypeMessageEnum;

@Service
public class MessageTemplateService {

    private static final ZoneId ZONE = ZoneId.of("America/Sao_Paulo");
    private static final LocalTime DAILY_SEND_TIME = LocalTime.of(19, 50);

    @Autowired
    private MessageTemplateRepository repository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SendEmailMessage sendMailMessage;

    @Autowired
    private EncryptionService encryptionService;

    @Transactional(readOnly = true)
    public List<MessageTemplateDTO> getAllTemplates() {
        return repository.findAll().stream()
                .map(message -> new MessageTemplateDTO(message.getType(), message.getTemplateText()))
                .collect(Collectors.toList());
    }

    @Transactional
    public MessageTemplateDTO createMessageTemplate(MessageTemplateDTO dto) {
        if (repository.findTemplateByType(dto.type()) != null) {
            throw new IllegalArgumentException("Template already exists for type: " + dto.type());
        }

        MessageTemplate message = new MessageTemplate(dto.type(), dto.templateText());
        repository.save(message);
        return new MessageTemplateDTO(message.getType(), message.getTemplateText());
    }

    @Transactional
    public MessageTemplateDTO updateMessageTemplate(MessageTemplateDTO dto) {
        MessageTemplate message = repository.findTemplateByType(dto.type());
        if (message == null) {
            throw new IllegalArgumentException("Template not found for type: " + dto.type());
        }

        message.setTemplateText(dto.templateText());
        repository.save(message);
        return new MessageTemplateDTO(message.getType(), message.getTemplateText());
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional(readOnly = true)
    public void sendBirthdayMessagesIfScheduleAlreadyPassed() {
        if (!LocalTime.now(ZONE).isBefore(DAILY_SEND_TIME)) {
            sendScheduledMessages(true);
        }
    }

    @Transactional(readOnly = true)
    @Scheduled(cron = "0 * * * * ?", zone = "America/Sao_Paulo")
    public void sendMessage() {
        sendScheduledMessages(false);
    }

    private void sendScheduledMessages(boolean birthdayOnly) {
        MonthDay today = MonthDay.now(ZONE);

        customerRepository.findAll().forEach(customer -> {
            try {
                sendBirthdayNotification(customer, today);

                if (birthdayOnly) {
                    return;
                }

                List<Order> orders = customer.getOrders() == null ? List.of() : customer.getOrders();
                sendReminderNotifications(customer, orders);
            } catch (RuntimeException exception) {
                System.err.println("Falha ao processar mensagens do cliente " + customer.getId() + ": " + exception.getMessage());
                exception.printStackTrace();
            }
        });
    }

    private void sendBirthdayNotification(Customer customer, MonthDay today) {
        if (customer.getBirthDate() == null || !MonthDay.from(customer.getBirthDate()).equals(today)) {
            return;
        }

        String templateText = repository.findTemplateTextByType(TypeMessageEnum.ANIVERSARIO);
        if (templateText != null && !templateText.isEmpty()) {
            sendNotification(customer, "Feliz aniversário", templateText);
            System.out.println("E-mail de aniversário enviado para o cliente " + customer.getId());
        }
    }

    public void sendRealizedOrderNotification(Customer customer) {
        String templateText = repository.findTemplateTextByType(TypeMessageEnum.COMPRA);
        if (templateText != null && !templateText.isEmpty()) {
            sendNotification(customer, "Pedido realizado com sucesso!", templateText);
        }
    }

    private void sendReminderNotifications(Customer customer, List<Order> orders) {
        if (hasCompletedOrderOlderThan(orders, 15)) {
            String templateText = repository.findTemplateTextByType(TypeMessageEnum.LEMBRETE_15_DIAS);
            if (templateText != null && !templateText.isEmpty()) {
                sendNotification(customer, "Lembrete!", templateText);
            }
        }

        if (hasCompletedOrderOlderThan(orders, 30)) {
            String templateText = repository.findTemplateTextByType(TypeMessageEnum.LEMBRETE_30_DIAS);
            if (templateText != null && !templateText.isEmpty()) {
                sendNotification(customer, "Lembrete!", templateText);
            }
        }

        if (hasCompletedOrderOlderThan(orders, 90)) {
            String templateText = repository.findTemplateTextByType(TypeMessageEnum.LEMBRETE_90_DIAS);
            if (templateText != null && !templateText.isEmpty()) {
                sendNotification(customer, "Lembrete!", templateText);
            }
        }

        if (hasCompletedOrderOlderThan(orders, 180)) {
            String templateText = repository.findTemplateTextByType(TypeMessageEnum.LEMBRETE_180_DIAS);
            if (templateText != null && !templateText.isEmpty()) {
                sendNotification(customer, "Lembrete!", templateText);
            }
        }

        if (hasCompletedOrderOlderThan(orders, 365)) {
            String templateText = repository.findTemplateTextByType(TypeMessageEnum.LEMBRETE_365_DIAS);
            if (templateText != null && !templateText.isEmpty()) {
                sendNotification(customer, "Lembrete!", templateText);
            }
        }
    }

    private void sendNotification(Customer customer, String subject, String templateText) {
        sendMailMessage.sendEmailNotification(
                decryptField(customer.getEmail()),
                subject,
                decryptField(customer.getName()),
                templateText);
    }

    private boolean hasCompletedOrderOlderThan(List<Order> orders, int days) {
        return orders.stream().anyMatch(order -> "CONCLUIDO".equals(String.valueOf(order.getOrderStatus())))
                && orders.stream().anyMatch(order -> order.getOrderDate() != null
                        && order.getOrderDate().plusDays(days).isBefore(LocalDateTime.now()));
    }

    private String decryptField(String value) {
        if (value == null || value.isBlank()) {
            return value;
        }

        try {
            return encryptionService.decrypt(value);
        } catch (RuntimeException exception) {
            return value;
        }
    }
}
