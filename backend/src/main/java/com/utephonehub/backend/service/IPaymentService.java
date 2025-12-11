package com.utephonehub.backend.service;

import com.utephonehub.backend.dto.request.payment.CreatePaymentRequest;
import com.utephonehub.backend.dto.response.payment.AdminPaymentListResponse;
import com.utephonehub.backend.dto.response.payment.PaymentHistoryResponse;
import com.utephonehub.backend.dto.response.payment.PaymentResponse;
import com.utephonehub.backend.dto.response.payment.VNPayPaymentResponse;
import com.utephonehub.backend.enums.PaymentMethod;
import com.utephonehub.backend.enums.PaymentStatus;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;

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
     * Get payment history for customer
     */
    PaymentHistoryResponse getCustomerPaymentHistory(Long userId, int page, int size);
}
