package com.br.oticavitturino.main.model.service.message;

import java.time.MonthDay;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.br.oticavitturino.main.infra.email.SendEmailMessage;
import com.br.oticavitturino.main.model.domain.message.MessageTemplate;
import com.br.oticavitturino.main.model.domain.message.MessageTemplateDTO;
import com.br.oticavitturino.main.model.repository.customer.CustomerRepository;
import com.br.oticavitturino.main.model.repository.message.MessageTemplateRepository;
import com.br.oticavitturino.main.model.domain.message.TypeMessageEnum;

import java.time.LocalDateTime;
@Service
public class MessageTemplateService {

    @Autowired
    private MessageTemplateRepository repository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SendEmailMessage sendMailMessage;

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

    @Transactional(readOnly = true)
    @Scheduled(cron = "0 0 8 * * ?") // Executa todo dia às 08:00
    public void sendMessage() {
        MonthDay today = MonthDay.now();

        customerRepository.findAll().forEach(customer -> {

            // Mensagem de Aniversário
            if (customer.getBirthDate() != null && MonthDay.from(customer.getBirthDate()).equals(today)) {
                TypeMessageEnum type = TypeMessageEnum.ANIVERSARIO;
                String templateText = repository.findTemplateTextByType(type);
                if (templateText != null && !templateText.isEmpty()) {
                    String subject = "Feliz aniversário";
                    sendMailMessage.sendEmailNotification(customer.getEmail(), subject, customer.getName(), templateText);
                }
            }

            // Mensagem de Compra
            if (customer.getOrders().stream().anyMatch(order -> "REALIZADO".equals(String.valueOf(order.getOrderStatus())))) {
                TypeMessageEnum type = TypeMessageEnum.COMPRA;
                String templateText = repository.findTemplateTextByType(type);
                if (templateText != null && !templateText.isEmpty()) {
                    String subject = "Compra realizada com sucesso!";
                    sendMailMessage.sendEmailNotification(customer.getEmail(), subject, customer.getName(), templateText);
                }
            }

            // Mesagem de Lembrete
            // 15 dias;
            if (customer.getOrders().stream().anyMatch(order -> "CONCLUÍDO".equals(String.valueOf(order.getOrderStatus()))) && customer.getOrders().stream().anyMatch(order -> order.getOrderDate().plusDays(15).isBefore(LocalDateTime.now()))) {
                TypeMessageEnum type = TypeMessageEnum.LEMBRETE_15_DIAS;
                String templateText = repository.findTemplateTextByType(type);
                if (templateText != null && !templateText.isEmpty()) {
                    String subject = "Lembrete!";
                    sendMailMessage.sendEmailNotification(customer.getEmail(), subject, customer.getName(), templateText);
                }
            }

            // 30 dias;
            if (customer.getOrders().stream().anyMatch(order -> "CONCLUÍDO".equals(String.valueOf(order.getOrderStatus()))) && customer.getOrders().stream().anyMatch(order -> order.getOrderDate().plusDays(30).isBefore(LocalDateTime.now()))) {
                TypeMessageEnum type = TypeMessageEnum.LEMBRETE_30_DIAS;
                String templateText = repository.findTemplateTextByType(type);
                if (templateText != null && !templateText.isEmpty()) {
                    String subject = "Lembrete!";
                    sendMailMessage.sendEmailNotification(customer.getEmail(), subject, customer.getName(), templateText);
                }
            }

            // 3 meses;
            if (customer.getOrders().stream().anyMatch(order -> "CONCLUÍDO".equals(String.valueOf(order.getOrderStatus()))) && customer.getOrders().stream().anyMatch(order -> order.getOrderDate().plusDays(90).isBefore(LocalDateTime.now()))) {
                TypeMessageEnum type = TypeMessageEnum.LEMBRETE_90_DIAS;
                String templateText = repository.findTemplateTextByType(type);
                if (templateText != null && !templateText.isEmpty()) {
                    String subject = "Lembrete!";
                    sendMailMessage.sendEmailNotification(customer.getEmail(), subject, customer.getName(), templateText);
                }
            }

            // 6 meses;
            if (customer.getOrders().stream().anyMatch(order -> "CONCLUÍDO".equals(String.valueOf(order.getOrderStatus()))) && customer.getOrders().stream().anyMatch(order -> order.getOrderDate().plusDays(180).isBefore(LocalDateTime.now()))) {
                TypeMessageEnum type = TypeMessageEnum.LEMBRETE_180_DIAS;
                String templateText = repository.findTemplateTextByType(type);
                if (templateText != null && !templateText.isEmpty()) {
                    String subject = "Lembrete!";
                    sendMailMessage.sendEmailNotification(customer.getEmail(), subject, customer.getName(), templateText);
                }
            }

            // 1 ano;
            if (customer.getOrders().stream().anyMatch(order -> "CONCLUÍDO".equals(String.valueOf(order.getOrderStatus()))) && customer.getOrders().stream().anyMatch(order -> order.getOrderDate().plusDays(365).isBefore(LocalDateTime.now()))) {
                TypeMessageEnum type = TypeMessageEnum.LEMBRETE_365_DIAS;
                String templateText = repository.findTemplateTextByType(type);
                if (templateText != null && !templateText.isEmpty()) {
                    String subject = "Lembrete!";
                    sendMailMessage.sendEmailNotification(customer.getEmail(), subject, customer.getName(), templateText);
                }
            }
        });
    }
}