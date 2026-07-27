package com.br.oticavitturino.main.model.repository.message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.br.oticavitturino.main.model.domain.message.MessageTemplate;
import com.br.oticavitturino.main.model.domain.message.TypeMessageEnum;

public interface MessageTemplateRepository extends JpaRepository<MessageTemplate, Long>{
    @Query
    (nativeQuery = true, value = "SELECT TEMPLATE_TEXT FROM MESSAGE_TEMPLATE WHERE TYPE = :type")
    String findTemplateTextByType(@Param("type") TypeMessageEnum type);

    MessageTemplate findTemplateByType(TypeMessageEnum type);
}