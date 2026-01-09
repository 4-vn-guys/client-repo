import { apiClient } from "@/shared/api/api-client";

/**
 * Auth API service following FSD architecture
 * All authentication-related API calls
 */
export const authApi = {
  /**
   * Login with email and password
   */
  login: async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login/email", {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (data: {
    userName: string;
    email?: string;
    phoneNumber?: string;
    password: string;
  }) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },



  /**
   * Change password
   */
  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await apiClient.post("/auth/change-password", {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string) => {
    const response = await apiClient.post("/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string) => {
    const response = await apiClient.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  },
};
