package com.utephonehub.backend.mapper;

import com.utephonehub.backend.dto.response.cart.CartItemResponse;
import com.utephonehub.backend.entity.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface CartItemMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "productThumbnailUrl", source = "product.thumbnailUrl")
    @Mapping(target = "unitPrice", source = "product.price")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "subtotal", expression = "java(calculateSubtotal(cartItem))")
    @Mapping(target = "stockQuantity", source = "product.stockQuantity")
    @Mapping(target = "outOfStock", expression = "java(isOutOfStock(cartItem))")
    @Mapping(target = "overStock", expression = "java(isOverStock(cartItem))")
    CartItemResponse toResponse(CartItem cartItem);

    /**
     * Calculate subtotal = unitPrice * quantity
     */
    default BigDecimal calculateSubtotal(CartItem cartItem) {
        BigDecimal price = cartItem.getProduct().getPrice();
        BigDecimal quantity = BigDecimal.valueOf(cartItem.getQuantity());
        return price.multiply(quantity);
    }

    /**
     * Check if product is out of stock
     */
    default boolean isOutOfStock(CartItem cartItem) {
        Integer currentStock = cartItem.getProduct().getStockQuantity();
        return currentStock != null && currentStock == 0;
    }

    /**
     * Check if cart quantity exceeds available stock
     */
    default boolean isOverStock(CartItem cartItem) {
        Integer currentStock = cartItem.getProduct().getStockQuantity();
        return currentStock != null && cartItem.getQuantity() > currentStock;
    }
}
