package com.utephonehub.backend.dto.response.productview;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Response DTO chi tiết sản phẩm cho client-side
 * Dùng cho trang chi tiết sản phẩm
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailViewResponse {
    
    private Long id;
    private String name;
    private String description;
    private String thumbnailUrl;
    
    // Category & Brand
    private CategoryInfo category;
    private BrandInfo brand;
    
    // Images
    private List<ProductImageInfo> images;
    
    // Variants (Templates)
    private List<VariantInfo> variants;
    
    // Technical Specifications
    private TechnicalSpecsInfo technicalSpecs;
    
    // Rating & Reviews
    private Double averageRating;
    private Integer totalReviews;
    
    // Stock availability
    private Boolean inStock;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryInfo {
        private Long id;
        private String name;
        private String slug;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BrandInfo {
        private Long id;
        private String name;
        private String logoUrl;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductImageInfo {
        private Long id;
        private String imageUrl;
        private String altText;
        private Boolean isPrimary;
        private Integer imageOrder;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VariantInfo {
        private Long id;
        private String sku;
        private String color;
        private String storage;
        private String ram;
        private BigDecimal price;
        private BigDecimal compareAtPrice;
        private Integer stockQuantity;
        private String stockStatus;
        private Boolean status;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TechnicalSpecsInfo {
        private String screen;
        private String os;
        private String frontCamera;
        private String rearCamera;
        private String cpu;
        private String ram;
        private String internalMemory;
        private String externalMemory;
        private String sim;
        private String battery;
        private String charging;
        private String dimensions;
        private String weight;
        private String materials;
        private String connectivity;
        private String features;
    }
}
