'use client';

import type { Court } from '@/entities/court';
import type { Booking } from '@/entities/booking';
import { TimeHeader } from './time-header';
import { CourtRow } from './court-row';

interface TimelineGridProps {
  courts: Court[];
  bookings: Booking[];
}

export function TimelineGrid({ courts, bookings }: TimelineGridProps) {
  const getBookingsForCourt = (courtId: string) => {
    return bookings.filter(b => b.courtId === courtId);
  };

  return (
    <div className='bg-card overflow-hidden rounded-lg border'>
      <TimeHeader />
      <div className='divide-y'>
        {courts.map(court => (
          <CourtRow
            key={court.id}
            court={court}
            bookings={getBookingsForCourt(court.id)}
          />
        ))}
      </div>
    </div>
  );
}
