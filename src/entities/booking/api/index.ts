import { axiosInstance } from '@/shared/lib/axios';
import type { Court } from '@/entities/court';
import { formatDateToYYYYMMDD } from '@/shared/lib/utils';
import { BookingsByBranchResponse } from '../model/type';

/**
 * Fetch all courts with bookings for a specific branch
 * @param branchId - The branch/venue ID
 * @param date - Optional date to fetch bookings for (defaults to today)
 * @returns Array of courts with their bookings nested inside
 */
export const fetchBookingsByBranchId = async (
  branchId: string, 
  date?: Date
): Promise<Court[]> => {
  try {
    // Default to today if no date provided
    const queryDate = date || new Date();
    const formattedDate = formatDateToYYYYMMDD(queryDate);
    
    const response = await axiosInstance.get<BookingsByBranchResponse>(
      `/bookings/branch/${branchId}`,
      {
        params: {
          date: formattedDate
        }
      }
    );
    
    if (response.data.success) {
      // Transform the data to include legacy fields expected by UI
      return response.data.data.map(court => ({
        ...court,
        bookings: court.bookings?.map(booking => {
          // Calculate duration in hours from startTime and endTime
          const start = new Date(booking.startTime);
          const end = new Date(booking.endTime);
          const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          
          return {
            ...booking,
            customerName: booking.user?.username || booking.bookingTitle || 'Unknown',
            duration: durationInHours,
            price: booking.totalPrice,
          };
        }) || []
      }));
    }
    
    throw new Error('Failed to fetch bookings');
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};
