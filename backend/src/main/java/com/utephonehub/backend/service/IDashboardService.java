package com.utephonehub.backend.service;

import com.utephonehub.backend.dto.response.dashboard.DashboardOverviewResponse;
import com.utephonehub.backend.dto.response.dashboard.RevenueChartResponse;
import com.utephonehub.backend.enums.DashboardPeriod;

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
    
    /**
     * Get revenue chart data by time period
     * - Daily revenue for selected period
     * - Total and average revenue
     * 
     * @param period Time period (SEVEN_DAYS, THIRTY_DAYS, THREE_MONTHS)
     * @return RevenueChartResponse with labels, values, total, average
     */
    RevenueChartResponse getRevenueChart(DashboardPeriod period);
}
