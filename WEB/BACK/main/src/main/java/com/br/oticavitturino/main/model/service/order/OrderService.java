package com.br.oticavitturino.main.model.service.order;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import com.br.oticavitturino.main.model.repository.order.OrderRepository;
import com.br.oticavitturino.main.model.repository.customer.CustomerRepository;
import com.br.oticavitturino.main.model.domain.order.OrderDTO;
import com.br.oticavitturino.main.model.domain.order.Order;
import com.br.oticavitturino.main.model.domain.customer.Customer;

import com.br.oticavitturino.main.model.domain.order.OrderModifyStatusDTO;
import com.br.oticavitturino.main.model.domain.order.OrderStatusEnum;
@Service
public class OrderService {

    @Autowired
    private OrderRepository repository;

    @Autowired
    private CustomerRepository customerRepository;

    @Transactional
    public OrderDTO createOrder(OrderDTO dto) {
        Customer customer = customerRepository.findById(dto.customerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Order order = new Order();
        order.setName(dto.name());
        order.setOrderStatus(dto.orderStatus());
        order.setCustomer(customer);
        Order savedOrder = repository.save(order);
        return new OrderDTO(savedOrder.getName(), savedOrder.getOrderStatus(), savedOrder.getCustomer().getId());
    }

    @Transactional
    public OrderModifyStatusDTO modifyOrderStatus(Long orderId, OrderStatusEnum newStatus) {
        Order order = repository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setOrderStatus(newStatus);
        Order updatedOrder = repository.save(order);
        return new OrderModifyStatusDTO(updatedOrder.getOrderStatus());
    }
}