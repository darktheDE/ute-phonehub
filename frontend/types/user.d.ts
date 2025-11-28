/**
 * User entity matching Backend User entity
 */
export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * User profile update request
 */
export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

/**
 * Change password request
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
