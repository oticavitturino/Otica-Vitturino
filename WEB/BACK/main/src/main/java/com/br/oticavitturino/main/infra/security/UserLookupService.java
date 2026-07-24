package com.br.oticavitturino.main.infra.security;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.br.oticavitturino.main.model.domain.user.User;
import com.br.oticavitturino.main.model.repository.user.UserRepository;

@Service
public class UserLookupService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private EncryptionService encryptionService;

    @Transactional
    public User findByPlainEmail(String email) {
        String normalizedEmail = normalizeEmail(email);
        String lookupHash = encryptionService.generateLookupHash(normalizedEmail);
        User user = repository.findByEmailLookupHash(lookupHash);
        if (user != null) {
            return user;
        }

        for (User existingUser : repository.findAll()) {
            if (emailMatches(existingUser.getEmail(), normalizedEmail)) {
                existingUser.setEmailLookupHash(lookupHash);
                return repository.save(existingUser);
            }
        }
        return null;
    }

    private boolean emailMatches(String storedEmail, String normalizedEmail) {
        if (normalizedEmail.equalsIgnoreCase(storedEmail)) {
            return true;
        }

        try {
            return normalizedEmail.equalsIgnoreCase(encryptionService.decrypt(storedEmail));
        } catch (RuntimeException exception) {
            return false;
        }
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email must be informed");
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
