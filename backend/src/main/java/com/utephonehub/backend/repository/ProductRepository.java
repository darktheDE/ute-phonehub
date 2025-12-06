package com.utephonehub.backend.repository;

import com.utephonehub.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Soft delete queries (default behavior with @Where annotation)
    Optional<Product> findByIdAndIsDeletedFalse(Long id);
    
    List<Product> findByIsDeletedFalse();
    
    Page<Product> findByIsDeletedFalse(Pageable pageable);
    
    List<Product> findByStatusTrue();
    
    Page<Product> findByStatusTrueAndIsDeletedFalse(Pageable pageable);
    
    // Category & Brand queries
    List<Product> findByCategoryIdAndIsDeletedFalse(Long categoryId);
    
    Page<Product> findByCategoryIdAndIsDeletedFalse(Long categoryId, Pageable pageable);
    
    List<Product> findByBrandIdAndIsDeletedFalse(Long brandId);
    
    Page<Product> findByBrandIdAndIsDeletedFalse(Long brandId, Pageable pageable);
    
    // Search queries
    @Query("SELECT p FROM Product p WHERE p.isDeleted = false AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> searchProducts(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isDeleted = false AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Product> searchProducts(@Param("keyword") String keyword);
    
    // Advanced filtering with price range
    @Query("SELECT p FROM Product p WHERE p.isDeleted = false " +
           "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
           "AND (:brandId IS NULL OR p.brand.id = :brandId) " +
           "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
           "AND p.status = true")
    Page<Product> filterProducts(@Param("categoryId") Long categoryId,
                                  @Param("brandId") Long brandId,
                                  @Param("minPrice") BigDecimal minPrice,
                                  @Param("maxPrice") BigDecimal maxPrice,
                                  Pageable pageable);
    
    // Admin queries (include deleted products)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdIncludingDeleted(@Param("id") Long id);
    
    @Query("SELECT p FROM Product p")
    Page<Product> findAllIncludingDeleted(Pageable pageable);
    
    // Count queries
    long countByIsDeletedFalse();
    
    long countByCategoryIdAndIsDeletedFalse(Long categoryId);
    
    long countByBrandIdAndIsDeletedFalse(Long brandId);
    
    // Check existence
    boolean existsByIdAndIsDeletedFalse(Long id);
    
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Product p " +
           "WHERE p.name = :name AND p.isDeleted = false AND (:id IS NULL OR p.id != :id)")
    boolean existsByNameAndNotDeleted(@Param("name") String name, @Param("id") Long id);
}

