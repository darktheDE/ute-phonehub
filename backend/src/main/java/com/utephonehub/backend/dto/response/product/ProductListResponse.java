package com.utephonehub.backend.dto.response.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for Product in list/table view
 * Shows simplified info with price/stock from cheapest/default template
 * Aligned with Usecase M02: Table shows Ảnh | Tên | SKU | Giá | Tồn kho | Status
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductListResponse {

    private Long id;
    
    private String name;
    
    /**
     * Price of cheapest template (for sorting/filtering)
     * Calculated from ProductTemplate with MIN(price)
     */
    private BigDecimal price;
    
    /**
     * Total stock quantity across all templates
     * Calculated from SUM(ProductTemplate.stockQuantity)
     */
    private Integer stockQuantity;
    
    private String thumbnailUrl;
    
    private Boolean status;
    
    private String categoryName;
    
    private String brandName;
}
