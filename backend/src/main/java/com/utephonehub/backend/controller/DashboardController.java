package com.utephonehub.backend.controller;

import com.utephonehub.backend.dto.ApiResponse;
import com.utephonehub.backend.dto.response.dashboard.DashboardOverviewResponse;
import com.utephonehub.backend.dto.response.dashboard.RevenueChartResponse;
import com.utephonehub.backend.enums.DashboardPeriod;
import com.utephonehub.backend.service.IDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin - Dashboard", description = "API thống kê và báo cáo cho Admin Dashboard")
@SecurityRequirement(name = "Bearer Authentication")
@PreAuthorize("hasRole('ADMIN')")
public class DashboardController {

    private final IDashboardService dashboardService;

    @GetMapping("/overview")
    @Operation(
            summary = "Lấy thống kê tổng quan",
            description = "Lấy 4 chỉ số chính: Tổng doanh thu (từ đơn hoàn thành), Tổng đơn hàng, Tổng sản phẩm, Tổng người dùng"
    )
    public ResponseEntity<ApiResponse<DashboardOverviewResponse>> getOverview() {
        log.info("Admin fetch dashboard overview");

        DashboardOverviewResponse overview = dashboardService.getOverview();

        return ResponseEntity.ok(ApiResponse.success(
                "Lấy thống kê tổng quan thành công",
                overview
        ));
    }

    @GetMapping("/revenue-chart")
    @Operation(
            summary = "Lấy biểu đồ doanh thu theo thời gian",
            description = "Lấy dữ liệu biểu đồ doanh thu theo ngày cho khoảng thời gian được chọn. Mặc định: 30 ngày. Chỉ tính đơn hàng đã hoàn thành (DELIVERED)"
    )
    public ResponseEntity<ApiResponse<RevenueChartResponse>> getRevenueChart(
            @Parameter(description = "Khoảng thời gian (SEVEN_DAYS, THIRTY_DAYS, THREE_MONTHS). Mặc định: THIRTY_DAYS")
            @RequestParam(defaultValue = "THIRTY_DAYS") DashboardPeriod period
    ) {
        log.info("Admin fetch revenue chart for period: {}", period);

        RevenueChartResponse revenueChart = dashboardService.getRevenueChart(period);

        return ResponseEntity.ok(ApiResponse.success(
                "Lấy dữ liệu biểu đồ doanh thu thành công",
                revenueChart
        ));
    }
}
