import { generateTimeSlots, formatTimeLabel, TIMELINE_CONFIG } from '../lib/timeline-utils';
import { cn } from '@/shared/lib/utils';

export function TimeHeader() {
  const timeSlots = generateTimeSlots();

  return (
    <div className='bg-muted/30 sticky top-0 z-10 flex border-b'>
      {/* Court column header */}
      <div className='w-32 shrink-0 border-r px-4 py-4 md:w-40' />

      {/* Time slots */}
      <div className='flex flex-1'>
        {timeSlots.map((time, index) => {
          const formattedTime = formatTimeLabel(time);
          // Show only hour marks on mobile (every other slot since we have 30-min intervals)
          const isHourMark = time.endsWith(':00');
          const showOnMobile = isHourMark && index % 4 === 0; // Show every 2 hours on mobile

          return (
            <div
              key={time}
              className={cn(
                'text-muted-foreground relative shrink-0 border-r px-2 py-4 text-center transition-colors',
                'hover:bg-muted/50',
                isHourMark ? 'border-border' : 'border-border/30',
                !showOnMobile && 'hidden md:block'
              )}
              style={{
                minWidth: TIMELINE_CONFIG.slotWidth,
                width: TIMELINE_CONFIG.slotWidth
              }}
            >
              <span className={cn(
                'text-xs md:text-sm',
                isHourMark ? 'font-semibold' : 'font-normal text-muted-foreground/70'
              )}>
                {formattedTime}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}