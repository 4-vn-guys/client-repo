import { useQuery } from '@tanstack/react-query';
import { fetchBookingsByBranchId } from '@/entities/booking';
import type { BookingsQuery } from '@/entities/booking';
import type { Court } from '@/entities/court';
import { formatDateToYYYYMMDD } from '@/shared/lib/utils';

/**
 * Role-aware hook for fetching bookings
 * Branches based on role to fetch appropriate data
 * 
 * @param query - Discriminated union query based on role
 * @returns Query result with courts and bookings
 */
export function useBookings(query: BookingsQuery) {
  const dateKey = query.date ? formatDateToYYYYMMDD(query.date) : 'all';
  const branchId = query.role === 'owner' ? query.branchId : undefined;
  const userId = query.role === 'user' ? query.userId : undefined;

  return useQuery({
    queryKey: ['bookings', query.role, branchId ?? userId, dateKey],
    queryFn: async () => {
      if (query.role === 'owner') {
        return fetchBookingsByBranchId(query.branchId, query.date);
      }

      // TODO: Implement fetchUserBookings API call
      console.warn('User bookings API not yet implemented');
      return [] as Court[];
    },
    staleTime: 1 * 60 * 1000, // Cache for 1 minute
    select: (data: Court[]) => ({
      courts: data,
      bookings: data.flatMap(court => court.bookings || []),
    }),
    enabled: query.role === 'owner',
  });
}
