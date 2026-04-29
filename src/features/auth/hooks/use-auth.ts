'use client';

import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/shared/store';
import { authApi } from '../apis';

/**
 * Custom hook for authentication
 * Provides auth state and actions using zustand store
 */
export const useAuth = () => {
  const router = useRouter();
  const {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    setAuth,
    setTokens,
    clearAuth,
    setLoading,
  } = useAuthStore();

  /**
   * Login with credentials
   */
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authApi.login(email, password);

      if (response?.data) {
        // Extract tokens from login response
        const { accessToken, refreshToken } = response.data;

        // Store tokens first
        setTokens(accessToken, refreshToken);

        // Fetch user profile
        const profileResponse = await authApi.getProfile();

        if (profileResponse?.data) {
          const {
            id,
            username,
            email,
            role,
            phoneNumber,
            provider,
            providerId,
            createdAt,
            updatedAt,
            deletedAt,
          } = profileResponse.data;

          // Set complete auth state with user data and tokens
          setAuth(
            {
              id,
              username,
              email,
              role,
              phoneNumber,
              provider,
              providerId,
              createdAt,
              updatedAt,
              deletedAt,
            },
            accessToken,
            refreshToken
          );

          toast.success('Login successful!');
          router.push('/owner/branches');
          return { success: true };
        }
      } else {
        toast.error('Invalid credentials');
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      // Handle nested error structure: { success: false, error: { message: "..." } }
      const message = 
        (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'error' in error.response.data && error.response.data.error && typeof error.response.data.error === 'object' && 'message' in error.response.data.error && typeof error.response.data.error.message === 'string' ? error.response.data.error.message : null) ||
        (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : null) ||
        "Login failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      setLoading(true);
      const response = await authApi.loginWithGoogle(idToken);

      if (response?.data) {
        const { accessToken, refreshToken } = response.data;
        setTokens(accessToken, refreshToken);

        const profileResponse = await authApi.getProfile();
        if (profileResponse?.data) {
          const {
            id,
            username,
            email,
            role,
            phoneNumber,
            provider,
            providerId,
            createdAt,
            updatedAt,
            deletedAt,
          } = profileResponse.data;

          setAuth(
            {
              id,
              username,
              email,
              role,
              phoneNumber,
              provider,
              providerId,
              createdAt,
              updatedAt,
              deletedAt,
            },
            accessToken,
            refreshToken
          );

          toast.success('Login successful!');
          router.push('/owner/branches');
          return { success: true };
        }
      }

      toast.error('Google login failed');
      return { success: false, error: 'Google login failed' };
    } catch (error) {
      const message =
        (error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'error' in error.response.data &&
        error.response.data.error &&
        typeof error.response.data.error === 'object' &&
        'message' in error.response.data.error &&
        typeof error.response.data.error.message === 'string'
          ? error.response.data.error.message
          : null) ||
        (error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
          ? error.response.data.message
          : null) ||
        'Google login failed';

      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async (data: {
    userName: string;
    email?: string;
    phoneNumber?: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      const response = await authApi.register(data);

      if (response?.data) {
        toast.success('Registration successful! Please login.');
        router.push('/login');
        return { success: true };
      } else {
        toast.error('Registration failed');
        return { success: false };
      }
    } catch (error: unknown) {
      // Handle nested error structure: { success: false, error: { message: "..." } }
      const responseData =
        error instanceof AxiosError ? error.response?.data : undefined;
      const message =
        responseData?.error?.message ||
        responseData?.message ||
        'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      clearAuth();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch {
      toast.error('Failed to logout');
    }
  };

  /**
   * Get current user profile from API
   */
  const refreshProfile = async () => {
    try {
      const response = await authApi.getProfile();
      if (response?.data) {
        const {
          id,
          username,
          email,
          role,
          phoneNumber,
          provider,
          providerId,
          createdAt,
          updatedAt,
          deletedAt,
        } = response.data;
        setAuth(
          {
            id,
            username,
            email,
            role,
            phoneNumber,
            provider,
            providerId,
            createdAt,
            updatedAt,
            deletedAt,
          },
          accessToken || '',
          refreshToken || ''
        );
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    register,
    logout,
    refreshProfile,
  };
};
