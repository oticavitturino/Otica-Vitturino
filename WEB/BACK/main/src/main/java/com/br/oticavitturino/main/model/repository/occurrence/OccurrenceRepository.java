package com.br.oticavitturino.main.model.repository.occurrence;

import com.br.oticavitturino.main.model.domain.occurrence.Occurrence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OccurrenceRepository extends JpaRepository<Occurrence, Long> {

}