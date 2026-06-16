package com.br.oticavitturino.main.model.domain.occurrence;

import java.time.LocalDateTime;

public record OccurrenceDTO(Long id, String description, LocalDateTime sentAt, Long customerId) {}