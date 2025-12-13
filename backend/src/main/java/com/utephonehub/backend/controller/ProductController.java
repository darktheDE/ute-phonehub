package com.utephonehub.backend.controller;

import com.utephonehub.backend.dto.ApiResponse;
import com.utephonehub.backend.dto.request.product.CreateProductRequest;
import com.utephonehub.backend.dto.request.product.ProductFilterRequest;
import com.utephonehub.backend.dto.request.product.UpdateProductRequest;
import com.utephonehub.backend.dto.request.product.UpdateStockRequest;
import com.utephonehub.backend.dto.response.product.ProductDetailResponse;
import com.utephonehub.backend.dto.response.product.ProductListResponse;
import com.utephonehub.backend.dto.response.product.ProductResponse;
import com.utephonehub.backend.service.IProductService;
import com.utephonehub.backend.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Product Management
 * Handles CRUD operations, search, filtering, and stock management for products
 */
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Product Management", description = "API quản lý sản phẩm - CRUD, tìm kiếm, lọc và quản lý tồn kho")
public class ProductController {

    private final IProductService productService;
    private final SecurityUtils securityUtils;

    /**
     * PUBLIC ENDPOINTS - No authentication required
     */

    @GetMapping
    @Operation(
            summary = "Lấy danh sách sản phẩm",
            description = "Lấy danh sách tất cả sản phẩm đang hoạt động với phân trang và sắp xếp"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Lấy danh sách thành công"
            )
    })
    public ResponseEntity<ApiResponse<Page<ProductListResponse>>> getAllProducts(
            @Parameter(description = "Số trang (bắt đầu từ 0)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Số lượng sản phẩm mỗi trang")
            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sắp xếp theo trường (mặc định: createdAt)")
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Hướng sắp xếp (asc/desc)")
            @RequestParam(defaultValue = "desc") String direction
    ) {
        log.info("GET /api/v1/products - page: {}, size: {}", page, size);
        
        Sort sort = direction.equalsIgnoreCase("asc") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ProductListResponse> products = productService.getAllActiveProducts(pageable);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sản phẩm thành công", products));
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Lấy chi tiết sản phẩm",
            description = "Lấy thông tin chi tiết của một sản phẩm theo ID"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Lấy thông tin thành công"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Không tìm thấy sản phẩm"
            )
    })
    public ResponseEntity<ApiResponse<ProductDetailResponse>> getProductById(
            @Parameter(description = "ID của sản phẩm") @PathVariable Long id
    ) {
        log.info("GET /api/v1/products/{}", id);
        ProductDetailResponse product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin sản phẩm thành công", product));
    }

    @GetMapping("/search")
    @Operation(
            summary = "Tìm kiếm sản phẩm",
            description = "Tìm kiếm sản phẩm theo từ khóa trong tên hoặc mô tả"
    )
    public ResponseEntity<ApiResponse<Page<ProductListResponse>>> searchProducts(
            @Parameter(description = "Từ khóa tìm kiếm")
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        log.info("GET /api/v1/products/search - keyword: {}", keyword);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ProductListResponse> products = productService.searchProducts(keyword, pageable);
        
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm thành công", products));
    }

    @PostMapping("/filter")
    @Operation(
            summary = "Lọc sản phẩm",
            description = "Lọc sản phẩm theo danh mục, thương hiệu, khoảng giá"
    )
    public ResponseEntity<ApiResponse<Page<ProductListResponse>>> filterProducts(
            @RequestBody ProductFilterRequest filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        log.info("POST /api/v1/products/filter - filter: {}", filter);
        
        Sort sort = direction.equalsIgnoreCase("asc") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ProductListResponse> products = productService.filterProducts(filter, pageable);
        return ResponseEntity.ok(ApiResponse.success("Lọc sản phẩm thành công", products));
    }

    @GetMapping("/category/{categoryId}")
    @Operation(
            summary = "Lấy sản phẩm theo danh mục",
            description = "Lấy danh sách sản phẩm thuộc một danh mục cụ thể"
    )
    public ResponseEntity<ApiResponse<Page<ProductListResponse>>> getProductsByCategory(
            @Parameter(description = "ID của danh mục") @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        log.info("GET /api/v1/products/category/{}", categoryId);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ProductListResponse> products = productService.getProductsByCategory(categoryId, pageable);
        
        return ResponseEntity.ok(ApiResponse.success("Lấy sản phẩm theo danh mục thành công", products));
    }

    @GetMapping("/brand/{brandId}")
    @Operation(
            summary = "Lấy sản phẩm theo thương hiệu",
            description = "Lấy danh sách sản phẩm thuộc một thương hiệu cụ thể"
    )
    public ResponseEntity<ApiResponse<Page<ProductListResponse>>> getProductsByBrand(
            @Parameter(description = "ID của thương hiệu") @PathVariable Long brandId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        log.info("GET /api/v1/products/brand/{}", brandId);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ProductListResponse> products = productService.getProductsByBrand(brandId, pageable);
        
        return ResponseEntity.ok(ApiResponse.success("Lấy sản phẩm theo thương hiệu thành công", products));
    }

    /**
     * ADMIN ENDPOINTS - Require ADMIN role
     */

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
            summary = "Tạo sản phẩm mới (Admin)",
            description = "Tạo một sản phẩm mới trong hệ thống"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "Tạo sản phẩm thành công"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Dữ liệu không hợp lệ"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Chưa xác thực"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Không có quyền truy cập"
            )
    })
    public ResponseEntity<ApiResponse<ProductDetailResponse>> createProduct(
            @Valid @RequestBody CreateProductRequest request,
            HttpServletRequest httpRequest
    ) {
        log.info("POST /api/v1/products - Creating product: {}", request.getName());
        
        Long userId = securityUtils.getCurrentUserId(httpRequest);
        ProductDetailResponse product = productService.createProduct(request, userId);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Tạo sản phẩm thành công", product));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
            summary = "Cập nhật sản phẩm (Admin)",
            description = "Cập nhật thông tin sản phẩm đã tồn tại"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Cập nhật thành công"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Không tìm thấy sản phẩm"
            )
    })
    public ResponseEntity<ApiResponse<ProductDetailResponse>> updateProduct(
            @Parameter(description = "ID của sản phẩm") @PathVariable Long id,
            @Valid @RequestBody UpdateProductRequest request,
            HttpServletRequest httpRequest
    ) {
        log.info("PUT /api/v1/products/{}", id);
        
        Long userId = securityUtils.getCurrentUserId(httpRequest);
        ProductDetailResponse product = productService.updateProduct(id, request, userId);
        
        return ResponseEntity.ok(ApiResponse.success("Cập nhật sản phẩm thành công", product));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
            summary = "Xóa sản phẩm (Admin - Soft Delete)",
            description = "Xóa mềm sản phẩm, có thể khôi phục sau này"
    )
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @Parameter(description = "ID của sản phẩm") @PathVariable Long id,
            HttpServletRequest httpRequest
    ) {
        log.info("DELETE /api/v1/products/{}", id);
        
        Long userId = securityUtils.getCurrentUserId(httpRequest);
        productService.deleteProduct(id, userId);
        
        return ResponseEntity.ok(ApiResponse.success("Xóa sản phẩm thành công", null));
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
            summary = "Cập nhật tồn kho (Admin)",
            description = "Cập nhật số lượng tồn kho của sản phẩm"
    )
    public ResponseEntity<ApiResponse<Void>> updateStock(
            @Parameter(description = "ID của sản phẩm") @PathVariable Long id,
            @Valid @RequestBody UpdateStockRequest request,
            HttpServletRequest httpRequest
    ) {
        log.info("PATCH /api/v1/products/{}/stock - New stock: {}", id, request.getNewStock());
        
        Long userId = securityUtils.getCurrentUserId(httpRequest);
        productService.updateStock(id, request.getNewStock(), userId);
        
        return ResponseEntity.ok(ApiResponse.success("Cập nhật tồn kho thành công", null));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
            summary = "Lấy tất cả sản phẩm kể cả đã xóa (Admin)",
            description = "Lấy danh sách tất cả sản phẩm bao gồm cả sản phẩm đã bị xóa mềm"
    )
    public ResponseEntity<ApiResponse<Page<ProductListResponse>>> getAllProductsIncludingDeleted(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        log.info("GET /api/v1/products/admin/all");
        
        // Use unsorted Pageable - native query already has ORDER BY created_at DESC
        Pageable pageable = PageRequest.of(page, size);
        
        Page<ProductListResponse> products = productService.getAllProductsIncludingDeleted(pageable);
        return ResponseEntity.ok(ApiResponse.success("Lấy tất cả sản phẩm thành công", products));
    }

    @PostMapping("/{id}/restore")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
            summary = "Khôi phục sản phẩm đã xóa (Admin)",
            description = "Khôi phục sản phẩm đã bị xóa mềm"
    )
    public ResponseEntity<ApiResponse<Void>> restoreProduct(
            @Parameter(description = "ID của sản phẩm") @PathVariable Long id,
            HttpServletRequest httpRequest
    ) {
        log.info("POST /api/v1/products/{}/restore", id);
        
        Long userId = securityUtils.getCurrentUserId(httpRequest);
        productService.restoreProduct(id, userId);
        
        return ResponseEntity.ok(ApiResponse.success("Khôi phục sản phẩm thành công", null));
    }
}
