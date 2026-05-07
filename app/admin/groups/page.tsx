'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import {
  createOwnerGroup,
  fetchOwnerGroups,
} from '@/entities/admin/api/owner-groups-api';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';

export default function AdminOwnerGroupsPage() {
  const qc = useQueryClient();
  const [name, setName] = useState('');

  const groupsQuery = useQuery({
    queryKey: ['admin-owner-groups'],
    queryFn: fetchOwnerGroups,
  });

  const createMutation = useMutation({
    mutationFn: async () => createOwnerGroup(name),
    onSuccess: group => {
      toast.success('Group created');
      setName('');
      qc.setQueryData(['admin-owner-groups'], (prev?: any[]) =>
        prev ? [group, ...prev] : [group]
      );
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to create group'),
  });

  const groups = useMemo(() => groupsQuery.data ?? [], [groupsQuery.data]);

  return (
    <div className='py-8 space-y-6'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold'>Owner groups</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Create groups to manage shared module access for multiple owners.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create group</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-3 sm:flex-row sm:items-center'>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Group name (e.g. Tier A Owners)'
          />
          <Button
            onClick={() => createMutation.mutate()}
            disabled={!name.trim() || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating…' : 'Create'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Groups</CardTitle>
        </CardHeader>
        <CardContent>
          {groupsQuery.isLoading ? (
            <div className='text-muted-foreground text-sm'>Loading…</div>
          ) : groupsQuery.isError ? (
            <div className='text-sm text-red-600'>Failed to load groups.</div>
          ) : groups.length === 0 ? (
            <div className='text-muted-foreground text-sm'>
              No groups yet. Create one above.
            </div>
          ) : (
            <div className='divide-y rounded-md border'>
              {groups.map(g => (
                <div
                  key={g.id}
                  className='flex items-center justify-between gap-4 p-4'
                >
                  <div className='min-w-0'>
                    <div className='truncate font-medium'>{g.name}</div>
                    <div className='text-muted-foreground truncate text-xs'>
                      {g.id}
                    </div>
                  </div>
                  <Button asChild variant='outline' size='sm'>
                    <Link href={`/admin/groups/${g.id}`}>Manage</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

