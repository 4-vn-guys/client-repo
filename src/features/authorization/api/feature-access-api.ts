import { axiosInstance } from '@/shared/lib/axios';

type FeatureAccessResponse = {
  success: boolean;
  data: {
    role: string;
    enabledFeatures: string[];
  };
  message?: string;
};

export async function fetchMyFeatureAccess(): Promise<string[]> {
  const response =
    await axiosInstance.get<FeatureAccessResponse>('/features/me');
  if (!response.data.success) {
    return [];
  }
  return response.data.data.enabledFeatures ?? [];
}
