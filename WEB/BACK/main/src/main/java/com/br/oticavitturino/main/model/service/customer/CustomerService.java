package com.br.oticavitturino.main.model.service.customer;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.br.oticavitturino.main.model.repository.customer.CustomerRepository;
import com.br.oticavitturino.main.model.domain.customer.CustomerDTO;
import com.br.oticavitturino.main.model.domain.customer.Customer;

import jakarta.transaction.Transactional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repository;

    @Transactional
    public CustomerDTO getAllCustomers() {
        Customer customer = repository.findAll().stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No customers found"));
        return new CustomerDTO(customer.getName(), customer.getPhone(), customer.getAddress(), customer.getBirthDate());
    }

    @Transactional
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer customer = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        customer.setName(customerDTO.name());
        customer.setPhone(customerDTO.phone());
        customer.setAddress(customerDTO.address());
        customer.setBirthDate(customerDTO.birthDate());

        Customer updatedCustomer = repository.save(customer);
        return new CustomerDTO(updatedCustomer.getName(), updatedCustomer.getPhone(), updatedCustomer.getAddress(), updatedCustomer.getBirthDate());
    }
}