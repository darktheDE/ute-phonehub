package com.utephonehub.backend.dto.response.cart;

import com.utephonehub.backend.entity.CartItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String productThumbnailUrl;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subtotal;
    private Integer stockQuantity;

    public static CartItemResponse fromEntity(CartItem cartItem) {
        BigDecimal price = cartItem.getProduct().getPrice();
        BigDecimal subtotal = price.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
        
        return CartItemResponse.builder()
                .id(cartItem.getId())
                .productId(cartItem.getProduct().getId())
                .productName(cartItem.getProduct().getName())
                .productThumbnailUrl(cartItem.getProduct().getThumbnailUrl())
                .unitPrice(price)
                .quantity(cartItem.getQuantity())
                .subtotal(subtotal)
                .stockQuantity(cartItem.getProduct().getStockQuantity())
                .build();
    }
}
