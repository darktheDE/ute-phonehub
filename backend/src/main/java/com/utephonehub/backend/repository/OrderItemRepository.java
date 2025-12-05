package com.utephonehub.backend.repository;

import com.utephonehub.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    /**
     * Find top selling products based on total quantity sold
     * Only count orders with DELIVERED status (completed orders)
     * 
     * @param limit Number of top products to return
     * @return List of Object arrays containing: [Product, totalQuantity, totalRevenue]
     */
    @Query("SELECT oi.product, " +
           "SUM(oi.quantity) as totalQuantity, " +
           "SUM(oi.quantity * oi.price) as totalRevenue " +
           "FROM OrderItem oi " +
           "JOIN oi.order o " +
           "WHERE o.status = 'DELIVERED' " +
           "GROUP BY oi.product " +
           "ORDER BY totalQuantity DESC")
    List<Object[]> findTopSellingProducts(@Param("limit") int limit);
}
