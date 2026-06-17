package com.br.oticavitturino.main.model.domain.occurrence;

import java.time.LocalDateTime;
import com.br.oticavitturino.main.model.domain.customer.Customer;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "occurrence")
public class Occurrence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt;

    @OneToOne
    @JoinColumn(name = "customer_id")
    @JsonIgnore
    private Customer customerId;

    public Occurrence(String description, LocalDateTime sentAt) {
        this.description = description;
        this.sentAt = sentAt;
    }
}