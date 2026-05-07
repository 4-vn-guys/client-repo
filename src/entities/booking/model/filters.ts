/**
 * Booking Filter Types
 * Types and utilities for filtering booking lists
 */

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'maintenance';
export type BookingPaymentStatus = 'unpaid' | 'paid' | 'refunded';

/**
 * Booking list filter parameters
 */
export interface BookingFilters {
  page?: number;
  limit?: number;
  status?: BookingStatus;
  statusPayment?: BookingPaymentStatus;
  search?: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Default filter values
 */
export const DEFAULT_BOOKING_FILTERS: Required<
  Omit<BookingFilters, 'status' | 'statusPayment' | 'search'>
> = {
  page: 1,
  limit: 20,
};
