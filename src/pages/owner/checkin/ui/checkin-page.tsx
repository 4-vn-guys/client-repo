'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { QrCode, RefreshCcw, ScanLine } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  fetchTodayCheckins,
  resolveCheckinToken,
  type Checkin,
  type CheckinStatus,
} from '@/entities/checkin/api';
import { useActiveVenue } from '@/widgets/owner/venue-switcher';

const STATUS_VARIANT: Record<
  CheckinStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  in: 'default',
  late: 'secondary',
  no_show: 'destructive',
};

const STATUS_LABEL: Record<CheckinStatus, string> = {
  in: 'on time',
  late: 'late',
  no_show: 'no-show',
};

export function OwnerCheckinPage() {
  const { activeVenueId, activeVenue, isLoading: venueLoading } = useActiveVenue();
  const qc = useQueryClient();
  const [token, setToken] = useState('');

  const listQuery = useQuery({
    queryKey: ['owner-checkins', activeVenueId],
    queryFn: () => fetchTodayCheckins(activeVenueId as string),
    enabled: !!activeVenueId,
    refetchInterval: 30 * 1000, // light polling so newly resolved tokens appear
  });

  const resolveMutation = useMutation({
    mutationFn: resolveCheckinToken,
    onSuccess: data => {
      toast.success(`Checked in · ${data.customerName} (${data.courtLabel})`);
      setToken('');
      qc.invalidateQueries({ queryKey: ['owner-checkins', activeVenueId] });
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to resolve token'),
  });

  if (venueLoading) {
    return <div className='text-muted-foreground p-8 text-sm'>Loading venue…</div>;
  }
  if (!activeVenueId) {
    return (
      <div className='p-8 text-sm'>No active venue. Pick one from the sidebar.</div>
    );
  }

  const checkins = listQuery.data ?? [];

  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Check-in</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Resolve booking QR tokens at the front desk for{' '}
            <strong>{activeVenue?.name}</strong>.
          </p>
        </div>
        <Button
          variant='outline'
          icon={<RefreshCcw className='size-3.5' />}
          onClick={() => listQuery.refetch()}
          disabled={listQuery.isFetching}
        >
          Refresh
        </Button>
      </div>

      <div className='grid gap-6 lg:grid-cols-[1fr_1.4fr]'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-sm'>
              <ScanLine className='size-4' /> Resolve QR token
            </CardTitle>
            <CardDescription>
              Scan or paste the token from a player&apos;s booking confirmation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={e => {
                e.preventDefault();
                const trimmed = token.trim();
                if (!trimmed) {
                  toast.error('Token is required');
                  return;
                }
                if (resolveMutation.isPending) return;
                resolveMutation.mutate({ branchId: activeVenueId, token: trimmed });
              }}
              className='space-y-3'
            >
              <div className='space-y-1.5'>
                <Label htmlFor='c-token'>Booking token</Label>
                <Input
                  id='c-token'
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  placeholder='Paste the QR token here'
                  autoComplete='off'
                  autoFocus
                />
              </div>
              <Button
                type='submit'
                isLoading={resolveMutation.isPending}
                icon={<QrCode className='size-3.5' />}
                className='w-full'
              >
                Resolve & check in
              </Button>
            </form>
            <p className='text-muted-foreground mt-3 text-[11px]'>
              A successful resolve records the check-in and marks the booking detail
              as <span className='font-mono'>in / late</span> based on time vs slot.
            </p>
          </CardContent>
        </Card>

        <Card className='gap-0 py-0'>
          <CardHeader className='border-b'>
            <CardTitle className='text-sm'>Today&apos;s check-ins</CardTitle>
            <CardDescription>
              {checkins.length} entries · auto-refreshes every 30s
            </CardDescription>
          </CardHeader>
          <CardContent className='p-0'>
            {listQuery.isLoading ? (
              <div className='text-muted-foreground p-6 text-sm'>Loading…</div>
            ) : listQuery.isError ? (
              <div className='p-6 text-sm text-red-600'>
                {(listQuery.error as Error).message}
              </div>
            ) : checkins.length === 0 ? (
              <div className='text-muted-foreground p-6 text-sm'>
                No check-ins yet today.
              </div>
            ) : (
              <div className='divide-y'>
                {checkins.map(c => (
                  <CheckinRow key={c.id} checkin={c} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CheckinRow({ checkin }: { checkin: Checkin }) {
  const time = new Date(checkin.checkedInAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <div className='flex items-start gap-3 p-4'>
      <div className='bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-full font-mono text-[11px]'>
        {time}
      </div>
      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='truncate font-semibold'>{checkin.customerName}</span>
          <Badge variant='outline'>{checkin.courtLabel}</Badge>
          <Badge variant={STATUS_VARIANT[checkin.status]} className='capitalize'>
            {STATUS_LABEL[checkin.status]}
          </Badge>
        </div>
        {checkin.note && (
          <div className='text-muted-foreground mt-1 text-xs'>{checkin.note}</div>
        )}
      </div>
    </div>
  );
}
