'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchBranchById } from '@/entities/venue';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { useAuthStore } from '@/shared/store';

export function BookPage({ branchId }: { branchId: string }) {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const { data: branch, isLoading } = useQuery({
    queryKey: ['branch', branchId],
    queryFn: () => fetchBranchById(branchId),
  });

  const canCreateBooking = useMemo(() => {
    if (!isAuthenticated) return false;
    return (
      user?.role === 'user' || user?.role === 'admin' || user?.role === 'owner'
    );
  }, [isAuthenticated, user?.role]);

  return (
    <div className='container mx-auto max-w-3xl space-y-4 px-4 py-6'>
      <h1 className='text-2xl font-bold'>Quick booking</h1>
      {isLoading ? (
        <Card>
          <CardContent className='p-4 text-sm'>
            Loading court details...
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{branch?.name ?? 'Court'}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4 text-sm'>
            <p>{branch?.address}</p>
            <p>
              Open: {branch?.openTime?.slice(0, 5) ?? '--:--'} -{' '}
              {branch?.closeTime?.slice(0, 5) ?? '--:--'}
            </p>

            {!canCreateBooking ? (
              <Button onClick={() => router.push('/login')} className='w-full'>
                Login to continue booking
              </Button>
            ) : (
              <Button
                onClick={() => router.push('/find-court')}
                className='w-full'
              >
                Continue to slot selection
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
