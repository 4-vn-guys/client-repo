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
  onCellClick?: (courtId: string, slotIndex: number) => void;
  onBookingClick?: (booking: Booking) => void;
  isSlotSelected?: (courtId: string, slotIndex: number) => boolean;
}

export const CourtRow = memo(function CourtRow({
  court,
  bookings,
  onCellClick,
  onBookingClick,
  isSlotSelected,
}: CourtRowProps) {
  // Memoize time slots to avoid regenerating on every render
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  const handleCellClick = (slotIndex: number) => {
    if (onCellClick) {
      onCellClick(court.id, slotIndex);
    }
  };

  const handleBookingClick = (booking: Booking) => {
    if (onBookingClick) {
      onBookingClick(booking);
    }
  };

  return (
    <div className='hover:bg-muted/20 flex border-b transition-colors last:border-b-0'>
      {/* Court label */}
      <div className='w-32 shrink-0 border-r px-4 py-5 md:w-40 md:py-6'>
        <CourtLabel name={court.name} type={court.type ?? 'synthetic'} />
      </div>

      {/* Time grid with bookings */}
      <div className='relative flex flex-1'>
        {/* Grid lines with click handlers */}
        <div className='flex flex-1'>
          {timeSlots.map((time, index) => {
            const selected = isSlotSelected?.(court.id, index);
            return (
              <div
                key={time}
                onClick={() => handleCellClick(index)}
                className={cn(
                  'border-border/50 w-[60px] shrink-0 border-r md:w-[80px]',
                  onCellClick &&
                    'cursor-pointer transition-colors hover:bg-violet-50/50',
                  selected && 'bg-violet-200/60 ring-1 ring-violet-400/50'
                )}
                style={{
                  height: TIMELINE_CONFIG.rowHeight,
                }}
              />
            );
          })}
        </div>

        {/* Bookings layer */}
        <div className='pointer-events-none absolute inset-0'>
          {bookings.map(booking => {
            // Calculate position using mobile width as base
            const { left, width } = calculateBookingPosition(
              booking.startTime,
              booking.duration ?? 1,
              60 // mobile slot width
            );

            // For desktop, we'll use CSS to scale proportionally
            const desktopScale = 80 / 60; // desktop width / mobile width

            const slotKey = booking.slotId ?? `${booking.id}-${booking.courtId}-${booking.startTime}`;

            return (
              <BookingCard
                key={slotKey}
                customerName={booking.customerName ?? 'Unknown'}
                duration={booking.duration ?? 1}
                price={booking.price ?? 0}
                status={booking.status}
                startTime={booking.startTime}
                onClick={() => handleBookingClick(booking)}
                className='pointer-events-auto md:!left-[var(--desktop-left)] md:!w-[var(--desktop-width)]'
                style={
                  {
                    left: `${left}px`,
                    width: `${width - 8}px`,
                    ['--desktop-left']: `${left * desktopScale}px`,
                    ['--desktop-width']: `${(width - 8) * desktopScale}px`,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});
