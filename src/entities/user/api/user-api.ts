import { apiClient } from "@/shared/api/api-client";
import { User } from "../model/slice";

export const userApi = {
  getProfile: async () => {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await apiClient.put<User>("/auth/profile", data);
    return response.data;
  },
};
