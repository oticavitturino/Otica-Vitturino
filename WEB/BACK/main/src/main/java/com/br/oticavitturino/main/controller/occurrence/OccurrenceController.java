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
    public ResponseEntity<?> getOccurrencesByCustomerId(@RequestParam Long customerId) {
        return ResponseEntity.ok(service.getOccurrencesByCustomerId(customerId));
    }

    // Sessão do administrador;
    @GetMapping("/listAll")
    public ResponseEntity<?> listAllOccurrences() {
        return ResponseEntity.ok(service.getAllOccurrences());
    }

    // Sessão de ambos (cliente e administrador);
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOccurrence(@RequestParam Long id) {
        service.deleteOccurrence(id);
        return ResponseEntity.noContent().build();
    }
}