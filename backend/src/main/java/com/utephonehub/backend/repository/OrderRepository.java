package com.utephonehub.backend.repository;

import com.utephonehub.backend.entity.Order;
import com.utephonehub.backend.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    Optional<Order> findByOrderCode(String orderCode);
    
    /**
     * Calculate total revenue from completed orders
     * @return Total revenue in BigDecimal, returns 0 if no orders
     */
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status = :status")
    BigDecimal calculateTotalRevenueByStatus(OrderStatus status);
    
    /**
     * Find orders by date range and status
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @param status Order status
     * @return List of orders in date range with specific status
     */
    List<Order> findByCreatedAtBetweenAndStatus(LocalDateTime startDate, LocalDateTime endDate, OrderStatus status);
    
    /**
     * Count orders by status
     * @param status Order status
     * @return Number of orders with specific status
     */
    long countByStatus(OrderStatus status);
}

