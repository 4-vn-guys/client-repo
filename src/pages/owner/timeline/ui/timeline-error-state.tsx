import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';

/**
 * Error state for timeline page
 * Displays when venue is not found or access is denied
 */
export function TimelineErrorState() {
  return (
    <div className='flex min-h-[50vh] flex-col items-center justify-center p-4 text-center'>
      <div className='bg-destructive/10 mb-4 rounded-full p-4'>
        <AlertCircle className='text-destructive h-8 w-8' />
      </div>
      <h2 className='mb-2 text-2xl font-bold'>Venue Not Found</h2>
      <p className='text-muted-foreground mb-6 max-w-md'>
        The venue you are looking for does not exist or you do not have
        permission to view it.
      </p>
      <Link href='/owner/venues'>
        <Button variant='outline'>Back to Venues</Button>
      </Link>
    </div>
  );
}
