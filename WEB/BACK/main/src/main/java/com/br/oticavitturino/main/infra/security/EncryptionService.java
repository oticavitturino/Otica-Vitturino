package com.br.oticavitturino.main.infra.security;

import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

@Service
public class EncryptionService {

    private final TextEncryptor encryptor;

    public EncryptionService(
            @Value("${api.security.encryption.secret}") String secretKey,
            @Value("${api.security.encryption.salt}") String salt) {
        this.encryptor = Encryptors.text(secretKey, salt);
    }

    // Método para criptografar
    public String encrypt(String rawData) {
        if (rawData == null || rawData.isEmpty()) {
            return rawData;
        }
        return encryptor.encrypt(rawData);
    }

    // Método para descriptografar
    public String decrypt(String encryptedData) {
        if (encryptedData == null || encryptedData.isEmpty()) {
            return encryptedData;
        }
        return encryptor.decrypt(encryptedData);
    }
}