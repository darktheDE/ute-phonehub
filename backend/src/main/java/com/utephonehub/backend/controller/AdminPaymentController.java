package com.utephonehub.backend.controller;

import com.utephonehub.backend.dto.ApiResponse;
import com.utephonehub.backend.dto.response.payment.AdminPaymentListResponse;
import com.utephonehub.backend.enums.PaymentMethod;
import com.utephonehub.backend.enums.PaymentStatus;
import com.utephonehub.backend.service.IPaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin Payment", description = "Admin Payment Management APIs")
@SecurityRequirement(name = "Bearer Authentication")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPaymentController {
    
    private final IPaymentService paymentService;
    
    /**
     * Get all payments with filtering for admin
     */
    @GetMapping
    @Operation(
        summary = "Get all payments (Admin)", 
        description = "Get paginated list of all payments. Leave filters empty to get all payments."
    )
    public ResponseEntity<ApiResponse<AdminPaymentListResponse>> getAdminPayments(
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(required = false) PaymentMethod paymentMethod,
            @RequestParam(required = false) String provider,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") java.time.LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") java.time.LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        // Convert LocalDate to LocalDateTime if provided
        LocalDateTime startDateTime = startDate != null ? startDate.atStartOfDay() : null;
        LocalDateTime endDateTime = endDate != null ? endDate.atTime(23, 59, 59) : null;
        
        log.info("Admin getting payments - status: {}, method: {}, provider: {}, startDate: {}, endDate: {}, page: {}, size: {}", 
                status, paymentMethod, provider, startDate, endDate, page, size);
        
        AdminPaymentListResponse response = paymentService.getAdminPayments(
                status, paymentMethod, provider, startDateTime, endDateTime, page, size);
        
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", response));
    }
}
