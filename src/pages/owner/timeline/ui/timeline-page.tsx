'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, AlertCircle } from 'lucide-react';
import { TimelineHeader } from '@/widgets/owner/header';
import { TimelineGrid } from '@/widgets/owner/';
import { DateNavigation } from '@/features/owner/filter-by-day';
import { NewBookingButton } from '@/features/owner/create-booking';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';

import type { Court } from '@/entities/court';
import type { Booking } from '@/entities/booking';
import { Skeleton } from '@/shared/ui/skeleton';
import { fetchVenueById } from '@/shared/lib/mock-venues';

// Mock data - in production this would come from API
const mockCourts: Court[] = [
    { id: '1', name: 'Court 1', type: 'synthetic', isAvailable: true },
    { id: '2', name: 'Court 2', type: 'synthetic', isAvailable: true },
    { id: '3', name: 'Court 3', type: 'wooden', isAvailable: false },
    { id: '4', name: 'Court 4', type: 'wooden', isAvailable: true },
    { id: '5', name: 'Court 5', type: 'synthetic', isAvailable: true },
];

const mockBookings: Booking[] = [
    {
        id: '1',
        courtId: '1',
        customerName: 'John Doe',
        startTime: new Date(2025, 11, 9, 9, 30),
        endTime: new Date(2025, 11, 9, 11, 10),
        duration: 2,
        price: 120,
        status: 'confirmed',
    },
    // ... rest of bookings
];

interface TimelinePageProps {
    venueId: string;
}

export function TimelinePageContent({ venueId }: TimelinePageProps) {
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 11, 9));

    const { data: venue, isLoading, isError } = useQuery({
        queryKey: ['venue', venueId],
        queryFn: () => fetchVenueById(venueId),
    });

    const handleNewBooking = useCallback(() => {
        // TODO: Open booking modal
        console.log('New booking clicked for venue', venueId);
    }, [venueId]);

    if (isLoading) {
        return (
            <div className='space-y-4 p-4 md:space-y-6 md:p-6'>
                <div className="flex justify-between items-center mb-6">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <Skeleton className="h-[600px] w-full rounded-xl" />
            </div>
        )
    }

    if (isError || !venue) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
                <div className="bg-destructive/10 p-4 rounded-full mb-4">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Venue Not Found</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                    The venue you are looking for does not exist or you do not have permission to view it.
                </p>
                <Link href="/owner/venues">
                    <Button variant="outline">Back to Venues</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className='space-y-4 p-4 md:space-y-6 md:p-6 animate-in fade-in duration-500'>
            <div className="flex flex-col gap-1 pb-4 border-b border-border/40">
                <h1 className="text-2xl font-bold tracking-tight">{venue.name}</h1>
                <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {venue.address}
                </div>
            </div>

            <TimelineHeader
                title='Schedule'
                dateNavigation={
                    <DateNavigation date={selectedDate} onDateChange={setSelectedDate} />
                }
                actions={<NewBookingButton onClick={handleNewBooking} />}
            />
            <TimelineGrid courts={mockCourts} bookings={mockBookings} />
        </div>
    );
}
