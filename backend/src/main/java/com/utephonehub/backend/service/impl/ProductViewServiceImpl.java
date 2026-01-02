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
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ProductViewServiceImpl implements IProductViewService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final IPromotionService promotionService;

    @Override
    public Page<ProductCardResponse> searchAndFilterProducts(ProductSearchFilterRequest request) {
        Pageable pageable = buildPageable(request.getPage(), request.getSize(), request.getSortBy(), request.getSortDirection());
        String keyword = request.getKeyword();
        Page<Product> page = (keyword != null && !keyword.isBlank())
                ? productRepository.searchProductsOptimized(keyword.trim(), pageable)
                : productRepository.findAllForProductView(pageable);
        return page.map(this::toCard);
    }

    @Override
    public Page<ProductCardResponse> filterProducts(ProductFilterRequest request) {
        Pageable pageable = buildPageable(request.getPage(), request.getSize(), request.getSortBy(), request.getSortDirection());
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
        return createPageFromList(filtered, pageable, basePage.getTotalElements());
    }

    @Override
    public ProductDetailViewResponse getProductDetailById(Long productId) {
        Product product = productRepository.findByIdAndIsDeletedFalse(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));
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
                .inStock(hasStock(product))
                .build();
    }

    @Override
    public CategoryProductsResponse getProductsByCategory(Long categoryId, ProductSearchFilterRequest request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Pageable pageable = buildPageable(request.getPage(), request.getSize(), request.getSortBy(), request.getSortDirection());
        Page<Product> productPage = productRepository.findByCategoryIdOptimized(categoryId, pageable);
        CategoryProductsResponse.CategoryInfo info = CategoryProductsResponse.CategoryInfo.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .productCount((int) productRepository.countByCategoryIdAndIsDeletedFalse(categoryId))
                .build();
        return CategoryProductsResponse.builder()
                .category(info)
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
        List<ProductComparisonResponse.ComparisonProduct> items = products.stream()
                .map(this::toComparisonProduct)
                .collect(Collectors.toList());
        return ProductComparisonResponse.builder().products(items).build();
    }

    @Override
    public List<ProductCardResponse> getRelatedProducts(Long productId, Integer limit) {
        Product product = productRepository.findByIdAndIsDeletedFalse(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        List<Product> list = productRepository.findByCategoryIdAndIsDeletedFalse(product.getCategory().getId());
        return list.stream()
                .filter(p -> !Objects.equals(p.getId(), productId))
                .limit(limitOrDefault(limit))
                .map(this::toCard)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductCardResponse> getBestSellingProducts(Integer limit) {
        List<Product> list = productRepository.findByStatusTrueAndIsDeletedFalse();
        return list.stream()
                .sorted(Comparator.comparing(Product::getCreatedAt).reversed())
                .limit(limitOrDefault(limit))
                .map(this::toCard)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductCardResponse> getNewArrivals(Integer limit) {
        List<Product> list = productRepository.findByStatusTrueAndIsDeletedFalse();
        return list.stream()
                .sorted(Comparator.comparing(Product::getCreatedAt).reversed())
                .limit(limitOrDefault(limit))
                .map(this::toCard)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductCardResponse> getFeaturedProducts(Integer limit) {
        List<Product> list = productRepository.findByStatusTrueAndIsDeletedFalse();
        return list.stream()
                .limit(limitOrDefault(limit))
                .map(this::toCard)
                .collect(Collectors.toList());
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
        Page<ProductCardResponse> page = productRepository.findByCategoryIdOptimized(categoryId, buildPageable(request.getPage(), request.getSize(), request.getSortBy(), request.getSortDirection()))
                .map(this::toCard);
        return page.getContent().stream().limit(limitOrDefault(limit)).collect(Collectors.toList());
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
        return page.map(this::toCard);
    }

    @Override
    public Page<ProductCardResponse> getAllProducts(ProductSearchFilterRequest request) {
        Pageable pageable = buildPageable(request.getPage(), request.getSize(), request.getSortBy(), request.getSortDirection());
        return productRepository.findByIsDeletedFalse(pageable).map(this::toCard);
    }

    @Override
    public ProductDetailViewResponse getProductDetailWithSoldCount(Long productId) {
        return getProductDetailById(productId);
    }

    @Override
    public Page<ProductCardResponse> getFeaturedProductsPaginated(ProductSearchFilterRequest request) {
        return getFeaturedProductsPage(request);
    }

    @Override
    public Page<ProductCardResponse> getNewArrivalsPaginated(ProductSearchFilterRequest request) {
        return getFeaturedProductsPage(request);
    }

    @Override
    public Page<ProductCardResponse> getBestSellingProductsPaginated(ProductSearchFilterRequest request) {
        return getFeaturedProductsPage(request);
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
                .collect(Collectors.toList());
        return createPageFromList(discounted, pageable, discounted.size());
    }

    @Override
    public Page<ProductCardResponse> getRelatedProductsPaginated(Long productId, ProductSearchFilterRequest request) {
        Pageable pageable = buildPageable(request.getPage(), request.getSize(), request.getSortBy(), request.getSortDirection());
        Product product = productRepository.findByIdAndIsDeletedFalse(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        Page<Product> page = productRepository.findByCategoryIdAndIsDeletedFalse(product.getCategory().getId(), pageable);
        return page.map(this::toCard);
    }

    @Override
    public List<ProductCardResponse> getProductsByCategoryList(Long categoryId, Integer limit) {
        List<Product> list = productRepository.findByCategoryIdAndIsDeletedFalse(categoryId);
        return list.stream().limit(limitOrDefault(limit)).map(this::toCard).collect(Collectors.toList());
    }

    @Override
    public Page<ProductCardResponse> getProductsByCategoryPaginated(Long categoryId, ProductSearchFilterRequest request) {
        Pageable pageable = buildPageable(request.getPage(), request.getSize(), request.getSortBy(), request.getSortDirection());
        return productRepository.findByCategoryIdAndIsDeletedFalse(categoryId, pageable).map(this::toCard);
    }

    @Override
    public List<ProductCardResponse> getProductsOnSale(Integer limit) {
        int take = limitOrDefault(limit);
        return productRepository.findByStatusTrueAndIsDeletedFalse().stream()
                .map(this::toCard)
                .filter(ProductCardResponse::getHasDiscount)
                .limit(take)
                .collect(Collectors.toList());
    }

    private Pageable buildPageable(Integer page, Integer size, String sortBy, String sortDirection) {
        int p = page != null && page >= 0 ? page : 0;
        int s = size != null && size > 0 ? size : 20;
        String sortField = (sortBy == null || sortBy.isBlank()) ? "createdAt" : sortBy;
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(p, s, Sort.by(direction, sortField));
    }

    private Page<ProductCardResponse> filterWithPredicate(ProductSearchFilterRequest request, java.util.function.Predicate<Product> predicate) {
        Pageable pageable = buildPageable(request.getPage(), request.getSize(), request.getSortBy(), request.getSortDirection());
        Page<Product> page = productRepository.findByStatusTrueAndIsDeletedFalse(pageable);
        List<Product> filtered = page.getContent().stream().filter(predicate).collect(Collectors.toList());
        return createPageFromList(filtered, pageable, filtered.size());
    }

    private Page<ProductCardResponse> getFeaturedProductsPage(ProductSearchFilterRequest request) {
        Pageable pageable = buildPageable(request.getPage(), request.getSize(), request.getSortBy(), request.getSortDirection());
        return productRepository.findByStatusTrueAndIsDeletedFalse(pageable)
                .map(this::toCard);
    }

    private Page<ProductCardResponse> createPageFromList(List<Product> products, Pageable pageable, long total) {
        List<ProductCardResponse> content = products.stream().map(this::toCard).collect(Collectors.toList());
        return new PageImpl<>(content, pageable, total);
    }

    private ProductCardResponse toCard(Product product) {
        ProductTemplate template = displayTemplate(product);
        BigDecimal originalPrice = template != null ? template.getPrice() : null;
        DiscountResult discount = calculateDiscount(originalPrice);
        ProductMetadata metadata = product.getMetadata();
        return ProductCardResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .thumbnailUrl(product.getThumbnailUrl())
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .brandId(product.getBrand() != null ? product.getBrand().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .originalPrice(originalPrice)
                .discountedPrice(discount.discountedPrice)
                .hasDiscount(discount.hasDiscount)
                .discountPercentage(discount.discountPercentage)
                .savingAmount(discount.discountAmount)
                .averageRating(0.0)
                .totalReviews(0)
                .ratingDisplay("0.0 (0 reviews)")
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

    private ProductComparisonResponse.ComparisonProduct toComparisonProduct(Product product) {
        ProductTemplate template = displayTemplate(product);
        DiscountResult discount = calculateDiscount(template != null ? template.getPrice() : null);
        return ProductComparisonResponse.ComparisonProduct.builder()
                .id(product.getId())
                .name(product.getName())
                .thumbnailUrl(product.getThumbnailUrl())
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .originalPrice(template != null ? template.getPrice() : null)
                .discountedPrice(discount.discountedPrice)
                .hasDiscount(discount.hasDiscount)
                .averageRating(0.0)
                .totalReviews(0)
                .inStock(hasStock(product))
                .specs(ProductComparisonResponse.ComparisonSpecs.builder()
                        .screen(metadataValue(product, ProductMetadata::getScreenSize))
                        .os(metadataValue(product, ProductMetadata::getOperatingSystem))
                        .cpu(metadataValue(product, ProductMetadata::getCpuChipset))
                        .ram(template != null ? template.getRam() : null)
                        .internalMemory(template != null ? template.getStorage() : null)
                        .battery(metadataValue(product, ProductMetadata::getBatteryCapacity))
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
}
