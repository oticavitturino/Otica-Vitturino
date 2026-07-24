package com.br.oticavitturino.main.model.domain.customer;

import java.time.LocalDate;
import java.util.List;

import com.br.oticavitturino.main.model.domain.occurrence.Occurrence;
import com.br.oticavitturino.main.model.domain.scheduling.Scheduling;
import com.br.oticavitturino.main.model.domain.user.User;
import com.br.oticavitturino.main.model.domain.message.MessageTemplate;
import com.br.oticavitturino.main.model.domain.order.Order;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OneToMany;
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
    @Column(name = "name", length = 512, nullable = false)
    private String name;

    @Column(name = "phone", length = 512, nullable = false)
    private String phone;

    @Column(name = "address", length = 512, nullable = false)
    private String address;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @OneToOne(mappedBy = "customer", orphanRemoval = true, cascade = CascadeType.ALL)
    private Scheduling scheduling;

    @OneToMany(mappedBy = "customer", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<Occurrence> occurrences;

    @OneToMany(mappedBy = "customer", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<MessageTemplate> messages;

    @OneToMany(mappedBy = "customer", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<Order> orders;

    public Customer (String name, String phone, String address, LocalDate birthDate) {
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.birthDate = birthDate;
    }
}