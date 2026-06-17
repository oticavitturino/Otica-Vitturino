package com.br.oticavitturino.main.model.service.occurrence;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.br.oticavitturino.main.model.domain.customer.Customer;
import com.br.oticavitturino.main.model.domain.occurrence.Occurrence;
import com.br.oticavitturino.main.model.domain.occurrence.OccurrenceDTO;
import com.br.oticavitturino.main.model.repository.customer.CustomerRepository;
import com.br.oticavitturino.main.model.repository.occurrence.OccurrenceRepository;

import java.util.List;
import java.util.stream.Collectors;

import com.br.oticavitturino.main.model.domain.occurrence.OccurrenceListDTO;

@Service        
public class OccurrenceService {

    @Autowired
    private OccurrenceRepository occurrenceRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // Cliente pode registrar ocorrêncas ou reclamações;
    public OccurrenceDTO createOccurrence(OccurrenceDTO dto) {
        Customer customer = customerRepository.findByName(dto.customerName());
        if (customer == null) {
            throw new IllegalArgumentException("Customer not found with name: " + dto.customerName());
        }
        Occurrence occurrence = new Occurrence();
        occurrence.setDescription(dto.description());
        occurrence.setSentAt(dto.sentAt());
        occurrence.setCustomerId(customer);
        Occurrence savedOccurrence = occurrenceRepository.save(occurrence);

        return new OccurrenceDTO(
                savedOccurrence.getId(),
                savedOccurrence.getDescription(),
                savedOccurrence.getSentAt(),
                customer.getId(),
                customer.getName()
        );
    }

    // Cliente e Administrador podrão excluir ocorrências ou reclamações (O cliente só pode excluir as suas próprias ocorrências);
    public void deleteOccurrence(Long id) {
        Occurrence occurrence = occurrenceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Occurrence not found with id: " + id));
        occurrenceRepository.delete(occurrence);
    }

    // Cliente pode visualizar suas próprias ocorrências ou reclamações;
    public List<OccurrenceListDTO> getOccurrencesByCustomerId(Long customerId) {
        customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + customerId));
        return occurrenceRepository.findByCustomerId(customerId).stream()
                .map(occurrence -> new OccurrenceListDTO(
                        occurrence.getId(),
                        occurrence.getDescription(),
                        occurrence.getSentAt()
                )).collect(Collectors.toList());
    }

    // Administrador pode visualizar todas as ocorrências;
    public List<OccurrenceDTO> getAllOccurrences() {
        return occurrenceRepository.findAll().stream()
                .map(occurrence -> new OccurrenceDTO(
                        occurrence.getId(),
                        occurrence.getDescription(),
                        occurrence.getSentAt(),
                        occurrence.getCustomerId() != null ? occurrence.getCustomerId().getId() : null,
                        occurrence.getCustomerId() != null ? occurrence.getCustomerId().getName() : null
                 )).collect(Collectors.toList());
    }
}