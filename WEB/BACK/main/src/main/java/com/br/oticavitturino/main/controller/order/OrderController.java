package com.br.oticavitturino.main.controller.order;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;

import com.br.oticavitturino.main.model.service.order.OrderService;
import com.br.oticavitturino.main.model.domain.order.OrderDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.br.oticavitturino.main.model.domain.order.OrderStatusEnum;
import com.br.oticavitturino.main.model.domain.order.OrderModifyStatusDTO;

@Controller
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService service;

    @PostMapping("/createOrder")
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO dto) {
        OrderDTO createdOrder = service.createOrder(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    @GetMapping("/getAllOrders")
    public ResponseEntity<OrderDTO> getAllOrders() {
        OrderDTO order = service.getAllOrders();
        return ResponseEntity.ok(order);
    }

    @PutMapping("/modifyOrderStatus")
    public ResponseEntity<OrderModifyStatusDTO> modifyOrderStatus(@RequestParam Long orderId, @RequestParam OrderStatusEnum newStatus) {
        OrderModifyStatusDTO updatedOrder = service.modifyOrderStatus(orderId, newStatus);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/deleteOrder")
    public ResponseEntity<Void> deleteOrder(@RequestParam Long orderId) {
        service.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }
}
