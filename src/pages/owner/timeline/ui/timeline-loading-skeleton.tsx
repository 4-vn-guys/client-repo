import { Skeleton } from '@/shared/ui/skeleton';

/**
 * Loading state for timeline page
 * Displays skeleton placeholders while data is loading
 */
export function TimelineLoadingSkeleton() {
    return (
        <div className='space-y-4 p-4 md:space-y-6 md:p-6'>
            <div className="flex justify-between items-center mb-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>
            <Skeleton className="h-[600px] w-full rounded-xl" />
        </div>
    );
}
