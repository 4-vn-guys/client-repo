import { axiosInstance } from '@/shared/lib/axios';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export async function fetchOwnerFeatures(ownerId: string): Promise<string[]> {
  const res = await axiosInstance.get<
    ApiResponse<{ ownerId: string; enabledFeatures: string[] }>
  >(`/features/admin/owners/${ownerId}`);
  if (!res.data.success)
    throw new Error(res.data.message || 'Failed to fetch owner features');
  return res.data.data.enabledFeatures ?? [];
}

export async function setOwnerFeatures(
  ownerId: string,
  features: { featureKey: string; enabled: boolean }[]
): Promise<string[]> {
  const res = await axiosInstance.put<
    ApiResponse<{ ownerId: string; enabledFeatures: string[] }>
  >(`/features/admin/owners/${ownerId}`, { features });
  if (!res.data.success)
    throw new Error(res.data.message || 'Failed to update owner features');
  return res.data.data.enabledFeatures ?? [];
}
