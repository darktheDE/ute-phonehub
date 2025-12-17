package com.utephonehub.backend.service.impl;

import com.utephonehub.backend.dto.request.order.CreateOrderRequest;
import com.utephonehub.backend.dto.request.order.OrderItemRequest;
import com.utephonehub.backend.dto.response.order.CreateOrderResponse;
import com.utephonehub.backend.dto.response.order.OrderResponse;
import com.utephonehub.backend.entity.Order;
import com.utephonehub.backend.entity.OrderItem;
import com.utephonehub.backend.entity.Payment;
import com.utephonehub.backend.entity.Product;
import com.utephonehub.backend.entity.Promotion;
import com.utephonehub.backend.entity.User;
import com.utephonehub.backend.enums.OrderStatus;
import com.utephonehub.backend.enums.PaymentMethod;
import com.utephonehub.backend.enums.PaymentStatus;
import com.utephonehub.backend.exception.BadRequestException;
import com.utephonehub.backend.exception.ForbiddenException;
import com.utephonehub.backend.exception.ResourceNotFoundException;
import com.utephonehub.backend.mapper.OrderMapper;
import com.utephonehub.backend.entity.CartItem;
import com.utephonehub.backend.entity.Cart;
import com.utephonehub.backend.repository.CartItemRepository;
import com.utephonehub.backend.repository.CartRepository;
import com.utephonehub.backend.repository.OrderItemRepository;
import com.utephonehub.backend.repository.OrderRepository;
import com.utephonehub.backend.repository.PaymentRepository;
import com.utephonehub.backend.repository.ProductRepository;
import com.utephonehub.backend.repository.PromotionRepository;
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
    private final PromotionRepository promotionRepository;
    private final PaymentRepository paymentRepository;
    private final OrderMapper orderMapper;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    
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
        return orderMapper.toOrderResponse(order); 
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
        
        // 5. Áp dụng promotion nếu có
        Promotion promotion = null;
        if (request.getPromotionId() != null) {
            promotion = promotionRepository.findById(String.valueOf(request.getPromotionId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Promotion không tồn tại"));
            
            // TODO: Validate promotion còn hiệu lực, đủ điều kiện áp dụng
            // Tính discount và trừ vào totalAmount (sẽ implement sau)
        }
        
        // 6. Tạo orderCode unique
        String orderCode = generateUniqueOrderCode();
        
        // 7. Xác định trạng thái đơn hàng
        OrderStatus initialStatus = request.getPaymentMethod() == PaymentMethod.VNPAY
                ? OrderStatus.PENDING
                : OrderStatus.CONFIRMED;
        
        // 8. Tạo Order entity
        Order order = Order.builder()
                .orderCode(orderCode)
                .user(user)
                .email(request.getEmail())
                .recipientName(request.getRecipientName())
                .phoneNumber(request.getPhoneNumber())
                .shippingAddress(request.getShippingAddress())
                .shippingFee(request.getShippingFee())
                .shippingUnit(request.getShippingUnit())
                .note(request.getNote())
                .status(initialStatus)
                .paymentMethod(request.getPaymentMethod())
                .totalAmount(totalAmount)
                .promotion(promotion)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        // 9. Lưu Order
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
        // 10. Tạo Payment record cho COD/Bank Transfer (VNPay sẽ tạo trong callback)
        if (request.getPaymentMethod() != PaymentMethod.VNPAY) {
            // 10.1. Giảm tồn kho ngay (thanh toán trực tiếp)
            for (OrderItemRequest itemReq : validatedItems) {
                Product product = productMap.get(itemReq.getProductId());
                product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
                productRepository.save(product);
            }
            
            // 10.2. Tạo Payment record với status SUCCESS (đã thanh toán)
            Payment payment = Payment.builder()
                    .order(order)
                    .provider(null)  // COD/Bank Transfer không có provider
                    .transactionId(null)  // Không có transaction ID
                    .amount(totalAmount)
                    .status(PaymentStatus.SUCCESS)  // Thanh toán ngay = SUCCESS
                    .note("Thanh toán " + request.getPaymentMethod().name())
                    .reconciled(false)
                    .build();
            paymentRepository.save(payment);
            log.info("Created payment record for COD/Bank Transfer: orderId={}, amount={}", 
                    order.getId(), totalAmount);
        }

        // 11.1. AF2 – After successfully creating the order, automatically remove
        // the corresponding CartItems in the cart (do not delete the entire cart).
        try {
            List<Long> orderedProductIds = validatedItems.stream()
                    .map(OrderItemRequest::getProductId)
                    .toList();

            cartRepository.findByUserIdWithItems(userId).ifPresent(cart -> {
                List<CartItem> toRemove = cart.getItemsInternal().stream()
                        .filter(item -> orderedProductIds.contains(item.getProduct().getId()))
                        .toList();

                if (!toRemove.isEmpty()) {
                    log.info("Clearing {} ordered items from cart for user {} after order {}",
                            toRemove.size(), userId, orderCode);

                    toRemove.forEach(cart::removeItem);
                    cartItemRepository.deleteAll(toRemove);
                    cartRepository.save(cart);
                }
            });
        } catch (Exception ex) {
            // Don't let cart clearing errors fail the order
            log.error("Failed to clear ordered items from cart for user {} after order {}", userId, orderCode, ex);
        }
        
        // 12. Create response
        CreateOrderResponse response = CreateOrderResponse.builder()
                .orderId(order.getId())
                .orderCode(orderCode)
                .status(initialStatus)
                .paymentMethod(request.getPaymentMethod())
                .totalAmount(totalAmount)
                .createdAt(order.getCreatedAt())
                .build();
        
        // 13. If payment method is VNPay, add instruction message
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
     * Format: ORD_YYMMDDHHMMSS (20 chars max)
     * Example: ORD_251207093853
     */
    private String generateUniqueOrderCode() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        String orderCode = "ORD_" + timestamp;
        
        // Kiểm tra trùng lặp (rất hiếm khi xảy ra)
        int counter = 1;
        String uniqueCode = orderCode;
        while (orderRepository.existsByOrderCode(uniqueCode)) {
            uniqueCode = orderCode + counter;
            counter++;
        }
        
        return uniqueCode;
    }
}