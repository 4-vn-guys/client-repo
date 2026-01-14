'use client';

import { useState, useEffect } from 'react';
import { VenueHeader } from './venue-header';
import { VenuesList } from './venues-list';
import { Venue } from '@/entities/venue';

// Mock Data
const MOCK_VENUES: Venue[] = [
    {
        id: '1',
        name: 'Downtown Sports Complex',
        address: '123 Main St, Downtown, Cityville',
        operatingHours: '06:00 - 23:00',
        isActive: true,
        policy: 'No cancellation within 24h. Full refund if canceled earlier.',
    },
    {
        id: '2',
        name: 'Westside Tennis Club',
        address: '456 West Ave, Westside, Cityville',
        operatingHours: '07:00 - 22:00',
        isActive: true,
        policy: 'Rain check available. Members only on weekends.',
    },
    {
        id: '3',
        name: 'Community Center Courts',
        address: '789 Park Ln, Northside, Cityville',
        operatingHours: '08:00 - 20:00',
        isActive: false,
        policy: 'Free for residents. Booking required 48h in advance.',
    },
    {
        id: '4',
        name: 'Elite Badminton Arena',
        address: '101 Shuttle Way, Eastside, Cityville',
        operatingHours: '05:00 - 00:00',
        isActive: true,
        policy: 'Professional gear required. No casual play.',
    },
];

export function VenuesPage() {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            setVenues(MOCK_VENUES);
            setIsLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    const handleAddVenue = () => {
        // Navigate to create venue page or open modal
        console.log('Navigate to create venue');
    };

    return (
        <div className="container mx-auto max-w-7xl pt-6 space-y-8 min-h-screen">
            <VenueHeader
                venueCount={venues.length}
                onAddVenue={handleAddVenue}
            />
            <VenuesList
                venues={venues}
                isLoading={isLoading}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />
        </div>
    );
}
