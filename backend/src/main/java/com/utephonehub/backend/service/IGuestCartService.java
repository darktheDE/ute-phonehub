package com.utephonehub.backend.service;

import com.utephonehub.backend.dto.request.guestcart.GuestCartUpdateRequest;
import com.utephonehub.backend.dto.request.cart.MergeGuestCartRequest;

import java.util.List;

public interface IGuestCartService {

    String createGuestCart();

    /**
     * Basic rate limiter for creating guest carts (best-effort).
     * Returns true if the request should be allowed.
     */
    boolean allowCreateGuestCart(String ipAddress, int limitPerMinute);

    void replaceItems(String guestCartId, GuestCartUpdateRequest request);

    void deleteGuestCart(String guestCartId);

    List<MergeGuestCartRequest.GuestCartItem> getItemsForMerge(String guestCartId);
}
