'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store';
import { useStaffAccess } from '../model/use-staff-access';

export function OwnerRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { canViewDashboard, isLoading: staffLoading } = useStaffAccess();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setHydrated(true);
  }, []);

  const isOwnerOrAdmin = user?.role === 'owner' || user?.role === 'admin';
  const isUserRole = user?.role === 'user';

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (isOwnerOrAdmin) return;

    // Role 'user' may still have branch staff memberships — wait for the
    // membership check, then require the 'dashboard:view' permission.
    if (isUserRole) {
      if (staffLoading) return;
      if (!canViewDashboard) router.replace('/find-court');
      return;
    }

    router.replace('/find-court');
  }, [
    hydrated,
    isAuthenticated,
    isOwnerOrAdmin,
    isUserRole,
    canViewDashboard,
    staffLoading,
    router,
  ]);

  const allowed =
    isOwnerOrAdmin || (isUserRole && !staffLoading && canViewDashboard);

  if (!hydrated || !isAuthenticated || !allowed) {
    return (
      <div className='flex min-h-screen items-center justify-center text-sm text-gray-500'>
        Checking authorization...
      </div>
    );
  }

  return <>{children}</>;
}
