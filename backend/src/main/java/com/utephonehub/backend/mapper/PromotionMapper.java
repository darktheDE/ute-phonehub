package com.utephonehub.backend.mapper;

import com.utephonehub.backend.dto.response.PromotionResponse;
import com.utephonehub.backend.entity.Promotion;
import com.utephonehub.backend.entity.PromotionTarget;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting Promotion entities to DTOs
 * Follows Single Responsibility Principle (SRP) - only handles mapping
 * Follows DRY principle - centralized mapping logic
 */
@Component
public class PromotionMapper {

    /**
     * Map Promotion entity to PromotionResponse DTO
     * @param promotion Promotion entity
     * @return PromotionResponse DTO
     */
    public PromotionResponse toResponse(Promotion promotion) {
        if (promotion == null) {
            return null;
        }

        return PromotionResponse.builder()
                .id(promotion.getId())
                .title(promotion.getTitle())
                .description(promotion.getDescription())
                .effectiveDate(promotion.getEffectiveDate())
                .expirationDate(promotion.getExpirationDate())
                .percentDiscount(promotion.getPercentDiscount())
                .minValueToBeApplied(promotion.getMinValueToBeApplied())
                .status(promotion.getStatus())
                .templateId(promotion.getTemplate().getId())
                .templateCode(promotion.getTemplate().getCode())
                .templateType(promotion.getTemplate().getType())
                .targets(mapTargets(promotion.getTargets()))
                .build();
    }

    /**
     * Map list of Promotion entities to list of PromotionResponse DTOs
     * @param promotions List of Promotion entities
     * @return List of PromotionResponse DTOs
     */
    public List<PromotionResponse> toResponseList(List<Promotion> promotions) {
        if (promotions == null) {
            return new ArrayList<>();
        }

        return promotions.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Map PromotionTarget entities to TargetResponse DTOs
     */
    private List<PromotionResponse.TargetResponse> mapTargets(List<PromotionTarget> targets) {
        if (targets == null || targets.isEmpty()) {
            return new ArrayList<>();
        }

        return targets.stream()
                .map(this::mapTarget)
                .collect(Collectors.toList());
    }

    /**
     * Map single PromotionTarget to TargetResponse
     */
    private PromotionResponse.TargetResponse mapTarget(PromotionTarget target) {
        return PromotionResponse.TargetResponse.builder()
                .id(target.getId())
                .applicableObjectId(target.getApplicableObjectId())
                .type(target.getType())
                .build();
    }
}
