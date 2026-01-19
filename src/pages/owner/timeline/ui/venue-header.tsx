import { memo } from 'react';
import { MapPin } from 'lucide-react';
import type { Branch } from '@/entities/venue';

interface VenueHeaderProps {
    venue: Branch;
}

/**
 * Memoized venue header component
 * Only re-renders when venue data changes
 */
export const VenueHeader = memo(function VenueHeader({ venue }: VenueHeaderProps) {
    return (
        <div className="flex flex-col gap-1 pb-4 border-b border-border/40">
            <h1 className="text-2xl font-bold tracking-tight">{venue.name}</h1>
            <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-1" />
                {venue.address}
            </div>
        </div>
    );
});
