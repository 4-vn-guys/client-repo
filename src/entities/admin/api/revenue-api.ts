import { axiosInstance } from '@/shared/lib/axios';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type RevenueTotals = { gmv: number; platformFee: number; net: number };

export type RevenueSummary = {
  currency: 'VND';
  filters: { from: string; to: string; ownerId?: string; branchId?: string };
  bookings: RevenueTotals;
  proShop: RevenueTotals;
  total: RevenueTotals;
};

export type RevenueDaily = {
  currency: 'VND';
  filters: { from: string; to: string; ownerId?: string; branchId?: string };
  days: Array<{
    day: string;
    bookings: RevenueTotals;
    proShop: RevenueTotals;
    total: RevenueTotals;
  }>;
};

export async function fetchRevenueSummary(params: {
  from: string;
  to: string;
  ownerId?: string;
  branchId?: string;
}): Promise<RevenueSummary> {
  const res = await axiosInstance.get<ApiResponse<RevenueSummary>>(
    '/admin/revenue/summary',
    { params }
  );
  if (!res.data.success)
    throw new Error(res.data.message || 'Failed to fetch revenue summary');
  return res.data.data;
}

export async function fetchRevenueDaily(params: {
  from: string;
  to: string;
  ownerId?: string;
  branchId?: string;
}): Promise<RevenueDaily> {
  const res = await axiosInstance.get<ApiResponse<RevenueDaily>>(
    '/admin/revenue/daily',
    { params }
  );
  if (!res.data.success)
    throw new Error(res.data.message || 'Failed to fetch revenue daily');
  return res.data.data;
}
