package com.br.oticavitturino.main.model.domain.scheduling;

public enum SchedulingEnum {

    CONSULTA("CONSULTA"),
    MANUTENCAO("MANUTENCAO"),
    LIMPEZA("LIMPEZA");

    private String scheduling_type;

    SchedulingEnum(String scheduling_type) {
        this.scheduling_type = scheduling_type;
    }

    public String getSchedulingType() {
        return scheduling_type;
    }
}