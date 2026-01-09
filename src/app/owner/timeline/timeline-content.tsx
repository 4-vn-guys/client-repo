'use client';

import { useState } from 'react';

import { TimelineHeader } from '@/widgets/owner/header';
import { TimelineGrid } from '@/widgets/owner/';
import { DateNavigation } from '@/features/owner/filter-by-day';
import { NewBookingButton } from '@/features/owner/create-booking';

import type { Court } from '@/entities/court';
import type { Booking } from '@/entities/booking';

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
    {
        id: '2',
        courtId: '1',
        customerName: 'Badminton Club',
        startTime: new Date(2025, 11, 9, 15, 0),
        endTime: new Date(2025, 11, 9, 18, 0),
        duration: 3,
        price: 180,
        status: 'pending',
    },
    {
        id: '3',
        courtId: '2',
        customerName: 'Sarah S...',
        startTime: new Date(2025, 11, 9, 10, 0),
        endTime: new Date(2025, 11, 9, 11, 30),
        duration: 1.5,
        price: 80,
        status: 'cancelled',
    },
    {
        id: '4',
        courtId: '3',
        customerName: 'Maintenance',
        startTime: new Date(2025, 11, 9, 8, 0),
        endTime: new Date(2025, 11, 9, 12, 0),
        duration: 4,
        price: 0,
        status: 'maintenance',
    },
    {
        id: '5',
        courtId: '4',
        customerName: 'Mi...',
        startTime: new Date(2025, 11, 9, 18, 0),
        endTime: new Date(2025, 11, 9, 19, 0),
        duration: 1,
        price: 60,
        status: 'confirmed',
    },
];

export function TimelinePageContent() {
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 11, 9));

    const handleNewBooking = () => {
        // TODO: Open booking modal
        console.log('New booking clicked');
    };

    return (
        <div className='space-y-4 p-4 md:space-y-6 md:p-6'>
            <TimelineHeader
                title='Timeline'
                dateNavigation={
                    <DateNavigation date={selectedDate} onDateChange={setSelectedDate} />
                }
                actions={<NewBookingButton onClick={handleNewBooking} />}
            />
            <TimelineGrid courts={mockCourts} bookings={mockBookings} />
        </div>
    );
}
