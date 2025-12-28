package com.utephonehub.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO đại diện cho phường/xã từ OpenAPI Vietnam Provinces
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressWardResponse {
    
    @JsonProperty("code")
    private Integer code;
    
    @JsonProperty("name")
    private String name;
    
    @JsonProperty("codename")
    private String codename;
    
    @JsonProperty("division_type")
    private String divisionType;
    
    @JsonProperty("district_code")
    private Integer districtCode;
}
