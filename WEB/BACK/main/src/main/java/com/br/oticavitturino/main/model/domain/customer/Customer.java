package com.br.oticavitturino.main.model.domain.customer;

import java.time.LocalDate;

import com.br.oticavitturino.main.model.domain.occurrence.Occurrence;
import com.br.oticavitturino.main.model.domain.scheduling.Scheduling;
import com.br.oticavitturino.main.model.domain.user.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "customer")
public class Customer extends User {
    @Column(name = "name", length = 255 , nullable = false)
    private String name;

    @Column(name = "phone", length = 20, nullable = false)
    private String phone;

    @Column(name = "address", length = 255, nullable = false)
    private String address;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @OneToOne(mappedBy = "customer", orphanRemoval = true, cascade = CascadeType.ALL)
    private Scheduling scheduling;

    @OneToOne(mappedBy = "customerOccurrence", orphanRemoval = true, cascade = CascadeType.ALL)
    private Occurrence occurrence;
}