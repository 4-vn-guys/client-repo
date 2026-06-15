'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/store';
import {
  fetchMyStaffInvitations,
  type StaffInvitation,
} from '@/entities/branch-staff/api';

/**
 * Pending staff invitations for the current user. Only account role 'user'
 * can be invited as branch staff, so the query never runs for owners/admins.
 */
export function useStaffInvitations() {
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const enabled = isAuthenticated && user?.role === 'user';

  const query = useQuery({
    queryKey: ['my-staff-invitations', user?.id],
    queryFn: fetchMyStaffInvitations,
    enabled,
    staleTime: 30_000,
    retry: 1,
  });

  const invitations: StaffInvitation[] = enabled ? (query.data ?? []) : [];

  return {
    invitations,
    hasPending: invitations.length > 0,
    isLoading: enabled ? query.isLoading : false,
  };
}
