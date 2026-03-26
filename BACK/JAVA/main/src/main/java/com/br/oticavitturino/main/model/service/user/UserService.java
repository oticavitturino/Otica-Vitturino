package com.br.oticavitturino.main.model.service.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.br.oticavitturino.main.infra.exceptions.EmailWasRegistredException;
import com.br.oticavitturino.main.model.domain.admin.Admin;
import com.br.oticavitturino.main.model.domain.customer.Customer;
import com.br.oticavitturino.main.model.domain.user.RegisterUserDTO;
import com.br.oticavitturino.main.model.domain.user.TypeProfile;
import com.br.oticavitturino.main.model.domain.user.User;
import com.br.oticavitturino.main.model.repository.user.UserRepository;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository repository;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return repository.findByEmail(email);
    }

    public User register (RegisterUserDTO data) {
        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        if (this.repository.findByEmail(data.email()) != null) throw new EmailWasRegistredException("Email was registred!");

        User newUser;

        if (data.profile() == TypeProfile.ADMIN) {
            Admin admin = new Admin();
            admin.setName(data.name());
            newUser = admin;
        } else {
            Customer customer = new Customer();
            customer.setName(data.name());
            customer.setPhone(data.phone());
            customer.setAddress(data.address());
            customer.setBirthDate(data.birthDate());
            newUser = customer;
        }

        newUser.setEmail(data.email());
        newUser.setPassword(encryptedPassword);
        newUser.setActive(true);
        newUser.setProfile(data.profile());

        return repository.save(newUser);
    }
}