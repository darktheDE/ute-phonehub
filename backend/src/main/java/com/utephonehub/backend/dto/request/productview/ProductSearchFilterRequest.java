package com.utephonehub.backend.dto.request.productview;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Request DTO cho tìm kiếm và lọc sản phẩm (Client-side)
 * Hỗ trợ tìm kiếm, lọc theo nhiều tiêu chí, sắp xếp
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request tìm kiếm và lọc sản phẩm cho người dùng")
public class ProductSearchFilterRequest {
    
    @Schema(description = "Từ khóa tìm kiếm (tên, mô tả sản phẩm)", example = "iPhone 15")
    private String keyword;
    
    @Schema(description = "ID danh mục sản phẩm", example = "1")
    private Long categoryId;
    
    @Schema(description = "Danh sách ID thương hiệu", example = "[1, 2, 3]")
    private List<Long> brandIds;
    
    @Schema(description = "Giá tối thiểu", example = "5000000")
    private BigDecimal minPrice;
    
    @Schema(description = "Giá tối đa", example = "30000000")
    private BigDecimal maxPrice;
    
    @Schema(description = "Đánh giá tối thiểu (1-5 sao)", example = "4.0")
    private Double minRating;
    
    // Technical Specifications Filters
    @Schema(description = "Danh sách RAM cần lọc (GB)", example = "[4, 6, 8, 12]")
    private List<String> ramOptions;
    
    @Schema(description = "Danh sách dung lượng lưu trữ cần lọc (GB)", example = "[64, 128, 256, 512]")
    private List<String> storageOptions;
    
    @Schema(description = "Dung lượng pin tối thiểu (mAh)", example = "4000")
    private Integer minBattery;
    
    @Schema(description = "Dung lượng pin tối đa (mAh)", example = "5000")
    private Integer maxBattery;
    
    @Schema(description = "Danh sách kích thước màn hình (inch)", example = "[6.1, 6.7]")
    private List<String> screenSizeOptions;
    
    @Schema(description = "Danh sách hệ điều hành cần lọc", example = "[\"iOS\", \"Android\"]")
    private List<String> osOptions;
    
    @Schema(description = "Chỉ hiển thị sản phẩm còn hàng", example = "true")
    private Boolean inStockOnly;
    
    @Schema(description = "Sắp xếp theo (name, price, rating, created_date)", example = "price")
    private String sortBy;
    
    @Schema(description = "Hướng sắp xếp (asc, desc)", example = "asc")
    private String sortDirection;
    
    @Schema(description = "Số trang (bắt đầu từ 0)", example = "0")
    @Builder.Default
    private Integer page = 0;
    
    @Schema(description = "Số sản phẩm mỗi trang", example = "20")
    @Builder.Default
    private Integer size = 20;
}
