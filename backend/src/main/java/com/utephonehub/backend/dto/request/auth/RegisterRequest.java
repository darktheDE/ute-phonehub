package com.utephonehub.backend.dto.request.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    private String username;

    private String fullName;

    private String email;

    private String phoneNumber;

    private String password;

    private String confirmPassword;
}

