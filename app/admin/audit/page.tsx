'use client';

import { useQuery } from '@tanstack/react-query';
import { Download, ExternalLink, Filter } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/shared/ui/card';
import { StatCard } from '@/shared/ui/stat-card';
import { fetchAuditLogs } from '@/entities/admin/api/platform-api';

function severityBadge(sev: 'info' | 'warn' | 'crit') {
  const map = {
    info: 'outline' as const,
    warn: 'secondary' as const,
    crit: 'destructive' as const,
  };
  return (
    <Badge variant={map[sev]} className='font-mono text-[10px]'>
      {sev}
    </Badge>
  );
}

export default function AdminAuditPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-platform', 'audit'],
    queryFn: fetchAuditLogs,
  });

  const stats = data?.stats;
  const events = data?.events ?? [];

  return (
    <div className='space-y-6 py-8'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>Audit logs</h1>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm' icon={<Filter className='size-3.5' />}>
            Filters · 3
          </Button>
          <Button variant='outline' size='sm' icon={<Download className='size-3.5' />}>
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
        <StatCard label='Events (24h)' value={stats?.events24h ?? '—'} delta='0.3% errors' />
        <StatCard label='Concurrency saves' value={stats?.concurrencySaves ?? '—'} delta='zero double-bookings' />
        <StatCard label='Failed auth' value={stats?.failedAuth ?? '—'} delta='rate-limited' />
        <StatCard label='Avg lock-resolve' value={stats?.avgLockResolve ?? '—'} delta='P99 41ms' />
      </div>

      {/* Audit log table */}
      <Card className='gap-0 py-0'>
        <CardHeader className='flex-row items-center gap-2.5 border-b px-4 py-2.5'>
          <span className='relative flex size-2'>
            <span className='absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75' />
            <span className='relative inline-flex size-2 rounded-full bg-emerald-500' />
          </span>
          <span className='text-xs font-semibold'>Live · streaming</span>
          <span className='text-muted-foreground text-xs'>· 16 events/sec</span>
          <span className='text-muted-foreground ml-auto font-mono text-[11px]'>
            tenant=* action=* severity≥info
          </span>
        </CardHeader>
        <CardContent className='overflow-x-auto p-0'>
          {isLoading ? (
            <div className='text-muted-foreground p-8 text-center text-sm'>Loading logs…</div>
          ) : (
            <table className='w-full text-xs'>
              <thead>
                <tr className='text-muted-foreground border-b text-left'>
                  <th className='px-3 py-2.5 font-semibold'>Sev</th>
                  <th className='px-3 py-2.5 font-semibold'>Time</th>
                  <th className='px-3 py-2.5 font-semibold'>Tenant</th>
                  <th className='px-3 py-2.5 font-semibold'>Actor</th>
                  <th className='px-3 py-2.5 font-semibold'>Action</th>
                  <th className='px-3 py-2.5 font-semibold'>Target</th>
                  <th className='px-3 py-2.5 font-semibold'>IP</th>
                  <th className='w-8' />
                </tr>
              </thead>
              <tbody>
                {events.map((e, i) => (
                  <tr key={i} className='hover:bg-muted/50 border-b last:border-b-0'>
                    <td className='px-3 py-2.5'>{severityBadge(e.severity)}</td>
                    <td className='px-3 py-2.5 font-mono'>
                      <div>{e.timestamp}</div>
                      <div className='text-muted-foreground text-[10px]'>{e.relativeTime}</div>
                    </td>
                    <td className='px-3 py-2.5'>
                      {e.tenant === '—' ? (
                        <span className='text-muted-foreground'>—</span>
                      ) : e.tenant === 'platform' ? (
                        <Badge variant='default'>platform</Badge>
                      ) : (
                        e.tenant
                      )}
                    </td>
                    <td className='px-3 py-2.5'>{e.actor}</td>
                    <td className='px-3 py-2.5'>
                      <span
                        className={`font-mono ${
                          e.severity === 'crit'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-primary'
                        }`}
                      >
                        {e.action}
                      </span>
                    </td>
                    <td className='text-muted-foreground px-3 py-2.5'>{e.target}</td>
                    <td className='text-muted-foreground px-3 py-2.5 font-mono text-[10px]'>
                      {e.ip}
                    </td>
                    <td className='px-2 py-2.5'>
                      <Button variant='ghost' size='icon-sm'>
                        <ExternalLink className='size-3' />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
