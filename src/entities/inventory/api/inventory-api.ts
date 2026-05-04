import { axiosInstance } from '@/shared/lib/axios';

export type PatchStockPayload = {
  branchId: string;
  productId: string;
  delta: number;
  note?: string;
};

export async function patchInventoryStock(payload: PatchStockPayload): Promise<unknown> {
  const response = await axiosInstance.patch<{
    success: boolean;
    data: unknown;
    message?: string;
  }>('/inventory/stock-update', payload);

  if (!response.data.success) {
    throw new Error(response.data.message || 'Stock update failed');
  }

  return response.data.data;
}
