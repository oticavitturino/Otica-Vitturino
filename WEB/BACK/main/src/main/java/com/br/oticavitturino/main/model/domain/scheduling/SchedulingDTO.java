package com.br.oticavitturino.main.model.domain.scheduling;

import java.time.LocalDateTime;

public record SchedulingDTO(String name, SchedulingEnum scheduling_type, LocalDateTime schedulingDate, StatusEnum status) {}