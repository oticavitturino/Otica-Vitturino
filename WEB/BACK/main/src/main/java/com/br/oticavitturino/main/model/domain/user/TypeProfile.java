package com.br.oticavitturino.main.model.domain.user;

public enum TypeProfile {

    ADMIN("admin"),
    CUSTOMER("customer");

    private final String profile;

    TypeProfile(String profile) {
        this.profile = profile;
    }

    public String getProfile() {
        return profile;
    }
}