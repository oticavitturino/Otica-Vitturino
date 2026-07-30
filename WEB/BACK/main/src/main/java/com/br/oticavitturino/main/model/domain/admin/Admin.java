package com.br.oticavitturino.main.model.domain.admin;

import com.br.oticavitturino.main.model.domain.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "admin")
@DiscriminatorValue("ADMIN")
public class Admin extends User {

   @Column(name = "name", length = 512, nullable = false)
   private String name;
}