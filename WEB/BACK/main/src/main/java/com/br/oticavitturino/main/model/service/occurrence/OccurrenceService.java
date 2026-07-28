package com.br.oticavitturino.main.model.service.occurrence;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.br.oticavitturino.main.infra.email.SendEmailMessage;
import com.br.oticavitturino.main.infra.security.EncryptionService;

import com.br.oticavitturino.main.model.domain.customer.Customer;
import com.br.oticavitturino.main.model.domain.occurrence.Occurrence;
import com.br.oticavitturino.main.model.domain.occurrence.OccurrenceDTO;
import com.br.oticavitturino.main.model.repository.customer.CustomerRepository;
import com.br.oticavitturino.main.model.repository.occurrence.OccurrenceRepository;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

import com.br.oticavitturino.main.model.domain.occurrence.OccurrenceListDTO;

@Service        
public class OccurrenceService {

    @Autowired
    private OccurrenceRepository occurrenceRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EncryptionService encryptionService;

    @Autowired
    private SendEmailMessage sendMailMessage;

    // Cliente pode registrar ocorrêncas ou reclamações;
    @Transactional
    public OccurrenceDTO createOccurrence(OccurrenceDTO dto) {
        Customer customer = resolveCustomer(dto);
        Occurrence occurrence = new Occurrence();
        occurrence.setDescription(dto.description());
        occurrence.setSentAt(dto.sentAt());
        occurrence.setCategory(dto.category());
        occurrence.setCustomer(customer);
        Occurrence savedOccurrence = occurrenceRepository.save(occurrence);

        return new OccurrenceDTO(
                savedOccurrence.getId(),
                savedOccurrence.getDescription(),
                savedOccurrence.getSentAt(),
                savedOccurrence.getCategory(),
                customer.getId(),
                decryptField(customer.getName())
        );
    }

    // Cliente e Administrador podrão excluir ocorrências ou reclamações (O cliente só pode excluir as suas próprias ocorrências);
    @Transactional
    public void deleteOccurrence(Long id) {
        Occurrence occurrence = occurrenceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Occurrence not found with id: " + id));
        occurrenceRepository.delete(occurrence);
    }

    // Cliente pode visualizar suas próprias ocorrências ou reclamações;
    @Transactional(readOnly = true)
    public List<OccurrenceListDTO> getOccurrencesByCustomerId(Long customerId) {
        Customer authenticatedCustomer = resolveAuthenticatedCustomer();
        final Long resolvedCustomerId;

        if (authenticatedCustomer != null) {
            resolvedCustomerId = authenticatedCustomer.getId();
        } else if (customerId == null) {
            throw new IllegalArgumentException("Customer id is required");
        } else {
            customerRepository.findById(customerId)
                    .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + customerId));
            resolvedCustomerId = customerId;
        }

        return occurrenceRepository.findByCustomerId(resolvedCustomerId).stream()
                .map(occurrence -> new OccurrenceListDTO(
                        occurrence.getId(),
                        occurrence.getDescription(),
                        occurrence.getSentAt(),
                        occurrence.getCategory()
                )).collect(Collectors.toList());
    }

    // Administrador pode responder ocorrências ou reclamações por e-mail;
    @Transactional
    public void respondToOccurrence(Long id, String message) {
        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException("Response message must not be empty");
        }

        Occurrence occurrence = occurrenceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Occurrence not found with id: " + id));

        Customer customer = occurrence.getCustomer();
        if (customer == null) {
            throw new IllegalArgumentException("Customer not found for occurrence");
        }

        String customerEmail = decryptField(customer.getEmail());
        String customerName = decryptField(customer.getName());
        String subject = buildResponseSubject(occurrence.getCategory());

        sendMailMessage.sendEmailNotification(customerEmail, subject, customerName, message.trim());
    }

    // Administrador pode visualizar todas as ocorrências;
    @Transactional(readOnly = true)
    public List<OccurrenceDTO> getAllOccurrences() {
        return occurrenceRepository.findAll().stream()
                .map(occurrence -> new OccurrenceDTO(
                        occurrence.getId(),
                        occurrence.getDescription(),
                        occurrence.getSentAt(),
                        occurrence.getCategory(),
                        occurrence.getCustomer() != null ? occurrence.getCustomer().getId() : null,
                        occurrence.getCustomer() != null
                                ? decryptField(occurrence.getCustomer().getName())
                                : null
                 )).collect(Collectors.toList());
    }

    private Customer resolveCustomer(OccurrenceDTO dto) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Customer customer) {
            return customer;
        }

        if (dto.customerName() != null && !dto.customerName().isBlank()) {
            Customer customer = customerRepository.findByName(dto.customerName());
            if (customer != null) {
                return customer;
            }
        }

        if (dto.customerId() != null) {
            return customerRepository.findById(dto.customerId())
                    .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + dto.customerId()));
        }

        throw new IllegalArgumentException("Customer not found for occurrence registration");
    }

    private Customer resolveAuthenticatedCustomer() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Customer customer) {
            return customer;
        }
        return null;
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

    private String buildResponseSubject(String category) {
        if (category == null || category.isBlank()) {
            return "Resposta à sua ocorrência";
        }

        String normalized = category.trim().toLowerCase();
        if (normalized.contains("reclam")) {
            return "Resposta à sua reclamação";
        }

        return "Resposta à sua ocorrência";
    }
}