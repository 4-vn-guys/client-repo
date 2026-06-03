'use client';

import { Building2, MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useActiveVenue } from '../model/use-active-venue';

const VENUE_SCOPED_PATH_RE = /^\/owner\/[^/]+\/(timeline|pro-shop)(\/.*)?$/;

export function ActiveVenueStrip() {
  const pathname = usePathname() ?? '';
  const tSidebar = useTranslations('OwnerSidebar');
  const { activeVenue } = useActiveVenue();

  if (!VENUE_SCOPED_PATH_RE.test(pathname)) return null;

  return (
    <div className='border-border/60 bg-background/95 sticky top-0 z-30 border-b px-4 py-2 backdrop-blur md:px-6'>
      <div className='flex min-h-8 items-center gap-2 text-sm'>
        <Building2 className='text-primary size-4 shrink-0' />
        <span className='max-w-[42vw] truncate font-semibold md:max-w-[28rem]'>
          {activeVenue?.name ?? tSidebar('venueSwitcherLoading')}
        </span>
        {activeVenue?.address ? (
          <span className='text-muted-foreground flex min-w-0 items-center gap-1 truncate'>
            <MapPin className='size-3.5 shrink-0' />
            <span className='truncate'>{activeVenue.address}</span>
          </span>
        ) : null}
      </div>
    </div>
  );
}
