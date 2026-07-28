package com.br.oticavitturino.main.model.domain.user;

import com.fasterxml.jackson.annotation.JsonProperty;

public record LoginResponseDTO(
    @JsonProperty("token") String token,
    @JsonProperty("referralCode") String referralCode,
    @JsonProperty("userId") Long userId,
    @JsonProperty("name") String name,
    @JsonProperty("profile") String profile
) {}
