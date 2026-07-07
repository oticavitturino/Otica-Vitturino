package com.br.oticavitturino.main.controller.customer;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.br.oticavitturino.main.model.domain.customer.CustomerDTO;
import com.br.oticavitturino.main.model.service.customer.CustomerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/customer")
public class CustomerController {
    
    @Autowired
    private CustomerService service;

    @GetMapping("/all")
    public ResponseEntity<?> getAllCustomers() {
        return ResponseEntity.ok(service.getAllCustomers());
    }

    @GetMapping("/score")
    public ResponseEntity<?> getCustomerScore(@RequestParam Long id) {
        return ResponseEntity.ok(service.getCustomerScore(id));
    }
    
    @PutMapping("/update")
    public ResponseEntity<CustomerDTO> updateCustomer(@RequestParam Long id, @RequestBody CustomerDTO customerDTO) {
        CustomerDTO updatedCustomer = service.updateCustomer(id, customerDTO);
        return ResponseEntity.ok(updatedCustomer);
    }
}