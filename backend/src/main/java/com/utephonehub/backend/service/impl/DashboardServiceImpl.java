package com.utephonehub.backend.service.impl;

import com.utephonehub.backend.dto.response.dashboard.DashboardOverviewResponse;
import com.utephonehub.backend.enums.OrderStatus;
import com.utephonehub.backend.repository.OrderRepository;
import com.utephonehub.backend.repository.ProductRepository;
import com.utephonehub.backend.repository.UserRepository;
import com.utephonehub.backend.service.IDashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DashboardServiceImpl implements IDashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public DashboardOverviewResponse getOverview() {
        log.info("Fetching dashboard overview statistics");

        // Calculate total revenue from DELIVERED orders (completed orders)
        BigDecimal totalRevenue = orderRepository.calculateTotalRevenueByStatus(OrderStatus.DELIVERED);
        
        // Count total orders
        long totalOrders = orderRepository.count();
        
        // Count total products
        long totalProducts = productRepository.count();
        
        // Count total users
        long totalUsers = userRepository.count();

        log.info("Dashboard overview - Revenue: {}, Orders: {}, Products: {}, Users: {}", 
                totalRevenue, totalOrders, totalProducts, totalUsers);

        return DashboardOverviewResponse.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .totalProducts(totalProducts)
                .totalUsers(totalUsers)
                .build();
    }
}
