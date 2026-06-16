package com.br.oticavitturino.main.model.service.occurrence;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.br.oticavitturino.main.model.domain.occurrence.Occurrence;
import com.br.oticavitturino.main.model.domain.occurrence.OccurrenceNoCustomerDTO;
import com.br.oticavitturino.main.model.domain.occurrence.OccurrenceDTO;
import com.br.oticavitturino.main.model.repository.occurrence.OccurrenceRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OccurrenceService {

    @Autowired
    private OccurrenceRepository repository;

    // Cliente pode registrar ocorrêncas ou reclamações;
    public OccurrenceNoCustomerDTO createOccurrence(OccurrenceNoCustomerDTO dto) {        
        Occurrence occurrence = new Occurrence(dto.description(), dto.sentAt());
        Occurrence savedOccurrence = repository.save(occurrence);
        return new OccurrenceNoCustomerDTO(savedOccurrence.getId(), savedOccurrence.getDescription(), savedOccurrence.getSentAt());
    }

    // Cliente e Administrador podrão excluir ocorrências ou reclamações (O cliente só pode excluir as suas próprias ocorrências);
    public void deleteOccurrence(Long id) {
        Occurrence occurrence = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Occurrence not found with id: " + id));
        repository.delete(occurrence);
    }

    // Administrador pode visualizar todas as ocorrências;
    public List<OccurrenceDTO> getAllOccurrences() {
        List<Occurrence> occurrences = repository.findAll();
        return occurrences.stream()
                .map(occurrence -> new OccurrenceDTO(
                        occurrence.getId(),
                        occurrence.getDescription(),
                        occurrence.getSentAt(),
                        occurrence.getCustomerOccurrence() != null ? occurrence.getCustomerOccurrence().getId() : null
                 )).collect(Collectors.toList());
    }
}