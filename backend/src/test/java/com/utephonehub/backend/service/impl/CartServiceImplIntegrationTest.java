package com.utephonehub.backend.service.impl;

import com.utephonehub.backend.dto.request.cart.AddToCartRequest;
import com.utephonehub.backend.dto.request.cart.MergeGuestCartRequest;
import com.utephonehub.backend.dto.request.cart.UpdateCartItemRequest;
import com.utephonehub.backend.dto.response.cart.CartResponse;
import com.utephonehub.backend.dto.response.cart.MergeCartResponse;
import com.utephonehub.backend.entity.Cart;
import com.utephonehub.backend.entity.Product;
import com.utephonehub.backend.entity.ProductTemplate;
import com.utephonehub.backend.entity.User;
import com.utephonehub.backend.exception.MaxQuantityExceededException;
import com.utephonehub.backend.exception.OutOfStockException;
import com.utephonehub.backend.exception.ResourceNotFoundException;
import com.utephonehub.backend.repository.CartItemRepository;
import com.utephonehub.backend.repository.CartRepository;
import com.utephonehub.backend.repository.ProductRepository;
import com.utephonehub.backend.repository.ProductTemplateRepository;
import com.utephonehub.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class CartServiceImplIntegrationTest {

    @Autowired
    private CartServiceImpl cartService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductTemplateRepository productTemplateRepository;

    private User testUser;
    private Product testProduct;
    private ProductTemplate testTemplate;

    @BeforeEach
    void setUp() {
        // Clean up
        cartItemRepository.deleteAll();
        cartRepository.deleteAll();
        productTemplateRepository.deleteAll();
        productRepository.deleteAll();
        userRepository.deleteAll();

        // Create test user
        testUser = User.builder()
                .username("testuser")
                .email("test@test.com")
                .fullName("Test User")
                .build();
        testUser = userRepository.save(testUser);

        // Create test product
        testProduct = Product.builder()
                .name("iPhone 15 Pro")
                .status(true)
                .build();
        testProduct = productRepository.save(testProduct);

        // Create product template with stock
        testTemplate = ProductTemplate.builder()
                .product(testProduct)
                .sku("IP15PRO-256-BLK")
                .color("Black")
                .storage("256GB")
                .price(BigDecimal.valueOf(29990000))
                .stockQuantity(100)
                .status(true)
                .build();
        testTemplate = productTemplateRepository.save(testTemplate);
    }

    @Test
    void testAddToCart_NewCart() {
        // Given
        AddToCartRequest request = AddToCartRequest.builder()
                .productId(testProduct.getId())
                .quantity(2)
                .build();

        // When
        CartResponse response = cartService.addToCart(testUser.getId(), request);

        // Then
        assertNotNull(response);
        assertEquals(1, response.getItemCount());
        assertEquals(2, response.getItems().get(0).getQuantity());
        assertEquals(testProduct.getId(), response.getItems().get(0).getProductId());
    }

    @Test
    void testAddToCart_ExistingProduct_ShouldMergeQuantity() {
        // Given - Add product first time
        AddToCartRequest request1 = AddToCartRequest.builder()
                .productId(testProduct.getId())
                .quantity(2)
                .build();
        cartService.addToCart(testUser.getId(), request1);

        // When - Add same product again
        AddToCartRequest request2 = AddToCartRequest.builder()
                .productId(testProduct.getId())
                .quantity(3)
                .build();
        CartResponse response = cartService.addToCart(testUser.getId(), request2);

        // Then - Quantity should be merged
        assertEquals(1, response.getItemCount());
        assertEquals(5, response.getItems().get(0).getQuantity());
    }

    @Test
    void testAddToCart_ExceedMaxQuantity_ShouldThrowException() {
        // Given
        AddToCartRequest request = AddToCartRequest.builder()
                .productId(testProduct.getId())
                .quantity(11) // Max is 10
                .build();

        // When & Then
        assertThrows(MaxQuantityExceededException.class, () -> {
            cartService.addToCart(testUser.getId(), request);
        });
    }

    @Test
    void testAddToCart_OutOfStock_ShouldThrowException() {
        // Given - Product template with limited stock
        testTemplate.setStockQuantity(5);
        productTemplateRepository.save(testTemplate);

        AddToCartRequest request = AddToCartRequest.builder()
                .productId(testProduct.getId())
                .quantity(10)
                .build();

        // When & Then
        assertThrows(OutOfStockException.class, () -> {
            cartService.addToCart(testUser.getId(), request);
        });
    }

    @Test
    void testUpdateCartItem_UpdateQuantity() {
        // Given - Add product first
        AddToCartRequest addRequest = AddToCartRequest.builder()
                .productId(testProduct.getId())
                .quantity(2)
                .build();
        CartResponse cart = cartService.addToCart(testUser.getId(), addRequest);
        Long cartItemId = cart.getItems().get(0).getId();

        // When - Update quantity
        UpdateCartItemRequest updateRequest = UpdateCartItemRequest.builder()
                .quantity(5)
                .build();
        CartResponse response = cartService.updateCartItem(testUser.getId(), cartItemId, updateRequest);

        // Then
        assertEquals(1, response.getItemCount());
        assertEquals(5, response.getItems().get(0).getQuantity());
    }

    @Test
    void testUpdateCartItem_ZeroQuantity_ShouldRemoveItem() {
        // Given
        AddToCartRequest addRequest = AddToCartRequest.builder()
                .productId(testProduct.getId())
                .quantity(2)
                .build();
        CartResponse cart = cartService.addToCart(testUser.getId(), addRequest);
        Long cartItemId = cart.getItems().get(0).getId();

        // When - Set quantity to 0
        UpdateCartItemRequest updateRequest = UpdateCartItemRequest.builder()
                .quantity(0)
                .build();
        CartResponse response = cartService.updateCartItem(testUser.getId(), cartItemId, updateRequest);

        // Then - Item should be removed
        assertEquals(0, response.getItemCount());
        assertTrue(response.getItems().isEmpty());
    }

    @Test
    void testRemoveCartItem() {
        // Given
        AddToCartRequest addRequest = AddToCartRequest.builder()
                .productId(testProduct.getId())
                .quantity(2)
                .build();
        CartResponse cart = cartService.addToCart(testUser.getId(), addRequest);
        Long cartItemId = cart.getItems().get(0).getId();

        // When
        CartResponse response = cartService.removeCartItem(testUser.getId(), cartItemId);

        // Then
        assertEquals(0, response.getItemCount());
        assertTrue(response.getItems().isEmpty());
    }

    @Test
    void testClearCart() {
        // Given - Add multiple products
        AddToCartRequest request1 = AddToCartRequest.builder()
                .productId(testProduct.getId())
                .quantity(2)
                .build();
        cartService.addToCart(testUser.getId(), request1);

        Product product2 = Product.builder()
                .name("Samsung Galaxy S24")
                .status(true)
                .build();
        product2 = productRepository.save(product2);

        ProductTemplate template2 = ProductTemplate.builder()
                .product(product2)
                .sku("S24-256-BLK")
                .color("Black")
                .storage("256GB")
                .price(BigDecimal.valueOf(25990000))
                .stockQuantity(50)
                .status(true)
                .build();
        productTemplateRepository.save(template2);

        AddToCartRequest request2 = AddToCartRequest.builder()
                .productId(product2.getId())
                .quantity(1)
                .build();
        cartService.addToCart(testUser.getId(), request2);

        // When
        CartResponse response = cartService.clearCart(testUser.getId());

        // Then
        assertEquals(0, response.getItemCount());
        assertTrue(response.getItems().isEmpty());
    }

    @Test
    void testMergeGuestCart() {
        // Given - User already has items in cart
        AddToCartRequest addRequest = AddToCartRequest.builder()
                .productId(testProduct.getId())
                .quantity(2)
                .build();
        cartService.addToCart(testUser.getId(), addRequest);

        // Create guest cart items
        Product guestProduct = Product.builder()
                .name("iPad Pro")
                .status(true)
                .build();
        guestProduct = productRepository.save(guestProduct);

        ProductTemplate guestTemplate = ProductTemplate.builder()
                .product(guestProduct)
                .sku("IPAD-256-SLV")
                .color("Silver")
                .storage("256GB")
                .price(BigDecimal.valueOf(29990000))
                .stockQuantity(30)
                .status(true)
                .build();
        productTemplateRepository.save(guestTemplate);

        MergeGuestCartRequest mergeRequest = MergeGuestCartRequest.builder()
                .guestCartItems(Arrays.asList(
                        MergeGuestCartRequest.GuestCartItem.builder()
                                .productId(guestProduct.getId())
                                .quantity(1)
                                .build(),
                        MergeGuestCartRequest.GuestCartItem.builder()
                                .productId(testProduct.getId())
                                .quantity(3)
                                .build()
                ))
                .build();

        // When
        MergeCartResponse response = cartService.mergeGuestCart(testUser.getId(), mergeRequest);

        // Then
        assertNotNull(response);
        assertEquals(2, response.getMergedItemsCount());
        assertEquals(2, response.getCart().getItemCount());
        // testProduct should have merged quantity (2 + 3 = 5)
        assertTrue(response.getCart().getItems().stream()
                .anyMatch(item -> item.getProductId().equals(testProduct.getId()) && item.getQuantity() == 5));
    }

    @Test
    void testConcurrentAddToCart_OptimisticLocking() throws InterruptedException {
        // Given
        int numberOfThreads = 5;
        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);

        // When - Multiple threads try to add same product
        for (int i = 0; i < numberOfThreads; i++) {
            executorService.submit(() -> {
                try {
                    AddToCartRequest request = AddToCartRequest.builder()
                            .productId(testProduct.getId())
                            .quantity(1)
                            .build();
                    cartService.addToCart(testUser.getId(), request);
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    failureCount.incrementAndGet();
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        executorService.shutdown();

        // Then - All operations should succeed due to retry mechanism
        assertEquals(numberOfThreads, successCount.get());
        assertEquals(0, failureCount.get());

        // Verify final quantity
        CartResponse finalCart = cartService.getCurrentCart(testUser.getId());
        assertEquals(numberOfThreads, finalCart.getItems().get(0).getQuantity());
    }

    @Test
    void testGetCurrentCart_AutoRemoveDeletedProducts() {
        // Given - Add product to cart
        AddToCartRequest request = AddToCartRequest.builder()
                .productId(testProduct.getId())
                .quantity(2)
                .build();
        cartService.addToCart(testUser.getId(), request);

        // Simulate product deletion
        productRepository.delete(testProduct);

        // When - Get cart (should auto-remove deleted product items)
        CartResponse response = cartService.getCurrentCart(testUser.getId());

        // Then - Cart should be empty after cleanup
        assertEquals(0, response.getItemCount());
    }
}
