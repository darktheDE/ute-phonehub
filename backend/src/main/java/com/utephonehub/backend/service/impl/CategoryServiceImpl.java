package com.utephonehub.backend.service.impl;

import com.utephonehub.backend.dto.response.category.CategoryResponse;
import com.utephonehub.backend.entity.Category;
import com.utephonehub.backend.exception.ResourceNotFoundException;
import com.utephonehub.backend.repository.CategoryRepository;
import com.utephonehub.backend.service.ICategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements ICategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        log.info("Getting all categories");
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(CategoryResponse::fromEntitySimple)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getRootCategories() {
        log.info("Getting root categories");
        List<Category> rootCategories = categoryRepository.findByParentIdIsNull();
        return rootCategories.stream()
                .map(CategoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long categoryId) {
        log.info("Getting category by id: {}", categoryId);
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tồn tại với ID: " + categoryId));
        return CategoryResponse.fromEntity(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategoriesByParentId(Long parentId) {
        log.info("Getting categories by parent id: {}", parentId);

        // Validate parent exists
        if (!categoryRepository.existsById(parentId)) {
            throw new ResourceNotFoundException("Danh mục cha không tồn tại với ID: " + parentId);
        }

        List<Category> childCategories = categoryRepository.findByParentId(parentId);
        return childCategories.stream()
                .map(CategoryResponse::fromEntitySimple)
                .collect(Collectors.toList());
    }
}

