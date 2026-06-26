'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store';

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (user?.role !== 'admin') {
      router.replace('/find-court');
    }
  }, [hydrated, isAuthenticated, router, user?.role]);

  if (!hydrated || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className='flex min-h-screen items-center justify-center text-sm text-gray-500'>
        Checking authorization...
      </div>
    );
  }

  return <>{children}</>;
}
