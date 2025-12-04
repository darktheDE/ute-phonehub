package com.utephonehub.backend.service.impl;

import com.utephonehub.backend.dto.request.user.ChangePasswordRequest;
import com.utephonehub.backend.dto.request.user.UpdateProfileRequest;
import com.utephonehub.backend.dto.response.user.PagedUserResponse;
import com.utephonehub.backend.dto.response.user.UserResponse;
import com.utephonehub.backend.entity.User;
import com.utephonehub.backend.enums.UserRole;
import com.utephonehub.backend.enums.UserStatus;
import com.utephonehub.backend.exception.BadRequestException;
import com.utephonehub.backend.exception.ResourceNotFoundException;
import com.utephonehub.backend.exception.UnauthorizedException;
import com.utephonehub.backend.mapper.UserMapper;
import com.utephonehub.backend.repository.UserRepository;
import com.utephonehub.backend.repository.UserSpecification;
import com.utephonehub.backend.service.IUserService;
import com.utephonehub.backend.util.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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

    @Override
    public PagedUserResponse getAllUsers(int page, int size, UserRole role, UserStatus status, String search) {
        log.info("Getting all users - page: {}, size: {}, role: {}, status: {}, search: {}",
                page, size, role, status, search);

        // Create pageable with sorting by createdAt descending (newest first)
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // Build specification for dynamic filtering
        Specification<User> spec = UserSpecification.filterUsers(role, status, search);

        // Fetch data from repository
        Page<User> userPage = userRepository.findAll(spec, pageable);

        // Convert entities to DTOs
        List<UserResponse> userResponses = userPage.getContent().stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());

        // Build paged response
        PagedUserResponse response = PagedUserResponse.builder()
                .content(userResponses)
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .currentPage(userPage.getNumber())
                .pageSize(userPage.getSize())
                .build();

        log.info("Retrieved {} users out of {} total", userResponses.size(), userPage.getTotalElements());
        return response;
    }

    @Override
    @Transactional
    public UserResponse lockUser(Long userId) {
        log.info("Attempting to lock user with id: {}", userId);

        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        // Business Rule: Cannot lock ADMIN accounts
        if (user.getRole() == UserRole.ADMIN) {
            log.warn("Attempted to lock ADMIN account - userId: {}", userId);
            throw new BadRequestException("Không thể khóa tài khoản quản trị viên");
        }

        // Check if already locked
        if (user.getStatus() == UserStatus.LOCKED) {
            log.info("User is already locked - userId: {}", userId);
            throw new BadRequestException("Tài khoản đã bị khóa trước đó");
        }

        // Lock the account
        user.setStatus(UserStatus.LOCKED);
        user = userRepository.save(user);

        log.info("User account locked successfully - userId: {}", userId);
        return userMapper.toResponse(user);
    }
}
