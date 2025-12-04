package com.utephonehub.backend.service.impl;

import com.utephonehub.backend.dto.request.order.CreateOrderRequest;
import com.utephonehub.backend.dto.request.order.OrderItemRequest;
import com.utephonehub.backend.dto.response.order.CreateOrderResponse;
import com.utephonehub.backend.dto.response.order.OrderResponse;
import com.utephonehub.backend.entity.Order;
import com.utephonehub.backend.entity.OrderItem;
import com.utephonehub.backend.entity.Product;
import com.utephonehub.backend.entity.User;
import com.utephonehub.backend.enums.OrderStatus;
import com.utephonehub.backend.enums.PaymentMethod;
import com.utephonehub.backend.exception.BadRequestException;
import com.utephonehub.backend.exception.ForbiddenException;
import com.utephonehub.backend.exception.ResourceNotFoundException;
import com.utephonehub.backend.mapper.OrderMapper;
import com.utephonehub.backend.repository.OrderItemRepository;
import com.utephonehub.backend.repository.OrderRepository;
import com.utephonehub.backend.repository.ProductRepository;
import com.utephonehub.backend.repository.UserRepository;
import com.utephonehub.backend.service.IOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements IOrderService {
    
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;
    
    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId, Long userId) {
        
        // 1. Tìm Order kèm items
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> {
                    log.error("Order not found with id: {}", orderId);
                    return new ResourceNotFoundException("Đơn hàng không tồn tại");
                });
        
        // 2. Kiểm tra quyền sở hữu
        if (!order.getUser().getId().equals(userId)) {
            log.warn("User {} tried to access order {} owned by user {}", 
                    userId, orderId, order.getUser().getId());
            throw new ForbiddenException("Bạn không có quyền xem đơn hàng này");
        }
        
        // 3. Convert sang DTO bằng Mapper
        log.info("Get order {} by user {}", orderId, userId);
        return orderMapper.toOrderResponse(order); // ✅ Dùng mapper
    }
    
    @Override
    @Transactional
    public CreateOrderResponse createOrder(CreateOrderRequest request, Long userId) {
        log.info("Creating order for user: {}", userId);
        
        // 1. Validate user tồn tại
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User không tồn tại"));
        
        // 2. Validate danh sách sản phẩm
        List<Long> productIds = request.getItems().stream()
                .map(OrderItemRequest::getProductId)
                .collect(Collectors.toList());
        
        List<Product> products = productRepository.findAllByIdIn(productIds);
        
        if (products.size() != productIds.size()) {
            throw new BadRequestException("Một số sản phẩm không tồn tại");
        }
        
        // 3. Map product theo ID để dễ tìm kiếm
        Map<Long, Product> productMap = products.stream()
                .collect(Collectors.toMap(Product::getId, p -> p));
        
        // 4. Validate tồn kho và tính tổng tiền
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItemRequest> validatedItems = new ArrayList<>();
        
        for (OrderItemRequest item : request.getItems()) {
            Product product = productMap.get(item.getProductId());
            
            // Kiểm tra tồn kho
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new BadRequestException(
                    String.format("Sản phẩm '%s' chỉ còn %d sản phẩm trong kho", 
                        product.getName(), product.getStockQuantity())
                );
            }
            
            // Tính tổng tiền
            BigDecimal itemTotal = product.getPrice().multiply(new BigDecimal(item.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
            
            validatedItems.add(item);
        }
        
        // 5. Tạo orderCode unique
        String orderCode = generateUniqueOrderCode();
        
        // 6. Xác định trạng thái đơn hàng
        OrderStatus initialStatus = request.getPaymentMethod() == PaymentMethod.VNPAY
                ? OrderStatus.WAITING_PAYMENT
                : OrderStatus.PROCESSING;
        
        // 7. Tạo Order entity
        Order order = Order.builder()
                .orderCode(orderCode)
                .user(user)
                .email(request.getEmail())
                .recipientName(request.getRecipientName())
                .phoneNumber(request.getPhoneNumber())
                .streetAddress(request.getStreetAddress())
                .city(request.getCity())
                .status(initialStatus)
                .paymentMethod(request.getPaymentMethod())
                .totalAmount(totalAmount)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        // 8. Lưu Order
        order = orderRepository.save(order);
        log.info("Created order: {}", orderCode);
        
        // 9. Tạo OrderItems
        for (OrderItemRequest itemReq : validatedItems) {
            Product product = productMap.get(itemReq.getProductId());
            
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .price(product.getPrice())
                    .createdAt(LocalDateTime.now())
                    .build();
            
            orderItemRepository.save(orderItem);
        }
        
        // 10. Giảm tồn kho (nếu thanh toán COD/Bank Transfer - thanh toán ngay)
        if (request.getPaymentMethod() != PaymentMethod.VNPAY) {
            for (OrderItemRequest itemReq : validatedItems) {
                Product product = productMap.get(itemReq.getProductId());
                product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
                productRepository.save(product);
            }
        }
        
        // 11. Tạo response
        CreateOrderResponse response = CreateOrderResponse.builder()
                .orderId(order.getId())
                .orderCode(orderCode)
                .status(initialStatus)
                .paymentMethod(request.getPaymentMethod())
                .totalAmount(totalAmount)
                .createdAt(order.getCreatedAt())
                .build();
        
        // 12. Nếu thanh toán VNPay, thêm message hướng dẫn
        if (request.getPaymentMethod() == PaymentMethod.VNPAY) {
            response.setMessage("Đơn hàng đã tạo. Vui lòng thanh toán qua VNPay.");
            // TODO: Tích hợp VNPay payment URL (sẽ làm sau)
            response.setPaymentUrl(null);
        } else {
            response.setMessage("Đơn hàng đã được tạo thành công!");
        }
        
        log.info("Order created successfully: {}", orderCode);
        return response;
    }
    
    /**
     * Generate unique order code
     * Format: ORD_YYYYMMDD_HHMMSS_XXXX
     */
    private String generateUniqueOrderCode() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String random = String.format("%04d", new Random().nextInt(10000));
        String orderCode = "ORD_" + timestamp + "_" + random;
        
        // Kiểm tra trùng lặp (rất hiếm khi xảy ra)
        while (orderRepository.existsByOrderCode(orderCode)) {
            random = String.format("%04d", new Random().nextInt(10000));
            orderCode = "ORD_" + timestamp + "_" + random;
        }
        
        return orderCode;
    }
}