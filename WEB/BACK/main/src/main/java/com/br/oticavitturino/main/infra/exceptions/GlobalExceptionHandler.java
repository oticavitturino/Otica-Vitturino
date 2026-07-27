package com.br.oticavitturino.main.infra.exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(EmailWasRegistredException.class)
    public ResponseEntity<RestErrorMessage> emailWasRegistred(EmailWasRegistredException exception) {
        RestErrorMessage errorResponse = new RestErrorMessage(HttpStatus.BAD_REQUEST, exception.getMessage());

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<RestErrorMessage> dataIntegrityViolation(DataIntegrityViolationException exception) {
        RestErrorMessage errorResponse = new RestErrorMessage(
                HttpStatus.BAD_REQUEST,
                "Não foi possível salvar os dados. Verifique se os campos estão corretos e tente novamente.");

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<RestErrorMessage> illegalArgument(IllegalArgumentException exception) {
        RestErrorMessage errorResponse = new RestErrorMessage(HttpStatus.BAD_REQUEST, exception.getMessage());

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
}