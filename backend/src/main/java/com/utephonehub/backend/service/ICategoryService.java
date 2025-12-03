package com.utephonehub.backend.service;

import com.utephonehub.backend.dto.response.category.CategoryResponse;

import java.util.List;

/**
 * Interface for Category Service operations
 */
public interface ICategoryService {

    /**
     * Get categories by parent ID
     * If parentId is null, return root categories (categories without parent)
     * If parentId is provided, return children of that parent
     *
     * @param parentId Parent category ID (nullable)
     * @return List of CategoryResponse
     */
    List<CategoryResponse> getCategoriesByParentId(Long parentId);
}

