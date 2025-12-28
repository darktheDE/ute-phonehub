package com.utephonehub.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing API version information
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressVersionResponse {
    
    @JsonProperty("version")
    private String version;
    
    @JsonProperty("date")
    private String date;
}
