package com.br.oticavitturino.main.model.domain.scheduling;

public enum StatusEnum {

    CONCLUIDO("CONCLUIDO"),
    PENDENTE("PENDENTE"),
    CANCELADO("CANCELADO");
    
    private String status;

    StatusEnum(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}