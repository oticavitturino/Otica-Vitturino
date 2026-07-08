package com.br.oticavitturino.main.model.service.customer;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import com.br.oticavitturino.main.model.repository.customer.CustomerRepository;
import com.br.oticavitturino.main.model.domain.customer.CustomerDTO;
import com.br.oticavitturino.main.model.domain.customer.ScoreDTO;
import com.br.oticavitturino.main.model.domain.customer.Customer;
import com.br.oticavitturino.main.model.domain.user.User;

import com.br.oticavitturino.main.infra.security.SecurityConfigurations;
@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repository;

    @Autowired
    private SecurityConfigurations securityConfiguration;

    @Transactional(readOnly = true)
    public CustomerDTO getAllCustomers() {
        Customer customer = repository.findAll().stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No customers found"));
        String decryptedName = securityConfiguration.encryptionService().decrypt(customer.getName());
        String decryptedPhone = securityConfiguration.encryptionService().decrypt(customer.getPhone());
        String decryptedAddress = securityConfiguration.encryptionService().decrypt(customer.getAddress());
        return new CustomerDTO(decryptedName, decryptedPhone, decryptedAddress, customer.getBirthDate());
    }

    @Transactional(readOnly = true)
    public ScoreDTO getCustomerScore(Long id) {
        User customer = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        return new ScoreDTO(customer.getPoints());
    }

    @Transactional
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer customer = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        String encryptedName = securityConfiguration.encryptionService().encrypt(customerDTO.name());
        String encryptedPhone = securityConfiguration.encryptionService().encrypt(customerDTO.name());
        String encryptedAddress = securityConfiguration.encryptionService().encrypt(customerDTO.name());

        customer.setName(encryptedName);
        customer.setPhone(encryptedPhone);
        customer.setAddress(encryptedAddress);
        customer.setBirthDate(customerDTO.birthDate());

        Customer updatedCustomer = repository.save(customer);
        return new CustomerDTO(updatedCustomer.getName(), updatedCustomer.getPhone(), updatedCustomer.getAddress(), updatedCustomer.getBirthDate());
    }
}