package com.utephonehub.backend.service;

import com.utephonehub.backend.dto.request.user.ChangePasswordRequest;
import com.utephonehub.backend.dto.request.user.UpdateProfileRequest;
import com.utephonehub.backend.dto.response.user.UserResponse;

/**
 * Interface for User Service operations
 */
public interface IUserService {
    
    /**
     * Get user by ID
     * @param userId User ID
     * @return UserResponse
     */
    UserResponse getUserById(Long userId);
    
    /**
     * Update user profile
     * @param userId User ID
     * @param request Update profile request
     * @return Updated UserResponse
     */
    UserResponse updateProfile(Long userId, UpdateProfileRequest request);
    
    /**
     * Change user password
     * @param userId User ID
     * @param request Change password request
     */
    void changePassword(Long userId, ChangePasswordRequest request);
}
