package com.utephonehub.backend.controller;

import com.utephonehub.backend.dto.ApiResponse;
import com.utephonehub.backend.dto.request.productview.ProductSearchFilterRequest;
import com.utephonehub.backend.dto.response.productview.*;
import com.utephonehub.backend.service.IProductViewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller cho ProductView API
 * API dành cho client-side: hiển thị, tìm kiếm, lọc, so sánh sản phẩm
 * Không yêu cầu authentication (public access)
 */
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "ProductView API", description = "API dùng để hiển thị sản phẩm client và tương tác - Tham quan, tìm kiếm, lọc, sắp xếp, so sánh sản phẩm")
public class ProductViewController {

private final IProductViewService productViewService;

/**
 * Tìm kiếm và lọc sản phẩm với nhiều tiêu chí
 */
@GetMapping("/search")
@Operation(
        summary = "Tìm kiếm và lọc sản phẩm",
        description = "API cho phép người dùng tìm kiếm sản phẩm theo từ khóa, lọc theo danh mục, thương hiệu, giá, đánh giá và sắp xếp theo nhiều tiêu chí"
)
@ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Tìm kiếm thành công",
                content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "400",
                description = "Tham số không hợp lệ"
        )
})
public ResponseEntity<ApiResponse<Page<ProductViewResponse>>> searchProducts(
        @Parameter(description = "Từ khóa tìm kiếm") @RequestParam(required = false) String keyword,
        @Parameter(description = "ID danh mục") @RequestParam(required = false) Long categoryId,
        @Parameter(description = "Danh sách ID thương hiệu") @RequestParam(required = false) List<Long> brandIds,
        @Parameter(description = "Giá tối thiểu") @RequestParam(required = false) java.math.BigDecimal minPrice,
        @Parameter(description = "Giá tối đa") @RequestParam(required = false) java.math.BigDecimal maxPrice,
        @Parameter(description = "Đánh giá tối thiểu (1-5)") @RequestParam(required = false) Double minRating,
        @Parameter(description = "Chỉ sản phẩm còn hàng") @RequestParam(required = false, defaultValue = "false") Boolean inStockOnly,
        @Parameter(description = "Chỉ sản phẩm khuyến mãi") @RequestParam(required = false, defaultValue = "false") Boolean onSaleOnly,
        @Parameter(description = "Sắp xếp theo (name, price, rating, created_date)") @RequestParam(required = false, defaultValue = "created_date") String sortBy,
        @Parameter(description = "Hướng sắp xếp (asc, desc)") @RequestParam(required = false, defaultValue = "desc") String sortDirection,
        @Parameter(description = "Số trang (bắt đầu từ 0)") @RequestParam(required = false, defaultValue = "0") Integer page,
        @Parameter(description = "Số sản phẩm mỗi trang") @RequestParam(required = false, defaultValue = "20") Integer size
) {
        log.info("Searching products with keyword: {}, category: {}, brands: {}", keyword, categoryId, brandIds);
        
        ProductSearchFilterRequest request = ProductSearchFilterRequest.builder()
                .keyword(keyword)
                .categoryId(categoryId)
                .brandIds(brandIds)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .minRating(minRating)
                .inStockOnly(inStockOnly)
                .onSaleOnly(onSaleOnly)
                .sortBy(sortBy)
                .sortDirection(sortDirection)
                .page(page)
                .size(size)
                .build();
        
        Page<ProductViewResponse> result = productViewService.searchAndFilterProducts(request);
        
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm sản phẩm thành công", result));

}

/**
 * Lấy chi tiết sản phẩm theo ID
 */
@GetMapping("/{id}")
@Operation(
        summary = "Xem chi tiết sản phẩm",
        description = "Lấy thông tin chi tiết của một sản phẩm bao gồm thông số kỹ thuật, các phiên bản, hình ảnh"
)
@ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Lấy chi tiết thành công",
                content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "404",
                description = "Không tìm thấy sản phẩm"
        )
})
public ResponseEntity<ApiResponse<ProductDetailViewResponse>> getProductDetail(
        @Parameter(description = "ID sản phẩm", required = true) @PathVariable Long id
) {
        log.info("Getting product detail for ID: {}", id);
        
        ProductDetailViewResponse result = productViewService.getProductDetailById(id);
        
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết sản phẩm thành công", result));
}

/**
 * Lấy danh sách sản phẩm theo danh mục
 */
@GetMapping("/category/{categoryId}")
@Operation(
        summary = "Xem sản phẩm theo danh mục",
        description = "Lấy danh sách sản phẩm thuộc một danh mục cụ thể, bao gồm thông tin danh mục con và bộ lọc"
)
@ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Lấy danh sách thành công",
                content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "404",
                description = "Không tìm thấy danh mục"
        )
})
public ResponseEntity<ApiResponse<CategoryProductsResponse>> getProductsByCategory(
        @Parameter(description = "ID danh mục", required = true) @PathVariable Long categoryId,
        @Parameter(description = "Giá tối thiểu") @RequestParam(required = false) java.math.BigDecimal minPrice,
        @Parameter(description = "Giá tối đa") @RequestParam(required = false) java.math.BigDecimal maxPrice,
        @Parameter(description = "Sắp xếp theo") @RequestParam(required = false, defaultValue = "created_date") String sortBy,
        @Parameter(description = "Hướng sắp xếp") @RequestParam(required = false, defaultValue = "desc") String sortDirection,
        @Parameter(description = "Số trang") @RequestParam(required = false, defaultValue = "0") Integer page,
        @Parameter(description = "Số sản phẩm mỗi trang") @RequestParam(required = false, defaultValue = "20") Integer size
) {
        log.info("Getting products for category ID: {}", categoryId);
        
        ProductSearchFilterRequest request = ProductSearchFilterRequest.builder()
                .categoryId(categoryId)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .sortBy(sortBy)
                .sortDirection(sortDirection)
                .page(page)
                .size(size)
                .build();
        
        CategoryProductsResponse result = productViewService.getProductsByCategory(categoryId, request);
        
        return ResponseEntity.ok(ApiResponse.success("Lấy sản phẩm theo danh mục thành công", result));
}

/**
 * So sánh nhiều sản phẩm (tối đa 4)
 */
@PostMapping("/compare")
@Operation(
        summary = "So sánh sản phẩm",
        description = "So sánh thông số kỹ thuật và giá của nhiều sản phẩm (tối đa 4 sản phẩm)"
)
@ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "So sánh thành công",
                content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "400",
                description = "Số lượng sản phẩm không hợp lệ (tối đa 4)"
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "404",
                description = "Không tìm thấy một số sản phẩm"
        )
})
public ResponseEntity<ApiResponse<ProductComparisonResponse>> compareProducts(
        @Parameter(description = "Danh sách ID sản phẩm cần so sánh (tối đa 4)", required = true)
        @RequestBody List<Long> productIds
) {
        log.info("Comparing products: {}", productIds);
        
        ProductComparisonResponse result = productViewService.compareProducts(productIds);
        
        return ResponseEntity.ok(ApiResponse.success("So sánh sản phẩm thành công", result));
}

/**
 * Lấy sản phẩm liên quan
 * Hỗ trợ cả query all (limit=null) hoặc query với limit cụ thể
 */
@GetMapping("/{id}/related")
@Operation(
        summary = "Xem sản phẩm liên quan",
        description = "Lấy danh sách sản phẩm liên quan (cùng danh mục hoặc thương hiệu). Nếu không chỉ định limit thì lấy tất cả, nếu chỉ định limit thì giới hạn số lượng"
)
@ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Lấy danh sách thành công",
                content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "404",
                description = "Không tìm thấy sản phẩm"
        )
})
public ResponseEntity<ApiResponse<List<ProductViewResponse>>> getRelatedProducts(
        @Parameter(description = "ID sản phẩm", required = true) @PathVariable Long id,
        @Parameter(description = "Số lượng sản phẩm liên quan (nếu không chỉ định thì lấy tất cả)") @RequestParam(required = false) Integer limit
) {
        log.info("Getting related products for ID: {} with limit: {}", id, limit);
        
        List<ProductViewResponse> result = productViewService.getRelatedProducts(id, limit != null ? limit : Integer.MAX_VALUE);

        return ResponseEntity.ok(ApiResponse.success("Lấy sản phẩm liên quan thành công", result));
}

/**
 * Lấy sản phẩm bán chạy
 * Hỗ trợ cả query all (limit=null) hoặc query với limit cụ thể
 */
@GetMapping("/best-selling")
@Operation(
        summary = "Xem sản phẩm bán chạy",
        description = "Lấy danh sách sản phẩm bán chạy nhất. Nếu không chỉ định limit thì lấy tất cả, nếu chỉ định limit thì giới hạn số lượng"
)
@ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Lấy danh sách thành công",
                content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
})
public ResponseEntity<ApiResponse<List<ProductViewResponse>>> getBestSellingProducts(
        @Parameter(description = "Số lượng sản phẩm (nếu không chỉ định thì lấy tất cả)") @RequestParam(required = false) Integer limit
) {
        log.info("Getting best selling products with limit: {}", limit);
        
        List<ProductViewResponse> result = productViewService.getBestSellingProducts(limit != null ? limit : Integer.MAX_VALUE);
        
        return ResponseEntity.ok(ApiResponse.success("Lấy sản phẩm bán chạy thành công", result));
}

/**
 * Lấy sản phẩm mới nhất
 * Hỗ trợ cả query all (limit=null) hoặc query với limit cụ thể
 */
@GetMapping("/new-arrivals")
@Operation(
        summary = "Xem sản phẩm mới nhất",
        description = "Lấy danh sách sản phẩm mới ra mắt. Nếu không chỉ định limit thì lấy tất cả, nếu chỉ định limit thì giới hạn số lượng"
)
@ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Lấy danh sách thành công",
                content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
})
public ResponseEntity<ApiResponse<List<ProductViewResponse>>> getNewArrivals(
        @Parameter(description = "Số lượng sản phẩm (nếu không chỉ định thì lấy tất cả)") @RequestParam(required = false) Integer limit
) {
        log.info("Getting new arrivals with limit: {}", limit);
        
        List<ProductViewResponse> result = productViewService.getNewArrivals(limit != null ? limit : Integer.MAX_VALUE);
        
        return ResponseEntity.ok(ApiResponse.success("Lấy sản phẩm mới nhất thành công", result));
}

/**
 * Lấy sản phẩm nổi bật
/**
 * Lọc sản phẩm theo RAM
 * Hỗ trợ cả limit (query all/limit) hoặc pagination
 */
@GetMapping("/filter/ram")
@Operation(
        summary = "Lọc sản phẩm theo RAM",
        description = "Lọc sản phẩm theo cấu hình RAM. Sử dụng limit để lấy N sản phẩm đầu tiên, hoặc dùng page/size để phân trang"
)
public ResponseEntity<ApiResponse<?>> filterByRam(
        @Parameter(description = "Danh sách RAM cần lọc") @RequestParam List<String> ramOptions,
        @Parameter(description = "Số lượng giới hạn sản phẩm (không pagination)") @RequestParam(required = false) Integer limit,
        @Parameter(description = "Số trang (bắt đầu từ 0)") @RequestParam(required = false, defaultValue = "0") Integer page,
        @Parameter(description = "Số sản phẩm mỗi trang") @RequestParam(required = false, defaultValue = "20") Integer size
) {
        log.info("Filtering products by RAM: {} - limit: {}, page: {}, size: {}", ramOptions, limit, page, size);
        
        ProductSearchFilterRequest request = ProductSearchFilterRequest.builder()
                .page(page)
                .size(size)
                .build();
        
        if (limit != null && limit > 0) {
                // Query với limit (lấy N sản phẩm đầu tiên)
                List<ProductViewResponse> result = productViewService.filterByRamWithLimit(ramOptions, request, limit);
                return ResponseEntity.ok(ApiResponse.success("Lọc sản phẩm theo RAM thành công", result));
        } else {
                // Query với pagination
                Page<ProductViewResponse> result = productViewService.filterByRam(ramOptions, request);
                return ResponseEntity.ok(ApiResponse.success("Lọc sản phẩm theo RAM thành công", result));
        }
}

/**
 * Lọc sản phẩm theo dung lượng lưu trữ
 * Hỗ trợ cả limit (query all/limit) hoặc pagination
 */
@GetMapping("/filter/storage")
@Operation(
        summary = "Lọc sản phẩm theo lưu trữ",
        description = "Lọc sản phẩm theo dung lượng lưu trữ (GB). Sử dụng limit để lấy N sản phẩm đầu tiên, hoặc dùng page/size để phân trang"
)
public ResponseEntity<ApiResponse<?>> filterByStorage(
        @Parameter(description = "Danh sách dung lượng lưu trữ cần lọc") @RequestParam List<String> storageOptions,
        @Parameter(description = "Số lượng giới hạn sản phẩm (không pagination)") @RequestParam(required = false) Integer limit,
        @Parameter(description = "Số trang (bắt đầu từ 0)") @RequestParam(required = false, defaultValue = "0") Integer page,
        @Parameter(description = "Số sản phẩm mỗi trang") @RequestParam(required = false, defaultValue = "20") Integer size
) {
        log.info("Filtering products by Storage: {} - limit: {}, page: {}, size: {}", storageOptions, limit, page, size);
        
        ProductSearchFilterRequest request = ProductSearchFilterRequest.builder()
                .page(page)
                .size(size)
                .build();
        
        if (limit != null && limit > 0) {
                List<ProductViewResponse> result = productViewService.filterByStorageWithLimit(storageOptions, request, limit);
                return ResponseEntity.ok(ApiResponse.success("Lọc sản phẩm theo lưu trữ thành công", result));
        } else {
                Page<ProductViewResponse> result = productViewService.filterByStorage(storageOptions, request);
                return ResponseEntity.ok(ApiResponse.success("Lọc sản phẩm theo lưu trữ thành công", result));
        }
}

/**
 * Lọc sản phẩm theo dung lượng pin
 * Hỗ trợ cả limit (query all/limit) hoặc pagination
 */
@GetMapping("/filter/battery")
@Operation(
        summary = "Lọc sản phẩm theo pin",
        description = "Lọc sản phẩm theo dung lượng pin (mAh). Sử dụng limit để lấy N sản phẩm đầu tiên, hoặc dùng page/size để phân trang"
)
public ResponseEntity<ApiResponse<?>> filterByBattery(
        @Parameter(description = "Dung lượng pin tối thiểu") @RequestParam(required = false) Integer minBattery,
        @Parameter(description = "Dung lượng pin tối đa") @RequestParam(required = false) Integer maxBattery,
        @Parameter(description = "Số lượng giới hạn sản phẩm (không pagination)") @RequestParam(required = false) Integer limit,
        @Parameter(description = "Số trang (bắt đầu từ 0)") @RequestParam(required = false, defaultValue = "0") Integer page,
        @Parameter(description = "Số sản phẩm mỗi trang") @RequestParam(required = false, defaultValue = "20") Integer size
) {
        log.info("Filtering products by Battery: {} - {} - limit: {}", minBattery, maxBattery, limit);
        
        ProductSearchFilterRequest request = ProductSearchFilterRequest.builder()
                .page(page)
                .size(size)
                .build();
        
        if (limit != null && limit > 0) {
                List<ProductViewResponse> result = productViewService.filterByBatteryWithLimit(minBattery, maxBattery, request, limit);
                return ResponseEntity.ok(ApiResponse.success("Lọc sản phẩm theo pin thành công", result));
        } else {
                Page<ProductViewResponse> result = productViewService.filterByBattery(minBattery, maxBattery, request);
                return ResponseEntity.ok(ApiResponse.success("Lọc sản phẩm theo pin thành công", result));
        }
}

/**
 * Lọc sản phẩm theo kích thước màn hình
 * Hỗ trợ cả limit (query all/limit) hoặc pagination
 */
@GetMapping("/filter/screen")
@Operation(
        summary = "Lọc sản phẩm theo kích thước màn hình",
        description = "Lọc sản phẩm theo kích thước màn hình (inch). Sử dụng limit để lấy N sản phẩm đầu tiên, hoặc dùng page/size để phân trang"
)
public ResponseEntity<ApiResponse<?>> filterByScreenSize(
        @Parameter(description = "Danh sách kích thước màn hình cần lọc") @RequestParam List<String> screenSizeOptions,
        @Parameter(description = "Số lượng giới hạn sản phẩm (không pagination)") @RequestParam(required = false) Integer limit,
        @Parameter(description = "Số trang (bắt đầu từ 0)") @RequestParam(required = false, defaultValue = "0") Integer page,
        @Parameter(description = "Số sản phẩm mỗi trang") @RequestParam(required = false, defaultValue = "20") Integer size
) {
        log.info("Filtering products by Screen Size: {} - limit: {}", screenSizeOptions, limit);
        
        ProductSearchFilterRequest request = ProductSearchFilterRequest.builder()
                .page(page)
                .size(size)
                .build();
        
        if (limit != null && limit > 0) {
                List<ProductViewResponse> result = productViewService.filterByScreenSizeWithLimit(screenSizeOptions, request, limit);
                return ResponseEntity.ok(ApiResponse.success("Lọc sản phẩm theo màn hình thành công", result));
        } else {
                Page<ProductViewResponse> result = productViewService.filterByScreenSize(screenSizeOptions, request);
                return ResponseEntity.ok(ApiResponse.success("Lọc sản phẩm theo màn hình thành công", result));
        }
}

/**
 * Lọc sản phẩm theo hệ điều hành
 * Hỗ trợ cả limit (query all/limit) hoặc pagination
 */
@GetMapping("/filter/os")
@Operation(
        summary = "Lọc sản phẩm theo hệ điều hành",
        description = "Lọc sản phẩm theo hệ điều hành (iOS, Android, v.v.). Sử dụng limit để lấy N sản phẩm đầu tiên, hoặc dùng page/size để phân trang"
)
public ResponseEntity<ApiResponse<?>> filterByOS(
        @Parameter(description = "Danh sách hệ điều hành cần lọc") @RequestParam List<String> osOptions,
        @Parameter(description = "Số lượng giới hạn sản phẩm (không pagination)") @RequestParam(required = false) Integer limit,
        @Parameter(description = "Số trang (bắt đầu từ 0)") @RequestParam(required = false, defaultValue = "0") Integer page,
        @Parameter(description = "Số sản phẩm mỗi trang") @RequestParam(required = false, defaultValue = "20") Integer size
) {
        log.info("Filtering products by OS: {} - limit: {}", osOptions, limit);
        
        ProductSearchFilterRequest request = ProductSearchFilterRequest.builder()
                .page(page)
                .size(size)
                .build();
        
        if (limit != null && limit > 0) {
                List<ProductViewResponse> result = productViewService.filterByOSWithLimit(osOptions, request, limit);
                return ResponseEntity.ok(ApiResponse.success("Lọc sản phẩm theo hệ điều hành thành công", result));
        } else {
                Page<ProductViewResponse> result = productViewService.filterByOS(osOptions, request);
                return ResponseEntity.ok(ApiResponse.success("Lọc sản phẩm theo hệ điều hành thành công", result));
        }
}

/**
 * Lọc sản phẩm theo đánh giá sao
 * Hỗ trợ cả limit (query all/limit) hoặc pagination
 */
@GetMapping("/filter/rating")
@Operation(
        summary = "Lọc sản phẩm theo đánh giá",
        description = "Lọc sản phẩm theo đánh giá sao (1-5). Sử dụng limit để lấy N sản phẩm đầu tiên, hoặc dùng page/size để phân trang"
)
public ResponseEntity<ApiResponse<?>> filterByRating(
        @Parameter(description = "Đánh giá tối thiểu") @RequestParam(required = false) Double minRating,
        @Parameter(description = "Đánh giá tối đa") @RequestParam(required = false) Double maxRating,
        @Parameter(description = "Số lượng giới hạn sản phẩm (không pagination)") @RequestParam(required = false) Integer limit,
        @Parameter(description = "Số trang (bắt đầu từ 0)") @RequestParam(required = false, defaultValue = "0") Integer page,
        @Parameter(description = "Số sản phẩm mỗi trang") @RequestParam(required = false, defaultValue = "20") Integer size
) {
        log.info("Filtering products by Rating: {} - {} - limit: {}", minRating, maxRating, limit);
        
        ProductSearchFilterRequest request = ProductSearchFilterRequest.builder()
                .page(page)
                .size(size)
                .build();
        
        if (limit != null && limit > 0) {
                List<ProductViewResponse> result = productViewService.filterByRatingWithLimit(minRating, maxRating, request, limit);
                return ResponseEntity.ok(ApiResponse.success("Lọc sản phẩm theo đánh giá thành công", result));
        } else {
                Page<ProductViewResponse> result = productViewService.filterByRating(minRating, maxRating, request);
                return ResponseEntity.ok(ApiResponse.success("Lọc sản phẩm theo đánh giá thành công", result));
        }
}

// ==================== NEW ENHANCED ENDPOINTS ====================

/**
 * Lấy danh sách sản phẩm nổi bật theo nhiều tiêu chí
 * Tiêu chí: Giá >= 5tr, Hàng mới (60 ngày), Rating >= 4.8, Review >= 10, Có giảm giá
 */
@GetMapping("/featured")
@Operation(
        summary = "Lấy sản phẩm nổi bật",
        description = "Lấy danh sách sản phẩm nổi bật theo nhiều tiêu chí: Giá từ 5 triệu, Hàng mới trong 60 ngày, Đánh giá >= 4.8, Số đánh giá >= 10, Có giảm giá"
)
@ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Lấy sản phẩm nổi bật thành công",
                content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
})
public ResponseEntity<ApiResponse<List<ProductViewResponse>>> getFeaturedProducts(
        @Parameter(description = "Số lượng sản phẩm (mặc định 10)") @RequestParam(required = false, defaultValue = "10") Integer limit
) {
        log.info("Getting featured products with limit: {}", limit);
        
        List<ProductViewResponse> result = productViewService.getFeaturedProductsByCriteria(limit);
        
        return ResponseEntity.ok(ApiResponse.success("Lấy sản phẩm nổi bật thành công", result));
}

/**
 * Lọc sản phẩm theo số lượng đã bán
 */
@GetMapping("/filter/sold-count")
@Operation(
        summary = "Lọc sản phẩm theo số lượng đã bán",
        description = "Lọc sản phẩm có số lượng đã bán tối thiểu. Ví dụ: minSoldCount=100 để lấy sản phẩm bán được trên 100 cái"
)
@ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Lọc thành công",
                content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
})
public ResponseEntity<ApiResponse<Page<ProductViewResponse>>> filterBySoldCount(
        @Parameter(description = "Số lượng đã bán tối thiểu") @RequestParam(required = false, defaultValue = "0") Integer minSoldCount,
        @Parameter(description = "Số trang (bắt đầu từ 0)") @RequestParam(required = false, defaultValue = "0") Integer page,
        @Parameter(description = "Số sản phẩm mỗi trang") @RequestParam(required = false, defaultValue = "20") Integer size,
        @Parameter(description = "Sắp xếp theo") @RequestParam(required = false, defaultValue = "created_date") String sortBy,
        @Parameter(description = "Hướng sắp xếp") @RequestParam(required = false, defaultValue = "desc") String sortDirection
) {
        log.info("Filtering products by sold count: {}", minSoldCount);
        
        ProductSearchFilterRequest request = ProductSearchFilterRequest.builder()
                .minSoldCount(minSoldCount)
                .page(page)
                .size(size)
                .sortBy(sortBy)
                .sortDirection(sortDirection)
                .build();
        
        Page<ProductViewResponse> result = productViewService.filterBySoldCount(minSoldCount, request);
        
        return ResponseEntity.ok(ApiResponse.success("Lọc sản phẩm theo số lượng bán thành công", result));
}

/**
 * Lấy tất cả sản phẩm (bao gồm cả hết hàng)
 */
@GetMapping("/all")
@Operation(
        summary = "Lấy tất cả sản phẩm",
        description = "Lấy danh sách tất cả sản phẩm đang hoạt động, bao gồm cả sản phẩm còn hàng và hết hàng"
)
@ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Lấy danh sách thành công",
                content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
})
public ResponseEntity<ApiResponse<Page<ProductViewResponse>>> getAllProducts(
        @Parameter(description = "Số trang (bắt đầu từ 0)") @RequestParam(required = false, defaultValue = "0") Integer page,
        @Parameter(description = "Số sản phẩm mỗi trang") @RequestParam(required = false, defaultValue = "20") Integer size,
        @Parameter(description = "Sắp xếp theo") @RequestParam(required = false, defaultValue = "created_date") String sortBy,
        @Parameter(description = "Hướng sắp xếp") @RequestParam(required = false, defaultValue = "desc") String sortDirection
) {
        log.info("Getting all products - page: {}, size: {}", page, size);
        
        ProductSearchFilterRequest request = ProductSearchFilterRequest.builder()
                .page(page)
                .size(size)
                .sortBy(sortBy)
                .sortDirection(sortDirection)
                .build();
        
        Page<ProductViewResponse> result = productViewService.getAllProducts(request);
        
        return ResponseEntity.ok(ApiResponse.success("Lấy tất cả sản phẩm thành công", result));
}

/**
 * Xem chi tiết sản phẩm kèm số lượng đã bán
 */
@GetMapping("/{id}/detail-with-sold")
@Operation(
        summary = "Xem chi tiết sản phẩm kèm số lượng đã bán",
        description = "Lấy thông tin chi tiết của một sản phẩm bao gồm thông số kỹ thuật, các phiên bản, hình ảnh và số lượng đã bán"
)
@ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Lấy chi tiết thành công",
                content = @Content(schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "404",
                description = "Không tìm thấy sản phẩm"
        )
})
public ResponseEntity<ApiResponse<ProductDetailViewResponse>> getProductDetailWithSoldCount(
        @Parameter(description = "ID sản phẩm", required = true) @PathVariable Long id
) {
        log.info("Getting product detail with sold count for ID: {}", id);
        
        ProductDetailViewResponse result = productViewService.getProductDetailWithSoldCount(id);
        
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết sản phẩm thành công", result));
}
}
