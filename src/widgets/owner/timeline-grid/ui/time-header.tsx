import { memo, useMemo } from 'react';
import { generateTimeSlots, formatTimeLabel, TIMELINE_CONFIG } from '../lib/timeline-utils';
import { cn } from '@/shared/lib/utils';

export const TimeHeader = memo(function TimeHeader() {
  // Memoize time slots since they never change
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  return (
    <div className='bg-muted/30 sticky top-0 z-10 flex border-b'>
      {/* Court column header */}
      <div className='w-32 shrink-0 border-r px-4 py-4 md:w-40' />

      {/* Time slots */}
      <div className='flex flex-1'>
        {timeSlots.map((time) => {
          const formattedTime = formatTimeLabel(time);

          return (
            <div
              key={time}
              className='text-muted-foreground relative shrink-0 border-r border-border text-center transition-colors hover:bg-muted/50 px-2 py-3 md:py-4 w-[60px] md:w-[80px]'
            >
              <span className='text-[10px] font-semibold md:text-sm'>
                {formattedTime}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});