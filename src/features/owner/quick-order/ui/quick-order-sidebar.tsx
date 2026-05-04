'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  fetchBranchProducts,
  createGoodsOrder,
  type CatalogProduct,
  type ProductCategory,
} from '@/entities/quick-order';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { cn } from '@/shared/lib/utils';
import { X, ShoppingBasket, CalendarDays } from 'lucide-react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

export type QuickOrderMode = 'court' | 'goods';

interface QuickOrderSidebarProps {
  branchId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestCourtBooking: () => void;
}

const CATEGORY_ORDER: ProductCategory[] = ['equipment', 'beverages', 'accessories'];

export function QuickOrderSidebar({
  branchId,
  open,
  onOpenChange,
  onRequestCourtBooking,
}: QuickOrderSidebarProps) {
  const t = useTranslations('QuickOrder');
  const [mode, setMode] = useState<QuickOrderMode>('goods');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [fulfillment, setFulfillment] = useState<'immediate' | 'pickup'>('immediate');
  const [payment, setPayment] = useState<'unpaid' | 'paid'>('unpaid');
  const [note, setNote] = useState('');
  const [customerLabel, setCustomerLabel] = useState('');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['branch-products', branchId],
    queryFn: () => fetchBranchProducts(branchId),
    enabled: open && mode === 'goods',
  });

  const grouped = useMemo(() => {
    const map = new Map<ProductCategory, CatalogProduct[]>();
    for (const c of CATEGORY_ORDER) map.set(c, []);
    for (const p of products) {
      const list = map.get(p.category) ?? [];
      list.push(p);
      map.set(p.category, list);
    }
    return map;
  }, [products]);

  const cartLines = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([productId, quantity]) => {
        const product = products.find((x) => x.id === productId);
        return {
          productId,
          quantity,
          name: product?.name ?? '',
          unitPrice: product?.unitPrice ?? 0,
          lineTotal: (product?.unitPrice ?? 0) * quantity,
        };
      });
  }, [cart, products]);

  const subtotal = useMemo(
    () => cartLines.reduce((s, l) => s + l.lineTotal, 0),
    [cartLines],
  );

  const mutation = useMutation({
    mutationFn: createGoodsOrder,
    onSuccess: (order) => {
      toast.success(t('orderCreated', { code: order.invoiceCode }));
      setCart({});
      setNote('');
      setCustomerLabel('');
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      const msg =
        err && typeof err === 'object' && 'message' in err && typeof err.message === 'string'
          ? err.message
          : t('orderFailed');
      toast.error(msg);
    },
  });

  const setQty = (productId: string, qty: number) => {
    setCart((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[productId];
      else next[productId] = qty;
      return next;
    });
  };

  const handleSubmitGoods = () => {
    const items = cartLines.map((l) => ({
      productId: l.productId,
      quantity: l.quantity,
    }));
    if (items.length === 0) {
      toast.error(t('emptyCart'));
      return;
    }

    mutation.mutate({
      branchId,
      fulfillmentType: fulfillment,
      items,
      note: note.trim() || undefined,
      customerLabel: customerLabel.trim() || undefined,
      statusPayment: payment,
    });
  };

  if (!open) return null;

  return (
    <>
      <button
        type='button'
        className='fixed inset-0 z-40 bg-black/50'
        aria-label={t('close')}
        onClick={() => onOpenChange(false)}
      />

      <aside className='fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background shadow-2xl'>
        <header className='flex shrink-0 items-start justify-between gap-3 border-b px-4 py-4'>
          <div>
            <h2 className='text-lg font-semibold'>{t('title')}</h2>
            <p className='text-muted-foreground text-sm'>{t('subtitle')}</p>
          </div>
          <Button type='button' variant='ghost' size='icon' onClick={() => onOpenChange(false)}>
            <X className='size-5' />
            <span className='sr-only'>{t('close')}</span>
          </Button>
        </header>

        <div className='border-b px-4 py-3'>
          <div className='bg-muted/60 flex rounded-lg p-1'>
            <button
              type='button'
              onClick={() => setMode('court')}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                mode === 'court'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <CalendarDays className='size-4 shrink-0' />
              {t('modeCourt')}
            </button>
            <button
              type='button'
              onClick={() => setMode('goods')}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                mode === 'goods'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <ShoppingBasket className='size-4 shrink-0' />
              {t('modeGoods')}
            </button>
          </div>
        </div>

        <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
          {mode === 'court' ? (
            <div className='flex flex-1 flex-col gap-4 overflow-y-auto p-4'>
              <p className='text-muted-foreground text-sm leading-relaxed'>{t('courtHelp')}</p>
              <Button
                type='button'
                className='w-full'
                onClick={() => {
                  onRequestCourtBooking();
                  onOpenChange(false);
                }}
              >
                <CalendarDays className='mr-2 size-4' />
                {t('openCourtBooking')}
              </Button>
            </div>
          ) : (
            <>
              <div className='flex-1 overflow-y-auto px-4 py-4'>
                {isLoading ? (
                  <p className='text-muted-foreground text-sm'>{t('loadingCatalog')}</p>
                ) : (
                  <div className='space-y-8'>
                    {CATEGORY_ORDER.map((cat) => {
                      const items = grouped.get(cat) ?? [];
                      if (items.length === 0) return null;
                      return (
                        <section key={cat}>
                          <h3 className='mb-3 text-xs font-semibold tracking-wide text-violet-600 uppercase'>
                            {t(`category.${cat}`)}
                          </h3>
                          <ul className='space-y-3'>
                            {items.map((p) => (
                              <li
                                key={p.id}
                                className='flex items-start justify-between gap-3 rounded-lg border border-border/80 bg-card px-3 py-3'
                              >
                                <div className='min-w-0'>
                                  <p className='font-medium leading-snug'>{p.name}</p>
                                  {p.description ? (
                                    <p className='text-muted-foreground mt-0.5 text-xs'>
                                      {p.description}
                                    </p>
                                  ) : null}
                                  <p className='mt-1 text-sm tabular-nums text-muted-foreground'>
                                    {t('each', {
                                      price: p.unitPrice.toLocaleString(undefined, {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2,
                                      }),
                                    })}
                                  </p>
                                </div>
                                <div className='flex shrink-0 items-center gap-2'>
                                  <Input
                                    type='number'
                                    min={0}
                                    className='h-9 w-16 text-center tabular-nums'
                                    value={cart[p.id] ?? ''}
                                    placeholder='0'
                                    onChange={(e) => {
                                      const v = parseInt(e.target.value, 10);
                                      setQty(p.id, Number.isFinite(v) ? v : 0);
                                    }}
                                  />
                                </div>
                              </li>
                            ))}
                          </ul>
                        </section>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className='border-t bg-muted/20 px-4 py-4'>
                <h3 className='mb-3 text-xs font-semibold tracking-wide uppercase'>
                  {t('fulfillmentSection')}
                </h3>
                <div className='flex flex-wrap gap-3'>
                  <label className='flex cursor-pointer items-center gap-2 text-sm'>
                    <input
                      type='radio'
                      name='fulfillment'
                      checked={fulfillment === 'immediate'}
                      onChange={() => setFulfillment('immediate')}
                    />
                    {t('fulfillmentImmediate')}
                  </label>
                  <label className='flex cursor-pointer items-center gap-2 text-sm'>
                    <input
                      type='radio'
                      name='fulfillment'
                      checked={fulfillment === 'pickup'}
                      onChange={() => setFulfillment('pickup')}
                    />
                    {t('fulfillmentPickup')}
                  </label>
                </div>

                <h3 className='mt-6 mb-3 text-xs font-semibold tracking-wide uppercase'>
                  {t('paymentSection')}
                </h3>
                <p className='text-muted-foreground mb-2 text-xs'>{t('paymentHint')}</p>
                <div className='flex flex-wrap gap-3'>
                  <label className='flex cursor-pointer items-center gap-2 text-sm'>
                    <input
                      type='radio'
                      name='payment'
                      checked={payment === 'unpaid'}
                      onChange={() => setPayment('unpaid')}
                    />
                    {t('paymentUnpaid')}
                  </label>
                  <label className='flex cursor-pointer items-center gap-2 text-sm'>
                    <input
                      type='radio'
                      name='payment'
                      checked={payment === 'paid'}
                      onChange={() => setPayment('paid')}
                    />
                    {t('paymentPaid')}
                  </label>
                </div>

                <div className='mt-6 space-y-2'>
                  <label className='text-sm font-medium' htmlFor='qo-customer'>
                    {t('customerLabel')}
                  </label>
                  <Input
                    id='qo-customer'
                    value={customerLabel}
                    onChange={(e) => setCustomerLabel(e.target.value)}
                    placeholder={t('customerPlaceholder')}
                  />
                </div>

                <div className='mt-4 space-y-2'>
                  <label className='text-sm font-medium' htmlFor='qo-note'>
                    {t('notes')}
                  </label>
                  <textarea
                    id='qo-note'
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={t('notesPlaceholder')}
                    className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none'
                  />
                </div>

                <div className='mt-6 flex items-center justify-between border-t border-border pt-4'>
                  <span className='text-sm font-medium'>{t('total')}</span>
                  <span className='text-lg font-semibold tabular-nums'>
                    {subtotal.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <Button
                  type='button'
                  className='mt-4 w-full'
                  disabled={mutation.isPending || cartLines.length === 0}
                  onClick={handleSubmitGoods}
                >
                  {mutation.isPending ? t('submitting') : t('submitGoods')}
                </Button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
