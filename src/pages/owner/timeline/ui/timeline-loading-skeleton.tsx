import { Skeleton } from '@/shared/ui/skeleton';

/**
 * Loading state for timeline grid
 * Matches the exact structure and dimensions of TimelineGrid
 * Displays skeleton placeholders while data is loading
 */
export function TimelineLoadingSkeleton() {
  // Generate skeleton time slots (6:00 - 23:00 = 18 slots)
  const timeSlotCount = 18;
  const skeletonRows = 3; // Show 3 skeleton rows

  return (
    <div className='bg-card overflow-hidden rounded-lg border shadow-sm'>
      {/* Scrollable container matching TimelineGrid */}
      <div className='overflow-x-auto'>
        <div className='min-w-max'>
          {/* Time Header Skeleton */}
          <div className='bg-muted/30 sticky top-0 z-10 flex border-b'>
            {/* Court column header */}
            <div className='w-32 shrink-0 border-r px-4 py-4 md:w-40'>
              <Skeleton className='h-4 w-16' />
            </div>

            {/* Time slots */}
            <div className='flex flex-1'>
              {Array.from({ length: timeSlotCount }).map((_, i) => (
                <div
                  key={i}
                  className='border-border relative flex w-[60px] shrink-0 items-center justify-center border-r px-2 py-3 md:w-[80px] md:py-4'
                >
                  <Skeleton className='h-3 w-8' />
                </div>
              ))}
            </div>
          </div>

          {/* Court Rows Skeleton */}
          <div className='divide-y'>
            {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <div key={rowIndex} className='flex border-b last:border-b-0'>
                {/* Court label */}
                <div className='flex w-32 shrink-0 items-center border-r px-4 py-5 md:w-40 md:py-6'>
                  <Skeleton className='h-6 w-20' />
                </div>

                {/* Time grid */}
                <div className='relative flex flex-1'>
                  {/* Grid lines */}
                  <div className='flex flex-1'>
                    {Array.from({ length: timeSlotCount }).map((_, i) => (
                      <div
                        key={i}
                        className='border-border/50 w-[60px] shrink-0 border-r md:w-[80px]'
                        style={{ height: '88px' }}
                      />
                    ))}
                  </div>

                  {/* Skeleton booking cards (2-3 random bookings per row) */}
                  <div className='absolute inset-0 flex items-center px-2'>
                    {rowIndex === 0 && (
                      <>
                        <Skeleton
                          className='absolute h-16 rounded'
                          style={{
                            left: '120px',
                            width: '180px',
                          }}
                        />
                        <Skeleton
                          className='absolute h-16 rounded'
                          style={{
                            left: '360px',
                            width: '120px',
                          }}
                        />
                      </>
                    )}
                    {rowIndex === 1 && (
                      <>
                        <Skeleton
                          className='absolute h-16 rounded'
                          style={{
                            left: '60px',
                            width: '120px',
                          }}
                        />
                        <Skeleton
                          className='absolute h-16 rounded'
                          style={{
                            left: '480px',
                            width: '240px',
                          }}
                        />
                      </>
                    )}
                    {rowIndex === 2 && (
                      <Skeleton
                        className='absolute h-16 rounded'
                        style={{
                          left: '240px',
                          width: '180px',
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
