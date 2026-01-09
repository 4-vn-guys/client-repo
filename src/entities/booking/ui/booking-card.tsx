'use client';

import type React from 'react';

import { cn } from '@/shared/lib/utils';
import {
  bookingStatusColors,
  type BookingStatus,
} from '@/shared/config/booking-status';
import { Clock, CheckCircle2, Settings, Calendar, DollarSign } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';

interface BookingCardProps {
  customerName: string;
  duration: number;
  price: number;
  status: BookingStatus;
  style?: React.CSSProperties;
  className?: string;
  startTime?: Date;
}

export function BookingCard({
  customerName,
  duration,
  price,
  status,
  style,
  className,
  startTime,
}: BookingCardProps) {
  const colors = bookingStatusColors[status];

  const StatusIcon = ({ status }: { status: BookingStatus }) => {
    if (status === 'confirmed') return <CheckCircle2 className='size-3.5' />;
    if (status === 'maintenance') return <Settings className='size-3.5' />;
    if (status === 'pending') return <Clock className='size-3.5' />;
    return null;
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getStatusLabel = (status: BookingStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <div
          style={style as any}
          className={cn(
            'absolute top-2 bottom-2 cursor-pointer overflow-hidden rounded-md border-2 px-2 py-1.5 transition-all',
            'hover:shadow-lg hover:scale-[1.02] hover:z-10',
            'backdrop-blur-sm',
            colors.bg,
            colors.border,
            className
          )}
        >
          <div className='flex items-center justify-between gap-1 h-full'>
            <div className='min-w-0 flex-1'>
              <p className={cn('truncate text-xs font-semibold leading-tight', colors.text)}>
                {customerName}
              </p>
              {duration >= 1 && (
                <p className={cn('mt-0.5 text-[10px] font-medium truncate', colors.text)}>
                  {duration}h
                </p>
              )}
            </div>
            <span className={cn('shrink-0', colors.text)}>
              <StatusIcon status={status} />
            </span>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="space-y-2 text-left">
          <div className="font-semibold text-sm border-b pb-1.5">
            {customerName}
          </div>
          <div className="space-y-1.5 text-xs">
            {startTime && (
              <div className="flex items-center gap-2">
                <Calendar className="size-3.5" />
                <span>{formatTime(startTime)} ({duration}h)</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <DollarSign className="size-3.5" />
              <span>${price}</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusIcon status={status} />
              <span className="capitalize">{getStatusLabel(status)}</span>
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
