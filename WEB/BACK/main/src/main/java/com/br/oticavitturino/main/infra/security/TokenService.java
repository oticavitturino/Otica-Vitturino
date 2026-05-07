package com.br.oticavitturino.main.infra.security;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.br.oticavitturino.main.model.domain.user.User;

@Service
public class TokenService {

    // Chave secreta para gerar o token
    @Value("${api.security.token.secret}")
    private String secret;

    // Método para gerar o token
    public String generateToken(Object user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String token = JWT.create()
                .withIssuer("auth-api")
                .withSubject(((User) user).getUsername())
                .withExpiresAt(generateExpirationDate())
                .sign(algorithm);
            return token;
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar token", exception);
        }
    }

    // Método para validar o token
    public String validatingToken (String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                .withIssuer("auth-api")
                .build()
                .verify(token)
                .getSubject();
        } catch (JWTVerificationException exception) {
            return "";
        }
    }
    
    private Instant generateExpirationDate () {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
