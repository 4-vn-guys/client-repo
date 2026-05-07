'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

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
import {
  fetchRevenueDaily,
  fetchRevenueSummary,
} from '@/entities/admin/api/revenue-api';

function isoStartOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString();
}

function isoAddDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x.toISOString();
}

function formatMoney(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

export default function AdminRevenuePage() {
  const now = useMemo(() => new Date(), []);
  const defaultFrom = useMemo(
    () => isoStartOfDay(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)),
    [now]
  );
  const defaultTo = useMemo(() => isoAddDays(now, 1), [now]);

  const [from, setFrom] = useState(defaultFrom.slice(0, 10));
  const [to, setTo] = useState(defaultTo.slice(0, 10));
  const [ownerId, setOwnerId] = useState('');
  const [branchId, setBranchId] = useState('');

  const params = useMemo(() => {
    const fromIso = new Date(from).toISOString();
    // Treat `to` as inclusive date; query uses < to so add 1 day
    const toIso = isoAddDays(new Date(to), 1);
    return {
      from: fromIso,
      to: toIso,
      ownerId: ownerId.trim() || undefined,
      branchId: branchId.trim() || undefined,
    };
  }, [from, to, ownerId, branchId]);

  const summaryQuery = useQuery({
    queryKey: ['admin-revenue', 'summary', params],
    queryFn: () => fetchRevenueSummary(params),
  });

  const dailyQuery = useQuery({
    queryKey: ['admin-revenue', 'daily', params],
    queryFn: () => fetchRevenueDaily(params),
  });

  return (
    <div className='container mx-auto max-w-6xl space-y-6 py-8'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Revenue</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Bookings + Pro Shop totals with platform fee and net.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Use ownerId / branchId to narrow reporting (optional).
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='grid gap-1'>
            <label className='text-sm font-medium'>From</label>
            <Input
              type='date'
              value={from}
              onChange={e => setFrom(e.target.value)}
            />
          </div>
          <div className='grid gap-1'>
            <label className='text-sm font-medium'>To</label>
            <Input
              type='date'
              value={to}
              onChange={e => setTo(e.target.value)}
            />
          </div>
          <div className='grid gap-1'>
            <label className='text-sm font-medium'>Owner ID</label>
            <Input
              value={ownerId}
              onChange={e => setOwnerId(e.target.value)}
              placeholder='uuid (optional)'
            />
          </div>
          <div className='grid gap-1'>
            <label className='text-sm font-medium'>Branch ID</label>
            <Input
              value={branchId}
              onChange={e => setBranchId(e.target.value)}
              placeholder='uuid (optional)'
            />
          </div>
          <div className='sm:col-span-2 lg:col-span-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                summaryQuery.refetch();
                dailyQuery.refetch();
              }}
            >
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>
            GMV / platform fee / net across bookings and pro shop.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {summaryQuery.isLoading ? (
            <div className='text-muted-foreground text-sm'>Loading…</div>
          ) : summaryQuery.isError ? (
            <div className='text-sm text-red-600'>
              Failed to load revenue summary.
            </div>
          ) : (
            <div className='grid gap-4 sm:grid-cols-3'>
              {(() => {
                const data = summaryQuery.data!;
                return [
                  { title: 'Bookings', data: data.bookings },
                  { title: 'Pro Shop', data: data.proShop },
                  { title: 'Total', data: data.total },
                ].map(row => (
                  <div
                    key={row.title}
                    className='border-border/60 rounded-lg border p-4'
                  >
                    <div className='flex items-center justify-between'>
                      <p className='text-muted-foreground text-xs font-medium uppercase'>
                        {row.title}
                      </p>
                      <Badge variant='outline'>GMV</Badge>
                    </div>
                    <p className='mt-2 text-xl font-semibold'>
                      {formatMoney(row.data.gmv)}
                    </p>
                    <div className='text-muted-foreground mt-2 space-y-1 text-xs'>
                      <div className='flex items-center justify-between'>
                        <span>Platform fee</span>
                        <span className='font-medium'>
                          {formatMoney(row.data.platformFee)}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span>Net</span>
                        <span className='font-medium'>
                          {formatMoney(row.data.net)}
                        </span>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily breakdown</CardTitle>
          <CardDescription>
            Combined totals per day. (Bookings and Pro Shop are shown
            separately.)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dailyQuery.isLoading ? (
            <div className='text-muted-foreground text-sm'>Loading…</div>
          ) : dailyQuery.isError ? (
            <div className='text-sm text-red-600'>
              Failed to load daily revenue.
            </div>
          ) : (
            (() => {
              const data = dailyQuery.data!;
              return (
                <div className='overflow-x-auto'>
                  <table className='w-full border-collapse text-sm'>
                    <thead>
                      <tr className='text-muted-foreground border-b text-left'>
                        <th className='py-2 pr-4 font-medium'>Day</th>
                        <th className='py-2 pr-4 font-medium'>
                          Bookings (GMV)
                        </th>
                        <th className='py-2 pr-4 font-medium'>
                          Pro Shop (GMV)
                        </th>
                        <th className='py-2 pr-4 font-medium'>Total (GMV)</th>
                        <th className='py-2 pr-0 text-right font-medium'>
                          Net
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.days.map(d => (
                        <tr key={d.day} className='border-b last:border-b-0'>
                          <td className='py-3 pr-4 font-medium'>{d.day}</td>
                          <td className='py-3 pr-4'>
                            {formatMoney(d.bookings.gmv)}
                          </td>
                          <td className='py-3 pr-4'>
                            {formatMoney(d.proShop.gmv)}
                          </td>
                          <td className='py-3 pr-4'>
                            {formatMoney(d.total.gmv)}
                          </td>
                          <td className='py-3 pr-0 text-right font-medium'>
                            {formatMoney(d.total.net)}
                          </td>
                        </tr>
                      ))}
                      {data.days.length === 0 ? (
                        <tr>
                          <td
                            className='text-muted-foreground py-8 text-center text-sm'
                            colSpan={5}
                          >
                            No data for this date range.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              );
            })()
          )}
        </CardContent>
      </Card>
    </div>
  );
}
