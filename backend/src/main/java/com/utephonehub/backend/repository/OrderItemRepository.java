package com.utephonehub.backend.repository;

import com.utephonehub.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    // Tìm tất cả items của 1 order
    List<OrderItem> findByOrderId(Long orderId);
}
