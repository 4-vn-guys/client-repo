'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ChevronLeft, Copy, Plus, Trash2 } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  createTier,
  deleteTier,
  fetchTierDetail,
  fetchTiers,
  setTierModules,
  type TierDetail,
  type TierSummary,
} from '@/entities/admin/api/tiers-api';
import {
  fetchCatalogModules,
  type CatalogModule,
} from '@/entities/admin/api/platform-api';

export default function AdminTiersPage() {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const tiersQuery = useQuery({
    queryKey: ['admin-tiers'],
    queryFn: fetchTiers,
  });

  const detailQuery = useQuery({
    queryKey: ['admin-tier', selectedId],
    queryFn: () => fetchTierDetail(selectedId as string),
    enabled: !!selectedId,
  });

  const modulesQuery = useQuery({
    queryKey: ['admin-catalog-modules'],
    queryFn: fetchCatalogModules,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTier,
    onSuccess: () => {
      toast.success('Tier deleted');
      setSelectedId(null);
      qc.invalidateQueries({ queryKey: ['admin-tiers'] });
    },
    onError: (e: Error) => toast.error(e.message || 'Delete failed'),
  });

  const tiers = tiersQuery.data ?? [];

  return (
    <div className='space-y-6 py-8'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold'>Tier presets</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Reusable templates of modules + RBAC overrides. Apply a tier to an
            Owner Group as its baseline.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button asChild variant='outline' size='sm' icon={<ChevronLeft className='size-3.5' />}>
            <Link href='/admin/groups'>Back to groups</Link>
          </Button>
          <Button size='sm' icon={<Plus className='size-3.5' />} onClick={() => setCreateOpen(true)}>
            New tier
          </Button>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-[1fr_1.2fr]'>
        <Card>
          <CardHeader>
            <CardTitle className='text-sm'>Tiers</CardTitle>
            <CardDescription>System tiers cannot be deleted.</CardDescription>
          </CardHeader>
          <CardContent className='p-0'>
            {tiersQuery.isLoading ? (
              <div className='text-muted-foreground p-6 text-center text-sm'>Loading…</div>
            ) : tiers.length === 0 ? (
              <div className='text-muted-foreground p-6 text-center text-sm'>
                No tiers yet.
              </div>
            ) : (
              <div className='divide-y'>
                {tiers.map(t => (
                  <TierRow
                    key={t.id}
                    tier={t}
                    selected={selectedId === t.id}
                    onSelect={() => setSelectedId(t.id)}
                    onDelete={() => deleteMutation.mutate(t.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedId && detailQuery.data ? (
          <TierDetailPane
            key={detailQuery.data.id}
            tier={detailQuery.data}
            catalogModules={modulesQuery.data ?? []}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className='text-sm'>
                {selectedId ? 'Loading…' : 'Select a tier'}
              </CardTitle>
              <CardDescription>
                Pick a tier from the list to view and edit its modules.
              </CardDescription>
            </CardHeader>
            <CardContent className='text-muted-foreground text-sm'>
              {selectedId ? 'Loading details…' : 'No tier selected.'}
            </CardContent>
          </Card>
        )}
      </div>

      <CreateTierDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        tiers={tiers}
      />
    </div>
  );
}

function TierDetailPane({
  tier,
  catalogModules,
}: {
  tier: TierDetail;
  catalogModules: CatalogModule[];
}) {
  const qc = useQueryClient();
  const [localModules, setLocalModules] = useState<Set<string>>(
    () => new Set(tier.modules),
  );

  const moduleMutation = useMutation({
    mutationFn: () => setTierModules(tier.id, Array.from(localModules)),
    onSuccess: () => {
      toast.success('Tier modules updated');
      qc.invalidateQueries({ queryKey: ['admin-tier', tier.id] });
      qc.invalidateQueries({ queryKey: ['admin-tiers'] });
    },
    onError: (e: Error) => toast.error(e.message || 'Update failed'),
  });

  const serverSet = new Set(tier.modules);
  const dirty =
    serverSet.size !== localModules.size ||
    Array.from(localModules).some(m => !serverSet.has(m));

  function toggle(moduleId: string) {
    setLocalModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  }

  // Group modules by category for nicer scanning
  const byCategory = new Map<string, CatalogModule[]>();
  for (const m of catalogModules) {
    const cat = m.category ?? 'Other';
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(m);
  }

  return (
    <Card>
      <CardHeader className='flex-row items-start justify-between'>
        <div>
          <CardTitle className='text-sm'>
            {tier.name}
            {tier.isSystem && (
              <Badge variant='outline' className='ml-2 align-middle'>
                system · read-only
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {tier.description ?? 'Select which catalog modules this tier provides as a baseline.'}
          </CardDescription>
        </div>
        <Button
          size='sm'
          disabled={!dirty || tier.isSystem || moduleMutation.isPending}
          isLoading={moduleMutation.isPending}
          onClick={() => moduleMutation.mutate()}
        >
          Save modules
        </Button>
      </CardHeader>
      <CardContent className='space-y-5 text-sm'>
        <section className='space-y-3'>
          {Array.from(byCategory.entries()).map(([cat, mods]) => (
            <div key={cat}>
              <h4 className='text-muted-foreground mb-1.5 text-[10px] font-bold tracking-wider uppercase'>
                {cat}
              </h4>
              <div className='grid gap-1.5 sm:grid-cols-2'>
                {mods.map(m => {
                  const on = localModules.has(m.id);
                  return (
                    <label
                      key={m.id}
                      className={`flex items-start gap-2.5 rounded-md border p-2.5 ${
                        tier.isSystem ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-muted/40'
                      }`}
                    >
                      <input
                        type='checkbox'
                        className='mt-0.5 size-4 rounded border'
                        checked={on}
                        disabled={tier.isSystem}
                        onChange={() => toggle(m.id)}
                      />
                      <div className='min-w-0 flex-1'>
                        <div className='flex flex-wrap items-center gap-1.5'>
                          <span className='font-medium'>{m.name}</span>
                          {m.isEnterprise && (
                            <Badge variant='outline' className='text-[9px]'>
                              enterprise
                            </Badge>
                          )}
                        </div>
                        <div className='text-muted-foreground mt-0.5 font-mono text-[10px]'>
                          {m.id}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {tier.permissionOverrides.length > 0 && (
          <section>
            <h4 className='text-muted-foreground mb-2 text-[10px] font-bold tracking-wider uppercase'>
              Permission overrides ({tier.permissionOverrides.length})
            </h4>
            <div className='overflow-hidden rounded-md border text-xs'>
              <table className='w-full'>
                <thead className='bg-muted/50 text-muted-foreground'>
                  <tr>
                    <th className='px-3 py-2 text-left font-semibold'>Role</th>
                    <th className='px-3 py-2 text-left font-semibold'>Permission</th>
                    <th className='px-3 py-2 text-left font-semibold'>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {tier.permissionOverrides.map((o, i) => (
                    <tr key={i} className='border-t'>
                      <td className='px-3 py-2 font-mono'>{o.roleId}</td>
                      <td className='px-3 py-2 font-mono'>{o.permissionKey}</td>
                      <td className='px-3 py-2'>
                        <Badge variant='outline'>{o.value}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className='text-muted-foreground mt-1 text-[11px]'>
              Permission overrides are visible but not yet edited from this UI.
            </p>
          </section>
        )}
      </CardContent>
    </Card>
  );
}

function TierRow({
  tier,
  selected,
  onSelect,
  onDelete,
}: {
  tier: TierSummary;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 p-4 transition-colors ${
        selected ? 'bg-muted/60' : 'hover:bg-muted/30'
      }`}
    >
      <button
        type='button'
        onClick={onSelect}
        className='min-w-0 flex-1 cursor-pointer text-left'
      >
        <div className='flex items-center gap-2'>
          <span className='font-semibold'>{tier.name}</span>
          {tier.isSystem && <Badge variant='outline'>system</Badge>}
        </div>
        <div className='text-muted-foreground mt-1 truncate text-xs'>
          slug: <span className='font-mono'>{tier.slug}</span> ·{' '}
          {tier.moduleCount} modules
          {tier.overrideCount > 0 && ` · ${tier.overrideCount} overrides`}
        </div>
      </button>
      {!tier.isSystem && (
        <Button
          variant='ghost'
          size='icon-sm'
          aria-label={`Delete ${tier.name}`}
          onClick={onDelete}
        >
          <Trash2 className='size-4' />
        </Button>
      )}
    </div>
  );
}

function CreateTierDialog({
  open,
  onOpenChange,
  tiers,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tiers: TierSummary[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <CreateTierDialogContent
          tiers={tiers}
          onOpenChange={onOpenChange}
        />
      )}
    </Dialog>
  );
}

function CreateTierDialogContent({
  tiers,
  onOpenChange,
}: {
  tiers: TierSummary[];
  onOpenChange: (v: boolean) => void;
}) {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [cloneFromId, setCloneFromId] = useState<string>('__none');

  const mutation = useMutation({
    mutationFn: createTier,
    onSuccess: t => {
      toast.success(`Tier "${t.name}" created`);
      qc.invalidateQueries({ queryKey: ['admin-tiers'] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message || 'Create failed'),
  });

  return (
    <DialogContent className='sm:max-w-md'>
      <DialogHeader>
        <DialogTitle>New tier</DialogTitle>
        <DialogDescription>
          Create a reusable preset of modules + permission overrides.
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (mutation.isPending) return;
          mutation.mutate({
            name,
            slug: slug.trim() || undefined,
            description: description.trim() || undefined,
            cloneFromId: cloneFromId === '__none' ? undefined : cloneFromId,
          });
        }}
        className='space-y-4'
      >
        <div className='space-y-1.5'>
          <Label htmlFor='tier-name'>Name</Label>
          <Input
            id='tier-name'
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Franchise · VN'
          />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='tier-slug'>Slug (optional)</Label>
          <Input
            id='tier-slug'
            value={slug}
            onChange={e => setSlug(e.target.value)}
            placeholder='franchise-vn'
          />
          <p className='text-muted-foreground text-[11px]'>
            Auto-derived from name if blank.
          </p>
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='tier-clone'>Clone from</Label>
          <Select value={cloneFromId} onValueChange={setCloneFromId}>
            <SelectTrigger id='tier-clone'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='__none'>Empty</SelectItem>
              {tiers.map(t => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='tier-desc'>Description (optional)</Label>
          <Input
            id='tier-desc'
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            isLoading={mutation.isPending}
            icon={<Copy className='size-3.5' />}
          >
            Create
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
