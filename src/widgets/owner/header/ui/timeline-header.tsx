'use client';

import type React from 'react';

import { Moon } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import {
  bookingStatusDotColors,
  BOOKING_STATUS,
} from '@/shared/config/booking-status';
import { cn } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';

interface TimelineHeaderProps {
  title: string;
  dateNavigation?: React.ReactNode;
  actions?: React.ReactNode;
}

export function TimelineHeader({
  title,
  dateNavigation,
  actions,
}: TimelineHeaderProps) {
  const tTimeline = useTranslations('OwnerTimelinePage');

  return (
    <div className='space-y-4'>
      {/* Top row with title and theme toggle */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>{title}</h1>
        <Button variant='ghost' size='icon' className='rounded-full'>
          <Moon className='size-5' />
          <span className='sr-only'>{tTimeline('toggleTheme')}</span>
        </Button>
      </div>

      {/* Controls row */}
      <div className='flex items-center justify-between'>
        <div>{dateNavigation}</div>
        <div className='flex items-center gap-4'>
          {/* Status legend */}
          <div className='flex items-center gap-2'>
            {Object.entries(BOOKING_STATUS).map(([key, status]) => (
              <div
                key={key}
                className={cn('size-5 rounded', bookingStatusDotColors[status])}
                title={status}
              />
            ))}
          </div>
          {actions}
        </div>
      </div>
    </div>
  );
}
