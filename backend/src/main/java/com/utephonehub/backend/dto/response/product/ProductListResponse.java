package com.utephonehub.backend.dto.response.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductListResponse {

    private Long id;
    
    private String name;
    
    private BigDecimal price;
    
    private Integer stockQuantity;
    
    private String thumbnailUrl;
    
    private Boolean status;
    
    private String categoryName;
    
    private String brandName;
}
