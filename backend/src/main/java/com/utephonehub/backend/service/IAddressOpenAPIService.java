package com.utephonehub.backend.service;

import com.utephonehub.backend.dto.AddressProvinceResponse;
import com.utephonehub.backend.dto.AddressWardResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * Service tích hợp OpenAPI Vietnam Provinces v2
 * Cung cấp các phương thức để lấy thông tin tỉnh/thành phố, phường/xã
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class IAddressOpenAPIService {
    
    private static final String BASE_URL = "https://provinces.open-api.vn/api/v2";
    private final RestTemplate restTemplate;
    
    /**
     * Liệt kê toàn bộ cấp hành chính (tỉnh/thành, quận/huyện, phường/xã)
     */
    public List<AddressProvinceResponse> listAllDivisions(Integer depth) {
        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/p");
            if (depth != null) {
                builder.queryParam("depth", depth);
            }
            String url = builder.toUriString();
            AddressProvinceResponse[] provinces = restTemplate.getForObject(url, AddressProvinceResponse[].class);
            return provinces != null ? Arrays.asList(provinces) : List.of();
        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách cấp hành chính từ OpenAPI", e);
            return List.of();
        }
    }
    
    /**
     * Lấy danh sách tất cả tỉnh/thành phố
     */
    public List<AddressProvinceResponse> listProvinces() {
        try {
            String url = BASE_URL + "/p";
            AddressProvinceResponse[] provinces = restTemplate.getForObject(url, AddressProvinceResponse[].class);
            return provinces != null ? Arrays.asList(provinces) : List.of();
        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách tỉnh/thành phố từ OpenAPI", e);
            return List.of();
        }
    }
    
    /**
     * Lấy chi tiết một tỉnh/thành phố theo mã
     */
    public Optional<AddressProvinceResponse> getProvinceByCode(Integer code) {
        try {
            String url = BASE_URL + "/p/" + code;
            AddressProvinceResponse province = restTemplate.getForObject(url, AddressProvinceResponse.class);
            return Optional.ofNullable(province);
        } catch (Exception e) {
            log.error("Lỗi khi lấy tỉnh/thành phố {} từ OpenAPI", code, e);
            return Optional.empty();
        }
    }
    
    /**
     * Lấy danh sách phường/xã
     */
    public List<AddressWardResponse> listWards() {
        try {
            String url = BASE_URL + "/w";
            AddressWardResponse[] wards = restTemplate.getForObject(url, AddressWardResponse[].class);
            return wards != null ? Arrays.asList(wards) : List.of();
        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách phường/xã từ OpenAPI", e);
            return List.of();
        }
    }
    
    /**
     * Lấy chi tiết một phường/xã theo mã
     */
    public Optional<AddressWardResponse> getWardByCode(Integer code) {
        try {
            String url = BASE_URL + "/w/" + code;
            AddressWardResponse ward = restTemplate.getForObject(url, AddressWardResponse.class);
            return Optional.ofNullable(ward);
        } catch (Exception e) {
            log.error("Lỗi khi lấy phường/xã {} từ OpenAPI", code, e);
            return Optional.empty();
        }
    }
}
