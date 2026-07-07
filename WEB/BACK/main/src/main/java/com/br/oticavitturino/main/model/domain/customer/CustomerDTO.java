package com.br.oticavitturino.main.model.domain.customer;

import java.time.LocalDate;

public record CustomerDTO(String name, String phone, String address, LocalDate birthDate) {}