import { axiosInstance } from '@/shared/lib/axios';

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export type CheckinStatus = 'in' | 'late' | 'no_show';

export type Checkin = {
  id: string;
  branchId: string;
  bookingId: string | null;
  bookingDetailId: string | null;
  customerName: string;
  courtLabel: string;
  status: CheckinStatus;
  note: string | null;
  checkedInAt: string;
};

export async function fetchTodayCheckins(branchId: string): Promise<Checkin[]> {
  const res = await axiosInstance.get<ApiResponse<Checkin[]>>(
    `/checkins/branches/${branchId}/today`,
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to load check-ins');
  }
  return res.data.data;
}

export async function resolveCheckinToken({
  branchId,
  token,
}: {
  branchId: string;
  token: string;
}): Promise<Checkin> {
  const res = await axiosInstance.post<ApiResponse<Checkin>>(
    `/checkins/branches/${branchId}/resolve`,
    { token },
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Token rejected');
  }
  return res.data.data;
}
