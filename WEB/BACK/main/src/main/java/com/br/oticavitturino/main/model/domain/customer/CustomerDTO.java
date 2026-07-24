package com.br.oticavitturino.main.model.domain.customer;

import java.time.LocalDate;

public record CustomerDTO(Long id, String name, String email, String phone, String address, LocalDate birthDate) {}