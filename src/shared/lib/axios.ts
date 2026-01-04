import axios from "axios";

/**
 * Base API URL - Update this to match your backend server
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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
    // Get token from localStorage
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
 * Response interceptor - Handle errors globally
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem("auth-storage");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          break;
        case 403:
          // Forbidden
          console.error("Access forbidden");
          break;
        case 500:
          // Server error
          console.error("Server error");
          break;
      }
    }
    return Promise.reject(error);
  }
);
