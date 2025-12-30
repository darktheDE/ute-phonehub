package com.utephonehub.backend.service.impl;

import com.utephonehub.backend.dto.request.PromotionRequest;
import com.utephonehub.backend.dto.response.PromotionResponse;
import com.utephonehub.backend.entity.Promotion;
import com.utephonehub.backend.entity.PromotionTemplate;
import com.utephonehub.backend.enums.EPromotionStatus;
import com.utephonehub.backend.exception.promotion.PromotionNotFoundException;
import com.utephonehub.backend.mapper.PromotionMapper;
import com.utephonehub.backend.repository.PromotionRepository;
import com.utephonehub.backend.repository.PromotionTemplateRepository;
import com.utephonehub.backend.service.IPromotionService;
import com.utephonehub.backend.service.impl.promotion.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of IPromotionService
 * Refactored following SOLID, DRY, and GRASP principles:
 * - Single Responsibility: Delegates specific tasks to helper classes
 * - Open/Closed: Open for extension through new validators/calculators
 * - Dependency Inversion: Depends on abstractions (helper components)
 * - DRY: No code duplication, reusable components
 * - High Cohesion: Each component has a clear, focused purpose
 * - Low Coupling: Components are independent and loosely coupled
 */
@Service
@RequiredArgsConstructor
public class PromotionServiceImpl implements IPromotionService {

    // Repositories
    private final PromotionRepository promotionRepository;
    private final PromotionTemplateRepository templateRepository;

    // Helper Components (following Dependency Injection and Indirection patterns)
    private final PromotionValidator promotionValidator;
    private final PromotionDiscountCalculator discountCalculator;
    private final PromotionMapper promotionMapper;
    private final PromotionTargetManager targetManager;

    // --- 1. CREATE PROMOTION ---
    @Override
    @Transactional
    public PromotionResponse createPromotion(PromotionRequest request) {
        PromotionTemplate template = findTemplateOrThrow(request.getTemplateId());

        Promotion promotion = buildPromotionFromRequest(request, template);
        Promotion savedPromotion = promotionRepository.save(promotion);
        
        targetManager.saveTargets(savedPromotion, request.getTargets());

        return promotionMapper.toResponse(savedPromotion);
    }

    // --- 2. MODIFY PROMOTION ---
    @Override
    @Transactional
    public PromotionResponse modifyPromotion(String id, PromotionRequest request) {
        Promotion promotion = findPromotionOrThrow(id);

        updatePromotionFields(promotion, request);
        updatePromotionTemplate(promotion, request.getTemplateId());
        targetManager.replaceTargets(promotion, request.getTargets());

        Promotion updatedPromotion = promotionRepository.save(promotion);
        return promotionMapper.toResponse(updatedPromotion);
    }

    // --- 3. DISABLE PROMOTION ---
    @Override
    @Transactional
    public void disable(String id) {
        Promotion promotion = findPromotionOrThrow(id);
        promotion.setStatus(EPromotionStatus.INACTIVE);
        promotionRepository.save(promotion);
    }

    // --- 4. GET DETAILS ---
    @Override
    public PromotionResponse getDetails(String id) {
        Promotion promotion = findPromotionOrThrow(id);
        return promotionMapper.toResponse(promotion);
    }

    // --- 5. GET ALL PROMOTIONS ---
    @Override
    public List<PromotionResponse> getAllPromotions() {
        List<Promotion> promotions = promotionRepository.findAll();
        return promotionMapper.toResponseList(promotions);
    }

    // --- PUBLIC: GET ALL ACTIVE ---
    @Override
    public List<PromotionResponse> getAllActivePromotions() {
        LocalDateTime now = LocalDateTime.now();
        List<Promotion> promotions = promotionRepository.findByEffectiveDateBeforeAndExpirationDateAfter(now, now);
        
        return promotions.stream()
                .filter(p -> p.getStatus() == EPromotionStatus.ACTIVE)
                .map(promotionMapper::toResponse)
                .collect(Collectors.toList());
    }

    // --- 6. CHECK AVAILABLE ---
    @Override
    public List<PromotionResponse> checkAndGetAvailablePromotions(Double orderTotal) {
        LocalDateTime now = LocalDateTime.now();
        List<Promotion> promotions = promotionRepository.findByEffectiveDateBeforeAndExpirationDateAfter(now, now);

        return promotions.stream()
                .filter(p -> p.getStatus() == EPromotionStatus.ACTIVE)
                .filter(p -> isMinValueMet(p, orderTotal))
                .map(promotionMapper::toResponse)
                .collect(Collectors.toList());
    }

    // --- 7. CALCULATE DISCOUNT ---
    @Override
    public Double calculateDiscount(String promotionId, Double orderTotal) {
        Promotion promotion = findPromotionOrThrow(promotionId);
        
        // Validate promotion can be applied (following Single Responsibility)
        promotionValidator.validatePromotionApplicability(promotion, orderTotal);
        
        // Calculate discount (following Single Responsibility)
        return discountCalculator.calculateDiscountAmount(promotion, orderTotal);
    }

    // --- PRIVATE HELPER METHODS ---
    
    /**
     * Find promotion by ID or throw exception
     * Follows DRY principle - centralized error handling
     */
    private Promotion findPromotionOrThrow(String id) {
        return promotionRepository.findById(id)
                .orElseThrow(() -> new PromotionNotFoundException(id));
    }

    /**
     * Find template by ID or throw exception
     * Follows DRY principle - centralized error handling
     */
    private PromotionTemplate findTemplateOrThrow(String templateId) {
        return templateRepository.findById(templateId)
                .orElseThrow(() -> new RuntimeException("Template not found with ID: " + templateId));
    }

    /**
     * Build Promotion entity from request
     * Follows Creator (GRASP) pattern
     */
    private Promotion buildPromotionFromRequest(PromotionRequest request, PromotionTemplate template) {
        return Promotion.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .effectiveDate(request.getEffectiveDate())
                .expirationDate(request.getExpirationDate())
                .percentDiscount(request.getPercentDiscount())
                .minValueToBeApplied(request.getMinValueToBeApplied())
                .status(request.getStatus())
                .template(template)
                .targets(new ArrayList<>())
                .build();
    }

    /**
     * Update promotion fields from request
     * Follows Information Expert (GRASP) - service knows how to update promotion
     */
    private void updatePromotionFields(Promotion promotion, PromotionRequest request) {
        promotion.setTitle(request.getTitle());
        promotion.setDescription(request.getDescription());
        promotion.setEffectiveDate(request.getEffectiveDate());
        promotion.setExpirationDate(request.getExpirationDate());
        promotion.setPercentDiscount(request.getPercentDiscount());
        promotion.setMinValueToBeApplied(request.getMinValueToBeApplied());
        promotion.setStatus(request.getStatus()); // Update status from request
    }

    /**
     * Update promotion template if changed
     * Follows Single Responsibility - focused method for template update
     */
    private void updatePromotionTemplate(Promotion promotion, String newTemplateId) {
        if (!promotion.getTemplate().getId().equals(newTemplateId)) {
            PromotionTemplate newTemplate = findTemplateOrThrow(newTemplateId);
            promotion.setTemplate(newTemplate);
        }
    }

    /**
     * Check if order total meets minimum value requirement
     * Follows DRY principle - reusable validation logic
     */
    private boolean isMinValueMet(Promotion promotion, Double orderTotal) {
        return promotion.getMinValueToBeApplied() == null 
                || orderTotal >= promotion.getMinValueToBeApplied();
    }
}