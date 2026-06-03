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
  ALL_BRANCH_STAFF_PERMISSIONS,
  PERMISSION_LABEL,
  ROLE_LABEL,
  deactivateBranchStaff,
  fetchBranchStaff,
  lookupStaffInvitee,
  upsertBranchStaff,
  type BranchStaffMember,
  type BranchStaffPermission,
  type BranchStaffRole,
} from '@/entities/branch-staff/api';
import { useActiveVenue } from '@/widgets/owner/venue-switcher';

const ROLE_VARIANT: Record<
  BranchStaffRole,
  'default' | 'secondary' | 'outline'
> = {
  manager: 'default',
  staff: 'secondary',
  coach: 'outline',
};

export default function MembersPage() {
  const { activeVenueId, activeVenue, isLoading: venueLoading } = useActiveVenue();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<BranchStaffMember | null>(null);

  const listQuery = useQuery({
    queryKey: ['owner-staff', activeVenueId],
    queryFn: () => fetchBranchStaff(activeVenueId as string),
    enabled: !!activeVenueId,
  });

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
  const orderedRoles: BranchStaffRole[] = ['manager', 'staff', 'coach'];

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
                    {ROLE_LABEL[roleKey]} ({grouped.get(roleKey)!.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className='p-0'>
                  <div className='divide-y'>
                    {grouped.get(roleKey)!.map(m => (
                      <StaffRow
                        key={m.id}
                        member={m}
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
  onEdit,
}: {
  member: BranchStaffMember;
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
          <Badge variant={ROLE_VARIANT[member.staffRole]} className='capitalize'>
            {ROLE_LABEL[member.staffRole]}
          </Badge>
          {!member.isActive && <Badge variant='outline'>inactive</Badge>}
        </div>
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
  const [email, setEmail] = useState('');
  const [staffRole, setStaffRole] = useState<BranchStaffRole>('staff');

  const lookupMutation = useMutation({
    mutationFn: lookupStaffInvitee,
  });

  const upsertMutation = useMutation({
    mutationFn: upsertBranchStaff,
    onSuccess: () => {
      toast.success('Member added');
      qc.invalidateQueries({ queryKey: ['owner-staff', branchId] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to add member'),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (lookupMutation.isPending || upsertMutation.isPending) return;
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error('Email is required');
      return;
    }
    try {
      const found = await lookupMutation.mutateAsync({
        branchId,
        email: trimmed,
      });
      if (!found) {
        toast.error('No user with that email');
        return;
      }
      await upsertMutation.mutateAsync({
        branchId,
        userId: found.id,
        staffRole,
        isActive: true,
      });
    } catch (err) {
      // mutations surface their own toasts; nothing extra to do
      console.error(err);
    }
  }

  return (
    <DialogContent className='sm:max-w-md'>
      <DialogHeader>
        <DialogTitle>Invite team member</DialogTitle>
        <DialogDescription>
          The user must already have a CourtConnect account. We look them up by
          email then assign their role at this venue.
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
              <SelectItem value='manager'>{ROLE_LABEL.manager}</SelectItem>
              <SelectItem value='staff'>{ROLE_LABEL.staff}</SelectItem>
              <SelectItem value='coach'>{ROLE_LABEL.coach}</SelectItem>
            </SelectContent>
          </Select>
          <p className='text-muted-foreground text-[11px]'>
            Each role gets a default permission set. Adjust later from the row.
          </p>
        </div>
        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={lookupMutation.isPending || upsertMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            isLoading={lookupMutation.isPending || upsertMutation.isPending}
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
  const [role, setRole] = useState<BranchStaffRole>(member.staffRole);
  const [permissions, setPermissions] = useState<Set<BranchStaffPermission>>(
    () => new Set(member.permissions),
  );
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
              <SelectItem value='manager'>{ROLE_LABEL.manager}</SelectItem>
              <SelectItem value='staff'>{ROLE_LABEL.staff}</SelectItem>
              <SelectItem value='coach'>{ROLE_LABEL.coach}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-1.5'>
          <Label>Permissions</Label>
          <div className='grid grid-cols-2 gap-2'>
            {ALL_BRANCH_STAFF_PERMISSIONS.map(p => {
              const on = permissions.has(p);
              return (
                <label
                  key={p}
                  className='flex cursor-pointer items-center gap-2 rounded-md border p-2 text-xs'
                >
                  <input
                    type='checkbox'
                    className='size-4 rounded border'
                    checked={on}
                    onChange={() => togglePermission(p)}
                  />
                  <div className='min-w-0'>
                    <div className='font-medium'>{PERMISSION_LABEL[p]}</div>
                    <div className='text-muted-foreground font-mono text-[10px]'>
                      {p}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
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
