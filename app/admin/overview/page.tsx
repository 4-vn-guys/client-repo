'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Check,
  ExternalLink,
  Filter,
  Plus,
  Search,
  X,
} from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { StatCard } from '@/shared/ui/stat-card';
import {
  fetchPlatformStats,
  fetchTopTenants,
  onboardTenant,
  type OnboardTenantInput,
  type TenantSummary,
} from '@/entities/admin/api/platform-api';

const ONBOARDING_STEPS = [
  { n: 1, label: 'Owner sign-up & verify', detail: 'Email + phone OTP', time: '0:32', done: true },
  { n: 2, label: 'Tenant + branding', detail: 'Subdomain · logo · colors', time: '1:15', done: true },
  { n: 3, label: 'Add courts & hours', detail: 'Surface, base rate, schedule', time: '2:08', done: true },
  { n: 4, label: 'Payment & payout', detail: 'Stripe Connect / VietQR', time: '0:42', done: true },
  { n: 5, label: 'Invite staff', detail: 'Front desk + coach roles', time: '0:18', done: false },
  { n: 6, label: 'Go live', detail: 'Listed on player discovery map', time: 'auto', done: false },
];

const PLAN_FILTERS = ['All', 'Starter', 'Pro', 'Enterprise'] as const;
type PlanFilter = (typeof PLAN_FILTERS)[number];

function planVariant(plan: string) {
  if (plan === 'Enterprise') return 'default';
  if (plan === 'Pro') return 'secondary';
  return 'outline';
}

export default function AdminOverviewPage() {
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [planFilter, setPlanFilter] = useState<PlanFilter>('All');
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const statsQuery = useQuery({
    queryKey: ['admin-platform', 'stats'],
    queryFn: fetchPlatformStats,
  });

  const tenantsQuery = useQuery({
    queryKey: ['admin-platform', 'tenants'],
    queryFn: fetchTopTenants,
  });

  const stats = statsQuery.data;
  const allTenants = tenantsQuery.data ?? [];

  const tenants = allTenants.filter(t => {
    if (planFilter !== 'All' && t.plan !== planFilter) return false;
    if (search.trim() && !t.name.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <div className='space-y-6 py-8'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <p className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
            You&apos;re looking at the whole platform
          </p>
          <h1 className='mt-1 text-2xl font-bold tracking-tight'>
            {stats
              ? `${stats.totalTenants} tenants · ${stats.activePlayers.toLocaleString()} active players`
              : 'Loading platform data…'}
          </h1>
        </div>
        <Button
          size='sm'
          icon={<Plus className='size-4' />}
          onClick={() => setOnboardOpen(true)}
        >
          Onboard tenant
        </Button>
      </div>

      {/* Stat Cards */}
      <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
        <StatCard
          label='Monthly recurring'
          value={stats?.mrr ?? '—'}
          delta='11% MoM'
        />
        <StatCard
          label='Module attach rate'
          value={stats?.moduleAttachRate ?? '—'}
          delta='6 pts'
        />
        <StatCard
          label='Bookings (24h)'
          value={stats ? stats.bookings24h.toLocaleString() : '—'}
          delta='409 vs avg'
        />
        <StatCard
          label='Avg onboarding'
          value={stats?.avgOnboardingMin ?? '—'}
          delta='under 5 SLA'
        />
      </div>

      <div className='grid gap-6 lg:grid-cols-[1.4fr_1fr]'>
        {/* Tenant Directory Table */}
        <Card className='gap-0 py-0'>
          <CardHeader className='flex-row items-center justify-between border-b px-4 py-3'>
            <CardTitle className='text-sm'>Tenants · top-active</CardTitle>
            <div className='flex items-center gap-2'>
              {searchOpen ? (
                <div className='flex items-center gap-1'>
                  <Input
                    autoFocus
                    placeholder='Search…'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className='h-8 w-40 text-xs'
                  />
                  <Button
                    variant='ghost'
                    size='icon-sm'
                    onClick={() => {
                      setSearch('');
                      setSearchOpen(false);
                    }}
                    aria-label='Close search'
                  >
                    <X className='size-3.5' />
                  </Button>
                </div>
              ) : (
                <>
                  <Select value={planFilter} onValueChange={v => setPlanFilter(v as PlanFilter)}>
                    <SelectTrigger className='h-8 w-auto px-2 text-xs'>
                      <Filter className='size-3' />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLAN_FILTERS.map(p => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant='outline'
                    size='icon-sm'
                    onClick={() => setSearchOpen(true)}
                    aria-label='Search tenants'
                  >
                    <Search className='size-3.5' />
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className='overflow-x-auto p-0'>
            {tenantsQuery.isLoading ? (
              <div className='text-muted-foreground p-8 text-center text-sm'>Loading…</div>
            ) : tenants.length === 0 ? (
              <div className='text-muted-foreground p-8 text-center text-sm'>
                No tenants match the current filters.
              </div>
            ) : (
              <TenantTable tenants={tenants} />
            )}
          </CardContent>
        </Card>

        {/* Onboarding Wizard Preview */}
        <Card>
          <CardHeader>
            <CardTitle className='text-sm'>Self-service onboarding</CardTitle>
            <p className='text-muted-foreground text-xs'>Provisioning runs in &lt; 5 min</p>
          </CardHeader>
          <CardContent className='space-y-0'>
            {ONBOARDING_STEPS.map((s, i) => (
              <div
                key={s.n}
                className={`flex gap-3 py-3 ${i > 0 ? 'border-t' : ''}`}
              >
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    s.done
                      ? 'bg-emerald-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s.done ? <Check className='size-3' strokeWidth={3} /> : s.n}
                </span>
                <div className='min-w-0 flex-1'>
                  <div className='text-sm font-semibold'>{s.label}</div>
                  <div className='text-muted-foreground text-xs'>{s.detail}</div>
                </div>
                <span className='text-muted-foreground shrink-0 font-mono text-[11px]'>
                  {s.time}
                </span>
              </div>
            ))}
            <Button
              className='mt-4 w-full'
              size='sm'
              onClick={() => setOnboardOpen(true)}
            >
              Open wizard
            </Button>
          </CardContent>
        </Card>
      </div>

      <OnboardTenantDialog open={onboardOpen} onOpenChange={setOnboardOpen} />
    </div>
  );
}

function TenantTable({ tenants }: { tenants: TenantSummary[] }) {
  return (
    <table className='w-full text-sm'>
      <thead>
        <tr className='text-muted-foreground border-b text-left text-xs'>
          <th className='px-4 py-2.5 font-semibold'>Tenant</th>
          <th className='px-3 py-2.5 font-semibold'>Plan</th>
          <th className='px-3 py-2.5 font-semibold'>Modules</th>
          <th className='px-3 py-2.5 font-semibold'>Bookings/d</th>
          <th className='px-3 py-2.5 font-semibold'>MRR</th>
          <th className='px-3 py-2.5 font-semibold'>Health</th>
          <th className='w-8' />
        </tr>
      </thead>
      <tbody>
        {tenants.map(t => (
          <tr key={t.id} className='hover:bg-muted/50 border-b last:border-b-0'>
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
            <td className='px-3 py-3'>
              <Badge variant={planVariant(t.plan)}>{t.plan}</Badge>
            </td>
            <td className='px-3 py-3 tabular-nums'>{t.modules}</td>
            <td className='px-3 py-3 tabular-nums'>{t.bookingsPerDay}</td>
            <td className='px-3 py-3 font-semibold tabular-nums'>{t.mrr}</td>
            <td className='px-3 py-3'>
              <div className='flex items-center gap-2'>
                <div className='bg-muted h-1.5 w-14 overflow-hidden rounded-full'>
                  <div
                    className='h-full rounded-full transition-all'
                    style={{
                      width: `${t.healthScore * 100}%`,
                      backgroundColor:
                        t.healthScore > 0.85
                          ? '#10b981'
                          : t.healthScore > 0.6
                            ? '#f59e0b'
                            : '#ef4444',
                    }}
                  />
                </div>
                <span className='text-muted-foreground text-[11px] tabular-nums'>
                  {Math.round(t.healthScore * 100)}
                </span>
              </div>
            </td>
            <td className='px-2 py-3'>
              <Button variant='ghost' size='icon-sm' asChild>
                <Link href={`/admin/owners/${t.id}`} aria-label={`Open ${t.name}`}>
                  <ExternalLink className='size-3.5' />
                </Link>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OnboardTenantDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<OnboardTenantInput>({
    name: '',
    email: '',
    plan: 'Starter',
  });

  const mutation = useMutation({
    mutationFn: onboardTenant,
    onSuccess: result => {
      toast.success(`${result.name} onboarded · ${result.plan} plan`);
      qc.invalidateQueries({ queryKey: ['admin-platform'] });
      setForm({ name: '', email: '', plan: 'Starter' });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message || 'Onboarding failed'),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Onboard new tenant</DialogTitle>
          <DialogDescription>
            Provision a workspace · default plan creates the owner account immediately.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (mutation.isPending) return;
            mutation.mutate(form);
          }}
          className='space-y-4'
        >
          <div className='space-y-1.5'>
            <Label htmlFor='tenant-name'>Tenant name</Label>
            <Input
              id='tenant-name'
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder='Saigon Sports Hub'
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='tenant-email'>Owner email</Label>
            <Input
              id='tenant-email'
              type='email'
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder='owner@example.com'
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='tenant-plan'>Plan</Label>
            <Select
              value={form.plan}
              onValueChange={v => setForm(f => ({ ...f, plan: v }))}
            >
              <SelectTrigger id='tenant-plan'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Starter'>Starter</SelectItem>
                <SelectItem value='Pro'>Pro</SelectItem>
                <SelectItem value='Enterprise'>Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type='submit' isLoading={mutation.isPending} icon={<Plus className='size-4' />}>
              Onboard
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
