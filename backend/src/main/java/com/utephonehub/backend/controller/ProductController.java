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
@RequestMapping("/api/v1/admin/products")
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

    @PostMapping("/create-product")
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

    @PutMapping("/update-product/{id}")
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

    @DeleteMapping("/delete-product/{id}")
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

    @GetMapping("/products")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Xem danh sách sản phẩm (Admin)",
            description = "Lấy danh sách sản phẩm với tùy chọn lọc, tìm kiếm và sắp xếp. " +
                         "Nếu không truyền tham số gì thì mặc định trả về tất cả sản phẩm đang hoạt động."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Lấy danh sách thành công"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Tham số không hợp lệ"
            )
    })
    public ResponseEntity<ApiResponse<Page<ProductListResponse>>> getProducts(
            @Parameter(description = "Từ khóa tìm kiếm (tên, SKU, mô tả)") 
            @RequestParam(required = false) String keyword,
            
            @Parameter(description = "Lọc theo category ID") 
            @RequestParam(required = false) Long categoryId,
            
            @Parameter(description = "Lọc theo brand ID") 
            @RequestParam(required = false) Long brandId,
            
            @Parameter(description = "Giá tối thiểu") 
            @RequestParam(required = false) Double minPrice,
            
            @Parameter(description = "Giá tối đa") 
            @RequestParam(required = false) Double maxPrice,
            
            @Parameter(description = "Trạng thái (true=active, false=inactive)") 
            @RequestParam(required = false) Boolean status,
            
            @Parameter(description = "Bao gồm sản phẩm đã xóa (true=bao gồm, false=không)") 
            @RequestParam(required = false, defaultValue = "false") Boolean includeDeleted,
            
            @Parameter(description = "Sắp xếp theo (name, price, stock, createdAt)") 
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            
            @Parameter(description = "Hướng sắp xếp (asc, desc)") 
            @RequestParam(required = false, defaultValue = "desc") String sortDirection,
            
            @Parameter(description = "Số trang") 
            @RequestParam(defaultValue = "0") int page,
            
            @Parameter(description = "Số items/trang") 
            @RequestParam(defaultValue = "20") int size
    ) {
        log.info("GET /api/v1/admin/products/products - keyword: {}, categoryId: {}, brandId: {}, priceRange: [{}-{}], includeDeleted: {}, sort: {}({})",
                keyword, categoryId, brandId, minPrice, maxPrice, includeDeleted, sortBy, sortDirection);
        
        // Validation: minPrice <= maxPrice
        if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
            log.error("Invalid price range: minPrice ({}) > maxPrice ({})", minPrice, maxPrice);
            throw new com.utephonehub.backend.exception.BadRequestException(
                    "Giá tối thiểu không thể lớn hơn giá tối đa"
            );
        }
        
        // Validation: prices must be non-negative
        if (minPrice != null && minPrice < 0) {
            throw new com.utephonehub.backend.exception.BadRequestException(
                    "Giá tối thiểu phải lớn hơn hoặc bằng 0"
            );
        }
        if (maxPrice != null && maxPrice < 0) {
            throw new com.utephonehub.backend.exception.BadRequestException(
                    "Giá tối đa phải lớn hơn hoặc bằng 0"
            );
        }
        
        // Validation: sortBy must be valid field
        if (!sortBy.matches("^(name|price|stock|createdAt)$")) {
            log.error("Invalid sortBy parameter: {}", sortBy);
            throw new com.utephonehub.backend.exception.BadRequestException(
                    "Tham số sortBy không hợp lệ. Chỉ chấp nhận: name, price, stock, createdAt"
            );
        }
        
        // Validation: sortDirection must be asc or desc
        if (!sortDirection.matches("^(asc|desc)$")) {
            log.error("Invalid sortDirection parameter: {}", sortDirection);
            throw new com.utephonehub.backend.exception.BadRequestException(
                    "Tham số sortDirection không hợp lệ. Chỉ chấp nhận: asc, desc"
            );
        }
        
        // Validation: keyword min length
        if (keyword != null && !keyword.trim().isEmpty() && keyword.trim().length() < 2) {
            log.error("Search keyword too short: {}", keyword);
            throw new com.utephonehub.backend.exception.BadRequestException(
                    "Từ khóa tìm kiếm phải có ít nhất 2 ký tự"
            );
        }
        
        // Create Sort object for database-level sorting (name, createdAt only)
        Sort sort = null;
        if ("name".equals(sortBy) || "createdAt".equals(sortBy)) {
            Sort.Direction direction = "asc".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
            sort = Sort.by(direction, sortBy);
        }
        
        // Create Pageable with or without sort
        Pageable pageable = sort != null 
                ? PageRequest.of(page, size, sort)
                : PageRequest.of(page, size);
        
        // Get products with filters/search/sort
        Page<ProductListResponse> products = productService.getProducts(
                keyword, categoryId, brandId, minPrice, maxPrice, status,
                includeDeleted, sortBy, sortDirection, pageable
        );
        
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sản phẩm thành công", products));
    }

    @PostMapping("/restore-product/{id}")
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

    @PostMapping("/manage-images/{id}")
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

    @DeleteMapping("/delete-image/{id}/{imageId}")
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
        log.info("DELETE /api/v1/admin/products/delete-image/{}/{}", id, imageId);
        
        productService.deleteProductImage(id, imageId);
        
        return ResponseEntity.ok(ApiResponse.success("Xóa hình ảnh thành công", null));
    }

}
