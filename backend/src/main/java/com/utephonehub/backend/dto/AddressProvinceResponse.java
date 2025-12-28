package com.utephonehub.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO đại diện cho tỉnh/thành phố từ OpenAPI Vietnam Provinces
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressProvinceResponse {
    
    @JsonProperty("code")
    private Integer code;
    
    @JsonProperty("name")
    private String name;
    
    @JsonProperty("codename")
    private String codename;
    
    @JsonProperty("division_type")
    private String divisionType;
    
    @JsonProperty("phone_code")
    private Integer phoneCode;
}
