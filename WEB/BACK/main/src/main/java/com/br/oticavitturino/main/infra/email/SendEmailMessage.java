package com.br.oticavitturino.main.infra.email;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class SendEmailMessage {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEmailNotification(String to, String subject, String username, String message) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, StandardCharsets.UTF_8.name());

            Context context = new Context();
            context.setVariable("username", username);
            context.setVariable("message", message);
            context.setVariable("subject", subject);

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