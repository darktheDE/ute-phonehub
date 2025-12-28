package com.utephonehub.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing a Vietnamese district from OpenAPI Vietnam Provinces
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressDistrictResponse {
    
    @JsonProperty("code")
    private Integer code;
    
    @JsonProperty("name")
    private String name;
    
    @JsonProperty("codename")
    private String codename;
    
    @JsonProperty("division_type")
    private String divisionType;
    
    @JsonProperty("province_code")
    private Integer provinceCode;
}
