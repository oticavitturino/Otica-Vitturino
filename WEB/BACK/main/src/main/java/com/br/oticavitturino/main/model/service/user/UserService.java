package com.br.oticavitturino.main.model.service.user;

import java.util.Random;

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

import jakarta.transaction.Transactional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository repository;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return repository.findByEmail(email);
    }

    @Transactional
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

        if (data.referralCode() != null && !data.referralCode().trim().isEmpty()) {
            User referrer = repository.findByMyReferralCode(data.referralCode().trim().toUpperCase());

            if (referrer != null) {
                referrer.setPoints(referrer.getPoints() + 50); // Esse "50" é só um exemplo, depois a gente muda quando definir a tabela de pontos
            }
        }

        String generatedCode = generateUniqueReferralCode(data.name());
        newUser.setMyReferralCode(generatedCode);

        return repository.save(newUser);
    }

    // Método para gerar código único de indicação
    private String generateUniqueReferralCode(String fullName) {
        String firstName = fullName.split(" ")[0].toUpperCase();
        firstName = firstName.replaceAll("[^A-Z]", "");
        String newCode;
        Random random = new Random();

        do {
            int randomNumber = 1000 + random.nextInt(9000);
            newCode = firstName + randomNumber;
        } while (repository.findByMyReferralCode(newCode) != null);

        return newCode;
    }
}