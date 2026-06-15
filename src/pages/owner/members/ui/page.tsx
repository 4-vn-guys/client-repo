'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Trash2, UserPlus, Users } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
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
  FALLBACK_STAFF_PERMISSION_OPTIONS,
  SYSTEM_STAFF_ROLE_OPTIONS,
  deactivateBranchStaff,
  fetchBranchStaff,
  fetchStaffPermissions,
  fetchStaffRoles,
  lookupStaffInvitee,
  upsertBranchStaff,
  type BranchStaffMember,
  type BranchStaffPermission,
  type BranchStaffRole,
  type BranchStaffStatus,
  type StaffPermissionOption,
  type StaffRoleOption,
  type SystemStaffRole,
} from '@/entities/branch-staff/api';
import { useAuthStore } from '@/shared/store';
import { useActiveVenue } from '@/widgets/owner/venue-switcher';

const ROLE_VARIANT: Record<
  SystemStaffRole,
  'default' | 'secondary' | 'outline'
> = {
  manager: 'default',
  staff: 'secondary',
  coach: 'outline',
};

function roleVariant(role: BranchStaffRole): 'default' | 'secondary' | 'outline' {
  return ROLE_VARIANT[role as SystemStaffRole] ?? 'outline';
}

const STATUS_BADGE: Record<BranchStaffStatus, { label: string; className: string }> = {
  invited: {
    label: 'Pending',
    className: 'border-amber-300 bg-amber-50 text-amber-700',
  },
  active: {
    label: 'Active',
    className: 'border-green-300 bg-green-50 text-green-700',
  },
  declined: {
    label: 'Declined',
    className: 'border-red-300 bg-red-50 text-red-700',
  },
};

// System roles + custom roles from the admin RBAC catalog. Falls back to the
// hardcoded system roles when the endpoint is unavailable.
function useStaffRoleOptions(): StaffRoleOption[] {
  const query = useQuery({
    queryKey: ['staff-roles'],
    queryFn: fetchStaffRoles,
    staleTime: 60_000,
    retry: 1,
  });
  return query.data && query.data.length > 0
    ? query.data
    : SYSTEM_STAFF_ROLE_OPTIONS;
}

function roleLabel(role: BranchStaffRole, options: StaffRoleOption[]): string {
  return options.find(o => o.id === role)?.name ?? role;
}

// Assignable permission keys + catalog labels from the admin RBAC matrix.
// Falls back to the hardcoded list when the endpoint is unavailable.
function useStaffPermissionOptions(): StaffPermissionOption[] {
  const query = useQuery({
    queryKey: ['staff-permissions'],
    queryFn: fetchStaffPermissions,
    staleTime: 5 * 60_000,
    retry: 1,
  });
  return query.data && query.data.length > 0
    ? query.data
    : FALLBACK_STAFF_PERMISSION_OPTIONS;
}

function PermissionCheckboxes({
  options,
  selected,
  onToggle,
}: {
  options: StaffPermissionOption[];
  selected: Set<BranchStaffPermission>;
  onToggle: (p: BranchStaffPermission) => void;
}) {
  return (
    <div className='space-y-1.5'>
      <Label>Permissions</Label>
      <div className='grid grid-cols-2 gap-2'>
        {options.map(({ key, label }) => (
          <label
            key={key}
            className='flex cursor-pointer items-center gap-2 rounded-md border p-2 text-xs'
          >
            <input
              type='checkbox'
              className='size-4 rounded border'
              checked={selected.has(key)}
              onChange={() => onToggle(key)}
            />
            <div className='min-w-0'>
              <div className='font-medium'>{label}</div>
              <div className='text-muted-foreground font-mono text-[10px]'>
                {key}
              </div>
            </div>
          </label>
        ))}
      </div>
      <p className='text-muted-foreground text-[11px]'>
        Leave unchecked to follow the role&apos;s defaults from the platform
        permission matrix. Checking any box overrides the defaults for this
        member.
      </p>
    </div>
  );
}

export default function MembersPage() {
  const user = useAuthStore(s => s.user);
  const isStaffViewer = user?.role === 'user';
  const { activeVenueId, activeVenue, isLoading: venueLoading } = useActiveVenue();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<BranchStaffMember | null>(null);
  const roleOptions = useStaffRoleOptions();

  const listQuery = useQuery({
    queryKey: ['owner-staff', activeVenueId],
    queryFn: () => fetchBranchStaff(activeVenueId as string),
    enabled: !!activeVenueId && !isStaffViewer,
  });

  // Staff can reach this page via direct URL; staff management stays owner-only.
  if (isStaffViewer) {
    return (
      <div className='p-6'>
        <Card>
          <CardContent className='py-12 text-center'>
            <Users className='text-muted-foreground mx-auto mb-3 size-8' />
            <p className='text-muted-foreground text-sm'>
              Only the branch owner can manage staff.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (venueLoading) {
    return <div className='text-muted-foreground p-8 text-sm'>Loading venue…</div>;
  }
  if (!activeVenueId) {
    return (
      <div className='p-8 text-sm'>No active venue. Pick one from the sidebar.</div>
    );
  }

  const staff = listQuery.data ?? [];
  const grouped = new Map<BranchStaffRole, BranchStaffMember[]>();
  for (const m of staff) {
    if (!grouped.has(m.staffRole)) grouped.set(m.staffRole, []);
    grouped.get(m.staffRole)!.push(m);
  }
  const systemOrder: BranchStaffRole[] = ['manager', 'staff', 'coach'];
  const orderedRoles: BranchStaffRole[] = [
    ...systemOrder,
    ...Array.from(grouped.keys()).filter(r => !systemOrder.includes(r)),
  ];

  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Team & coaches</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Manage front-desk staff and coaches who can act on behalf of{' '}
            <strong>{activeVenue?.name}</strong>.
          </p>
        </div>
        <Button
          icon={<UserPlus className='size-4' />}
          onClick={() => setInviteOpen(true)}
        >
          Invite member
        </Button>
      </div>

      {listQuery.isLoading ? (
        <div className='text-muted-foreground text-sm'>Loading staff…</div>
      ) : listQuery.isError ? (
        <div className='text-sm text-red-600'>
          {(listQuery.error as Error).message}
        </div>
      ) : staff.length === 0 ? (
        <Card>
          <CardContent className='py-12 text-center'>
            <Users className='text-muted-foreground mx-auto mb-3 size-8' />
            <p className='text-muted-foreground text-sm'>
              No staff members yet. Invite a manager, front-desk, or coach to get
              started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-4'>
          {orderedRoles
            .filter(r => grouped.has(r))
            .map(roleKey => (
              <Card key={roleKey} className='gap-0 py-0'>
                <CardHeader className='border-b'>
                  <CardTitle className='text-sm'>
                    {roleLabel(roleKey, roleOptions)} ({grouped.get(roleKey)!.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className='p-0'>
                  <div className='divide-y'>
                    {grouped.get(roleKey)!.map(m => (
                      <StaffRow
                        key={m.id}
                        member={m}
                        roleOptions={roleOptions}
                        onEdit={() => setEditTarget(m)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      <InviteDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        branchId={activeVenueId}
      />
      <EditDialog
        target={editTarget}
        onOpenChange={open => {
          if (!open) setEditTarget(null);
        }}
        branchId={activeVenueId}
      />
    </div>
  );
}

function StaffRow({
  member,
  roleOptions,
  onEdit,
}: {
  member: BranchStaffMember;
  roleOptions: StaffRoleOption[];
  onEdit: () => void;
}) {
  const name =
    member.user?.username || member.user?.email || member.userId.slice(0, 8);
  return (
    <button
      type='button'
      onClick={onEdit}
      className='hover:bg-muted/30 flex w-full cursor-pointer items-start gap-3 p-4 text-left'
    >
      <div className='bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase'>
        {name.slice(0, 2)}
      </div>
      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='truncate font-semibold'>{name}</span>
          <Badge variant={roleVariant(member.staffRole)} className='capitalize'>
            {roleLabel(member.staffRole, roleOptions)}
          </Badge>
          {member.status && (
            <Badge variant='outline' className={STATUS_BADGE[member.status].className}>
              {STATUS_BADGE[member.status].label}
            </Badge>
          )}
          {!member.isActive && member.status !== 'declined' && (
            <Badge variant='outline'>inactive</Badge>
          )}
        </div>
        {member.status === 'declined' && (
          <p className='mt-0.5 text-xs text-red-600'>
            Declined the invitation — re-run the invite to send a new one.
          </p>
        )}
        <div className='text-muted-foreground mt-0.5 truncate text-xs'>
          {member.user?.email ?? '—'}
          {member.user?.phoneNumber ? ` · ${member.user.phoneNumber}` : ''}
        </div>
        <div className='text-muted-foreground mt-1 flex flex-wrap gap-1'>
          {member.permissions.map(p => (
            <Badge key={p} variant='outline' className='font-mono text-[10px]'>
              {p}
            </Badge>
          ))}
        </div>
      </div>
    </button>
  );
}

function InviteDialog({
  open,
  onOpenChange,
  branchId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  branchId: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <InviteDialogContent branchId={branchId} onOpenChange={onOpenChange} />
      )}
    </Dialog>
  );
}

function InviteDialogContent({
  branchId,
  onOpenChange,
}: {
  branchId: string;
  onOpenChange: (v: boolean) => void;
}) {
  const qc = useQueryClient();
  const roleOptions = useStaffRoleOptions();
  const permissionOptions = useStaffPermissionOptions();
  const { branches } = useActiveVenue();
  const [email, setEmail] = useState('');
  const [staffRole, setStaffRole] = useState<BranchStaffRole>('staff');
  // All unchecked by default = permissions: [] = follow the role's defaults
  // from the platform permission matrix. Never auto-fill role defaults here.
  const [permissions, setPermissions] = useState<Set<BranchStaffPermission>>(
    () => new Set(),
  );
  const [selectedBranchIds, setSelectedBranchIds] = useState<Set<string>>(
    () => new Set([branchId]),
  );
  const [isInviting, setIsInviting] = useState(false);

  // Only branches the visitor actually owns — staff-access branches (if any)
  // can't be invited into.
  const ownedBranches = branches.filter(b => b.accessVia !== 'staff');

  const lookupMutation = useMutation({
    mutationFn: lookupStaffInvitee,
  });

  function toggleBranch(id: string) {
    setSelectedBranchIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function togglePermission(p: BranchStaffPermission) {
    setPermissions(prev => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (lookupMutation.isPending || isInviting) return;
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error('Email is required');
      return;
    }
    const targets = ownedBranches.filter(b => selectedBranchIds.has(b.id));
    if (targets.length === 0) {
      toast.error('Select at least one branch');
      return;
    }
    setIsInviting(true);
    try {
      const found = await lookupMutation.mutateAsync({
        branchId,
        email: trimmed,
      });
      if (!found) {
        toast.error('No user with that email');
        return;
      }
      const results = await Promise.allSettled(
        targets.map(b =>
          upsertBranchStaff({
            branchId: b.id,
            userId: found.id,
            staffRole,
            // [] = follow the role's matrix defaults; non-empty = override.
            permissions: Array.from(permissions),
            isActive: true,
          }),
        ),
      );
      let succeeded = 0;
      results.forEach((r, i) => {
        if (r.status === 'fulfilled') {
          succeeded += 1;
        } else {
          const message =
            r.reason instanceof Error ? r.reason.message : 'Invite failed';
          toast.error(`${targets[i].name}: ${message}`);
        }
      });
      if (succeeded > 0) {
        toast.success(
          `Invited to ${succeeded} ${succeeded === 1 ? 'branch' : 'branches'} — they've been emailed the details.`,
        );
        qc.invalidateQueries({ queryKey: ['owner-staff', branchId] });
        onOpenChange(false);
      }
    } catch (err) {
      // lookup surfaces its own toast; nothing extra to do
      console.error(err);
    } finally {
      setIsInviting(false);
    }
  }

  return (
    <DialogContent className='sm:max-w-md'>
      <DialogHeader>
        <DialogTitle>Invite team member</DialogTitle>
        <DialogDescription>
          The user must already have a CourtConnect account. We look them up by
          email then assign their role at the chosen branches.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='m-email'>Email</Label>
          <Input
            id='m-email'
            type='email'
            required
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='person@example.com'
          />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='m-role'>Role</Label>
          <Select
            value={staffRole}
            onValueChange={v => setStaffRole(v as BranchStaffRole)}
          >
            <SelectTrigger id='m-role'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map(r => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <PermissionCheckboxes
          options={permissionOptions}
          selected={permissions}
          onToggle={togglePermission}
        />
        <div className='space-y-1.5'>
          <Label>Branches</Label>
          <div className='max-h-40 space-y-1 overflow-y-auto rounded-md border p-2'>
            {ownedBranches.map(b => (
              <label
                key={b.id}
                className='hover:bg-muted/40 flex cursor-pointer items-center gap-2 rounded-md p-1.5 text-sm'
              >
                <input
                  type='checkbox'
                  className='size-4 rounded border'
                  checked={selectedBranchIds.has(b.id)}
                  onChange={() => toggleBranch(b.id)}
                />
                <span className='min-w-0 truncate'>{b.name}</span>
              </label>
            ))}
            {ownedBranches.length === 0 && (
              <p className='text-muted-foreground p-1.5 text-xs'>
                No branches available.
              </p>
            )}
          </div>
          <p className='text-muted-foreground text-[11px]'>
            Staff get the selected role in each chosen branch. Re-run the invite
            with a different selection to give a different role per branch.
          </p>
        </div>
        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={lookupMutation.isPending || isInviting}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            isLoading={lookupMutation.isPending || isInviting}
          >
            Add
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function EditDialog({
  target,
  onOpenChange,
  branchId,
}: {
  target: BranchStaffMember | null;
  onOpenChange: (v: boolean) => void;
  branchId: string;
}) {
  if (!target) return null;
  return (
    <Dialog open={!!target} onOpenChange={onOpenChange}>
      <EditDialogContent
        key={target.id}
        member={target}
        branchId={branchId}
        onOpenChange={onOpenChange}
      />
    </Dialog>
  );
}

function EditDialogContent({
  member,
  branchId,
  onOpenChange,
}: {
  member: BranchStaffMember;
  branchId: string;
  onOpenChange: (v: boolean) => void;
}) {
  const qc = useQueryClient();
  const roleOptions = useStaffRoleOptions();
  const permissionOptions = useStaffPermissionOptions();
  // Empty stored permissions = the member follows the role's matrix defaults,
  // so nothing is pre-checked; a non-empty array is an explicit override.
  const [permissions, setPermissions] = useState<Set<BranchStaffPermission>>(
    () => new Set(member.permissions),
  );
  const [role, setRole] = useState<BranchStaffRole>(member.staffRole);
  const [isActive, setIsActive] = useState<boolean>(member.isActive);

  const saveMutation = useMutation({
    mutationFn: upsertBranchStaff,
    onSuccess: () => {
      toast.success('Updated');
      qc.invalidateQueries({ queryKey: ['owner-staff', branchId] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message || 'Save failed'),
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateBranchStaff,
    onSuccess: () => {
      toast.success('Member deactivated');
      qc.invalidateQueries({ queryKey: ['owner-staff', branchId] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to deactivate'),
  });

  function togglePermission(p: BranchStaffPermission) {
    setPermissions(prev => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  }

  const displayName = useMemo(
    () => member.user?.username || member.user?.email || member.userId,
    [member],
  );

  return (
    <DialogContent className='sm:max-w-md'>
      <DialogHeader>
        <DialogTitle>{displayName}</DialogTitle>
        <DialogDescription>
          {member.user?.email ?? 'No email on file'}
        </DialogDescription>
      </DialogHeader>
      <div className='space-y-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='m-role-edit'>Role</Label>
          <Select value={role} onValueChange={v => setRole(v as BranchStaffRole)}>
            <SelectTrigger id='m-role-edit'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map(r => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
              {!roleOptions.some(r => r.id === member.staffRole) && (
                <SelectItem value={member.staffRole}>
                  {member.staffRole}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <PermissionCheckboxes
          options={permissionOptions}
          selected={permissions}
          onToggle={togglePermission}
        />
        <label className='flex items-center gap-2 text-sm'>
          <input
            type='checkbox'
            className='size-4 rounded border'
            checked={isActive}
            onChange={e => setIsActive(e.target.checked)}
          />
          Active
        </label>
      </div>
      <DialogFooter className='sm:justify-between'>
        <Button
          type='button'
          variant='outline'
          colorPattern='red'
          icon={<Trash2 className='size-3.5' />}
          isLoading={deactivateMutation.isPending}
          disabled={
            saveMutation.isPending || deactivateMutation.isPending || !member.isActive
          }
          onClick={() =>
            deactivateMutation.mutate({ branchId, userId: member.userId })
          }
        >
          Deactivate
        </Button>
        <div className='flex gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={saveMutation.isPending || deactivateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type='button'
            isLoading={saveMutation.isPending}
            disabled={deactivateMutation.isPending}
            onClick={() =>
              saveMutation.mutate({
                branchId,
                userId: member.userId,
                staffRole: role,
                permissions: Array.from(permissions),
                isActive,
              })
            }
          >
            Save
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
