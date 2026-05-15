package com.br.oticavitturino.main.model.repository.customer;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.oticavitturino.main.model.domain.customer.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Customer findByName(String name);
}