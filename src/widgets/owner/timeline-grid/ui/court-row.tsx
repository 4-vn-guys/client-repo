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

export function CourtRow({ court, bookings }: CourtRowProps) {
  const timeSlots = generateTimeSlots();

  return (
    <div className='flex border-b last:border-b-0 hover:bg-muted/20 transition-colors'>
      {/* Court label */}
      <div className='w-32 shrink-0 border-r px-4 py-5 md:w-40 md:py-6'>
        <CourtLabel name={court.name} type={court.type} />
      </div>

      {/* Time grid with bookings */}
      <div className='relative flex flex-1'>
        {/* Grid lines */}
        <div className='flex flex-1'>
          {timeSlots.map((time, index) => {
            // Differentiate hour marks from 30-minute marks
            const isHourMark = time.endsWith(':00');
            // Show every 4th slot on mobile (every 2 hours)
            const showOnMobile = index % 4 === 0;
            return (
              <div
                key={time}
                className={cn(
                  'shrink-0 border-r',
                  isHourMark ? 'border-border/50' : 'border-border/20 border-dashed',
                  !showOnMobile && 'hidden md:block'
                )}
                style={{
                  minWidth: TIMELINE_CONFIG.slotWidth,
                  width: TIMELINE_CONFIG.slotWidth,
                  height: TIMELINE_CONFIG.rowHeight
                }}
              />
            );
          })}
        </div>

        {/* Bookings layer */}
        <div className='absolute inset-0'>
          {bookings.map(booking => {
            const { left, width } = calculateBookingPosition(
              booking.startTime,
              booking.duration
            );
            return (
              <BookingCard
                key={booking.id}
                customerName={booking.customerName}
                duration={booking.duration}
                price={booking.price}
                status={booking.status}
                startTime={booking.startTime}
                style={{
                  left: `${left}px`,
                  width: `${width - 8}px`, // Gap between cards
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
