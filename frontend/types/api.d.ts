/**
 * Generic API Response wrapper
 * Matches Backend's ApiResponse<T> structure
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * API Error structure
 */
export interface ApiError {
  code: number;
  message: string;
  details?: string;
}
