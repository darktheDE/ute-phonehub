package com.utephonehub.backend.service;

import com.utephonehub.backend.dto.request.payment.CreatePaymentRequest;
import com.utephonehub.backend.dto.response.payment.PaymentResponse;
import com.utephonehub.backend.dto.response.payment.VNPayPaymentResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface IPaymentService {
    
    /**
     * Create VNPay payment URL
     */
    VNPayPaymentResponse createPayment(CreatePaymentRequest request, HttpServletRequest servletRequest);
    
    /**
     * Handle VNPay payment callback/return
     */
    PaymentResponse handlePaymentCallback(HttpServletRequest request);
    
    /**
     * Get payment by order ID
     */
    PaymentResponse getPaymentByOrderId(Long orderId);
    
    /**
     * Get payment by ID
     */
    PaymentResponse getPaymentById(Long paymentId);
}
