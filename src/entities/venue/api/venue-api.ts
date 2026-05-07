import { axiosInstance } from '@/shared/lib/axios';
import {
  Branch,
  BranchDepositRevenueResponse,
  CreateBranchDto,
  UpdateBranchDto,
  UploadedFile,
} from '../model/types';

/**
 * API response structure from backend
 */
interface BranchApiResponse {
  success: boolean;
  data: Branch[];
  message: string;
  statusCode: number;
  timestamp: string;
}

interface BranchPaginationResponse {
  success: boolean;
  data: {
    docs: Branch[];
    page?: number;
    perPage?: number;
    total?: number;
    totalPages?: number;
  };
  message: string;
  statusCode: number;
  timestamp: string;
}

/**
 * Fetch all branches owned by the current user
 */
export const fetchBranches = async (): Promise<Branch[]> => {
  try {
    const response =
      await axiosInstance.get<BranchApiResponse>('/branches/owner');

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch branches');
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

export const fetchPublicBranches = async (params?: {
  page?: number;
  perPage?: number;
  search?: string;
}): Promise<Branch[]> => {
  try {
    const response = await axiosInstance.get<BranchPaginationResponse>(
      '/branches',
      {
        params,
      }
    );

    if (response.data.success) {
      return response.data.data.docs ?? [];
    }

    throw new Error(response.data.message || 'Failed to fetch public branches');
  } catch (error) {
    console.error('Error fetching public branches:', error);
    throw error;
  }
};

/**
 * Fetch a single branch by ID
 */
export const fetchBranchById = async (id: string): Promise<Branch> => {
  try {
    const response = await axiosInstance.get<{
      success: boolean;
      data: Branch;
    }>(`/branches/${id}`);

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error('Failed to fetch branch');
  } catch (error) {
    console.error('Error fetching branch:', error);
    throw error;
  }
};

/**
 * Create a new branch owned by the current user
 */
export const createBranch = async (data: CreateBranchDto): Promise<Branch> => {
  try {
    const response = await axiosInstance.post<{
      success: boolean;
      data: Branch;
      message?: string;
    }>('/branches/', data);

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to create branch');
  } catch (error) {
    console.error('Error creating branch:', error);
    throw error;
  }
};

/**
 * Upload a file that can be attached to branch metadata, such as policy PDFs.
 */
export const updateBranch = async (
  id: string,
  data: UpdateBranchDto
): Promise<Branch> => {
  try {
    const response = await axiosInstance.patch<{
      success: boolean;
      data: Branch;
      message?: string;
    }>(`/branches/${id}`, data);

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to update branch');
  } catch (error) {
    console.error('Error updating branch:', error);
    throw error;
  }
};

export const fetchBranchDepositRevenue = async (
  branchId: string
): Promise<BranchDepositRevenueResponse> => {
  try {
    const response = await axiosInstance.get<{
      success: boolean;
      data: BranchDepositRevenueResponse;
      message?: string;
    }>(`/branches/${branchId}/revenue-deposits`);

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch deposit revenue');
  } catch (error) {
    console.error('Error fetching deposit revenue:', error);
    throw error;
  }
};

export const uploadBranchFile = async (file: File): Promise<UploadedFile> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<{
      success: boolean;
      data: UploadedFile;
      message?: string;
    }>('/files/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to upload file');
  } catch (error) {
    console.error('Error uploading branch file:', error);
    throw error;
  }
};
