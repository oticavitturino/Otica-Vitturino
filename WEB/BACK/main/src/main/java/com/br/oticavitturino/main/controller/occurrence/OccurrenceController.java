package com.br.oticavitturino.main.controller.occurrence;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.br.oticavitturino.main.model.domain.occurrence.OccurrenceDTO;
import com.br.oticavitturino.main.model.domain.occurrence.OccurrenceRespondDTO;
import com.br.oticavitturino.main.model.service.occurrence.OccurrenceService;

@RestController
@RequestMapping("/occurrences")
public class OccurrenceController {

    @Autowired
    private OccurrenceService service;

    // Sessão do cliente;
    @PostMapping("/register")
    public ResponseEntity<OccurrenceDTO> registerOccurrence(@RequestBody OccurrenceDTO dto) {
        OccurrenceDTO createdOccurrence = service.createOccurrence(dto);
        return ResponseEntity.ok(createdOccurrence);
    }

    @GetMapping("/occurrenceCustomer")
    public ResponseEntity<?> getOccurrencesByCustomerId(@RequestParam(required = false) Long customerId) {
        return ResponseEntity.ok(service.getOccurrencesByCustomerId(customerId));
    }

    // Sessão do administrador;
    @GetMapping("/listAll")
    public ResponseEntity<?> listAllOccurrences() {
        return ResponseEntity.ok(service.getAllOccurrences());
    }

    @PostMapping("/respond")
    public ResponseEntity<String> respondToOccurrence(@RequestBody OccurrenceRespondDTO dto) {
        service.respondToOccurrence(dto.occurrenceId(), dto.message());
        return ResponseEntity.ok("Response sent successfully!");
    }

    // Sessão de ambos (cliente e administrador);
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteOccurrence(@RequestParam Long id) {
        service.deleteOccurrence(id);
        return ResponseEntity.noContent().build();
    }
}