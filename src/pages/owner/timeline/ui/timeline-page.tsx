'use client';

import { MapPin, AlertCircle } from 'lucide-react';
import { TimelineHeader } from '@/widgets/owner/header';
import { TimelineGrid } from '@/widgets/owner/';
import { DateNavigation } from '@/features/owner/filter-by-day';
import { NewBookingButton } from '@/features/owner/create-booking';
import { BookingDialog } from '@/features/owner/booking-form';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';

import { Skeleton } from '@/shared/ui/skeleton';
import { useTimelineData } from '../model';

interface TimelinePageProps {
  venueId: string;
}

export function TimelinePageContent({ venueId }: TimelinePageProps) {
  const {
    selectedDate,
    setSelectedDate,
    selectedSlots,
    venue,
    courtsWithBookings,
    allBookings,
    branchId,
    isOwnerRole,
    isLoading,
    isError,
    bookingDialogOpen,
    setBookingDialogOpen,
    bookingDialogData,
    handleNewBooking,
    handleCellClick,
    isSlotSelected,
    handleBookingFromSelection,
    handleBookingClick,
    handleBookingSubmit,
    isSubmitting,
  } = useTimelineData(venueId);

  const courts = courtsWithBookings ?? [];

  if (isError || !venue) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">Venue Not Found</h2>
        <p className="mb-6 max-w-md text-muted-foreground">
          The venue you are looking for does not exist or you do not have
          permission to view it.
        </p>
        <Link href="/owner/venues">
          <Button variant="outline">Back to Venues</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 animate-in fade-in duration-500 md:space-y-6 md:p-6">
      <div className="flex flex-col gap-1 border-b border-border/40 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">{venue.name}</h1>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          {venue.address}
        </div>
      </div>

      <TimelineHeader
        title="Schedule"
        dateNavigation={
          <DateNavigation
            date={selectedDate}
            onDateChange={setSelectedDate}
          />
        }
        actions={
          <div className="flex items-center gap-2">
            {selectedSlots.length > 0 && (
              <Button
                variant="solid"
                onClick={handleBookingFromSelection}
                className="bg-primary hover:bg-primary/90"
              >
                Book Selected ({selectedSlots.length})
              </Button>
            )}
            <NewBookingButton onClick={handleNewBooking} />
          </div>
        }
      />
      <TimelineGrid
        courts={courts}
        bookings={allBookings}
        onCellClick={handleCellClick}
        onBookingClick={handleBookingClick}
        isSlotSelected={isSlotSelected}
        isLoading={isLoading}
      />

      <BookingDialog
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        branchId={branchId}
        courts={courts}
        selectedDate={selectedDate}
        isOwnerRole={isOwnerRole}
        initialData={bookingDialogData}
        onSubmit={handleBookingSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
