package com.utephonehub.backend.controller;

import com.utephonehub.backend.dto.ApiResponse;
import com.utephonehub.backend.dto.request.PromotionRequest;
import com.utephonehub.backend.dto.response.PromotionResponse;
import com.utephonehub.backend.service.PromotionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Promotion Controller", description = "Quản lý Khuyến mãi & Voucher (M09)")
public class PromotionController {

    private final PromotionService promotionService;

    // ==========================================
    // ACTOR: ADMINISTRATOR (Path: /api/v1/admin/promotions)
    // ==========================================

    @PostMapping("/admin/promotions")
    @Operation(summary = "[Admin] Create Promotion - Tạo khuyến mãi mới")
    public ResponseEntity<ApiResponse<PromotionResponse>> createPromotion(@RequestBody @Valid PromotionRequest request) {
        PromotionResponse response = promotionService.createPromotion(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<PromotionResponse>builder()
                        .code(201).message("Created successfully").data(response).build()
        );
    }

    @PutMapping("/admin/promotions/{id}")
    @Operation(summary = "[Admin] Modify Promotion - Chỉnh sửa khuyến mãi")
    public ResponseEntity<ApiResponse<PromotionResponse>> modifyPromotion(
            @PathVariable String id,
            @RequestBody @Valid PromotionRequest request) {
        PromotionResponse response = promotionService.modifyPromotion(id, request);
        return ResponseEntity.ok(ApiResponse.<PromotionResponse>builder()
                .code(200).message("Modified successfully").data(response).build());
    }

    @PatchMapping("/admin/promotions/{id}/disable")
    @Operation(summary = "[Admin] Disable Promotion - Vô hiệu hóa khuyến mãi")
    public ResponseEntity<ApiResponse<Void>> disablePromotion(@PathVariable String id) {
        promotionService.disable(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200).message("Disabled successfully").build());
    }

    @GetMapping("/admin/promotions/{id}")
    @Operation(summary = "[Admin] See Promotion Detail - Xem chi tiết")
    public ResponseEntity<ApiResponse<PromotionResponse>> getDetails(@PathVariable String id) {
        PromotionResponse response = promotionService.getDetails(id);
        return ResponseEntity.ok(ApiResponse.<PromotionResponse>builder()
                .code(200).message("Success").data(response).build());
    }

    @GetMapping("/admin/promotions")
    @Operation(summary = "[Admin] Get All - Xem danh sách tất cả khuyến mãi")
    public ResponseEntity<ApiResponse<List<PromotionResponse>>> getAllPromotions() {
        List<PromotionResponse> response = promotionService.getAllPromotions();
        return ResponseEntity.ok(ApiResponse.<List<PromotionResponse>>builder()
                .code(200).message("Success").data(response).build());
    }

    // ==========================================
    // ACTOR: CUSTOMER (Path: /api/v1/promotions)
    // ==========================================

    @GetMapping("/promotions/available")
    @Operation(summary = "[Customer] Check & Get Available - Lấy DS khuyến mãi hợp lệ")
    public ResponseEntity<ApiResponse<List<PromotionResponse>>> checkAndGetAvailablePromotions(
            @RequestParam(defaultValue = "0") Double orderTotal) {
        List<PromotionResponse> response = promotionService.checkAndGetAvailablePromotions(orderTotal);
        return ResponseEntity.ok(ApiResponse.<List<PromotionResponse>>builder()
                .code(200).message("Success").data(response).build());
    }

    @GetMapping("/promotions/calculate")
    @Operation(summary = "[Customer] Apply Promotion - Tính toán tiền giảm giá")
    public ResponseEntity<ApiResponse<Double>> calculateDiscount(
            @RequestParam String promotionId,
            @RequestParam Double orderTotal) {
        Double discountAmount = promotionService.calculateDiscount(promotionId, orderTotal);
        return ResponseEntity.ok(ApiResponse.<Double>builder()
                .code(200).message("Success").data(discountAmount).build());
    }
}