package com.utephonehub.backend.service;

import com.utephonehub.backend.dto.request.productview.ProductSearchFilterRequest;
import com.utephonehub.backend.dto.response.productview.CategoryProductsResponse;
import com.utephonehub.backend.dto.response.productview.ProductComparisonResponse;
import com.utephonehub.backend.dto.response.productview.ProductDetailViewResponse;
import com.utephonehub.backend.dto.response.productview.ProductViewResponse;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Service interface cho ProductView API
 * API dành cho client-side: tìm kiếm, lọc, sắp xếp, so sánh sản phẩm
 */
public interface IProductViewService {
    
    /**
     * Tìm kiếm và lọc sản phẩm với nhiều tiêu chí
     * @param request Request chứa các tiêu chí tìm kiếm/lọc
     * @return Page chứa danh sách sản phẩm
     */
    Page<ProductViewResponse> searchAndFilterProducts(ProductSearchFilterRequest request);
    
    /**
     * Lấy chi tiết sản phẩm theo ID
     * @param productId ID sản phẩm
     * @return Chi tiết sản phẩm cho client
     */
    ProductDetailViewResponse getProductDetailById(Long productId);
    
    /**
     * Lấy danh sách sản phẩm theo danh mục
     * @param categoryId ID danh mục
     * @param request Request chứa các tiêu chí lọc/sắp xếp
     * @return Thông tin danh mục và danh sách sản phẩm
     */
    CategoryProductsResponse getProductsByCategory(Long categoryId, ProductSearchFilterRequest request);
    
    /**
     * So sánh nhiều sản phẩm (tối đa 4 sản phẩm)
     * @param productIds Danh sách ID sản phẩm cần so sánh
     * @return Thông tin so sánh các sản phẩm
     */
    ProductComparisonResponse compareProducts(List<Long> productIds);
    
    /**
     * Lấy sản phẩm liên quan (cùng danh mục hoặc thương hiệu)
     * @param productId ID sản phẩm gốc
     * @param limit Số lượng sản phẩm liên quan
     * @return Danh sách sản phẩm liên quan
     */
    List<ProductViewResponse> getRelatedProducts(Long productId, Integer limit);
    
    /**
     * Lấy sản phẩm bán chạy
     * @param limit Số lượng sản phẩm
     * @return Danh sách sản phẩm bán chạy
     */
    List<ProductViewResponse> getBestSellingProducts(Integer limit);
    
    /**
     * Lấy sản phẩm mới nhất
     * @param limit Số lượng sản phẩm
     * @return Danh sách sản phẩm mới nhất
     */
    List<ProductViewResponse> getNewArrivals(Integer limit);
    
    /**
     * Lấy sản phẩm đang khuyến mãi
     * @param limit Số lượng sản phẩm
     * @return Danh sách sản phẩm khuyến mãi
     */
    List<ProductViewResponse> getFeaturedProducts(Integer limit);
    
    /**
     * Lọc sản phẩm theo RAM
     * @param ramOptions Danh sách RAM cần lọc
     * @param request Request chứa các tiêu chí lọc khác
     * @return Page chứa danh sách sản phẩm
     */
    Page<ProductViewResponse> filterByRam(List<String> ramOptions, ProductSearchFilterRequest request);
    
    /**
     * Lọc sản phẩm theo dung lượng lưu trữ
     * @param storageOptions Danh sách storage cần lọc
     * @param request Request chứa các tiêu chí lọc khác
     * @return Page chứa danh sách sản phẩm
     */
    Page<ProductViewResponse> filterByStorage(List<String> storageOptions, ProductSearchFilterRequest request);
    
    /**
     * Lọc sản phẩm theo dung lượng pin
     * @param minBattery Dung lượng pin tối thiểu
     * @param maxBattery Dung lượng pin tối đa
     * @param request Request chứa các tiêu chí lọc khác
     * @return Page chứa danh sách sản phẩm
     */
    Page<ProductViewResponse> filterByBattery(Integer minBattery, Integer maxBattery, ProductSearchFilterRequest request);
    
    /**
     * Lọc sản phẩm theo kích thước màn hình
     * @param screenSizeOptions Danh sách kích thước màn hình
     * @param request Request chứa các tiêu chí lọc khác
     * @return Page chứa danh sách sản phẩm
     */
    Page<ProductViewResponse> filterByScreenSize(List<String> screenSizeOptions, ProductSearchFilterRequest request);
    
    /**
     * Lọc sản phẩm theo hệ điều hành
     * @param osOptions Danh sách hệ điều hành
     * @param request Request chứa các tiêu chí lọc khác
     * @return Page chứa danh sách sản phẩm
     */
    Page<ProductViewResponse> filterByOS(List<String> osOptions, ProductSearchFilterRequest request);
    
    /**
     * Lọc sản phẩm theo đánh giá sao
     * @param minRating Đánh giá tối thiểu
     * @param maxRating Đánh giá tối đa
     * @param request Request chứa các tiêu chí lọc khác
     * @return Page chứa danh sách sản phẩm
     */
    Page<ProductViewResponse> filterByRating(Double minRating, Double maxRating, ProductSearchFilterRequest request);
    
    // ===== WithLimit Methods =====
    
    /**
     * Tìm kiếm và lọc sản phẩm với giới hạn số lượng
     */
    List<ProductViewResponse> searchAndFilterProductsWithLimit(ProductSearchFilterRequest request, Integer limit);
    
    /**
     * Lấy sản phẩm theo danh mục với giới hạn số lượng
     */
    List<ProductViewResponse> getProductsByCategoryWithLimit(Long categoryId, ProductSearchFilterRequest request, Integer limit);
    
    /**
     * Lọc sản phẩm theo RAM với giới hạn số lượng
     */
    List<ProductViewResponse> filterByRamWithLimit(List<String> ramOptions, ProductSearchFilterRequest request, Integer limit);
    
    /**
     * Lọc sản phẩm theo storage với giới hạn số lượng
     */
    List<ProductViewResponse> filterByStorageWithLimit(List<String> storageOptions, ProductSearchFilterRequest request, Integer limit);
    
    /**
     * Lọc sản phẩm theo battery với giới hạn số lượng
     */
    List<ProductViewResponse> filterByBatteryWithLimit(Integer minBattery, Integer maxBattery, ProductSearchFilterRequest request, Integer limit);
    
    /**
     * Lọc sản phẩm theo screen size với giới hạn số lượng
     */
    List<ProductViewResponse> filterByScreenSizeWithLimit(List<String> screenSizeOptions, ProductSearchFilterRequest request, Integer limit);
    
    /**
     * Lọc sản phẩm theo OS với giới hạn số lượng
     */
    List<ProductViewResponse> filterByOSWithLimit(List<String> osOptions, ProductSearchFilterRequest request, Integer limit);
    
    /**
     * Lọc sản phẩm theo rating với giới hạn số lượng
     */
    List<ProductViewResponse> filterByRatingWithLimit(Double minRating, Double maxRating, ProductSearchFilterRequest request, Integer limit);
    
    // ===== NEW ENHANCED METHODS =====
    
    /**
     * Lấy danh sách sản phẩm nổi bật theo nhiều tiêu chí
     * Tiêu chí: Giá >= 5 triệu, Hàng mới (60 ngày), Đánh giá >= 4.8, Số đánh giá >= 10, Có giảm giá
     * @param limit Số lượng sản phẩm
     * @return Danh sách sản phẩm nổi bật
     */
    List<ProductViewResponse> getFeaturedProductsByCriteria(Integer limit);
    
    /**
     * Lọc sản phẩm theo số lượng đã bán
     * @param minSoldCount Số lượng bán tối thiểu
     * @param request Request chứa các tiêu chí lọc khác
     * @return Page chứa danh sách sản phẩm
     */
    Page<ProductViewResponse> filterBySoldCount(Integer minSoldCount, ProductSearchFilterRequest request);
    
    /**
     * Lấy tất cả sản phẩm (bao gồm cả hết hàng và còn hàng)
     * @param request Request chứa các tiêu chí lọc/sắp xếp
     * @return Page chứa danh sách tất cả sản phẩm
     */
    Page<ProductViewResponse> getAllProducts(ProductSearchFilterRequest request);
    
    /**
     * Lấy chi tiết sản phẩm kèm số lượng đã bán từ order_items
     * @param productId ID sản phẩm
     * @return Chi tiết sản phẩm với thông tin số lượng đã bán
     */
    ProductDetailViewResponse getProductDetailWithSoldCount(Long productId);
}
