package com.utephonehub.backend.controller;

import com.utephonehub.backend.dto.ApiResponse;
import com.utephonehub.backend.dto.request.order.CreateOrderRequest;
import com.utephonehub.backend.dto.response.order.CreateOrderResponse;
import com.utephonehub.backend.dto.response.order.OrderResponse;
import com.utephonehub.backend.enums.OrderStatus;
import com.utephonehub.backend.service.IOrderService;
import com.utephonehub.backend.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    @SecurityRequirement(name = "bearerAuth")
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
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<CreateOrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            HttpServletRequest httpRequest) {
        
        // Lấy userId từ JWT token
        Long userId = securityUtils.getCurrentUserId(httpRequest);
        
        // Gọi service tạo đơn hàng
        CreateOrderResponse response = orderService.createOrder(request, userId);
        
        // Trả về response với status 201 Created
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Tạo đơn hàng thành công", response));
    }
    
    
    /**
     * GET /api/v1/orders/my-orders
     * Xem lịch sử đơn hàng của tôi
     */
    @GetMapping("/my-orders")
    @Operation(
        summary = "Xem lịch sử đơn hàng của tôi",
        description = "Lấy danh sách tất cả đơn hàng của khách hàng hiện tại, sắp xếp theo ngày tạo mới nhất"
    )
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(
            HttpServletRequest request) {
        
        // Lấy userId từ JWT token
        Long userId = securityUtils.getCurrentUserId(request);
        
        // Gọi service
        List<OrderResponse> orders = orderService.getMyOrders(userId);
        
        // Trả về response
        return ResponseEntity.ok(
            ApiResponse.success("Lấy danh sách đơn hàng thành công", orders)
        );
    }
    
    /**
     * GET /api/v1/orders/my-orders/paginated
     * Xem lịch sử đơn hàng với phân trang
     */
    @GetMapping("/my-orders/paginated")
    @Operation(
        summary = "Xem lịch sử đơn hàng (có phân trang)",
        description = "Lấy danh sách đơn hàng của khách hàng với phân trang và sắp xếp"
    )
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getMyOrdersPaginated(
            @Parameter(description = "Số trang (bắt đầu từ 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Số lượng đơn hàng mỗi trang", example = "10")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Trường sắp xếp", example = "createdAt")
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Hướng sắp xếp (asc/desc)", example = "desc")
            @RequestParam(defaultValue = "desc") String sortDir,
            HttpServletRequest request) {
        
        // Lấy userId từ JWT token
        Long userId = securityUtils.getCurrentUserId(request);
        
        // Tạo Pageable với sorting
        Sort sort = sortDir. equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest. of(page, size, sort);
        
        // Gọi service
        Page<OrderResponse> orderPage = orderService.getMyOrdersWithPagination(userId, pageable);
        
        // Trả về response
        return ResponseEntity.ok(
            ApiResponse.success("Lấy danh sách đơn hàng thành công", orderPage)
        );
    }
    
    /**
     * GET /api/v1/orders/my-orders/by-status
     * Lọc đơn hàng theo trạng thái
     */
    @GetMapping("/my-orders/by-status")
    @Operation(
        summary = "Lọc đơn hàng theo trạng thái",
        description = "Lấy danh sách đơn hàng của khách hàng theo trạng thái cụ thể"
    )
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrdersByStatus(
            @Parameter(description = "Trạng thái đơn hàng", required = true, example = "DELIVERED")
            @RequestParam OrderStatus status,
            HttpServletRequest request) {
        
        // Lấy userId từ JWT token
        Long userId = securityUtils. getCurrentUserId(request);
        
        // Gọi service
        List<OrderResponse> orders = orderService.getMyOrdersByStatus(userId, status);
        
        // Trả về response
        return ResponseEntity.ok(
            ApiResponse.success("Lọc đơn hàng theo trạng thái thành công", orders)
        );
    }
    
    /**
     * GET /api/v1/orders/my-orders/count
     * Đếm số đơn hàng của tôi
     */
    @GetMapping("/my-orders/count")
    @Operation(
        summary = "Đếm số đơn hàng của tôi",
        description = "Lấy tổng số đơn hàng của khách hàng hiện tại"
    )
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Long>> getMyOrdersCount(
            HttpServletRequest request) {
        
        // Lấy userId từ JWT token
        Long userId = securityUtils.getCurrentUserId(request);
        
        // Gọi service
        long count = orderService. getMyOrdersCount(userId);
        
        // Trả về response
        return ResponseEntity.ok(
            ApiResponse.success("Đếm số đơn hàng thành công", count)
        );
    }
    
}
