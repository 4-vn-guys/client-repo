import { axiosInstance } from '@/shared/lib';

/**
 * Auth API service following FSD architecture
 * All authentication-related API calls
 */
export const authApi = {
  /**
   * Login with email and password
   */
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post('/auth/login/email', {
      email,
      password,
    });
    return response.data;
  },

  verifyTwoFactorLogin: async (challengeToken: string, code: string) => {
    const response = await axiosInstance.post('/auth/2fa/verify-login', {
      challengeToken,
      code,
    });
    return response.data;
  },

  /**
   * Login with Google OAuth2 ID token
   */
  loginWithGoogle: async (idToken: string) => {
    const response = await axiosInstance.post('/auth/login/google', {
      idToken,
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
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: {
    userName?: string;
    phoneNumber?: string;
    avatarUrl?: string | null;
    city?: string | null;
  }) => {
    const response = await axiosInstance.patch('/auth/me', data);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (
    oldPassword: string,
    newPassword: string,
    refreshToken: string
  ) => {
    const response = await axiosInstance.put('/auth/change-password', {
      oldPassword,
      newPassword,
      refreshToken,
    });
    return response.data;
  },
  setupTwoFactor: async () => {
    const response = await axiosInstance.post('/auth/2fa/setup');
    return response.data;
  },
  verifyTwoFactorSetup: async (code: string) => {
    const response = await axiosInstance.post('/auth/2fa/verify-setup', {
      code,
    });
    return response.data;
  },
  disableTwoFactor: async (code: string) => {
    const response = await axiosInstance.post('/auth/2fa/disable', { code });
    return response.data;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post('/auth/forgot-password', {
      email,
    });
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string) => {
    const response = await axiosInstance.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },
};
