package com.utephonehub.backend.dto.response.category;

import java.time.LocalDateTime;

import com.utephonehub.backend.entity.Category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {

    private Long id;
    private String name;
    private Long parentId;
    private String parentName;
    private Boolean hasChildren;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Convert Category entity to CategoryResponse DTO
     * @param category Category entity
     * @return CategoryResponse
     */
    public static CategoryResponse fromEntity(Category category) {
        if (category == null) {
            return null;
        }

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .hasChildren(category.getChildren() != null && !category.getChildren().isEmpty())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}

