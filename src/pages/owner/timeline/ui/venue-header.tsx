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
export const VenueHeader = memo(function VenueHeader({
  venue,
}: VenueHeaderProps) {
  return (
    <div className='border-border/40 flex flex-col gap-1 border-b pb-4'>
      <h1 className='text-2xl font-bold tracking-tight'>{venue.name}</h1>
      <div className='text-muted-foreground flex items-center text-sm'>
        <MapPin className='mr-1 h-4 w-4' />
        {venue.address}
      </div>
    </div>
  );
});
