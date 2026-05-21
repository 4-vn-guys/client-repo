'use client';

import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Filter, Shield } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { StatCard } from '@/shared/ui/stat-card';
import { fetchConcurrencyData } from '@/entities/admin/api/platform-api';

export default function AdminConcurrencyPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-platform', 'concurrency'],
    queryFn: fetchConcurrencyData,
  });

  const stats = data?.stats;
  const tenants = data?.tenants ?? [];
  const policy = data?.globalPolicy ?? [];
  const observability = data?.observability ?? [];

  return (
    <div className='space-y-6 py-8'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Double-booking prevention</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Global lock strategy + per-tenant overrides · target: zero double bookings
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm' icon={<Filter className='size-3.5' />}>
            Region
          </Button>
          <Button variant='outline' size='sm'>Run simulation</Button>
          <Button size='sm'>Save policy</Button>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
        <StatCard label='Locks (24h)' value={stats?.locks24h ?? '—'} delta='peak Fri 18–20' />
        <StatCard label='Avg resolve' value={stats?.avgResolve ?? '—'} delta='P99 41ms' />
        <StatCard label='Conflicts stopped' value={stats?.conflictsStopped ?? '—'} delta='no impact' />
        <StatCard label='Double bookings' value={stats?.doubleBookings ?? '—'} delta='1 tenant' deltaDir='down' />
      </div>

      <div className='grid gap-6 lg:grid-cols-[1.35fr_1fr]'>
        {/* Tenant lock health table */}
        <Card className='gap-0 py-0'>
          <CardHeader className='flex-row items-center justify-between border-b px-4 py-3'>
            <CardTitle className='text-sm'>Tenant lock health</CardTitle>
            <span className='text-muted-foreground font-mono text-[11px]'>scope=booking.create</span>
          </CardHeader>
          <CardContent className='overflow-x-auto p-0'>
            {isLoading ? (
              <div className='text-muted-foreground p-8 text-center text-sm'>Loading…</div>
            ) : (
              <table className='w-full text-sm'>
                <thead>
                  <tr className='text-muted-foreground border-b text-left text-xs'>
                    <th className='px-4 py-2.5 font-semibold'>Tenant</th>
                    <th className='px-3 py-2.5 font-semibold'>Locks</th>
                    <th className='px-3 py-2.5 font-semibold'>P99 (ms)</th>
                    <th className='px-3 py-2.5 font-semibold'>Double</th>
                    <th className='px-3 py-2.5 font-semibold'>Mode</th>
                    <th className='w-8' />
                  </tr>
                </thead>
                <tbody>
                  {tenants.map(t => (
                    <tr key={t.name} className='hover:bg-muted/50 border-b last:border-b-0'>
                      <td className='px-4 py-3'>
                        <div className='flex items-center gap-2.5'>
                          <span
                            className='flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white'
                            style={{ background: t.color }}
                          >
                            {t.initials}
                          </span>
                          <span className='font-semibold'>{t.name}</span>
                        </div>
                      </td>
                      <td className='px-3 py-3 tabular-nums'>{t.locks}</td>
                      <td className='px-3 py-3'>
                        <span
                          className={`font-mono text-xs ${
                            t.p99 > 100 ? 'font-bold text-red-600' : 'text-muted-foreground'
                          }`}
                        >
                          {t.p99}
                        </span>
                      </td>
                      <td className='px-3 py-3'>
                        {t.doubleBookings > 0 ? (
                          <Badge variant='destructive'>{t.doubleBookings}</Badge>
                        ) : (
                          <Badge>0</Badge>
                        )}
                      </td>
                      <td className='px-3 py-3'>
                        <Badge variant='secondary' className='lowercase'>
                          {t.mode}
                        </Badge>
                      </td>
                      <td className='px-2 py-3'>
                        <Button variant='ghost' size='sm'>Override</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Right column: policies */}
        <div className='space-y-4'>
          {/* Global policy */}
          <Card>
            <CardHeader>
              <CardTitle className='text-sm'>Global policy</CardTitle>
            </CardHeader>
            <CardContent className='space-y-0'>
              {policy.map((r, i) => (
                <div
                  key={r.label}
                  className={`flex items-center justify-between py-2.5 text-xs ${
                    i > 0 ? 'border-t' : ''
                  }`}
                >
                  <span className='text-muted-foreground'>{r.label}</span>
                  <span className='font-bold'>{r.value}</span>
                </div>
              ))}
              {/* Auto-escalation alert */}
              <div className='mt-3 flex gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-500/20 dark:bg-red-500/5'>
                <Shield className='mt-0.5 size-4 shrink-0 text-red-600' />
                <div>
                  <p className='text-xs font-bold text-red-800 dark:text-red-400'>
                    Auto-escalation
                  </p>
                  <p className='mt-0.5 text-[11px] text-red-700 dark:text-red-300'>
                    If double bookings &gt; 0 in 24h: force strict mode + raise alert.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observability */}
          <Card>
            <CardHeader>
              <CardTitle className='text-sm'>Observability</CardTitle>
            </CardHeader>
            <CardContent className='space-y-0'>
              {observability.map((r, i) => (
                <div
                  key={r.label}
                  className={`flex items-center justify-between py-2.5 text-xs ${
                    i > 0 ? 'border-t' : ''
                  }`}
                >
                  <span className='text-muted-foreground'>{r.label}</span>
                  <span className='font-bold'>{r.value}</span>
                </div>
              ))}
              <Button
                variant='outline'
                size='sm'
                className='mt-3 w-full'
                icon={<ExternalLink className='size-3' />}
                iconPlacement='right'
              >
                Open traces
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
