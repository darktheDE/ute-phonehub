package com.utephonehub.backend.service;

import com.utephonehub.backend.dto.request.payment.CreatePaymentRequest;
import com.utephonehub.backend.dto.response.payment.PaymentResponse;
import com.utephonehub.backend.dto.response.payment.VNPayPaymentResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface IVNPayService {
    
    /**
     * Create VNPay payment URL
     */
    VNPayPaymentResponse createPaymentUrl(CreatePaymentRequest request, HttpServletRequest servletRequest);
    
    /**
     * Handle VNPay payment callback/return
     */
    PaymentResponse handleCallback(HttpServletRequest request);
}
