'use client';

import { cn } from '@/src/shared/lib';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaDir?: 'up' | 'down';
  className?: string;
}

export function StatCard({
  label,
  value,
  delta,
  deltaDir = 'up',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      <p className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
        {label}
      </p>
      <p className='mt-1 text-2xl font-bold tracking-tight'>{value}</p>
      {delta && (
        <div
          className={cn(
            'mt-1.5 flex items-center gap-1 text-xs font-semibold',
            deltaDir === 'up' ? 'text-emerald-600' : 'text-red-600'
          )}
        >
          {deltaDir === 'up' ? (
            <TrendingUp className='size-3.5' />
          ) : (
            <TrendingDown className='size-3.5' />
          )}
          {delta}
        </div>
      )}
    </div>
  );
}
