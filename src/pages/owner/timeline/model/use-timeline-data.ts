'use client';
import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/store';
import type { Court } from '@/entities/court';
import { fetchBranchById } from '@/entities/venue';
import {
  fetchBookingsByBranchId,
  createBooking,
  updateBooking,
  type CreateBookingDto,
  type UpdateBookingDto,
  type Booking,
} from '@/entities/booking';
import { gridColumnToHour } from '@/shared/lib/utils/time-utils';
import toast from 'react-hot-toast';

/**
 * Custom hook for timeline data fetching and state management
 * Encapsulates all data fetching logic following FSD principles
 */
/** A selected slot in the grid (court + slot index) */
export type SelectedSlot = { courtId: string; slotIndex: number };

function slotKey(slot: SelectedSlot): string {
  return `${slot.courtId}:${slot.slotIndex}`;
}

export function useTimelineData(venueId: string) {
  const user = useAuthStore((s) => s.user);
  const isOwnerRole = user?.role === 'owner';
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
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
        statusPayment?: 'paid' | 'unpaid';
        totalPrice?: number;
        /** Pre-selected details from grid multi-select (courtId + slotIndex per slot) */
        details?: Array<{ courtId: string; slotIndex: number }>;
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
    mutationFn: ({ id, data }: { id: string; data: UpdateBookingDto }) =>
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

  // Handle new booking action from button (no grid selection)
  const handleNewBooking = useCallback(() => {
    setSelectedSlots([]);
    setBookingDialogData(undefined);
    setBookingDialogOpen(true);
  }, []);

  // Toggle slot selection (multi-select for booking)
  const handleCellClick = useCallback((courtId: string, slotIndex: number) => {
    setSelectedSlots((prev) => {
      const key = `${courtId}:${slotIndex}`;
      const has = prev.some((s) => slotKey(s) === key);
      if (has) return prev.filter((s) => slotKey(s) !== key);
      return [...prev, { courtId, slotIndex }];
    });
  }, []);

  // Check if a slot is selected
  const isSlotSelected = useCallback(
    (courtId: string, slotIndex: number) =>
      selectedSlots.some((s) => s.courtId === courtId && s.slotIndex === slotIndex),
    [selectedSlots]
  );

  // Open booking dialog with selected slots
  const handleBookingFromSelection = useCallback(() => {
    if (selectedSlots.length === 0) return;
    setBookingDialogData({
      details: selectedSlots.map((s) => ({ courtId: s.courtId, slotIndex: s.slotIndex })),
    });
    setBookingDialogOpen(true);
  }, [selectedSlots]);

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
      status: booking.status as 'pending' | 'confirmed' | 'cancelled' | 'maintenance',
      statusPayment: booking.statusPayment as 'paid' | 'unpaid',
      totalPrice: booking.totalPrice,
    });
    setBookingDialogOpen(true);
  }, []);

  // Handle booking submission (create or update)
  const handleBookingSubmit = useCallback(
    async (data: CreateBookingDto | UpdateBookingDto) => {
      if (bookingDialogData?.bookingId) {
        await updateBookingMutation.mutateAsync({
          id: bookingDialogData.bookingId,
          data: data as UpdateBookingDto,
        });
      } else {
        await createBookingMutation.mutateAsync(data as CreateBookingDto);
      }
    },
    [bookingDialogData, createBookingMutation, updateBookingMutation]
  );

  // Clear selection when dialog closes
  const handleBookingDialogOpenChange = useCallback((open: boolean) => {
    setBookingDialogOpen(open);
    if (!open) setSelectedSlots([]);
  }, []);

  return {
    // State
    selectedDate,
    setSelectedDate,
    selectedSlots,

    // Data
    venue,
    courtsWithBookings,
    allBookings,
    branchId: venueId,
    isOwnerRole,

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
    setBookingDialogOpen: handleBookingDialogOpenChange,
    bookingDialogData,

    // Actions
    handleNewBooking,
    handleCellClick,
    isSlotSelected,
    handleBookingFromSelection,
    handleBookingClick,
    handleBookingSubmit,
    isSubmitting:
      createBookingMutation.isPending || updateBookingMutation.isPending,
  };
}
