'use client';

import { memo, useMemo, useCallback } from 'react';
import type { Court } from '@/entities/court';
import type { Booking, CalendarFilters } from '@/entities/booking';
import { TimeHeader } from './time-header';
import { CourtRow } from './court-row';

/**
 * Props for BookingCalendar component
 */
interface BookingCalendarProps {
    /** Courts to display in the calendar */
    courts: Court[];
    /** All bookings to display */
    bookings: Booking[];
    /** Role-based calendar filtering configuration */
    filters: CalendarFilters;
    /** Callback when user clicks on an empty time slot */
    onCellClick?: (courtId: string, slotIndex: number) => void;
    /** Callback when user clicks on an existing booking */
    onBookingClick?: (booking: Booking) => void;
}

/**
 * BookingCalendar - Reusable calendar component for displaying court bookings
 * 
 * This component is role-agnostic and receives its data and behavior via props.
 * It can be used by both owner and user views with different data and filters.
 * 
 * @example
 * // Owner view - shows all courts, allows creating bookings
 * <BookingCalendar
 *   courts={allCourts}
 *   bookings={allBookings}
 *   filters={{ role: 'owner', showAllCourts: true, canCreateBookings: true, canEditAllBookings: true }}
 *   onCellClick={handleCreateBooking}
 *   onBookingClick={handleEditBooking}
 * />
 * 
 * @example
 * // User view - shows only courts with user's bookings
 * <BookingCalendar
 *   courts={courtsWithUserBookings}
 *   bookings={userBookings}
 *   filters={{ role: 'user', showAllCourts: false, canCreateBookings: false, canEditAllBookings: false }}
 *   onBookingClick={handleViewBooking}
 * />
 */
export const BookingCalendar = memo(function BookingCalendar({
    courts,
    bookings,
    filters,
    onCellClick,
    onBookingClick,
}: BookingCalendarProps) {
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

    // Filter courts based on role
    const displayedCourts = useMemo(() => {
        if (filters.showAllCourts) {
            return courts;
        }
        // For user view: only show courts that have bookings
        return courts.filter(court => bookingsByCourtId.has(court.id));
    }, [courts, filters.showAllCourts, bookingsByCourtId]);

    // Determine if cell clicks should be enabled (for creating bookings)
    const cellClickEnabled = filters.canCreateBookings ? onCellClick : undefined;

    return (
        <div className='bg-card overflow-hidden rounded-lg border shadow-sm'>
            {/* Scrollable container for timeline */}
            <div className='overflow-x-auto'>
                <div className='min-w-max'>
                    <TimeHeader />
                    <div className='divide-y'>
                        {displayedCourts.map(court => (
                            <MemoizedCourtRow
                                key={court.id}
                                court={court}
                                bookings={getBookingsForCourt(court.id)}
                                onCellClick={cellClickEnabled}
                                onBookingClick={onBookingClick}
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
