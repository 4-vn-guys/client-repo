import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface VenueHeaderProps {
    venueCount: number;
    onAddVenue?: () => void;
}

export function VenueHeader({ venueCount, onAddVenue }: VenueHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">My Venues</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    {venueCount} {venueCount === 1 ? 'venue' : 'venues'} managed
                </p>
            </div>
            <Button
                onClick={onAddVenue}
                className="bg-primary hover:bg-primary/90 text-white shadow-md transition-all hover:scale-105 active:scale-95"
            >
                <Plus className="w-4 h-4 mr-2" />
                Add New Venue
            </Button>
        </div>
    );
}
