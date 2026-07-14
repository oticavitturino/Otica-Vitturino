package com.br.oticavitturino.main.infra.security;

import java.util.List;
import java.util.Random;
import com.br.oticavitturino.main.model.repository.user.UserRepository;

import org.h2.tools.Server;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.Filter;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    @Value("${api.url.front}")
    private String urlFront;

    @Autowired
    UserRepository UserRepository;

    @Autowired
    SecurityFilter securityFilter;

    // Configurações de segurança e autorização de acesso
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                    .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                    .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
                    .requestMatchers(HttpMethod.GET, "/customer/all").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/customer/update").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/scheduling/addDateAvailable").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/scheduling/deleteDateAvailable").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/scheduling/confirmOrCancelAppointment").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.GET, "/scheduling/getAllSchedulings").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.GET, "/occurrences/listAll").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/orders/createOrder").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/orders/modifyOrderStatus").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/message-template/create").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/message-template/update").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/scheduling/scheduleAppointment").hasRole("CUSTOMER")
                    .requestMatchers(HttpMethod.POST, "/scheduling/cancelAppointment").hasRole("CUSTOMER")
                    .requestMatchers(HttpMethod.POST, "/occurrences/register").hasRole("CUSTOMER")
                    .requestMatchers(HttpMethod.GET, "/occurrences/occurrenceCustomer").hasRole("CUSTOMER")
                    .requestMatchers(HttpMethod.DELETE, "/occurrences/delete").hasAnyRole("ADMIN", "CUSTOMER")
                    .requestMatchers(HttpMethod.GET, "/scheduling/getAllDatesAvailable").hasAnyRole("ADMIN", "CUSTOMER")
                    .anyRequest().authenticated()
                )

                // Adiciona o filtro de autenticação
                .addFilterBefore((Filter) securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    // Configurações de autenticação
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfigurarion) {
        return authenticationConfigurarion.getAuthenticationManager();
    }

    // Configuração de criptografia de senha
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configuração de criptografia de dados sensíveis
    @Bean
    public EncriptionService encryptionService() {
        return new EncriptionService();
    }

    // Método para gerar código único de indicação
    public String generateUniqueReferralCode(String fullName) {
        String firstName = fullName.split(" ")[0].toUpperCase();
        firstName = firstName.replaceAll("[^A-Z]", "");
        String newCode;
        Random random = new Random();

        do {
            int randomNumber = 1000 + random.nextInt(9000);
            newCode = firstName + randomNumber;
        } while (UserRepository.findByMyReferralCode(newCode) != null);

        return newCode;
    }

    // Configuração de CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(urlFront));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // Configuração TCP para acesso do banco
    @Bean(initMethod = "start", destroyMethod = "stop")
    public Server h2Server() throws Exception {
        return new org.h2.tools.Server().createTcpServer("-tcp", "-tcpAllowOthers", "-tcpPort", "9092");
    }
}