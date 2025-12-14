package com.utephonehub.backend.dto.response.product;

import com.utephonehub.backend.dto.response.category.CategoryResponse;
import com.utephonehub.backend.dto.response.brand.BrandResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDetailResponse {

    private Long id;
    
    private String name;
    
    private String description;
    
    private BigDecimal price;
    
    private Integer stockQuantity;
    
    private String thumbnailUrl;
    
    private String specifications;
    
    private Boolean status;
    
    private CategoryResponse category;
    
    private BrandResponse brand;
    
    private List<ProductImageResponse> images;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private String createdByUsername;
    
    private String updatedByUsername;
}
