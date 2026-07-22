package com.br.oticavitturino.main.infra.security;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

@Service
public class EncryptionService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";

    private final TextEncryptor encryptor;
    private final SecretKeySpec lookupKey;

    public EncryptionService(
            @Value("${api.security.encryption.secret}") String secretKey,
            @Value("${api.security.encryption.salt}") String salt) {
        this.encryptor = Encryptors.text(secretKey, salt);
        this.lookupKey = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM);
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

    // Gera um índice determinístico sem expor o dado original.
    public String generateLookupHash(String rawData) {
        if (rawData == null || rawData.isEmpty()) {
            return rawData;
        }

        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(lookupKey);
            return HexFormat.of().formatHex(mac.doFinal(rawData.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException | InvalidKeyException exception) {
            throw new IllegalStateException("Could not generate data lookup hash", exception);
        }
    }
}