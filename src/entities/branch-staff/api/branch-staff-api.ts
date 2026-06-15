import { axiosInstance } from '@/shared/lib/axios';

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export type SystemStaffRole = 'manager' | 'staff' | 'coach';

// Custom roles created in the admin RBAC catalog are also valid staff roles,
// so the role is an open string with autocomplete for the system roles.
export type BranchStaffRole = SystemStaffRole | (string & {});

export type StaffRoleOption = {
  id: string;
  name: string;
};

export type BranchStaffPermission =
  | 'dashboard:view'
  | 'bookings:read'
  | 'bookings:manage'
  | 'checkins:read'
  | 'checkins:manage'
  | 'payments:verify'
  | 'pricing:read';

export type StaffPermissionOption = {
  key: BranchStaffPermission;
  label: string;
};

export type BranchStaffUser = {
  id: string;
  username: string | null;
  email: string | null;
  phoneNumber: string | null;
  city: string | null;
};

export type BranchStaffStatus = 'invited' | 'active' | 'declined';

export type BranchStaffMember = {
  id: string;
  branchId: string;
  userId: string;
  staffRole: BranchStaffRole;
  permissions: BranchStaffPermission[];
  isActive: boolean;
  status?: BranchStaffStatus;
  respondedAt?: string | null;
  invitedBy: string | null;
  joinedAt: string | null;
  createdAt?: string;
  user?: BranchStaffUser;
};

export type MyStaffMembership = {
  branchId: string;
  branchName: string;
  staffRole: BranchStaffRole;
  roleName: string;
  permissions: BranchStaffPermission[];
};

// Active memberships of the current user across all branches. Permissions are
// effective values (role defaults already applied by the backend).
export async function fetchMyStaffMemberships(): Promise<MyStaffMembership[]> {
  const res = await axiosInstance.get<ApiResponse<MyStaffMembership[]>>(
    '/branches/my-staff-memberships',
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to load staff memberships');
  }
  return res.data.data;
}

export type StaffInvitation = {
  branchId: string;
  branchName: string;
  staffRole: BranchStaffRole;
  roleName: string;
  permissions: string[];
  invitedByName: string;
  invitedAt: string;
};

// Pending (not yet accepted/declined) staff invitations for the current user.
export async function fetchMyStaffInvitations(): Promise<StaffInvitation[]> {
  const res = await axiosInstance.get<ApiResponse<StaffInvitation[]>>(
    '/branches/my-staff-invitations',
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to load staff invitations');
  }
  return res.data.data;
}

export type StaffInvitationResponse = {
  branchId: string;
  status: 'active' | 'declined';
};

export async function acceptStaffInvitation(
  branchId: string,
): Promise<StaffInvitationResponse> {
  const res = await axiosInstance.post<ApiResponse<StaffInvitationResponse>>(
    `/branches/${branchId}/staff-invitation/accept`,
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to accept invitation');
  }
  return res.data.data;
}

export async function declineStaffInvitation(
  branchId: string,
): Promise<StaffInvitationResponse> {
  const res = await axiosInstance.post<ApiResponse<StaffInvitationResponse>>(
    `/branches/${branchId}/staff-invitation/decline`,
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to decline invitation');
  }
  return res.data.data;
}

// Assignable branch-op permission keys with catalog labels (owner|admin only).
export async function fetchStaffPermissions(): Promise<StaffPermissionOption[]> {
  const res = await axiosInstance.get<ApiResponse<StaffPermissionOption[]>>(
    '/branches/staff-permissions',
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to load staff permissions');
  }
  return res.data.data;
}

export async function fetchStaffRoles(): Promise<StaffRoleOption[]> {
  const res = await axiosInstance.get<ApiResponse<StaffRoleOption[]>>(
    '/branches/staff-roles',
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to load staff roles');
  }
  return res.data.data;
}

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
  'dashboard:view',
  'bookings:read',
  'bookings:manage',
  'checkins:read',
  'checkins:manage',
  'payments:verify',
  'pricing:read',
];

export const PERMISSION_LABEL: Record<BranchStaffPermission, string> = {
  'dashboard:view': 'Access dashboard',
  'bookings:read': 'View bookings',
  'bookings:manage': 'Manage bookings',
  'checkins:read': 'View check-ins',
  'checkins:manage': 'Manage check-ins',
  'payments:verify': 'Verify payments',
  'pricing:read': 'View pricing',
};

// Fallback when GET /branches/staff-permissions is unavailable.
export const FALLBACK_STAFF_PERMISSION_OPTIONS: StaffPermissionOption[] =
  ALL_BRANCH_STAFF_PERMISSIONS.map(key => ({
    key,
    label: PERMISSION_LABEL[key],
  }));

export const ROLE_LABEL: Record<SystemStaffRole, string> = {
  manager: 'Manager',
  staff: 'Front desk',
  coach: 'Coach',
};

// Fallback when GET /branches/staff-roles is unavailable.
export const SYSTEM_STAFF_ROLE_OPTIONS: StaffRoleOption[] = [
  { id: 'manager', name: ROLE_LABEL.manager },
  { id: 'staff', name: ROLE_LABEL.staff },
  { id: 'coach', name: ROLE_LABEL.coach },
];
