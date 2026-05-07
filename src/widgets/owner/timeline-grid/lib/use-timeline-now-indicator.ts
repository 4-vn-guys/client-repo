'use client';

import { useEffect, useMemo, useState } from 'react';
import { formatDateToYYYYMMDD } from '@/shared/lib/utils';
import {
  getNowOffsetWithinTimeline,
  TIMELINE_CONFIG,
  TIMELINE_LABEL_WIDTH,
} from './timeline-utils';

const TICK_MS = 30_000;

export function useLiveNow(tickMs: number = TICK_MS) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), tickMs);
    return () => window.clearInterval(id);
  }, [tickMs]);

  return now;
}

export function useTimelineDimensions() {
  const [dims, setDims] = useState<{ labelWidth: number; slotWidth: number }>({
    labelWidth: TIMELINE_LABEL_WIDTH.sm,
    slotWidth: TIMELINE_CONFIG.mobileSlotWidth,
  });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const apply = () => {
      setDims(
        mq.matches
          ? {
              labelWidth: TIMELINE_LABEL_WIDTH.md,
              slotWidth: TIMELINE_CONFIG.slotWidth,
            }
          : {
              labelWidth: TIMELINE_LABEL_WIDTH.sm,
              slotWidth: TIMELINE_CONFIG.mobileSlotWidth,
            }
      );
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return dims;
}

export function useTimelineNowIndicator(selectedDate: Date, now: Date) {
  const viewingToday = useMemo(
    () => formatDateToYYYYMMDD(selectedDate) === formatDateToYYYYMMDD(now),
    [selectedDate, now]
  );

  const dims = useTimelineDimensions();

  const offsetPx = useMemo(() => {
    if (!viewingToday) return null;
    return getNowOffsetWithinTimeline(now, dims.slotWidth);
  }, [viewingToday, now, dims.slotWidth]);

  const timeLabel = useMemo(() => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }, [now]);

  return {
    viewingToday,
    offsetPx,
    labelWidth: dims.labelWidth,
    slotWidth: dims.slotWidth,
    timeLabel,
  };
}
