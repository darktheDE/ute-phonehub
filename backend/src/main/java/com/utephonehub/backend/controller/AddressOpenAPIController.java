package com.utephonehub.backend.controller;

import com.utephonehub.backend.dto.AddressProvinceResponse;
import com.utephonehub.backend.dto.AddressWardResponse;
import com.utephonehub.backend.service.AddressOpenAPIService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * API địa chỉ hành chính Việt Nam từ OpenAPI Vietnam Provinces
 * Cung cấp các endpoint để lấy thông tin tỉnh/thành phố, phường/xã
 */
@RestController
@RequestMapping("/api/v1/locations")
@RequiredArgsConstructor
@Tag(name = "Location", description = "API địa chỉ hành chính Việt Nam")
public class AddressOpenAPIController {
    
    private final AddressOpenAPIService addressOpenAPIService;
    
    /**
     * Liệt kê toàn bộ cấp hành chính (tỉnh/thành, quận/huyện, phường/xã) theo độ sâu
     */
    @GetMapping("/divisions")
    @Operation(summary = "Liệt kê toàn bộ cấp hành chính", 
               description = "Lấy danh sách tất cả tỉnh/thành, quận/huyện, phường/xã theo độ sâu")
    public ResponseEntity<List<AddressProvinceResponse>> listAllDivisions(
            @Parameter(description = "Độ sâu (1=tỉnh, 2=tỉnh+quận, 3=tỉnh+quận+phường)")
            @RequestParam(name = "depth", required = false) Integer depth) {
        return ResponseEntity.ok(addressOpenAPIService.listAllDivisions(depth));
    }
    
    /**
     * Lấy danh sách tất cả tỉnh/thành phố
     */
    @GetMapping("/provinces")
    @Operation(summary = "Lấy danh sách tỉnh/thành phố", 
               description = "Lấy danh sách tất cả tỉnh/thành phố Việt Nam")
    public ResponseEntity<List<AddressProvinceResponse>> listProvinces() {
        return ResponseEntity.ok(addressOpenAPIService.listProvinces());
    }
    
    /**
     * Lấy chi tiết một tỉnh/thành phố theo mã
     */
    @GetMapping("/provinces/{code}")
    @Operation(summary = "Lấy chi tiết tỉnh/thành phố", 
               description = "Lấy thông tin chi tiết của một tỉnh/thành phố")
    public ResponseEntity<?> getProvinceByCode(
            @Parameter(description = "Mã tỉnh/thành phố")
            @PathVariable Integer code) {
        return addressOpenAPIService.getProvinceByCode(code)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    /**
     * Lấy danh sách phường/xã
     */
    @GetMapping("/wards")
    @Operation(summary = "Lấy danh sách phường/xã", 
               description = "Lấy danh sách tất cả phường/xã Việt Nam")
    public ResponseEntity<List<AddressWardResponse>> listWards() {
        return ResponseEntity.ok(addressOpenAPIService.listWards());
    }
    
    /**
     * Lấy chi tiết một phường/xã theo mã
     */
    @GetMapping("/wards/{code}")
    @Operation(summary = "Lấy chi tiết phường/xã", 
               description = "Lấy thông tin chi tiết của một phường/xã")
    public ResponseEntity<?> getWardByCode(
            @Parameter(description = "Mã phường/xã")
            @PathVariable Integer code) {
        return addressOpenAPIService.getWardByCode(code)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
