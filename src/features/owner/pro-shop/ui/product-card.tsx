'use client';

import type { CatalogProduct } from '@/entities/quick-order';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ProductCardProps {
  product: CatalogProduct;
  /** Compact layout for booking/checkout strips */
  variant?: 'default' | 'compact';
  onAdd?: (product: CatalogProduct, quantity: number) => void;
  /** Pro Shop: open edit dialog (price, category, etc.) */
  onEdit?: (product: CatalogProduct) => void;
  /** Pro Shop: prompt remove from catalog (soft delete) */
  onRemove?: (product: CatalogProduct) => void;
  onAdjustStock?: (product: CatalogProduct) => void;
  className?: string;
}

export function ProductCard({
  product,
  variant = 'default',
  onAdd,
  onEdit,
  onRemove,
  onAdjustStock,
  className,
}: ProductCardProps) {
  const t = useTranslations('ProShopPage');
  const available =
    product.available ??
    (product.stockOnHand != null && product.stockReserved != null
      ? product.stockOnHand - product.stockReserved
      : undefined);

  const priceLabel = product.unitPrice.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border border-border/80 bg-card p-4 shadow-sm transition-shadow hover:shadow-md',
        variant === 'compact' && 'p-3',
        className,
      )}
    >
      <div className='flex items-start justify-between gap-2'>
        <div className='min-w-0'>
          <p className='font-semibold leading-snug text-foreground'>{product.name}</p>
          {product.sku ? (
            <p className='text-muted-foreground mt-0.5 text-xs tabular-nums'>
              {t('skuLine', { sku: product.sku })}
            </p>
          ) : null}
          {product.description ? (
            <p className='text-muted-foreground mt-1 text-xs leading-relaxed'>{product.description}</p>
          ) : null}
        </div>
        <span className='text-primary shrink-0 text-sm font-bold tabular-nums'>{priceLabel}</span>
      </div>

      {available !== undefined ? (
        <div className='mt-3 flex flex-wrap items-center gap-2'>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              available <= 0
                ? 'bg-destructive/15 text-destructive'
                : product.lowStock
                  ? 'bg-amber-500/15 text-amber-800 dark:text-amber-200'
                  : 'bg-muted text-muted-foreground',
            )}
          >
            {available <= 0 ? t('outOfStock') : t('availableShort', { count: available })}
          </span>
          {product.stockReserved != null && product.stockReserved > 0 ? (
            <span className='text-muted-foreground text-xs'>
              {t('reservedShort', { count: product.stockReserved })}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className='mt-4 flex flex-wrap gap-2'>
        {onAdd ? (
          <Button
            type='button'
            size='sm'
            variant='outline'
            disabled={available !== undefined && available <= 0}
            onClick={() => onAdd(product, 1)}
          >
            {t('add')}
          </Button>
        ) : null}
        {onEdit ? (
          <Button type='button' size='sm' variant='subtle' onClick={() => onEdit(product)}>
            {t('editProduct')}
          </Button>
        ) : null}
        {onRemove ? (
          <Button
            type='button'
            size='sm'
            variant='outline'
            colorPattern='red'
            className='gap-1'
            onClick={() => onRemove(product)}
          >
            <Trash2 className='size-3.5' />
            {t('removeFromCatalog')}
          </Button>
        ) : null}
        {onAdjustStock ? (
          <Button type='button' size='sm' variant='outline' onClick={() => onAdjustStock(product)}>
            {t('adjustStock')}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
