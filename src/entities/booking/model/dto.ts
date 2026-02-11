/**
 * Create Booking DTO - matches API create endpoint
 * API only requires: courtId, bookingTitle, startTime, endTime, note (optional)
 */
export interface CreateBookingDto {
  courtId: string;
  bookingTitle: string;
  startTime: string; // ISO 8601 with timezone (e.g., "2026-01-22T18:00:00+07:00")
  endTime: string; // ISO 8601 with timezone
  note?: string;
}

/**
 * Update Booking DTO - matches API update endpoint
 * All fields are optional for PATCH updates
 */
export interface UpdateBookingDto {
  bookingTitle?: string;
  startTime?: string;
  endTime?: string;
  totalPrice?: number;
  note?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'maintenance';
  statusPayment?: 'unpaid' | 'paid' | 'refunded';
}

/**
 * Booking form data type
 */
export interface BookingFormData {
  courtId: string;
  bookingTitle: string;
  customerName: string; // For display/search
  type: 'walk-in' | 'reservation';
  status: 'unpaid' | 'paid' | 'pending';
  startHour: number; // Hour in 24-hour format (0-23)
  duration: number; // Duration in hours
  note: string;
  extras?: {
    rackets: boolean;
    shoes: boolean;
    water: boolean;
  };
}

/**
 * Initial booking data for pre-filling forms
 */
export interface InitialBookingData {
  courtId?: string;
  startHour?: number;
  date?: Date;
  bookingId?: string; // For edit mode
}
