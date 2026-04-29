import { axiosInstance } from '@/shared/lib/axios';
import { Branch, CreateBranchDto } from '../model/types';

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
