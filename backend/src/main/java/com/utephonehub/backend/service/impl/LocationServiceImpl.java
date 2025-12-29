package com.utephonehub.backend.service.impl;

import com.utephonehub.backend.dto.response.location.ProvinceResponse;
import com.utephonehub.backend.dto.response.location.WardResponse;
import com.utephonehub.backend.entity.Province;
import com.utephonehub.backend.entity.Ward;
import com.utephonehub.backend.exception.ResourceNotFoundException;
import com.utephonehub.backend.repository.ProvinceRepository;
import com.utephonehub.backend.repository.WardRepository;
import com.utephonehub.backend.service.ILocationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation của ILocationService
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class LocationServiceImpl implements ILocationService {

    private final ProvinceRepository provinceRepository;
    private final WardRepository wardRepository;

    @Override
    public List<ProvinceResponse> getAllProvinces() {
        log.info("Getting all provinces");
        List<Province> provinces = provinceRepository.findAllByOrderByNameAsc();
        return provinces.stream()
                .map(this::mapToProvinceResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProvinceResponse getProvinceByCode(String provinceCode) {
        log.info("Getting province by code: {}", provinceCode);
        Province province = provinceRepository.findByProvinceCode(provinceCode)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy tỉnh/thành phố với mã: " + provinceCode));
        return mapToProvinceResponse(province);
    }

    @Override
    public List<WardResponse> getAllWards() {
        log.info("Getting all wards");
        List<Ward> wards = wardRepository.findAllByOrderByNameAsc();
        return wards.stream()
                .map(this::mapToWardResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<WardResponse> getWardsByProvinceCode(String provinceCode) {
        log.info("Getting wards by province code: {}", provinceCode);
        
        // Kiểm tra tỉnh có tồn tại không
        if (!provinceRepository.existsByProvinceCode(provinceCode)) {
            throw new ResourceNotFoundException(
                    "Không tìm thấy tỉnh/thành phố với mã: " + provinceCode);
        }
        
        List<Ward> wards = wardRepository.findByProvinceCodeOrderByNameAsc(provinceCode);
        return wards.stream()
                .map(this::mapToWardResponse)
                .collect(Collectors.toList());
    }

    @Override
    public WardResponse getWardByCode(String wardCode) {
        log.info("Getting ward by code: {}", wardCode);
        Ward ward = wardRepository.findByWardCode(wardCode)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy phường/xã với mã: " + wardCode));
        return mapToWardResponse(ward);
    }

    @Override
    public boolean isValidProvinceCode(String provinceCode) {
        return provinceRepository.existsByProvinceCode(provinceCode);
    }

    @Override
    public boolean isValidWardCode(String wardCode) {
        return wardRepository.existsByWardCode(wardCode);
    }

    /**
     * Map Province entity sang ProvinceResponse DTO
     */
    private ProvinceResponse mapToProvinceResponse(Province province) {
        return ProvinceResponse.builder()
                .id(province.getId())
                .provinceCode(province.getProvinceCode())
                .name(province.getName())
                .placeType(province.getPlaceType())
                .country(province.getCountry())
                .build();
    }

    /**
     * Map Ward entity sang WardResponse DTO
     */
    private WardResponse mapToWardResponse(Ward ward) {
        return WardResponse.builder()
                .id(ward.getId())
                .wardCode(ward.getWardCode())
                .name(ward.getName())
                .provinceCode(ward.getProvinceCode())
                .build();
    }
}
