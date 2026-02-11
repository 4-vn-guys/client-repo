import { memo, useMemo } from 'react';
import { generateTimeSlots, formatTimeLabel } from '../lib/calendar-utils';

export const TimeHeader = memo(function TimeHeader() {
  // Memoize time slots since they never change
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  return (
    <div className='bg-muted/30 sticky top-0 z-10 flex border-b'>
      {/* Court column header */}
      <div className='w-32 shrink-0 border-r px-4 py-4 md:w-40' />

      {/* Time slots */}
      <div className='flex flex-1'>
        {timeSlots.map((time: string) => {
          const formattedTime = formatTimeLabel(time);

          return (
            <div
              key={time}
              className='text-muted-foreground border-border hover:bg-muted/50 relative w-[60px] shrink-0 border-r px-2 py-3 text-center transition-colors md:w-[80px] md:py-4'
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
