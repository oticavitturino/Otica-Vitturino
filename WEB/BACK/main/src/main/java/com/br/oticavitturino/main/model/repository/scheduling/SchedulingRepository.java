package com.br.oticavitturino.main.model.repository.scheduling;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.oticavitturino.main.model.domain.scheduling.Scheduling;
import com.br.oticavitturino.main.model.domain.scheduling.StatusEnum;

public interface SchedulingRepository extends JpaRepository<Scheduling, Long> {
    Scheduling findBySchedulingDate(LocalDateTime schedulingDateAvailable);

    List<Scheduling> findByCustomerId(Long customerId);

    List<Scheduling> findByStatusAndSchedulingDateLessThanEqual(StatusEnum status, LocalDateTime date);
}