package com.utephonehub.backend.service.impl;

import com.utephonehub.backend.dto.request.productview.ProductFilterRequest;
import com.utephonehub.backend.dto.request.productview.ProductSearchFilterRequest;
import com.utephonehub.backend.dto.response.productview.CategoryProductsResponse;
import com.utephonehub.backend.dto.response.productview.ProductCardResponse;
import com.utephonehub.backend.dto.response.productview.ProductComparisonResponse;
import com.utephonehub.backend.dto.response.productview.ProductDetailViewResponse;
import com.utephonehub.backend.entity.Category;
import com.utephonehub.backend.entity.Product;
import com.utephonehub.backend.entity.ProductMetadata;
import com.utephonehub.backend.entity.ProductTemplate;
import com.utephonehub.backend.exception.BadRequestException;
import com.utephonehub.backend.exception.ResourceNotFoundException;
import com.utephonehub.backend.repository.CategoryRepository;
import com.utephonehub.backend.repository.ProductRepository;
import com.utephonehub.backend.repository.ReviewRepository;
import com.utephonehub.backend.service.IProductViewService;
import com.utephonehub.backend.service.IPromotionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ProductViewServiceImpl implements IProductViewService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;
    private final IPromotionService promotionService;
    private static final Pattern DIACRITICS_PATTERN = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
    private static final Pattern WHITESPACE_PATTERN = Pattern.compile("\\s+");

    @Override
    public Page<ProductCardResponse> searchAndFilterProducts(ProductSearchFilterRequest request) {
        // Sử dụng createdAt sorting cho database để tránh lỗi
        Pageable pageable = PageRequest.of(
            request.getPage() != null && request.getPage() >= 0 ? request.getPage() : 0,
            request.getSize() != null && request.getSize() > 0 ? request.getSize() : 20,
            Sort.by(Sort.Direction.DESC, "createdAt")
        );
        
        String normalizedKeyword = normalizeKeyword(request.getKeyword());
        Page<Product> page = normalizedKeyword != null
            ? productRepository.searchProductsOptimized(buildFlexibleLikePattern(normalizedKeyword), pageable)
            : productRepository.findAllForProductView(pageable);
        
        // Apply custom sorting trong service layer
        List<Product> sorted = applySorting(page.getContent(), request.getSortBy(), request.getSortDirection());
        
        return createPageFromList(sorted, pageable, page.getTotalElements());
    }

    @Override
    public Page<ProductCardResponse> filterProducts(ProductFilterRequest request) {
        // Sử dụng createdAt cho database sorting để tránh lỗi với price
        Pageable pageable = PageRequest.of(
            request.getPage() != null && request.getPage() >= 0 ? request.getPage() : 0,
            request.getSize() != null && request.getSize() > 0 ? request.getSize() : 20,
            Sort.by(Sort.Direction.DESC, "createdAt")
        );
        
        Long categoryId = firstOrNull(request.getCategoryIds());
        Long brandId = firstOrNull(request.getBrandIds());
        Page<Product> basePage = productRepository.filterProductsOptimized(categoryId, brandId, request.getMinPrice(), request.getMaxPrice(), pageable);
        
        List<Product> filtered = basePage.getContent().stream()
                .filter(p -> matchRam(p, request.getRamOptions()))
                .filter(p -> matchStorage(p, request.getStorageOptions()))
                .filter(p -> matchBattery(p.getMetadata(), request.getMinBattery(), request.getMaxBattery()))
                .filter(p -> matchScreenSize(p.getMetadata(), request.getScreenSizeOptions()))
                .filter(p -> matchOs(p.getMetadata(), request.getOsOptions()))
                .collect(Collectors.toList());
        
        // Apply custom sorting based on request
        filtered = applySorting(filtered, request.getSortBy(), request.getSortDirection());
        
        return createPageFromList(filtered, pageable, basePage.getTotalElements());
    }

    @Override
    public ProductDetailViewResponse getProductDetailById(Long productId) {
        Product product = productRepository.findByIdAndIsDeletedFalse(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));
        Double avgRating = reviewRepository.calculateAverageRatingByProductId(productId);
        Long reviewCount = reviewRepository.countReviewsByProductId(productId);
        ProductMetadata metadata = product.getMetadata();
        List<ProductDetailViewResponse.VariantInfo> variants = toVariants(product.getTemplates());
        List<ProductDetailViewResponse.ProductImageInfo> images = toImages(product.getImages());
        return ProductDetailViewResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .thumbnailUrl(product.getThumbnailUrl())
                .category(ProductDetailViewResponse.CategoryInfo.builder()
                        .id(product.getCategory() != null ? product.getCategory().getId() : null)
                        .name(product.getCategory() != null ? product.getCategory().getName() : null)
                        .build())
                .brand(ProductDetailViewResponse.BrandInfo.builder()
                        .id(product.getBrand() != null ? product.getBrand().getId() : null)
                        .name(product.getBrand() != null ? product.getBrand().getName() : null)
                        .logoUrl(null)
                        .build())
                    .images(images)
                    .variants(variants)
                    .technicalSpecs(toTechnicalSpecs(metadata))
                    .averageRating(avgRating != null ? avgRating : 0.0)
                    .totalReviews(reviewCount != null ? reviewCount.intValue() : 0)
                    .inStock(hasStock(product))
                .build();
    }

    @Override
    public CategoryProductsResponse getProductsByCategory(Long categoryId, ProductSearchFilterRequest request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Pageable pageable = buildPageable(request.getPage(), request.getSize(), request.getSortBy(), request.getSortDirection());
        Page<Product> productsPage = productRepository.findByCategoryIdOptimized(categoryId, pageable);
        Page<ProductCardResponse> productCards = toCardPage(productsPage);
        
        CategoryProductsResponse.CategoryInfo info = CategoryProductsResponse.CategoryInfo.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .productCount((int) productRepository.countByCategoryIdAndIsDeletedFalse(categoryId))
                .build();
        return CategoryProductsResponse.builder()
                .category(info)
                .products(productCards)
                .breadcrumbs(Collections.emptyList())
                .subCategories(Collections.emptyList())
                .filterOptions(null)
                .build();
    }

    @Override
    public ProductComparisonResponse compareProducts(List<Long> productIds) {
        if (productIds == null || productIds.size() < 2 || productIds.size() > 4) {
            throw new BadRequestException("Số lượng sản phẩm so sánh phải từ 2-4");
        }
        List<Product> products = productRepository.findAllByIdIn(productIds);
        if (products.size() != productIds.size()) {
            throw new ResourceNotFoundException("Một số sản phẩm không tồn tại");
        }
        Map<Long, ReviewSummary> stats = reviewStats(products);
        List<ProductComparisonResponse.ComparisonProduct> items = products.stream()
                .map(p -> toComparisonProduct(p, stats.get(p.getId())))
                .collect(Collectors.toList());
        return ProductComparisonResponse.builder().products(items).build();
    }

    @Override
    public List<ProductCardResponse> getRelatedProducts(Long productId, Integer limit) {
        Product product = productRepository.findByIdAndIsDeletedFalse(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        // Lấy giá của sản phẩm gốc
        ProductTemplate originalTemplate = displayTemplate(product);
        BigDecimal originalPrice = originalTemplate != null ? originalTemplate.getPrice() : BigDecimal.ZERO;
        
        List<Product> categoryProducts = productRepository.findByCategoryIdAndIsDeletedFalse(product.getCategory().getId());
        
        List<Product> relatedProducts = categoryProducts.stream()
            .filter(p -> !Objects.equals(p.getId(), productId)) // Loại bỏ chính sản phẩm đó
            .filter(p -> {
                ProductTemplate template = displayTemplate(p);
                if (template == null || template.getPrice() == null) return false;
                
                // Chênh lệch giá không quá 6 triệu VNĐ (6,000,000)
                BigDecimal priceDiff = template.getPrice().subtract(originalPrice).abs();
                return priceDiff.compareTo(new BigDecimal("6000000")) <= 0;
            })
            .sorted(Comparator.comparing(Product::getCreatedAt).reversed()) // Mới nhất trước
            .limit(limitOrDefault(limit))
            .collect(Collectors.toList());
        
        return toCards(relatedProducts);
    }

    @Override
    public List<ProductCardResponse> getBestSellingProducts(Integer limit) {
        List<Product> list = productRepository.findByStatusTrueAndIsDeletedFalse();
        List<Product> sorted = list.stream()
                .sorted((p1, p2) -> {
                    Integer sold1 = calculateSoldCount(p1);
                    Integer sold2 = calculateSoldCount(p2);
                    
                    // Nếu sold count khác nhau, sắp xếp theo sold count DESC
                    int soldCompare = sold2.compareTo(sold1);
                    if (soldCompare != 0) {
                        return soldCompare;
                    }
                    
                    // Nếu sold count giống nhau (đều = 0), fallback sắp xếp theo createdAt DESC (mới nhất)
                    return p2.getCreatedAt().compareTo(p1.getCreatedAt());
                })
                .limit(limitOrDefault(limit))
            .collect(Collectors.toList());
        return toCards(sorted);
    }

    @Override
    public List<ProductCardResponse> getNewArrivals(Integer limit) {
        List<Product> list = productRepository.findByStatusTrueAndIsDeletedFalse();
        List<Product> sorted = list.stream()
                .sorted(Comparator.comparing(Product::getCreatedAt).reversed())
                .limit(limitOrDefault(limit))
            .collect(Collectors.toList());
        return toCards(sorted);
    }

    @Override
    public List<ProductCardResponse> getFeaturedProducts(Integer limit) {
        List<Product> list = productRepository.findByStatusTrueAndIsDeletedFalse();
        Map<Long, ReviewSummary> reviewStats = reviewStats(list);
        
        // Thử filter theo tiêu chí đầy đủ trước
        List<Product> strictFeatured = list.stream()
                .filter(p -> {
                    ReviewSummary stats = reviewStats.get(p.getId());
                    int soldCount = calculateSoldCount(p);
                    double rating = stats != null ? stats.average : 0.0;
                    
                    // Tiêu chí nổi bật theo controller: rating >= 4.5, đã bán >= 100
                    return rating >= 4.5 && soldCount >= 100;
                })
                .collect(Collectors.toList());
        
        // Nếu không có sản phẩm nào đạt tiêu chí nghiêm ngặt, fallback chỉ filter theo rating >= 4.5
        List<Product> featured = strictFeatured.isEmpty() ? 
                list.stream()
                    .filter(p -> {
                        ReviewSummary stats = reviewStats.get(p.getId());
                        double rating = stats != null ? stats.average : 0.0;
                        return rating >= 4.5; // Chỉ cần rating >= 4.5
                    })
                    .collect(Collectors.toList())
                : strictFeatured;
        
        // Nếu vẫn không có, lấy top products theo rating
        if (featured.isEmpty()) {
            featured = list.stream().collect(Collectors.toList());
        }
        
        List<Product> sorted = featured.stream()
                .sorted((p1, p2) -> {
                    ReviewSummary stats1 = reviewStats.get(p1.getId());
                    ReviewSummary stats2 = reviewStats.get(p2.getId());
                    double rating1 = stats1 != null ? stats1.average : 0.0;
                    double rating2 = stats2 != null ? stats2.average : 0.0;
                    
                    // Sắp xếp theo rating desc, rồi theo sold count desc
                    int ratingCompare = Double.compare(rating2, rating1);
                    if (ratingCompare != 0) return ratingCompare;
                    
                    return Integer.compare(calculateSoldCount(p2), calculateSoldCount(p1));
                })
                .limit(limitOrDefault(limit))
                .collect(Collectors.toList());
                
        return toCards(sorted);
    }

    @Override
    public Page<ProductCardResponse> filterByRam(List<String> ramOptions, ProductSearchFilterRequest request) {
        return filterWithPredicate(request, p -> matchRam(p, ramOptions));
    }

    @Override
    public Page<ProductCardResponse> filterByStorage(List<String> storageOptions, ProductSearchFilterRequest request) {
        return filterWithPredicate(request, p -> matchStorage(p, storageOptions));
    }

    @Override
    public Page<ProductCardResponse> filterByBattery(Integer minBattery, Integer maxBattery, ProductSearchFilterRequest request) {
        return filterWithPredicate(request, p -> matchBattery(p.getMetadata(), minBattery, maxBattery));
    }

    @Override
    public Page<ProductCardResponse> filterByScreenSize(List<String> screenSizeOptions, ProductSearchFilterRequest request) {
        return filterWithPredicate(request, p -> matchScreenSize(p.getMetadata(), screenSizeOptions));
    }

    @Override
    public Page<ProductCardResponse> filterByOS(List<String> osOptions, ProductSearchFilterRequest request) {
        return filterWithPredicate(request, p -> matchOs(p.getMetadata(), osOptions));
    }

    @Override
    public List<ProductCardResponse> searchAndFilterProductsWithLimit(ProductSearchFilterRequest request, Integer limit) {
        return searchAndFilterProducts(request).getContent().stream().limit(limitOrDefault(limit)).collect(Collectors.toList());
    }

    @Override
    public List<ProductCardResponse> getProductsByCategoryWithLimit(Long categoryId, ProductSearchFilterRequest request, Integer limit) {
        Page<Product> page = productRepository.findByCategoryIdOptimized(categoryId, buildPageable(request.getPage(), request.getSize(), request.getSortBy(), request.getSortDirection()));
        List<Product> limited = page.getContent().stream().limit(limitOrDefault(limit)).collect(Collectors.toList());
        return toCards(limited);
    }

    @Override
    public List<ProductCardResponse> filterByRamWithLimit(List<String> ramOptions, ProductSearchFilterRequest request, Integer limit) {
        return filterByRam(ramOptions, request).getContent().stream().limit(limitOrDefault(limit)).collect(Collectors.toList());
    }

    @Override
    public List<ProductCardResponse> filterByStorageWithLimit(List<String> storageOptions, ProductSearchFilterRequest request, Integer limit) {
        return filterByStorage(storageOptions, request).getContent().stream().limit(limitOrDefault(limit)).collect(Collectors.toList());
    }

    @Override
    public List<ProductCardResponse> filterByBatteryWithLimit(Integer minBattery, Integer maxBattery, ProductSearchFilterRequest request, Integer limit) {
        return filterByBattery(minBattery, maxBattery, request).getContent().stream().limit(limitOrDefault(limit)).collect(Collectors.toList());
    }

    @Override
    public List<ProductCardResponse> filterByScreenSizeWithLimit(List<String> screenSizeOptions, ProductSearchFilterRequest request, Integer limit) {
        return filterByScreenSize(screenSizeOptions, request).getContent().stream().limit(limitOrDefault(limit)).collect(Collectors.toList());
    }

    @Override
    public List<ProductCardResponse> filterByOSWithLimit(List<String> osOptions, ProductSearchFilterRequest request, Integer limit) {
        return filterByOS(osOptions, request).getContent().stream().limit(limitOrDefault(limit)).collect(Collectors.toList());
    }

    @Override
    public List<ProductCardResponse> getFeaturedProductsByCriteria(Integer limit) {
        return getFeaturedProducts(limit);
    }

    @Override
    public Page<ProductCardResponse> filterBySoldCount(Integer minSoldCount, ProductSearchFilterRequest request) {
        Pageable pageable = buildPageable(request.getPage(), request.getSize(), request.getSortBy(), request.getSortDirection());
        Page<Product> page = productRepository.findByStatusTrueAndIsDeletedFalse(pageable);
        return toCardPage(page);
    }

    @Override
    public Page<ProductCardResponse> getAllProducts(ProductSearchFilterRequest request) {
        Pageable pageable = buildPageable(request.getPage(), request.getSize(), request.getSortBy(), request.getSortDirection());
        return toCardPage(productRepository.findByIsDeletedFalse(pageable));
    }

    @Override
    public ProductDetailViewResponse getProductDetailWithSoldCount(Long productId) {
        return getProductDetailById(productId);
    }

    @Override
    public Page<ProductCardResponse> getFeaturedProductsPaginated(ProductSearchFilterRequest request) {
        Pageable pageable = buildPageable(request.getPage(), request.getSize(), request.getSortBy(), request.getSortDirection());
        Page<Product> page = productRepository.findByStatusTrueAndIsDeletedFalse(pageable);
        
        List<Product> allProducts = page.getContent();
        Map<Long, ReviewSummary> reviewStats = reviewStats(allProducts);
        
        // Thử filter theo tiêu chí đầy đủ trước
        List<Product> strictFeatured = allProducts.stream()
                .filter(p -> {
                    ReviewSummary stats = reviewStats.get(p.getId());
                    int soldCount = calculateSoldCount(p);
                    double rating = stats != null ? stats.average : 0.0;
                    
                    // Tiêu chí nổi bật theo controller: rating >= 4.5, đã bán >= 100
                    return rating >= 4.5 && soldCount >= 100;
                })
                .collect(Collectors.toList());
        
        // Nếu không có sản phẩm nào đạt tiêu chí nghiêm ngặt, fallback chỉ filter theo rating >= 4.5
        List<Product> featured = strictFeatured.isEmpty() ? 
                allProducts.stream()
                    .filter(p -> {
                        ReviewSummary stats = reviewStats.get(p.getId());
                        double rating = stats != null ? stats.average : 0.0;
                        return rating >= 4.5; // Chỉ cần rating >= 4.5
                    })
                    .collect(Collectors.toList())
                : strictFeatured;
        
        // Nếu vẫn không có, lấy tất cả products
        if (featured.isEmpty()) {
            featured = allProducts.stream().collect(Collectors.toList());
        }
        
        List<Product> sorted = featured.stream()
                .sorted((p1, p2) -> {
                    ReviewSummary stats1 = reviewStats.get(p1.getId());
                    ReviewSummary stats2 = reviewStats.get(p2.getId());
                    double rating1 = stats1 != null ? stats1.average : 0.0;
                    double rating2 = stats2 != null ? stats2.average : 0.0;
                    
                    // Sắp xếp theo rating desc, rồi theo sold count desc
                    int ratingCompare = Double.compare(rating2, rating1);
                    if (ratingCompare != 0) return ratingCompare;
                    
                    return Integer.compare(calculateSoldCount(p2), calculateSoldCount(p1));
                })
                .collect(Collectors.toList());
        
        return createPageFromList(sorted, pageable, sorted.size());
    }

    @Override
    public Page<ProductCardResponse> getNewArrivalsPaginated(ProductSearchFilterRequest request) {
        Pageable pageable = buildPageable(request.getPage(), request.getSize(), request.getSortBy(), request.getSortDirection());
        Page<Product> page = productRepository.findByStatusTrueAndIsDeletedFalse(pageable);
        
        // Sắp xếp theo created_date DESC (mới nhất trước) như comment trong controller
        List<Product> sorted = page.getContent().stream()
                .sorted(Comparator.comparing(Product::getCreatedAt).reversed())
                .collect(Collectors.toList());
        
        return createPageFromList(sorted, pageable, page.getTotalElements());
    }

    @Override
    public Page<ProductCardResponse> getBestSellingProductsPaginated(ProductSearchFilterRequest request) {
        Pageable pageable = buildPageable(request.getPage(), request.getSize(), request.getSortBy(), request.getSortDirection());
        Page<Product> page = productRepository.findByStatusTrueAndIsDeletedFalse(pageable);
        
        // Sắp xếp theo số lượng đã bán (sold count) từ cao xuống thấp
        List<Product> sorted = page.getContent().stream()
                .sorted((p1, p2) -> {
                    Integer sold1 = calculateSoldCount(p1);
                    Integer sold2 = calculateSoldCount(p2);
                    
                    // Nếu sold count khác nhau, sắp xếp theo sold count DESC
                    int soldCompare = sold2.compareTo(sold1);
                    if (soldCompare != 0) {
                        return soldCompare;
                    }
                    
                    // Nếu sold count giống nhau (đều = 0), fallback sắp xếp theo createdAt DESC (mới nhất)
                    return p2.getCreatedAt().compareTo(p1.getCreatedAt());
                })
                .collect(Collectors.toList());
        
        return createPageFromList(sorted, pageable, page.getTotalElements());
    }

    @Override
    public Page<ProductCardResponse> getProductsOnSalePaginated(ProductSearchFilterRequest request) {
        Pageable pageable = buildPageable(request.getPage(), request.getSize(), request.getSortBy(), request.getSortDirection());
        Page<Product> page = productRepository.findByStatusTrueAndIsDeletedFalse(pageable);
        List<Product> discounted = page.getContent().stream()
                .filter(p -> {
                    ProductTemplate t = displayTemplate(p);
                    return calculateDiscount(t != null ? t.getPrice() : null).hasDiscount;
                })
                .sorted((p1, p2) -> {
                    // Sắp xếp theo số tiền giảm DESC (giảm nhiều nhất trước)
                    ProductTemplate t1 = displayTemplate(p1);
                    ProductTemplate t2 = displayTemplate(p2);
                    DiscountResult discount1 = calculateDiscount(t1 != null ? t1.getPrice() : null);
                    DiscountResult discount2 = calculateDiscount(t2 != null ? t2.getPrice() : null);
                    
                    // So sánh discount amount DESC
                    return discount2.discountAmount.compareTo(discount1.discountAmount);
                })
                .collect(Collectors.toList());
        return createPageFromList(discounted, pageable, discounted.size());
    }

    @Override
    public Page<ProductCardResponse> getRelatedProductsPaginated(Long productId, ProductSearchFilterRequest request) {
        Pageable pageable = buildPageable(request.getPage(), request.getSize(), request.getSortBy(), request.getSortDirection());
        Product product = productRepository.findByIdAndIsDeletedFalse(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        // Lấy giá của sản phẩm gốc
        ProductTemplate originalTemplate = displayTemplate(product);
        BigDecimal originalPrice = originalTemplate != null ? originalTemplate.getPrice() : BigDecimal.ZERO;
        
        // Lấy tất cả sản phẩm cùng danh mục
        List<Product> categoryProducts = productRepository.findByCategoryIdAndIsDeletedFalse(product.getCategory().getId());
        
        // Lọc theo logic related: loại bỏ chính sản phẩm + chênh lệch giá ≤ 6 triệu
        List<Product> relatedProducts = categoryProducts.stream()
                .filter(p -> !Objects.equals(p.getId(), productId)) // Loại bỏ chính sản phẩm đó
                .filter(p -> {
                    ProductTemplate template = displayTemplate(p);
                    if (template == null || template.getPrice() == null) return false;
                    
                    // Chênh lệch giá không quá 6 triệu VNĐ (6,000,000)
                    BigDecimal priceDiff = template.getPrice().subtract(originalPrice).abs();
                    return priceDiff.compareTo(new BigDecimal("6000000")) <= 0;
                })
                .sorted(Comparator.comparing(Product::getCreatedAt).reversed()) // Mới nhất trước
                .collect(Collectors.toList());
        
        // Apply pagination manually
        int start = pageable.getPageNumber() * pageable.getPageSize();
        int end = Math.min(start + pageable.getPageSize(), relatedProducts.size());
        
        List<Product> pagedProducts = start < relatedProducts.size() 
                ? relatedProducts.subList(start, end) 
                : Collections.emptyList();
        
        return createPageFromList(pagedProducts, pageable, relatedProducts.size());
    }

    @Override
    public List<ProductCardResponse> getProductsOnSale(Integer limit) {
        int take = limitOrDefault(limit);
        List<Product> discounted = productRepository.findByStatusTrueAndIsDeletedFalse().stream()
                .filter(p -> {
                    ProductTemplate t = displayTemplate(p);
                    return calculateDiscount(t != null ? t.getPrice() : null).hasDiscount;
                })
                .sorted((p1, p2) -> {
                    // Sắp xếp theo số tiền giảm DESC (giảm nhiều nhất trước)
                    ProductTemplate t1 = displayTemplate(p1);
                    ProductTemplate t2 = displayTemplate(p2);
                    DiscountResult discount1 = calculateDiscount(t1 != null ? t1.getPrice() : null);
                    DiscountResult discount2 = calculateDiscount(t2 != null ? t2.getPrice() : null);
                    
                    // So sánh discount amount DESC
                    return discount2.discountAmount.compareTo(discount1.discountAmount);
                })
                .limit(take)
                .collect(Collectors.toList());
        return toCards(discounted);
    }

    private Pageable buildPageable(Integer page, Integer size, String sortBy, String sortDirection) {
        int p = page != null && page >= 0 ? page : 0;
        int s = size != null && size > 0 ? size : 20;
        String sortField = resolveSortField(sortBy);
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(p, s, Sort.by(direction, sortField));
    }

    private String resolveSortField(String sortBy) {
        if (sortBy == null || sortBy.isBlank()) {
            return "createdAt";
        }
        String normalized = sortBy.trim().toLowerCase(Locale.ROOT);
        switch (normalized) {
            case "price":
                // Product không có field price trực tiếp, sử dụng createdAt thay thế
                // Price sorting sẽ được xử lý trong service layer
                return "createdAt";
            case "created_date":
            case "createddate":
            case "createdat":
                return "createdAt";
            case "name":
                return "name";
            case "rating":
                // Product không có field rating, sử dụng createdAt thay thế
                return "createdAt";
            default:
                return "createdAt";
        }
    }

    private Page<ProductCardResponse> filterWithPredicate(ProductSearchFilterRequest request, java.util.function.Predicate<Product> predicate) {
        Pageable pageable = buildPageable(request.getPage(), request.getSize(), request.getSortBy(), request.getSortDirection());
        
        // Lấy tất cả sản phẩm active để filter (không phân trang trước)
        List<Product> allProducts = productRepository.findByStatusTrueAndIsDeletedFalse();
        List<Product> filtered = allProducts.stream().filter(predicate).collect(Collectors.toList());
        
        // Apply sorting theo request
        String sortField = resolveSortField(request.getSortBy());
        boolean isAsc = "asc".equalsIgnoreCase(request.getSortDirection());
        
        filtered = filtered.stream()
                .sorted((p1, p2) -> {
                    int compare = compareByField(p1, p2, sortField);
                    return isAsc ? compare : -compare;
                })
                .collect(Collectors.toList());
        
        // Manual pagination
        int start = pageable.getPageNumber() * pageable.getPageSize();
        int end = Math.min(start + pageable.getPageSize(), filtered.size());
        
        List<Product> pagedProducts = start < filtered.size() 
                ? filtered.subList(start, end) 
                : Collections.emptyList();
        
        return createPageFromList(pagedProducts, pageable, filtered.size());
    }

    private Page<ProductCardResponse> createPageFromList(List<Product> products, Pageable pageable, long total) {
        List<ProductCardResponse> content = toCards(products);
        return new PageImpl<>(content, pageable, total);
    }

    private ProductCardResponse toCard(Product product, ReviewSummary reviewSummary) {
        ProductTemplate template = displayTemplate(product);
        BigDecimal originalPrice = template != null ? template.getPrice() : null;
        DiscountResult discount = calculateDiscount(originalPrice);
        ProductMetadata metadata = product.getMetadata();
        ReviewSummary stats = reviewSummary != null ? reviewSummary : ReviewSummary.empty();
        
        // Tính toán price range từ tất cả template
        PriceRange priceInfo = calculatePriceRange(product);
        
        return ProductCardResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .thumbnailUrl(product.getThumbnailUrl())
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .brandId(product.getBrand() != null ? product.getBrand().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .originalPrice(originalPrice)  // Giá thấp nhất
                .minPrice(priceInfo.min)  // Giá thấp nhất từ tất cả template
                .maxPrice(priceInfo.max)  // Giá cao nhất từ tất cả template
                .priceRange(priceInfo.displayText)  // Range text: "10tr - 15tr" or "10tr"
                .discountedPrice(discount.discountedPrice)
                .hasDiscount(discount.hasDiscount)
                .discountPercentage(discount.discountPercentage)
                .savingAmount(discount.discountAmount)
                .averageRating(stats.average)
                .totalReviews(stats.count)
                .ratingDisplay(ratingDisplay(stats))
                .inStock(hasStock(product))
                .stockQuantity(totalStock(product))
                .stockStatus(stockStatus(totalStock(product)))
                .ram(template != null ? template.getRam() : null)
                .storage(template != null ? template.getStorage() : null)
                .color(template != null ? template.getColor() : null)
                .screenSize(metadata != null && metadata.getScreenSize() != null ? metadata.getScreenSize() + "\"" : null)
                .operatingSystem(metadata != null ? metadata.getOperatingSystem() : null)
                .processor(metadata != null ? metadata.getCpuChipset() : null)
                .screenResolution(metadata != null ? metadata.getScreenResolution() : null)
                .screenTechnology(metadata != null ? metadata.getScreenTechnology() : null)
                .refreshRate(metadata != null ? metadata.getRefreshRate() : null)
                .gpu(metadata != null ? metadata.getGpu() : null)
                .cameraDetails(metadata != null ? metadata.getCameraDetails() : null)
                .frontCameraMegapixels(metadata != null ? metadata.getFrontCameraMegapixels() : null)
                .batteryCapacity(metadata != null ? metadata.getBatteryCapacity() : null)
                .chargingPower(metadata != null ? metadata.getChargingPower() : null)
                .chargingType(metadata != null ? metadata.getChargingType() : null)
                .weight(metadata != null ? metadata.getWeight() : null)
                .dimensions(metadata != null ? metadata.getDimensions() : null)
                .material(metadata != null ? metadata.getMaterial() : null)
                .wirelessConnectivity(metadata != null ? metadata.getWirelessConnectivity() : null)
                .simType(metadata != null ? metadata.getSimType() : null)
                .waterResistance(metadata != null ? metadata.getWaterResistance() : null)
                .audioFeatures(metadata != null ? metadata.getAudioFeatures() : null)
                .securityFeatures(metadata != null ? metadata.getSecurityFeatures() : null)
                .additionalSpecs(metadata != null ? metadata.getAdditionalSpecs() : null)
                .build();
    }

        private ProductComparisonResponse.ComparisonProduct toComparisonProduct(Product product, ReviewSummary reviewSummary) {
        ProductTemplate template = displayTemplate(product);
        DiscountResult discount = calculateDiscount(template != null ? template.getPrice() : null);
        ReviewSummary stats = reviewSummary != null ? reviewSummary : ReviewSummary.empty();
        ProductMetadata md = product.getMetadata();
        return ProductComparisonResponse.ComparisonProduct.builder()
            .id(product.getId())
            .name(product.getName())
            .thumbnailUrl(product.getThumbnailUrl())
            .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
            .originalPrice(template != null ? template.getPrice() : null)
            .discountedPrice(discount.discountedPrice)
            .hasDiscount(discount.hasDiscount)
            .averageRating(stats.average)
            .totalReviews(stats.count)
            .inStock(hasStock(product))
            .specs(ProductComparisonResponse.ComparisonSpecs.builder()
                .screen(metadataValue(product, ProductMetadata::getScreenSize))
                .os(metadataValue(product, ProductMetadata::getOperatingSystem))
                .frontCamera(formatMegapixels(md != null ? md.getFrontCameraMegapixels() : null))
                .rearCamera(preferText(md != null ? md.getCameraDetails() : null, formatMegapixels(md != null ? md.getCameraMegapixels() : null)))
                .cpu(metadataValue(product, ProductMetadata::getCpuChipset))
                .ram(template != null ? template.getRam() : null)
                .internalMemory(template != null ? template.getStorage() : null)
                .battery(metadataValue(product, ProductMetadata::getBatteryCapacity))
                .charging(formatCharging(md != null ? md.getChargingPower() : null, md != null ? md.getChargingType() : null))
                .weight(formatWeight(md != null ? md.getWeight() : null))
                .dimensions(metadataValue(product, ProductMetadata::getDimensions))
                .connectivity(metadataValue(product, ProductMetadata::getWirelessConnectivity))
                .sim(metadataValue(product, ProductMetadata::getSimType))
                .materials(metadataValue(product, ProductMetadata::getMaterial))
                .build())
            .build();
        }

    private ProductTemplate displayTemplate(Product product) {
        List<ProductTemplate> templates = product.getTemplates();
        if (templates == null || templates.isEmpty()) {
            return null;
        }
        return templates.stream()
                .filter(ProductTemplate::getStatus)
                .filter(t -> t.getPrice() != null)
                .min(Comparator.comparing(ProductTemplate::getPrice))
                .orElse(templates.get(0));
    }

    private ProductTemplate firstTemplate(Product product) {
        List<ProductTemplate> templates = product.getTemplates();
        if (templates == null || templates.isEmpty()) {
            return null;
        }
        return templates.get(0);
    }

    private boolean matchRam(Product product, List<String> rams) {
        if (rams == null || rams.isEmpty()) return true;
        ProductTemplate t = firstTemplate(product);
        return t != null && rams.contains(t.getRam());
    }

    private boolean matchStorage(Product product, List<String> storages) {
        if (storages == null || storages.isEmpty()) return true;
        ProductTemplate t = firstTemplate(product);
        return t != null && storages.contains(t.getStorage());
    }

    private boolean matchBattery(ProductMetadata metadata, Integer min, Integer max) {
        if (metadata == null || metadata.getBatteryCapacity() == null) return min == null && max == null;
        Integer val = metadata.getBatteryCapacity();
        boolean okMin = min == null || val >= min;
        boolean okMax = max == null || val <= max;
        return okMin && okMax;
    }

    private boolean matchScreenSize(ProductMetadata metadata, List<String> sizes) {
        if (sizes == null || sizes.isEmpty()) return true;
        if (metadata == null || metadata.getScreenSize() == null) return false;
        String size = metadata.getScreenSize().toString();
        return sizes.contains(size);
    }

    private boolean matchOs(ProductMetadata metadata, List<String> osOptions) {
        if (osOptions == null || osOptions.isEmpty()) return true;
        if (metadata == null || metadata.getOperatingSystem() == null) return false;
        return osOptions.contains(metadata.getOperatingSystem());
    }


    private int totalStock(Product product) {
        if (product.getTemplates() == null) return 0;
        return product.getTemplates().stream()
                .filter(ProductTemplate::getStatus)
                .map(ProductTemplate::getStockQuantity)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .sum();
    }

    private boolean hasStock(Product product) {
        return totalStock(product) > 0;
    }

    private String stockStatus(int qty) {
        if (qty > 10) return "In Stock";
        if (qty > 0) return "Low Stock";
        return "Out of Stock";
    }

    private DiscountResult calculateDiscount(BigDecimal price) {
        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
            return DiscountResult.noDiscount(price);
        }
        try {
            double best = 0;
            for (var promo : promotionService.checkAndGetAvailablePromotions(price.doubleValue())) {
                Double discount = promotionService.calculateDiscount(promo.getId(), price.doubleValue());
                if (discount != null && discount > best) {
                    best = discount;
                }
            }
            if (best > 0) {
                BigDecimal discounted = price.subtract(BigDecimal.valueOf(best));
                double percent = (best / price.doubleValue()) * 100;
                return DiscountResult.of(discounted, BigDecimal.valueOf(best), percent);
            }
        } catch (Exception ex) {
            log.warn("Cannot calculate discount: {}", ex.getMessage());
        }
        return DiscountResult.noDiscount(price);
    }

    private int limitOrDefault(Integer limit) {
        return (limit != null && limit > 0) ? limit : 10;
    }

    /**
     * Tính số lượng đã bán của sản phẩm từ order_items
     * TODO: Implement query to order_items table
     * Hiện tại trả về 0 vì chưa có OrderItemRepository
     */
    private int calculateSoldCount(Product product) {
        // TODO: Implement actual query to order_items
        // Example: return orderItemRepository.sumQuantityByProductId(product.getId());
        
        // TEMPORARY: Return 0 until OrderItemRepository is implemented
        // Do NOT use fake data for best-selling logic
        return 0;
    }

    private Page<ProductCardResponse> toCardPage(Page<Product> page) {
        List<ProductCardResponse> content = toCards(page.getContent());
        return new PageImpl<>(content, page.getPageable(), page.getTotalElements());
    }

    private List<ProductCardResponse> toCards(List<Product> products) {
        Map<Long, ReviewSummary> stats = reviewStats(products);
        return products.stream()
                .map(p -> toCard(p, stats.get(p.getId())))
                .collect(Collectors.toList());
    }

    private Map<Long, ReviewSummary> reviewStats(List<Product> products) {
        Map<Long, ReviewSummary> stats = new HashMap<>();
        if (products == null || products.isEmpty()) {
            return stats;
        }
        List<Long> ids = products.stream()
                .map(Product::getId)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
        if (ids.isEmpty()) {
            return stats;
        }
        for (Object[] row : reviewRepository.getReviewStatsByProductIds(ids)) {
            Long productId = (Long) row[0];
            Double avg = (Double) row[1];
            Long count = (Long) row[2];
            stats.put(productId, new ReviewSummary(avg != null ? avg : 0.0, count != null ? count.intValue() : 0));
        }
        return stats;
    }

    private String ratingDisplay(ReviewSummary stats) {
        double avg = stats != null ? stats.average : 0.0;
        int count = stats != null ? stats.count : 0;
        return String.format(Locale.US, "%.1f (%d reviews)", avg, count);
    }

    private String preferText(String primary, String fallback) {
        if (primary != null && !primary.isBlank()) {
            return primary;
        }
        return (fallback != null && !fallback.isBlank()) ? fallback : null;
    }

    private String formatMegapixels(Double value) {
        if (value == null) return null;
        return String.format(Locale.US, "%.0fMP", value);
    }

    private String formatCharging(Integer power, String type) {
        if (power == null && (type == null || type.isBlank())) {
            return null;
        }
        if (power != null && type != null && !type.isBlank()) {
            return power + "W " + type;
        }
        if (power != null) {
            return power + "W";
        }
        return type;
    }

    private String formatWeight(Double weight) {
        if (weight == null) return null;
        return String.format(Locale.US, "%.0fg", weight);
    }

    private List<ProductDetailViewResponse.ProductImageInfo> toImages(List<com.utephonehub.backend.entity.ProductImage> images) {
        if (images == null || images.isEmpty()) {
            return Collections.emptyList();
        }
        return images.stream()
                .sorted(Comparator.comparing(com.utephonehub.backend.entity.ProductImage::getImageOrder, Comparator.nullsLast(Integer::compareTo)))
                .map(img -> ProductDetailViewResponse.ProductImageInfo.builder()
                        .id(img.getId())
                        .imageUrl(img.getImageUrl())
                        .altText(img.getAltText())
                        .isPrimary(Boolean.TRUE.equals(img.getIsPrimary()))
                        .imageOrder(img.getImageOrder())
                        .build())
                .collect(Collectors.toList());
    }

    private List<ProductDetailViewResponse.VariantInfo> toVariants(List<ProductTemplate> templates) {
        if (templates == null || templates.isEmpty()) {
            return Collections.emptyList();
        }
        return templates.stream()
                .filter(t -> Boolean.TRUE.equals(t.getStatus()))
                .sorted(Comparator.comparing(ProductTemplate::getPrice))
                .map(t -> {
                    DiscountResult discount = calculateDiscount(t.getPrice());
                    return ProductDetailViewResponse.VariantInfo.builder()
                            .id(t.getId())
                            .sku(t.getSku())
                            .color(t.getColor())
                            .storage(t.getStorage())
                            .ram(t.getRam())
                            .originalPrice(t.getPrice())
                            .discountedPrice(discount.discountedPrice)
                            .discountInfo(ProductDetailViewResponse.DiscountInfo.builder()
                                    .discountAmount(discount.discountAmount)
                                    .discountPercentage(discount.discountPercentage)
                                    .promotionId(null)
                                    .promotionTitle(null)
                                    .build())
                            .stockQuantity(t.getStockQuantity())
                            .stockStatus(t.getStockStatus() != null ? t.getStockStatus().name() : null)
                            .status(t.getStatus())
                            .build();
                })
                .collect(Collectors.toList());
    }

    private ProductDetailViewResponse.TechnicalSpecsInfo toTechnicalSpecs(ProductMetadata metadata) {
        if (metadata == null) {
            return null;
        }
        return ProductDetailViewResponse.TechnicalSpecsInfo.builder()
                .screenResolution(metadata.getScreenResolution())
                .screenSize(metadata.getScreenSize())
                .screenTechnology(metadata.getScreenTechnology())
                .refreshRate(metadata.getRefreshRate())
                .cpuChipset(metadata.getCpuChipset())
                .gpu(metadata.getGpu())
                .operatingSystem(metadata.getOperatingSystem())
                .cameraDetails(metadata.getCameraDetails())
                .frontCameraMegapixels(metadata.getFrontCameraMegapixels())
                .batteryCapacity(metadata.getBatteryCapacity())
                .chargingPower(metadata.getChargingPower())
                .chargingType(metadata.getChargingType())
                .weight(metadata.getWeight())
                .dimensions(metadata.getDimensions())
                .material(metadata.getMaterial())
                .wirelessConnectivity(metadata.getWirelessConnectivity())
                .simType(metadata.getSimType())
                .waterResistance(metadata.getWaterResistance())
                .audioFeatures(metadata.getAudioFeatures())
                .securityFeatures(metadata.getSecurityFeatures())
                .additionalSpecs(metadata.getAdditionalSpecs())
                .build();
    }

    private <T> T firstOrNull(List<T> list) {
        if (list == null || list.isEmpty()) return null;
        return list.get(0);
    }

    private String metadataValue(Product product, java.util.function.Function<ProductMetadata, Object> fn) {
        ProductMetadata md = product.getMetadata();
        if (md == null) return null;
        Object val = fn.apply(md);
        return val != null ? val.toString() : null;
    }

    private String normalizeKeyword(String keyword) {
        if (keyword == null) {
            return null;
        }
        String trimmed = keyword.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        // Normalize Vietnamese characters
        String normalized = Normalizer.normalize(trimmed, Normalizer.Form.NFD);
        normalized = DIACRITICS_PATTERN.matcher(normalized).replaceAll("");
        // Handle Vietnamese đ/Đ specifically
        normalized = normalized.replace('đ', 'd').replace('Đ', 'D');
        // Convert to lowercase for case-insensitive search
        normalized = normalized.toLowerCase(Locale.ROOT);
        // Handle common Vietnamese search patterns
        normalized = normalized.replace("ư", "u").replace("Ư", "U")
                              .replace("ơ", "o").replace("Ơ", "O")
                              .replace("ă", "a").replace("Ă", "A");
        return normalized;
    }

    private String buildFlexibleLikePattern(String normalizedKeyword) {
        if (normalizedKeyword == null || normalizedKeyword.isEmpty()) {
            return null;
        }
        String collapsed = WHITESPACE_PATTERN.matcher(normalizedKeyword).replaceAll("%");
        return "%" + collapsed + "%";
    }

    private static final class DiscountResult {
        private final BigDecimal discountedPrice;
        private final BigDecimal discountAmount;
        private final Double discountPercentage;
        private final boolean hasDiscount;

        private DiscountResult(BigDecimal discountedPrice, BigDecimal discountAmount, Double discountPercentage, boolean hasDiscount) {
            this.discountedPrice = discountedPrice;
            this.discountAmount = discountAmount;
            this.discountPercentage = discountPercentage;
            this.hasDiscount = hasDiscount;
        }

        static DiscountResult noDiscount(BigDecimal price) {
            return new DiscountResult(price, BigDecimal.ZERO, 0.0, false);
        }

        static DiscountResult of(BigDecimal discountedPrice, BigDecimal discountAmount, Double discountPercentage) {
            return new DiscountResult(discountedPrice, discountAmount, discountPercentage, true);
        }
    }

    /**
     * Tính toán price range từ tất cả template của sản phẩm
     */
    private PriceRange calculatePriceRange(Product product) {
        List<ProductTemplate> templates = product.getTemplates();
        if (templates == null || templates.isEmpty()) {
            return new PriceRange(null, null, "Liên hệ");
        }
        
        List<BigDecimal> prices = templates.stream()
                .filter(t -> Boolean.TRUE.equals(t.getStatus()))
                .map(ProductTemplate::getPrice)
                .filter(Objects::nonNull)
                .sorted()
                .collect(Collectors.toList());
        
        if (prices.isEmpty()) {
            return new PriceRange(null, null, "Liên hệ");
        }
        
        BigDecimal min = prices.get(0);
        BigDecimal max = prices.get(prices.size() - 1);
        
        String displayText;
        if (min.equals(max)) {
            // Chỉ có 1 giá
            displayText = formatPrice(min);
        } else {
            // Có range giá
            displayText = formatPrice(min) + " - " + formatPrice(max);
        }
        
        return new PriceRange(min, max, displayText);
    }
    
    /**
     * Format giá thành text hiển thị: 10.000.000 -> "10tr"
     */
    private String formatPrice(BigDecimal price) {
        if (price == null) return "0đ";
        
        double value = price.doubleValue();
        if (value >= 1_000_000) {
            double millions = value / 1_000_000;
            if (millions == (int) millions) {
                return String.format("%.0ftr", millions);
            } else {
                return String.format("%.1ftr", millions);
            }
        } else if (value >= 1_000) {
            double thousands = value / 1_000;
            if (thousands == (int) thousands) {
                return String.format("%.0fk", thousands);
            } else {
                return String.format("%.1fk", thousands);
            }
        } else {
            return String.format("%.0fđ", value);
        }
    }

    /**
     * Apply sorting cho list products trong service layer
     * Xử lý price và rating sorting mà database không thể làm được
     */
    private List<Product> applySorting(List<Product> products, String sortBy, String sortDirection) {
        if (products == null || products.isEmpty()) return products;
        
        boolean isAsc = "asc".equalsIgnoreCase(sortDirection);
        
        if (sortBy == null || sortBy.trim().isEmpty()) {
            sortBy = "created_date";
        }
        
        String normalizedSortBy = sortBy.trim().toLowerCase(Locale.ROOT);
        
        return products.stream()
                .sorted((p1, p2) -> {
                    int compare = 0;
                    
                    switch (normalizedSortBy) {
                        case "price":
                            ProductTemplate t1 = displayTemplate(p1);
                            ProductTemplate t2 = displayTemplate(p2);
                            BigDecimal price1 = t1 != null ? t1.getPrice() : BigDecimal.ZERO;
                            BigDecimal price2 = t2 != null ? t2.getPrice() : BigDecimal.ZERO;
                            compare = price1.compareTo(price2);
                            break;
                        case "rating":
                            // Cần load review data để sort theo rating
                            Map<Long, ReviewSummary> stats = reviewStats(List.of(p1, p2));
                            double rating1 = stats.getOrDefault(p1.getId(), ReviewSummary.empty()).average;
                            double rating2 = stats.getOrDefault(p2.getId(), ReviewSummary.empty()).average;
                            compare = Double.compare(rating1, rating2);
                            break;
                        case "name":
                            String name1 = p1.getName() != null ? p1.getName() : "";
                            String name2 = p2.getName() != null ? p2.getName() : "";
                            compare = name1.compareToIgnoreCase(name2);
                            break;
                        case "created_date":
                        case "createddate":
                        case "createdat":
                        default:
                            compare = p1.getCreatedAt().compareTo(p2.getCreatedAt());
                            break;
                    }
                    
                    return isAsc ? compare : -compare;
                })
                .collect(Collectors.toList());
    }

    /**
     * So sánh 2 product theo field để sorting
     */
    private int compareByField(Product p1, Product p2, String sortField) {
        if (p1 == null && p2 == null) return 0;
        if (p1 == null) return 1;
        if (p2 == null) return -1;
        
        switch (sortField) {
            case "createdAt":
                return p1.getCreatedAt().compareTo(p2.getCreatedAt());
            case "name":
                String name1 = p1.getName() != null ? p1.getName() : "";
                String name2 = p2.getName() != null ? p2.getName() : "";
                return name1.compareTo(name2);
            case "price":
                ProductTemplate t1 = displayTemplate(p1);
                ProductTemplate t2 = displayTemplate(p2);
                BigDecimal price1 = t1 != null ? t1.getPrice() : BigDecimal.ZERO;
                BigDecimal price2 = t2 != null ? t2.getPrice() : BigDecimal.ZERO;
                return price1.compareTo(price2);
            default:
                return p1.getCreatedAt().compareTo(p2.getCreatedAt());
        }
    }

    private static final class ReviewSummary {
        private final double average;
        private final int count;

        private ReviewSummary(double average, int count) {
            this.average = average;
            this.count = count;
        }

        static ReviewSummary empty() {
            return new ReviewSummary(0.0, 0);
        }
    }
    
    private static final class PriceRange {
        private final BigDecimal min;
        private final BigDecimal max;
        private final String displayText;
        
        private PriceRange(BigDecimal min, BigDecimal max, String displayText) {
            this.min = min;
            this.max = max;
            this.displayText = displayText;
        }
    }
}
