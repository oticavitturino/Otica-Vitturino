package com.br.oticavitturino.main.model.domain.scheduling;
import java.time.LocalDateTime;

import com.br.oticavitturino.main.model.domain.customer.Customer;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

@Entity
@Table(name = "scheduling")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Scheduling {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "scheduling_type")
    @Enumerated(EnumType.STRING)
    private SchedulingEnum schedulingType;

    @Column(name = "scheduling_date", nullable = false)
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime schedulingDate;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusEnum status;

    @OneToOne
    @JoinColumn(name = "customer_id")
    @JsonIgnore
    private Customer customer;

    public Scheduling(LocalDateTime schedulingDate) {
        this.schedulingDate = schedulingDate;
    }
}