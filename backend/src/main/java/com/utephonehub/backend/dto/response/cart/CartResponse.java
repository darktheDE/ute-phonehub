package com.utephonehub.backend.dto.response.cart;

import com.utephonehub.backend.entity.Cart;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {

    private Long id;
    private List<CartItemResponse> items;
    private BigDecimal totalAmount;
    private Integer itemCount;

    public static CartResponse fromEntity(Cart cart) {
        List<CartItemResponse> items = cart.getItems() != null
                ? cart.getItems().stream()
                .map(CartItemResponse::fromEntity)
                .collect(Collectors.toList())
                : List.of();

        BigDecimal totalAmount = items.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .id(cart.getId())
                .items(items)
                .totalAmount(totalAmount)
                .itemCount(items.size())
                .build();
    }
}
