package com.utephonehub.backend.exception;

import lombok.Getter;

@Getter
public class VersionConflictException extends RuntimeException {
    
    private final String resource;
    private final Long resourceId;
    private final Integer currentQuantity;
    private final Integer requestedQuantity;
    
    public VersionConflictException(String resource, Long resourceId, Integer currentQuantity, Integer requestedQuantity) {
        super(String.format("Giỏ hàng đã được cập nhật từ thiết bị khác. Số lượng hiện tại: %d", currentQuantity));
        this.resource = resource;
        this.resourceId = resourceId;
        this.currentQuantity = currentQuantity;
        this.requestedQuantity = requestedQuantity;
    }
    
    public VersionConflictException(String message) {
        super(message);
        this.resource = null;
        this.resourceId = null;
        this.currentQuantity = null;
        this.requestedQuantity = null;
    }
}
