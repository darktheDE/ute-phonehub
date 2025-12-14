package com.utephonehub.backend.service.impl;

import com.utephonehub.backend.dto.request.PromotionRequest;
import com.utephonehub.backend.dto.response.PromotionResponse;
import com.utephonehub.backend.entity.Promotion;
import com.utephonehub.backend.entity.PromotionTarget;
import com.utephonehub.backend.entity.PromotionTemplate;
import com.utephonehub.backend.entity.Product;
import com.utephonehub.backend.enums.EPromotionStatus;
import com.utephonehub.backend.enums.EPromotionTargetType;
import com.utephonehub.backend.repository.PromotionRepository;
import com.utephonehub.backend.repository.PromotionTargetRepository;
import com.utephonehub.backend.repository.PromotionTemplateRepository;
import com.utephonehub.backend.repository.ProductRepository;
import com.utephonehub.backend.service.IPromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionServiceImpl implements IPromotionService {

    private final PromotionRepository promotionRepository;
    private final PromotionTemplateRepository templateRepository;
    private final PromotionTargetRepository targetRepository;
    private final ProductRepository productRepository;

    // --- 1. CREATE PROMOTION ---
    @Override
    @Transactional
    public PromotionResponse createPromotion(PromotionRequest request) {
        PromotionTemplate template = templateRepository.findById(request.getTemplateId())
                .orElseThrow(() -> new RuntimeException("Template not found"));

        Promotion promotion = Promotion.builder()
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

        Promotion savedPromotion = promotionRepository.save(promotion);
        saveTargets(savedPromotion, request.getTargets());

        return mapToResponse(savedPromotion);
    }

    // --- 2. MODIFY PROMOTION ---
    @Override
    @Transactional
    public PromotionResponse modifyPromotion(String id, PromotionRequest request) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));

        promotion.setTitle(request.getTitle());
        promotion.setDescription(request.getDescription());
        promotion.setEffectiveDate(request.getEffectiveDate());
        promotion.setExpirationDate(request.getExpirationDate());
        promotion.setPercentDiscount(request.getPercentDiscount());
        promotion.setMinValueToBeApplied(request.getMinValueToBeApplied());

        // Logic đổi Template nếu cần
        if (!promotion.getTemplate().getId().equals(request.getTemplateId())) {
            PromotionTemplate newTemplate = templateRepository.findById(request.getTemplateId())
                    .orElseThrow(() -> new RuntimeException("Template not found"));
            promotion.setTemplate(newTemplate);
        }

        if (promotion.getTargets() != null) {
            promotion.getTargets().clear();
        }
        saveTargets(promotion, request.getTargets());

        Promotion updatedPromotion = promotionRepository.save(promotion);
        return mapToResponse(updatedPromotion);
    }

    // --- 3. DISABLE PROMOTION ---
    @Override
    public void disable(String id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));

        promotion.setStatus(EPromotionStatus.INACTIVE);
        promotionRepository.save(promotion);
    }

    // --- 4. GET DETAILS ---
    @Override
    public PromotionResponse getDetails(String id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        return mapToResponse(promotion);
    }

    // --- 5. GET ALL PROMOTIONS ---
    @Override
    public List<PromotionResponse> getAllPromotions() {
        List<Promotion> promotions = promotionRepository.findAll();
        return promotions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // --- 6. CHECK AVAILABLE ---
    @Override
    public List<PromotionResponse> checkAndGetAvailablePromotions(Double orderTotal) {
        LocalDateTime now = LocalDateTime.now();

        // Lấy các khuyến mãi còn hạn
        List<Promotion> campaigns = promotionRepository.findByEffectiveDateBeforeAndExpirationDateAfter(now, now);

        return campaigns.stream()
                .filter(p -> p.getStatus() == EPromotionStatus.ACTIVE)
                .filter(p -> {
                    // Check Min Value nếu có
                    if (p.getMinValueToBeApplied() != null && orderTotal < p.getMinValueToBeApplied()) {
                        return false;
                    }
                    return true;
                })
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // --- 7. CALCULATE ---
    @Override
    public Double calculateDiscount(String promotionId, Double orderTotal) {
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));

        // Validate cơ bản
        if (promotion.getStatus() != EPromotionStatus.ACTIVE) {
            throw new RuntimeException("Promotion is inactive");
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(promotion.getEffectiveDate()) || now.isAfter(promotion.getExpirationDate())) {
            throw new RuntimeException("Promotion is expired");
        }

        if (promotion.getMinValueToBeApplied() != null && orderTotal < promotion.getMinValueToBeApplied()) {
            throw new RuntimeException("Order total is not enough");
        }

        // Logic tính toán: Chỉ dựa trên Percent Discount
        if (promotion.getPercentDiscount() != null) {
            return orderTotal * (promotion.getPercentDiscount() / 100.0);
        }

        return 0.0;
    }

    // --- Helper Methods ---
    private void saveTargets(Promotion promotion, List<PromotionRequest.TargetRequest> targetRequests) {
        if (targetRequests != null && !targetRequests.isEmpty()) {
            List<PromotionTarget> targets = targetRequests.stream().map(t -> {
                return PromotionTarget.builder()
                        .applicableObjectId(t.getApplicableObjectId())
                        .type(t.getType())
                        .promotion(promotion)
                        .build();
            }).collect(Collectors.toList());

            if (promotion.getTargets() == null) {
                promotion.setTargets(new ArrayList<>());
            }
            promotion.getTargets().addAll(targets);
        }
    }

    private PromotionResponse mapToResponse(Promotion p) {
        List<PromotionResponse.TargetResponse> targetResponses = new ArrayList<>();
        if (p.getTargets() != null) {
            targetResponses = p.getTargets().stream().map(t -> PromotionResponse.TargetResponse.builder()
                    .id(t.getId())
                    .applicableObjectId(t.getApplicableObjectId())
                    .type(t.getType())
                    .build()).collect(Collectors.toList());
        }

        return PromotionResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .description(p.getDescription())
                .effectiveDate(p.getEffectiveDate())
                .expirationDate(p.getExpirationDate())
                .percentDiscount(p.getPercentDiscount())
                .minValueToBeApplied(p.getMinValueToBeApplied())
                .status(p.getStatus())
                .templateId(p.getTemplate().getId())
                .templateCode(p.getTemplate().getCode())
                .templateType(p.getTemplate().getType())
                .targets(targetResponses)
                .build();
    }

    /**
     * Kiểm tra xem promotion có áp dụng được cho danh sách sản phẩm trong đơn hàng không
     * @param promotion Promotion cần kiểm tra
     * @param productIds Danh sách ID sản phẩm trong đơn hàng
     * @return true nếu promotion áp dụng được cho ít nhất 1 sản phẩm
     */
    private boolean isPromotionApplicableToProducts(Promotion promotion, List<Long> productIds) {
        List<PromotionTarget> targets = promotion.getTargets();

        // Nếu không có target hoặc danh sách rỗng = áp dụng cho tất cả
        if (targets == null || targets.isEmpty()) {
            return true;
        }

        for (PromotionTarget target : targets) {
            switch (target.getType()) {
                case WHOLE:
                    // Áp dụng cho toàn bộ đơn hàng
                    return true;

                case PRODUCT:
                    // Kiểm tra xem có sản phẩm nào trong đơn hàng khớp với target không
                    if (productIds.contains(target.getApplicableObjectId())) {
                        return true;
                    }
                    break;

                case CATEGORY:
                case SUBCATEGORY:
                    // Lấy danh sách sản phẩm và check category
                    for (Long productId : productIds) {
                        Product product = productRepository.findById(productId).orElse(null);
                        if (product != null && product.getCategory() != null) {
                            // Check category trực tiếp
                            if (product.getCategory().getId().equals(target.getApplicableObjectId())) {
                                return true;
                            }
                            // Check parent category nếu type là SUBCATEGORY
                            if (target.getType() == EPromotionTargetType.SUBCATEGORY &&
                                product.getCategory().getParent() != null &&
                                product.getCategory().getParent().getId().equals(target.getApplicableObjectId())) {
                                return true;
                            }
                        }
                    }
                    break;
            }
        }

        return false;
    }

    /**
     * Kiểm tra xem promotion có áp dụng được cho một sản phẩm cụ thể không
     * @param promotion Promotion cần kiểm tra
     * @param productId ID sản phẩm
     * @return true nếu promotion áp dụng được
     */
    private boolean isPromotionApplicableToProduct(Promotion promotion, Long productId) {
        return isPromotionApplicableToProducts(promotion, List.of(productId));
    }
}