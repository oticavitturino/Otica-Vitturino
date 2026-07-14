package com.br.oticavitturino.main.infra.security;
import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

@Service
public class EncriptionService {

    // Chave secreta para criptografia AES
    @Value("${api.security.encryption.secret}")
    private String SECRET_KEY;

    @Value("${api.security.encryption.salt}")
    private String HEX_SALT;

    private final TextEncryptor encryptor;

    public EncriptionService() {
        this.encryptor = Encryptors.text(SECRET_KEY, HEX_SALT);
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