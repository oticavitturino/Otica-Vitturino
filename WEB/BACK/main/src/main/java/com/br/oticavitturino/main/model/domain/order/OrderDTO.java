package com.br.oticavitturino.main.model.domain.order;

public record OrderDTO(String name, OrderStatusEnum orderStatus, Long customerId) {}