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
  DashboardOverviewResponse,
  TopProductResponse,
  PromotionResponse,
  CreatePromotionRequest,
  UpdatePromotionRequest,
  AvailablePromotionParams,
  CalculateDiscountParams,
  PromotionTemplateResponse,
  CreateTemplateRequest,
  UpdateTemplateRequest,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";

// Helper function to get auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

// Helper function to set auth tokens
export const setAuthTokens = (
  accessToken: string,
  refreshToken: string
): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }
};

// Helper function to clear auth tokens
export const clearAuthTokens = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
};

// Helper function to get stored user
export const getStoredUser = (): User | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// Helper function to set stored user
export const setStoredUser = (user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
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

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Try to parse JSON, but handle cases where response might not be JSON
    let data: any;
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

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

    if (!response.ok) {
      // Log more details for debugging
      console.error("API Error Details:", {
        url,
        status: response.status,
        statusText: response.statusText,
        data,
      });

      const errorMessage =
        data?.message ||
        data?.error ||
        `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Auth API endpoints
export const authAPI = {
  login: async (
    credentials: LoginRequest
  ): Promise<ApiResponse<LoginResponse>> => {
    return fetchAPI<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    return fetchAPI<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<ApiResponse<null>> => {
    return fetchAPI<null>("/auth/forgot-password/request", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<ApiResponse<null>> => {
    return fetchAPI<null>("/auth/forgot-password/verify", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  logout: async (): Promise<ApiResponse<null>> => {
    return fetchAPI<null>("/auth/logout", {
      method: "POST",
    });
  },

  refresh: async (
    refreshToken: string
  ): Promise<ApiResponse<LoginResponse>> => {
    return fetchAPI<LoginResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },
};

// User API endpoints
export const userAPI = {
  getMe: async (): Promise<ApiResponse<User>> => {
    return fetchAPI<User>("/user/me", {
      method: "GET",
    });
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    return fetchAPI<User>("/user/profile", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<null>> => {
    return fetchAPI<null>("/user/password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// Health check
export const healthCheck = async (): Promise<ApiResponse<any>> => {
  return fetchAPI<any>("/health", {
    method: "GET",
  });
};

// Product API endpoints
// Note: Public product endpoints don't exist yet, so using mock data in components
// Only keeping admin endpoints that exist
export const productAPI = {
  // Get all products including deleted (Admin only)
  // GET /api/v1/products/admin/all?page={page}&size={size}
  getAllProducts: async (params?: {
    page?: number;
    size?: number;
  }): Promise<ApiResponse<any>> => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined)
      queryParams.append("page", String(params.page));
    if (params?.size !== undefined)
      queryParams.append("size", String(params.size));

    return fetchAPI<any>(
      `/products/admin/all${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`,
      {
        method: "GET",
      }
    );
  },

  // Get low stock products (for admin dashboard)
  // This endpoint exists: GET /api/v1/admin/dashboard/low-stock-products
  getLowStockProducts: async (
    threshold: number = 20
  ): Promise<ApiResponse<any[]>> => {
    return fetchAPI<any[]>(
      `/admin/dashboard/low-stock-products?threshold=${threshold}`,
      {
        method: "GET",
      }
    );
  },
};

// Category API endpoints
export const categoryAPI = {
  // Get all categories (or by parentId)
  // GET /api/v1/categories?parentId={parentId}
  getCategories: async (parentId?: string): Promise<ApiResponse<any[]>> => {
    const queryParams = parentId ? `?parentId=${parentId}` : "";
    return fetchAPI<any[]>(`/categories${queryParams}`, {
      method: "GET",
    });
  },

  // Get all root categories (parentId = null)
  getRootCategories: async (): Promise<ApiResponse<any[]>> => {
    return fetchAPI<any[]>("/categories", {
      method: "GET",
    });
  },
};

// Order API endpoints
export const orderAPI = {
  // Get order by ID
  getById: async (orderId: number): Promise<ApiResponse<OrderResponse>> => {
    return fetchAPI<OrderResponse>(`/orders/${orderId}`, {
      method: "GET",
    });
  },

  // Get user's orders (for customer)
  // Note: Endpoint GET /api/v1/orders (list) doesn't exist
  // Components will use mock data instead

  // Get recent orders (for admin dashboard)
  // This endpoint exists: GET /api/v1/admin/dashboard/recent-orders?limit={limit}
  getRecentOrders: async (
    limit: number = 10
  ): Promise<ApiResponse<RecentOrderResponse[]>> => {
    return fetchAPI<RecentOrderResponse[]>(
      `/admin/dashboard/recent-orders?limit=${limit}`,
      {
        method: "GET",
      }
    );
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
    if (params?.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params?.size !== undefined)
      queryParams.append("size", params.size.toString());
    if (params?.role) queryParams.append("role", params.role);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.search) queryParams.append("search", params.search);

    const query = queryParams.toString();
    return fetchAPI<any>(`/admin/users${query ? `?${query}` : ""}`, {
      method: "GET",
    });
  },

  // Dashboard
  getDashboardOverview: async (): Promise<
    ApiResponse<DashboardOverviewResponse>
  > => {
    return fetchAPI<DashboardOverviewResponse>("/admin/dashboard/overview", {
      method: "GET",
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
    return fetchAPI<any>("/admin/dashboard/low-stock-products?threshold=1000", {
      method: "GET",
    });
  },
};

// Promotion API
export const promotionAPI = {
  // Customer: Get ALL active promotions (for /promotions page)
  // GET /api/v1/promotions
  getAllActivePromotions: async (): Promise<
    ApiResponse<PromotionResponse[]>
  > => {
    return fetchAPI<PromotionResponse[]>("/promotions", {
      method: "GET",
    });
  },

  // Customer: Get available promotions based on order total
  getAvailablePromotions: async (
    orderTotal: number
  ): Promise<ApiResponse<PromotionResponse[]>> => {
    return fetchAPI<PromotionResponse[]>(
      `/promotions/available?orderTotal=${orderTotal}`,
      {
        method: "GET",
      }
    );
  },

  // Customer: Calculate discount for a specific promotion
  calculateDiscount: async (
    promotionId: string,
    orderTotal: number
  ): Promise<ApiResponse<number>> => {
    return fetchAPI<number>(
      `/promotions/calculate?promotionId=${promotionId}&orderTotal=${orderTotal}`,
      {
        method: "GET",
      }
    );
  },

  // Admin: Get all promotions
  getAllPromotions: async (): Promise<ApiResponse<PromotionResponse[]>> => {
    return fetchAPI<PromotionResponse[]>("/admin/promotions", {
      method: "GET",
    });
  },

  // Admin: Get promotion details
  getPromotionDetails: async (
    id: string
  ): Promise<ApiResponse<PromotionResponse>> => {
    return fetchAPI<PromotionResponse>(`/admin/promotions/${id}`, {
      method: "GET",
    });
  },

  // Admin: Create new promotion
  createPromotion: async (
    data: CreatePromotionRequest
  ): Promise<ApiResponse<PromotionResponse>> => {
    return fetchAPI<PromotionResponse>("/admin/promotions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Admin: Update promotion
  updatePromotion: async (
    id: string,
    data: UpdatePromotionRequest
  ): Promise<ApiResponse<PromotionResponse>> => {
    return fetchAPI<PromotionResponse>(`/admin/promotions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Admin: Disable promotion
  disablePromotion: async (id: string): Promise<ApiResponse<void>> => {
    return fetchAPI<void>(`/admin/promotions/${id}/disable`, {
      method: "PATCH",
    });
  },
};

// Promotion Template API (Admin only)
export const templateAPI = {
  // Get all templates
  getAllTemplates: async (): Promise<
    ApiResponse<PromotionTemplateResponse[]>
  > => {
    return fetchAPI<PromotionTemplateResponse[]>("/admin/promotion-templates", {
      method: "GET",
    });
  },

  // Get template by ID
  getTemplateById: async (
    id: string
  ): Promise<ApiResponse<PromotionTemplateResponse>> => {
    return fetchAPI<PromotionTemplateResponse>(
      `/admin/promotion-templates/${id}`,
      {
        method: "GET",
      }
    );
  },

  // Create template
  createTemplate: async (
    data: CreateTemplateRequest
  ): Promise<ApiResponse<PromotionTemplateResponse>> => {
    return fetchAPI<PromotionTemplateResponse>("/admin/promotion-templates", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update template
  updateTemplate: async (
    id: string,
    data: UpdateTemplateRequest
  ): Promise<ApiResponse<PromotionTemplateResponse>> => {
    return fetchAPI<PromotionTemplateResponse>(
      `/admin/promotion-templates/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  // Delete template
  deleteTemplate: async (id: string): Promise<ApiResponse<void>> => {
    return fetchAPI<void>(`/admin/promotion-templates/${id}`, {
      method: "DELETE",
    });
  },
};
