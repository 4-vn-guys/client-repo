import type { Court } from '@/entities/court';
import type { Booking } from '@/entities/booking';
import { CourtLabel } from '@/entities/court/ui/court-label';
import { BookingCard } from '@/src/entities/booking/ui/booking-card';
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
    <div className='flex border-b last:border-b-0'>
      {/* Court label */}
      <div className='w-32 shrink-0 border-r px-4 py-3'>
        <CourtLabel name={court.name} type={court.type} />
      </div>

      {/* Time grid with bookings */}
      <div className='relative flex flex-1 overflow-x-auto'>
        {/* Grid lines */}
        <div className='flex'>
          {timeSlots.map(time => (
            <div
              key={time}
              className='border-border/50 shrink-0 border-r border-dashed'
              style={{ width: TIMELINE_CONFIG.slotWidth, height: 64 }}
            />
          ))}
        </div>

        {/* Bookings layer */}
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
              style={{
                left: `${left}px`,
                width: `${width - 4}px`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
