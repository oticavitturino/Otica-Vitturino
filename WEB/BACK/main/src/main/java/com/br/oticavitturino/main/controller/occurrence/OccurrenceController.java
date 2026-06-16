package com.br.oticavitturino.main.controller.occurrence;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

import com.br.oticavitturino.main.model.service.occurrence.OccurrenceService;
import com.br.oticavitturino.main.model.domain.occurrence.OccurrenceNoCustomerDTO;

@Controller
@RequestMapping("/occurrences")
public class OccurrenceController {

    @Autowired
    private OccurrenceService service;

    // Sessão do cliente;
    @PostMapping("/register")
    public ResponseEntity<OccurrenceNoCustomerDTO> registerOccurrence(@RequestBody OccurrenceNoCustomerDTO dto) {
        OccurrenceNoCustomerDTO createdOccurrence = service.createOccurrence(dto);
        return ResponseEntity.ok(createdOccurrence);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOccurrence(@PathVariable Long id) {
        service.deleteOccurrence(id);
        return ResponseEntity.noContent().build();
    }

    // Sessão do administrador;
    @GetMapping("/listAll")
    public ResponseEntity<?> listAllOccurrences() {
        return ResponseEntity.ok(service.getAllOccurrences());
    }
}