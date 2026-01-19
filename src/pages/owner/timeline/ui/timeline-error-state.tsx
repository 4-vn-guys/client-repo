import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';

/**
 * Error state for timeline page
 * Displays when venue is not found or access is denied
 */
export function TimelineErrorState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
            <div className="bg-destructive/10 p-4 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Venue Not Found</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
                The venue you are looking for does not exist or you do not have permission to view it.
            </p>
            <Link href="/owner/venues">
                <Button variant="outline">Back to Venues</Button>
            </Link>
        </div>
    );
}
