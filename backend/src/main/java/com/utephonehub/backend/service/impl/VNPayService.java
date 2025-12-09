package com.utephonehub.backend.service.impl;

import com.utephonehub.backend.config.VNPayConfig;
import com.utephonehub.backend.dto.request.payment.CreatePaymentRequest;
import com.utephonehub.backend.dto.response.payment.PaymentResponse;
import com.utephonehub.backend.dto.response.payment.VNPayPaymentResponse;
import com.utephonehub.backend.entity.Order;
import com.utephonehub.backend.entity.Payment;
import com.utephonehub.backend.enums.EWalletProvider;
import com.utephonehub.backend.enums.OrderStatus;
import com.utephonehub.backend.enums.PaymentStatus;
import com.utephonehub.backend.exception.BadRequestException;
import com.utephonehub.backend.exception.ResourceNotFoundException;
import com.utephonehub.backend.repository.OrderRepository;
import com.utephonehub.backend.repository.PaymentRepository;
import com.utephonehub.backend.service.IPaymentService;
import com.utephonehub.backend.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class VNPayService implements IPaymentService {
    
    private final VNPayConfig vnPayConfig;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    
    @Override
    @Transactional
    public VNPayPaymentResponse createPayment(CreatePaymentRequest request, HttpServletRequest servletRequest) {
        log.info("Creating VNPay payment for order: {}", request.getOrderId());
        
        // 1. Validate order exists
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + request.getOrderId()));
        
        // 2. Validate order status
        if (order.getStatus() != OrderStatus.WAITING_PAYMENT) {
            throw new BadRequestException("Order is not in WAITING_PAYMENT status");
        }
        
        // 3. Validate amount matches order total
        long amountInVND = request.getAmount();
        long expectedAmount = order.getTotalAmount().longValue();
        if (amountInVND != expectedAmount) {
            throw new BadRequestException("Payment amount does not match order total");
        }
        
        try {
            // 4. Build VNPay parameters
            Map<String, String> vnpParams = new HashMap<>();
            vnpParams.put("vnp_Version", vnPayConfig.getVersion());
            vnpParams.put("vnp_Command", vnPayConfig.getCommand());
            vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());
            vnpParams.put("vnp_Amount", String.valueOf(amountInVND * 100)); // VNPay requires amount * 100
            vnpParams.put("vnp_CurrCode", "VND");
            
            // Use order code as transaction reference
            vnpParams.put("vnp_TxnRef", order.getOrderCode());
            
            String orderInfo = request.getOrderInfo() != null 
                ? request.getOrderInfo() 
                : "Thanh toan don hang " + order.getOrderCode();
            vnpParams.put("vnp_OrderInfo", orderInfo);
            vnpParams.put("vnp_OrderType", vnPayConfig.getOrderType());
            
            String locale = request.getLocale() != null ? request.getLocale() : "vn";
            vnpParams.put("vnp_Locale", locale);
            
            vnpParams.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
            vnpParams.put("vnp_IpAddr", getIpAddress(servletRequest));
            
            // 5. Set create date and expire date (Vietnam time GMT+7)
            Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            formatter.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            String vnpCreateDate = formatter.format(calendar.getTime());
            vnpParams.put("vnp_CreateDate", vnpCreateDate);
            
            calendar.add(Calendar.MINUTE, 15); // Payment expires in 15 minutes
            String vnpExpireDate = formatter.format(calendar.getTime());
            vnpParams.put("vnp_ExpireDate", vnpExpireDate);
            
            // 6. Build query URL
            String queryUrl = VNPayUtil.buildQuery(vnpParams);
            
            // 7. Build hash data for signature
            String hashData = VNPayUtil.buildHashData(vnpParams);
            String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashData);
            
            // Debug logging
            log.info("=== VNPay Debug Info ===");
            log.info("Hash Secret: {}", vnPayConfig.getHashSecret());
            log.info("Hash Data: {}", hashData);
            log.info("Secure Hash: {}", vnpSecureHash);
            log.info("========================");
            
            // 8. Final payment URL
            String paymentUrl = vnPayConfig.getVnpayUrl() + "?" + queryUrl + "&vnp_SecureHash=" + vnpSecureHash;
            
            log.info("VNPay payment URL created successfully for order: {}", order.getOrderCode());
            
            return VNPayPaymentResponse.builder()
                    .code("00")
                    .message("Success")
                    .paymentUrl(paymentUrl)
                    .build();
                    
        } catch (Exception e) {
            log.error("Error creating VNPay payment", e);
            throw new RuntimeException("Error creating VNPay payment: " + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public PaymentResponse handlePaymentCallback(HttpServletRequest request) {
        log.info("Handling VNPay payment callback");
        
        // 1. Get all parameters from VNPay
        Map<String, String> fields = new HashMap<>();
        for (String param : request.getParameterMap().keySet()) {
            String value = request.getParameter(param);
            if (value != null && !value.isEmpty()) {
                fields.put(param, value);
            }
        }
        
        // 2. Get secure hash from VNPay
        String vnpSecureHash = request.getParameter("vnp_SecureHash");
        
        // 3. Remove hash fields before verification
        fields.remove("vnp_SecureHashType");
        fields.remove("vnp_SecureHash");
        
        // 4. Verify signature
        String hashData = VNPayUtil.buildHashData(fields);
        String calculatedHash = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashData);
        
        if (!calculatedHash.equals(vnpSecureHash)) {
            log.error("Invalid VNPay signature");
            throw new BadRequestException("Invalid payment signature");
        }
        
        // 5. Get transaction info
        String vnpTxnRef = request.getParameter("vnp_TxnRef"); // This is orderCode
        String vnpTransactionNo = request.getParameter("vnp_TransactionNo");
        String vnpResponseCode = request.getParameter("vnp_ResponseCode");
        String vnpTransactionStatus = request.getParameter("vnp_TransactionStatus");
        long vnpAmount = Long.parseLong(request.getParameter("vnp_Amount")) / 100; // Convert back from VNPay format
        
        // 6. Find order by order code
        Order order = orderRepository.findByOrderCode(vnpTxnRef)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with code: " + vnpTxnRef));
        
        // 7. Create or update payment record
        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElse(Payment.builder()
                        .order(order)
                        .provider(EWalletProvider.VNPAY)
                        .amount(BigDecimal.valueOf(vnpAmount))
                        .status(PaymentStatus.PENDING)
                        .createdAt(LocalDateTime.now())
                        .build());
        
        payment.setTransactionId(vnpTransactionNo);
        
        // 8. Update payment and order status based on VNPay response
        if ("00".equals(vnpResponseCode) && "00".equals(vnpTransactionStatus)) {
            // Payment successful
            payment.setStatus(PaymentStatus.SUCCESS);
            order.setStatus(OrderStatus.CONFIRMED);
            log.info("Payment successful for order: {}", order.getOrderCode());
        } else {
            // Payment failed
            payment.setStatus(PaymentStatus.FAILED);
            order.setStatus(OrderStatus.CANCELLED);
            log.warn("Payment failed for order: {} with response code: {}", order.getOrderCode(), vnpResponseCode);
        }
        
        paymentRepository.save(payment);
        orderRepository.save(order);
        
        // 9. Return payment response
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(order.getId())
                .provider(payment.getProvider() != null ? payment.getProvider().name() : null)
                .transactionId(payment.getTransactionId())
                .amount(payment.getAmount().longValue())
                .status(payment.getStatus().name())
                .createdAt(payment.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();
    }
    
    @Override
    public PaymentResponse getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order ID: " + orderId));
        
        return mapToResponse(payment);
    }
    
    @Override
    public PaymentResponse getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));
        
        return mapToResponse(payment);
    }
    
    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .provider(payment.getProvider() != null ? payment.getProvider().name() : null)
                .transactionId(payment.getTransactionId())
                .amount(payment.getAmount().longValue())
                .status(payment.getStatus().name())
                .createdAt(payment.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();
    }
    
    private String getIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-FORWARDED-FOR");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }
        return ipAddress;
    }
}
