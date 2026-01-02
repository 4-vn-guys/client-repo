import { axiosInstance } from "@/shared/lib";

/**
 * Auth API service following FSD architecture
 * All authentication-related API calls
 */
export const authApi = {
  /**
   * Login with email and password
   */
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (data: {
    email: string;
    password: string;
    name?: string;
    username?: string;
  }) => {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await axiosInstance.get("/auth/profile");
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: {
    name?: string;
    username?: string;
    phone?: string;
  }) => {
    const response = await axiosInstance.put("/auth/profile", data);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await axiosInstance.post("/auth/change-password", {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string) => {
    const response = await axiosInstance.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  },
};
