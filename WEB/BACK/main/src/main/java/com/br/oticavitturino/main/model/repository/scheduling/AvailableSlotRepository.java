package com.br.oticavitturino.main.model.repository.scheduling;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.oticavitturino.main.model.domain.scheduling.AvailableSlot;

public interface AvailableSlotRepository extends JpaRepository<AvailableSlot, Long> {
    AvailableSlot findBySlotDate(LocalDateTime slotDate);
}
