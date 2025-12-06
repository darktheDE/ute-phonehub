package com.utephonehub.backend.dto.request.cart;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MergeGuestCartRequest {

    @NotEmpty(message = "Guest cart items không được để trống")
    private List<GuestCartItem> guestCartItems;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GuestCartItem {
        private Long productId;
        private Integer quantity;
    }
}
