package com.utephonehub.backend.service;

import com.utephonehub.backend.dto.request.product.CreateProductRequest;
import com.utephonehub.backend.dto.request.product.UpdateProductRequest;
import com.utephonehub.backend.dto.response.product.ProductDetailResponse;
import com.utephonehub.backend.dto.response.product.ProductListResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
     * Increase product stock (used by Order service when order is cancelled)
     * @param id Product ID
     * @param amount Amount to increase
     */
    void increaseStock(Long id, Integer amount);
    
    /**
     * Decrease product stock (used by Order service when order is created)
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
     * Restore a soft-deleted product
     * @param id Product ID
     * @param userId ID of user restoring the product
     */
    void restoreProduct(Long id, Long userId);
    
    /**
     * Manage product images (add/update/reorder)
     * @param productId Product ID
     * @param request Image management request
     */
    void manageProductImages(Long productId, com.utephonehub.backend.dto.request.product.ManageImagesRequest request);
    
    /**
     * Delete a specific product image
     * @param productId Product ID
     * @param imageId Image ID
     */
    void deleteProductImage(Long productId, Long imageId);
}
