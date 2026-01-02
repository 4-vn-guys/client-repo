/**
 * API Response Types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * User Types
 */
export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  phone?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Auth Types
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  username?: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
}

export interface AuthError {
  message: string;
  code?: string;
}
