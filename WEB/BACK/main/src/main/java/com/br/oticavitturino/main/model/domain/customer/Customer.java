package com.br.oticavitturino.main.model.domain.customer;

import java.time.LocalDate;

import com.br.oticavitturino.main.model.domain.user.User;

import jakarta.persistence.Entity;
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
    private String name;
    private String phone;
    private String address;
    private LocalDate birthDate;
}