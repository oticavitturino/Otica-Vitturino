package com.br.oticavitturino.main.model.domain.occurrence;

import java.time.LocalDateTime;

public record OccurrenceListDTO(Long id, String description, LocalDateTime sentAt, String category) {}