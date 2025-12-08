package com.utephonehub.backend.repository;

import com.utephonehub.backend.entity.Order;
import com.utephonehub.backend.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Tìm theo orderCode
    Optional<Order> findByOrderCode(String orderCode);
    
    // Tìm tất cả đơn hàng của 1 user
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Tìm theo status
    List<Order> findByStatus(OrderStatus status);
    
    // Tìm đơn hàng theo status và thời gian (cho Cron Job)
    List<Order> findByStatusAndCreatedAtBefore(OrderStatus status, LocalDateTime time);
    
    // Kiểm tra orderCode đã tồn tại
    boolean existsByOrderCode(String orderCode);
    
    // Query fetch cả items (tránh N+1 query)
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.id = :id")
    Optional<Order> findByIdWithItems(@Param("id") Long id);
}