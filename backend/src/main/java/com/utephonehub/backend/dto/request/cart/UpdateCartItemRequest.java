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
public class UpdateCartItemRequest {

    @NotNull(message = "Quantity must not be empty")
    @Min(value = 0, message = "Quantity must be greater than or equal to 0")
    @Max(value = 10, message = "Maximum 10 items allowed")
    private Integer quantity;
}
