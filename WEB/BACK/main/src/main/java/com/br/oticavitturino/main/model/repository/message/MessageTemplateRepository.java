package com.br.oticavitturino.main.model.repository.message;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.br.oticavitturino.main.model.domain.message.MessageTemplate;
import com.br.oticavitturino.main.model.domain.message.TypeMessageEnum;

public interface MessageTemplateRepository extends JpaRepository<MessageTemplate, Long>{
    @Query
    (nativeQuery = true, value = "SELECT * FROM MESSAGE_TEMPLATE WHERE customer_id = :customerId")
    List<MessageTemplate> findByCustomerId(@Param("customerId") Long customerId);
    
    @Query
    (nativeQuery = true, value = "SELECT TEMPLATE_TEXT FROM MESSAGE_TEMPLATE WHERE TYPE = :type")
    String findTemplateTextByType(@Param("type") TypeMessageEnum type);

    public MessageTemplate findTemplateByType(TypeMessageEnum type);
}