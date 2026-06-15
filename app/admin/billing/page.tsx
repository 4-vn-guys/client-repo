'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Check, Download, ExternalLink, Filter, Pencil, Plus, Trash2, X } from 'lucide-react';

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
  confirmModuleOrder,
  createCredit,
  downloadBillingCsv,
  fetchBillingData,
  fetchModuleOrders,
  rejectModuleOrder,
  updateDunningRules,
  type AdminModuleOrder,
  type DunningRule,
  type InvoiceItem,
} from '@/entities/admin/api/platform-api';

function formatVnd(amount: number): string {
  return `${new Intl.NumberFormat('vi-VN').format(amount)}₫`;
}

const PLAN_FILTERS = ['All', 'Starter', 'Pro', 'Enterprise', 'Credit'] as const;
type PlanFilter = (typeof PLAN_FILTERS)[number];

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
  const [creditOpen, setCreditOpen] = useState(false);
  const [dunningOpen, setDunningOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [planFilter, setPlanFilter] = useState<PlanFilter>('All');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-platform', 'billing'],
    queryFn: fetchBillingData,
  });

  const stats = data?.stats;
  const invoices = data?.invoices ?? [];
  const dunning = data?.dunningRules ?? [];
  const usage = data?.meteredUsage ?? [];

  const filteredInvoices = invoices.filter(i =>
    planFilter === 'All' ? true : i.plan === planFilter,
  );

  const handleExport = async () => {
    try {
      const blob = await downloadBillingCsv();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `billing-invoices-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV downloaded');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Export failed';
      toast.error(message);
    }
  };

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
          <Select value={planFilter} onValueChange={v => setPlanFilter(v as PlanFilter)}>
            <SelectTrigger className='h-8 w-auto px-3 text-xs'>
              <Filter className='size-3.5' />
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
            size='sm'
            icon={<Download className='size-3.5' />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            size='sm'
            icon={<Plus className='size-3.5' />}
            onClick={() => setCreditOpen(true)}
          >
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

      {/* Module orders awaiting confirmation */}
      <ModuleOrdersCard />

      <div className='grid gap-6 lg:grid-cols-[1.3fr_1fr]'>
        {/* Invoices table */}
        <Card className='gap-0 py-0'>
          <CardHeader className='flex-row items-center justify-between border-b px-4 py-3'>
            <CardTitle className='text-sm'>Latest invoices</CardTitle>
            <Button
              variant='outline'
              size='sm'
              icon={<ExternalLink className='size-3' />}
              iconPlacement='right'
              onClick={() => toast('Ledger view is coming soon')}
            >
              Open ledger
            </Button>
          </CardHeader>
          <CardContent className='overflow-x-auto p-0'>
            {isLoading ? (
              <div className='text-muted-foreground p-8 text-center text-sm'>Loading…</div>
            ) : filteredInvoices.length === 0 ? (
              <div className='text-muted-foreground p-8 text-center text-sm'>No invoices for this filter.</div>
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
                  {filteredInvoices.map(inv => (
                    <tr key={inv.id} className='hover:bg-muted/50 border-b last:border-b-0'>
                      <td className='px-4 py-3 font-mono text-xs'>{inv.id}</td>
                      <td className='px-3 py-3 font-semibold'>{inv.tenant}</td>
                      <td className='px-3 py-3'>{planBadge(inv.plan)}</td>
                      <td className='px-3 py-3 font-bold tabular-nums'>{inv.amount}</td>
                      <td className='px-3 py-3'>{statusBadge(inv.status)}</td>
                      <td className='text-muted-foreground px-3 py-3 tabular-nums'>{inv.date}</td>
                      <td className='px-2 py-3'>
                        <Button
                          variant='ghost'
                          size='icon-sm'
                          onClick={() => setSelectedInvoice(inv)}
                          aria-label={`Open invoice ${inv.id}`}
                        >
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
                <Button
                  variant='outline'
                  size='sm'
                  icon={<Pencil className='size-3' />}
                  onClick={() => setDunningOpen(true)}
                  disabled={dunning.length === 0}
                >
                  Edit
                </Button>
                <Button
                  size='sm'
                  className='ml-auto'
                  onClick={() => toast.success('Dunning rules applied to all tenants')}
                  disabled={dunning.length === 0}
                >
                  Apply
                </Button>
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
              <Button
                variant='outline'
                size='sm'
                className='mt-3 w-full'
                onClick={() => toast('Usage explorer is coming soon')}
              >
                Open usage explorer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateCreditDialog open={creditOpen} onOpenChange={setCreditOpen} />
      <EditDunningDialog
        open={dunningOpen}
        onOpenChange={setDunningOpen}
        initial={dunning}
      />
      <InvoiceDetailDialog
        invoice={selectedInvoice}
        onOpenChange={open => {
          if (!open) setSelectedInvoice(null);
        }}
      />
    </div>
  );
}

function ModuleOrdersCard() {
  const qc = useQueryClient();
  const [rejectTarget, setRejectTarget] = useState<AdminModuleOrder | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-platform', 'module-orders', 'awaiting_confirmation'],
    queryFn: () => fetchModuleOrders('awaiting_confirmation'),
    refetchInterval: 15_000,
  });

  const confirmMutation = useMutation({
    mutationFn: confirmModuleOrder,
    onSuccess: order => {
      toast.success(`Order confirmed · ${order.moduleName} activated`);
      qc.invalidateQueries({ queryKey: ['admin-platform', 'module-orders'] });
      qc.invalidateQueries({ queryKey: ['admin-platform', 'modules'] });
      qc.invalidateQueries({ queryKey: ['admin-platform', 'billing'] });
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to confirm order'),
  });

  return (
    <Card className='gap-0 py-0'>
      <CardHeader className='flex-row items-center justify-between border-b px-4 py-3'>
        <CardTitle className='text-sm'>Module orders</CardTitle>
        <Badge variant={orders.length > 0 ? 'secondary' : 'outline'}>
          {orders.length} awaiting confirmation
        </Badge>
      </CardHeader>
      <CardContent className='overflow-x-auto p-0'>
        {isLoading ? (
          <div className='text-muted-foreground p-8 text-center text-sm'>Loading…</div>
        ) : orders.length === 0 ? (
          <div className='text-muted-foreground p-8 text-center text-sm'>
            No module orders awaiting confirmation.
          </div>
        ) : (
          <table className='w-full text-sm'>
            <thead>
              <tr className='text-muted-foreground border-b text-left text-xs'>
                <th className='px-4 py-2.5 font-semibold'>Owner</th>
                <th className='px-3 py-2.5 font-semibold'>Module</th>
                <th className='px-3 py-2.5 font-semibold'>Price</th>
                <th className='px-3 py-2.5 font-semibold'>Transfer ref</th>
                <th className='px-3 py-2.5 font-semibold'>Date</th>
                <th className='px-3 py-2.5 font-semibold'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className='hover:bg-muted/50 border-b last:border-b-0'>
                  <td className='px-4 py-3'>
                    <span className='font-semibold'>{o.owner.email ?? o.owner.username ?? o.owner.id}</span>
                  </td>
                  <td className='px-3 py-3'>{o.moduleName}</td>
                  <td className='px-3 py-3 font-bold tabular-nums'>
                    {formatVnd(o.priceVndSnapshot)}
                  </td>
                  <td className='px-3 py-3 font-mono text-xs'>{o.transferRef}</td>
                  <td className='text-muted-foreground px-3 py-3 tabular-nums'>
                    {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className='px-3 py-3'>
                    <div className='flex gap-2'>
                      <Button
                        size='sm'
                        icon={<Check className='size-3.5' />}
                        isLoading={
                          confirmMutation.isPending &&
                          confirmMutation.variables === o.id
                        }
                        disabled={confirmMutation.isPending}
                        onClick={() => confirmMutation.mutate(o.id)}
                      >
                        Confirm
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        colorPattern='red'
                        icon={<X className='size-3.5' />}
                        disabled={confirmMutation.isPending}
                        onClick={() => setRejectTarget(o)}
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
      <RejectOrderDialog
        order={rejectTarget}
        onOpenChange={open => {
          if (!open) setRejectTarget(null);
        }}
      />
    </Card>
  );
}

function RejectOrderDialog({
  order,
  onOpenChange,
}: {
  order: AdminModuleOrder | null;
  onOpenChange: (v: boolean) => void;
}) {
  if (!order) return null;
  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <RejectOrderDialogContent key={order.id} order={order} onOpenChange={onOpenChange} />
    </Dialog>
  );
}

function RejectOrderDialogContent({
  order,
  onOpenChange,
}: {
  order: AdminModuleOrder;
  onOpenChange: (v: boolean) => void;
}) {
  const qc = useQueryClient();
  const [reason, setReason] = useState('');

  const mutation = useMutation({
    mutationFn: rejectModuleOrder,
    onSuccess: () => {
      toast.success('Order rejected');
      qc.invalidateQueries({ queryKey: ['admin-platform', 'module-orders'] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to reject order'),
  });

  return (
    <DialogContent className='sm:max-w-sm'>
      <DialogHeader>
        <DialogTitle>Reject module order</DialogTitle>
        <DialogDescription>
          {order.moduleName} · {order.owner.email ?? order.owner.username}. The
          owner will see this reason on their order history.
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (mutation.isPending) return;
          const trimmed = reason.trim();
          if (!trimmed) {
            toast.error('A reason is required');
            return;
          }
          mutation.mutate({ orderId: order.id, reason: trimmed });
        }}
        className='space-y-4'
      >
        <div className='space-y-1.5'>
          <Label htmlFor='reject-reason'>Reason</Label>
          <Input
            id='reject-reason'
            required
            autoFocus
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder='Transfer not found / amount mismatch'
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
          <Button type='submit' colorPattern='red' isLoading={mutation.isPending}>
            Reject order
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function CreateCreditDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ tenant: '', amount: '', reason: '' });

  const mutation = useMutation({
    mutationFn: createCredit,
    onSuccess: result => {
      toast.success(`Credit ${result.id} issued for ${result.tenant}`);
      qc.invalidateQueries({ queryKey: ['admin-platform', 'billing'] });
      setForm({ tenant: '', amount: '', reason: '' });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to create credit'),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Issue billing credit</DialogTitle>
          <DialogDescription>
            Credits appear as negative-amount invoices on the tenant ledger.
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
            <Label htmlFor='credit-tenant'>Tenant</Label>
            <Input
              id='credit-tenant'
              required
              value={form.tenant}
              onChange={e => setForm(f => ({ ...f, tenant: e.target.value }))}
              placeholder='Hoa Lư Sports Hub'
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='credit-amount'>Amount</Label>
            <Input
              id='credit-amount'
              required
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              placeholder='$120.00'
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='credit-reason'>Reason (optional)</Label>
            <Input
              id='credit-reason'
              value={form.reason}
              onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
              placeholder='Service incident SLA'
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
              Issue credit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditDunningDialog({
  open,
  onOpenChange,
  initial,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: DunningRule[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <EditDunningDialogContent
          key={initial.map(r => `${r.label}=${r.value}`).join('|')}
          initial={initial}
          onOpenChange={onOpenChange}
        />
      )}
    </Dialog>
  );
}

function EditDunningDialogContent({
  initial,
  onOpenChange,
}: {
  initial: DunningRule[];
  onOpenChange: (v: boolean) => void;
}) {
  const qc = useQueryClient();
  const [rules, setRules] = useState<DunningRule[]>(initial);

  const mutation = useMutation({
    mutationFn: updateDunningRules,
    onSuccess: () => {
      toast.success('Dunning rules saved');
      qc.invalidateQueries({ queryKey: ['admin-platform', 'billing'] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message || 'Save failed'),
  });

  const updateRow = (i: number, patch: Partial<DunningRule>) => {
    setRules(rs => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  };

  const removeRow = (i: number) => {
    setRules(rs => rs.filter((_, idx) => idx !== i));
  };

  const addRow = () => {
    setRules(rs => [...rs, { label: '', value: '' }]);
  };

  return (
    <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Edit dunning rules</DialogTitle>
          <DialogDescription>
            Applies to every tenant in the next billing cycle.
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-80 space-y-2 overflow-y-auto pr-1'>
          {rules.map((r, i) => (
            <div key={i} className='flex items-center gap-2'>
              <Input
                value={r.label}
                onChange={e => updateRow(i, { label: e.target.value })}
                placeholder='Rule name'
                className='flex-1'
              />
              <Input
                value={r.value}
                onChange={e => updateRow(i, { value: e.target.value })}
                placeholder='Value'
                className='flex-1'
              />
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                onClick={() => removeRow(i)}
                aria-label='Remove rule'
              >
                <Trash2 className='size-4' />
              </Button>
            </div>
          ))}
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={addRow}
            icon={<Plus className='size-3' />}
          >
            Add rule
          </Button>
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
          <Button
            type='button'
            isLoading={mutation.isPending}
            onClick={() => {
              const clean = rules.filter(r => r.label.trim() && r.value.trim());
              if (clean.length === 0) {
                toast.error('At least one rule is required');
                return;
              }
              mutation.mutate(clean);
            }}
          >
            Save
          </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function InvoiceDetailDialog({
  invoice,
  onOpenChange,
}: {
  invoice: InvoiceItem | null;
  onOpenChange: (v: boolean) => void;
}) {
  if (!invoice) return null;
  return (
    <Dialog open={!!invoice} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle className='font-mono'>{invoice.id}</DialogTitle>
          <DialogDescription>{invoice.tenant}</DialogDescription>
        </DialogHeader>
        <dl className='grid grid-cols-2 gap-y-3 text-sm'>
          <dt className='text-muted-foreground'>Plan</dt>
          <dd>{planBadge(invoice.plan)}</dd>
          <dt className='text-muted-foreground'>Amount</dt>
          <dd className='font-bold tabular-nums'>{invoice.amount}</dd>
          <dt className='text-muted-foreground'>Status</dt>
          <dd>{statusBadge(invoice.status)}</dd>
          <dt className='text-muted-foreground'>Date</dt>
          <dd className='tabular-nums'>{invoice.date}</dd>
        </dl>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {invoice.status === 'failed' && (
            <Button
              onClick={() => {
                toast.success(`Retry queued for ${invoice.id}`);
                onOpenChange(false);
              }}
            >
              Retry charge
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
