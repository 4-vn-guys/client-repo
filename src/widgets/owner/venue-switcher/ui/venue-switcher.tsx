'use client';

import type { ChangeEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useActiveVenue } from '../model/use-active-venue';

const VENUE_SCOPED_PATH_RE = /^\/owner\/[^/]+\/(timeline|pro-shop)(\/.*)?$/;

function getSwitchedVenuePath(pathname: string, venueId: string) {
  const match = pathname.match(VENUE_SCOPED_PATH_RE);
  if (!match) return null;
  return `/owner/${venueId}/${match[1]}${match[2] ?? ''}`;
}

export function VenueSwitcher() {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const tSidebar = useTranslations('OwnerSidebar');
  const { activeVenueId, branches, isLoading, setActiveVenueId } =
    useActiveVenue();

  const hasActiveVenue = branches.some(branch => branch.id === activeVenueId);
  const value = hasActiveVenue ? (activeVenueId ?? '') : '';

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextVenueId = event.target.value;
    if (!nextVenueId) return;

    setActiveVenueId(nextVenueId);
    const nextPath = getSwitchedVenuePath(pathname, nextVenueId);
    if (nextPath && nextPath !== pathname) {
      router.push(nextPath);
    }
  };

  return (
    <div className='px-2 pb-3'>
      <div className='relative flex items-center rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950'>
        <MapPin className='pointer-events-none absolute left-3 size-4 text-slate-500' />
        <select
          aria-label={tSidebar('venueSwitcherLabel')}
          className='h-10 w-full appearance-none truncate rounded-lg bg-transparent pr-9 pl-9 text-sm font-medium text-slate-900 outline-none disabled:cursor-not-allowed disabled:text-slate-400 dark:text-slate-100'
          disabled={isLoading || branches.length === 0}
          value={value}
          onChange={handleChange}
        >
          {!hasActiveVenue ? (
            <option value=''>
              {isLoading
                ? tSidebar('venueSwitcherLoading')
                : tSidebar('venueSwitcherEmpty')}
            </option>
          ) : null}
          {branches.map(branch => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
        <ChevronDown className='pointer-events-none absolute right-3 size-4 text-slate-500' />
      </div>
    </div>
  );
}
