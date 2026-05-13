package com.br.oticavitturino.main.controller.scheduling;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.br.oticavitturino.main.model.domain.scheduling.DateAvailableDTO;
import com.br.oticavitturino.main.model.service.scheduling.SchedulingService;

@RestController
@RequestMapping("/scheduling")
public class SchedulingController {
    
    @Autowired
    private SchedulingService service;

    // Disponibilizar datas de atendimento;
    @PostMapping("/addDateAvailable")
    public ResponseEntity<Void> addDateAvailable(@RequestBody DateAvailableDTO dateAvailability) {
        service.addDateAvailable(dateAvailability);
        return ResponseEntity.ok().build();
    }

    // Listar datas de atendimento disponíveis;
    @GetMapping("/getAllDatesAvailable")
    public ResponseEntity<List<DateAvailableDTO>> getAllDatesAvailable() {
        return ResponseEntity.ok(service.getAllDatesAvailable());
    }
}