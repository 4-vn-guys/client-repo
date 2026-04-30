'use client';

import dynamic from 'next/dynamic';
import type { LocationPickerProps } from './location-picker-inner';

const LocationPickerInner = dynamic(
  () =>
    import('./location-picker-inner').then(m => ({
      default: m.LocationPickerInner,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className='border-border bg-muted/20 h-72 animate-pulse rounded-lg border'
        aria-hidden
      />
    ),
  }
);

export type { LocationPickerProps };

export function LocationPicker(props: LocationPickerProps) {
  return <LocationPickerInner {...props} />;
}
