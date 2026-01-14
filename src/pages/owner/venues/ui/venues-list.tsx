import { Search, MapPin } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { VenueCard, Venue } from '@/entities/venue';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton'; // Assuming Skeleton is available or will use a div placeholder if not

interface VenuesListProps {
    venues: Venue[];
    isLoading: boolean;
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

export function VenuesList({ venues, isLoading, searchQuery, onSearchChange }: VenuesListProps) {
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="w-full max-w-sm">
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (venues.length === 0 && !searchQuery) {
        return (
            <div className="flex flex-col items-center justify-center p-12 lg:p-24 border-2 border-dashed border-border/50 rounded-xl bg-muted/10 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No venues yet</h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                    Get started by creating your first venue to manage courts and bookings.
                </p>
                <Button>Create Venue</Button>
            </div>
        );
    }

    const filteredVenues = venues.filter(venue =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name or location..."
                    className="pl-9 bg-background/50 border-input/60 focus-visible:ring-primary/20"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {filteredVenues.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <Search className="w-12 h-12 mb-4 opacity-20" />
                    <p>No venues found matching "{searchQuery}"</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 pb-20">
                    {filteredVenues.map((venue) => (
                        <div key={venue.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards" style={{ animationDelay: `${parseInt(venue.id) * 50}ms` }}>
                            <VenueCard venue={venue} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
