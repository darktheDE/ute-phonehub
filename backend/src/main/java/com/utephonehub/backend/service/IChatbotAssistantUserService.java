package com.utephonehub.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.utephonehub.backend.dto.request.ChatbotAssistantUserRequest;
import com.utephonehub.backend.dto.request.productview.ProductFilterRequest;
import com.utephonehub.backend.dto.response.ChatbotAssistantUserResponse;
import com.utephonehub.backend.dto.response.productview.ProductCardResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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
    
    @SuppressWarnings("unused") // Reserved for future semantic search feature
    private final IGeminiEmbeddingService embeddingService;
    private final IProductRecommendationService productService;
    private final IGeminiFallbackService fallbackService;
    private final IProductViewService productViewService;
    private final ObjectMapper objectMapper;
    
    // Brand name to ID mapping
    private static final Map<String, Long> BRAND_NAME_TO_ID = Map.of(
        "apple", 1L, "iphone", 1L,
        "samsung", 2L, "galaxy", 2L,
        "xiaomi", 3L, "redmi", 3L,
        "oppo", 4L,
        "vivo", 5L,
        "realme", 6L,
        "huawei", 7L
    );
    
    /**
     * Xử lý câu hỏi từ khách hàng
     * Logic cải tiến:
     * 1. Phân loại intent từ câu hỏi
     * 2. Tạo ProductFilterRequest đa tiêu chí từ message
     * 3. Gọi IProductViewService.filterProducts() trực tiếp (không qua HTTP)
     * 4. Tạo phản hồi AI với context sản phẩm
     */
    public ChatbotAssistantUserResponse chat(ChatbotAssistantUserRequest request) {
        long startTime = System.currentTimeMillis();
        
        try {
            log.info("🤖 Chatbot nhận câu hỏi: {}", request.getMessage());
            
            // 1. Phân loại intent
            String intent = detectIntent(request.getMessage());
            log.info("🎯 Intent phát hiện: {}", intent);
            
            // 2. Tạo filter đa tiêu chí từ message
            ProductFilterRequest filter = buildFilterFromMessage(request.getMessage(), request);
            log.info("🔧 Filter tạo thành công: categoryIds={}, brandIds={}, price=[{}-{}], ram={}, storage={}, battery={}, os={}",
                filter.getCategoryIds(), filter.getBrandIds(), 
                filter.getMinPrice(), filter.getMaxPrice(),
                filter.getRamOptions(), filter.getStorageOptions(),
                filter.getMinBattery(), filter.getOsOptions());
            
            // 3. Lấy sản phẩm dựa trên intent và filter
            List<ChatbotAssistantUserResponse.RecommendedProductDTO> products = 
                getProductsByIntentWithFilter(intent, filter, request);
            log.info("📦 Lấy được {} sản phẩm", products.size());
            
            // 4. Tính điểm relevance
            double relevanceScore = calculateRelevanceScore(products, request.getMessage());
            
            // 5. Giới hạn kết quả (max 5 sản phẩm)
            products = products.stream()
                .limit(5)
                .collect(Collectors.toList());
            
            // 6. Tạo phản hồi từ Gemini
            String aiResponse = generateAiResponse(request.getMessage(), products, intent);
            
            long processingTime = System.currentTimeMillis() - startTime;
            
            return ChatbotAssistantUserResponse.builder()
                .aiResponse(aiResponse)
                .recommendedProducts(products)
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
     * Tạo ProductFilterRequest từ message người dùng
     * Phân tích tất cả tiêu chí: brand, RAM, storage, battery, screen, OS, price
     */
    private ProductFilterRequest buildFilterFromMessage(String message, ChatbotAssistantUserRequest request) {
        String lower = message.toLowerCase();
        ProductFilterRequest.ProductFilterRequestBuilder builder = ProductFilterRequest.builder();
        
        // 1. Extract Brand IDs
        List<Long> brandIds = extractBrandIds(lower);
        if (!brandIds.isEmpty()) {
            builder.brandIds(brandIds);
            log.debug("📱 Phát hiện brands: {}", brandIds);
        }
        
        // 2. Extract RAM options
        List<String> ramOptions = extractRamOptions(lower);
        if (!ramOptions.isEmpty()) {
            builder.ramOptions(ramOptions);
            log.debug("💾 Phát hiện RAM: {}", ramOptions);
        }
        
        // 3. Extract Storage options
        List<String> storageOptions = extractStorageOptions(lower);
        if (!storageOptions.isEmpty()) {
            builder.storageOptions(storageOptions);
            log.debug("💿 Phát hiện Storage: {}", storageOptions);
        }
        
        // 4. Extract Battery
        Integer minBattery = extractMinBattery(lower);
        if (minBattery != null) {
            builder.minBattery(minBattery);
            log.debug("🔋 Phát hiện Battery: {}mAh", minBattery);
        }
        
        // 5. Extract OS
        List<String> osOptions = extractOsOptions(lower);
        if (!osOptions.isEmpty()) {
            builder.osOptions(osOptions);
            log.debug("🖥️ Phát hiện OS: {}", osOptions);
        }
        
        // 6. Extract Price Range
        extractPriceRange(lower, builder, request);
        
        // 7. Extract Rating
        Double minRating = extractMinRating(lower);
        if (minRating != null) {
            builder.minRating(minRating);
            log.debug("⭐ Phát hiện Rating: {}", minRating);
        }
        
        // 8. Category từ request
        if (request.getCategoryId() != null) {
            builder.categoryIds(List.of(request.getCategoryId()));
        }
        
        // 9. Discount
        if (lower.contains("giảm giá") || lower.contains("khuyến mãi") || 
            lower.contains("sale") || lower.contains("discount")) {
            builder.hasDiscountOnly(true);
        }
        
        // Pagination
        builder.page(0).size(10);
        
        return builder.build();
    }
    
    /**
     * Extract brand IDs từ message
     */
    private List<Long> extractBrandIds(String message) {
        List<Long> brandIds = new ArrayList<>();
        for (Map.Entry<String, Long> entry : BRAND_NAME_TO_ID.entrySet()) {
            if (message.contains(entry.getKey())) {
                if (!brandIds.contains(entry.getValue())) {
                    brandIds.add(entry.getValue());
                }
            }
        }
        return brandIds;
    }
    
    /**
     * Extract RAM options từ message
     * Hỗ trợ: "ram 8gb", "8gb ram", "ram từ 8gb", "ram 8 hoặc 12gb"
     */
    private List<String> extractRamOptions(String message) {
        List<String> options = new ArrayList<>();
        Pattern pattern = Pattern.compile("(\\d+)\\s*gb\\s*(ram)?|(ram)\\s*(\\d+)\\s*gb");
        Matcher matcher = pattern.matcher(message);
        
        while (matcher.find()) {
            String value = matcher.group(1) != null ? matcher.group(1) : matcher.group(4);
            if (value != null) {
                String normalized = normalizeRamOption(value + "GB");
                if (normalized != null && !options.contains(normalized)) {
                    options.add(normalized);
                }
            }
        }
        return options;
    }
    
    /**
     * Extract Storage options từ message
     */
    private List<String> extractStorageOptions(String message) {
        List<String> options = new ArrayList<>();
        Pattern pattern = Pattern.compile("(\\d+)\\s*(gb|tb)\\s*(storage|lưu trữ|bộ nhớ)?");
        Matcher matcher = pattern.matcher(message);
        
        while (matcher.find()) {
            String value = matcher.group(1);
            String unit = matcher.group(2).toUpperCase();
            if (value != null) {
                String normalized = normalizeStorageOption(value + unit);
                if (normalized != null && !options.contains(normalized)) {
                    options.add(normalized);
                }
            }
        }
        return options;
    }
    
    /**
     * Extract minimum battery từ message
     */
    private Integer extractMinBattery(String message) {
        // Pattern: "pin 5000mah", "5000 mah", "pin trâu", "pin lâu"
        if (message.contains("pin trâu") || message.contains("pin lâu") || message.contains("battery life")) {
            return 5000; // Default for "good battery"
        }
        
        Pattern pattern = Pattern.compile("(\\d{4,5})\\s*mah");
        Matcher matcher = pattern.matcher(message);
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        return null;
    }
    
    /**
     * Extract OS options từ message
     */
    private List<String> extractOsOptions(String message) {
        List<String> options = new ArrayList<>();
        if (message.contains("iphone") || message.contains("ios") || message.contains("apple")) {
            options.add("iOS");
        }
        if (message.contains("android") || message.contains("samsung") || 
            message.contains("xiaomi") || message.contains("oppo") ||
            message.contains("vivo") || message.contains("realme")) {
            options.add("Android");
        }
        return options;
    }
    
    /**
     * Extract price range từ message
     */
    private void extractPriceRange(String message, ProductFilterRequest.ProductFilterRequestBuilder builder, 
                                   ChatbotAssistantUserRequest request) {
        // Use request values if provided
        if (request.getMinPrice() != null) {
            builder.minPrice(BigDecimal.valueOf(request.getMinPrice()));
        }
        if (request.getMaxPrice() != null) {
            builder.maxPrice(BigDecimal.valueOf(request.getMaxPrice()));
        }
        
        // Pattern: "dưới 10 triệu", "từ 5-10 triệu", "tầm 15 triệu", "8-12tr"
        Pattern rangePattern = Pattern.compile("(\\d+)\\s*[-–]\\s*(\\d+)\\s*(triệu|tr|m)");
        Matcher rangeMatcher = rangePattern.matcher(message);
        if (rangeMatcher.find()) {
            double min = Double.parseDouble(rangeMatcher.group(1)) * 1_000_000;
            double max = Double.parseDouble(rangeMatcher.group(2)) * 1_000_000;
            builder.minPrice(BigDecimal.valueOf(min));
            builder.maxPrice(BigDecimal.valueOf(max));
            return;
        }
        
        // Pattern: "dưới 10 triệu", "under 15tr"
        Pattern underPattern = Pattern.compile("(dưới|under|tối đa|max)\\s*(\\d+)\\s*(triệu|tr|m)");
        Matcher underMatcher = underPattern.matcher(message);
        if (underMatcher.find()) {
            double max = Double.parseDouble(underMatcher.group(2)) * 1_000_000;
            builder.maxPrice(BigDecimal.valueOf(max));
            return;
        }
        
        // Pattern: "trên 10 triệu", "từ 15tr"
        Pattern overPattern = Pattern.compile("(trên|từ|over|tối thiểu|min)\\s*(\\d+)\\s*(triệu|tr|m)");
        Matcher overMatcher = overPattern.matcher(message);
        if (overMatcher.find()) {
            double min = Double.parseDouble(overMatcher.group(2)) * 1_000_000;
            builder.minPrice(BigDecimal.valueOf(min));
            return;
        }
        
        // Pattern: "tầm 10 triệu" -> ±20%
        Pattern aroundPattern = Pattern.compile("(tầm|khoảng|around)\\s*(\\d+)\\s*(triệu|tr|m)");
        Matcher aroundMatcher = aroundPattern.matcher(message);
        if (aroundMatcher.find()) {
            double price = Double.parseDouble(aroundMatcher.group(2)) * 1_000_000;
            builder.minPrice(BigDecimal.valueOf(price * 0.8));
            builder.maxPrice(BigDecimal.valueOf(price * 1.2));
        }
    }
    
    /**
     * Extract minimum rating từ message
     */
    private Double extractMinRating(String message) {
        Pattern pattern = Pattern.compile("(\\d)\\s*sao|rating\\s*(\\d)|(\\d)\\s*⭐");
        Matcher matcher = pattern.matcher(message);
        if (matcher.find()) {
            String value = matcher.group(1) != null ? matcher.group(1) : 
                          (matcher.group(2) != null ? matcher.group(2) : matcher.group(3));
            if (value != null) {
                return Double.parseDouble(value);
            }
        }
        return null;
    }
    
    /**
     * Normalize RAM option to valid values: 4GB, 6GB, 8GB, 12GB, 16GB
     */
    private String normalizeRamOption(String ram) {
        String normalized = ram.toUpperCase().replaceAll("\\s+", "");
        return switch (normalized) {
            case "2GB", "3GB", "4GB" -> "4GB";
            case "5GB", "6GB" -> "6GB";
            case "7GB", "8GB" -> "8GB";
            case "10GB", "11GB", "12GB" -> "12GB";
            case "14GB", "16GB", "18GB" -> "16GB";
            default -> null;
        };
    }
    
    /**
     * Normalize Storage option to valid values: 64GB, 128GB, 256GB, 512GB, 1TB
     */
    private String normalizeStorageOption(String storage) {
        String normalized = storage.toUpperCase().replaceAll("\\s+", "");
        if (normalized.contains("TB") || normalized.contains("1024")) {
            return "1TB";
        }
        return switch (normalized) {
            case "32GB", "64GB" -> "64GB";
            case "128GB" -> "128GB";
            case "256GB" -> "256GB";
            case "512GB" -> "512GB";
            default -> null;
        };
    }
    
    /**
     * Lấy sản phẩm dựa trên intent và filter
     * Sử dụng IProductViewService.filterProducts() trực tiếp
     */
    private List<ChatbotAssistantUserResponse.RecommendedProductDTO> getProductsByIntentWithFilter(
            String intent, ProductFilterRequest filter, ChatbotAssistantUserRequest request) {
        
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
                if (request.getCategoryId() != null) {
                    log.info("📁 Lấy sản phẩm theo danh mục: {}", request.getCategoryId());
                    yield productService.getProductsByCategory(request.getCategoryId());
                }
                yield productService.getFeaturedProducts();
            }
            case "RELATED" -> {
                if (request.getProductId() != null) {
                    log.info("🔗 Lấy sản phẩm liên quan: {}", request.getProductId());
                    yield productService.getRelatedProducts(request.getProductId());
                }
                yield productService.getFeaturedProducts();
            }
            case "COMPARE" -> {
                log.info("⚖️ Mode so sánh - lấy sản phẩm nổi bật");
                yield productService.getBestSellingProducts();
            }
            default -> {
                // SEARCH, FILTER_* intents: sử dụng filter đa tiêu chí
                log.info("🔍 Gọi filterProducts() với filter đa tiêu chí");
                yield searchWithMultiFilter(filter);
            }
        };
    }
    
    /**
     * Tìm kiếm sản phẩm với filter đa tiêu chí
     * Gọi trực tiếp IProductViewService.filterProducts()
     */
    private List<ChatbotAssistantUserResponse.RecommendedProductDTO> searchWithMultiFilter(
            ProductFilterRequest filter) {
        
        try {
            // Gọi filterProducts() trực tiếp
            Page<ProductCardResponse> page = productViewService.filterProducts(filter);
            
            List<ChatbotAssistantUserResponse.RecommendedProductDTO> results = 
                page.getContent().stream()
                    .map(this::convertCardToRecommendedProduct)
                    .collect(Collectors.toList());
            
            log.info("✅ FilterProducts trả về {} sản phẩm", results.size());
            
            // Fallback nếu không có kết quả
            if (results.isEmpty()) {
                log.info("⚠️ Không có kết quả filter, fallback về featured products");
                return productService.getFeaturedProducts();
            }
            
            return results;
        } catch (Exception e) {
            log.error("❌ Lỗi filterProducts: {}", e.getMessage());
            return productService.getFeaturedProducts();
        }
    }
    
    /**
     * Convert ProductCardResponse -> RecommendedProductDTO
     * Map đầy đủ thông tin cho Product Card
     */
    private ChatbotAssistantUserResponse.RecommendedProductDTO convertCardToRecommendedProduct(
            ProductCardResponse card) {
        // Build description từ specs
        String description = buildProductDescription(card);
        
        // Get price (ưu tiên discounted price)
        double price = card.getDiscountedPrice() != null 
            ? card.getDiscountedPrice().doubleValue() 
            : (card.getMinPrice() != null ? card.getMinPrice().doubleValue() : 0.0);
        
        // Get original price
        Double originalPrice = card.getOriginalPrice() != null 
            ? card.getOriginalPrice().doubleValue() : null;
        
        // Calculate discount percent
        Integer discountPercent = null;
        Boolean hasDiscount = false;
        if (originalPrice != null && price < originalPrice && originalPrice > 0) {
            discountPercent = (int) Math.round((1 - price / originalPrice) * 100);
            hasDiscount = discountPercent > 0;
        }
        
        return ChatbotAssistantUserResponse.RecommendedProductDTO.builder()
            .id(card.getId())
            .name(card.getName())
            .description(description)
            .price(price)
            .originalPrice(originalPrice)
            .rating(card.getAverageRating())
            .reviewCount(card.getTotalReviews())
            .imageUrl(card.getThumbnailUrl())
            .categoryName(card.getCategoryName())
            .productUrl("/products/" + card.getId())
            // Technical specs
            .ram(card.getRam())
            .storage(card.getStorage())
            .batteryCapacity(card.getBatteryCapacity())
            .operatingSystem(card.getOperatingSystem())
            .brandName(card.getBrandName())
            // Discount info
            .discountPercent(discountPercent)
            .hasDiscount(hasDiscount)
            // Sales info
            .soldCount(card.getSoldCount())
            .inStock(card.getInStock() != null ? card.getInStock() : true)
            .build();
    }
    
    /**
     * Build mô tả ngắn từ ProductCardResponse
     */
    private String buildProductDescription(ProductCardResponse card) {
        StringBuilder sb = new StringBuilder();
        if (card.getRam() != null) sb.append("RAM ").append(card.getRam());
        if (card.getStorage() != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(card.getStorage());
        }
        if (card.getBatteryCapacity() != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(card.getBatteryCapacity()).append("mAh");
        }
        if (card.getOperatingSystem() != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(card.getOperatingSystem());
        }
        return sb.length() > 0 ? sb.toString() : card.getName();
    }
    
    /**
     * Tính điểm relevance từ products
     */
    private double calculateRelevanceScore(
            List<ChatbotAssistantUserResponse.RecommendedProductDTO> products,
            String message) {
        if (products.isEmpty()) return 0.0;
        
        // Nếu có matchScore từ embedding, sử dụng nó
        OptionalDouble avgScore = products.stream()
            .filter(p -> p.getMatchScore() != null)
            .mapToDouble(ChatbotAssistantUserResponse.RecommendedProductDTO::getMatchScore)
            .average();
        
        if (avgScore.isPresent()) {
            return avgScore.getAsDouble();
        }
        
        // Default score dựa trên số lượng kết quả
        return Math.min(1.0, products.size() / 5.0);
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
     * Tạo phản hồi từ Gemini AI (với fallback API keys)
     * Prompt được tối ưu để tạo phản hồi chi tiết, thân thiện
     */
    private String generateAiResponse(String userMessage, 
            List<ChatbotAssistantUserResponse.RecommendedProductDTO> products,
            String intent) {
        
        try {
            // Tạo danh sách sản phẩm chi tiết
            StringBuilder productList = new StringBuilder();
            for (int i = 0; i < Math.min(products.size(), 5); i++) {
                var p = products.get(i);
                productList.append(String.format("%d. %s - %.0f₫ (%.1f⭐, %d đánh giá) - %s\n",
                    i + 1, p.getName(), p.getPrice(), 
                    p.getRating() != null ? p.getRating() : 0.0, 
                    p.getReviewCount() != null ? p.getReviewCount() : 0,
                    p.getDescription()));
            }
            
            // Prompt chi tiết và thân thiện
            String prompt = String.format("""
                Bạn là chuyên viên tư vấn điện thoại thông minh của UTE Phone Hub - cửa hàng điện thoại uy tín.
                
                PHONG CÁCH TRẢ LỜI:
                - Thân thiện, nhiệt tình như nhân viên bán hàng chuyên nghiệp
                - Trả lời 3-4 câu, giải thích LÝ DO tại sao sản phẩm phù hợp
                - Nêu CỤ THỂ ưu điểm nổi bật (RAM, pin, camera, giá...)
                - Kết thúc bằng gợi ý để khách hàng tương tác tiếp
                - Mời khách hàng "nhấn vào sản phẩm để xem chi tiết"
                
                YÊU CẦU KHÁCH HÀNG: %s
                INTENT PHÁT HIỆN: %s
                
                DANH SÁCH SẢN PHẨM GỢI Ý:
                %s
                
                Hãy tư vấn sản phẩm cho khách hàng một cách chuyên nghiệp và hấp dẫn.
                """, userMessage, intent, productList.toString());
            
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of(
                        "parts", List.of(
                            Map.of("text", prompt)
                        )
                    )
                ),
                "generationConfig", Map.of(
                    "temperature", 0.7,
                    "maxOutputTokens", 400
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
     * Tạo phản hồi chi tiết dựa trên intent và sản phẩm
     */
    private String formatDefaultResponse(
            List<ChatbotAssistantUserResponse.RecommendedProductDTO> products,
            String intent) {
        
        if (products.isEmpty()) {
            return "Xin lỗi, không tìm thấy sản phẩm phù hợp với yêu cầu của bạn. " +
                   "Bạn có thể thử điều chỉnh khoảng giá hoặc tiêu chí tìm kiếm nhé!";
        }
        
        StringBuilder response = new StringBuilder();
        
        // Greeting dựa trên intent
        switch (intent) {
            case "FEATURED" -> response.append("Đây là những sản phẩm nổi bật được khách hàng yêu thích nhất! ");
            case "BEST_SELLING" -> response.append("Đây là những sản phẩm bán chạy nhất tại cửa hàng! ");
            case "NEW_ARRIVALS" -> response.append("Đây là những sản phẩm mới nhất vừa về hàng! ");
            case "FILTER_RAM" -> response.append("Tôi đã tìm thấy các điện thoại với cấu hình RAM bạn yêu cầu! ");
            case "FILTER_BATTERY" -> response.append("Đây là những điện thoại có pin khỏe phù hợp với bạn! ");
            case "FILTER_OS" -> response.append("Tôi đã lọc sản phẩm theo hệ điều hành bạn yêu cầu! ");
            default -> response.append("Dựa trên yêu cầu của bạn, tôi gợi ý những sản phẩm sau: ");
        }
        
        // Thêm thông tin sản phẩm đầu tiên
        var firstProduct = products.get(0);
        response.append(String.format("Đặc biệt, %s với giá %.0f₫ ", 
            firstProduct.getName(), firstProduct.getPrice()));
        
        if (firstProduct.getDescription() != null && !firstProduct.getDescription().isEmpty()) {
            response.append("(").append(firstProduct.getDescription()).append(") ");
        }
        
        response.append("là lựa chọn tuyệt vời! ");
        response.append("Nhấn vào sản phẩm bên dưới để xem chi tiết nhé.");
        
        return response.toString();
    }
}
