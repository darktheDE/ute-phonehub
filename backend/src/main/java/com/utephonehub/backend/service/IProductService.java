package com.utephonehub.backend.service;

import com.utephonehub.backend.dto.request.product.CreateProductRequest;
import com.utephonehub.backend.dto.request.product.ProductFilterRequest;
import com.utephonehub.backend.dto.request.product.UpdateProductRequest;
import com.utephonehub.backend.dto.response.product.ProductDetailResponse;
import com.utephonehub.backend.dto.response.product.ProductListResponse;
import com.utephonehub.backend.dto.response.product.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for Product operations
 */
public interface IProductService {
    
    /**
     * Create a new product
     * @param request Product creation request
     * @param userId ID of user creating the product (for audit)
     * @return Created product detail response
     */
    ProductDetailResponse createProduct(CreateProductRequest request, Long userId);
    
    /**
     * Update an existing product
     * @param id Product ID
     * @param request Product update request
     * @param userId ID of user updating the product (for audit)
     * @return Updated product detail response
     */
    ProductDetailResponse updateProduct(Long id, UpdateProductRequest request, Long userId);
    
    /**
     * Soft delete a product
     * @param id Product ID
     * @param userId ID of user deleting the product (for audit)
     */
    void deleteProduct(Long id, Long userId);
    
    /**
     * Get product by ID
     * @param id Product ID
     * @return Product detail response
     */
    ProductDetailResponse getProductById(Long id);
    
    /**
     * Get product by ID (simplified response)
     * @param id Product ID
     * @return Product response
     */
    ProductResponse getProductByIdSimple(Long id);
    
    /**
     * Get all products with pagination
     * @param pageable Pagination parameters
     * @return Page of product list responses
     */
    Page<ProductListResponse> getAllProducts(Pageable pageable);
    
    /**
     * Get all active products with pagination
     * @param pageable Pagination parameters
     * @return Page of product list responses
     */
    Page<ProductListResponse> getAllActiveProducts(Pageable pageable);
    
    /**
     * Filter products by criteria
     * @param filter Filter criteria
     * @param pageable Pagination parameters
     * @return Page of product list responses
     */
    Page<ProductListResponse> filterProducts(ProductFilterRequest filter, Pageable pageable);
    
    /**
     * Search products by keyword
     * @param keyword Search keyword
     * @param pageable Pagination parameters
     * @return Page of product list responses
     */
    Page<ProductListResponse> searchProducts(String keyword, Pageable pageable);
    
    /**
     * Get products by category
     * @param categoryId Category ID
     * @param pageable Pagination parameters
     * @return Page of product list responses
     */
    Page<ProductListResponse> getProductsByCategory(Long categoryId, Pageable pageable);
    
    /**
     * Get products by brand
     * @param brandId Brand ID
     * @param pageable Pagination parameters
     * @return Page of product list responses
     */
    Page<ProductListResponse> getProductsByBrand(Long brandId, Pageable pageable);
    
    /**
     * Update product stock quantity
     * @param id Product ID
     * @param newStock New stock quantity
     * @param userId ID of user updating stock (for audit)
     */
    void updateStock(Long id, Integer newStock, Long userId);
    
    /**
     * Increase product stock
     * @param id Product ID
     * @param amount Amount to increase
     */
    void increaseStock(Long id, Integer amount);
    
    /**
     * Decrease product stock
     * @param id Product ID
     * @param amount Amount to decrease
     */
    void decreaseStock(Long id, Integer amount);
    
    /**
     * Get all products including deleted (Admin only)
     * @param pageable Pagination parameters
     * @return Page of product list responses
     */
    Page<ProductListResponse> getAllProductsIncludingDeleted(Pageable pageable);
    
    /**
     * Permanently delete a product (Admin only - use with caution)
     * @param id Product ID
     */
    void permanentlyDeleteProduct(Long id);
    
    /**
     * Restore a soft-deleted product
     * @param id Product ID
     * @param userId ID of user restoring the product
     */
    void restoreProduct(Long id, Long userId);
}
