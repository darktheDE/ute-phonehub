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
public class IChatbotAssistantUserService {
    
    private final IGeminiEmbeddingService embeddingService;
    private final IProductRecommendationService productService;
    private final IGeminiFallbackService fallbackService;
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
     * 
     * Các intent hỗ trợ:
     * - FEATURED: Sản phẩm nổi bật
     * - BEST_SELLING: Sản phẩm bán chạy
     * - NEW_ARRIVALS: Sản phẩm mới
     * - FILTER_RAM: Lọc theo RAM
     * - FILTER_STORAGE: Lọc theo dung lượng lưu trữ
     * - FILTER_BATTERY: Lọc theo pin
     * - FILTER_SCREEN: Lọc theo kích thước màn hình
     * - FILTER_OS: Lọc theo hệ điều hành
     * - FILTER_RATING: Lọc theo đánh giá sao
     * - CATEGORY: Xem sản phẩm theo danh mục
     * - COMPARE: So sánh sản phẩm
     * - SEARCH: Tìm kiếm (sử dụng embedding)
     */
    private String detectIntent(String message) {
        String lowerMessage = message.toLowerCase();
        
        // RAM filters
        if (lowerMessage.matches(".*\\b(ram|bộ nhớ|memory)\\b.*") && 
            (lowerMessage.contains("4gb") || lowerMessage.contains("6gb") || 
             lowerMessage.contains("8gb") || lowerMessage.contains("12gb") || 
             lowerMessage.contains("16gb") || lowerMessage.contains("lọc theo ram"))) {
            return "FILTER_RAM";
        }
        
        // Storage filters
        if (lowerMessage.matches(".*\\b(storage|lưu trữ|dung lượng|bộ nhớ trong)\\b.*") && 
            (lowerMessage.contains("128gb") || lowerMessage.contains("256gb") || 
             lowerMessage.contains("512gb") || lowerMessage.contains("1tb") ||
             lowerMessage.contains("lọc theo storage"))) {
            return "FILTER_STORAGE";
        }
        
        // Battery filters
        if (lowerMessage.matches(".*\\b(pin|battery|mah)\\b.*") && 
            (lowerMessage.contains("mah") || lowerMessage.contains("lọc theo pin") ||
             lowerMessage.contains("pin trâu") || lowerMessage.contains("pin lâu"))) {
            return "FILTER_BATTERY";
        }
        
        // Screen size filters
        if (lowerMessage.matches(".*\\b(màn hình|screen|inch)\\b.*") && 
            (lowerMessage.contains("inch") || lowerMessage.contains("lọc theo màn hình") ||
             lowerMessage.contains("6.1") || lowerMessage.contains("6.7"))) {
            return "FILTER_SCREEN";
        }
        
        // OS filters
        if (lowerMessage.matches(".*\\b(hệ điều hành|os|android|ios)\\b.*") && 
            (lowerMessage.contains("android") || lowerMessage.contains("ios") ||
             lowerMessage.contains("iphone") || lowerMessage.contains("samsung"))) {
            return "FILTER_OS";
        }
        
        // Rating filters
        if (lowerMessage.matches(".*\\b(đánh giá|rating|sao|⭐)\\b.*") && 
            (lowerMessage.contains("sao") || lowerMessage.contains("rating") ||
             lowerMessage.contains("lọc theo đánh giá") || lowerMessage.contains("⭐"))) {
            return "FILTER_RATING";
        }
        
        // Featured products
        if (lowerMessage.contains("nổi bật") || lowerMessage.contains("best") || 
            lowerMessage.contains("recommended") || lowerMessage.contains("hàng đầu") ||
            lowerMessage.contains("top") || lowerMessage.contains("sản phẩm nổi bật")) {
            return "FEATURED";
        }
        
        // Best selling products
        if (lowerMessage.contains("bán chạy") || lowerMessage.contains("best selling") || 
            lowerMessage.contains("hot") || lowerMessage.contains("popular") ||
            lowerMessage.contains("chạy nhất") || lowerMessage.contains("được yêu thích")) {
            return "BEST_SELLING";
        }
        
        // New arrivals
        if (lowerMessage.contains("mới") || lowerMessage.contains("mới nhất") || 
            lowerMessage.contains("new") || lowerMessage.contains("latest") ||
            lowerMessage.contains("vừa về") || lowerMessage.contains("sản phẩm mới")) {
            return "NEW_ARRIVALS";
        }
        
        // Compare products
        if (lowerMessage.contains("so sánh") || lowerMessage.contains("compare") || 
            lowerMessage.contains("khác nhau") || lowerMessage.contains("difference") ||
            lowerMessage.contains("so với") || lowerMessage.contains("giống")) {
            return "COMPARE";
        }
        
        // Category products
        if (lowerMessage.contains("danh mục") || lowerMessage.contains("category") || 
            lowerMessage.contains("loại") || lowerMessage.contains("dòng") ||
            lowerMessage.contains("theo danh mục") || lowerMessage.contains("loại điện thoại")) {
            return "CATEGORY";
        }
        
        // Related products
        if (lowerMessage.contains("liên quan") || lowerMessage.contains("related") ||
            lowerMessage.contains("giống") || lowerMessage.contains("tương tự")) {
            return "RELATED";
        }
        
        // Default: search (sử dụng keyword matching để tối ưu chi phí)
        return "SEARCH";
    }
    
    /**
     * Lấy sản phẩm dựa trên intent
     * Sử dụng các API ProductView tối ưu chi phí thay vì embedding khi có thể
     */
    private List<ChatbotAssistantUserResponse.RecommendedProductDTO> getProductsByIntent(
            String intent, ChatbotAssistantUserRequest request) {
        
        return switch (intent) {
            // === TỐI ƯU CHI PHÍ: Sử dụng API trực tiếp (0 token) ===
            case "FEATURED" -> {
                log.info("⭐ API GỌI: GET /api/v1/products/featured");
                yield productService.getFeaturedProducts();
            }
            case "BEST_SELLING" -> {
                log.info("🔥 API GỌI: GET /api/v1/products/best-selling");
                yield productService.getBestSellingProducts();
            }
            case "NEW_ARRIVALS" -> {
                log.info("🆕 API GỌI: GET /api/v1/products/new-arrivals");
                yield productService.getNewArrivalsProducts();
            }
            
            // === FILTER THEO SPECS: API lọc tối ưu ===
            case "FILTER_RAM" -> {
                String ramValue = extractRamFromMessage(request.getMessage());
                log.info("💾 API GỌI: GET /api/v1/products/filter/ram?ramOptions={}", ramValue);
                // Sẽ cần thêm method này vào ProductRecommendationService
                yield productService.filterByRam(ramValue);
            }
            case "FILTER_STORAGE" -> {
                String storageValue = extractStorageFromMessage(request.getMessage());
                log.info("💿 API GỌI: GET /api/v1/products/filter/storage?storageOptions={}", storageValue);
                yield productService.filterByStorage(storageValue);
            }
            case "FILTER_BATTERY" -> {
                String batteryRange = extractBatteryFromMessage(request.getMessage());
                log.info("🔋 API GỌI: GET /api/v1/products/filter/battery?minBattery={}", batteryRange);
                yield productService.filterByBattery(batteryRange);
            }
            case "FILTER_SCREEN" -> {
                String screenSize = extractScreenFromMessage(request.getMessage());
                log.info("📱 API GỌI: GET /api/v1/products/filter/screen?screenSizeOptions={}", screenSize);
                yield productService.filterByScreen(screenSize);
            }
            case "FILTER_OS" -> {
                String osValue = extractOsFromMessage(request.getMessage());
                log.info("🖥️ API GỌI: GET /api/v1/products/filter/os?osOptions={}", osValue);
                yield productService.filterByOS(osValue);
            }
            case "FILTER_RATING" -> {
                Double minRating = extractRatingFromMessage(request.getMessage());
                log.info("⭐ API GỌI: GET /api/v1/products/filter/rating?minRating={}", minRating);
                yield productService.filterByRating(minRating);
            }
            
            // === KHÁC ===
            case "CATEGORY" -> {
                log.info("📁 API GỌI: GET /api/v1/products/category/{categoryId}");
                if (request.getCategoryId() != null) {
                    yield productService.getProductsByCategory(request.getCategoryId());
                } else {
                    yield productService.getFeaturedProducts();
                }
            }
            case "RELATED" -> {
                log.info("🔗 API GỌI: GET /api/v1/products/{id}/related");
                if (request.getProductId() != null) {
                    yield productService.getRelatedProducts(request.getProductId());
                } else {
                    yield productService.getFeaturedProducts();
                }
            }
            case "COMPARE" -> {
                log.info("⚖️ API GỌI: POST /api/v1/products/compare");
                yield productService.getBestSellingProducts(); // Hoặc gọi compare API
            }
            default -> { // SEARCH
                log.info("🔍 API GỌI: GET /api/v1/products/search");
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
     * Trích xuất giá trị RAM từ message
     * Ví dụ: "Cho tôi điện thoại RAM 8GB" -> "8GB"
     */
    private String extractRamFromMessage(String message) {
        String[] ramOptions = {"4gb", "6gb", "8gb", "12gb", "16gb"};
        String lowerMessage = message.toLowerCase();
        for (String ram : ramOptions) {
            if (lowerMessage.contains(ram)) {
                return ram.toUpperCase();
            }
        }
        return "8GB"; // Default
    }
    
    /**
     * Trích xuất giá trị Storage từ message
     * Ví dụ: "Cho tôi điện thoại 256GB" -> "256GB"
     */
    private String extractStorageFromMessage(String message) {
        String[] storageOptions = {"64gb", "128gb", "256gb", "512gb", "1tb"};
        String lowerMessage = message.toLowerCase();
        for (String storage : storageOptions) {
            if (lowerMessage.contains(storage)) {
                return storage.toUpperCase();
            }
        }
        return "128GB"; // Default
    }
    
    /**
     * Trích xuất giá trị Battery từ message
     * Ví dụ: "Điện thoại pin trâu trên 5000 mAh" -> "5000"
     */
    private String extractBatteryFromMessage(String message) {
        // Tìm số trong message
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("(\\d{4})(\\s*mah)?");
        java.util.regex.Matcher matcher = pattern.matcher(message.toLowerCase());
        if (matcher.find()) {
            return matcher.group(1);
        }
        return "4000"; // Default
    }
    
    /**
     * Trích xuất kích thước màn hình từ message
     * Ví dụ: "Cho tôi điện thoại màn hình 6.7 inch" -> "6.7"
     */
    private String extractScreenFromMessage(String message) {
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("(\\d+\\.\\d+)\\s*inch");
        java.util.regex.Matcher matcher = pattern.matcher(message.toLowerCase());
        if (matcher.find()) {
            return matcher.group(1);
        }
        return "6.1"; // Default
    }
    
    /**
     * Trích xuất hệ điều hành từ message
     * Ví dụ: "Cho tôi iPhone" -> "iOS", "Galaxy" -> "Android"
     */
    private String extractOsFromMessage(String message) {
        String lowerMessage = message.toLowerCase();
        if (lowerMessage.contains("iphone") || lowerMessage.contains("ios")) {
            return "iOS";
        }
        if (lowerMessage.contains("samsung") || lowerMessage.contains("galaxy") ||
            lowerMessage.contains("android") || lowerMessage.contains("xiaomi") ||
            lowerMessage.contains("oppo")) {
            return "Android";
        }
        return "Android"; // Default
    }
    
    /**
     * Trích xuất đánh giá từ message
     * Ví dụ: "Sản phẩm đánh giá từ 4 sao trở lên" -> 4.0
     */
    private Double extractRatingFromMessage(String message) {
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("(\\d)\\s*sao");
        java.util.regex.Matcher matcher = pattern.matcher(message.toLowerCase());
        if (matcher.find()) {
            return Double.parseDouble(matcher.group(1));
        }
        return 4.0; // Default
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
