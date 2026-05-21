'use client';

import { useQuery } from '@tanstack/react-query';
import { Check, Download, Plus, X } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { fetchRbacMatrix } from '@/entities/admin/api/platform-api';

function accessCell(value: 1 | 0 | 'partial' | 'self') {
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
  const { data, isLoading } = useQuery({
    queryKey: ['admin-platform', 'rbac'],
    queryFn: fetchRbacMatrix,
  });

  return (
    <div className='space-y-6 py-8'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Permission matrix</h1>
          <p className='text-muted-foreground mt-1 text-xs'>
            Click any cell to toggle. Changes apply platform-wide on next sign-in.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm' icon={<Download className='size-3.5' />}>
            Export CSV
          </Button>
          <Button size='sm' icon={<Plus className='size-3.5' />}>
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
                {/* Column headers – roles */}
                <thead>
                  <tr className='bg-muted/50 border-b'>
                    <th className='text-muted-foreground w-60 px-4 py-3 text-left text-[10px] font-bold tracking-wider uppercase'>
                      Permission
                    </th>
                    {data.roles.map((r, i) => (
                      <th
                        key={r.name}
                        className='border-l px-2 py-3 text-center'
                      >
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
                    <>
                      {/* Group header row */}
                      <tr key={`group-${group.name}`}>
                        <td
                          colSpan={data.roles.length + 1}
                          className='bg-primary/5 text-primary px-4 py-2 text-[10px] font-bold tracking-wider uppercase'
                        >
                          {group.name}
                        </td>
                      </tr>
                      {/* Permission rows */}
                      {group.permissions.map(perm => (
                        <tr key={perm.label} className='border-t'>
                          <td className='text-muted-foreground px-4 py-2.5 text-xs'>
                            {perm.label}
                          </td>
                          {perm.access.map((v, ri) => (
                            <td
                              key={ri}
                              className='border-l px-2 py-2.5 text-center'
                            >
                              {accessCell(v)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
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
    </div>
  );
}
