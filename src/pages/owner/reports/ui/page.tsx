'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import {
  fetchBranches,
  fetchBranchDepositRevenue,
  updateBranch,
} from '@/entities/venue';
import type { Branch } from '@/entities/venue';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

function formatMoney(locale: string, value: number) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ReportsPage() {
  const t = useTranslations('OwnerReportsPage');
  const tOwner = useTranslations('OwnerPages');
  const locale = useLocale();
  const queryClient = useQueryClient();

  const { data: branches = [], isLoading: loadingBranches } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches,
  });

  const [branchId, setBranchId] = useState<string>('');

  useEffect(() => {
    if (!branchId && branches.length > 0) {
      setBranchId(branches[0].id);
    }
  }, [branches, branchId]);

  const selectedBranch = useMemo(
    () => branches.find((b: Branch) => b.id === branchId),
    [branches, branchId],
  );

  const [depositEnabled, setDepositEnabled] = useState(false);
  const [depositType, setDepositType] = useState<'percent' | 'fixed'>('percent');
  const [depositValue, setDepositValue] = useState<string>('20');

  useEffect(() => {
    if (!selectedBranch) return;
    setDepositEnabled(Boolean(selectedBranch.depositEnabled));
    setDepositType((selectedBranch.depositType as 'percent' | 'fixed') || 'percent');
    setDepositValue(String(selectedBranch.depositValue ?? 0));
  }, [selectedBranch]);

  const revenueQuery = useQuery({
    queryKey: ['branch', branchId, 'revenue-deposits'],
    queryFn: () => fetchBranchDepositRevenue(branchId),
    enabled: !!branchId,
  });

  const savePolicy = useMutation({
    mutationFn: async () => {
      const num = Number(depositValue);
      if (Number.isNaN(num)) {
        throw new Error(t('invalidDepositValue'));
      }
      return updateBranch(branchId, {
        depositEnabled,
        depositType,
        depositValue: num,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branch', branchId] });
      queryClient.invalidateQueries({ queryKey: ['branch', branchId, 'revenue-deposits'] });
      toast.success(t('policySaved'));
    },
    onError: (e: Error) => {
      toast.error(e.message || t('policySaveFailed'));
    },
  });

  const s = revenueQuery.data?.summary;

  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{tOwner('reports')}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t('subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('branchLabel')}</CardTitle>
          <CardDescription>{t('branchHint')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={branchId || undefined}
            onValueChange={setBranchId}
            disabled={loadingBranches || branches.length === 0}
          >
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder={t('selectBranch')} />
            </SelectTrigger>
            <SelectContent>
              {branches.map((b: Branch) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('revenueTitle')}</CardTitle>
          <CardDescription>{t('revenueDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-muted-foreground text-xs font-medium uppercase">
              {t('depositsCollected')}
            </p>
            <p className="text-xl font-semibold">
              {s ? formatMoney(locale, s.depositsCollected) : '—'}
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-muted-foreground text-xs font-medium uppercase">
              {t('balanceCollected')}
            </p>
            <p className="text-xl font-semibold">
              {s ? formatMoney(locale, s.balanceCollected) : '—'}
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-muted-foreground text-xs font-medium uppercase">
              {t('fullCollected')}
            </p>
            <p className="text-xl font-semibold">
              {s ? formatMoney(locale, s.fullCollected) : '—'}
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-muted-foreground text-xs font-medium uppercase">
              {t('pendingTotal')}
            </p>
            <p className="text-xl font-semibold">
              {s
                ? formatMoney(
                    locale,
                    s.pendingDeposits + s.pendingBalance + s.pendingFull,
                  )
                : '—'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('depositPolicyTitle')}</CardTitle>
          <CardDescription>{t('depositPolicyDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="size-4 rounded border"
              checked={depositEnabled}
              onChange={(e) => setDepositEnabled(e.target.checked)}
            />
            {t('enableDeposits')}
          </label>

          <div className="grid max-w-md gap-4">
            <Field>
              <FieldLabel>{t('depositType')}</FieldLabel>
              <Select
                value={depositType}
                onValueChange={(v) => setDepositType(v as 'percent' | 'fixed')}
                disabled={!depositEnabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">{t('typePercent')}</SelectItem>
                  <SelectItem value="fixed">{t('typeFixed')}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>
                {depositType === 'percent' ? t('percentValue') : t('fixedValue')}
              </FieldLabel>
              <Input
                type="number"
                min={0}
                step={depositType === 'percent' ? 1 : 0.01}
                value={depositValue}
                onChange={(e) => setDepositValue(e.target.value)}
                disabled={!depositEnabled}
              />
            </Field>
          </div>

          <Button
            type="button"
            onClick={() => savePolicy.mutate()}
            disabled={!branchId || savePolicy.isPending}
          >
            {savePolicy.isPending ? t('saving') : t('savePolicy')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
