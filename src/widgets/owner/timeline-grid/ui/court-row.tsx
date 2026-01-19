import { memo, useMemo } from 'react';
import type { Court } from '@/entities/court';
import type { Booking } from '@/entities/booking';
import { CourtLabel } from '@/entities/court/ui/court-label';
import { BookingCard } from '@/src/entities/booking/ui/booking-card';
import { cn } from '@/shared/lib/utils';
import {
  calculateBookingPosition,
  generateTimeSlots,
  TIMELINE_CONFIG,
} from '../lib/timeline-utils';

interface CourtRowProps {
  court: Court;
  bookings: Booking[];
}

export const CourtRow = memo(function CourtRow({ court, bookings }: CourtRowProps) {
  // Memoize time slots to avoid regenerating on every render
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  return (
    <div className='flex border-b last:border-b-0 hover:bg-muted/20 transition-colors'>
      {/* Court label */}
      <div className='w-32 shrink-0 border-r px-4 py-5 md:w-40 md:py-6'>
        <CourtLabel name={court.name} type={court.type ?? 'synthetic'} />
      </div>

      {/* Time grid with bookings */}
      <div className='relative flex flex-1'>
        {/* Grid lines */}
        <div className='flex flex-1'>
          {timeSlots.map((time) => {
            return (
              <div
                key={time}
                className='shrink-0 border-r border-border/50 w-[60px] md:w-[80px]'
                style={{
                  height: TIMELINE_CONFIG.rowHeight
                }}
              />
            );
          })}
        </div>

        {/* Bookings layer */}
        <div className='absolute inset-0'>
          {bookings.map(booking => {
            // Calculate position using mobile width as base
            const { left, width } = calculateBookingPosition(
              booking.startTime,
              booking.duration ?? 1,
              60 // mobile slot width
            );

            // For desktop, we'll use CSS to scale proportionally
            const desktopScale = 80 / 60; // desktop width / mobile width

            return (
              <BookingCard
                key={booking.id}
                customerName={booking.customerName ?? 'Unknown'}
                duration={booking.duration ?? 1}
                price={booking.price ?? 0}
                status={booking.status}
                startTime={booking.startTime}
                className='md:!left-[var(--desktop-left)] md:!w-[var(--desktop-width)]'
                style={{
                  left: `${left}px`,
                  width: `${width - 8}px`,
                  ['--desktop-left' as any]: `${left * desktopScale}px`,
                  ['--desktop-width' as any]: `${(width - 8) * desktopScale}px`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});
