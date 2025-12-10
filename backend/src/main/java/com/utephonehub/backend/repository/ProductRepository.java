package com.utephonehub.backend.repository;

import com.utephonehub.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStatusTrue();
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByBrandId(Long brandId);
    
    /**
     * Find products with low stock (stock quantity <= threshold)
     * Sorted by stock quantity ascending (lowest first)
     * Only returns active products (status = true)
     * 
     * @param threshold Stock quantity threshold for warning
     * @return List of products with low stock
     */
    List<Product> findByStockQuantityLessThanEqualAndStatusTrueOrderByStockQuantityAsc(Integer threshold);
    boolean existsByCategoryId(Long categoryId);
    boolean existsByBrandId(Long brandId);
    // Tìm nhiều sản phẩm theo danh sách IDs
    List<Product> findAllByIdIn(List<Long> ids);
}

