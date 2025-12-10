'use client';

import type React from 'react';

import { cn } from '@/shared/lib/utils';
import {
  bookingStatusColors,
  type BookingStatus,
} from '@/shared/config/booking-status';
import { Clock, CheckCircle2, Settings } from 'lucide-react';

interface BookingCardProps {
  customerName: string;
  duration: number;
  price: number;
  status: BookingStatus;
  style?: React.CSSProperties;
  className?: string;
}

export function BookingCard({
  customerName,
  duration,
  price,
  status,
  style,
  className,
}: BookingCardProps) {
  const colors = bookingStatusColors[status];

  const StatusIcon = () => {
    if (status === 'confirmed') return <CheckCircle2 className='size-3.5' />;
    if (status === 'maintenance') return <Settings className='size-3.5' />;
    if (status === 'pending') return <Clock className='size-3.5' />;
    return null;
  };

  return (
    <div
      style={style}
      className={cn(
        'absolute top-1 bottom-1 cursor-pointer overflow-hidden rounded-lg border px-2.5 py-1.5 transition-shadow hover:shadow-md',
        colors.bg,
        colors.border,
        className
      )}
    >
      <div className='flex items-start justify-between gap-1'>
        <div className='min-w-0 flex-1'>
          <p className={cn('truncate text-sm font-medium', colors.text)}>
            {customerName}
          </p>
          <p className={cn('text-xs', colors.text)}>
            {duration}h - ${price}
          </p>
        </div>
        <span className={cn('mt-0.5 shrink-0', colors.text)}>
          <StatusIcon />
        </span>
      </div>
    </div>
  );
}
