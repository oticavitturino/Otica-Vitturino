package com.br.oticavitturino.main.model.domain.occurrence;

import java.time.LocalDateTime;

public record OccurrenceNoCustomerDTO(Long id, String description, LocalDateTime sentAt) {}