'use client';

import { cn } from '@/shared/lib/utils';
import type { Court } from '@/entities/court';

interface CourtSelectorProps {
  courts: Court[];
  selectedCourtId: string;
  onSelectCourt: (courtId: string) => void;
  error?: string;
}

export function CourtSelector({
  courts,
  selectedCourtId,
  onSelectCourt,
  error,
}: CourtSelectorProps) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium'>Court</label>
      <div className='flex flex-wrap gap-2'>
        {courts.map(court => (
          <button
            key={court.id}
            type='button'
            onClick={() => onSelectCourt(court.id)}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium transition-colors',
              'border focus:ring-2 focus:ring-offset-2 focus:outline-none',
              selectedCourtId === court.id
                ? 'border-violet-600 bg-violet-600 text-white focus:ring-violet-500'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-violet-500'
            )}
          >
            {court.name}
          </button>
        ))}
      </div>
      {error && <p className='text-destructive text-sm'>{error}</p>}
    </div>
  );
}
