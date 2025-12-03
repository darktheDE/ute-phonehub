package com.utephonehub.backend.service;

import com.utephonehub.backend.dto.response.category.CategoryResponse;

import java.util.List;

/**
 * Interface for Category Service operations
 */
public interface ICategoryService {

    /**
     * Get all categories (root categories with their children)
     * @return List of CategoryResponse
     */
    List<CategoryResponse> getAllCategories();

    /**
     * Get all root categories (categories without parent)
     * @return List of CategoryResponse
     */
    List<CategoryResponse> getRootCategories();

    /**
     * Get category by ID
     * @param categoryId Category ID
     * @return CategoryResponse
     */
    CategoryResponse getCategoryById(Long categoryId);

    /**
     * Get child categories by parent ID
     * @param parentId Parent category ID
     * @return List of CategoryResponse
     */
    List<CategoryResponse> getCategoriesByParentId(Long parentId);
}

