package com.br.oticavitturino.main.model.repository.message;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.oticavitturino.main.model.domain.message.MessageTemplate;

public interface MessageTemplateRepository extends JpaRepository<MessageTemplate, Long>{}