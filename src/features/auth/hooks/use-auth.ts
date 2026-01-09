"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/shared/model/auth-store";
import { authApi } from "../apis";
import { userApi } from "@/entities/user/api/user-api";

/**
 * Custom hook for authentication
 * Provides auth state and actions using zustand store
 */
export const useAuth = () => {
  const router = useRouter();
  const { user, accessToken, refreshToken, isAuthenticated, isLoading, setAuth, setTokens, clearAuth, setLoading } = useAuthStore();

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
        const profileResponse = await userApi.getProfile();
        
        if (profileResponse) {
          const { id, username, email, role, phoneNumber, provider, providerId, createdAt, updatedAt, deletedAt } = profileResponse;
          
          // Set complete auth state with user data and tokens
          setAuth(
            { id, username, email, role, phoneNumber, provider, providerId, createdAt, updatedAt, deletedAt },
            accessToken,
            refreshToken
          );
          
          toast.success("Login successful!");
          router.push("/owner/timeline");
          return { success: true };
        }
      } else {
        toast.error("Invalid credentials");
        return { success: false, error: "Invalid credentials" };
      }
    } catch (error) {
      // Handle nested error structure: { success: false, error: { message: "..." } }
      const err = error as any;
      const message = 
        err?.response?.data?.error?.message || 
        err?.response?.data?.message || 
        "Login failed";
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
        toast.success("Registration successful! Please login.");
        router.push("/login");
        return { success: true };
      } else {
        toast.error("Registration failed");
        return { success: false };
      }
    } catch (error) {
      // Handle nested error structure: { success: false, error: { message: "..." } }
      const err = error as any;
      const message = 
        err?.response?.data?.error?.message || 
        err?.response?.data?.message || 
        "Registration failed";
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
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  /**
   * Get current user profile from API
   */
  const refreshProfile = async () => {
    try {
      const response = await userApi.getProfile();
      if (response) {
        const { id, username, email, role, phoneNumber, provider, providerId, createdAt, updatedAt, deletedAt } = response;
        setAuth(
          { id, username, email, role, phoneNumber, provider, providerId, createdAt, updatedAt, deletedAt },
          accessToken || "",
          refreshToken || ""
        );
      }
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    }
  };

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshProfile,
  };
};
