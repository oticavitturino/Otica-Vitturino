package com.br.oticavitturino.main.model.domain.user;

import java.time.LocalDate;

public record RegisterUserDTO(String name, String email, String password, boolean active, TypeProfile profile, String phone, String address, LocalDate birthDate, String referralCode) {}