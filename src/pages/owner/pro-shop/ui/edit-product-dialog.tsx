'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateBranchProduct,
  type CatalogProduct,
  type ProductCategory,
} from '@/entities/quick-order';
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

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branchId: string;
  product: CatalogProduct | null;
}

export function EditProductDialog({
  open,
  onOpenChange,
  branchId,
  product,
}: EditProductDialogProps) {
  const t = useTranslations('ProShopPage');
  const tQ = useTranslations('QuickOrder.category');
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<ProductCategory>('beverages');
  const [unitPrice, setUnitPrice] = useState('0');

  useEffect(() => {
    if (!open || !product) return;
    setName(product.name);
    setSku(product.sku ?? '');
    setCategory(product.category);
    setUnitPrice(String(product.unitPrice));
  }, [open, product]);

  const mutation = useMutation({
    mutationFn: updateBranchProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['branch-products', branchId] });
      toast.success(t('productUpdated'));
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message || t('productUpdateFailed')),
  });

  const submit = () => {
    if (!product) return;
    const price = parseFloat(unitPrice.replace(',', '.'));
    if (!name.trim()) {
      toast.error(t('nameRequired'));
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      toast.error(t('priceInvalid'));
      return;
    }
    mutation.mutate({
      branchId,
      productId: product.id,
      name: name.trim(),
      category,
      unitPrice: price,
      sku: sku.trim() || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('editProductTitle')}</DialogTitle>
        </DialogHeader>
        <p className='text-muted-foreground text-xs leading-relaxed'>{t('editProductHint')}</p>

        <Field>
          <FieldLabel>{t('fieldName')}</FieldLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('fieldNamePlaceholder')} />
        </Field>
        <Field>
          <FieldLabel>{t('fieldSku')}</FieldLabel>
          <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder={t('fieldSkuPlaceholder')} />
        </Field>
        <Field>
          <FieldLabel>{t('fieldCategory')}</FieldLabel>
          <Select value={category} onValueChange={(v) => setCategory(v as ProductCategory)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
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
            onChange={(e) => setUnitPrice(e.target.value)}
          />
        </Field>

        <DialogFooter>
          <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button type='button' onClick={submit} disabled={mutation.isPending || !product}>
            {mutation.isPending ? t('saving') : t('saveProduct')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
