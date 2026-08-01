package com.br.oticavitturino.main.controller.customer;

import java.util.Map;

import org.springframework.web.bind.annotation.RequestMapping;

import com.br.oticavitturino.main.model.domain.customer.CustomerDTO;
import com.br.oticavitturino.main.model.service.customer.CustomerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.br.oticavitturino.main.model.domain.user.RegisterUserDTO;
import com.br.oticavitturino.main.model.service.user.UserService;

@RestController
@RequestMapping("/customer")
public class CustomerController {
    
    @Autowired
    private CustomerService service;

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllCustomers() {
        return ResponseEntity.ok(service.getAllCustomers());
    }

    @GetMapping("/score")
    public ResponseEntity<?> getCustomerScore(@RequestParam Long id) {
        return ResponseEntity.ok(service.getCustomerScore(id));
    }

    @GetMapping("/validateReferralCode")
    public ResponseEntity<Map<String, Boolean>> validateReferralCode(@RequestParam String code) {
        boolean valid = userService.referralCodeExists(code);
        return ResponseEntity.ok(Map.of("valid", valid));
    }

    @PostMapping("/register")
    public ResponseEntity<Void> registerCustomer(@RequestBody RegisterUserDTO data) {
        userService.register(data);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/update")
    public ResponseEntity<CustomerDTO> updateCustomer(@RequestParam Long id, @RequestBody CustomerDTO customerDTO) {
        CustomerDTO updatedCustomer = service.updateCustomer(id, customerDTO);
        return ResponseEntity.ok(updatedCustomer);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCustomer(@RequestParam Long id) {
        service.deleteCustomer(id);
        return ResponseEntity.ok().build();
    }
}