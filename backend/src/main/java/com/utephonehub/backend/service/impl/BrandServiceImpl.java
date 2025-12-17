package com.utephonehub.backend.service.impl;

import com.utephonehub.backend.dto.request.brand.CreateBrandRequest;
import com.utephonehub.backend.dto.request.brand.UpdateBrandRequest;
import com.utephonehub.backend.dto.response.brand.BrandResponse;
import com.utephonehub.backend.entity.Brand;
import com.utephonehub.backend.exception.BadRequestException;
import com.utephonehub.backend.exception.ResourceNotFoundException;
import com.utephonehub.backend.repository.BrandRepository;
import com.utephonehub.backend.repository.ProductRepository;
import com.utephonehub.backend.service.IBrandService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BrandServiceImpl implements IBrandService {

    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public List<BrandResponse> getAllBrands() {
        log.info("Getting all brands");
        List<Brand> brands = brandRepository.findAllByOrderByNameAsc();
        return brands.stream()
                .map(BrandResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BrandResponse getBrandById(Long id) {
        log.info("Getting brand by id: {}", id);
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thương hiệu không tồn tại với ID: " + id));
        return BrandResponse.fromEntity(brand);
    }

    @Override
    @Transactional
    public BrandResponse createBrand(CreateBrandRequest request) {
        log.info("Creating new brand with name: {}", request.getName());

        // Check if brand name already exists
        if (brandRepository.existsByName(request.getName())) {
            throw new BadRequestException("Tên thương hiệu '" + request.getName() + "' đã tồn tại");
        }

        // Create new brand
        Brand brand = Brand.builder()
                .name(request.getName())
                .description(request.getDescription())
                .logoUrl(request.getLogoUrl())
                .build();

        brand = brandRepository.save(brand);
        log.info("Created brand successfully with id: {}", brand.getId());
        return BrandResponse.fromEntity(brand);
    }

    @Override
    @Transactional
    public BrandResponse updateBrand(Long id, UpdateBrandRequest request) {
        log.info("Updating brand with id: {}, new name: {}", id, request.getName());

        // Find existing brand
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thương hiệu không tồn tại với ID: " + id));

        // Check if new name conflicts with another brand (excluding current brand)
        if (brandRepository.existsByNameAndIdNot(request.getName(), id)) {
            throw new BadRequestException("Tên thương hiệu '" + request.getName() + "' đã tồn tại");
        }

        // Update brand fields
        brand.setName(request.getName());
        brand.setDescription(request.getDescription());
        brand.setLogoUrl(request.getLogoUrl());

        brand = brandRepository.save(brand);
        log.info("Updated brand successfully with id: {}", brand.getId());

        return BrandResponse.fromEntity(brand);
    }

    @Override
    @Transactional
    public void deleteBrand(Long id) {
        log.info("Deleting brand with id: {}", id);

        // Check if brand exists
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thương hiệu không tồn tại với ID: " + id));

        // Check if brand has products linked
        boolean hasProducts = productRepository.existsByBrandId(id);
        if (hasProducts) {
            throw new BadRequestException(
                    "Không thể xóa thương hiệu. Thương hiệu đang chứa sản phẩm");
        }

        // Delete brand
        brandRepository.delete(brand);
        log.info("Deleted brand successfully with id: {}", id);
    }
}


