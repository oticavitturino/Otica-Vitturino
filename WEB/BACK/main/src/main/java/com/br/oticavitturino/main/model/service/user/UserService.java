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
import com.br.oticavitturino.main.infra.security.SecurityConfigurations;

import jakarta.transaction.Transactional;
@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private SecurityConfigurations securityConfigurations;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return repository.findByEmail(email);
    }

    @Transactional
    public User register (RegisterUserDTO data) {

        if (this.repository.findByEmail(data.email()) != null) throw new EmailWasRegistredException("Email was registred!");

        String encryptedName = securityConfigurations.encryptionService().encrypt(data.name());
        String encryptedEmail = securityConfigurations.encryptionService().encrypt(data.email());
        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        String encryptedPhone = data.phone() != null ? securityConfigurations.encryptionService().encrypt(data.phone()) : null;
        String encryptedAddress = data.address() != null ? securityConfigurations.encryptionService().encrypt(data.address()) : null;

        User newUser;

        if (data.profile() == TypeProfile.ADMIN) {
            Admin admin = new Admin();
            admin.setName(encryptedName);
            newUser = admin;
        } else {
            Customer customer = new Customer();
            customer.setName(encryptedName);
            customer.setPhone(encryptedPhone);
            customer.setAddress(encryptedAddress);
            customer.setBirthDate(data.birthDate());
            newUser = customer;
        }

        newUser.setEmail(encryptedEmail);
        newUser.setPassword(encryptedPassword);
        newUser.setActive(true);
        newUser.setProfile(data.profile());

        if (data.referralCode() != null && !data.referralCode().trim().isEmpty()) {
            User referrer = repository.findByMyReferralCode(data.referralCode().trim().toUpperCase());

            if (referrer != null) {
                referrer.setPoints(referrer.getPoints() + 50);
            }
        }

        String generatedCode = securityConfigurations.generateUniqueReferralCode(data.name());
        newUser.setMyReferralCode(generatedCode);

        return repository.save(newUser);
    }
}