package com.utephonehub.backend.service.impl;

import com.utephonehub.backend.dto.request.cart.AddToCartRequest;
import com.utephonehub.backend.dto.request.cart.MergeGuestCartRequest;
import com.utephonehub.backend.dto.request.cart.UpdateCartItemRequest;
import com.utephonehub.backend.dto.response.cart.CartResponse;
import com.utephonehub.backend.dto.response.cart.MergeCartResponse;
import com.utephonehub.backend.entity.Cart;
import com.utephonehub.backend.entity.CartItem;
import com.utephonehub.backend.entity.Product;
import com.utephonehub.backend.entity.User;
import com.utephonehub.backend.event.CartUpdatedEvent;
import com.utephonehub.backend.exception.*;
import com.utephonehub.backend.repository.CartItemRepository;
import com.utephonehub.backend.repository.CartRepository;
import com.utephonehub.backend.repository.ProductRepository;
import com.utephonehub.backend.repository.UserRepository;
import com.utephonehub.backend.service.ICartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.StaleObjectStateException;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartServiceImpl implements ICartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    private static final int MAX_QUANTITY_PER_PRODUCT = 10;
    private static final int BATCH_DELETE_SIZE = 50;
    private static final int MAX_RETRY_ATTEMPTS = 3;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "cart", key = "#userId", unless = "#result == null")
    public CartResponse getCurrentCart(Long userId) {
        log.info("Getting cart for user: {}", userId);
        
        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseGet(() -> {
                    log.info("Creating new cart for user: {}", userId);
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));
                    
                    Cart newCart = Cart.builder()
                            .user(user)
                            .items(new ArrayList<>())
                            .build();
                    return cartRepository.save(newCart);
                });

        // Auto-remove items with deleted products (UC 1.2 Alternate 4.A.1)
        List<CartItem> invalidItems = cart.getItems().stream()
                .filter(item -> item.getProduct() == null || item.getProduct().getId() == null)
                .toList();
        
        if (!invalidItems.isEmpty()) {
            log.warn("Found {} invalid items in cart, removing...", invalidItems.size());
            cart.getItems().removeAll(invalidItems);
            cartItemRepository.deleteAll(invalidItems);
            cartRepository.save(cart);
        }

        return CartResponse.fromEntity(cart);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    @CacheEvict(value = "cart", key = "#userId")
    @Retryable(
        retryFor = {OptimisticLockingFailureException.class, ObjectOptimisticLockingFailureException.class, StaleObjectStateException.class},
        maxAttempts = MAX_RETRY_ATTEMPTS,
        backoff = @Backoff(delay = 100, multiplier = 2)
    )
    public CartResponse addToCart(Long userId, AddToCartRequest request) {
        log.info("Adding product {} to cart for user: {}", request.getProductId(), userId);

        try {
            // Validate user
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

            // Validate product exists and is active
            Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại"));

            // Check stock quantity
            if (product.getStockQuantity() < request.getQuantity()) {
                throw new OutOfStockException(
                    product.getId(),
                    product.getName(),
                    request.getQuantity(),
                    product.getStockQuantity()
                );
            }

            // Get or create cart
            Cart cart = cartRepository.findByUserIdWithItems(userId)
                    .orElseGet(() -> {
                        Cart newCart = Cart.builder()
                                .user(user)
                                .items(new ArrayList<>())
                                .build();
                        return cartRepository.save(newCart);
                    });

            // Check if product already in cart
            Optional<CartItem> existingItem = cart.getItems().stream()
                    .filter(item -> item.getProduct().getId().equals(product.getId()))
                    .findFirst();

            if (existingItem.isPresent()) {
                // Update quantity
                CartItem item = existingItem.get();
                int newQuantity = item.getQuantity() + request.getQuantity();

                if (newQuantity > MAX_QUANTITY_PER_PRODUCT) {
                    throw new MaxQuantityExceededException(MAX_QUANTITY_PER_PRODUCT, newQuantity);
                }

                if (newQuantity > product.getStockQuantity()) {
                    throw new OutOfStockException(
                        product.getId(),
                        product.getName(),
                        newQuantity,
                        product.getStockQuantity()
                    );
                }

                item.setQuantity(newQuantity);
                cartItemRepository.save(item);
                
                // Publish event
                publishCartEvent(cart, "UPDATED", product, newQuantity);
            } else {
                // Add new item
                CartItem newItem = CartItem.builder()
                        .cart(cart)
                        .product(product)
                        .quantity(request.getQuantity())
                        .build();
                cartItemRepository.save(newItem);
                cart.getItems().add(newItem);
                
                // Publish event
                publishCartEvent(cart, "ADDED", product, request.getQuantity());
            }

            cartRepository.save(cart);
            return CartResponse.fromEntity(cart);
            
        } catch (OptimisticLockingFailureException | StaleObjectStateException ex) {
            log.warn("Optimistic locking conflict detected, retrying... Attempt: {}", ex.getClass().getSimpleName());
            throw ex; // Let @Retryable handle it
        }
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    @CacheEvict(value = "cart", key = "#userId")
    @Retryable(
        retryFor = {OptimisticLockingFailureException.class, ObjectOptimisticLockingFailureException.class, StaleObjectStateException.class},
        maxAttempts = MAX_RETRY_ATTEMPTS,
        backoff = @Backoff(delay = 100, multiplier = 2)
    )
    public CartResponse updateCartItem(Long userId, Long cartItemId, UpdateCartItemRequest request) {
        log.info("Updating cart item {} for user: {}", cartItemId, userId);

        try {
            // Get cart item and validate ownership
            CartItem cartItem = cartItemRepository.findById(cartItemId)
                    .orElseThrow(() -> new ResourceNotFoundException("Cart item không tồn tại"));

            if (!cartItem.getCart().getUser().getId().equals(userId)) {
                throw new UnauthorizedException("Không có quyền thực hiện thao tác này");
            }

            // If quantity is 0, remove item
            if (request.getQuantity() == 0) {
                return removeCartItem(userId, cartItemId);
            }

            // Check stock quantity
            Product product = cartItem.getProduct();
            if (product.getStockQuantity() < request.getQuantity()) {
                throw new OutOfStockException(
                    product.getId(),
                    product.getName(),
                    request.getQuantity(),
                    product.getStockQuantity()
                );
            }

            // Update quantity
            cartItem.setQuantity(request.getQuantity());
            cartItemRepository.save(cartItem);

            Cart cart = cartItem.getCart();
            cartRepository.save(cart);
            
            // Publish event
            publishCartEvent(cart, "UPDATED", product, request.getQuantity());
            
            return CartResponse.fromEntity(cart);
            
        } catch (OptimisticLockingFailureException | StaleObjectStateException ex) {
            log.warn("Optimistic locking conflict detected, retrying...");
            throw ex;
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = "cart", key = "#userId")
    public CartResponse removeCartItem(Long userId, Long cartItemId) {
        log.info("Removing cart item {} for user: {}", cartItemId, userId);

        // Get cart item and validate ownership
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item không tồn tại"));

        if (!cartItem.getCart().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Không có quyền thực hiện thao tác này");
        }

        Cart cart = cartItem.getCart();
        Product product = cartItem.getProduct();
        
        cart.getItems().remove(cartItem);
        cartItemRepository.delete(cartItem);
        cartRepository.save(cart);
        
        // Publish event
        publishCartEvent(cart, "REMOVED", product, 0);

        return CartResponse.fromEntity(cart);
    }

    @Override
    @Transactional
    @CacheEvict(value = "cart", key = "#userId")
    public CartResponse clearCart(Long userId) {
        log.info("Clearing cart for user: {}", userId);

        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng không tồn tại"));

        List<CartItem> items = new ArrayList<>(cart.getItems());
        int totalItems = items.size();
        
        // Batch delete for large carts (UC 1.5 Exception 8.1)
        if (totalItems > BATCH_DELETE_SIZE) {
            log.info("Large cart detected ({}+ items), using batch delete", BATCH_DELETE_SIZE);
            
            for (int i = 0; i < totalItems; i += BATCH_DELETE_SIZE) {
                int toIndex = Math.min(i + BATCH_DELETE_SIZE, totalItems);
                List<CartItem> batch = items.subList(i, toIndex);
                cartItemRepository.deleteAll(batch);
                log.info("Deleted batch: {}/{}", toIndex, totalItems);
            }
        } else {
            // Normal delete
            cartItemRepository.deleteAll(items);
        }
        
        cart.getItems().clear();
        cartRepository.save(cart);
        
        // Publish event
        publishCartEvent(cart, "CLEARED", null, 0);

        return CartResponse.fromEntity(cart);
    }

    @Override
    @Transactional
    @CacheEvict(value = "cart", key = "#userId")
    public MergeCartResponse mergeGuestCart(Long userId, MergeGuestCartRequest request) {
        log.info("Merging guest cart for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .user(user)
                            .items(new ArrayList<>())
                            .build();
                    return cartRepository.save(newCart);
                });

        int mergedCount = 0;
        int skippedCount = 0;

        for (MergeGuestCartRequest.GuestCartItem guestItem : request.getGuestCartItems()) {
            try {
                // Validate product
                Product product = productRepository.findById(guestItem.getProductId())
                        .orElse(null);
                
                if (product == null) {
                    log.warn("Product {} not found, skipping", guestItem.getProductId());
                    skippedCount++;
                    continue;
                }

                // Check stock
                if (product.getStockQuantity() < guestItem.getQuantity()) {
                    log.warn("Product {} out of stock, skipping", guestItem.getProductId());
                    skippedCount++;
                    continue;
                }

                // Check if already in cart
                Optional<CartItem> existingItem = cart.getItems().stream()
                        .filter(item -> item.getProduct().getId().equals(product.getId()))
                        .findFirst();

                if (existingItem.isPresent()) {
                    // Merge quantity
                    CartItem item = existingItem.get();
                    int newQuantity = Math.min(
                        item.getQuantity() + guestItem.getQuantity(),
                        MAX_QUANTITY_PER_PRODUCT
                    );
                    
                    if (newQuantity <= product.getStockQuantity()) {
                        item.setQuantity(newQuantity);
                        cartItemRepository.save(item);
                        mergedCount++;
                    } else {
                        skippedCount++;
                    }
                } else {
                    // Add new item
                    CartItem newItem = CartItem.builder()
                            .cart(cart)
                            .product(product)
                            .quantity(Math.min(guestItem.getQuantity(), MAX_QUANTITY_PER_PRODUCT))
                            .build();
                    cartItemRepository.save(newItem);
                    cart.getItems().add(newItem);
                    mergedCount++;
                }
            } catch (Exception ex) {
                log.error("Error merging guest cart item: {}", guestItem.getProductId(), ex);
                skippedCount++;
            }
        }

        cartRepository.save(cart);
        
        String message = String.format("Đã đồng bộ %d sản phẩm từ giỏ hàng tạm", mergedCount);
        if (skippedCount > 0) {
            message += String.format(". %d sản phẩm bị bỏ qua do hết hàng hoặc không tồn tại", skippedCount);
        }

        return MergeCartResponse.builder()
                .cart(CartResponse.fromEntity(cart))
                .mergedItemsCount(mergedCount)
                .skippedItemsCount(skippedCount)
                .message(message)
                .build();
    }

    private void publishCartEvent(Cart cart, String eventType, Product product, Integer quantity) {
        try {
            CartResponse cartResponse = CartResponse.fromEntity(cart);
            
            CartUpdatedEvent event = CartUpdatedEvent.builder()
                    .cartId(cart.getId())
                    .userId(cart.getUser().getId())
                    .eventType(eventType)
                    .productId(product != null ? product.getId() : null)
                    .productName(product != null ? product.getName() : null)
                    .quantity(quantity)
                    .totalAmount(cartResponse.getTotalAmount())
                    .itemCount(cartResponse.getItemCount())
                    .timestamp(LocalDateTime.now())
                    .build();
            
            eventPublisher.publishEvent(event);
            log.debug("Published CartUpdatedEvent: {}", eventType);
        } catch (Exception ex) {
            log.error("Error publishing cart event", ex);
            // Don't fail the transaction due to event publishing failure
        }
    }
}
