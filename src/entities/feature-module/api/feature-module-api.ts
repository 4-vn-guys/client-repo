import { axiosInstance } from '@/shared/lib/axios';

import type { FeatureCatalogModule, ModuleOrder } from '../model/types';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export async function fetchModuleCatalog(): Promise<FeatureCatalogModule[]> {
  const res =
    await axiosInstance.get<ApiResponse<FeatureCatalogModule[]>>('/features/catalog');
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to load module catalog');
  }
  return res.data.data;
}

export type CreateModuleOrderInput = {
  moduleId: string;
  transferRef: string;
};

export async function createModuleOrder({
  moduleId,
  transferRef,
}: CreateModuleOrderInput): Promise<ModuleOrder> {
  const res = await axiosInstance.post<ApiResponse<ModuleOrder>>('/features/orders', {
    moduleId,
    channel: 'bank_transfer',
    transferRef,
  });
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to create module order');
  }
  return res.data.data;
}

export async function fetchMyModuleOrders(): Promise<ModuleOrder[]> {
  const res =
    await axiosInstance.get<ApiResponse<ModuleOrder[]>>('/features/orders');
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to load module orders');
  }
  return res.data.data;
}
