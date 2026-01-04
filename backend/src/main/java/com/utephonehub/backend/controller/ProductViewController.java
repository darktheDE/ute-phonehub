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
 * 
 * @author UTE Phone Hub Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "ProductView API", description = "API dùng để hiển thị sản phẩm client và tương tác - Tham quan, tìm kiếm, lọc, sắp xếp, so sánh sản phẩm")
public class ProductViewController {

    private final IProductViewService productViewService;

    // ========== SEARCH & FILTER ENDPOINTS ==========

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

    // ========== CATEGORY & RELATED ENDPOINTS ==========

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

    // ========== COMPARISON & RECOMMENDATIONS ==========

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
 */
@GetMapping("/{id}/related")
@Operation(
        summary = "Xem sản phẩm liên quan",
        description = "Lấy danh sách sản phẩm liên quan (cùng danh mục hoặc thương hiệu)"
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
        @Parameter(description = "Số lượng sản phẩm liên quan") @RequestParam(required = false, defaultValue = "8") Integer limit
) {
        log.info("Getting related products for ID: {} with limit: {}", id, limit);
        
        List<ProductViewResponse> result = productViewService.getRelatedProducts(id, limit);

        return ResponseEntity.ok(ApiResponse.success("Lấy sản phẩm liên quan thành công", result));
    // ========== FEATURED PRODUCTS ENDPOINTS ==========

}

/**
 * Lấy sản phẩm bán chạy
 */
@GetMapping("/best-selling")
@Operation(
        summary = "Xem sản phẩm bán chạy",
        description = "Lấy danh sách sản phẩm bán chạy nhất"
)
@ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Lấy danh sách thành công",
                content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
})
public ResponseEntity<ApiResponse<List<ProductViewResponse>>> getBestSellingProducts(
        @Parameter(description = "Số lượng sản phẩm") @RequestParam(required = false, defaultValue = "10") Integer limit
) {
        log.info("Getting best selling products with limit: {}", limit);
        
        List<ProductViewResponse> result = productViewService.getBestSellingProducts(limit);
        
        return ResponseEntity.ok(ApiResponse.success("Lấy sản phẩm bán chạy thành công", result));
}

/**
 * Lấy sản phẩm mới nhất
 */
@GetMapping("/new-arrivals")
@Operation(
        summary = "Xem sản phẩm mới nhất",
        description = "Lấy danh sách sản phẩm mới ra mắt"
)
@ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Lấy danh sách thành công",
                content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
})
public ResponseEntity<ApiResponse<List<ProductViewResponse>>> getNewArrivals(
        @Parameter(description = "Số lượng sản phẩm") @RequestParam(required = false, defaultValue = "10") Integer limit
) {
        log.info("Getting new arrivals with limit: {}", limit);
        
        List<ProductViewResponse> result = productViewService.getNewArrivals(limit);
        
        return ResponseEntity.ok(ApiResponse.success("Lấy sản phẩm mới nhất thành công", result));
}

/**
 * Lấy sản phẩm nổi bật
 */
@GetMapping("/featured")
@Operation(
        summary = "Xem sản phẩm nổi bật",
        description = "Lấy danh sách sản phẩm được đánh dấu nổi bật hoặc đang khuyến mãi"
)
@ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Lấy danh sách thành công",
                content = @Content(schema = @Schema(implementation = ApiResponse.class))
        )
})
public ResponseEntity<ApiResponse<List<ProductViewResponse>>> getFeaturedProducts(
        @Parameter(description = "Số lượng sản phẩm") @RequestParam(required = false, defaultValue = "10") Integer limit
) {
        log.info("Getting featured products with limit: {}", limit);
        
        List<ProductViewResponse> result = productViewService.getFeaturedProducts(limit);
        
        return ResponseEntity.ok(ApiResponse.success("Lấy sản phẩm nổi bật thành công", result));
}
}
