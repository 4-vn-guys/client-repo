'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/store';
import {
  fetchMyStaffMemberships,
  type MyStaffMembership,
} from '@/entities/branch-staff/api';

/**
 * Membership-based RBAC for branch staff (account role 'user').
 * Owners/admins never fetch: they are not "staff" — their access is governed
 * by the coarse role checks and module gates instead.
 */
export function useStaffAccess() {
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const enabled = isAuthenticated && user?.role === 'user';

  const query = useQuery({
    queryKey: ['my-staff-memberships', user?.id],
    queryFn: fetchMyStaffMemberships,
    enabled,
    staleTime: 30_000,
    retry: 1,
  });

  const memberships: MyStaffMembership[] = useMemo(
    () => (enabled ? (query.data ?? []) : []),
    [enabled, query.data],
  );

  // Union of effective permissions across every active membership.
  const permissionSet = useMemo(
    () => new Set<string>(memberships.flatMap(m => m.permissions)),
    [memberships],
  );

  return {
    memberships,
    permissionSet,
    /** Any active membership — use for staff-flavoured UX (e.g. invitations). */
    isStaff: memberships.length > 0,
    /** Dashboard access is its own RBAC permission, not implied by membership. */
    canViewDashboard: memberships.some(m =>
      m.permissions.includes('dashboard:view'),
    ),
    isLoading: enabled ? query.isLoading : false,
    /** Non-null when the membership lookup itself failed (network/5xx). */
    error: enabled ? (query.error ?? null) : null,
  };
}
