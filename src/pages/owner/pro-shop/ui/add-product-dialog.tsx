'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createBranchProduct,
  type CreateBranchProductPayload,
} from '@/entities/quick-order';
import type { ProductCategory } from '@/entities/quick-order';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Field, FieldLabel } from '@/shared/ui/field';
import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import toast from 'react-hot-toast';

const CATEGORIES: ProductCategory[] = ['equipment', 'beverages', 'accessories'];

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branchId: string;
}

export function AddProductDialog({
  open,
  onOpenChange,
  branchId,
}: AddProductDialogProps) {
  const t = useTranslations('ProShopPage');
  const tQ = useTranslations('QuickOrder.category');
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<ProductCategory>('beverages');
  const [unitPrice, setUnitPrice] = useState('0');
  const [initialStock, setInitialStock] = useState('0');

  const reset = () => {
    setName('');
    setSku('');
    setCategory('beverages');
    setUnitPrice('0');
    setInitialStock('0');
  };

  const mutation = useMutation({
    mutationFn: (payload: CreateBranchProductPayload) =>
      createBranchProduct(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['branch-products', branchId] });
      toast.success(t('productCreated'));
      reset();
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message || t('productCreateFailed')),
  });

  const submit = () => {
    const price = parseFloat(unitPrice.replace(',', '.'));
    const stock = parseInt(initialStock, 10);
    if (!name.trim()) {
      toast.error(t('nameRequired'));
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      toast.error(t('priceInvalid'));
      return;
    }
    if (!Number.isFinite(stock) || stock < 0) {
      toast.error(t('stockInvalid'));
      return;
    }
    mutation.mutate({
      branchId,
      name: name.trim(),
      category,
      unitPrice: price,
      sku: sku.trim() || undefined,
      initialStock: stock,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={o => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('addProductTitle')}</DialogTitle>
        </DialogHeader>
        <p className='text-muted-foreground text-xs leading-relaxed'>
          {t('addProductHint')}
        </p>

        <Field>
          <FieldLabel>{t('fieldName')}</FieldLabel>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t('fieldNamePlaceholder')}
          />
        </Field>
        <Field>
          <FieldLabel>{t('fieldSku')}</FieldLabel>
          <Input
            value={sku}
            onChange={e => setSku(e.target.value)}
            placeholder={t('fieldSkuPlaceholder')}
          />
        </Field>
        <Field>
          <FieldLabel>{t('fieldCategory')}</FieldLabel>
          <Select
            value={category}
            onValueChange={v => setCategory(v as ProductCategory)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => (
                <SelectItem key={c} value={c}>
                  {tQ(c)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel>{t('fieldUnitPrice')}</FieldLabel>
          <Input
            type='number'
            min={0}
            step='0.01'
            value={unitPrice}
            onChange={e => setUnitPrice(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>{t('fieldInitialStock')}</FieldLabel>
          <Input
            type='number'
            min={0}
            step={1}
            value={initialStock}
            onChange={e => setInitialStock(e.target.value)}
          />
        </Field>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            {t('cancel')}
          </Button>
          <Button type='button' onClick={submit} disabled={mutation.isPending}>
            {mutation.isPending ? t('saving') : t('createProduct')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
