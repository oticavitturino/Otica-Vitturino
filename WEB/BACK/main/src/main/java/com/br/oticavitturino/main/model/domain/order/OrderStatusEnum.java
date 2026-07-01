package com.br.oticavitturino.main.model.domain.order;

public enum OrderStatusEnum {

    REALIZADO("REALIZADO"),
    EM_ANDAMENTO("EM_ANDAMENTO"),
    CONCLUIDO("CONCLUIDO");

    private String status;

    OrderStatusEnum(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}