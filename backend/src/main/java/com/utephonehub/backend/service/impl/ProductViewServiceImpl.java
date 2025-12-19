package com.utephonehub.backend.service.impl;

import com.utephonehub.backend.dto.request.productview.ProductSearchFilterRequest;
import com.utephonehub.backend.dto.response.productview.*;
import com.utephonehub.backend.entity.*;
import com.utephonehub.backend.exception.BadRequestException;
import com.utephonehub.backend.exception.ResourceNotFoundException;
import com.utephonehub.backend.repository.*;
import com.utephonehub.backend.service.IProductViewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementation của ProductViewService
 * Xử lý logic cho client-side product viewing
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ProductViewServiceImpl implements IProductViewService {
    
    private final ProductRepository productRepository;
    private final ProductTemplateRepository productTemplateRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductImageRepository productImageRepository;
    
    @Override
    public Page<ProductViewResponse> searchAndFilterProducts(ProductSearchFilterRequest request) {
        log.info("Searching products with request: {}", request);
        
        // Validate request
        validateSearchRequest(request);
        
        // Build pageable with sorting
        Pageable pageable = buildPageable(request);
        
        // Build query specification
        Page<Product> productPage = findProductsWithFilters(request, pageable);
        
        // Convert to response
        return productPage.map(this::convertToProductViewResponse);
    }
    
    @Override
    public ProductDetailViewResponse getProductDetailById(Long productId) {
        log.info("Getting product detail for ID: {}", productId);
        
        Product product = productRepository.findByIdAndIsDeletedFalse(productId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy sản phẩm với ID: " + productId));
        
        if (!product.getStatus()) {
            throw new BadRequestException("Sản phẩm hiện không khả dụng");
        }
        
        return convertToProductDetailViewResponse(product);
    }
    
    @Override
    public CategoryProductsResponse getProductsByCategory(Long categoryId, ProductSearchFilterRequest request) {
        log.info("Getting products for category ID: {}", categoryId);
        
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy danh mục với ID: " + categoryId));
        
        // Build category response
        CategoryProductsResponse response = CategoryProductsResponse.builder()
                .category(buildCategoryInfo(category))
                .breadcrumbs(buildBreadcrumbs(category))
                .subCategories(buildSubCategories(category))
                .filterOptions(buildFilterOptions(categoryId))
                .build();
        
        return response;
    }
    
    @Override
    public ProductComparisonResponse compareProducts(List<Long> productIds) {
        log.info("Comparing products: {}", productIds);
        
        if (productIds == null || productIds.isEmpty()) {
            throw new BadRequestException("Danh sách sản phẩm không được để trống");
        }
        
        if (productIds.size() > 4) {
            throw new BadRequestException("Chỉ có thể so sánh tối đa 4 sản phẩm");
        }
        
        List<Product> products = productRepository.findAllById(productIds);
        
        if (products.size() != productIds.size()) {
            throw new ResourceNotFoundException("Một số sản phẩm không tồn tại");
        }
        
        List<ProductComparisonResponse.ComparisonProduct> comparisonProducts = products.stream()
                .map(this::convertToComparisonProduct)
                .collect(Collectors.toList());
        
        return ProductComparisonResponse.builder()
                .products(comparisonProducts)
                .build();
    }
    
    @Override
    public List<ProductViewResponse> getRelatedProducts(Long productId, Integer limit) {
        log.info("Getting related products for ID: {} with limit: {}", productId, limit);
        
        Product product = productRepository.findByIdAndIsDeletedFalse(productId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy sản phẩm với ID: " + productId));
        
        int limitValue = (limit != null && limit > 0) ? limit : 8;
        
        // Get products from same category, excluding current product
        Pageable pageable = PageRequest.of(0, limitValue);
        Page<Product> relatedProducts = productRepository.findByCategoryIdAndIsDeletedFalse(
                product.getCategory().getId(), pageable);
        
        return relatedProducts.getContent().stream()
                .filter(p -> !p.getId().equals(productId) && p.getStatus())
                .map(this::convertToProductViewResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ProductViewResponse> getBestSellingProducts(Integer limit) {
        log.info("Getting best selling products with limit: {}", limit);
        
        int limitValue = (limit != null && limit > 0) ? limit : 10;
        
        // Get active products sorted by creation date (newest first) as placeholder
        // In real implementation, this should use sales data
        Pageable pageable = PageRequest.of(0, limitValue, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Product> products = productRepository.findByStatusTrueAndIsDeletedFalse(pageable);
        
        return products.getContent().stream()
                .map(this::convertToProductViewResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ProductViewResponse> getNewArrivals(Integer limit) {
        log.info("Getting new arrivals with limit: {}", limit);
        
        int limitValue = (limit != null && limit > 0) ? limit : 10;
        
        Pageable pageable = PageRequest.of(0, limitValue, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Product> products = productRepository.findByStatusTrueAndIsDeletedFalse(pageable);
        
        return products.getContent().stream()
                .map(this::convertToProductViewResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ProductViewResponse> getFeaturedProducts(Integer limit) {
        log.info("Getting featured products with limit: {}", limit);
        
        int limitValue = (limit != null && limit > 0) ? limit : 10;
        
        // Get active products as featured (can be enhanced with featured flag)
        Pageable pageable = PageRequest.of(0, limitValue);
        Page<Product> products = productRepository.findByStatusTrueAndIsDeletedFalse(pageable);
        
        return products.getContent().stream()
                .map(this::convertToProductViewResponse)
                .collect(Collectors.toList());
    }
    
    // ==================== PRIVATE HELPER METHODS ====================
    
    private void validateSearchRequest(ProductSearchFilterRequest request) {
        if (request.getPage() != null && request.getPage() < 0) {
            throw new BadRequestException("Số trang phải >= 0");
        }
        
        if (request.getSize() != null && (request.getSize() < 1 || request.getSize() > 100)) {
            throw new BadRequestException("Kích thước trang phải từ 1-100");
        }
        
        if (request.getMinRating() != null && (request.getMinRating() < 1 || request.getMinRating() > 5)) {
            throw new BadRequestException("Đánh giá phải từ 1-5");
        }
    }
    
    private Pageable buildPageable(ProductSearchFilterRequest request) {
        int page = request.getPage() != null ? request.getPage() : 0;
        int size = request.getSize() != null ? request.getSize() : 20;
        
        Sort sort = buildSort(request.getSortBy(), request.getSortDirection());
        
        return PageRequest.of(page, size, sort);
    }
    
    private Sort buildSort(String sortBy, String sortDirection) {
        String sortField = (sortBy != null) ? sortBy : "createdAt";
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDirection) 
                ? Sort.Direction.ASC 
                : Sort.Direction.DESC;
        
        // Map sort fields
        switch (sortField.toLowerCase()) {
            case "price":
                return Sort.by(direction, "templates.price");
            case "name":
                return Sort.by(direction, "name");
            case "rating":
                // Placeholder - would need rating aggregation
                return Sort.by(Sort.Direction.DESC, "createdAt");
            case "created_date":
            default:
                return Sort.by(direction, "createdAt");
        }
    }
    
    private Page<Product> findProductsWithFilters(ProductSearchFilterRequest request, Pageable pageable) {
        // Build dynamic query based on filters
        if (request.getKeyword() != null && !request.getKeyword().trim().isEmpty()) {
            return productRepository.searchProducts(request.getKeyword().trim(), pageable);
        }
        
        if (request.getCategoryId() != null) {
            return productRepository.findByCategoryIdAndIsDeletedFalse(request.getCategoryId(), pageable);
        }
        
        if (request.getMinPrice() != null || request.getMaxPrice() != null) {
            return productRepository.filterProducts(
                    request.getCategoryId(),
                    request.getBrandIds() != null && !request.getBrandIds().isEmpty() 
                            ? request.getBrandIds().get(0) : null,
                    request.getMinPrice(),
                    request.getMaxPrice(),
                    pageable
            );
        }
        
        return productRepository.findByStatusTrueAndIsDeletedFalse(pageable);
    }
    
    private ProductViewResponse convertToProductViewResponse(Product product) {
        // Get price range from templates
        List<ProductTemplate> templates = product.getTemplates();
        BigDecimal minPrice = null;
        BigDecimal maxPrice = null;
        int totalStock = 0;
        
        if (templates != null && !templates.isEmpty()) {
            List<BigDecimal> prices = templates.stream()
                    .filter(t -> t.getStatus())
                    .map(ProductTemplate::getPrice)
                    .collect(Collectors.toList());
            
            if (!prices.isEmpty()) {
                minPrice = prices.stream().min(BigDecimal::compareTo).orElse(null);
                maxPrice = prices.stream().max(BigDecimal::compareTo).orElse(null);
            }
            
            totalStock = templates.stream()
                    .filter(t -> t.getStatus())
                    .mapToInt(ProductTemplate::getStockQuantity)
                    .sum();
        }
        
        // Get images
        List<ProductViewResponse.ProductImageInfo> images = product.getImages().stream()
                .sorted(Comparator.comparing(ProductImage::getImageOrder))
                .map(img -> ProductViewResponse.ProductImageInfo.builder()
                        .id(img.getId())
                        .imageUrl(img.getImageUrl())
                        .altText(img.getAltText())
                        .isPrimary(img.getIsPrimary())
                        .imageOrder(img.getImageOrder())
                        .build())
                .collect(Collectors.toList());
        
        return ProductViewResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .thumbnailUrl(product.getThumbnailUrl())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .brandId(product.getBrand().getId())
                .brandName(product.getBrand().getName())
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .averageRating(0.0) // Placeholder
                .totalReviews(0) // Placeholder
                .inStock(totalStock > 0)
                .totalStock(totalStock)
                .images(images)
                .variantsCount(templates != null ? templates.size() : 0)
                .promotionBadge(null) // Placeholder
                .discountPercentage(null) // Placeholder
                .build();
    }
    
    private ProductDetailViewResponse convertToProductDetailViewResponse(Product product) {
        // Category info
        ProductDetailViewResponse.CategoryInfo categoryInfo = ProductDetailViewResponse.CategoryInfo.builder()
                .id(product.getCategory().getId())
                .name(product.getCategory().getName())
                .slug(product.getCategory().getName().toLowerCase().replaceAll("\\s+", "-"))
                .build();
        
        // Brand info
        ProductDetailViewResponse.BrandInfo brandInfo = ProductDetailViewResponse.BrandInfo.builder()
                .id(product.getBrand().getId())
                .name(product.getBrand().getName())
                .logoUrl(product.getBrand().getLogoUrl())
                .build();
        
        // Images
        List<ProductDetailViewResponse.ProductImageInfo> images = product.getImages().stream()
                .sorted(Comparator.comparing(ProductImage::getImageOrder))
                .map(img -> ProductDetailViewResponse.ProductImageInfo.builder()
                        .id(img.getId())
                        .imageUrl(img.getImageUrl())
                        .altText(img.getAltText())
                        .isPrimary(img.getIsPrimary())
                        .imageOrder(img.getImageOrder())
                        .build())
                .collect(Collectors.toList());
        
        // Variants
        List<ProductDetailViewResponse.VariantInfo> variants = product.getTemplates().stream()
                .map(t -> ProductDetailViewResponse.VariantInfo.builder()
                        .id(t.getId())
                        .sku(t.getSku())
                        .color(t.getColor())
                        .storage(t.getStorage())
                        .ram(t.getRam())
                        .price(t.getPrice())
                        .compareAtPrice(null) // Can add compareAtPrice field to ProductTemplate
                        .stockQuantity(t.getStockQuantity())
                        .stockStatus(t.getStockStatus().name())
                        .status(t.getStatus())
                        .build())
                .collect(Collectors.toList());
        
        // Technical Specs
        ProductDetailViewResponse.TechnicalSpecsInfo specs = null;
        if (product.getMetadata() != null) {
            ProductMetadata metadata = product.getMetadata();
            String screenInfo = "";
            if (metadata.getScreenSize() != null && metadata.getScreenTechnology() != null) {
                screenInfo = metadata.getScreenSize() + "\" " + metadata.getScreenTechnology();
            } else if (metadata.getScreenSize() != null) {
                screenInfo = metadata.getScreenSize() + "\"";
            }
            
            specs = ProductDetailViewResponse.TechnicalSpecsInfo.builder()
                    .screen(screenInfo.isEmpty() ? null : screenInfo)
                    .os(metadata.getOperatingSystem())
                    .frontCamera(metadata.getFrontCameraMegapixels() != null ? metadata.getFrontCameraMegapixels() + "MP" : null)
                    .rearCamera(metadata.getCameraDetails())
                    .cpu(metadata.getCpuChipset())
                    .ram(null) // RAM is in ProductTemplate, not metadata
                    .internalMemory(null) // Storage is in ProductTemplate
                    .externalMemory(null)
                    .sim(metadata.getSimType())
                    .battery(metadata.getBatteryCapacity() != null ? metadata.getBatteryCapacity() + " mAh" : null)
                    .charging(metadata.getChargingPower() != null ? metadata.getChargingPower() + "W" : null)
                    .dimensions(metadata.getDimensions())
                    .weight(metadata.getWeight() != null ? metadata.getWeight() + "g" : null)
                    .materials(metadata.getMaterial())
                    .connectivity(metadata.getWirelessConnectivity())
                    .features(metadata.getSecurityFeatures())
                    .build();
        }
        
        int totalStock = product.getTemplates().stream()
                .filter(t -> t.getStatus())
                .mapToInt(ProductTemplate::getStockQuantity)
                .sum();
        
        return ProductDetailViewResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .thumbnailUrl(product.getThumbnailUrl())
                .category(categoryInfo)
                .brand(brandInfo)
                .images(images)
                .variants(variants)
                .technicalSpecs(specs)
                .averageRating(0.0) // Placeholder
                .totalReviews(0) // Placeholder
                .inStock(totalStock > 0)
                .build();
    }
    
    private ProductComparisonResponse.ComparisonProduct convertToComparisonProduct(Product product) {
        List<ProductTemplate> templates = product.getTemplates();
        BigDecimal minPrice = null;
        BigDecimal maxPrice = null;
        
        if (templates != null && !templates.isEmpty()) {
            List<BigDecimal> prices = templates.stream()
                    .filter(t -> t.getStatus())
                    .map(ProductTemplate::getPrice)
                    .collect(Collectors.toList());
            
            if (!prices.isEmpty()) {
                minPrice = prices.stream().min(BigDecimal::compareTo).orElse(null);
                maxPrice = prices.stream().max(BigDecimal::compareTo).orElse(null);
            }
        }
        
        int totalStock = templates.stream()
                .filter(t -> t.getStatus())
                .mapToInt(ProductTemplate::getStockQuantity)
                .sum();
        
        // Comparison specs
        ProductComparisonResponse.ComparisonSpecs specs = null;
        if (product.getMetadata() != null) {
            ProductMetadata metadata = product.getMetadata();
            String screenInfo = "";
            if (metadata.getScreenSize() != null && metadata.getScreenTechnology() != null) {
                screenInfo = metadata.getScreenSize() + "\" " + metadata.getScreenTechnology();
            } else if (metadata.getScreenSize() != null) {
                screenInfo = metadata.getScreenSize() + "\"";
            }
            
            specs = ProductComparisonResponse.ComparisonSpecs.builder()
                    .screen(screenInfo.isEmpty() ? null : screenInfo)
                    .os(metadata.getOperatingSystem())
                    .frontCamera(metadata.getFrontCameraMegapixels() != null ? metadata.getFrontCameraMegapixels() + "MP" : null)
                    .rearCamera(metadata.getCameraDetails())
                    .cpu(metadata.getCpuChipset())
                    .ram(null) // RAM is in ProductTemplate
                    .internalMemory(null) // Storage is in ProductTemplate
                    .battery(metadata.getBatteryCapacity() != null ? metadata.getBatteryCapacity() + " mAh" : null)
                    .charging(metadata.getChargingPower() != null ? metadata.getChargingPower() + "W" : null)
                    .weight(metadata.getWeight() != null ? metadata.getWeight() + "g" : null)
                    .build();
        }
        
        return ProductComparisonResponse.ComparisonProduct.builder()
                .id(product.getId())
                .name(product.getName())
                .thumbnailUrl(product.getThumbnailUrl())
                .brandName(product.getBrand().getName())
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .averageRating(0.0) // Placeholder
                .totalReviews(0) // Placeholder
                .inStock(totalStock > 0)
                .specs(specs)
                .build();
    }
    
    private CategoryProductsResponse.CategoryInfo buildCategoryInfo(Category category) {
        int productCount = productRepository.findByCategoryIdAndIsDeletedFalse(category.getId()).size();
        
        return CategoryProductsResponse.CategoryInfo.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getName().toLowerCase().replaceAll("\\s+", "-"))
                .description(category.getDescription())
                .productCount(productCount)
                .build();
    }
    
    private List<CategoryProductsResponse.BreadcrumbItem> buildBreadcrumbs(Category category) {
        List<CategoryProductsResponse.BreadcrumbItem> breadcrumbs = new ArrayList<>();
        
        Category current = category;
        while (current != null) {
            breadcrumbs.add(0, CategoryProductsResponse.BreadcrumbItem.builder()
                    .id(current.getId())
                    .name(current.getName())
                    .slug(current.getName().toLowerCase().replaceAll("\\s+", "-"))
                    .build());
            current = current.getParent();
        }
        
        return breadcrumbs;
    }
    
    private List<CategoryProductsResponse.CategoryInfo> buildSubCategories(Category category) {
        if (category.getChildren() == null || category.getChildren().isEmpty()) {
            return Collections.emptyList();
        }
        
        return category.getChildren().stream()
                .map(this::buildCategoryInfo)
                .collect(Collectors.toList());
    }
    
    private CategoryProductsResponse.FilterOptions buildFilterOptions(Long categoryId) {
        // Get available brands for this category
        List<Product> products = productRepository.findByCategoryIdAndIsDeletedFalse(categoryId);
        
        Map<Long, String> brandMap = new HashMap<>();
        BigDecimal minPrice = null;
        BigDecimal maxPrice = null;
        
        for (Product product : products) {
            if (product.getBrand() != null) {
                brandMap.put(product.getBrand().getId(), product.getBrand().getName());
            }
            
            // Get price range
            for (ProductTemplate template : product.getTemplates()) {
                if (template.getStatus()) {
                    if (minPrice == null || template.getPrice().compareTo(minPrice) < 0) {
                        minPrice = template.getPrice();
                    }
                    if (maxPrice == null || template.getPrice().compareTo(maxPrice) > 0) {
                        maxPrice = template.getPrice();
                    }
                }
            }
        }
        
        List<CategoryProductsResponse.FilterOptions.BrandOption> brandOptions = brandMap.entrySet().stream()
                .map(entry -> CategoryProductsResponse.FilterOptions.BrandOption.builder()
                        .id(entry.getKey())
                        .name(entry.getValue())
                        .productCount(0) // Can be calculated
                        .build())
                .collect(Collectors.toList());
        
        CategoryProductsResponse.FilterOptions.PriceRange priceRange = 
                CategoryProductsResponse.FilterOptions.PriceRange.builder()
                        .min(minPrice != null ? minPrice : BigDecimal.ZERO)
                        .max(maxPrice != null ? maxPrice : BigDecimal.ZERO)
                        .build();
        
        // Placeholder for rating options
        List<CategoryProductsResponse.FilterOptions.RatingOption> ratingOptions = Arrays.asList(
                CategoryProductsResponse.FilterOptions.RatingOption.builder().stars(5).count(0).build(),
                CategoryProductsResponse.FilterOptions.RatingOption.builder().stars(4).count(0).build(),
                CategoryProductsResponse.FilterOptions.RatingOption.builder().stars(3).count(0).build()
        );
        
        return CategoryProductsResponse.FilterOptions.builder()
                .availableBrands(brandOptions)
                .priceRange(priceRange)
                .ratingOptions(ratingOptions)
                .build();
    }
}
