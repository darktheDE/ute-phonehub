package com.utephonehub.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * Response DTO cho chatbot tư vấn sản phẩm
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatbotAssistantUserResponse {
    
    /**
     * Phản hồi từ AI chatbot (lời tư vấn)
     */
    private String aiResponse;
    
    /**
     * Danh sách sản phẩm được gợi ý
     */
    private List<RecommendedProductDTO> recommendedProducts;
    
    /**
     * Intent được phân loại: FEATURED, BEST_SELLING, NEW_ARRIVALS, SEARCH, CATEGORY, COMPARE
     */
    private String detectedIntent;
    
    /**
     * Điểm độ phù hợp (0-1): dựa trên embedding similarity
     */
    private Double relevanceScore;
    
    /**
     * Thời gian xử lý (ms)
     */
    private Long processingTimeMs;
    
    /**
     * DTO cho sản phẩm được gợi ý
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecommendedProductDTO {
        private Long id;
        private String name;
        private String description;
        private Double price;
        private Double rating;
        private Integer reviewCount;
        private String imageUrl;
        private String categoryName;
        private Double matchScore;
        private String reason;
        
        /**
         * URL đường dẫn tới trang chi tiết sản phẩm
         * VD: /products/1
         */
        private String productUrl;
    }
}
