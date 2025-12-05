package com.utephonehub.backend.service.impl;

import com.utephonehub.backend.dto.request.user.ChangePasswordRequest;
import com.utephonehub.backend.dto.request.user.UpdateProfileRequest;
import com.utephonehub.backend.dto.response.user.UserResponse;
import com.utephonehub.backend.entity.User;
import com.utephonehub.backend.exception.BadRequestException;
import com.utephonehub.backend.exception.ResourceNotFoundException;
import com.utephonehub.backend.exception.UnauthorizedException;
import com.utephonehub.backend.mapper.UserMapper;
import com.utephonehub.backend.repository.UserRepository;
import com.utephonehub.backend.service.IUserService;
import com.utephonehub.backend.util.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    public UserResponse getUserById(Long userId) {
        log.info("Getting user with id: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        log.info("Updating profile for user id: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        user.setFullName(request.getFullName());
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }
        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(request.getDateOfBirth());
        }

        user = userRepository.save(user);
        log.info("Profile updated successfully for user id: {}", userId);

        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        log.info("Changing password for user id: {}", userId);

        // Validate input
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Mật khẩu và xác nhận mật khẩu không khớp");
        }

        if (!passwordEncoder.isValidPassword(request.getNewPassword())) {
            throw new BadRequestException("Mật khẩu phải ít nhất 8 ký tự, chứa chữ hoa, chữ thường và số");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Mật khẩu hiện tại không chính xác");
        }

        // Update password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed successfully for user id: {}", userId);
    }
}
