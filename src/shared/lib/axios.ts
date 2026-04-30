import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/shared/store";

/**
 * Base API URL - Update this to match your backend server (include `/api/v1` if your API uses it)
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/** No auth interceptors — used only to refresh tokens without recursion */
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

function readTokensFromStorage(): { accessToken: string | null; refreshToken: string | null } {
  if (typeof window === "undefined") {
    return { accessToken: null, refreshToken: null };
  }
  const raw = localStorage.getItem("auth-storage");
  if (!raw) return { accessToken: null, refreshToken: null };
  try {
    const { state } = JSON.parse(raw) as { state?: { accessToken?: string; refreshToken?: string } };
    return {
      accessToken: state?.accessToken ?? null,
      refreshToken: state?.refreshToken ?? null,
    };
  } catch {
    return { accessToken: null, refreshToken: null };
  }
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshTokensOnce(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const { refreshToken } = readTokensFromStorage();
      if (!refreshToken) return false;

      const res = await refreshClient.post<{
        data?: { newAccessToken?: string; newRefreshToken?: string };
      }>("/auth/refresh-token", { refreshToken });
      const next = res.data?.data;
      if (!next?.newAccessToken || !next?.newRefreshToken) return false;

      useAuthStore.getState().setTokens(next.newAccessToken, next.newRefreshToken);
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function shouldSkipRefreshForUrl(url: string | undefined): boolean {
  if (!url) return true;
  return (
    url.includes("/auth/refresh-token") ||
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/forgot-password") ||
    url.includes("/auth/reset-password") ||
    url.includes("/auth/2fa/")
  );
}

function clearSessionAndRedirectLogin(): void {
  localStorage.removeItem("auth-storage");
  try {
    useAuthStore.getState().clearAuth();
  } catch {
    /* store may not be ready in edge cases */
  }
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

/**
 * Axios instance with default configuration
 */
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

/**
 * Request interceptor - Add auth token to requests
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        const accessToken = state?.accessToken;

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.error("Error parsing auth storage:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Refresh on 401 when possible, then retry once
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as (InternalAxiosRequestConfig & { _retryAfterRefresh?: boolean }) | undefined;

    if (status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path === "/login" || path === "/register") {
        return Promise.reject(error);
      }

      const reqUrl = original?.url ?? "";
      if (!original || original._retryAfterRefresh || shouldSkipRefreshForUrl(reqUrl)) {
        if (!shouldSkipRefreshForUrl(reqUrl) || reqUrl.includes("/auth/refresh-token")) {
          clearSessionAndRedirectLogin();
        }
        return Promise.reject(error);
      }

      const { refreshToken } = readTokensFromStorage();
      if (!refreshToken) {
        clearSessionAndRedirectLogin();
        return Promise.reject(error);
      }

      const ok = await refreshTokensOnce();
      if (!ok) {
        clearSessionAndRedirectLogin();
        return Promise.reject(error);
      }

      original._retryAfterRefresh = true;
      const { accessToken } = readTokensFromStorage();
      if (accessToken) {
        original.headers.Authorization = `Bearer ${accessToken}`;
      }
      return axiosInstance(original);
    }

    if (error.response) {
      switch (error.response.status) {
        case 403:
          console.error("Access forbidden");
          break;
        case 500:
          console.error("Server error");
          break;
      }
    }
    return Promise.reject(error);
  }
);
