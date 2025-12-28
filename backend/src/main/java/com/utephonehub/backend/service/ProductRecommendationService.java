package com.utephonehub.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.utephonehub.backend.dto.response.ChatbotAssistantUserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;

/**
 * Service gọi ProductView API để lấy sản phẩm
 * Tối ưu: Cache, batch loading, limit depth
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductRecommendationService {
    
    private final RestTemplate restTemplate;
    private final GeminiEmbeddingService embeddingService;
    private final ObjectMapper objectMapper;
    
    @Value("${api.product.base-url:http://localhost:8081/api/v1/products}")
    private String productApiBaseUrl;
    
    // Cache sản phẩm (lưu 1 giờ)
    private final Map<String, CachedProducts> productCache = new HashMap<>();
    private static final long CACHE_EXPIRY_MS = 3600000; // 1 giờ
    
    /**
     * Lấy sản phẩm nổi bật (tối ưu chi phí - ưu tiên gọi API trước)
     */
    public List<ChatbotAssistantUserResponse.RecommendedProductDTO> getFeaturedProducts() {
        return getProductsFromCache("featured", () -> {
            log.info("📊 Gọi API /featured để lấy sản phẩm nổi bật");
            String url = productApiBaseUrl + "/featured";
            return fetchProductsFromApi(url);
        });
    }
    
    /**
     * Lấy sản phẩm bán chạy
     */
    public List<ChatbotAssistantUserResponse.RecommendedProductDTO> getBestSellingProducts() {
        return getProductsFromCache("best-selling", () -> {
            log.info("📊 Gọi API /best-selling để lấy sản phẩm bán chạy");
            String url = productApiBaseUrl + "/best-selling";
            return fetchProductsFromApi(url);
        });
    }
    
    /**
     * Lấy sản phẩm mới nhất
     */
    public List<ChatbotAssistantUserResponse.RecommendedProductDTO> getNewArrivalsProducts() {
        return getProductsFromCache("new-arrivals", () -> {
            log.info("📊 Gọi API /new-arrivals để lấy sản phẩm mới");
            String url = productApiBaseUrl + "/new-arrivals";
            return fetchProductsFromApi(url);
        });
    }
    
    /**
     * Tìm kiếm sản phẩm theo từ khóa + lọc
     */
    public List<ChatbotAssistantUserResponse.RecommendedProductDTO> searchProducts(
            String keyword, Double minPrice, Double maxPrice, Long categoryId, String sortBy) {
        
        log.info("🔍 Tìm kiếm sản phẩm: keyword={}, categoryId={}, minPrice={}, maxPrice={}, sortBy={}",
                keyword, categoryId, minPrice, maxPrice, sortBy);
        
        String url = UriComponentsBuilder.fromHttpUrl(productApiBaseUrl + "/search")
                .queryParam("keyword", keyword)
                .queryParamIfPresent("minPrice", Optional.ofNullable(minPrice))
                .queryParamIfPresent("maxPrice", Optional.ofNullable(maxPrice))
                .queryParamIfPresent("categoryId", Optional.ofNullable(categoryId))
                .queryParamIfPresent("sortBy", Optional.ofNullable(sortBy))
                .queryParam("limit", 10) // Giới hạn để tối ưu
                .build()
                .toUriString();
        
        return fetchProductsFromApi(url);
    }
    
    /**
     * Lấy sản phẩm theo danh mục
     */
    public List<ChatbotAssistantUserResponse.RecommendedProductDTO> getProductsByCategory(Long categoryId) {
        String cacheKey = "category_" + categoryId;
        return getProductsFromCache(cacheKey, () -> {
            log.info("📁 Gọi API /category/{} để lấy sản phẩm", categoryId);
            String url = productApiBaseUrl + "/category/" + categoryId;
            return fetchProductsFromApi(url);
        });
    }
    
    /**
     * Lọc sản phẩm dựa trên embedding similarity
     * (Chỉ gọi khi cần, để tối ưu chi phí embedding)
     */
    public List<ChatbotAssistantUserResponse.RecommendedProductDTO> filterByEmbeddingSimilarity(
            List<ChatbotAssistantUserResponse.RecommendedProductDTO> products,
            String userQuery,
            double threshold) {
        
        log.info("🧠 Lọc sản phẩm dùng embedding similarity, threshold={}", threshold);
        
        try {
            List<Double> queryEmbedding = embeddingService.getEmbedding(userQuery);
            
            List<ChatbotAssistantUserResponse.RecommendedProductDTO> filtered = new ArrayList<>();
            
            for (ChatbotAssistantUserResponse.RecommendedProductDTO product : products) {
                String productText = product.getName() + " " + product.getDescription();
                List<Double> productEmbedding = embeddingService.getEmbedding(productText);
                
                double similarity = embeddingService.cosineSimilarity(queryEmbedding, productEmbedding);
                
                if (similarity >= threshold) {
                    product.setMatchScore(similarity);
                    filtered.add(product);
                }
            }
            
            // Sắp xếp theo độ tương tự giảm dần
            filtered.sort((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()));
            
            log.info("✅ Lọc xong: {} sản phẩm phù hợp (threshold={})", filtered.size(), threshold);
            return filtered;
        } catch (Exception e) {
            log.error("❌ Lỗi lọc embedding: {}", e.getMessage());
            return products;
        }
    }
    
    /**
     * Gọi API internal để lấy sản phẩm
     */
    private List<ChatbotAssistantUserResponse.RecommendedProductDTO> fetchProductsFromApi(String url) {
        try {
            log.debug("🌐 Gọi API: {}", url);
            String responseJson = restTemplate.getForObject(url, String.class);
            
            JsonNode rootNode = objectMapper.readTree(responseJson);
            List<ChatbotAssistantUserResponse.RecommendedProductDTO> products = new ArrayList<>();
            
            // Xử lý response (có thể là mảng hoặc object.data)
            JsonNode dataNode = rootNode.isArray() ? rootNode : rootNode.path("data");
            
            dataNode.forEach(productNode -> {
                ChatbotAssistantUserResponse.RecommendedProductDTO product = 
                    ChatbotAssistantUserResponse.RecommendedProductDTO.builder()
                        .id(productNode.path("id").asLong())
                        .name(productNode.path("name").asText())
                        .description(productNode.path("description").asText())
                        .price(productNode.path("price").asDouble())
                        .rating(productNode.path("rating").asDouble(0.0))
                        .reviewCount(productNode.path("reviewCount").asInt(0))
                        .imageUrl(productNode.path("imageUrl").asText())
                        .categoryName(productNode.path("category").path("name").asText())
                        .productUrl("/products/" + productNode.path("id").asLong())
                        .build();
                products.add(product);
            });
            
            log.debug("✅ Lấy được {} sản phẩm từ API", products.size());
            return products;
        } catch (Exception e) {
            log.error("❌ Lỗi gọi API sản phẩm: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
    
    /**
     * Helper: Lấy từ cache hoặc gọi API
     */
    private List<ChatbotAssistantUserResponse.RecommendedProductDTO> getProductsFromCache(
            String key, java.util.function.Supplier<List<ChatbotAssistantUserResponse.RecommendedProductDTO>> fetcher) {
        
        if (productCache.containsKey(key)) {
            CachedProducts cached = productCache.get(key);
            if (!cached.isExpired()) {
                log.debug("💾 Sử dụng cache cho key: {}", key);
                return cached.products;
            }
        }
        
        List<ChatbotAssistantUserResponse.RecommendedProductDTO> products = fetcher.get();
        productCache.put(key, new CachedProducts(products));
        return products;
    }
    
    /**
     * Xóa cache sản phẩm
     */
    public void clearCache() {
        productCache.clear();
        log.info("🧹 Product cache đã được xóa");
    }
    
    /**
     * Class helper để cache sản phẩm
     */
    private static class CachedProducts {
        private final List<ChatbotAssistantUserResponse.RecommendedProductDTO> products;
        private final long timestamp;
        
        CachedProducts(List<ChatbotAssistantUserResponse.RecommendedProductDTO> products) {
            this.products = products;
            this.timestamp = System.currentTimeMillis();
        }
        
        boolean isExpired() {
            return System.currentTimeMillis() - timestamp > CACHE_EXPIRY_MS;
        }
    }
}
