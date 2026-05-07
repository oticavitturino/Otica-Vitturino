package com.br.oticavitturino.main.infra.exceptions;

public class EmailWasRegistredException extends RuntimeException {
    public EmailWasRegistredException(String message) { super(message); }
}