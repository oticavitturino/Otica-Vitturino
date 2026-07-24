package com.br.oticavitturino.main.model.domain.order;

public record OrderDTO(Long id, String name, OrderStatusEnum orderStatus, Long customerId) {}