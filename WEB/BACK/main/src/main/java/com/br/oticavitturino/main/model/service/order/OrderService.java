package com.br.oticavitturino.main.model.service.order;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.br.oticavitturino.main.model.domain.customer.Customer;
import com.br.oticavitturino.main.model.domain.order.Order;
import com.br.oticavitturino.main.model.domain.order.OrderDTO;
import com.br.oticavitturino.main.model.domain.order.OrderModifyStatusDTO;
import com.br.oticavitturino.main.model.domain.order.OrderStatusEnum;
import com.br.oticavitturino.main.model.repository.customer.CustomerRepository;
import com.br.oticavitturino.main.model.repository.order.OrderRepository;

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
        order.setOrderDate(LocalDateTime.now());
        order.setCustomer(customer);
        Order savedOrder = repository.save(order);
        return new OrderDTO(savedOrder.getId(), savedOrder.getName(), savedOrder.getOrderStatus(), savedOrder.getCustomer().getId());
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        return repository.findAll().stream()
                .map(order -> new OrderDTO(
                        order.getId(),
                        order.getName(),
                        order.getOrderStatus(),
                        order.getCustomer().getId()))
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderModifyStatusDTO modifyOrderStatus(Long orderId, OrderStatusEnum newStatus) {
        Order order = repository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setOrderStatus(newStatus);
        Order updatedOrder = repository.save(order);
        return new OrderModifyStatusDTO(updatedOrder.getOrderStatus());
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = repository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        repository.delete(order);
    }
}