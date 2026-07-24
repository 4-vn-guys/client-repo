import { axiosInstance } from '@/shared/lib/axios';
import type { Court } from '@/entities/court';
import { formatDateToYYYYMMDD } from '@/shared/lib/utils';
import {
  BOOKING_STATUS,
  BOOKING_PAYMENT_STATUS,
  API_STATUS_MAP,
  API_STATUS_PAYMENT_MAP,
} from '@/shared/config';
import type { Booking, Payment } from '../model/types';
import type { CreateBookingDto, UpdateBookingDto } from '../model/dto';
import type { BookingFilters, PaginatedResponse } from '../model/filters';

/** Raw booking detail from API (court slot with nested booking) */
interface BookingDetailApi {
  id: string;
  courtId: string;
  startTime: string;
  endTime: string;
  price: number;
  bookingId: string;
  booking: {
    id: string;
    totalPrice: number;
    userName?: string;
    bookingTitle: string;
    status: string;
    statusPayment: string;
    note: string | null;
    user?: { username: string };
    goods?: { name: string; quantity: number; unitPrice: number }[] | null;
    lifecycleStatus?: Booking['lifecycleStatus'];
    depositAmount?: number;
    balanceAmount?: number;
    depositDueAt?: string | null;
    depositConfirmedAt?: string | null;
    payments?: Payment[];
  };
}

/** Raw court from API (may have bookingDetails or bookings) */
interface CourtApi {
  id: string;
  name: string;
  branchId: string;
  surfaceType?: string;
  defaultHourlyRate?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  bookings?: Booking[];
  bookingDetails?: BookingDetailApi[];
}

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
    const queryDate = date || new Date();
    const formattedDate = formatDateToYYYYMMDD(queryDate);

    const response = await axiosInstance.get<{
      success: boolean;
      data: CourtApi[];
    }>(`/bookings/branch/${branchId}`, {
      params: { date: formattedDate },
    });

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch bookings');
    }

    return response.data.data.map((court: CourtApi) => {
      // API returns bookingDetails (each slot) with nested booking - normalize to bookings
      const rawBookings = court.bookingDetails ?? court.bookings ?? [];
      const bookings: Booking[] = rawBookings.map(
        (item: BookingDetailApi | Booking) => {
          const isDetail = 'booking' in item && item.booking;
          if (isDetail) {
            const detail = item as BookingDetailApi;
            const start = new Date(detail.startTime);
            const end = new Date(detail.endTime);
            const durationInHours =
              (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            return {
              id: detail.booking.id,
              slotId: detail.id,
              courtId: detail.courtId,
              userId: '',
              status:
                API_STATUS_MAP[detail.booking.status] ?? BOOKING_STATUS.PENDING,
              bookingTitle: detail.booking.bookingTitle,
              statusPayment:
                API_STATUS_PAYMENT_MAP[detail.booking.statusPayment] ??
                BOOKING_PAYMENT_STATUS.unpaid,
              startTime: detail.startTime,
              endTime: detail.endTime,
              totalPrice: detail.booking.totalPrice ?? detail.price ?? 0,
              note: detail.booking.note,
              goods: detail.booking.goods ?? null,
              lifecycleStatus: detail.booking.lifecycleStatus ?? null,
              depositAmount: detail.booking.depositAmount ?? 0,
              balanceAmount: detail.booking.balanceAmount ?? 0,
              depositDueAt: detail.booking.depositDueAt ?? null,
              depositConfirmedAt: detail.booking.depositConfirmedAt ?? null,
              payments: detail.booking.payments ?? [],
              branchId: court.branchId,
              createdAt: '',
              updatedAt: '',
              deletedAt: null,
              customerName:
                detail.booking.userName ||
                detail.booking.user?.username ||
                'Unknown',
              duration: durationInHours,
              price: detail.price,
            } as Booking;
          }
          // Legacy format: flat booking
          const booking = item as Booking;
          const start = new Date(booking.startTime);
          const end = new Date(booking.endTime);
          const durationInHours =
            (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          return {
            ...booking,
            status: API_STATUS_MAP[booking.status] ?? BOOKING_STATUS.PENDING,
            statusPayment:
              API_STATUS_PAYMENT_MAP[booking.statusPayment] ??
              BOOKING_PAYMENT_STATUS.unpaid,
            customerName:
              booking.user?.username || booking.bookingTitle || 'Unknown',
            duration: durationInHours,
            price: booking.totalPrice ?? booking.price,
          } as Booking;
        }
      );

      return {
        ...court,
        surfaceType: court.surfaceType ?? 'Synthetic',
        defaultHourlyRate: court.defaultHourlyRate ?? 0,
        isActive: court.isActive ?? true,
        bookings,
      } as Court;
    });
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
export const fetchBookings = async (
  filters?: BookingFilters
): Promise<PaginatedResponse<Booking>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<Booking>>(
      '/bookings/',
      {
        params: filters,
      }
    );
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
    const response = await axiosInstance.get<{ data: Booking }>(
      `/bookings/${id}`
    );
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

export const confirmBookingDeposit = async (
  id: string,
  receivedAmount?: number
): Promise<Booking> => {
  const response = await axiosInstance.post<{ data: Booking }>(
    `/bookings/${id}/deposit/confirm`,
    receivedAmount == null ? {} : { receivedAmount }
  );
  return response.data.data;
};

export const rejectBookingDeposit = async (id: string): Promise<Booking> => {
  const response = await axiosInstance.post<{ data: Booking }>(
    `/bookings/${id}/deposit/reject`
  );
  return response.data.data;
};
