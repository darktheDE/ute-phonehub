package com.utephonehub.backend.controller;

import com.utephonehub.backend.dto.ApiResponse;
import com.utephonehub.backend.dto.request.order.CreateOrderRequest;
import com.utephonehub.backend.dto.response.order.CreateOrderResponse;
import com.utephonehub.backend.dto.response.order.OrderResponse;
import com.utephonehub.backend.service.IOrderService;
import com.utephonehub.backend.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Order", description = "API quản lý đơn hàng")
public class OrderController {
    
    private final IOrderService orderService;
    private final SecurityUtils securityUtils;
    
    /**
     * GET /api/v1/orders/{orderId}
     * Lấy thông tin đơn hàng theo ID
     */
    @GetMapping("/{orderId}")
    @Operation(
        summary = "Lấy thông tin đơn hàng",
        description = "User chỉ có thể xem đơn hàng của chính mình"
    )
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @PathVariable Long orderId,
            HttpServletRequest request) {
        
        // Lấy userId từ JWT token
        Long userId = securityUtils.getCurrentUserId(request);
        
        // Gọi service
        OrderResponse response = orderService.getOrderById(orderId, userId);
        
        // Trả về response
        return ResponseEntity.ok(
            ApiResponse.success("Lấy thông tin đơn hàng thành công", response)
        );
    }
    
    /**
     * POST /api/v1/orders
     * Tạo đơn hàng mới
     */
    @PostMapping
    @Operation(
        summary = "Tạo đơn hàng mới",
        description = "Tạo đơn hàng với danh sách sản phẩm. Hỗ trợ COD, VNPay, Bank Transfer."
    )
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<ApiResponse<CreateOrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            HttpServletRequest httpRequest) {
        
        // Lấy userId từ JWT token
        Long userId = securityUtils.getCurrentUserId(httpRequest);
        
        // Gọi service tạo đơn hàng
        CreateOrderResponse response = orderService.createOrder(request, userId);
        
        // Trả về response với status 201 Created
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo đơn hàng thành công", response));
    }
}
