'use client';

import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/shared/store';
import { fetchMyStaffMemberships } from '@/entities/branch-staff/api';
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

  const resolvePostLoginPath = async (role?: string) => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const returnTo = searchParams.get('returnTo');
      if (returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//')) {
        return returnTo;
      }
    }

    if (role === 'admin') return '/admin';
    if (role === 'owner') return '/owner/branches';
    if (role === 'user') {
      // Staff with the 'dashboard:view' permission land on the dashboard.
      // Don't block the login UX: cap the membership check at 1s and fall
      // back to the default destination.
      try {
        const memberships = await Promise.race([
          fetchMyStaffMemberships(),
          new Promise<null>(resolve => setTimeout(() => resolve(null), 1000)),
        ]);
        if (
          memberships?.some(m => m.permissions.includes('dashboard:view'))
        ) {
          return '/owner/branches';
        }
      } catch {
        // Membership check failed — keep the existing destination.
      }
    }
    return '/find-court';
  };

  /**
   * Login with credentials
   */
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authApi.login(email, password);

      if (response?.data?.requiresTwoFactor) {
        return {
          success: true,
          requiresTwoFactor: true,
          challengeToken: response.data.challengeToken,
        };
      }

      if (response?.data?.accessToken && response?.data?.refreshToken) {
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
          router.push(await resolvePostLoginPath(role));
          return { success: true };
        }
      } else {
        toast.error('Invalid credentials');
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      // Handle nested error structure: { success: false, error: { message: "..." } }
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
        'Login failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const verifyTwoFactorLogin = async (challengeToken: string, code: string) => {
    try {
      setLoading(true);
      const response = await authApi.verifyTwoFactorLogin(challengeToken, code);

      if (!response?.data?.accessToken || !response?.data?.refreshToken) {
        return { success: false, error: 'Invalid 2FA response' };
      }

      const { accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
      const profileResponse = await authApi.getProfile();

      if (!profileResponse?.data) {
        return { success: false, error: 'Unable to load profile' };
      }

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

      toast.success('2FA verified. Login successful!');
      router.push(await resolvePostLoginPath(role));
      return { success: true };
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
          : null) || '2FA verification failed';
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

      if (response?.data?.requiresTwoFactor) {
        return {
          success: true,
          requiresTwoFactor: true,
          challengeToken: response.data.challengeToken,
        };
      }

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
          router.push(await resolvePostLoginPath(role));
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
    verifyTwoFactorLogin,
    loginWithGoogle,
    register,
    logout,
    refreshProfile,
  };
};
