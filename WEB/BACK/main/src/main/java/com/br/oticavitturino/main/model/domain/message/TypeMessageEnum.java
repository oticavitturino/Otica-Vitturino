package com.br.oticavitturino.main.model.domain.message;

public enum TypeMessageEnum {

    LEMBRETE("LEMBRETE"),
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