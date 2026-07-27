package com.br.oticavitturino.main.model.domain.message;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "message_template")
public class MessageTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type", nullable = false, unique = true)
    @Enumerated(EnumType.STRING)
    private TypeMessageEnum type;

    @Column(name = "template_text", nullable = false, length = 1024)
    private String templateText;

    @Column(name = "customer_id", nullable = true)
    private Long customerId;

    public MessageTemplate (TypeMessageEnum type, String templateText) {
        this.type = type;
        this.templateText = templateText;
    }
}