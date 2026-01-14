import { TimelinePage } from '@/src/pages/owner/timeline';

export const metadata = {
    title: 'Timeline | Court Connect',
    description: 'View and manage court bookings',
};

interface PageProps {
    params: Promise<{
        venueId: string;
    }>;
}

export default async function TimelinePageWrapper(props: PageProps) {
    const params = await props.params;
    return <TimelinePage venueId={params.venueId} />;
}
