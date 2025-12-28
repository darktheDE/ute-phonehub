package com.utephonehub.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.utephonehub.backend.dto.request.ChatbotAssistantUserRequest;
import com.utephonehub.backend.dto.response.ChatbotAssistantUserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service chính cho Chatbot Tư Vấn Sản Phẩm
 * 
 * Luồng hoạt động:
 * 1. Phân loại intent từ câu hỏi của khách hàng
 * 2. Gọi API ProductView phù hợp (tối ưu chi phí)
 * 3. Nếu cần, dùng embedding để lọc sản phẩm phù hợp
 * 4. Tạo phản hồi từ Gemini AI
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotAssistantUserService {
    
    private final GeminiEmbeddingService embeddingService;
    private final ProductRecommendationService productService;
    private final GeminiFallbackService fallbackService;
    private final ObjectMapper objectMapper;
    
    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models}")
    private String geminiBaseUrl;
    
    private static final double EMBEDDING_SIMILARITY_THRESHOLD = 0.5;
    
    /**
     * Xử lý câu hỏi từ khách hàng
     */
    public ChatbotAssistantUserResponse chat(ChatbotAssistantUserRequest request) {
        long startTime = System.currentTimeMillis();
        
        try {
            log.info("🤖 Chatbot nhận câu hỏi: {}", request.getMessage());
            
            // 1. Phân loại intent
            String intent = detectIntent(request.getMessage());
            log.info("🎯 Intent phát hiện: {}", intent);
            
            // 2. Lấy sản phẩm dựa trên intent
            List<ChatbotAssistantUserResponse.RecommendedProductDTO> products = 
                getProductsByIntent(intent, request);
            log.info("📦 Lấy được {} sản phẩm", products.size());
            
            // 3. Lọc với embedding (nếu cần)
            List<ChatbotAssistantUserResponse.RecommendedProductDTO> filtered = products;
            double relevanceScore = 1.0;
            
            if ("SEARCH".equals(intent) && !products.isEmpty()) {
                filtered = productService.filterByEmbeddingSimilarity(
                    products, 
                    request.getMessage(), 
                    EMBEDDING_SIMILARITY_THRESHOLD
                );
                if (!filtered.isEmpty()) {
                    relevanceScore = filtered.get(0).getMatchScore();
                }
            }
            
            // 4. Giới hạn kết quả để tối ưu (max 5 sản phẩm)
            filtered = filtered.stream()
                .limit(5)
                .collect(Collectors.toList());
            
            // 5. Tạo phản hồi từ Gemini
            String aiResponse = generateAiResponse(request.getMessage(), filtered, intent);
            
            long processingTime = System.currentTimeMillis() - startTime;
            
            return ChatbotAssistantUserResponse.builder()
                .aiResponse(aiResponse)
                .recommendedProducts(filtered)
                .detectedIntent(intent)
                .relevanceScore(relevanceScore)
                .processingTimeMs(processingTime)
                .build();
                
        } catch (Exception e) {
            log.error("❌ Lỗi xử lý chatbot: {}", e.getMessage(), e);
            return ChatbotAssistantUserResponse.builder()
                .aiResponse("Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại.")
                .recommendedProducts(Collections.emptyList())
                .detectedIntent("ERROR")
                .processingTimeMs(System.currentTimeMillis() - startTime)
                .build();
        }
    }
    
    /**
     * Phân loại intent từ câu hỏi
     * Ưu tiên API trực tiếp (không dùng embedding) để tối ưu chi phí
     */
    private String detectIntent(String message) {
        String lowerMessage = message.toLowerCase();
        
        // Sử dụng keyword matching đơn giản để tối ưu chi phí
        if (lowerMessage.contains("nổi bật") || lowerMessage.contains("best") || 
            lowerMessage.contains("recommended") || lowerMessage.contains("hàng đầu")) {
            return "FEATURED";
        }
        
        if (lowerMessage.contains("bán chạy") || lowerMessage.contains("best selling") || 
            lowerMessage.contains("hot") || lowerMessage.contains("popular")) {
            return "BEST_SELLING";
        }
        
        if (lowerMessage.contains("mới") || lowerMessage.contains("mới nhất") || 
            lowerMessage.contains("new") || lowerMessage.contains("latest")) {
            return "NEW_ARRIVALS";
        }
        
        if (lowerMessage.contains("so sánh") || lowerMessage.contains("compare") || 
            lowerMessage.contains("khác nhau") || lowerMessage.contains("difference")) {
            return "COMPARE";
        }
        
        if (lowerMessage.contains("danh mục") || lowerMessage.contains("category") || 
            lowerMessage.contains("loại") || lowerMessage.contains("dòng")) {
            return "CATEGORY";
        }
        
        // Default: search (sử dụng embedding để tìm phù hợp)
        return "SEARCH";
    }
    
    /**
     * Lấy sản phẩm dựa trên intent
     */
    private List<ChatbotAssistantUserResponse.RecommendedProductDTO> getProductsByIntent(
            String intent, ChatbotAssistantUserRequest request) {
        
        return switch (intent) {
            case "FEATURED" -> {
                log.info("⭐ Lấy sản phẩm nổi bật");
                yield productService.getFeaturedProducts();
            }
            case "BEST_SELLING" -> {
                log.info("🔥 Lấy sản phẩm bán chạy");
                yield productService.getBestSellingProducts();
            }
            case "NEW_ARRIVALS" -> {
                log.info("🆕 Lấy sản phẩm mới");
                yield productService.getNewArrivalsProducts();
            }
            case "CATEGORY" -> {
                log.info("📁 Lấy sản phẩm theo danh mục");
                if (request.getCategoryId() != null) {
                    yield productService.getProductsByCategory(request.getCategoryId());
                } else {
                    // Mặc định lấy featured nếu không có categoryId
                    yield productService.getFeaturedProducts();
                }
            }
            case "COMPARE" -> {
                log.info("⚖️ So sánh sản phẩm");
                yield productService.getBestSellingProducts(); // Hoặc gọi compare API
            }
            default -> { // SEARCH
                log.info("🔍 Tìm kiếm sản phẩm");
                yield productService.searchProducts(
                    request.getMessage(),
                    request.getMinPrice(),
                    request.getMaxPrice(),
                    request.getCategoryId(),
                    request.getSortBy()
                );
            }
        };
    }
    
    /**
     * Tạo phản hồi từ Gemini AI (với fallback API keys)
     * Prompt được tối ưu để giảm chi phí token
     */
    private String generateAiResponse(String userMessage, 
            List<ChatbotAssistantUserResponse.RecommendedProductDTO> products,
            String intent) {
        
        try {
            // Tạo danh sách sản phẩm ngắn gọn
            StringBuilder productList = new StringBuilder();
            for (int i = 0; i < Math.min(products.size(), 5); i++) {
                var p = products.get(i);
                productList.append(String.format("- %s (%.0f₫, %.1f⭐ %d reviews)\n",
                    p.getName(), p.getPrice(), p.getRating(), p.getReviewCount()));
            }
            
            // Prompt tối ưu (ngắn gọn để tiết kiệm token)
            String prompt = String.format("""
                Bạn là chatbot tư vấn sản phẩm điện thoại thông minh.
                
                Câu hỏi khách: %s
                Intent: %s
                Sản phẩm gợi ý:
                %s
                
                Hãy trả lời ngắn gọn (1-2 câu) về các sản phẩm trên, giải thích tại sao phù hợp.
                """, userMessage, intent, productList.toString());
            
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of(
                        "parts", List.of(
                            Map.of("text", prompt)
                        )
                    )
                )
            );
            
            String requestJson = objectMapper.writeValueAsString(requestBody);
            
            log.debug("📤 Gửi request đến Gemini (fallback enabled)");
            
            // Sử dụng fallback service với xoay vòng API keys
            String responseJson = fallbackService.executeWithFallback(requestJson, false);
            
            JsonNode responseNode = objectMapper.readTree(responseJson);
            String aiText = responseNode
                .path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();
            
            log.debug("✅ Nhận phản hồi từ Gemini");
            return aiText;
            
        } catch (Exception e) {
            log.error("❌ Lỗi tạo phản hồi Gemini: {}", e.getMessage());
            return formatDefaultResponse(products, intent);
        }
    }
    
    /**
     * Phản hồi mặc định khi Gemini không khả dụng
     */
    private String formatDefaultResponse(
            List<ChatbotAssistantUserResponse.RecommendedProductDTO> products,
            String intent) {
        
        if (products.isEmpty()) {
            return "Xin lỗi, không tìm thấy sản phẩm phù hợp với yêu cầu của bạn.";
        }
        
        return String.format(
            "Dựa trên yêu cầu (%s), tôi gợi ý %d sản phẩm: %s",
            intent.toLowerCase(),
            products.size(),
            products.get(0).getName()
        );
    }
}
