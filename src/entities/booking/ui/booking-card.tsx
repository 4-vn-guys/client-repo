'use client';

import type React from 'react';
import { useMemo } from 'react';

import { cn } from '@/shared/lib/utils';
import {
  bookingStatusColors,
  type BookingStatus,
} from '@/shared/config/booking-status';
import {
  Clock,
  CheckCircle2,
  Settings,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';

interface BookingCardProps {
  customerName: string;
  duration: number;
  price: number;
  status: BookingStatus;
  style?: React.CSSProperties;
  className?: string;
  startTime?: Date | string;
  onClick?: () => void;
}

export function BookingCard({
  customerName,
  duration,
  price,
  status,
  style,
  className,
  startTime,
  onClick,
}: BookingCardProps) {
  const colors = bookingStatusColors[status];

  const statusIcon = useMemo(() => {
    if (status === 'confirmed') return <CheckCircle2 className='size-3.5' />;
    if (status === 'maintenance') return <Settings className='size-3.5' />;
    if (status === 'pending') return <Clock className='size-3.5' />;
    return null;
  }, [status]);

  const formatTime = (date?: Date | string) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getStatusLabel = (status: BookingStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <div
          style={style}
          onClick={handleClick}
          className={cn(
            'absolute top-2 bottom-2 cursor-pointer overflow-hidden rounded-md border-2 px-2 py-1.5 transition-all',
            'hover:z-10 hover:scale-[1.02] hover:shadow-lg',
            'backdrop-blur-sm',
            colors.bg,
            colors.border,
            className
          )}
        >
          <div className='flex h-full items-center justify-between gap-1'>
            <div className='min-w-0 flex-1'>
              <p
                className={cn(
                  'truncate text-xs leading-tight font-semibold',
                  colors.text
                )}
              >
                {customerName}
              </p>
              {duration >= 1 && (
                <p
                  className={cn(
                    'mt-0.5 truncate text-[10px] font-medium',
                    colors.text
                  )}
                >
                  {duration}h
                </p>
              )}
            </div>
            <span className={cn('shrink-0', colors.text)}>{statusIcon}</span>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side='top' className='max-w-xs'>
        <div className='space-y-2 text-left'>
          <div className='border-b pb-1.5 text-sm font-semibold'>
            {customerName}
          </div>
          <div className='space-y-1.5 text-xs'>
            {startTime && (
              <div className='flex items-center gap-2'>
                <Calendar className='size-3.5' />
                <span>
                  {formatTime(startTime)} ({duration}h)
                </span>
              </div>
            )}
            <div className='flex items-center gap-2'>
              <DollarSign className='size-3.5' />
              <span>${price}</span>
            </div>
            <div className='flex items-center gap-2'>
              {statusIcon}
              <span className='capitalize'>{getStatusLabel(status)}</span>
            </div>
            <div className='text-muted-foreground mt-2 border-t pt-2 text-[10px]'>
              Click to edit booking
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
