package com.br.oticavitturino.main.model.service.message;

import com.br.oticavitturino.main.infra.email.SendEmailMessage;
import com.br.oticavitturino.main.model.domain.customer.Customer;
import com.br.oticavitturino.main.model.domain.message.MessageTemplate;
import com.br.oticavitturino.main.model.domain.message.MessageTemplateDTO;
import com.br.oticavitturino.main.model.domain.message.TypeMessageEnum;
import com.br.oticavitturino.main.model.domain.order.Order;
import com.br.oticavitturino.main.model.domain.order.OrderStatusEnum;
import com.br.oticavitturino.main.model.repository.customer.CustomerRepository;
import com.br.oticavitturino.main.model.repository.message.MessageTemplateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MessageTemplateServiceTest {

    @Mock
    private MessageTemplateRepository repository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private SendEmailMessage sendMailMessage;

    @InjectMocks
    private MessageTemplateService service;

    private MessageTemplateDTO messageTemplateDTO;
    private MessageTemplate messageTemplate;
    private Customer birthdayCustomer;
    private Customer purchaseCustomer;
    private Customer regularCustomer;

    @BeforeEach
    void setUp() {
        messageTemplateDTO = new MessageTemplateDTO(TypeMessageEnum.ANIVERSARIO, "Feliz aniversário, {name}!");
        messageTemplate = new MessageTemplate(TypeMessageEnum.ANIVERSARIO, "Feliz aniversário, {name}!");

        birthdayCustomer = new Customer();
        birthdayCustomer.setId(1L);
        birthdayCustomer.setName("João");
        birthdayCustomer.setEmail("joao@example.com");
        birthdayCustomer.setBirthDate(LocalDate.now()); // Hoje é o aniversário
        birthdayCustomer.setOrders(Collections.emptyList());

        Order completedOrder = new Order();
        completedOrder.setOrderStatus(OrderStatusEnum.REALIZADO);
        purchaseCustomer = new Customer();
        purchaseCustomer.setId(2L);
        purchaseCustomer.setName("Maria");
        purchaseCustomer.setEmail("maria@example.com");
        purchaseCustomer.setBirthDate(LocalDate.now().minusYears(20).minusDays(1)); // Garante que hoje não é o aniversário
        purchaseCustomer.setOrders(Collections.singletonList(completedOrder));

        regularCustomer = new Customer();
        regularCustomer.setId(3L);
        regularCustomer.setName("Pedro");
        regularCustomer.setEmail("pedro@example.com");
        regularCustomer.setBirthDate(LocalDate.now().minusYears(30).minusDays(1)); // Hoje não é o aniversário
        regularCustomer.setOrders(Collections.emptyList());
    }

    @Test
    void testCreateMessageTemplate() {
        when(repository.save(any(MessageTemplate.class))).thenReturn(messageTemplate);

        MessageTemplateDTO result = service.createMessageTemplate(messageTemplateDTO);

        assertEquals(messageTemplateDTO.type(), result.type());
        assertEquals(messageTemplateDTO.templateText(), result.templateText());
        verify(repository, times(1)).save(any(MessageTemplate.class));
    }

    @Test
    void testSendMessage() {
        List<Customer> customers = Arrays.asList(birthdayCustomer, purchaseCustomer, regularCustomer);
        when(customerRepository.findAll()).thenReturn(customers);

        // Mock aniversário template
        when(repository.findTemplateTextByType(TypeMessageEnum.ANIVERSARIO)).thenReturn("Feliz aniversário, {name}!");
        // Mock compra template
        when(repository.findTemplateTextByType(TypeMessageEnum.COMPRA)).thenReturn("Sua compra foi um sucesso, {name}!");

        service.sendMessage();

        // Verificar que a mensagem de aniversário foi enviada para o cliente com aniversário hoje
        verify(sendMailMessage, times(1)).sendEmailNotification(
                eq("joao@example.com"),
                eq("Feliz aniversário"),
                eq("João"),
                eq("Feliz aniversário, {name}!")
        );

        // Verificar que a mensagem de compra foi enviada para o cliente com pedido realizado
        verify(sendMailMessage, times(1)).sendEmailNotification(
                eq("maria@example.com"),
                eq("Compra realizada com sucesso!"),
                eq("Maria"),
                eq("Sua compra foi um sucesso, {name}!")
        );

        // Verificar que nenhum e-mail foi enviado para o cliente regular
        verify(sendMailMessage, never()).sendEmailNotification(
                eq("pedro@example.com"), anyString(), anyString(), anyString()
        );

        // Verificar as chamadas aos métodos do repositório
        verify(repository, times(1)).findTemplateTextByType(TypeMessageEnum.ANIVERSARIO);
        verify(repository, times(1)).findTemplateTextByType(TypeMessageEnum.COMPRA);
        verify(customerRepository, times(1)).findAll();
    }

    @Test
    void testSendMessage_noBirthdayTemplate() {
        List<Customer> customers = Collections.singletonList(birthdayCustomer);
        when(customerRepository.findAll()).thenReturn(customers);
        when(repository.findTemplateTextByType(TypeMessageEnum.ANIVERSARIO)).thenReturn(null);

        service.sendMessage();

        verify(sendMailMessage, never()).sendEmailNotification(anyString(), anyString(), anyString(), anyString());
    }

    @Test
    void testSendMessage_noPurchaseTemplate() {
        List<Customer> customers = Collections.singletonList(purchaseCustomer);
        when(customerRepository.findAll()).thenReturn(customers);
        // A busca por template de aniversário não ocorre, pois não é o aniversário do cliente.
        when(repository.findTemplateTextByType(TypeMessageEnum.COMPRA)).thenReturn("");

        service.sendMessage();

        verify(sendMailMessage, never()).sendEmailNotification(anyString(), anyString(), anyString(), anyString());
    }
}
