package com.br.oticavitturino.main.controller.message;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.br.oticavitturino.main.model.domain.message.MessageTemplateDTO;
import com.br.oticavitturino.main.model.service.message.MessageTemplateService;

@RestController
@RequestMapping("/message-template")
public class MessageTemplateController {

    @Autowired
    private MessageTemplateService service;

    @GetMapping("/getAllTemplates")
    public ResponseEntity<List<MessageTemplateDTO>> getAllTemplates() {
        return ResponseEntity.ok(service.getAllTemplates());
    }

    @PostMapping("/create")
    public ResponseEntity<MessageTemplateDTO> createMessageTemplate(@RequestBody MessageTemplateDTO dto) {
        MessageTemplateDTO createdTemplate = service.createMessageTemplate(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTemplate);
    }

    @PutMapping("/update")
    public ResponseEntity<MessageTemplateDTO> updateMessageTemplate(@RequestBody MessageTemplateDTO dto) {
        MessageTemplateDTO updatedTemplate = service.updateMessageTemplate(dto);
        return ResponseEntity.ok(updatedTemplate);
    }
}
