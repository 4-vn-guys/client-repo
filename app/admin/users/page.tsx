'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import {
  createOwnerUser,
  deleteUser,
  fetchUsers,
  setUserActive,
  type AdminUser,
} from '@/entities/admin/api/users-api';

function RoleBadge({ role }: { role: AdminUser['role'] }) {
  if (role === 'admin') return <Badge>admin</Badge>;
  if (role === 'owner') return <Badge variant='secondary'>owner</Badge>;
  return <Badge variant='outline'>user</Badge>;
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const [newEmail, setNewEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const query = useQuery({
    queryKey: ['admin-users', search],
    queryFn: () => fetchUsers({ page: 1, perPage: 25, search }),
  });

  const users = query.data?.docs ?? [];

  const createMutation = useMutation({
    mutationFn: () =>
      createOwnerUser({
        email: newEmail.trim(),
        password: newPassword,
        userName: newUserName.trim(),
      }),
    onSuccess: () => {
      toast.success('Owner created');
      setCreateOpen(false);
      setNewEmail('');
      setNewUserName('');
      setNewPassword('');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to create owner'),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (u: AdminUser) => setUserActive(u.id, !u.isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to update user'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      toast.success('User deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to delete user'),
  });

  const stats = useMemo(() => {
    const byRole = users.reduce(
      (acc, u) => {
        acc[u.role] += 1;
        return acc;
      },
      { admin: 0, owner: 0, user: 0 } as Record<AdminUser['role'], number>
    );
    return { total: users.length, ...byRole };
  }, [users]);

  return (
    <div className='container mx-auto max-w-6xl space-y-6 py-8'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Users</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Manage owners and users. Admin accounts have full access by default.
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button type='button'>Create owner</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create owner</DialogTitle>
              <DialogDescription>
                Creates an owner account that can manage branches.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-3'>
              <div className='grid gap-1'>
                <label className='text-sm font-medium'>Email</label>
                <Input
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder='owner@example.com'
                />
              </div>
              <div className='grid gap-1'>
                <label className='text-sm font-medium'>Username</label>
                <Input
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  placeholder='Owner name'
                />
              </div>
              <div className='grid gap-1'>
                <label className='text-sm font-medium'>Password</label>
                <Input
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  type='password'
                  placeholder='Password'
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setCreateOpen(false)}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type='button'
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating…' : 'Create owner'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className='gap-4 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <CardTitle>Directory</CardTitle>
            <CardDescription>
              Showing {stats.total} users (admins: {stats.admin}, owners:{' '}
              {stats.owner}, users: {stats.user})
            </CardDescription>
          </div>
          <div className='max-w-sm'>
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Search by username or email…'
            />
          </div>
        </CardHeader>
        <CardContent>
          {query.isLoading ? (
            <div className='text-muted-foreground text-sm'>Loading…</div>
          ) : query.isError ? (
            <div className='text-sm text-red-600'>Failed to load users.</div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full border-collapse text-sm'>
                <thead>
                  <tr className='text-muted-foreground border-b text-left'>
                    <th className='py-2 pr-4 font-medium'>User</th>
                    <th className='py-2 pr-4 font-medium'>Role</th>
                    <th className='py-2 pr-4 font-medium'>Status</th>
                    <th className='py-2 pr-0 text-right font-medium'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className='border-b last:border-b-0'>
                      <td className='py-3 pr-4'>
                        {u.role === 'owner' ? (
                          <Link
                            className='hover:underline'
                            href={`/admin/owners/${u.id}`}
                          >
                            <div className='font-medium'>{u.username}</div>
                          </Link>
                        ) : (
                          <div className='font-medium'>{u.username}</div>
                        )}
                        <div className='text-muted-foreground text-xs'>
                          {u.email ?? '—'}
                        </div>
                        <div className='text-muted-foreground mt-1 text-[10px]'>
                          id: {u.id}
                        </div>
                      </td>
                      <td className='py-3 pr-4'>
                        <RoleBadge role={u.role} />
                      </td>
                      <td className='py-3 pr-4'>
                        {u.isActive ? (
                          <Badge variant='secondary'>active</Badge>
                        ) : (
                          <Badge variant='outline'>inactive</Badge>
                        )}
                      </td>
                      <td className='py-3 pr-0'>
                        <div className='flex justify-end gap-2'>
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => toggleActiveMutation.mutate(u)}
                            disabled={
                              toggleActiveMutation.isPending ||
                              u.role === 'admin'
                            }
                            title={
                              u.role === 'admin'
                                ? 'Admin accounts cannot be deactivated here'
                                : undefined
                            }
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            type='button'
                            variant='solid'
                            colorPattern='red'
                            size='sm'
                            onClick={() => deleteMutation.mutate(u.id)}
                            disabled={
                              deleteMutation.isPending || u.role === 'admin'
                            }
                            title={
                              u.role === 'admin'
                                ? 'Admin accounts cannot be deleted here'
                                : undefined
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 ? (
                    <tr>
                      <td
                        className='text-muted-foreground py-8 text-center text-sm'
                        colSpan={4}
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
