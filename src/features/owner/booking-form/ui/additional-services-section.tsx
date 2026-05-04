'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBranchProducts, type CatalogProduct } from '@/entities/quick-order';
import { ProductCard } from '@/features/owner/pro-shop/ui/product-card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { cn } from '@/shared/lib/utils';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { BookingGoodLine } from '@/entities/booking';

export type GoodLineForm = BookingGoodLine & { id: string };

function formatMoney(n: number, locale: string) {
  return n.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function newEmptyGoodLine(): GoodLineForm {
  return { id: crypto.randomUUID(), name: '', quantity: 1, unitPrice: 0 };
}

export function toGoodsPayload(lines: GoodLineForm[]): BookingGoodLine[] {
  return lines
    .filter((l) => l.name.trim().length > 0)
    .map((l) => ({
      ...(l.productId ? { productId: l.productId } : {}),
      name: l.name.trim(),
      quantity: Math.max(1, Math.floor(Number(l.quantity)) || 1),
      unitPrice: Math.max(0, Number(l.unitPrice) || 0),
    }));
}

interface AdditionalServicesSectionProps {
  isOwnerRole: boolean;
  goods: GoodLineForm[];
  onGoodsChange: (next: GoodLineForm[]) => void;
  note: string;
  onNoteChange: (note: string) => void;
  isLoading: boolean;
  isEditMode: boolean;
  noteError?: string;
  /** When set, order summary is shown (owner). */
  courtRental: number;
  goodsSubtotal: number;
  totalAmount: number;
  locale: string;
  /** Enables Pro Shop catalog chips (pre-order with inventory reserve). */
  branchId?: string;
}

export function AdditionalServicesSection({
  isOwnerRole,
  goods,
  onGoodsChange,
  note,
  onNoteChange,
  isLoading,
  isEditMode,
  noteError,
  courtRental,
  goodsSubtotal,
  totalAmount,
  locale,
  branchId,
}: AdditionalServicesSectionProps) {
  const tBookingForm = useTranslations('BookingForm');
  const [open, setOpen] = useState(false);

  const { data: catalog = [] } = useQuery({
    queryKey: ['branch-products', branchId],
    queryFn: () => fetchBranchProducts(branchId!),
    enabled: Boolean(branchId) && isOwnerRole,
  });

  const addFromCatalog = (p: CatalogProduct, qty: number) => {
    const row: GoodLineForm = {
      id: crypto.randomUUID(),
      productId: p.id,
      name: p.name,
      quantity: Math.max(1, qty),
      unitPrice: p.unitPrice,
    };
    onGoodsChange([...goods, row]);
    setOpen(true);
  };

  const addLine = (insertAfterIndex?: number) => {
    const row = newEmptyGoodLine();
    if (insertAfterIndex === undefined) {
      onGoodsChange([...goods, row]);
    } else {
      const next = [...goods];
      next.splice(insertAfterIndex + 1, 0, row);
      onGoodsChange(next);
    }
  };

  const updateLine = (index: number, patch: Partial<GoodLineForm>) => {
    const next = goods.map((g, i) => (i === index ? { ...g, ...patch } : g));
    onGoodsChange(next);
  };

  const removeLine = (index: number) => {
    onGoodsChange(goods.filter((_, i) => i !== index));
  };

  if (!isOwnerRole) {
    return (
      <div className='space-y-4 border-t pt-6'>
        <h3 className='text-sm font-semibold tracking-wide text-violet-600 uppercase'>
          {tBookingForm('extrasAndNotes')}
        </h3>
        <div className='space-y-2'>
          <textarea
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder={tBookingForm('notePlaceholder')}
            rows={3}
            className='w-full resize-none rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-violet-500 focus:outline-none'
          />
          {noteError && <p className='text-destructive text-sm'>{noteError}</p>}
        </div>
        <Button
          type='submit'
          disabled={isLoading}
          className='w-full bg-violet-600 py-6 text-base font-semibold text-white hover:bg-violet-700'
        >
          {isLoading
            ? isEditMode
              ? tBookingForm('updatingBooking')
              : tBookingForm('creatingBooking')
            : isEditMode
              ? tBookingForm('updateBooking')
              : tBookingForm('createBooking')}
        </Button>
      </div>
    );
  }

  const goodsLineCount = goods.length;

  return (
    <div className='space-y-4 border-t pt-6'>
      {/* Expandable goods — before summary so users add lines then see totals */}
      <div className='rounded-lg border border-border'>
        <button
          type='button'
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className='flex w-full items-start justify-between gap-3 px-4 py-3 text-left hover:bg-muted/40'
        >
          <div className='min-w-0 flex-1'>
            <span className='text-sm font-semibold tracking-wide text-violet-600 uppercase'>
              {tBookingForm('additionalServicesGoods')}
            </span>
            {!open && goodsLineCount > 0 ? (
              <p className='text-muted-foreground mt-1 truncate text-xs font-normal normal-case'>
                {goodsLineCount}{' '}
                {goodsLineCount === 1 ? tBookingForm('goodsItemsSingular') : tBookingForm('goodsItemsPlural')} ·{' '}
                {formatMoney(goodsSubtotal, locale)}
              </p>
            ) : null}
          </div>
          <ChevronDown className={cn('size-5 shrink-0 text-violet-600 transition-transform', open && 'rotate-180')} />
        </button>

        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-300 ease-in-out',
            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className='min-h-0 overflow-hidden' inert={!open}>
            <div className='max-h-[min(40vh,18rem)] space-y-4 overflow-y-auto overscroll-contain border-t border-border px-4 py-4'>
              <p className='text-muted-foreground text-sm'>{tBookingForm('goodsHint')}</p>

              {catalog.length > 0 && branchId ? (
                <div className='space-y-2'>
                  <h4 className='text-xs font-semibold tracking-wide text-violet-600 uppercase'>
                    {tBookingForm('proShopCatalogTitle')}
                  </h4>
                  <p className='text-muted-foreground text-xs'>{tBookingForm('proShopCatalogHint')}</p>
                  <div className='flex gap-3 overflow-x-auto pb-2'>
                    {catalog.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        variant='compact'
                        onAdd={addFromCatalog}
                        className='min-w-[220px] shrink-0'
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {goods.length === 0 && (
                <Button type='button' variant='outline' size='sm' onClick={() => addLine()}>
                  <Plus className='mr-1 size-4' />
                  {tBookingForm('addFirstItem')}
                </Button>
              )}

              {goods.map((line, index) => {
                const lineTotal = line.quantity * line.unitPrice;
                return (
                  <div key={line.id} className='space-y-3 rounded-md border bg-card p-3'>
                    <div className='grid gap-3 sm:grid-cols-2'>
                      <div className='sm:col-span-2'>
                        <label className='mb-1 block text-xs font-medium text-muted-foreground'>
                          {tBookingForm('itemName')}
                        </label>
                        <Input
                          value={line.name}
                          onChange={(e) => updateLine(index, { name: e.target.value })}
                          placeholder={tBookingForm('itemNamePlaceholder')}
                        />
                      </div>
                      <div>
                        <label className='mb-1 block text-xs font-medium text-muted-foreground'>
                          {tBookingForm('quantity')}
                        </label>
                        <Input
                          type='number'
                          min={1}
                          step={1}
                          value={line.quantity}
                          onChange={(e) =>
                            updateLine(index, { quantity: Math.max(1, parseInt(e.target.value, 10) || 1) })
                          }
                        />
                      </div>
                      <div>
                        <label className='mb-1 block text-xs font-medium text-muted-foreground'>
                          {tBookingForm('unitPrice')}
                        </label>
                        <Input
                          type='number'
                          min={0}
                          step='0.01'
                          value={line.unitPrice}
                          onChange={(e) =>
                            updateLine(index, { unitPrice: Math.max(0, parseFloat(e.target.value) || 0) })
                          }
                        />
                      </div>
                    </div>
                    <div className='flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3'>
                      <span className='text-muted-foreground text-sm'>
                        {tBookingForm('lineTotal')}:{' '}
                        <span className='font-medium text-foreground tabular-nums'>
                          {formatMoney(lineTotal, locale)}
                        </span>
                      </span>
                      <div className='flex items-center gap-2'>
                        <Button type='button' variant='outline' size='sm' onClick={() => addLine(index)}>
                          <Plus className='mr-1 size-4' />
                          {tBookingForm('addMoreItems')}
                        </Button>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='text-destructive hover:bg-destructive/10 hover:text-destructive'
                          onClick={() => removeLine(index)}
                          aria-label={tBookingForm('removeItem')}
                        >
                          <Trash2 className='size-4' />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {goods.length > 0 && (
                <Button type='button' variant='outline' size='sm' onClick={() => addLine()}>
                  <Plus className='mr-1 size-4' />
                  {tBookingForm('addAnotherItem')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order summary — court vs goods vs total (after add-ons) */}
      <div className='rounded-lg border border-border bg-muted/20 p-4'>
        <h3 className='mb-3 text-sm font-semibold tracking-wide text-violet-600 uppercase'>
          {tBookingForm('orderSummary')}
        </h3>
        <div className='space-y-2 text-sm'>
          <div className='flex justify-between gap-4'>
            <span className='text-muted-foreground'>{tBookingForm('courtRentalFee')}</span>
            <span className='font-medium tabular-nums'>{formatMoney(courtRental, locale)}</span>
          </div>
          <div className='flex justify-between gap-4'>
            <span className='text-muted-foreground'>{tBookingForm('goodsSubtotal')}</span>
            <span className='font-medium tabular-nums'>{formatMoney(goodsSubtotal, locale)}</span>
          </div>
          <div className='flex justify-between gap-4 border-t border-border pt-2 text-base'>
            <span className='font-semibold'>{tBookingForm('totalAmount')}</span>
            <span className='font-semibold tabular-nums text-violet-700'>
              {formatMoney(totalAmount, locale)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className='space-y-2'>
        <h3 className='text-sm font-semibold tracking-wide text-violet-600 uppercase'>
          {tBookingForm('notes')}
        </h3>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder={tBookingForm('notePlaceholder')}
          rows={3}
          className='w-full resize-none rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-violet-500 focus:outline-none'
        />
        {noteError && <p className='text-destructive text-sm'>{noteError}</p>}
      </div>

      <Button
        type='submit'
        disabled={isLoading}
        className='w-full bg-violet-600 py-6 text-base font-semibold text-white hover:bg-violet-700'
      >
        {isLoading
          ? isEditMode
            ? tBookingForm('updatingBooking')
            : tBookingForm('creatingBooking')
          : isEditMode
            ? tBookingForm('updateBooking')
            : tBookingForm('createBooking')}
      </Button>
    </div>
  );
}
