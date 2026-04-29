import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { getTranslations } from 'next-intl/server';

/**
 * Error state for timeline page
 * Displays when venue is not found or access is denied
 */
export async function TimelineErrorState() {
  const tTimeline = await getTranslations('OwnerTimelinePage');

  return (
    <div className='flex min-h-[50vh] flex-col items-center justify-center p-4 text-center'>
      <div className='bg-destructive/10 mb-4 rounded-full p-4'>
        <AlertCircle className='text-destructive h-8 w-8' />
      </div>
      <h2 className='mb-2 text-2xl font-bold'>
        {tTimeline('venueNotFound')}
      </h2>
      <p className='text-muted-foreground mb-6 max-w-md'>
        {tTimeline('venueNotFoundDescription')}
      </p>
      <Link href='/owner/branches'>
        <Button variant='outline'>{tTimeline('backToBranches')}</Button>
      </Link>
    </div>
  );
}
