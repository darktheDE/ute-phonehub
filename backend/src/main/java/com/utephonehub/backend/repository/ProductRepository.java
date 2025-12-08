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
    boolean existsByCategoryId(Long categoryId);
    boolean existsByBrandId(Long brandId);
    // Tìm nhiều sản phẩm theo danh sách IDs
    List<Product> findAllByIdIn(List<Long> ids);
}

