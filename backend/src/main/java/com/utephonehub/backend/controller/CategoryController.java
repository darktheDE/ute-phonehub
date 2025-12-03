package com.utephonehub.backend.controller;

import com.utephonehub.backend.dto.ApiResponse;
import com.utephonehub.backend.dto.response.category.CategoryResponse;
import com.utephonehub.backend.service.ICategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Category", description = "API quản lý danh mục sản phẩm")
public class CategoryController {

    private final ICategoryService categoryService;

    @GetMapping
    @Operation(
            summary = "Lấy danh sách tất cả danh mục",
            description = "Trả về danh sách tất cả danh mục trong hệ thống (không phân cấp)"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Lấy danh sách thành công",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        log.info("Get all categories request");
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(
                ApiResponse.success("Lấy danh sách danh mục thành công", categories)
        );
    }

    @GetMapping("/root")
    @Operation(
            summary = "Lấy danh sách danh mục gốc",
            description = "Trả về danh sách các danh mục gốc (không có danh mục cha) kèm danh mục con"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Lấy danh sách thành công",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getRootCategories() {
        log.info("Get root categories request");
        List<CategoryResponse> categories = categoryService.getRootCategories();
        return ResponseEntity.ok(
                ApiResponse.success("Lấy danh sách danh mục gốc thành công", categories)
        );
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Lấy chi tiết danh mục theo ID",
            description = "Trả về thông tin chi tiết của một danh mục, bao gồm danh mục con (nếu có)"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Lấy thông tin thành công",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Không tìm thấy danh mục"
            )
    })
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(
            @Parameter(description = "ID của danh mục", required = true)
            @PathVariable Long id
    ) {
        log.info("Get category by id request: {}", id);
        CategoryResponse category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Lấy thông tin danh mục thành công", category)
        );
    }

    @GetMapping("/parent/{parentId}")
    @Operation(
            summary = "Lấy danh sách danh mục con theo danh mục cha",
            description = "Trả về danh sách các danh mục con của một danh mục cha"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Lấy danh sách thành công",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Không tìm thấy danh mục cha"
            )
    })
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategoriesByParentId(
            @Parameter(description = "ID của danh mục cha", required = true)
            @PathVariable Long parentId
    ) {
        log.info("Get categories by parent id request: {}", parentId);
        List<CategoryResponse> categories = categoryService.getCategoriesByParentId(parentId);
        return ResponseEntity.ok(
                ApiResponse.success("Lấy danh sách danh mục con thành công", categories)
        );
    }
}

