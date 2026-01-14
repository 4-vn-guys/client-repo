'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { VenueHeader } from './venue-header';
import { VenuesList } from './venues-list';
import { Venue } from '@/entities/venue';
import { fetchVenues } from '@/shared/lib/mock-venues';

export function VenuesPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: venues = [], isLoading } = useQuery({
        queryKey: ['venues'],
        queryFn: fetchVenues,
    });

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
