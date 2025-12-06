package com.utephonehub.backend.mapper;

import com.utephonehub.backend.dto.request.product.CreateProductRequest;
import com.utephonehub.backend.dto.request.product.UpdateProductRequest;
import com.utephonehub.backend.dto.response.product.*;
import com.utephonehub.backend.entity.Product;
import org.mapstruct.*;

import java.util.List;

/**
 * MapStruct mapper for Product entity and DTOs
 */
@Mapper(componentModel = "spring", 
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {CategoryMapper.class, BrandMapper.class, ProductImageMapper.class})
public interface ProductMapper {
    
    /**
     * Convert Product entity to ProductResponse DTO
     */
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "brandId", source = "brand.id")
    @Mapping(target = "brandName", source = "brand.name")
    ProductResponse toResponse(Product product);
    
    /**
     * Convert Product entity to ProductListResponse DTO (simplified)
     */
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "brandName", source = "brand.name")
    ProductListResponse toListResponse(Product product);
    
    /**
     * Convert Product entity to ProductDetailResponse DTO (full details)
     */
    @Mapping(target = "category", source = "category")
    @Mapping(target = "brand", source = "brand")
    @Mapping(target = "images", source = "images")
    @Mapping(target = "createdByUsername", source = "createdBy.username")
    @Mapping(target = "updatedByUsername", source = "updatedBy.username")
    ProductDetailResponse toDetailResponse(Product product);
    
    /**
     * Convert list of Products to list of ProductListResponses
     */
    List<ProductListResponse> toListResponses(List<Product> products);
    
    /**
     * Convert CreateProductRequest to Product entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "deletedBy", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "images", ignore = true)
    Product toEntity(CreateProductRequest request);
    
    /**
     * Update existing Product entity with UpdateProductRequest data
     * Only updates non-null fields from request
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "deletedBy", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "images", ignore = true)
    void updateEntity(@MappingTarget Product product, UpdateProductRequest request);
}
