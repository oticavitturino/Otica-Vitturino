package com.br.oticavitturino.main.model.domain.message;

public enum TypeMessageEnum {

    LEMBRETE_15_DIAS("LEMBRETE_15_DIAS"),
    LEMBRETE_30_DIAS("LEMBRETE_30_DIAS"),
    LEMBRETE_90_DIAS("LEMBRETE_90_DIAS"),
    LEMBRETE_180_DIAS("LEMBRETE_180_DIAS"),
    LEMBRETE_365_DIAS("LEMBRETE_365_DIAS"),
    COMPRA("COMPRA"),
    ANIVERSARIO("ANIVERSARIO");

    private String TypeMessage;

    TypeMessageEnum(String TypeMessage) {
        this.TypeMessage = TypeMessage;
    }

    public String getTypeMessage() {
        return TypeMessage;
    }
}