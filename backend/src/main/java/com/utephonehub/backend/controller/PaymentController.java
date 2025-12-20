package com.utephonehub.backend.controller;

import com.utephonehub.backend.dto.ApiResponse;
import com.utephonehub.backend.dto.request.payment.CreatePaymentRequest;
import com.utephonehub.backend.dto.response.payment.PaymentHistoryResponse;
import com.utephonehub.backend.dto.response.payment.PaymentResponse;
import com.utephonehub.backend.dto.response.payment.VNPayPaymentResponse;
import com.utephonehub.backend.service.IPaymentService;
import com.utephonehub.backend.service.IVNPayService;
import com.utephonehub.backend.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payment", description = "Payment Management APIs")
public class PaymentController {
    
    private final IPaymentService paymentService;
    private final IVNPayService vnPayService;
    private final SecurityUtils securityUtils;
    
    /**
     * Create VNPay payment URL
     */
    @PostMapping("/vnpay/create")
    @Operation(summary = "Create VNPay payment URL", description = "Generate VNPay payment URL for order payment")
    public ResponseEntity<ApiResponse<VNPayPaymentResponse>> createPayment(
            @Valid @RequestBody CreatePaymentRequest request,
            HttpServletRequest servletRequest) {
        
        log.info("Creating VNPay payment for order: {}", request.getOrderId());
        String ipAddress = securityUtils.getClientIp(servletRequest);
        VNPayPaymentResponse response = vnPayService.createPaymentUrl(request, ipAddress);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Payment URL created successfully", response));
    }
    
    /**
     * VNPay payment callback (IPN - Instant Payment Notification)
     * This is called by VNPay server
     */
    @GetMapping("/vnpay/callback")
    @Operation(summary = "VNPay payment callback", description = "Handle payment callback from VNPay")
    public ResponseEntity<ApiResponse<PaymentResponse>> paymentCallback(HttpServletRequest request) {
        log.info("Received VNPay callback");
        
        PaymentResponse response = vnPayService.handleCallback(request);
        
        return ResponseEntity.ok(ApiResponse.success("Payment processed successfully", response));
    }
    
    /**
     * VNPay payment return URL (redirect to frontend)
     * This is where user is redirected after payment
     */
    @GetMapping("/vnpay/return")
    @Operation(summary = "VNPay payment return", description = "Redirect user after payment")
    public void paymentReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {
        log.info("Received VNPay return");
        
        try {
            // Process payment
            PaymentResponse paymentResponse = vnPayService.handleCallback(request);
            
            // Return HTML result page instead of redirecting to non-existent frontend
            response.setContentType("text/html; charset=UTF-8");
            String statusText = "SUCCESS".equals(paymentResponse.getStatus()) ? "THÀNH CÔNG" : "THẤT BẠI";
            String statusColor = "SUCCESS".equals(paymentResponse.getStatus()) ? "#28a745" : "#dc3545";
            
            String html = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Kết quả thanh toán</title>
                    <style>
                        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
                        .container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 500px; text-align: center; }
                        .status { font-size: 24px; font-weight: bold; color: %s; margin-bottom: 20px; }
                        .info { text-align: left; margin: 20px 0; }
                        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                        .label { font-weight: bold; color: #666; }
                        .value { color: #333; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>🎉 Kết quả thanh toán</h1>
                        <div class="status">%s</div>
                        <div class="info">
                            <div class="info-row">
                                <span class="label">Mã đơn hàng:</span>
                                <span class="value">#%d</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Mã giao dịch:</span>
                                <span class="value">%s</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Số tiền:</span>
                                <span class="value">%,d VNĐ</span>
                            </div>
                        </div>
                        <p>Đơn hàng của bạn đã được xác nhận!</p>
                    </div>
                </body>
                </html>
                """, statusColor, statusText, paymentResponse.getOrderId(), 
                    paymentResponse.getTransactionId(), paymentResponse.getAmount());
                    
            response.getWriter().write(html);
            
        } catch (Exception e) {
            log.error("Error processing payment return", e);
            response.setContentType("text/html; charset=UTF-8");
            response.getWriter().write("<h1>Lỗi xử lý thanh toán: " + e.getMessage() + "</h1>");
        }
    }
    
    /**
     * Get customer payment history
     */
    @GetMapping("/history")
    @Operation(summary = "Get customer payment history", description = "Get payment history for logged in customer with pagination")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<PaymentHistoryResponse>> getPaymentHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {
        
        Long userId = securityUtils.getCurrentUserId(request);
        log.info("Getting payment history for user: {}, page: {}, size: {}", userId, page, size);
        
        PaymentHistoryResponse response = paymentService.getCustomerPaymentHistory(userId, page, size);
        
        return ResponseEntity.ok(ApiResponse.success("Payment history retrieved successfully", response));
    }
}
