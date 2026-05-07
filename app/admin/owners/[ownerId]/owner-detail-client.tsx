'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import {
  fetchOwnerFeatures,
  setOwnerFeatures,
} from '@/entities/admin/api/feature-entitlements-api';
import { fetchUserById } from '@/entities/admin/api/users-api';
import {
  fetchOwnerCommission,
  setOwnerCommission,
} from '@/entities/admin/api/billing-api';

const KNOWN_OWNER_FEATURES: {
  key: string;
  label: string;
  description: string;
}[] = [
  {
    key: 'pro_shop',
    label: 'Pro Shop',
    description: 'Enable inventory, POS quick orders, and goods-only orders.',
  },
  {
    key: 'reports',
    label: 'Reports',
    description: 'Enable owner-facing revenue and deposit policy module.',
  },
  {
    key: 'members',
    label: 'Members',
    description: 'Enable members/team management for the owner workspace.',
  },
];

export function OwnerDetailClient({ ownerId }: { ownerId: string }) {
  const queryClient = useQueryClient();
  const [dirty, setDirty] = useState(false);

  const ownerQuery = useQuery({
    queryKey: ['admin-owner', ownerId],
    queryFn: () => fetchUserById(ownerId),
  });

  const featuresQuery = useQuery({
    queryKey: ['admin-owner', ownerId, 'features'],
    queryFn: () => fetchOwnerFeatures(ownerId),
  });

  const commissionQuery = useQuery({
    queryKey: ['admin-owner', ownerId, 'commission'],
    queryFn: () => fetchOwnerCommission(ownerId),
  });

  const [commissionInput, setCommissionInput] = useState<string>('');

  const enabledSet = useMemo(
    () => new Set(featuresQuery.data ?? []),
    [featuresQuery.data]
  );
  const [localEnabled, setLocalEnabled] = useState<string[] | null>(null);

  const effectiveEnabled = localEnabled ?? Array.from(enabledSet);
  const effectiveSet = useMemo(
    () => new Set(effectiveEnabled),
    [effectiveEnabled]
  );

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = KNOWN_OWNER_FEATURES.map(f => ({
        featureKey: f.key,
        enabled: effectiveSet.has(f.key),
      }));
      return setOwnerFeatures(ownerId, payload);
    },
    onSuccess: enabledFeatures => {
      toast.success('Feature access updated');
      setDirty(false);
      setLocalEnabled(null);
      queryClient.setQueryData(
        ['admin-owner', ownerId, 'features'],
        enabledFeatures
      );
    },
    onError: (e: Error) =>
      toast.error(e.message || 'Failed to update features'),
  });

  const saveCommissionMutation = useMutation({
    mutationFn: async () => {
      const next = Number(commissionInput);
      if (!Number.isFinite(next) || next < 0 || next > 1) {
        throw new Error('Commission rate must be a number between 0 and 1');
      }
      return setOwnerCommission(ownerId, next);
    },
    onSuccess: rate => {
      toast.success('Commission updated');
      setCommissionInput('');
      queryClient.setQueryData(['admin-owner', ownerId, 'commission'], rate);
    },
    onError: (e: Error) =>
      toast.error(e.message || 'Failed to update commission'),
  });

  const owner = ownerQuery.data?.role === 'owner' ? ownerQuery.data : null;

  const toggleFeature = (featureKey: string) => {
    setLocalEnabled(prev => {
      const current = new Set(prev ?? Array.from(enabledSet));
      if (current.has(featureKey)) current.delete(featureKey);
      else current.add(featureKey);
      return Array.from(current);
    });
    setDirty(true);
  };

  return (
    <div className='container mx-auto max-w-5xl space-y-6 py-8'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Owner</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Manage feature access for this owner account.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {dirty ? (
            <Badge variant='secondary'>Unsaved</Badge>
          ) : (
            <Badge variant='outline'>Saved</Badge>
          )}
          <Button
            type='button'
            onClick={() => saveMutation.mutate()}
            disabled={!dirty || saveMutation.isPending}
          >
            {saveMutation.isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Basic information for this owner.</CardDescription>
        </CardHeader>
        <CardContent>
          {ownerQuery.isLoading ? (
            <div className='text-muted-foreground text-sm'>Loading…</div>
          ) : !owner ? (
            <div className='text-sm text-red-600'>
              Owner not found (or not an owner account).
            </div>
          ) : (
            <div className='grid gap-2 text-sm'>
              <div>
                <span className='text-muted-foreground'>Username:</span>{' '}
                {owner.username}
              </div>
              <div>
                <span className='text-muted-foreground'>Email:</span>{' '}
                {owner.email ?? '—'}
              </div>
              <div>
                <span className='text-muted-foreground'>Role:</span>{' '}
                {owner.role}
              </div>
              <div>
                <span className='text-muted-foreground'>Status:</span>{' '}
                {owner.isActive ? 'active' : 'inactive'}
              </div>
              <div className='text-muted-foreground text-xs'>
                id: {owner.id}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>
            Set the platform commission rate for this owner (0–1).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {commissionQuery.isLoading ? (
            <div className='text-muted-foreground text-sm'>Loading…</div>
          ) : commissionQuery.isError ? (
            <div className='text-sm text-red-600'>
              Failed to load commission rate.
            </div>
          ) : (
            <div className='flex flex-col gap-3 sm:flex-row sm:items-end'>
              <div className='flex-1'>
                <label className='text-sm font-medium'>Commission rate</label>
                <Input
                  type='number'
                  min={0}
                  max={1}
                  step={0.01}
                  value={commissionInput}
                  onChange={e => setCommissionInput(e.target.value)}
                  placeholder={String(commissionQuery.data ?? 0.1)}
                />
                <p className='text-muted-foreground mt-1 text-xs'>
                  Current:{' '}
                  <span className='font-medium'>{commissionQuery.data}</span> (
                  {Math.round((commissionQuery.data ?? 0) * 100)}%)
                </p>
              </div>
              <Button
                type='button'
                onClick={() => saveCommissionMutation.mutate()}
                disabled={
                  saveCommissionMutation.isPending ||
                  commissionInput.trim() === ''
                }
              >
                {saveCommissionMutation.isPending
                  ? 'Saving…'
                  : 'Save commission'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature access</CardTitle>
          <CardDescription>
            Enable or disable owner modules to control what they can use.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {featuresQuery.isLoading ? (
            <div className='text-muted-foreground text-sm'>Loading…</div>
          ) : featuresQuery.isError ? (
            <div className='text-sm text-red-600'>
              Failed to load owner features.
            </div>
          ) : (
            <div className='space-y-4'>
              {KNOWN_OWNER_FEATURES.map(f => {
                const on = effectiveSet.has(f.key);
                return (
                  <label
                    key={f.key}
                    className='flex cursor-pointer items-start gap-3 rounded-lg border p-4'
                  >
                    <input
                      type='checkbox'
                      className='mt-1 size-4 rounded border'
                      checked={on}
                      onChange={() => toggleFeature(f.key)}
                    />
                    <div className='min-w-0'>
                      <div className='flex items-center gap-2'>
                        <span className='font-medium'>{f.label}</span>
                        <Badge variant={on ? 'secondary' : 'outline'}>
                          {on ? 'enabled' : 'disabled'}
                        </Badge>
                      </div>
                      <p className='text-muted-foreground mt-1 text-sm'>
                        {f.description}
                      </p>
                      <p className='text-muted-foreground mt-1 text-xs'>
                        key: {f.key}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
