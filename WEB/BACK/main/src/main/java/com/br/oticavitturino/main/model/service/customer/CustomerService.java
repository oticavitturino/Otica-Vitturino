package com.br.oticavitturino.main.model.service.customer;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import com.br.oticavitturino.main.model.repository.customer.CustomerRepository;
import com.br.oticavitturino.main.model.domain.customer.CustomerDTO;
import com.br.oticavitturino.main.model.domain.customer.ScoreDTO;
import com.br.oticavitturino.main.model.domain.customer.Customer;

import java.util.List;
import java.util.stream.Collectors;

import com.br.oticavitturino.main.infra.security.EncryptionService;
@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repository;

    @Autowired
    private EncryptionService encryptionService;

    @Transactional(readOnly = true)
    public List<CustomerDTO> getAllCustomers() {
        return repository.findAll().stream().map(customer -> {
            String decryptedName = encryptionService.decrypt(customer.getName());
            String decryptedPhone = encryptionService.decrypt(customer.getPhone());
            String decryptedAddress = encryptionService.decrypt(customer.getAddress());
            return new CustomerDTO(decryptedName, decryptedPhone, decryptedAddress, customer.getBirthDate());
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ScoreDTO getCustomerScore(Long id) {
        Customer customer = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        return new ScoreDTO(customer.getPoints());
    }

    @Transactional
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer customer = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        String encryptedName = encryptionService.encrypt(customerDTO.name());
        String encryptedPhone = encryptionService.encrypt(customerDTO.phone());
        String encryptedAddress = encryptionService.encrypt(customerDTO.address());

        customer.setName(encryptedName);
        customer.setPhone(encryptedPhone);
        customer.setAddress(encryptedAddress);
        customer.setBirthDate(customerDTO.birthDate());

        Customer updatedCustomer = repository.save(customer);
        return new CustomerDTO(encryptionService.decrypt(updatedCustomer.getName()),
                encryptionService.decrypt(updatedCustomer.getPhone()),
                encryptionService.decrypt(updatedCustomer.getAddress()),
                updatedCustomer.getBirthDate());
    }
}