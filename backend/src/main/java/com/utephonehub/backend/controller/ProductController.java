package com.utephonehub.backend.controller;

import com.utephonehub.backend.dto.ApiResponse;
import com.utephonehub.backend.dto.request.product.CreateProductRequest;
import com.utephonehub.backend.dto.request.product.ManageImagesRequest;
import com.utephonehub.backend.dto.request.product.UpdateProductRequest;
import com.utephonehub.backend.dto.response.product.ProductDetailResponse;
import com.utephonehub.backend.dto.response.product.ProductListResponse;
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
@SecurityRequirement(name = "bearerAuth")
public class ProductController {

    private final IProductService productService;
    private final SecurityUtils securityUtils;

    /**
     * ADMIN ENDPOINTS - Require ADMIN role
     */

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
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

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
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

    @PostMapping("/{id}/images")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Quản lý hình ảnh sản phẩm (Admin)",
            description = "Thêm, cập nhật hoặc sắp xếp lại hình ảnh sản phẩm. Sẽ thay thế toàn bộ ảnh hiện tại."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Cập nhật hình ảnh thành công"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Dữ liệu không hợp lệ"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Không tìm thấy sản phẩm"
            )
    })
    public ResponseEntity<ApiResponse<Void>> manageProductImages(
            @Parameter(description = "ID của sản phẩm") @PathVariable Long id,
            @Valid @RequestBody ManageImagesRequest request
    ) {
        log.info("POST /api/v1/products/{}/images - Managing {} images", id, request.getImages().size());
        
        productService.manageProductImages(id, request);
        
        return ResponseEntity.ok(ApiResponse.success("Cập nhật hình ảnh sản phẩm thành công", null));
    }

    @DeleteMapping("/{id}/images/{imageId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Xóa hình ảnh sản phẩm (Admin)",
            description = "Xóa một hình ảnh cụ thể của sản phẩm"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Xóa hình ảnh thành công"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Không thể xóa ảnh cuối cùng"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Không tìm thấy sản phẩm hoặc hình ảnh"
            )
    })
    public ResponseEntity<ApiResponse<Void>> deleteProductImage(
            @Parameter(description = "ID của sản phẩm") @PathVariable Long id,
            @Parameter(description = "ID của hình ảnh") @PathVariable Long imageId
    ) {
        log.info("DELETE /api/v1/products/{}/images/{}", id, imageId);
        
        productService.deleteProductImage(id, imageId);
        
        return ResponseEntity.ok(ApiResponse.success("Xóa hình ảnh thành công", null));
    }
}
