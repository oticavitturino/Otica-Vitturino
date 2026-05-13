package com.br.oticavitturino.main.model.repository.scheduling;

import org.springframework.data.jpa.repository.JpaRepository;
import com.br.oticavitturino.main.model.domain.scheduling.Scheduling;

public interface SchedulingRepository extends JpaRepository<Scheduling, Long> {}