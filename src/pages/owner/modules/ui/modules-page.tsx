'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { CheckCircle2, Clock3, Landmark, Lock, Package } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
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
import { useAuthStore } from '@/shared/store';
import {
  createModuleOrder,
  fetchModuleCatalog,
  fetchMyModuleOrders,
  formatVnd,
  type FeatureCatalogModule,
  type ModuleOrder,
  type ModuleOrderStatus,
} from '@/entities/feature-module';

const CATALOG_KEY = ['owner-modules', 'catalog'] as const;
const ORDERS_KEY = ['owner-modules', 'orders'] as const;

const PLATFORM_BANK = {
  bank: 'VCB',
  accountNumber: '0123456789',
  accountName: 'BOOKMYCOURT JSC',
} as const;

export function OwnerModulesPage() {
  const t = useTranslations('OwnerModulesPage');
  const [unlockTarget, setUnlockTarget] = useState<FeatureCatalogModule | null>(
    null,
  );

  const catalogQuery = useQuery({
    queryKey: CATALOG_KEY,
    queryFn: fetchModuleCatalog,
    // Admin confirmation should flip the status live without a reload.
    refetchInterval: 10_000,
  });

  const ordersQuery = useQuery({
    queryKey: ORDERS_KEY,
    queryFn: fetchMyModuleOrders,
    refetchInterval: 10_000,
  });

  const modules = catalogQuery.data ?? [];
  const orders = ordersQuery.data ?? [];

  return (
    <div className='space-y-6 p-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>{t('title')}</h1>
        <p className='text-muted-foreground mt-1 text-sm'>{t('subtitle')}</p>
      </div>

      {catalogQuery.isLoading ? (
        <div className='text-muted-foreground py-12 text-center text-sm'>
          {t('loading')}
        </div>
      ) : catalogQuery.isError ? (
        <div className='py-12 text-center text-sm text-red-600'>
          {t('loadError')}
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {modules.map(m => (
            <ModuleCard
              key={m.id}
              module={m}
              onUnlock={() => setUnlockTarget(m)}
            />
          ))}
        </div>
      )}

      <OrderHistory orders={orders} isLoading={ordersQuery.isLoading} />

      <UnlockDialog
        module={unlockTarget}
        onOpenChange={open => {
          if (!open) setUnlockTarget(null);
        }}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: FeatureCatalogModule['status'] }) {
  const t = useTranslations('OwnerModulesPage');
  switch (status) {
    case 'active':
      return (
        <Badge className='border-transparent bg-green-100 text-green-800'>
          <CheckCircle2 />
          {t('statusActive')}
        </Badge>
      );
    case 'tier':
      return (
        <Badge className='border-transparent bg-blue-100 text-blue-800'>
          {t('statusTier')}
        </Badge>
      );
    case 'pending':
      return (
        <Badge className='border-transparent bg-amber-100 text-amber-800'>
          <Clock3 />
          {t('statusPending')}
        </Badge>
      );
    case 'enterprise':
      return (
        <Badge className='border-transparent bg-gray-200 text-gray-700'>
          {t('statusEnterprise')}
        </Badge>
      );
    default:
      return null;
  }
}

function ModuleCard({
  module: m,
  onUnlock,
}: {
  module: FeatureCatalogModule;
  onUnlock: () => void;
}) {
  const t = useTranslations('OwnerModulesPage');
  return (
    <Card
      className={`relative gap-3 p-5 transition-shadow hover:shadow-md ${
        m.isBestSeller ? 'ring-primary/30 ring-2' : ''
      }`}
    >
      {m.isBestSeller && (
        <Badge className='absolute top-3 right-3 bg-gradient-to-br from-amber-500 to-red-600 text-white'>
          ★ {t('bestSeller')}
        </Badge>
      )}
      <div className='bg-muted text-muted-foreground flex size-11 items-center justify-center rounded-xl'>
        <Package className='size-5' />
      </div>
      <div>
        <p className='text-sm font-bold'>{m.name}</p>
        <p className='text-muted-foreground mt-0.5 text-xs'>{m.description}</p>
      </div>
      <div className='flex items-center gap-2'>
        <Badge variant='outline' className='font-mono text-[10px]'>
          {m.category}
        </Badge>
        <StatusBadge status={m.status} />
      </div>
      <div className='mt-auto flex items-center justify-between pt-1'>
        <span className='text-lg font-bold tabular-nums'>
          {formatVnd(m.priceMonthlyVnd)}
          <span className='text-muted-foreground text-xs font-normal'>
            {t('perMonth')}
          </span>
        </span>
        {m.status === 'locked' && (
          <Button size='sm' icon={<Lock className='size-3.5' />} onClick={onUnlock}>
            {t('unlock')}
          </Button>
        )}
      </div>
    </Card>
  );
}

function OrderStatusBadge({ status }: { status: ModuleOrderStatus }) {
  const t = useTranslations('OwnerModulesPage');
  const map: Record<ModuleOrderStatus, { label: string; className: string }> = {
    pending_payment: {
      label: t('orderPendingPayment'),
      className: 'bg-gray-100 text-gray-700',
    },
    awaiting_confirmation: {
      label: t('orderAwaitingConfirmation'),
      className: 'bg-amber-100 text-amber-800',
    },
    active: { label: t('orderActive'), className: 'bg-green-100 text-green-800' },
    rejected: { label: t('orderRejected'), className: 'bg-red-100 text-red-700' },
    cancelled: {
      label: t('orderCancelled'),
      className: 'bg-gray-100 text-gray-500',
    },
  };
  const conf = map[status];
  return (
    <Badge className={`border-transparent ${conf.className}`}>{conf.label}</Badge>
  );
}

function OrderHistory({
  orders,
  isLoading,
}: {
  orders: ModuleOrder[];
  isLoading: boolean;
}) {
  const t = useTranslations('OwnerModulesPage');
  return (
    <Card className='gap-0 py-0'>
      <CardHeader className='border-b px-4 py-3'>
        <CardTitle className='text-sm'>{t('historyTitle')}</CardTitle>
      </CardHeader>
      <CardContent className='overflow-x-auto p-0'>
        {isLoading ? (
          <div className='text-muted-foreground p-8 text-center text-sm'>
            {t('loading')}
          </div>
        ) : orders.length === 0 ? (
          <div className='text-muted-foreground p-8 text-center text-sm'>
            {t('historyEmpty')}
          </div>
        ) : (
          <table className='w-full text-sm'>
            <thead>
              <tr className='text-muted-foreground border-b text-left text-xs'>
                <th className='px-4 py-2.5 font-semibold'>{t('colModule')}</th>
                <th className='px-3 py-2.5 font-semibold'>{t('colPrice')}</th>
                <th className='px-3 py-2.5 font-semibold'>{t('colStatus')}</th>
                <th className='px-3 py-2.5 font-semibold'>{t('colDate')}</th>
                <th className='px-3 py-2.5 font-semibold'>{t('colReason')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className='hover:bg-muted/50 border-b last:border-b-0'>
                  <td className='px-4 py-3 font-semibold'>{o.moduleName}</td>
                  <td className='px-3 py-3 tabular-nums'>
                    {formatVnd(o.priceVndSnapshot)}
                  </td>
                  <td className='px-3 py-3'>
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className='text-muted-foreground px-3 py-3 tabular-nums'>
                    {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className='text-muted-foreground px-3 py-3 text-xs'>
                    {o.status === 'rejected' ? (o.reason ?? '—') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}

function UnlockDialog({
  module: m,
  onOpenChange,
}: {
  module: FeatureCatalogModule | null;
  onOpenChange: (open: boolean) => void;
}) {
  if (!m) return null;
  return (
    <Dialog open={!!m} onOpenChange={onOpenChange}>
      <UnlockDialogContent key={m.id} module={m} onOpenChange={onOpenChange} />
    </Dialog>
  );
}

function UnlockDialogContent({
  module: m,
  onOpenChange,
}: {
  module: FeatureCatalogModule;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations('OwnerModulesPage');
  const qc = useQueryClient();
  const user = useAuthStore(state => state.user);
  const [transferRef, setTransferRef] = useState('');

  const transferNote = `${m.id} ${user?.email ?? ''}`.trim();

  const mutation = useMutation({
    mutationFn: createModuleOrder,
    onSuccess: () => {
      // Optimistically flip the card to pending so the owner gets instant feedback.
      qc.setQueryData<FeatureCatalogModule[]>(CATALOG_KEY, prev =>
        prev?.map(item =>
          item.id === m.id
            ? { ...item, status: 'pending', orderStatus: 'awaiting_confirmation' }
            : item,
        ),
      );
      qc.invalidateQueries({ queryKey: CATALOG_KEY });
      qc.invalidateQueries({ queryKey: ORDERS_KEY });
      toast.success(t('orderCreated'));
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message || t('orderFailed')),
  });

  return (
    <DialogContent className='sm:max-w-md'>
      <DialogHeader>
        <DialogTitle>{t('dialogTitle', { module: m.name })}</DialogTitle>
        <DialogDescription>{t('dialogDescription')}</DialogDescription>
      </DialogHeader>

      <div className='space-y-4'>
        <div className='bg-muted/50 flex items-center justify-between rounded-md p-3'>
          <span className='text-muted-foreground text-xs'>{t('colPrice')}</span>
          <span className='font-bold tabular-nums'>
            {formatVnd(m.priceMonthlyVnd)}
            <span className='text-muted-foreground text-xs font-normal'>
              {t('perMonth')}
            </span>
          </span>
        </div>

        <div className='space-y-2 rounded-md border p-3 text-xs'>
          <p className='flex items-center gap-1.5 font-semibold'>
            <Landmark className='size-3.5' />
            {t('bankInstructionsTitle')}
          </p>
          <dl className='grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5'>
            <dt className='text-muted-foreground'>{t('bank')}</dt>
            <dd className='font-semibold'>{PLATFORM_BANK.bank}</dd>
            <dt className='text-muted-foreground'>{t('accountNumber')}</dt>
            <dd className='font-mono font-semibold'>
              {PLATFORM_BANK.accountNumber}
            </dd>
            <dt className='text-muted-foreground'>{t('accountName')}</dt>
            <dd className='font-semibold'>{PLATFORM_BANK.accountName}</dd>
            <dt className='text-muted-foreground'>{t('transferNote')}</dt>
            <dd className='font-mono font-semibold break-all'>{transferNote}</dd>
          </dl>
        </div>

        <form
          id='unlock-module-form'
          className='space-y-1.5'
          onSubmit={e => {
            e.preventDefault();
            if (mutation.isPending) return;
            const trimmed = transferRef.trim();
            if (!trimmed) return;
            mutation.mutate({ moduleId: m.id, transferRef: trimmed });
          }}
        >
          <Label htmlFor='unlock-transfer-ref'>{t('transferRefLabel')}</Label>
          <Input
            id='unlock-transfer-ref'
            required
            autoFocus
            value={transferRef}
            onChange={e => setTransferRef(e.target.value)}
            placeholder={t('transferRefPlaceholder')}
          />
          <p className='text-muted-foreground text-[11px]'>
            {t('transferRefHint')}
          </p>
        </form>
      </div>

      <DialogFooter>
        <Button
          type='button'
          variant='outline'
          onClick={() => onOpenChange(false)}
          disabled={mutation.isPending}
        >
          {t('cancel')}
        </Button>
        <Button
          type='submit'
          form='unlock-module-form'
          isLoading={mutation.isPending}
        >
          {t('submitOrder')}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
