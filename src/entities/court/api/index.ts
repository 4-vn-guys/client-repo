import { axiosInstance } from '@/shared/lib/axios';
import type { Court } from '../model/type';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type CreateCourtDto = {
  branchId: string;
  name: string;
  surfaceType: string;
  defaultHourlyRate: number;
  isActive?: boolean;
};

export type UpdateCourtDto = Partial<Omit<CreateCourtDto, 'branchId'>>;

export const fetchCourtsByBranchId = async (
  branchId: string
): Promise<Court[]> => {
  const response = await axiosInstance.get<ApiResponse<Court[]>>(
    `/courts/branch/${branchId}`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to fetch courts');
  }

  return response.data.data;
};

export const createCourt = async (data: CreateCourtDto): Promise<Court> => {
  const response = await axiosInstance.post<ApiResponse<Court>>(
    '/courts/',
    data
  );

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to create court');
  }

  return response.data.data;
};

export const updateCourt = async (
  id: string,
  data: UpdateCourtDto
): Promise<Court> => {
  const response = await axiosInstance.patch<ApiResponse<Court>>(
    `/courts/${id}`,
    data
  );

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to update court');
  }

  return response.data.data;
};

export const deleteCourt = async (id: string): Promise<void> => {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/courts/${id}`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete court');
  }
};
