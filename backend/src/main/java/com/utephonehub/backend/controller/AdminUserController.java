package com.utephonehub.backend.controller;

import com.utephonehub.backend.dto.ApiResponse;
import com.utephonehub.backend.dto.response.user.PagedUserResponse;
import com.utephonehub.backend.dto.response.user.UserResponse;
import com.utephonehub.backend.enums.UserRole;
import com.utephonehub.backend.enums.UserStatus;
import com.utephonehub.backend.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin - User Management", description = "API quản lý người dùng dành cho Admin")
@SecurityRequirement(name = "Bearer Authentication")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final IUserService userService;

    @GetMapping
    @Operation(
            summary = "Lấy danh sách người dùng",
            description = "Lấy danh sách tất cả người dùng với phân trang, lọc theo role/status và tìm kiếm theo username/email/fullName"
    )
    public ResponseEntity<ApiResponse<PagedUserResponse>> getAllUsers(
            @Parameter(description = "Số trang (bắt đầu từ 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Số lượng bản ghi mỗi trang", example = "10")
            @RequestParam(defaultValue = "10") int size,

            @Parameter(description = "Lọc theo vai trò (ADMIN, CUSTOMER, hoặc để trống để lấy tất cả)")
            @RequestParam(required = false) UserRole role,

            @Parameter(description = "Lọc theo trạng thái (ACTIVE, LOCKED, hoặc để trống để lấy tất cả)")
            @RequestParam(required = false) UserStatus status,

            @Parameter(description = "Từ khóa tìm kiếm (tìm trong username, email, fullName)")
            @RequestParam(required = false) String search
    ) {
        log.info("Admin get all users - page: {}, size: {}, role: {}, status: {}, search: {}",
                page, size, role, status, search);

        PagedUserResponse response = userService.getAllUsers(page, size, role, status, search);

        return ResponseEntity.ok(ApiResponse.success(
                "Lấy danh sách người dùng thành công",
                response
        ));
    }

    @GetMapping("/{userId}")
    @Operation(
            summary = "Lấy chi tiết người dùng",
            description = "Lấy thông tin chi tiết của một người dùng cụ thể theo ID"
    )
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @Parameter(description = "ID của người dùng", example = "1", required = true)
            @PathVariable Long userId
    ) {
        log.info("Admin get user detail - userId: {}", userId);

        UserResponse user = userService.getUserById(userId);

        return ResponseEntity.ok(ApiResponse.success(
                "Lấy thông tin người dùng thành công",
                user
        ));
    }

    @PutMapping("/{userId}/lock")
    @Operation(
            summary = "Khóa tài khoản người dùng",
            description = "Khóa tài khoản CUSTOMER. Không thể khóa tài khoản ADMIN."
    )
    public ResponseEntity<ApiResponse<UserResponse>> lockUser(
            @Parameter(description = "ID của người dùng cần khóa", example = "1", required = true)
            @PathVariable Long userId
    ) {
        log.info("Admin lock user - userId: {}", userId);

        UserResponse user = userService.lockUser(userId);

        return ResponseEntity.ok(ApiResponse.success(
                "Tài khoản đã được khóa thành công",
                user
        ));
    }
}
