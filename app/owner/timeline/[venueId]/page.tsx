import { TimelinePage } from '@/pages/owner/timeline';

export const metadata = {
    title: 'Timeline | Court Connect',
    description: 'View and manage court bookings',
};

interface PageProps {
    params: {
        venueId: string;
    };
}

export default function TimelinePageWrapper({ params }: PageProps) {
    return <TimelinePage venueId={params.venueId} />;
}
