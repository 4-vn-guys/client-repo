'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Check, Download, Plus, X } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
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
  addCustomRole,
  fetchRbacMatrix,
  updateRbacCell,
  type RbacMatrix,
} from '@/entities/admin/api/platform-api';

type CellValue = 1 | 0 | 'partial' | 'self';

const CELL_CYCLE: CellValue[] = [1, 'partial', 'self', 0];

function nextCellValue(value: CellValue): CellValue {
  const idx = CELL_CYCLE.indexOf(value);
  return CELL_CYCLE[(idx + 1) % CELL_CYCLE.length];
}

function accessCell(value: CellValue) {
  if (value === 1) {
    return (
      <span className='inline-flex size-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'>
        <Check className='size-3' strokeWidth={3} />
      </span>
    );
  }
  if (value === 'partial') {
    return (
      <span className='inline-flex size-6 items-center justify-center rounded-md bg-amber-50 text-xs font-bold text-amber-800 dark:bg-amber-500/10 dark:text-amber-400'>
        ◐
      </span>
    );
  }
  if (value === 'self') {
    return (
      <span className='inline-flex items-center justify-center rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-500/10 dark:text-purple-400'>
        self
      </span>
    );
  }
  return (
    <span className='text-muted-foreground inline-flex size-6 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800'>
      <X className='size-3' />
    </span>
  );
}

export default function AdminRbacPage() {
  const qc = useQueryClient();
  const [customRoleOpen, setCustomRoleOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-platform', 'rbac'],
    queryFn: fetchRbacMatrix,
  });

  const cellMutation = useMutation({
    mutationFn: updateRbacCell,
    onMutate: async input => {
      await qc.cancelQueries({ queryKey: ['admin-platform', 'rbac'] });
      const previous = qc.getQueryData<RbacMatrix>(['admin-platform', 'rbac']);
      if (previous) {
        qc.setQueryData<RbacMatrix>(['admin-platform', 'rbac'], {
          ...previous,
          groups: previous.groups.map(g =>
            g.name !== input.group
              ? g
              : {
                  ...g,
                  permissions: g.permissions.map(p =>
                    p.label !== input.label
                      ? p
                      : {
                          ...p,
                          access: p.access.map((v, i) =>
                            i === input.roleIndex ? input.value : v,
                          ),
                        },
                  ),
                },
          ),
        });
      }
      return { previous };
    },
    onError: (e: Error, _input, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(['admin-platform', 'rbac'], ctx.previous);
      }
      toast.error(e.message || 'Failed to update permission');
    },
    onSuccess: () => {
      toast.success('Permission updated');
    },
  });

  const exportCsv = () => {
    if (!data) return;
    const header = ['Group', 'Permission', ...data.roles.map(r => r.name)];
    const lines: string[] = [header.join(',')];
    for (const group of data.groups) {
      for (const perm of group.permissions) {
        const row = [
          group.name,
          perm.label,
          ...perm.access.map(v =>
            v === 1 ? 'allow' : v === 'partial' ? 'partial' : v === 'self' ? 'self' : 'deny',
          ),
        ];
        lines.push(row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','));
      }
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rbac-matrix-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported');
  };

  return (
    <div className='space-y-6 py-8'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Permission matrix</h1>
          <p className='text-muted-foreground mt-1 text-xs'>
            Click any cell to cycle: allow → partial → self → deny. Changes apply on next sign-in.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            icon={<Download className='size-3.5' />}
            onClick={exportCsv}
            disabled={!data}
          >
            Export CSV
          </Button>
          <Button
            size='sm'
            icon={<Plus className='size-3.5' />}
            onClick={() => setCustomRoleOpen(true)}
          >
            Custom role
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className='text-muted-foreground py-12 text-center text-sm'>Loading matrix…</div>
      ) : data ? (
        <>
          <Card className='gap-0 overflow-hidden py-0'>
            <CardContent className='overflow-x-auto p-0'>
              <table className='w-full border-collapse text-sm'>
                <thead>
                  <tr className='bg-muted/50 border-b'>
                    <th className='text-muted-foreground w-60 px-4 py-3 text-left text-[10px] font-bold tracking-wider uppercase'>
                      Permission
                    </th>
                    {data.roles.map((r, i) => (
                      <th key={r.name} className='border-l px-2 py-3 text-center'>
                        <div
                          className={`text-xs font-bold ${
                            i === 0 ? 'text-primary' : 'text-foreground'
                          }`}
                        >
                          {r.name}
                        </div>
                        <div className='text-muted-foreground mt-0.5 text-[10px] font-normal'>
                          {r.count.toLocaleString()} total
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.groups.map(group => (
                    <RbacGroupRows
                      key={group.name}
                      group={group}
                      roleCount={data.roles.length}
                      onCellClick={(label, roleIndex, current) =>
                        cellMutation.mutate({
                          group: group.name,
                          label,
                          roleIndex,
                          value: nextCellValue(current),
                        })
                      }
                    />
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Legend */}
          <div className='text-muted-foreground flex flex-wrap gap-5 text-xs'>
            <span className='flex items-center gap-1.5'>
              <span className='size-3 rounded bg-emerald-50 dark:bg-emerald-500/10' /> Allow
            </span>
            <span className='flex items-center gap-1.5'>
              <span className='size-3 rounded bg-amber-50 dark:bg-amber-500/10' /> Partial · within
              scope
            </span>
            <span className='flex items-center gap-1.5'>
              <span className='size-3 rounded bg-purple-50 dark:bg-purple-500/10' /> Self only
            </span>
            <span className='flex items-center gap-1.5'>
              <span className='size-3 rounded bg-gray-100 dark:bg-gray-800' /> Deny
            </span>
          </div>
        </>
      ) : null}

      <CustomRoleDialog
        open={customRoleOpen}
        onOpenChange={setCustomRoleOpen}
        existingRoles={data?.roles.map(r => r.name) ?? []}
      />
    </div>
  );
}

function RbacGroupRows({
  group,
  roleCount,
  onCellClick,
}: {
  group: RbacMatrix['groups'][number];
  roleCount: number;
  onCellClick: (label: string, roleIndex: number, current: CellValue) => void;
}) {
  return (
    <>
      <tr>
        <td
          colSpan={roleCount + 1}
          className='bg-primary/5 text-primary px-4 py-2 text-[10px] font-bold tracking-wider uppercase'
        >
          {group.name}
        </td>
      </tr>
      {group.permissions.map(perm => (
        <tr key={perm.label} className='border-t'>
          <td className='text-muted-foreground px-4 py-2.5 text-xs'>{perm.label}</td>
          {perm.access.map((v, ri) => (
            <td key={ri} className='border-l px-2 py-2.5 text-center'>
              <button
                type='button'
                className='hover:bg-muted cursor-pointer rounded-md p-1 transition-colors'
                onClick={() => onCellClick(perm.label, ri, v)}
                aria-label={`Toggle ${perm.label} for column ${ri + 1}`}
              >
                {accessCell(v)}
              </button>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function CustomRoleDialog({
  open,
  onOpenChange,
  existingRoles,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  existingRoles: string[];
}) {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [inheritFrom, setInheritFrom] = useState<string>('Front desk');
  const [description, setDescription] = useState('');

  const mutation = useMutation({
    mutationFn: addCustomRole,
    onSuccess: () => {
      toast.success(`Role "${name}" created`);
      qc.invalidateQueries({ queryKey: ['admin-platform', 'rbac'] });
      setName('');
      setDescription('');
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to create role'),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Custom role</DialogTitle>
          <DialogDescription>
            Roles start fresh with all permissions denied. Toggle cells after creation.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (mutation.isPending) return;
            mutation.mutate({ name, inheritFrom, description });
          }}
          className='space-y-4'
        >
          <div className='space-y-1.5'>
            <Label htmlFor='role-name'>Role name</Label>
            <Input
              id='role-name'
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Assistant manager'
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='role-inherit'>Inherit defaults from</Label>
            <Select value={inheritFrom} onValueChange={setInheritFrom}>
              <SelectTrigger id='role-inherit'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {existingRoles.map(r => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='role-desc'>Description (optional)</Label>
            <Input
              id='role-desc'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='What does this role do?'
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
            <Button type='submit' isLoading={mutation.isPending}>
              Create role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
