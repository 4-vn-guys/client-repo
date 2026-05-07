import { axiosInstance } from '@/shared/lib/axios';

export type AdminUser = {
  id: string;
  username: string;
  email: string | null;
  role: 'admin' | 'owner' | 'user';
  isActive: boolean;
  createdAt?: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type Paginated<T> = {
  docs: T[];
  totalDocs: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

export async function fetchUsers(params?: {
  page?: number;
  perPage?: number;
  search?: string;
}): Promise<Paginated<AdminUser>> {
  const cleanedParams = params
    ? {
        ...params,
        search: params.search?.trim() ? params.search : undefined,
      }
    : undefined;
  const res = await axiosInstance.get<ApiResponse<Paginated<AdminUser>>>(
    '/users',
    { params: cleanedParams }
  );
  if (!res.data.success)
    throw new Error(res.data.message || 'Failed to fetch users');
  return res.data.data;
}

export async function fetchUserById(id: string): Promise<AdminUser> {
  const res = await axiosInstance.get<ApiResponse<AdminUser>>(`/users/${id}`);
  if (!res.data.success)
    throw new Error(res.data.message || 'Failed to fetch user');
  return res.data.data;
}

export async function createOwnerUser(input: {
  email: string;
  password: string;
  userName: string;
}): Promise<AdminUser> {
  const res = await axiosInstance.post<ApiResponse<AdminUser>>('/users', input);
  if (!res.data.success)
    throw new Error(res.data.message || 'Failed to create owner');
  return res.data.data;
}

export async function deleteUser(id: string): Promise<void> {
  const res = await axiosInstance.delete<ApiResponse<null>>(`/users/${id}`);
  if (!res.data.success)
    throw new Error(res.data.message || 'Failed to delete user');
}

export async function setUserActive(
  id: string,
  isActive: boolean
): Promise<AdminUser> {
  const res = await axiosInstance.patch<ApiResponse<AdminUser>>(
    `/users/${id}/active`,
    { isActive }
  );
  if (!res.data.success)
    throw new Error(res.data.message || 'Failed to update user');
  return res.data.data;
}
