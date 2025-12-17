package com.utephonehub.backend.service.impl;

import com.utephonehub.backend.dto.request.PromotionTemplateRequest;
import com.utephonehub.backend.dto.response.PromotionTemplateResponse;
import com.utephonehub.backend.entity.PromotionTemplate;
import com.utephonehub.backend.exception.BadRequestException;
import com.utephonehub.backend.exception.ResourceNotFoundException;
import com.utephonehub.backend.mapper.PromotionTemplateMapper;
import com.utephonehub.backend.repository.PromotionTemplateRepository;
import com.utephonehub.backend.service.IPromotionTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PromotionTemplateServiceImpl implements IPromotionTemplateService {

    private final PromotionTemplateRepository templateRepository;
    private final PromotionTemplateMapper templateMapper;

    @Override
    @Transactional
    public PromotionTemplateResponse createTemplate(PromotionTemplateRequest request) {
        log.info("Creating promotion template with code: {}", request.getCode());

        // Validate duplicate code
        if (templateRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Template code already exists: " + request.getCode());
        }

        PromotionTemplate template = templateMapper.toEntity(request);
        template.setCreatedAt(LocalDateTime.now());

        PromotionTemplate saved = templateRepository.save(template);
        log.info("Created template with ID: {}", saved.getId());

        return templateMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public PromotionTemplateResponse updateTemplate(String id, PromotionTemplateRequest request) {
        log.info("Updating template ID: {}", id);

        PromotionTemplate template = findTemplateOrThrow(id);
        
        // Validate duplicate code (excluding current template)
        if (templateRepository.existsByCodeAndIdNot(request.getCode(), id)) {
            throw new BadRequestException("Template code already exists: " + request.getCode());
        }

        templateMapper.updateEntity(request, template);

        PromotionTemplate updated = templateRepository.save(template);
        log.info("Updated template ID: {}", id);

        return templateMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteTemplate(String id) {
        log.info("Deleting template ID: {}", id);

        PromotionTemplate template = findTemplateOrThrow(id);
        
        // Check if template is being used by any promotion (efficient query)
        if (templateRepository.isTemplateInUse(id)) {
            throw new BadRequestException("Cannot delete template that is being used by promotions");
        }

        templateRepository.delete(template);
        log.info("Deleted template ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public PromotionTemplateResponse getTemplateById(String id) {
        log.info("Getting template by ID: {}", id);
        PromotionTemplate template = findTemplateOrThrow(id);
        return templateMapper.toResponse(template);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PromotionTemplateResponse> getAllTemplates() {
        log.info("Getting all templates");
        return templateRepository.findAll().stream()
                .map(templateMapper::toResponse)
                .collect(Collectors.toList());
    }

    private PromotionTemplate findTemplateOrThrow(String id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with ID: " + id));
    }
}
