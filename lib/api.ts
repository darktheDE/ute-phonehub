// API Configuration and utility functions
import type {
  ApiResponse,
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
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

    // Check if response has content
    const contentType = response.headers.get("content-type");
    const hasJsonContent =
      contentType && contentType.includes("application/json");

    let data;
    try {
      data = hasJsonContent ? await response.json() : null;
    } catch (jsonError) {
      // If JSON parsing fails, try to get text for better error message
      const text = await response.text();
      throw new Error(
        `Lỗi phân tích dữ liệu từ server (${response.status}): ${text.substring(
          0,
          100
        )}`
      );
    }

    if (!response.ok) {
      const errorMessage =
        data?.message ||
        `Lỗi từ server: ${response.status} ${response.statusText}`;
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
