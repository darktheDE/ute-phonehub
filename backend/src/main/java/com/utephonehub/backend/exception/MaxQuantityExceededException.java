package com.utephonehub.backend.exception;

import lombok.Getter;

@Getter
public class MaxQuantityExceededException extends RuntimeException {
    
    private final Integer maxQuantity;
    private final Integer requestedQuantity;
    
    public MaxQuantityExceededException(Integer maxQuantity, Integer requestedQuantity) {
        super(String.format("Chỉ được mua tối đa %d sản phẩm", maxQuantity));
        this.maxQuantity = maxQuantity;
        this.requestedQuantity = requestedQuantity;
    }
}
