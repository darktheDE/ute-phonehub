package com.utephonehub.backend.dto.response.productview;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO cho danh sách sản phẩm theo danh mục
 * Bao gồm thông tin danh mục và breadcrumb
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryProductsResponse {
    
    private CategoryInfo category;
    private List<BreadcrumbItem> breadcrumbs;
    private List<CategoryInfo> subCategories;
    private FilterOptions filterOptions;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryInfo {
        private Long id;
        private String name;
        private String slug;
        private String description;
        private Integer productCount;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BreadcrumbItem {
        private Long id;
        private String name;
        private String slug;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FilterOptions {
        private List<BrandOption> availableBrands;
        private PriceRange priceRange;
        private List<RatingOption> ratingOptions;
        
        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class BrandOption {
            private Long id;
            private String name;
            private Integer productCount;
        }
        
        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class PriceRange {
            private java.math.BigDecimal min;
            private java.math.BigDecimal max;
        }
        
        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class RatingOption {
            private Integer stars;
            private Integer count;
        }
    }
}
