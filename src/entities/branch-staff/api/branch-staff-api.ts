import { axiosInstance } from '@/shared/lib/axios';

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export type BranchStaffRole = 'manager' | 'staff' | 'coach';

export type BranchStaffPermission =
  | 'bookings:read'
  | 'bookings:manage'
  | 'checkins:read'
  | 'checkins:manage'
  | 'payments:verify'
  | 'pricing:read';

export type BranchStaffUser = {
  id: string;
  username: string | null;
  email: string | null;
  phoneNumber: string | null;
  city: string | null;
};

export type BranchStaffMember = {
  id: string;
  branchId: string;
  userId: string;
  staffRole: BranchStaffRole;
  permissions: BranchStaffPermission[];
  isActive: boolean;
  invitedBy: string | null;
  joinedAt: string | null;
  createdAt?: string;
  user?: BranchStaffUser;
};

export async function fetchBranchStaff(branchId: string): Promise<BranchStaffMember[]> {
  const res = await axiosInstance.get<ApiResponse<BranchStaffMember[]>>(
    `/branches/${branchId}/staff`,
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to load staff');
  }
  return res.data.data;
}

export type StaffLookupResult = {
  id: string;
  username: string | null;
  email: string | null;
  phoneNumber: string | null;
  role: 'admin' | 'owner' | 'user';
};

export async function lookupStaffInvitee({
  branchId,
  email,
  phoneNumber,
}: {
  branchId: string;
  email?: string;
  phoneNumber?: string;
}): Promise<StaffLookupResult | null> {
  const res = await axiosInstance.get<ApiResponse<StaffLookupResult | null>>(
    `/branches/${branchId}/staff/lookup`,
    { params: { email, phoneNumber } },
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Lookup failed');
  }
  return res.data.data;
}

export type UpsertBranchStaffInput = {
  branchId: string;
  userId: string;
  staffRole: BranchStaffRole;
  permissions?: BranchStaffPermission[];
  isActive?: boolean;
};

export async function upsertBranchStaff({
  branchId,
  userId,
  ...body
}: UpsertBranchStaffInput): Promise<BranchStaffMember> {
  const res = await axiosInstance.put<ApiResponse<BranchStaffMember>>(
    `/branches/${branchId}/staff/${userId}`,
    body,
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to save staff member');
  }
  return res.data.data;
}

export async function deactivateBranchStaff({
  branchId,
  userId,
}: {
  branchId: string;
  userId: string;
}): Promise<BranchStaffMember> {
  const res = await axiosInstance.delete<ApiResponse<BranchStaffMember>>(
    `/branches/${branchId}/staff/${userId}`,
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to deactivate staff member');
  }
  return res.data.data;
}

export const ALL_BRANCH_STAFF_PERMISSIONS: BranchStaffPermission[] = [
  'bookings:read',
  'bookings:manage',
  'checkins:read',
  'checkins:manage',
  'payments:verify',
  'pricing:read',
];

export const PERMISSION_LABEL: Record<BranchStaffPermission, string> = {
  'bookings:read': 'View bookings',
  'bookings:manage': 'Manage bookings',
  'checkins:read': 'View check-ins',
  'checkins:manage': 'Manage check-ins',
  'payments:verify': 'Verify payments',
  'pricing:read': 'View pricing',
};

export const ROLE_LABEL: Record<BranchStaffRole, string> = {
  manager: 'Manager',
  staff: 'Front desk',
  coach: 'Coach',
};
