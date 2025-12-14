package com.utephonehub.backend.exception;

/**
 * Exception thrown when a promotion validation fails
 * Follows SOLID principles by creating specific exception types
 */
public class PromotionInvalidException extends RuntimeException {
    
    public PromotionInvalidException(String message) {
        super(message);
    }
}
