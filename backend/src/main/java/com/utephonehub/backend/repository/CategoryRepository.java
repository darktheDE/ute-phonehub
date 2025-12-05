package com.utephonehub.backend.repository;

import com.utephonehub.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByParentIdIsNull();
    List<Category> findByParentId(Long parentId);

    /**
     * Check if category name exists in same parent level
     * @param name Category name
     * @param parentId Parent category ID (null for root level)
     * @return true if exists, false otherwise
     */
    boolean existsByNameAndParentId(String name, Long parentId);
}

