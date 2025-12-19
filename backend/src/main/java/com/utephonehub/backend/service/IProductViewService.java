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
}
