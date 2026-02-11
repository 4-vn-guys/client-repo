import { axiosInstance } from '@/shared/lib/axios';
import type { Court } from '@/entities/court';
import { formatDateToYYYYMMDD } from '@/shared/lib/utils';
import { BookingsByBranchResponse, Booking } from '../model/types';
import type { CreateBookingDto, UpdateBookingDto } from '../model/dto';
import type { BookingFilters, PaginatedResponse } from '../model/filters';

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
          date: formattedDate,
        },
      }
    );

    if (response.data.success) {
      // Transform the data to include legacy fields expected by UI
      return response.data.data.map(court => ({
        ...court,
        bookings:
          court.bookings?.map(booking => {
            // Calculate duration in hours from startTime and endTime
            const start = new Date(booking.startTime);
            const end = new Date(booking.endTime);
            const durationInHours =
              (end.getTime() - start.getTime()) / (1000 * 60 * 60);

            return {
              ...booking,
              customerName:
                booking.user?.username || booking.bookingTitle || 'Unknown',
              duration: durationInHours,
              price: booking.totalPrice,
            };
          }) || [],
      }));
    }

    throw new Error('Failed to fetch bookings');
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

/**
 * Create a new booking
 * @param data - Booking creation data
 * @returns Created booking response
 */
export const createBooking = async (data: CreateBookingDto) => {
  try {
    const response = await axiosInstance.post('/bookings/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

/**
 * Update an existing booking
 * @param id - Booking ID
 * @param data - Booking update data
 * @returns Updated booking response
 */
export const updateBooking = async (id: string, data: UpdateBookingDto) => {
  try {
    const response = await axiosInstance.patch(`/bookings/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

/**
 * Fetch list of bookings with pagination and filters
 * @param filters - Filter parameters (page, limit, status, statusPayment)
 * @returns Paginated list of bookings
 */
export const fetchBookings = async (filters?: BookingFilters): Promise<PaginatedResponse<Booking>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<Booking>>('/bookings/', {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

/**
 * Fetch a single booking by ID
 * @param id - Booking ID
 * @returns Booking details
 */
export const fetchBookingById = async (id: string): Promise<Booking> => {
  try {
    const response = await axiosInstance.get<{ data: Booking }>(`/bookings/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

/**
 * Cancel a booking (sets status to 'cancelled')
 * @param id - Booking ID
 * @param reason - Optional cancellation reason
 * @returns Updated booking
 */
export const cancelBooking = async (id: string, reason?: string) => {
  try {
    const data: UpdateBookingDto = {
      status: 'cancelled',
      ...(reason && { note: reason }),
    };
    const response = await axiosInstance.patch(`/bookings/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};
