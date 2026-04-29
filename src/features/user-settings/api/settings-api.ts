import { axiosInstance } from '@/shared/lib/axios';
import type {
  ApiResponse,
  UpdateUserSettingsDto,
  UserSettings,
} from '../model/types';

export const fetchUserSettings = async (): Promise<UserSettings> => {
  const response =
    await axiosInstance.get<ApiResponse<UserSettings>>('/settings/');

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch settings');
};

export const updateUserSettings = async (
  data: UpdateUserSettingsDto
): Promise<UserSettings> => {
  const response = await axiosInstance.patch<ApiResponse<UserSettings>>(
    '/settings/',
    data
  );

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to update settings');
};
