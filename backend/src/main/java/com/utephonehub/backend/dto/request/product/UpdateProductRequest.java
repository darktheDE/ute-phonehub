package com.utephonehub.backend.dto.request.product;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for updating existing Product
 * All fields are optional - only provided fields will be updated
 * Aligned with Class Diagram: Can update Product info, Templates, and Metadata
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProductRequest {

    /**
     * Core product information (optional updates)
     */
    @Size(min = 5, max = 200, message = "Tên sản phẩm phải từ 5-200 ký tự")
    private String name;

    @Size(max = 5000, message = "Mô tả không được vượt quá 5000 ký tự")
    private String description;

    @Size(max = 255, message = "URL hình ảnh không được vượt quá 255 ký tự")
    private String thumbnailUrl;

    private Long categoryId;

    private Long brandId;

    private Boolean status;

    /**
     * Product variants (templates)
     * If provided, will REPLACE all existing templates
     * To add/update single template, use dedicated template management API
     */
    @Valid
    @Size(min = 1, message = "Nếu cập nhật templates, phải có ít nhất 1 biến thể")
    private List<ProductTemplateRequest> templates;

    /**
     * Technical specifications (metadata)
     * If provided, will update metadata fields
     */
    @Valid
    private ProductMetadataRequest metadata;
}
