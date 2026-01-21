import { useQuery } from '@tanstack/react-query';
import { fetchBookingsByBranchId } from '@/entities/booking';
import type { BookingsQuery, OwnerBookingsQuery, UserBookingsQuery } from '@/entities/booking';
import type { Court } from '@/entities/court';

/**
 * Role-aware hook for fetching bookings
 * Branches based on role to fetch appropriate data
 * 
 * @param query - Discriminated union query based on role
 * @returns Query result with courts and bookings
 */
export function useBookings(query: BookingsQuery) {
  if (query.role === 'owner') {
    return useOwnerBookings(query);
  } else {
    return useUserBookings(query);
  }
}

/**
 * Fetch all bookings for a branch (owner role)
 */
function useOwnerBookings(query: OwnerBookingsQuery) {
  const { branchId, date } = query;
  
  // Memoize date string for stable query key
  const dateKey = date.toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ['bookings', 'owner', branchId, dateKey],
    queryFn: () => fetchBookingsByBranchId(branchId, date),
    staleTime: 1 * 60 * 1000, // Cache for 1 minute
    select: (data: Court[]) => ({
      courts: data,
      bookings: data.flatMap(court => court.bookings || []),
    }),
  });
}

/**
 * Fetch only user's bookings (user role)
 * TODO: Implement API endpoint for fetching user bookings
 */
function useUserBookings(query: UserBookingsQuery) {
  const { userId, date } = query;
  
  const dateKey = date?.toISOString().split('T')[0] || 'all';
  
  return useQuery({
    queryKey: ['bookings', 'user', userId, dateKey],
    queryFn: async () => {
      // TODO: Implement fetchUserBookings API call
      // For now, return empty data
      console.warn('User bookings API not yet implemented');
      return {
        courts: [] as Court[],
        bookings: [],
      };
    },
    staleTime: 1 * 60 * 1000,
    enabled: false, // Disable until API is implemented
  });
}
