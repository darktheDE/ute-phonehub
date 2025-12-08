package com.utephonehub.backend.service;

import com.utephonehub.backend.dto.request.order.CreateOrderRequest;
import com.utephonehub.backend.dto.response.order.CreateOrderResponse;
import com.utephonehub.backend.dto.response.order.OrderResponse;

public interface IOrderService {
    
    /**
     * Lấy thông tin đơn hàng theo ID
     * @param orderId ID của đơn hàng
     * @param userId ID của user (để check quyền sở hữu)
     * @return Thông tin đơn hàng
     */
    OrderResponse getOrderById(Long orderId, Long userId);
    
    /**
     * Tạo đơn hàng mới
     * @param request Thông tin đơn hàng
     * @param userId ID của user tạo đơn
     * @return Thông tin đơn hàng đã tạo
     */
    CreateOrderResponse createOrder(CreateOrderRequest request, Long userId);
}