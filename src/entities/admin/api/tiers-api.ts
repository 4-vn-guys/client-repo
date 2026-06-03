import { axiosInstance } from '@/shared/lib/axios';

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export type CellValue = 'allow' | 'deny' | 'partial' | 'self';

export type TierSummary = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  moduleCount: number;
  overrideCount: number;
};

export type TierPermissionOverride = {
  roleId: string;
  permissionKey: string;
  value: CellValue;
};

export type TierDetail = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  modules: string[];
  permissionOverrides: TierPermissionOverride[];
};

export async function fetchTiers(): Promise<TierSummary[]> {
  const res = await axiosInstance.get<ApiResponse<TierSummary[]>>(
    '/admin/platform/tiers',
  );
  if (!res.data.success) throw new Error(res.data.message || 'Failed to fetch tiers');
  return res.data.data;
}

export async function fetchTierDetail(id: string): Promise<TierDetail> {
  const res = await axiosInstance.get<ApiResponse<TierDetail>>(
    `/admin/platform/tiers/${id}`,
  );
  if (!res.data.success) throw new Error(res.data.message || 'Failed to fetch tier');
  return res.data.data;
}

export type CreateTierInput = {
  slug?: string;
  name: string;
  description?: string;
  cloneFromId?: string;
};

export async function createTier(input: CreateTierInput): Promise<TierDetail> {
  const res = await axiosInstance.post<ApiResponse<TierDetail>>(
    '/admin/platform/tiers',
    input,
  );
  if (!res.data.success) throw new Error(res.data.message || 'Failed to create tier');
  return res.data.data;
}

export type UpdateTierInput = {
  id: string;
  name?: string;
  description?: string | null;
};

export async function updateTier({ id, ...patch }: UpdateTierInput): Promise<TierDetail> {
  const res = await axiosInstance.patch<ApiResponse<TierDetail>>(
    `/admin/platform/tiers/${id}`,
    patch,
  );
  if (!res.data.success) throw new Error(res.data.message || 'Failed to update tier');
  return res.data.data;
}

export async function deleteTier(id: string): Promise<void> {
  const res = await axiosInstance.delete<ApiResponse<null>>(
    `/admin/platform/tiers/${id}`,
  );
  if (!res.data.success) throw new Error(res.data.message || 'Failed to delete tier');
}

export async function setTierModules(
  id: string,
  moduleIds: string[],
): Promise<string[]> {
  const res = await axiosInstance.put<ApiResponse<string[]>>(
    `/admin/platform/tiers/${id}/modules`,
    { moduleIds },
  );
  if (!res.data.success) throw new Error(res.data.message || 'Failed to update tier modules');
  return res.data.data;
}

export async function setTierPermissionOverrides(
  id: string,
  overrides: TierPermissionOverride[],
): Promise<TierPermissionOverride[]> {
  const res = await axiosInstance.put<ApiResponse<TierPermissionOverride[]>>(
    `/admin/platform/tiers/${id}/permissions`,
    { overrides },
  );
  if (!res.data.success) throw new Error(res.data.message || 'Failed to update tier permissions');
  return res.data.data;
}
