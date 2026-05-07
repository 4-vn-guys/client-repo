import { axiosInstance } from '@/shared/lib/axios';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export async function fetchOwnerCommission(ownerId: string): Promise<number> {
  const res = await axiosInstance.get<
    ApiResponse<{ ownerId: string; commissionRate: number }>
  >(`/admin/billing/owners/${ownerId}`);
  if (!res.data.success)
    throw new Error(res.data.message || 'Failed to fetch commission rate');
  return res.data.data.commissionRate;
}

export async function setOwnerCommission(
  ownerId: string,
  commissionRate: number
): Promise<number> {
  const res = await axiosInstance.put<
    ApiResponse<{ ownerId: string; commissionRate: number }>
  >(`/admin/billing/owners/${ownerId}`, { commissionRate });
  if (!res.data.success)
    throw new Error(res.data.message || 'Failed to update commission rate');
  return res.data.data.commissionRate;
}
