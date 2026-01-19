'use client'
import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Court } from '@/entities/court';
import { fetchBranchById } from '@/entities/venue';
import { fetchBookingsByBranchId } from '@/entities/booking';

/**
 * Custom hook for timeline data fetching and state management
 * Encapsulates all data fetching logic following FSD principles
 */
export function useTimelineData(venueId: string) {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 11, 9));

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

  // Handle new booking action
  const handleNewBooking = useCallback(() => {
    // TODO: Open booking modal
    console.log('New booking clicked for venue', venueId);
  }, [venueId]);

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

    // Actions
    handleNewBooking,
  };
}
