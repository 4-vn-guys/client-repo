import { generateTimeSlots, TIMELINE_CONFIG } from '../lib/timeline-utils';
import { cn } from '@/shared/lib/utils';

export function TimeHeader() {
  const timeSlots = generateTimeSlots();

  return (
    <div className='bg-muted/30 flex border-b'>
      {/* Court column header */}
      <div className='w-32 shrink-0 border-r px-4 py-3' />

      {/* Time slots */}
      <div className='flex overflow-x-auto'>
        {timeSlots.map((time, index) => (
          <div
            key={time}
            className={cn(
              'text-muted-foreground shrink-0 border-r px-2 py-3 text-center text-sm'
            )}
            style={{ width: TIMELINE_CONFIG.slotWidth }}
          >
            {time}
          </div>
        ))}
      </div>
    </div>
  );
}
