package com.br.oticavitturino.main.model.repository.order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.oticavitturino.main.model.domain.order.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerId(Long customerId);
}