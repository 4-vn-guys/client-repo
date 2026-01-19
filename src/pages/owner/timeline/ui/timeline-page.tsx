'use client';

import { memo } from 'react';
import { TimelineHeader } from '@/widgets/owner/header';
import { TimelineGrid } from '@/widgets/owner/';
import { DateNavigation } from '@/features/owner/filter-by-day';
import { NewBookingButton } from '@/features/owner/create-booking';
import { useTimelineData } from '../model';
import { VenueHeader } from './venue-header';
import { TimelineLoadingSkeleton } from './timeline-loading-skeleton';
import { TimelineErrorState } from './timeline-error-state';

// Memoized TimelineGrid to prevent re-renders when props haven't changed
const MemoizedTimelineGrid = memo(TimelineGrid);

interface TimelinePageProps {
    venueId: string;
}

/**
 * Timeline page content component
 * Main component for displaying venue booking timeline
 * 
 * @param venueId - The ID of the venue to display
 */
export function TimelinePageContent({ venueId }: TimelinePageProps) {
    // Use custom hook to manage all timeline data and state
    const {
        selectedDate,
        setSelectedDate,
        venue,
        courtsWithBookings,
        allBookings,
        isLoading,
        isError,
        handleNewBooking,
    } = useTimelineData(venueId);

    // Loading state
    if (isLoading) {
        return <TimelineLoadingSkeleton />;
    }

    // Error state
    if (isError || !venue) {
        return <TimelineErrorState />;
    }

    // Success state - render timeline
    return (
        <div className='space-y-4 p-4 md:space-y-6 md:p-6 animate-in fade-in duration-500'>
            <VenueHeader venue={venue} />

            <TimelineHeader
                title='Schedule'
                dateNavigation={
                    <DateNavigation date={selectedDate} onDateChange={setSelectedDate} />
                }
                actions={<NewBookingButton onClick={handleNewBooking} />}
            />

            <MemoizedTimelineGrid
                courts={courtsWithBookings || []}
                bookings={allBookings}
            />
        </div>
    );
}
