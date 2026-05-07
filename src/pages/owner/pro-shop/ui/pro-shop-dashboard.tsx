'use client';

import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteBranchProduct,
  downloadProShopImportTemplate,
  fetchBranchProducts,
  importProShopExcel,
} from '@/entities/quick-order';
import { patchInventoryStock } from '@/entities/inventory';
import type { CatalogProduct } from '@/entities/quick-order';
import { ProductCard } from '@/features/owner/pro-shop/ui/product-card';
import { AddProductDialog } from './add-product-dialog';
import { EditProductDialog } from './edit-product-dialog';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Field, FieldLabel } from '@/shared/ui/field';
import {
  AlertTriangle,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

interface ProShopDashboardProps {
  branchId: string;
}

function formatMoney(n: number, locale: string) {
  return n.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function ProShopDashboard({ branchId }: ProShopDashboardProps) {
  const t = useTranslations('ProShopPage');
  const tCat = useTranslations('QuickOrder.category');
  const locale = useLocale();
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<CatalogProduct | null>(null);
  const [adjustProduct, setAdjustProduct] = useState<CatalogProduct | null>(
    null
  );
  const [removeConfirmProduct, setRemoveConfirmProduct] =
    useState<CatalogProduct | null>(null);
  const [deltaInput, setDeltaInput] = useState('0');
  const [noteInput, setNoteInput] = useState('');
  const [importSummary, setImportSummary] = useState<{
    created: number;
    updated: number;
    errors: Array<{ row: number; message: string }>;
  } | null>(null);

  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['branch-products', branchId],
    queryFn: () => fetchBranchProducts(branchId),
  });

  const lowStockItems = products.filter(p => p.lowStock);

  const importMutation = useMutation({
    mutationFn: (file: File) => importProShopExcel(branchId, file),
    onSuccess: res => {
      qc.invalidateQueries({ queryKey: ['branch-products', branchId] });
      setImportSummary(res);
      const errCount = res.errors.length;
      if (errCount === 0) {
        toast.success(
          t('importSuccess', { created: res.created, updated: res.updated })
        );
      } else {
        toast(
          t('importPartial', {
            created: res.created,
            updated: res.updated,
            errors: errCount,
          })
        );
      }
    },
    onError: (e: Error) => toast.error(e.message || t('importFailed')),
  });

  const templateMutation = useMutation({
    mutationFn: () => downloadProShopImportTemplate(branchId),
    onError: (e: Error) => toast.error(e.message || t('templateFailed')),
  });

  const mutation = useMutation({
    mutationFn: patchInventoryStock,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['branch-products', branchId] });
      toast.success(t('stockUpdated'));
      setAdjustProduct(null);
      setDeltaInput('0');
      setNoteInput('');
    },
    onError: (e: Error) => toast.error(e.message || t('stockUpdateFailed')),
  });

  const deleteMutation = useMutation({
    mutationFn: (p: CatalogProduct) =>
      deleteBranchProduct({ branchId, productId: p.id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['branch-products', branchId] });
      toast.success(t('productRemovedFromCatalog'));
      setRemoveConfirmProduct(null);
    },
    onError: (e: Error) => toast.error(e.message || t('productRemoveFailed')),
  });

  const submitAdjust = () => {
    if (!adjustProduct) return;
    const delta = parseInt(deltaInput, 10);
    if (!Number.isFinite(delta) || delta === 0) {
      toast.error(t('invalidDelta'));
      return;
    }
    mutation.mutate({
      branchId,
      productId: adjustProduct.id,
      delta,
      note: noteInput.trim() || undefined,
    });
  };

  const onPickImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!/\.xlsx$/i.test(file.name)) {
      toast.error(t('importFileType'));
      return;
    }
    importMutation.mutate(file);
  };

  return (
    <div className='animate-in fade-in container mx-auto max-w-6xl space-y-8 p-4 pt-8 duration-500'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            {t('dashboardTitle')}
          </h1>
          <p className='text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed'>
            {t('dashboardSubtitle')}
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => refetch()}
            disabled={isFetching}
            className='gap-1.5'
          >
            <RefreshCw
              className={`size-4 ${isFetching ? 'animate-spin' : ''}`}
            />
            {t('refresh')}
          </Button>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => templateMutation.mutate()}
            disabled={templateMutation.isPending}
            className='gap-1.5'
          >
            <FileSpreadsheet className='size-4' />
            {t('downloadTemplate')}
          </Button>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => fileInputRef.current?.click()}
            disabled={importMutation.isPending}
            className='gap-1.5'
          >
            <Upload className='size-4' />
            {t('importExcel')}
          </Button>
          <input
            ref={fileInputRef}
            type='file'
            accept='.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            className='hidden'
            onChange={onPickImport}
          />
          <Button
            type='button'
            size='sm'
            onClick={() => setAddOpen(true)}
            className='gap-1.5'
          >
            <Plus className='size-4' />
            {t('addProduct')}
          </Button>
        </div>
      </div>

      <AddProductDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        branchId={branchId}
      />

      <EditProductDialog
        open={!!editProduct}
        onOpenChange={o => !o && setEditProduct(null)}
        branchId={branchId}
        product={editProduct}
      />

      {isError && (
        <div className='border-destructive/40 bg-destructive/10 flex flex-col gap-3 rounded-xl border px-4 py-3 text-sm'>
          <p className='text-destructive font-medium'>
            {t('loadError')}
            {error instanceof Error ? `: ${error.message}` : ''}
          </p>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='w-fit'
            onClick={() => refetch()}
          >
            {t('retry')}
          </Button>
        </div>
      )}

      {lowStockItems.length > 0 && (
        <div className='flex gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-100'>
          <AlertTriangle className='size-5 shrink-0 text-amber-600 dark:text-amber-400' />
          <div>
            <p className='font-semibold'>{t('lowStockAlertTitle')}</p>
            <p className='mt-1 opacity-90'>
              {lowStockItems.map(p => p.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className='text-muted-foreground text-sm'>{t('loading')}</p>
      ) : !isError && products.length === 0 ? (
        <div className='border-border bg-muted/30 rounded-xl border border-dashed px-6 py-12 text-center'>
          <p className='text-muted-foreground text-sm'>{t('emptyInventory')}</p>
          <div className='mt-4 flex flex-wrap justify-center gap-2'>
            <Button type='button' onClick={() => setAddOpen(true)}>
              <Plus className='mr-1 size-4' />
              {t('addProduct')}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => templateMutation.mutate()}
            >
              <FileSpreadsheet className='mr-1 size-4' />
              {t('downloadTemplate')}
            </Button>
          </div>
        </div>
      ) : !isError ? (
        <>
          <div className='border-border overflow-x-auto rounded-xl border'>
            <table className='w-full min-w-[880px] border-collapse text-sm'>
              <thead>
                <tr className='border-border bg-muted/50 border-b text-left'>
                  <th className='px-3 py-3 font-semibold'>{t('colName')}</th>
                  <th className='px-3 py-3 font-semibold'>{t('colSku')}</th>
                  <th className='px-3 py-3 font-semibold'>
                    {t('colCategory')}
                  </th>
                  <th className='px-3 py-3 text-right font-semibold tabular-nums'>
                    {t('colOnHand')}
                  </th>
                  <th className='px-3 py-3 text-right font-semibold tabular-nums'>
                    {t('colReserved')}
                  </th>
                  <th className='px-3 py-3 text-right font-semibold tabular-nums'>
                    {t('colAvailable')}
                  </th>
                  <th className='px-3 py-3 text-right font-semibold tabular-nums'>
                    {t('colUnitPrice')}
                  </th>
                  <th className='px-3 py-3' />
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const onHand = p.stockOnHand ?? 0;
                  const resv = p.stockReserved ?? 0;
                  const avail = p.available ?? Math.max(0, onHand - resv);
                  return (
                    <tr
                      key={p.id}
                      className='border-border/80 hover:bg-muted/30 border-b'
                    >
                      <td className='px-3 py-3 font-medium'>{p.name}</td>
                      <td className='text-muted-foreground px-3 py-3 tabular-nums'>
                        {p.sku ?? '—'}
                      </td>
                      <td className='text-muted-foreground px-3 py-3'>
                        {tCat(p.category)}
                      </td>
                      <td className='px-3 py-3 text-right tabular-nums'>
                        {onHand}
                      </td>
                      <td className='px-3 py-3 text-right tabular-nums'>
                        {resv}
                      </td>
                      <td className='px-3 py-3 text-right tabular-nums'>
                        {avail}
                      </td>
                      <td className='px-3 py-3 text-right tabular-nums'>
                        {formatMoney(p.unitPrice, locale)}
                      </td>
                      <td className='px-3 py-3'>
                        <div className='flex flex-wrap justify-end gap-2'>
                          <Button
                            type='button'
                            variant='subtle'
                            size='sm'
                            onClick={() => setEditProduct(p)}
                          >
                            {t('editProduct')}
                          </Button>
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              setAdjustProduct(p);
                              setDeltaInput('0');
                              setNoteInput('');
                            }}
                          >
                            {t('adjustStock')}
                          </Button>
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            colorPattern='red'
                            className='gap-1'
                            onClick={() => setRemoveConfirmProduct(p)}
                          >
                            <Trash2 className='size-3.5' />
                            {t('removeFromCatalog')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div>
            <h2 className='text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase'>
              {t('cardsSection')}
            </h2>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {products.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onEdit={prod => setEditProduct(prod)}
                  onRemove={prod => setRemoveConfirmProduct(prod)}
                  onAdjustStock={prod => {
                    setAdjustProduct(prod);
                    setDeltaInput('0');
                    setNoteInput('');
                  }}
                />
              ))}
            </div>
          </div>
        </>
      ) : null}

      <Dialog
        open={!!importSummary}
        onOpenChange={o => !o && setImportSummary(null)}
      >
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>{t('importSummaryTitle')}</DialogTitle>
          </DialogHeader>
          {importSummary ? (
            <div className='space-y-3 text-sm'>
              <p>
                {t('importSummaryCounts', {
                  created: importSummary.created,
                  updated: importSummary.updated,
                })}
              </p>
              {importSummary.errors.length > 0 ? (
                <ul className='border-border bg-muted/40 max-h-48 list-inside list-disc overflow-y-auto rounded-md border px-3 py-2 text-xs'>
                  {importSummary.errors.map((e, i) => (
                    <li key={`${e.row}-${i}`}>
                      {t('importRowError', { row: e.row, message: e.message })}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
          <DialogFooter>
            <Button type='button' onClick={() => setImportSummary(null)}>
              {t('close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!removeConfirmProduct}
        onOpenChange={o => !o && setRemoveConfirmProduct(null)}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{t('removeDialogTitle')}</DialogTitle>
            <DialogDescription>
              {t('removeDialogDescription')}
            </DialogDescription>
          </DialogHeader>
          <p className='text-muted-foreground text-sm font-medium'>
            {removeConfirmProduct?.name}
          </p>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setRemoveConfirmProduct(null)}
            >
              {t('cancel')}
            </Button>
            <Button
              type='button'
              variant='solid'
              colorPattern='red'
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (removeConfirmProduct)
                  deleteMutation.mutate(removeConfirmProduct);
              }}
            >
              {deleteMutation.isPending ? t('saving') : t('removeConfirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!adjustProduct}
        onOpenChange={o => !o && setAdjustProduct(null)}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{t('adjustDialogTitle')}</DialogTitle>
          </DialogHeader>
          <p className='text-muted-foreground text-sm'>{adjustProduct?.name}</p>
          <Field>
            <FieldLabel>{t('adjustDelta')}</FieldLabel>
            <Input
              type='number'
              value={deltaInput}
              onChange={e => setDeltaInput(e.target.value)}
              placeholder={t('adjustDeltaPlaceholder')}
            />
          </Field>
          <Field>
            <FieldLabel>{t('adjustNote')}</FieldLabel>
            <Input
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
            />
          </Field>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setAdjustProduct(null)}
            >
              {t('cancel')}
            </Button>
            <Button
              type='button'
              onClick={submitAdjust}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? t('saving') : t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
