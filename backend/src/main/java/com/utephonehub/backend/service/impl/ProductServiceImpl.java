package com.utephonehub.backend.service.impl;

import com.utephonehub.backend.dto.request.product.CreateProductRequest;
import com.utephonehub.backend.dto.request.product.UpdateProductRequest;
import com.utephonehub.backend.dto.response.product.ProductDetailResponse;
import com.utephonehub.backend.dto.response.product.ProductListResponse;
import com.utephonehub.backend.entity.Brand;
import com.utephonehub.backend.entity.Category;
import com.utephonehub.backend.entity.Product;
import com.utephonehub.backend.entity.User;
import com.utephonehub.backend.exception.BadRequestException;
import com.utephonehub.backend.exception.ResourceNotFoundException;
import com.utephonehub.backend.mapper.ProductMapper;
import com.utephonehub.backend.repository.BrandRepository;
import com.utephonehub.backend.repository.CategoryRepository;
import com.utephonehub.backend.repository.ProductRepository;
import com.utephonehub.backend.repository.UserRepository;
import com.utephonehub.backend.service.IProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Implementation of Product Service
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProductServiceImpl implements IProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final UserRepository userRepository;
    private final ProductMapper productMapper;

    @Override
    public ProductDetailResponse createProduct(CreateProductRequest request, Long userId) {
        log.info("Creating product with name: {}", request.getName());
        
        // Validate category exists
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy danh mục với ID: " + request.getCategoryId()));
        
        // Validate brand exists
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy thương hiệu với ID: " + request.getBrandId()));
        
        // Get user for audit
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy người dùng với ID: " + userId));
        
        // Check duplicate product name
        if (productRepository.existsByNameAndNotDeleted(request.getName(), null)) {
            throw new BadRequestException("Sản phẩm với tên '" + request.getName() + "' đã tồn tại");
        }
        
        // Create product entity
        Product product = productMapper.toEntity(request);
        product.setCategory(category);
        product.setBrand(brand);
        product.setCreatedBy(user);
        product.setUpdatedBy(user);
        
        // Save product
        Product savedProduct = productRepository.save(product);
        log.info("Created product with ID: {}", savedProduct.getId());
        
        return productMapper.toDetailResponse(savedProduct);
    }

    @Override
    public ProductDetailResponse updateProduct(Long id, UpdateProductRequest request, Long userId) {
        log.info("Updating product with ID: {}", id);
        
        // Find product
        Product product = productRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy sản phẩm với ID: " + id));
        
        // Check duplicate name if name is being updated
        if (request.getName() != null && !request.getName().equals(product.getName())) {
            if (productRepository.existsByNameAndNotDeleted(request.getName(), id)) {
                throw new BadRequestException("Sản phẩm với tên '" + request.getName() + "' đã tồn tại");
            }
        }
        
        // Update category if provided
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy danh mục với ID: " + request.getCategoryId()));
            product.setCategory(category);
        }
        
        // Update brand if provided
        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy thương hiệu với ID: " + request.getBrandId()));
            product.setBrand(brand);
        }
        
        // Get user for audit
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy người dùng với ID: " + userId));
        
        // Update fields using mapper (only non-null fields)
        productMapper.updateEntity(product, request);
        product.setUpdatedBy(user);
        
        // Save updated product
        Product updatedProduct = productRepository.save(product);
        log.info("Updated product with ID: {}", updatedProduct.getId());
        
        return productMapper.toDetailResponse(updatedProduct);
    }

    @Override
    public void deleteProduct(Long id, Long userId) {
        log.info("Soft deleting product with ID: {}", id);
        
        // Find product
        Product product = productRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy sản phẩm với ID: " + id));
        
        // Get user for audit
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy người dùng với ID: " + userId));
        
        // Soft delete
        product.setIsDeleted(true);
        product.setDeletedAt(LocalDateTime.now());
        product.setDeletedBy(user);
        
        productRepository.save(product);
        log.info("Soft deleted product with ID: {}", id);
    }

    @Override
    public void increaseStock(Long id, Integer amount) {
        log.info("Increasing stock for product ID: {} by {}", id, amount);
        
        if (amount <= 0) {
            throw new BadRequestException("Số lượng tăng phải lớn hơn 0");
        }
        
        Product product = productRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy sản phẩm với ID: " + id));
        
        product.setStockQuantity(product.getStockQuantity() + amount);
        productRepository.save(product);
        
        log.info("Increased stock for product ID: {} to {}", id, product.getStockQuantity());
    }

    @Override
    public void decreaseStock(Long id, Integer amount) {
        log.info("Decreasing stock for product ID: {} by {}", id, amount);
        
        if (amount <= 0) {
            throw new BadRequestException("Số lượng giảm phải lớn hơn 0");
        }
        
        Product product = productRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy sản phẩm với ID: " + id));
        
        if (product.getStockQuantity() < amount) {
            throw new BadRequestException(
                    "Số lượng trong kho không đủ. Hiện tại: " + product.getStockQuantity());
        }
        
        product.setStockQuantity(product.getStockQuantity() - amount);
        productRepository.save(product);
        
        log.info("Decreased stock for product ID: {} to {}", id, product.getStockQuantity());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductListResponse> getAllProductsIncludingDeleted(Pageable pageable) {
        log.info("Getting all products including deleted");
        return productRepository.findAllIncludingDeleted(pageable)
                .map(productMapper::toListResponse);
    }

    @Override
    public void restoreProduct(Long id, Long userId) {
        log.info("Restoring product with ID: {}", id);
        
        Product product = productRepository.findByIdIncludingDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy sản phẩm với ID: " + id));
        
        if (!product.getIsDeleted()) {
            throw new BadRequestException("Sản phẩm này chưa bị xóa");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy người dùng với ID: " + userId));
        
        product.setIsDeleted(false);
        product.setDeletedAt(null);
        product.setDeletedBy(null);
        product.setUpdatedBy(user);
        
        productRepository.save(product);
        log.info("Restored product with ID: {}", id);
    }
}
