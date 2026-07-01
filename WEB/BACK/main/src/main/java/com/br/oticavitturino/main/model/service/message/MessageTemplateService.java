package com.br.oticavitturino.main.model.service.message;

import java.time.MonthDay;

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

@Service
public class MessageTemplateService {

    @Autowired
    private MessageTemplateRepository repository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SendEmailMessage sendMailMessage;

    @Transactional
    public MessageTemplateDTO createMessageTemplate(MessageTemplateDTO dto) {
        MessageTemplate message = new MessageTemplate(dto.type(), dto.templateText());
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
        });
    }
}