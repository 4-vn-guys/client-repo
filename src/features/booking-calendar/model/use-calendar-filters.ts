import { useMemo } from 'react';
import type { CalendarFilters } from '@/entities/booking';

/**
 * Hook to generate calendar filters based on user role
 * Centralizes filter logic for different roles
 */
export function useCalendarFilters(role: 'owner' | 'user'): CalendarFilters {
  return useMemo(() => {
    if (role === 'owner') {
      return {
        role: 'owner',
        showAllCourts: true,
        canCreateBookings: true,
        canEditAllBookings: true,
        canDeleteBookings: true,
      };
    } else {
      return {
        role: 'user',
        showAllCourts: false, // Only show courts with user's bookings
        canCreateBookings: false, // TODO: Determine if users can create bookings
        canEditAllBookings: false, // Users can only edit their own bookings
        canDeleteBookings: false, // TODO: Determine if users can delete bookings
      };
    }
  }, [role]);
}
