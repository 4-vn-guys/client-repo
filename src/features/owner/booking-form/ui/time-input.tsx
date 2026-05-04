'use client';

import { cn } from '@/shared/lib/utils';

interface TimeInputProps {
  hour: string;
  minute: string;
  onHourChange: (hour: string) => void;
  onMinuteChange: (minute: string) => void;
  error?: string;
}

export function TimeInput({
  hour,
  minute,
  onHourChange,
  onMinuteChange,
  error,
}: TimeInputProps) {
  // Generate hour options (00-23)
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0')
  );

  // Generate minute options in 15-minute intervals
  const minutes = ['00', '15', '30', '45'];

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2'>
        {/* Hour Select */}
        <select
          value={hour}
          onChange={e => onHourChange(e.target.value)}
          className={cn(
            'flex-1 rounded-md border bg-white px-3 py-2 focus:ring-2 focus:outline-none dark:bg-gray-800',
            error
              ? 'border-destructive focus:border-destructive focus:ring-destructive/30'
              : 'border-gray-300 focus:border-transparent focus:ring-violet-500 dark:border-gray-600',
          )}
        >
          {hours.map(h => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        <span className='text-lg font-semibold text-gray-500'>:</span>

        {/* Minute Select */}
        <select
          value={minute}
          onChange={e => onMinuteChange(e.target.value)}
          className={cn(
            'flex-1 rounded-md border bg-white px-3 py-2 focus:ring-2 focus:outline-none dark:bg-gray-800',
            error
              ? 'border-destructive focus:border-destructive focus:ring-destructive/30'
              : 'border-gray-300 focus:border-transparent focus:ring-violet-500 dark:border-gray-600',
          )}
        >
          {minutes.map(m => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Display selected time */}
      <div className='text-center text-sm font-medium text-violet-600 dark:text-violet-400'>
        {hour}:{minute}
      </div>

      {error && <p className='text-destructive text-sm'>{error}</p>}
    </div>
  );
}
