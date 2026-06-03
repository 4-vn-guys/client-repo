'use client';

import Link from 'next/link';
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
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

import { fetchUsers } from '@/entities/admin/api/users-api';
import {
  fetchOwnerGroupDetail,
  setOwnerGroupFeatures,
  setOwnerGroupMembers,
  updateOwnerGroupSettings,
} from '@/entities/admin/api/owner-groups-api';
import {
  fetchTierDetail,
  fetchTiers,
} from '@/entities/admin/api/tiers-api';
import { fetchCatalogModules } from '@/entities/admin/api/platform-api';

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
  const [localTierId, setLocalTierId] = useState<string | null | undefined>(undefined);
  const [localPriority, setLocalPriority] = useState<number | undefined>(undefined);

  const tiersQuery = useQuery({
    queryKey: ['admin-tiers'],
    queryFn: fetchTiers,
  });

  const modulesQuery = useQuery({
    queryKey: ['admin-catalog-modules'],
    queryFn: fetchCatalogModules,
  });

  const serverTierId = detailQuery.data?.group?.tierId ?? null;
  const tierId = localTierId === undefined ? serverTierId : localTierId;
  const serverPriority = detailQuery.data?.group?.priority ?? 100;
  const priority = localPriority ?? serverPriority;

  const tierDetailQuery = useQuery({
    queryKey: ['admin-tier', tierId],
    queryFn: () => fetchTierDetail(tierId as string),
    enabled: !!tierId,
  });

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
      qc.setQueryData(['admin-owner-group', groupId], (prev: unknown) =>
        prev && typeof prev === 'object'
          ? { ...(prev as Record<string, unknown>), ownerIds: nextOwnerIds }
          : prev
      );
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to save members'),
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async () =>
      updateOwnerGroupSettings({
        groupId,
        tierId: tierId,
        priority,
      }),
    onSuccess: nextGroup => {
      toast.success('Tier and priority saved');
      setLocalTierId(undefined);
      setLocalPriority(undefined);
      qc.setQueryData(['admin-owner-group', groupId], (prev: unknown) =>
        prev && typeof prev === 'object'
          ? { ...(prev as Record<string, unknown>), group: nextGroup }
          : prev
      );
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to save settings'),
  });

  const saveFeaturesMutation = useMutation({
    mutationFn: async () => {
      // Persist every catalog module so removals propagate to the DB too.
      const tierModuleSet = new Set(tierDetailQuery.data?.modules ?? []);
      const payload = (modulesQuery.data ?? [])
        // Skip modules already supplied by the tier — they're inherited,
        // not group-level overrides.
        .filter(m => !tierModuleSet.has(m.id))
        .map(m => ({
          featureKey: m.id,
          enabled: featureSet.has(m.id),
        }));
      if (!payload.length) {
        return featureSet.size ? Array.from(featureSet) : [];
      }
      return setOwnerGroupFeatures(groupId, payload);
    },
    onSuccess: nextEnabled => {
      toast.success('Group modules updated');
      setLocalFeatures(null);
      qc.setQueryData(['admin-owner-group', groupId], (prev: unknown) =>
        prev && typeof prev === 'object'
          ? { ...(prev as Record<string, unknown>), enabledFeatures: nextEnabled }
          : prev
      );
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to save modules'),
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

  const settingsDirty =
    (localTierId !== undefined && localTierId !== serverTierId) ||
    (localPriority !== undefined && localPriority !== serverPriority);

  const tiers = tiersQuery.data ?? [];
  const tierDetail = tierDetailQuery.data;

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
        <>
        <Card>
          <CardHeader className='flex-row items-start justify-between'>
            <div>
              <CardTitle>Tier &amp; priority</CardTitle>
              <CardDescription>
                A tier preset is the baseline of modules this group inherits.
                Owners receive the union of tier modules plus any additional
                modules toggled on below. Permission overrides on a tier are
                stored but not yet enforced at request time.
              </CardDescription>
            </div>
            <Button
              onClick={() => saveSettingsMutation.mutate()}
              disabled={!settingsDirty || saveSettingsMutation.isPending}
            >
              {saveSettingsMutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          </CardHeader>
          <CardContent className='grid gap-4 sm:grid-cols-[2fr_1fr]'>
            <div className='space-y-2'>
              <Label htmlFor='group-tier'>Tier</Label>
              <Select
                value={tierId ?? '__none'}
                onValueChange={v => setLocalTierId(v === '__none' ? null : v)}
              >
                <SelectTrigger id='group-tier'>
                  <SelectValue placeholder='No tier' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='__none'>No tier (use platform defaults)</SelectItem>
                  {tiers.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                      {t.isSystem ? ' · system' : ''}
                      {` · ${t.moduleCount} modules`}
                      {t.overrideCount ? ` · ${t.overrideCount} overrides` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className='text-muted-foreground text-xs'>
                Manage tiers at{' '}
                <Link href='/admin/groups/tiers' className='underline'>
                  admin/groups/tiers
                </Link>
                .
              </p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='group-priority'>Priority</Label>
              <Input
                id='group-priority'
                type='number'
                min={0}
                value={priority}
                onChange={e => setLocalPriority(Number(e.target.value))}
              />
              <p className='text-muted-foreground text-xs'>
                Lower wins when an owner belongs to multiple groups.
              </p>
            </div>

            {tierId && (
              <div className='bg-muted/40 sm:col-span-2 rounded-md border p-3 text-xs'>
                {tierDetailQuery.isLoading ? (
                  <span className='text-muted-foreground'>Loading tier…</span>
                ) : tierDetail ? (
                  <div className='space-y-2'>
                    <div>
                      <span className='text-muted-foreground'>Modules:</span>{' '}
                      {tierDetail.modules.length ? (
                        <span className='font-mono'>{tierDetail.modules.join(', ')}</span>
                      ) : (
                        <span className='text-muted-foreground'>—</span>
                      )}
                    </div>
                    <div>
                      <span className='text-muted-foreground'>Permission overrides:</span>{' '}
                      {tierDetail.permissionOverrides.length ? (
                        <span className='font-mono'>
                          {tierDetail.permissionOverrides
                            .map(o => `${o.roleId}.${o.permissionKey}=${o.value}`)
                            .join(' · ')}
                        </span>
                      ) : (
                        <span className='text-muted-foreground'>none — uses platform defaults</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className='text-muted-foreground'>Tier details unavailable.</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

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
            <CardHeader className='flex-row items-start justify-between'>
              <div>
                <CardTitle>Modules in scope</CardTitle>
                <CardDescription>
                  Modules inherited from the tier are locked. Toggle additional
                  modules below to grant them on top of the tier baseline.
                </CardDescription>
              </div>
              <Button
                onClick={() => saveFeaturesMutation.mutate()}
                disabled={!featuresDirty || saveFeaturesMutation.isPending}
              >
                {saveFeaturesMutation.isPending ? 'Saving…' : 'Save modules'}
              </Button>
            </CardHeader>
            <CardContent className='space-y-2'>
              {modulesQuery.isLoading ? (
                <div className='text-muted-foreground text-sm'>Loading modules…</div>
              ) : modulesQuery.isError ? (
                <div className='text-sm text-red-600'>Failed to load module catalog.</div>
              ) : (
                <UnifiedModulesList
                  modules={modulesQuery.data ?? []}
                  tierModules={tierDetailQuery.data?.modules ?? []}
                  tierName={tierDetailQuery.data?.name ?? null}
                  enabledOverrides={featureSet}
                  onToggle={toggleFeature}
                />
              )}
            </CardContent>
          </Card>
        </div>
        </>
      )}
    </div>
  );
}



function UnifiedModulesList({
  modules,
  tierModules,
  tierName,
  enabledOverrides,
  onToggle,
}: {
  modules: { id: string; name: string; category: string | null }[];
  tierModules: string[];
  tierName: string | null;
  enabledOverrides: Set<string>;
  onToggle: (moduleId: string) => void;
}) {
  const tierSet = new Set(tierModules);
  const inherited = modules.filter(m => tierSet.has(m.id));
  const optional = modules.filter(m => !tierSet.has(m.id));

  return (
    <div className="space-y-4">
      {inherited.length > 0 && (
        <section>
          <h4 className="text-muted-foreground mb-2 text-[10px] font-bold tracking-wider uppercase">
            Inherited from {tierName ?? "tier"} ({inherited.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {inherited.map(m => (
              <Badge key={m.id} variant="secondary" className="font-mono text-[11px]">
                {m.id}
              </Badge>
            ))}
          </div>
        </section>
      )}

      <section>
        <h4 className="text-muted-foreground mb-2 text-[10px] font-bold tracking-wider uppercase">
          Additional modules ({optional.length})
        </h4>
        {optional.length === 0 ? (
          <p className="text-muted-foreground text-xs">
            The tier already grants every catalog module.
          </p>
        ) : (
          <div className="grid gap-2">
            {optional.map(m => {
              const on = enabledOverrides.has(m.id);
              return (
                <label
                  key={m.id}
                  className="flex cursor-pointer items-start gap-3 rounded-md border p-3"
                >
                  <input
                    type="checkbox"
                    className="mt-1 size-4 rounded border"
                    checked={on}
                    onChange={() => onToggle(m.id)}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{m.name}</span>
                      {m.category && (
                        <Badge variant="outline" className="text-[10px]">
                          {m.category}
                        </Badge>
                      )}
                      <Badge variant={on ? "secondary" : "outline"}>
                        {on ? "added" : "off"}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground mt-1 font-mono text-[11px]">
                      {m.id}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
