package com.br.oticavitturino.main.controller.message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.br.oticavitturino.main.model.service.message.MessageTemplateService;
import com.br.oticavitturino.main.model.domain.message.MessageTemplateDTO;

@Controller
@RequestMapping("/message-template")
public class MessageTemplateController {

    @Autowired
    private MessageTemplateService service;

    @PostMapping("/create")
    public ResponseEntity<MessageTemplateDTO> createMessageTemplate(@RequestBody MessageTemplateDTO dto) {
        MessageTemplateDTO createdTemplate = service.createMessageTemplate(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTemplate);
    }
}