'use client';

import { memo, useMemo, useCallback } from 'react';
import type { Court } from '@/entities/court';
import type { Booking } from '@/entities/booking';
import { TimeHeader } from './time-header';
import { CourtRow } from './court-row';
import { TimelineLoadingSkeleton } from '@/src/pages/owner/timeline/ui/timeline-loading-skeleton';

interface TimelineGridProps {
  courts: Court[];
  bookings: Booking[];
  onCellClick?: (courtId: string, slotIndex: number) => void;
  onBookingClick?: (booking: Booking) => void;
  isSlotSelected?: (courtId: string, slotIndex: number) => boolean;
  isLoading: boolean;
}

export const TimelineGrid = memo(function TimelineGrid({
  courts,
  bookings,
  onCellClick,
  onBookingClick,
  isSlotSelected,
  isLoading,
}: TimelineGridProps) {
  // Memoize bookings by court ID for efficient filtering
  const bookingsByCourtId = useMemo(() => {
    const map = new Map<string, Booking[]>();

    bookings.forEach(booking => {
      const courtBookings = map.get(booking.courtId) || [];
      courtBookings.push(booking);
      map.set(booking.courtId, courtBookings);
    });

    return map;
  }, [bookings]);

  // Stabilize the getter function to prevent re-renders
  const getBookingsForCourt = useCallback(
    (courtId: string): Booking[] => {
      return bookingsByCourtId.get(courtId) || [];
    },
    [bookingsByCourtId]
  );
  if (isLoading) {
    return <TimelineLoadingSkeleton />;
  }

  return (
    <div className='bg-card overflow-hidden rounded-lg border shadow-sm'>
      {/* Scrollable container for timeline */}
      <div className='overflow-x-auto'>
        <div className='min-w-max'>
          <TimeHeader />
          <div className='divide-y'>
            {courts.map(court => (
              <MemoizedCourtRow
                key={court.id}
                court={court}
                bookings={getBookingsForCourt(court.id)}
                onCellClick={onCellClick}
                onBookingClick={onBookingClick}
                isSlotSelected={isSlotSelected}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

// Memoized CourtRow to prevent re-renders when props haven't changed
const MemoizedCourtRow = memo(CourtRow);
