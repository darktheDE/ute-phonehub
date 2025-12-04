package com.utephonehub.backend.enums;

/**
 * Order status enumeration
 */
public enum OrderStatus {
    WAITING_PAYMENT,  // Chờ thanh toán (VNPay)
    PENDING,          // Chờ xử lý
    PROCESSING,       // Đang xử lý
    CONFIRMED,        // Đã xác nhận
    SHIPPED,          // Đang giao hàng
    DELIVERED,        // Đã giao hàng
    CANCELLED         // Đã hủy
}
