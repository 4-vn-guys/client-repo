'use client';

import { useQuery } from '@tanstack/react-query';
import { Download, ExternalLink, Filter, Plus } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { StatCard } from '@/shared/ui/stat-card';
import { fetchBillingData } from '@/entities/admin/api/platform-api';

function statusBadge(status: 'paid' | 'due' | 'failed') {
  const map = {
    paid: 'default' as const,
    due: 'secondary' as const,
    failed: 'destructive' as const,
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}

function planBadge(plan: string) {
  if (plan === 'Enterprise') return <Badge variant='default'>{plan}</Badge>;
  if (plan === 'Pro') return <Badge variant='secondary'>{plan}</Badge>;
  return <Badge variant='outline'>{plan}</Badge>;
}

export default function AdminBillingPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-platform', 'billing'],
    queryFn: fetchBillingData,
  });

  const stats = data?.stats;
  const invoices = data?.invoices ?? [];
  const dunning = data?.dunningRules ?? [];
  const usage = data?.meteredUsage ?? [];

  return (
    <div className='space-y-6 py-8'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Revenue & billing ops</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Invoices, dunning, credits, metered usage · all tenants
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm' icon={<Filter className='size-3.5' />}>
            Plan
          </Button>
          <Button variant='outline' size='sm' icon={<Download className='size-3.5' />}>
            Export
          </Button>
          <Button size='sm' icon={<Plus className='size-3.5' />}>
            Create credit
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
        <StatCard label='MRR' value={stats?.mrr ?? '—'} delta='11% MoM' />
        <StatCard label='Collections' value={stats?.collections ?? '—'} delta='on target' />
        <StatCard label='Past-due' value={stats?.pastDue ?? '—'} delta='3 tenants' deltaDir='down' />
        <StatCard label='Churn risk' value={stats?.churnRisk ?? '—'} delta='steady' />
      </div>

      <div className='grid gap-6 lg:grid-cols-[1.3fr_1fr]'>
        {/* Invoices table */}
        <Card className='gap-0 py-0'>
          <CardHeader className='flex-row items-center justify-between border-b px-4 py-3'>
            <CardTitle className='text-sm'>Latest invoices</CardTitle>
            <Button variant='outline' size='sm' icon={<ExternalLink className='size-3' />} iconPlacement='right'>
              Open ledger
            </Button>
          </CardHeader>
          <CardContent className='overflow-x-auto p-0'>
            {isLoading ? (
              <div className='text-muted-foreground p-8 text-center text-sm'>Loading…</div>
            ) : (
              <table className='w-full text-sm'>
                <thead>
                  <tr className='text-muted-foreground border-b text-left text-xs'>
                    <th className='px-4 py-2.5 font-semibold'>Invoice</th>
                    <th className='px-3 py-2.5 font-semibold'>Tenant</th>
                    <th className='px-3 py-2.5 font-semibold'>Plan</th>
                    <th className='px-3 py-2.5 font-semibold'>Amount</th>
                    <th className='px-3 py-2.5 font-semibold'>Status</th>
                    <th className='px-3 py-2.5 font-semibold'>Date</th>
                    <th className='w-8' />
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id} className='hover:bg-muted/50 border-b last:border-b-0'>
                      <td className='px-4 py-3 font-mono text-xs'>{inv.id}</td>
                      <td className='px-3 py-3 font-semibold'>{inv.tenant}</td>
                      <td className='px-3 py-3'>{planBadge(inv.plan)}</td>
                      <td className='px-3 py-3 font-bold tabular-nums'>{inv.amount}</td>
                      <td className='px-3 py-3'>{statusBadge(inv.status)}</td>
                      <td className='text-muted-foreground px-3 py-3 tabular-nums'>{inv.date}</td>
                      <td className='px-2 py-3'>
                        <Button variant='ghost' size='icon-sm'>
                          <ExternalLink className='size-3.5' />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Right column */}
        <div className='space-y-4'>
          {/* Dunning Rules */}
          <Card>
            <CardHeader className='flex-row items-center justify-between'>
              <CardTitle className='text-sm'>Dunning rules</CardTitle>
              <Badge>active</Badge>
            </CardHeader>
            <CardContent className='space-y-0'>
              {dunning.map((r, i) => (
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
              <div className='flex gap-2 pt-3'>
                <Button variant='outline' size='sm'>Edit</Button>
                <Button size='sm' className='ml-auto'>Apply</Button>
              </div>
            </CardContent>
          </Card>

          {/* Metered Usage */}
          <Card>
            <CardHeader>
              <CardTitle className='text-sm'>Metered usage (24h)</CardTitle>
            </CardHeader>
            <CardContent className='space-y-0'>
              {usage.map((m, i) => (
                <div
                  key={m.label}
                  className={`flex items-center gap-3 py-3 ${
                    i > 0 ? 'border-t' : ''
                  }`}
                >
                  <div
                    className='size-2 shrink-0 rounded-full'
                    style={{ backgroundColor: m.color }}
                  />
                  <span className='text-muted-foreground flex-1 text-xs'>{m.label}</span>
                  <span className='text-muted-foreground font-mono text-xs'>{m.value}</span>
                </div>
              ))}
              <Button variant='outline' size='sm' className='mt-3 w-full'>
                Open usage explorer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
