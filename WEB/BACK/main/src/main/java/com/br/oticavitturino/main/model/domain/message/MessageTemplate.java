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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import com.fasterxml.jackson.annotation.JsonIgnore;

import com.br.oticavitturino.main.model.domain.customer.Customer;

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

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private TypeMessageEnum type;

    @Column(name = "template_text", nullable = false, length = 1024)
    private String templateText;

    @ManyToOne
    @JoinColumn(name = "customer_id", insertable=false, updatable=false, nullable = false)
    @JsonIgnore
    private Customer customer;

    public MessageTemplate (TypeMessageEnum type, String templateText) {
        this.type = type;
        this.templateText = templateText;
    }
}