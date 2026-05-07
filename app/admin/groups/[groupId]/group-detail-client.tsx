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

import { fetchUsers } from '@/entities/admin/api/users-api';
import {
  fetchOwnerGroupDetail,
  setOwnerGroupFeatures,
  setOwnerGroupMembers,
} from '@/entities/admin/api/owner-groups-api';

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

export function GroupDetailClient({ groupId }: { groupId: string }) {
  const qc = useQueryClient();
  const [ownerSearch, setOwnerSearch] = useState('');

  const detailQuery = useQuery({
    queryKey: ['admin-owner-group', groupId],
    queryFn: () => fetchOwnerGroupDetail(groupId),
  });

  const ownersQuery = useQuery({
    queryKey: ['admin-owners', 'picker', ownerSearch],
    queryFn: () =>
      fetchUsers({ page: 1, perPage: 200, search: ownerSearch || undefined }),
  });

  const [localOwnerIds, setLocalOwnerIds] = useState<string[] | null>(null);
  const [localFeatures, setLocalFeatures] = useState<string[] | null>(null);

  const serverOwnerIds = detailQuery.data?.ownerIds ?? [];
  const ownerIds = localOwnerIds ?? serverOwnerIds;
  const ownerSet = useMemo(() => new Set(ownerIds), [ownerIds]);

  const serverFeatures = detailQuery.data?.enabledFeatures ?? [];
  const features = localFeatures ?? serverFeatures;
  const featureSet = useMemo(() => new Set(features), [features]);

  const saveMembersMutation = useMutation({
    mutationFn: async () => setOwnerGroupMembers(groupId, ownerIds),
    onSuccess: nextOwnerIds => {
      toast.success('Members updated');
      setLocalOwnerIds(null);
      qc.setQueryData(['admin-owner-group', groupId], (prev: any) =>
        prev ? { ...prev, ownerIds: nextOwnerIds } : prev
      );
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to save members'),
  });

  const saveFeaturesMutation = useMutation({
    mutationFn: async () => {
      const payload = KNOWN_OWNER_FEATURES.map(f => ({
        featureKey: f.key,
        enabled: featureSet.has(f.key),
      }));
      return setOwnerGroupFeatures(groupId, payload);
    },
    onSuccess: nextEnabled => {
      toast.success('Group feature access updated');
      setLocalFeatures(null);
      qc.setQueryData(['admin-owner-group', groupId], (prev: any) =>
        prev ? { ...prev, enabledFeatures: nextEnabled } : prev
      );
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to save features'),
  });

  const group = detailQuery.data?.group ?? null;
  const owners = ownersQuery.data?.docs?.filter(u => u.role === 'owner') ?? [];

  function toggleOwner(ownerId: string) {
    setLocalOwnerIds(prev => {
      const base = prev ?? serverOwnerIds;
      const next = new Set(base);
      if (next.has(ownerId)) next.delete(ownerId);
      else next.add(ownerId);
      return Array.from(next);
    });
  }

  function toggleFeature(featureKey: string) {
    setLocalFeatures(prev => {
      const base = prev ?? serverFeatures;
      const next = new Set(base);
      if (next.has(featureKey)) next.delete(featureKey);
      else next.add(featureKey);
      return Array.from(next);
    });
  }

  const membersDirty =
    localOwnerIds !== null &&
    (localOwnerIds.length !== serverOwnerIds.length ||
      localOwnerIds.some(id => !serverOwnerIds.includes(id)));

  const featuresDirty =
    localFeatures !== null &&
    (localFeatures.length !== serverFeatures.length ||
      localFeatures.some(k => !serverFeatures.includes(k)));

  return (
    <div className='py-8 space-y-6'>
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0'>
          <h1 className='text-2xl font-semibold truncate'>
            {group ? group.name : 'Group'}
          </h1>
          <p className='text-muted-foreground mt-1 text-sm truncate'>
            {groupId}
          </p>
        </div>
      </div>

      {detailQuery.isLoading ? (
        <div className='text-muted-foreground text-sm'>Loading…</div>
      ) : detailQuery.isError ? (
        <div className='text-sm text-red-600'>Failed to load group.</div>
      ) : (
        <div className='grid gap-6 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Members (owners)</CardTitle>
              <CardDescription>
                Assign owners to inherit this group’s module access.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                <Input
                  value={ownerSearch}
                  onChange={e => setOwnerSearch(e.target.value)}
                  placeholder='Search owners…'
                />
                <Button
                  onClick={() => saveMembersMutation.mutate()}
                  disabled={!membersDirty || saveMembersMutation.isPending}
                >
                  {saveMembersMutation.isPending ? 'Saving…' : 'Save members'}
                </Button>
              </div>

              {ownersQuery.isLoading ? (
                <div className='text-muted-foreground text-sm'>Loading owners…</div>
              ) : ownersQuery.isError ? (
                <div className='text-sm text-red-600'>Failed to load owners.</div>
              ) : (
                <div className='space-y-2'>
                  {owners.map(o => {
                    const on = ownerSet.has(o.id);
                    return (
                      <label
                        key={o.id}
                        className='flex cursor-pointer items-start gap-3 rounded-lg border p-3'
                      >
                        <input
                          type='checkbox'
                          className='mt-1 size-4 rounded border'
                          checked={on}
                          onChange={() => toggleOwner(o.id)}
                        />
                        <div className='min-w-0'>
                          <div className='flex flex-wrap items-center gap-2'>
                            <span className='font-medium truncate'>
                              {o.username}
                            </span>
                            <Badge variant={on ? 'secondary' : 'outline'}>
                              {on ? 'in group' : 'not in group'}
                            </Badge>
                          </div>
                          <div className='text-muted-foreground mt-1 text-xs truncate'>
                            {o.email ?? '—'} · {o.id}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Group feature access</CardTitle>
              <CardDescription>
                Owners in this group will have these modules enabled (unless
                overridden on the owner).
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-end'>
                <Button
                  onClick={() => saveFeaturesMutation.mutate()}
                  disabled={!featuresDirty || saveFeaturesMutation.isPending}
                >
                  {saveFeaturesMutation.isPending ? 'Saving…' : 'Save features'}
                </Button>
              </div>
              <div className='space-y-3'>
                {KNOWN_OWNER_FEATURES.map(f => {
                  const on = featureSet.has(f.key);
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

