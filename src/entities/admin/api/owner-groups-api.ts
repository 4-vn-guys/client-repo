import { axiosInstance } from '@/shared/lib/axios';

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export type OwnerGroup = {
  id: string;
  name: string;
  createdAt?: string;
};

export async function fetchOwnerGroups(): Promise<OwnerGroup[]> {
  const res = await axiosInstance.get<ApiResponse<OwnerGroup[]>>(
    '/admin/owner-groups'
  );
  if (!res.data.success)
    throw new Error(res.data.message || 'Failed to fetch groups');
  return res.data.data;
}

export async function createOwnerGroup(name: string): Promise<OwnerGroup> {
  const res = await axiosInstance.post<ApiResponse<OwnerGroup>>(
    '/admin/owner-groups',
    { name }
  );
  if (!res.data.success)
    throw new Error(res.data.message || 'Failed to create group');
  return res.data.data;
}

export async function fetchOwnerGroupDetail(groupId: string): Promise<{
  group: OwnerGroup;
  ownerIds: string[];
  enabledFeatures: string[];
}> {
  const res = await axiosInstance.get<
    ApiResponse<{
      group: OwnerGroup;
      ownerIds: string[];
      enabledFeatures: string[];
    }>
  >(`/admin/owner-groups/${groupId}`);
  if (!res.data.success)
    throw new Error(res.data.message || 'Failed to fetch group');
  return res.data.data;
}

export async function setOwnerGroupMembers(
  groupId: string,
  ownerIds: string[]
): Promise<string[]> {
  const res = await axiosInstance.put<ApiResponse<{ ownerIds: string[] }>>(
    `/admin/owner-groups/${groupId}/members`,
    { ownerIds }
  );
  if (!res.data.success)
    throw new Error(res.data.message || 'Failed to update members');
  return res.data.data.ownerIds;
}

export async function fetchOwnerGroupFeatures(
  groupId: string
): Promise<string[]> {
  const res = await axiosInstance.get<
    ApiResponse<{ enabledFeatures: string[] }>
  >(`/admin/owner-groups/${groupId}/features`);
  if (!res.data.success)
    throw new Error(res.data.message || 'Failed to fetch group features');
  return res.data.data.enabledFeatures;
}

export async function setOwnerGroupFeatures(
  groupId: string,
  features: { featureKey: string; enabled: boolean }[]
): Promise<string[]> {
  const res = await axiosInstance.put<
    ApiResponse<{ enabledFeatures: string[] }>
  >(`/admin/owner-groups/${groupId}/features`, { features });
  if (!res.data.success)
    throw new Error(res.data.message || 'Failed to update group features');
  return res.data.data.enabledFeatures;
}

