package com.br.oticavitturino.main.model.repository.occurrence;

import com.br.oticavitturino.main.model.domain.occurrence.Occurrence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OccurrenceRepository extends JpaRepository<Occurrence, Long> {
    @Query
    (nativeQuery = true, value = "SELECT * FROM occurrences WHERE customer_id = :customerId")
    List<Occurrence> findByCustomerId(@Param("customerId") Long customerId);
}