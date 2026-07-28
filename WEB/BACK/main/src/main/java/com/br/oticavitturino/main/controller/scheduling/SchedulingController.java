package com.br.oticavitturino.main.controller.scheduling;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.br.oticavitturino.main.model.domain.scheduling.DateAvailableDTO;
import com.br.oticavitturino.main.model.domain.scheduling.SchedulingDTO;
import com.br.oticavitturino.main.model.domain.scheduling.StatusEnum;
import com.br.oticavitturino.main.model.service.scheduling.SchedulingService;

@RestController
@RequestMapping("/scheduling")
public class SchedulingController {
    
    @Autowired
    private SchedulingService service;

    // Sessão do Administrador;
    @PostMapping("/addDateAvailable")
    public ResponseEntity<Void> addDateAvailable(@RequestBody List<DateAvailableDTO> dateAvailability) {
        service.addDateAvailable(dateAvailability);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deleteDateAvailable")
    public ResponseEntity<String> deleteDateAvailable(@RequestBody DateAvailableDTO dateAvailability) {
        service.deleteDateAvailable(dateAvailability);
        return ResponseEntity.ok("Date available deleted successfully!");
    }

    @PostMapping("/confirmOrCancelAppointment")
    public ResponseEntity<String> confirmOrCancelAppointment(@RequestParam Long schedulingId, @RequestParam StatusEnum status) {
        service.confirmOrCancelAppointment(schedulingId, status);
        return ResponseEntity.ok("Scheduling status updated successfully!");
    }

    @GetMapping("/getAllSchedulings")
    public ResponseEntity<List<SchedulingDTO>> getAllSchedulings() {
        return ResponseEntity.ok(service.getAllSchedulings());
    }

    @GetMapping("/mySchedulings")
    public ResponseEntity<List<SchedulingDTO>> getMySchedulings() {
        return ResponseEntity.ok(service.getMySchedulings());
    }

    // Sessão do Cliente;
    @GetMapping("/getAllDatesAvailable")
    public ResponseEntity<List<DateAvailableDTO>> getAllDatesAvailable() {
        return ResponseEntity.ok(service.getAllDatesAvailable());
    }

    @PostMapping("/scheduleAppointment")
    public ResponseEntity<Void> scheduleAppointment(@RequestBody SchedulingDTO schedulingDTO) {
        service.scheduleAppointment(schedulingDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/cancelAppointment")
    public ResponseEntity<String> cancelAppointment(@RequestBody Long schedulingId) {
        service.cancelAppointment(schedulingId);
        return ResponseEntity.ok("Scheduling cancelled successfully!");
    }
}