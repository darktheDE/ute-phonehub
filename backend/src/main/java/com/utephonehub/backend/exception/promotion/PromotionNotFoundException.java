package com.utephonehub.backend.exception.promotion;

/**
 * Exception thrown when a promotion is not found
 * Follows SOLID principles by creating specific exception types
 */
public class PromotionNotFoundException extends RuntimeException {
    
    public PromotionNotFoundException(String promotionId) {
        super(String.format("Promotion not found with ID: %s", promotionId));
    }
}
