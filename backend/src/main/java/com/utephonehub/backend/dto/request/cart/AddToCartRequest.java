package com.utephonehub.backend.dto.request.cart;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddToCartRequest {

    @NotNull(message = "Product ID must not be empty")
    private Long productId;

    @NotNull(message = "Quantity must not be empty")
    @Min(value = 1, message = "Quantity must be greater than 0")
    @Max(value = 10, message = "Maximum 10 items allowed")
    private Integer quantity;
}
