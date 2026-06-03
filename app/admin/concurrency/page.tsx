'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ExternalLink, Filter, Pencil, Play, Plus, Shield, Trash2 } from 'lucide-react';

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
  fetchConcurrencyData,
  runConcurrencySimulation,
  setTenantOverride,
  updateGlobalPolicy,
  type ConcurrencyTenant,
  type GlobalPolicy,
  type SimulationResult,
} from '@/entities/admin/api/platform-api';

const REGIONS = ['All', 'ap-southeast-1', 'ap-southeast-2', 'us-east-1'] as const;
type Region = (typeof REGIONS)[number];

export default function AdminConcurrencyPage() {
  const qc = useQueryClient();
  const [region, setRegion] = useState<Region>('All');
  const [editedPolicy, setEditedPolicy] = useState<GlobalPolicy[] | null>(null);
  const [policyEditOpen, setPolicyEditOpen] = useState(false);
  const [simulateOpen, setSimulateOpen] = useState(false);
  const [overrideTenant, setOverrideTenant] = useState<ConcurrencyTenant | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-platform', 'concurrency'],
    queryFn: fetchConcurrencyData,
  });

  const stats = data?.stats;
  const tenants = data?.tenants ?? [];
  const policy = useMemo(() => editedPolicy ?? data?.globalPolicy ?? [], [editedPolicy, data]);
  const observability = data?.observability ?? [];

  const isPolicyDirty =
    editedPolicy !== null &&
    JSON.stringify(editedPolicy) !== JSON.stringify(data?.globalPolicy ?? []);

  const savePolicyMutation = useMutation({
    mutationFn: updateGlobalPolicy,
    onSuccess: () => {
      toast.success('Policy saved');
      setEditedPolicy(null);
      qc.invalidateQueries({ queryKey: ['admin-platform', 'concurrency'] });
    },
    onError: (e: Error) => toast.error(e.message || 'Save failed'),
  });

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
          <Select value={region} onValueChange={v => setRegion(v as Region)}>
            <SelectTrigger className='h-8 w-auto px-3 text-xs'>
              <Filter className='size-3.5' />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map(r => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant='outline'
            size='sm'
            icon={<Play className='size-3.5' />}
            onClick={() => setSimulateOpen(true)}
          >
            Run simulation
          </Button>
          <Button
            size='sm'
            disabled={!isPolicyDirty || savePolicyMutation.isPending}
            isLoading={savePolicyMutation.isPending}
            onClick={() => editedPolicy && savePolicyMutation.mutate(editedPolicy)}
          >
            Save policy
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
        <StatCard label='Locks (24h)' value={stats?.locks24h ?? '—'} delta='peak Fri 18–20' />
        <StatCard label='Avg resolve' value={stats?.avgResolve ?? '—'} delta='P99 41ms' />
        <StatCard label='Conflicts stopped' value={stats?.conflictsStopped ?? '—'} delta='no impact' />
        <StatCard
          label='Double bookings'
          value={stats?.doubleBookings ?? '—'}
          delta='1 tenant'
          deltaDir='down'
        />
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
            ) : tenants.length === 0 ? (
              <div className='text-muted-foreground p-8 text-center text-sm'>
                No tenants for this region.
              </div>
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
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setOverrideTenant(t)}
                        >
                          Override
                        </Button>
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
            <CardHeader className='flex-row items-center justify-between'>
              <CardTitle className='text-sm'>Global policy</CardTitle>
              <Button
                variant='outline'
                size='sm'
                icon={<Pencil className='size-3' />}
                onClick={() => setPolicyEditOpen(true)}
                disabled={policy.length === 0}
              >
                Edit
              </Button>
            </CardHeader>
            <CardContent className='space-y-0'>
              {policy.map((r, i) => (
                <div
                  key={`${r.label}-${i}`}
                  className={`flex items-center justify-between py-2.5 text-xs ${
                    i > 0 ? 'border-t' : ''
                  }`}
                >
                  <span className='text-muted-foreground'>{r.label}</span>
                  <span className='font-bold'>{r.value}</span>
                </div>
              ))}
              {isPolicyDirty && (
                <p className='text-primary mt-2 text-[11px] font-semibold'>
                  Unsaved changes — click <em>Save policy</em> in the header.
                </p>
              )}
              {/* Auto-escalation alert */}
              <div className='mt-3 flex gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-500/20 dark:bg-red-500/5'>
                <Shield className='mt-0.5 size-4 shrink-0 text-red-600' />
                <div>
                  <p className='text-xs font-bold text-red-800 dark:text-red-400'>Auto-escalation</p>
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
                onClick={() => toast('Trace explorer is coming soon')}
              >
                Open traces
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <PolicyEditDialog
        open={policyEditOpen}
        onOpenChange={setPolicyEditOpen}
        initial={data?.globalPolicy ?? []}
        onApplyLocal={p => setEditedPolicy(p)}
      />
      <SimulationDialog open={simulateOpen} onOpenChange={setSimulateOpen} />
      <TenantOverrideDialog
        tenant={overrideTenant}
        onOpenChange={open => {
          if (!open) setOverrideTenant(null);
        }}
      />
    </div>
  );
}

function PolicyEditDialog({
  open,
  onOpenChange,
  initial,
  onApplyLocal,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: GlobalPolicy[];
  onApplyLocal: (rules: GlobalPolicy[]) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <PolicyEditDialogContent
          key={initial.map(r => `${r.label}=${r.value}`).join('|')}
          initial={initial}
          onOpenChange={onOpenChange}
          onApplyLocal={onApplyLocal}
        />
      )}
    </Dialog>
  );
}

function PolicyEditDialogContent({
  initial,
  onOpenChange,
  onApplyLocal,
}: {
  initial: GlobalPolicy[];
  onOpenChange: (v: boolean) => void;
  onApplyLocal: (rules: GlobalPolicy[]) => void;
}) {
  const [rules, setRules] = useState<GlobalPolicy[]>(initial);

  const update = (i: number, patch: Partial<GlobalPolicy>) =>
    setRules(rs => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const remove = (i: number) => setRules(rs => rs.filter((_, idx) => idx !== i));
  const add = () => setRules(rs => [...rs, { label: '', value: '' }]);

  return (
    <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Edit global lock policy</DialogTitle>
          <DialogDescription>
            Changes are staged locally. Use <strong>Save policy</strong> in the header to commit.
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-80 space-y-2 overflow-y-auto pr-1'>
          {rules.map((r, i) => (
            <div key={i} className='flex items-center gap-2'>
              <Input
                value={r.label}
                onChange={e => update(i, { label: e.target.value })}
                placeholder='Setting'
                className='flex-1'
              />
              <Input
                value={r.value}
                onChange={e => update(i, { value: e.target.value })}
                placeholder='Value'
                className='flex-1'
              />
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                onClick={() => remove(i)}
                aria-label='Remove'
              >
                <Trash2 className='size-4' />
              </Button>
            </div>
          ))}
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={add}
            icon={<Plus className='size-3' />}
          >
            Add setting
          </Button>
        </div>
        <DialogFooter>
          <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type='button'
            onClick={() => {
              const clean = rules.filter(r => r.label.trim() && r.value.trim());
              if (clean.length === 0) {
                toast.error('At least one setting is required');
                return;
              }
              onApplyLocal(clean);
              toast('Pending save — click "Save policy"');
              onOpenChange(false);
            }}
          >
            Stage changes
          </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function SimulationDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && <SimulationDialogContent onOpenChange={onOpenChange} />}
    </Dialog>
  );
}

function SimulationDialogContent({
  onOpenChange,
}: {
  onOpenChange: (v: boolean) => void;
}) {
  const [bookingsPerSecond, setBookingsPerSecond] = useState(50);
  const [durationSeconds, setDurationSeconds] = useState(60);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const mutation = useMutation({
    mutationFn: runConcurrencySimulation,
    onSuccess: setResult,
    onError: (e: Error) => toast.error(e.message || 'Simulation failed'),
  });

  return (
    <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Run lock simulation</DialogTitle>
          <DialogDescription>
            Synthetic load against the current policy. No bookings are actually written.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={e => {
            e.preventDefault();
            if (mutation.isPending) return;
            mutation.mutate({ bookingsPerSecond, durationSeconds });
          }}
          className='space-y-4'
        >
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1.5'>
              <Label htmlFor='sim-bps'>Bookings / sec</Label>
              <Input
                id='sim-bps'
                type='number'
                min={1}
                value={bookingsPerSecond}
                onChange={e => setBookingsPerSecond(Number(e.target.value))}
              />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='sim-sec'>Duration (s)</Label>
              <Input
                id='sim-sec'
                type='number'
                min={1}
                value={durationSeconds}
                onChange={e => setDurationSeconds(Number(e.target.value))}
              />
            </div>
          </div>

          {result && (
            <div className='space-y-2 rounded-md border bg-muted/30 p-3 text-xs'>
              <p className='font-semibold'>{result.summary}</p>
              <dl className='grid grid-cols-2 gap-y-1.5'>
                <dt className='text-muted-foreground'>Locks acquired</dt>
                <dd className='font-mono tabular-nums'>{result.locks.toLocaleString()}</dd>
                <dt className='text-muted-foreground'>Contention</dt>
                <dd className='font-mono'>{result.contention}</dd>
                <dt className='text-muted-foreground'>P99 latency</dt>
                <dd className='font-mono'>{result.p99Ms}ms</dd>
                <dt className='text-muted-foreground'>Double bookings</dt>
                <dd className='font-mono'>{result.doubleBookings}</dd>
                <dt className='text-muted-foreground'>Success rate</dt>
                <dd className='font-mono font-bold text-emerald-700'>{result.successRate}</dd>
              </dl>
            </div>
          )}

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Close
            </Button>
            <Button type='submit' isLoading={mutation.isPending} icon={<Play className='size-3.5' />}>
              {result ? 'Re-run' : 'Run'}
            </Button>
          </DialogFooter>
        </form>
    </DialogContent>
  );
}

function TenantOverrideDialog({
  tenant,
  onOpenChange,
}: {
  tenant: ConcurrencyTenant | null;
  onOpenChange: (v: boolean) => void;
}) {
  if (!tenant) return null;
  return (
    <Dialog open={!!tenant} onOpenChange={onOpenChange}>
      <TenantOverrideDialogContent
        key={tenant.name}
        tenant={tenant}
        onOpenChange={onOpenChange}
      />
    </Dialog>
  );
}

function TenantOverrideDialogContent({
  tenant,
  onOpenChange,
}: {
  tenant: ConcurrencyTenant;
  onOpenChange: (v: boolean) => void;
}) {
  const qc = useQueryClient();
  const [mode, setMode] = useState<'strict' | 'lenient'>(tenant.mode);
  const [ttl, setTtl] = useState<number>(8);

  const mutation = useMutation({
    mutationFn: setTenantOverride,
    onSuccess: () => {
      toast.success(`${tenant.name} override saved`);
      qc.invalidateQueries({ queryKey: ['admin-platform', 'concurrency'] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message || 'Save failed'),
  });

  return (
    <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Override · {tenant.name}</DialogTitle>
          <DialogDescription>
            Overrides apply only to this tenant. Auto-escalation can still force strict mode.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (mutation.isPending) return;
            mutation.mutate({
              name: tenant.name,
              mode,
              reservationTtlSeconds: ttl,
            });
          }}
          className='space-y-4'
        >
          <div className='space-y-1.5'>
            <Label htmlFor='override-mode'>Lock mode</Label>
            <Select value={mode} onValueChange={v => setMode(v as 'strict' | 'lenient')}>
              <SelectTrigger id='override-mode'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='strict'>strict · serializable, blocks on overlap</SelectItem>
                <SelectItem value='lenient'>lenient · optimistic, retries on conflict</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='override-ttl'>Reservation TTL (seconds)</Label>
            <Input
              id='override-ttl'
              type='number'
              min={1}
              value={ttl}
              onChange={e => setTtl(Number(e.target.value))}
            />
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
            <Button type='submit' isLoading={mutation.isPending}>
              Save override
            </Button>
          </DialogFooter>
        </form>
    </DialogContent>
  );
}
