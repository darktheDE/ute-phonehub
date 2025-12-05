package com.utephonehub.backend.service;

import com.utephonehub.backend.dto.response.dashboard.DashboardOverviewResponse;

/**
 * Interface for Dashboard Service operations
 */
public interface IDashboardService {

    /**
     * Get dashboard overview statistics
     * - Total revenue (from completed orders)
     * - Total orders count
     * - Total products count
     * - Total users count
     * 
     * @return DashboardOverviewResponse with all statistics
     */
    DashboardOverviewResponse getOverview();
}
