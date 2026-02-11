'use client';
import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Court } from '@/entities/court';
import { fetchBranchById } from '@/entities/venue';
import {
  fetchBookingsByBranchId,
  createBooking,
  updateBooking,
  type CreateBookingDto,
  type Booking,
} from '@/entities/booking';
import { gridColumnToHour } from '@/shared/lib/utils/time-utils';
import toast from 'react-hot-toast';

/**
 * Custom hook for timeline data fetching and state management
 * Encapsulates all data fetching logic following FSD principles
 */
export function useTimelineData(venueId: string) {
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingDialogData, setBookingDialogData] = useState<
    | {
        courtId?: string;
        bookingId?: string;
        bookingTitle?: string;
        customerName?: string;
        note?: string;
        startHour?: number;
        startMinute?: string;
        endHour?: number;
        endMinute?: string;
        status?: 'pending' | 'confirmed' | 'cancelled' | 'maintenance';
        statusPayment?: 'unpaid' | 'paid' | 'refunded';
        totalPrice?: number;
      }
    | undefined
  >();

  const queryClient = useQueryClient();

  // Memoize date string for stable query key (prevents unnecessary refetches)
  const selectedDateKey = useMemo(
    () => selectedDate.toISOString().split('T')[0],
    [selectedDate]
  );

  // Fetch venue details (only depends on venueId, never refetches on date change)
  const {
    data: venue,
    isLoading: isLoadingVenue,
    isError: isErrorVenue,
  } = useQuery({
    queryKey: ['branch', venueId],
    queryFn: () => fetchBranchById(venueId),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Fetch courts with bookings (refetches only when venueId or date changes)
  const {
    data: courtsWithBookings,
    isLoading: isLoadingBookings,
    isError: isErrorBookings,
  } = useQuery({
    queryKey: ['bookings', 'branch', venueId, selectedDateKey],
    queryFn: () => fetchBookingsByBranchId(venueId, selectedDate),
    enabled: !!venueId,
    staleTime: 1 * 60 * 1000, // Cache for 1 minute
  });

  // Extract all bookings from all courts
  const allBookings = useMemo(() => {
    if (!courtsWithBookings) return [];
    return courtsWithBookings.flatMap((court: Court) => court.bookings || []);
  }, [courtsWithBookings]);

  // Mutation for creating a booking
  const createBookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      //  Invalidate and refetch bookings
      queryClient.invalidateQueries({
        queryKey: ['bookings', 'branch', venueId, selectedDateKey],
      });
      toast.success('Booking created successfully!');
    },
    onError: (error: unknown) => {
      console.error('Error creating booking:', error);
      const message = error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : 'Failed to create booking';
      toast.error(message);
    },
  });

  // Mutation for updating a booking
  const updateBookingMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateBookingDto }) =>
      updateBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bookings', 'branch', venueId, selectedDateKey],
      });
      toast.success('Booking updated successfully!');
    },
    onError: (error: unknown) => {
      console.error('Error updating booking:', error);
      const message = error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : 'Failed to update booking';
      toast.error(message);
    },
  });

  // Handle new booking action from button
  const handleNewBooking = useCallback(() => {
    setBookingDialogData(undefined);
    setBookingDialogOpen(true);
  }, []);

  // Handle calendar cell click
  const handleCellClick = useCallback((courtId: string, slotIndex: number) => {
    const startHour = gridColumnToHour(slotIndex);
    setBookingDialogData({ courtId, startHour });
    setBookingDialogOpen(true);
  }, []);

  // Handle booking card click for editing
  const handleBookingClick = useCallback((booking: Booking) => {
    const startDate = new Date(booking.startTime);
    const endDate = new Date(booking.endTime);

    setBookingDialogData({
      bookingId: booking.id,
      courtId: booking.courtId,
      bookingTitle: booking.bookingTitle,
      customerName: booking.customerName || booking.user?.username,
      note: booking.note || undefined,
      startHour: startDate.getHours(),
      startMinute: startDate.getMinutes().toString().padStart(2, '0'),
      endHour: endDate.getHours(),
      endMinute: endDate.getMinutes().toString().padStart(2, '0'),
      status: booking.status,
      statusPayment: booking.statusPayment as 'unpaid' | 'paid' | 'refunded',
      totalPrice: booking.totalPrice,
    });
    setBookingDialogOpen(true);
  }, []);

  // Handle booking submission (create or update)
  const handleBookingSubmit = useCallback(
    async (data: CreateBookingDto) => {
      if (bookingDialogData?.bookingId) {
        // Update existing booking
        await updateBookingMutation.mutateAsync({
          id: bookingDialogData.bookingId,
          data,
        });
      } else {
        // Create new booking
        await createBookingMutation.mutateAsync(data);
      }
    },
    [bookingDialogData, createBookingMutation, updateBookingMutation]
  );

  return {
    // State
    selectedDate,
    setSelectedDate,

    // Data
    venue,
    courtsWithBookings,
    allBookings,

    // Loading states
    isLoading: isLoadingVenue || isLoadingBookings,
    isLoadingVenue,
    isLoadingBookings,

    // Error states
    isError: isErrorVenue || isErrorBookings,
    isErrorVenue,
    isErrorBookings,

    // Booking dialog state
    bookingDialogOpen,
    setBookingDialogOpen,
    bookingDialogData,

    // Actions
    handleNewBooking,
    handleCellClick,
    handleBookingClick,
    handleBookingSubmit,
    isSubmitting:
      createBookingMutation.isPending || updateBookingMutation.isPending,
  };
}
