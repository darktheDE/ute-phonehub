package com.utephonehub.backend.exception;

import lombok.Getter;

@Getter
public class OutOfStockException extends RuntimeException {
    
    private final Long productId;
    private final String productName;
    private final Integer requestedQuantity;
    private final Integer availableStock;
    
    public OutOfStockException(Long productId, String productName, Integer requestedQuantity, Integer availableStock) {
        super(String.format("Chỉ còn %d sản phẩm '%s' trong kho", availableStock, productName));
        this.productId = productId;
        this.productName = productName;
        this.requestedQuantity = requestedQuantity;
        this.availableStock = availableStock;
    }
}
