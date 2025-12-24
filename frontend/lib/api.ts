// API Configuration and utility functions
import type {
  ApiResponse,
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  Product,
  ProductResponse,
  Order,
  OrderResponse,
  RecentOrderResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  DashboardOverviewResponse,
  TopProductResponse,
  // Category imports
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  // Brand imports
  BrandResponse,
  CreateBrandRequest,
  UpdateBrandRequest,
  // New Dashboard imports
  DashboardOverview,
  RevenueChartData,
  OrderStatusChartData,
  UserRegistrationChartData,
  TopProduct,
  RecentOrder,
  LowStockProduct,
  DashboardPeriod,
  RegistrationPeriod,
  // Payment imports
  PaymentResponse,
  VNPayPaymentResponse,
  CreatePaymentRequest,
  PaymentHistoryResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

// Helper function to get auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

// Helper function to set auth tokens
export const setAuthTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
};

// Helper function to clear auth tokens
export const clearAuthTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

// Helper function to get stored user
export const getStoredUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// Helper function to set stored user
export const setStoredUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Try to parse JSON, but handle cases where response might not be JSON
    let data: any;
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    
    if (isJson) {
      try {
        data = await response.json();
      } catch (parseError) {
        // If JSON parsing fails, use empty object
        data = {};
      }
    } else {
      // If not JSON, try to get text
      try {
        const text = await response.text();
        data = text ? { message: text } : {};
      } catch {
        data = {};
      }
    }

    // Check if response is not OK (400, 500, etc.)
    if (!response.ok) {
      // Log more details for debugging
      console.error('API Error Details:', {
        url,
        status: response.status,
        statusText: response.statusText,
        data,
      });
      
      const errorMessage = data?.message || data?.error || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    // If response is OK, wrap data in standard format if not already wrapped
    if (data && typeof data === 'object' && !('success' in data)) {
      return { success: true, data };
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth API endpoints
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return fetchAPI<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    return fetchAPI<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<null>> => {
    return fetchAPI<null>('/auth/forgot-password/request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<ApiResponse<null>> => {
    return fetchAPI<null>('/auth/forgot-password/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: async (): Promise<ApiResponse<null>> => {
    return fetchAPI<null>('/auth/logout', {
      method: 'POST',
    });
  },

  refresh: async (refreshToken: string): Promise<ApiResponse<LoginResponse>> => {
    return fetchAPI<LoginResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },
};

// User API endpoints
export const userAPI = {
  getMe: async (): Promise<ApiResponse<User>> => {
    return fetchAPI<User>('/user/me', {
      method: 'GET',
    });
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    return fetchAPI<User>('/user/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<null>> => {
    return fetchAPI<null>('/user/password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Health check
export const healthCheck = async (): Promise<ApiResponse<any>> => {
  return fetchAPI<any>('/health', {
    method: 'GET',
  });
};

// Product API endpoints
// Note: Public product endpoints don't exist yet, so using mock data in components
// Only keeping admin endpoints that exist
export const productAPI = {
  // Get low stock products (for admin dashboard)
  // This endpoint exists: GET /api/v1/admin/dashboard/low-stock-products
  getLowStockProducts: async (threshold: number = 20): Promise<ApiResponse<any[]>> => {
    return fetchAPI<any[]>(`/admin/dashboard/low-stock-products?threshold=${threshold}`, {
      method: 'GET',
    });
  },
};

// Order API endpoints
export const orderAPI = {
  /**
   * POST /api/v1/orders
   * Tạo đơn hàng mới
   */
  createOrder: async (data: CreateOrderRequest): Promise<ApiResponse<CreateOrderResponse>> => {
    return fetchAPI<CreateOrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get order by ID
  getById: async (orderId: number): Promise<ApiResponse<OrderResponse>> => {
    return fetchAPI<OrderResponse>(`/orders/${orderId}`, {
      method: 'GET',
    });
  },

  // Get user's orders (for customer)
  // Note: Endpoint GET /api/v1/orders (list) doesn't exist
  // Components will use mock data instead

  // Get recent orders (for admin dashboard)
  // This endpoint exists: GET /api/v1/admin/dashboard/recent-orders?limit={limit}
  getRecentOrders: async (limit: number = 10): Promise<ApiResponse<RecentOrderResponse[]>> => {
    return fetchAPI<RecentOrderResponse[]>(`/admin/dashboard/recent-orders?limit=${limit}`, {
      method: 'GET',
    });
  },
};

// Admin API endpoints
export const adminAPI = {
  // Users
  getAllUsers: async (params?: {
    page?: number;
    size?: number;
    role?: string;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<any>> => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    
    const query = queryParams.toString();
    return fetchAPI<any>(`/admin/users${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },

  // Dashboard
  getDashboardOverview: async (): Promise<ApiResponse<DashboardOverviewResponse>> => {
    return fetchAPI<DashboardOverviewResponse>('/admin/dashboard/overview', {
      method: 'GET',
    });
  },

  // Products (admin management)
  // Note: Using low-stock-products endpoint as fallback since ProductController doesn't exist
  // TODO: Backend needs to add ProductController with GET /api/v1/admin/products endpoint
  getAllProducts: async (params?: {
    page?: number;
    size?: number;
    categoryId?: number;
    brandId?: number;
    search?: string;
  }): Promise<ApiResponse<any>> => {
    // For now, use low-stock-products endpoint as a workaround
    // This will return products but only low stock ones
    return fetchAPI<any>('/admin/dashboard/low-stock-products?threshold=1000', {
      method: 'GET',
    });
  },

  // Categories (admin management)
  // Note: GET endpoint is public (/api/v1/categories) - dùng chung cho client và admin
  getAllCategories: async (parentId?: number | null): Promise<ApiResponse<CategoryResponse[]>> => {
    const query = (parentId !== null && parentId !== undefined && Number.isInteger(parentId) && parentId > 0)
      ? `?parentId=${parentId}`
      : '';
    return fetchAPI<CategoryResponse[]>(`/categories${query}`, {
      method: 'GET',
    });
  },

  createCategory: async (data: CreateCategoryRequest): Promise<ApiResponse<CategoryResponse>> => {
    return fetchAPI<CategoryResponse>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCategory: async (id: number, data: UpdateCategoryRequest): Promise<ApiResponse<CategoryResponse>> => {
    return fetchAPI<CategoryResponse>(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteCategory: async (id: number): Promise<ApiResponse<null>> => {
    return fetchAPI<null>(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Brands (admin management)
  // Note: GET endpoint is public (/api/v1/brands) - dùng chung cho client và admin
  getAllBrands: async (): Promise<ApiResponse<BrandResponse[]>> => {
    return fetchAPI<BrandResponse[]>('/brands', {
      method: 'GET',
    });
  },

  createBrand: async (data: CreateBrandRequest): Promise<ApiResponse<BrandResponse>> => {
    return fetchAPI<BrandResponse>('/admin/brands', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateBrand: async (id: number, data: UpdateBrandRequest): Promise<ApiResponse<BrandResponse>> => {
    return fetchAPI<BrandResponse>(`/admin/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteBrand: async (id: number): Promise<ApiResponse<null>> => {
    return fetchAPI<null>(`/admin/brands/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== DASHBOARD API ====================
// Module M10.2 - View Dashboard
// Comprehensive Dashboard endpoints for admin analytics
export const dashboardAPI = {
  /**
   * GET /api/v1/admin/dashboard/overview
   * Lấy 4 chỉ số tổng quan: Tổng doanh thu, Tổng đơn hàng, Tổng sản phẩm, Tổng người dùng
   */
  getOverview: async (): Promise<ApiResponse<DashboardOverview>> => {
    return fetchAPI<DashboardOverview>('/admin/dashboard/overview', {
      method: 'GET',
    });
  },

  /**
   * GET /api/v1/admin/dashboard/revenue-chart?period=THIRTY_DAYS
   * Lấy dữ liệu biểu đồ doanh thu theo khoảng thời gian
   * @param period - 'SEVEN_DAYS' | 'THIRTY_DAYS' | 'THREE_MONTHS'
   */
  getRevenueChart: async (period: DashboardPeriod = 'THIRTY_DAYS'): Promise<ApiResponse<RevenueChartData>> => {
    return fetchAPI<RevenueChartData>(`/admin/dashboard/revenue-chart?period=${period}`, {
      method: 'GET',
    });
  },

  /**
   * GET /api/v1/admin/dashboard/order-status-chart
   * Lấy dữ liệu biểu đồ tròn về trạng thái đơn hàng
   * Trả về labels, values, percentages, totalOrders
   */
  getOrderStatusChart: async (): Promise<ApiResponse<OrderStatusChartData>> => {
    return fetchAPI<OrderStatusChartData>('/admin/dashboard/order-status-chart', {
      method: 'GET',
    });
  },

  /**
   * GET /api/v1/admin/dashboard/user-registration-chart?period=MONTHLY
   * Lấy dữ liệu biểu đồ cột về người dùng đăng ký mới
   * @param period - 'WEEKLY' | 'MONTHLY'
   */
  getUserRegistrationChart: async (period: RegistrationPeriod = 'WEEKLY'): Promise<ApiResponse<UserRegistrationChartData>> => {
    return fetchAPI<UserRegistrationChartData>(`/admin/dashboard/user-registration-chart?period=${period}`, {
      method: 'GET',
    });
  },

  /**
   * GET /api/v1/admin/dashboard/top-products?limit=5
   * Lấy danh sách Top sản phẩm bán chạy nhất
   * @param limit - Số lượng sản phẩm cần lấy (mặc định: 5)
   */
  getTopProducts: async (limit: number = 5): Promise<ApiResponse<TopProduct[]>> => {
    return fetchAPI<TopProduct[]>(`/admin/dashboard/top-products?limit=${limit}`, {
      method: 'GET',
    });
  },

  /**
   * GET /api/v1/admin/dashboard/recent-orders?limit=10
   * Lấy danh sách đơn hàng gần đây
   * @param limit - Số lượng đơn hàng cần lấy (mặc định: 10)
   */
  getRecentOrders: async (limit: number = 10): Promise<ApiResponse<RecentOrder[]>> => {
    return fetchAPI<RecentOrder[]>(`/admin/dashboard/recent-orders?limit=${limit}`, {
      method: 'GET',
    });
  },

  /**
   * GET /api/v1/admin/dashboard/low-stock-products?threshold=10
   * Lấy danh sách sản phẩm sắp hết hàng
   * @param threshold - Ngưỡng tồn kho cảnh báo (mặc định: 10)
   */
  getLowStockProducts: async (threshold: number = 10): Promise<ApiResponse<LowStockProduct[]>> => {
    return fetchAPI<LowStockProduct[]>(`/admin/dashboard/low-stock-products?threshold=${threshold}`, {
      method: 'GET',
    });
  },
};

/**
 * Payment API
 * Endpoints cho module thanh toán (M06)
 * Base URL: /api/payments
 */
export const paymentAPI = {
  /**
   * POST /api/payments/vnpay/create
   * Tạo URL thanh toán VNPay
   * @param request - Thông tin tạo thanh toán
   * @returns VNPayPaymentResponse chứa paymentUrl
   */
  createVNPayUrl: async (request: CreatePaymentRequest): Promise<ApiResponse<VNPayPaymentResponse>> => {
    return fetchAPI<VNPayPaymentResponse>('/payments/vnpay/create', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * GET /api/payments/history?page=0&size=10
   * Lấy lịch sử thanh toán của user hiện tại
   * @param page - Số trang (bắt đầu từ 0)
   * @param size - Số lượng items mỗi trang
   * @returns PaymentHistoryResponse
   */
  getPaymentHistory: async (page: number = 0, size: number = 10): Promise<ApiResponse<PaymentHistoryResponse>> => {
    return fetchAPI<PaymentHistoryResponse>(`/payments/history?page=${page}&size=${size}`, {
      method: 'GET',
    });
  },

  /**
   * GET /api/payments/{id}
   * Lấy chi tiết một payment
   * @param id - Payment ID
   * @returns PaymentResponse
   */
  getPaymentDetail: async (id: number): Promise<ApiResponse<PaymentResponse>> => {
    return fetchAPI<PaymentResponse>(`/payments/${id}`, {
      method: 'GET',
    });
  },

  /**
   * GET /api/payments/vnpay/callback
   * Xử lý callback từ VNPay sau khi thanh toán
   * @param queryParams - Query parameters từ VNPay
   * @returns PaymentResponse với status đã cập nhật
   */
  handleVNPayCallback: async (queryParams: Record<string, string>): Promise<ApiResponse<PaymentResponse>> => {
    const params = new URLSearchParams(queryParams).toString();
    return fetchAPI<PaymentResponse>(`/payments/vnpay/callback?${params}`, {
      method: 'GET',
    });
  },

  /**
   * GET /api/payments/order/{orderId}
   * Kiểm tra trạng thái payment của một đơn hàng
   * @param orderId - Order ID
   * @returns PaymentResponse
   */
  checkPaymentStatus: async (orderId: number): Promise<ApiResponse<PaymentResponse>> => {
    return fetchAPI<PaymentResponse>(`/payments/order/${orderId}`, {
      method: 'GET',
    });
  },
};
