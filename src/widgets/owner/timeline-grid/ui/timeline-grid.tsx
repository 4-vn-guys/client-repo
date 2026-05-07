'use client';

import { memo, useMemo, useCallback, useRef, useLayoutEffect } from 'react';
import type { Court } from '@/entities/court';
import type { Booking } from '@/entities/booking';
import { TimeHeader } from './time-header';
import { CourtRow } from './court-row';
import { TimelineLoadingSkeleton } from '@/src/pages/owner/timeline/ui/timeline-loading-skeleton';
import { formatDateToYYYYMMDD } from '@/shared/lib/utils';
import {
  useLiveNow,
  useTimelineNowIndicator,
} from '../lib/use-timeline-now-indicator';
import { useTranslations } from 'next-intl';

interface TimelineGridProps {
  courts: Court[];
  bookings: Booking[];
  selectedDate: Date;
  onCellClick?: (courtId: string, slotIndex: number) => void;
  onBookingClick?: (booking: Booking) => void;
  isSlotSelected?: (courtId: string, slotIndex: number) => boolean;
  isLoading: boolean;
}

export const TimelineGrid = memo(function TimelineGrid({
  courts,
  bookings,
  selectedDate,
  onCellClick,
  onBookingClick,
  isSlotSelected,
  isLoading,
}: TimelineGridProps) {
  const tTimeline = useTranslations('OwnerTimelinePage');
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevDateKeyRef = useRef<string | undefined>(undefined);

  const now = useLiveNow();
  const { viewingToday, offsetPx, labelWidth, timeLabel } =
    useTimelineNowIndicator(selectedDate, now);

  const bookingsByCourtId = useMemo(() => {
    const map = new Map<string, Booking[]>();

    bookings.forEach(booking => {
      const courtBookings = map.get(booking.courtId) || [];
      courtBookings.push(booking);
      map.set(booking.courtId, courtBookings);
    });

    return map;
  }, [bookings]);

  const getBookingsForCourt = useCallback(
    (courtId: string): Booking[] => {
      return bookingsByCourtId.get(courtId) || [];
    },
    [bookingsByCourtId]
  );

  useLayoutEffect(() => {
    const dateKey = formatDateToYYYYMMDD(selectedDate);
    if (prevDateKeyRef.current === dateKey) return;
    prevDateKeyRef.current = dateKey;

    if (!viewingToday || offsetPx == null || !scrollRef.current) return;

    const el = scrollRef.current;
    const lineCenter = labelWidth + offsetPx;
    const target = Math.max(0, lineCenter - el.clientWidth * 0.38);
    el.scrollTo({ left: target, behavior: 'smooth' });
  }, [selectedDate, viewingToday, offsetPx, labelWidth]);

  if (isLoading) {
    return <TimelineLoadingSkeleton />;
  }

  const showNowLine = viewingToday && offsetPx !== null;

  return (
    <div className='bg-card overflow-hidden rounded-lg border shadow-sm'>
      {viewingToday && (
        <div className='sticky top-0 z-30 border-b border-red-200/80 bg-red-50 px-3 py-2.5 shadow-sm backdrop-blur-[2px] dark:border-red-900/50 dark:bg-red-950/90'>
          <time
            dateTime={now.toISOString()}
            className='font-mono text-sm font-semibold tracking-tight text-red-800 tabular-nums md:text-base dark:text-red-100'
          >
            {tTimeline('currentTimeBanner', { time: timeLabel })}
          </time>
        </div>
      )}

      <div ref={scrollRef} className='overflow-x-auto'>
        <div className='relative min-w-max'>
          {showNowLine && (
            <div
              className='pointer-events-none absolute top-0 bottom-0 z-[25] flex flex-col items-center'
              style={{
                left: labelWidth + offsetPx,
                transform: 'translateX(-50%)',
              }}
              aria-hidden
            >
              <div className='bg-background size-2.5 shrink-0 rounded-full border-2 border-red-600 shadow-md dark:border-red-500' />
              <div className='min-h-0 w-px flex-1 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.65)] dark:bg-red-500' />
            </div>
          )}

          <TimeHeader />
          <div className='divide-y'>
            {courts.map(court => (
              <MemoizedCourtRow
                key={court.id}
                court={court}
                bookings={getBookingsForCourt(court.id)}
                onCellClick={onCellClick}
                onBookingClick={onBookingClick}
                isSlotSelected={isSlotSelected}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

const MemoizedCourtRow = memo(CourtRow);
