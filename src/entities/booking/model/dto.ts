/**
 * Create Booking DTO - matches API requirements
 */
export interface CreateBookingDto {
  courtId: string;
  bookingTitle: string;
  startTime: string; // ISO 8601 with timezone (e.g., "2026-01-22T18:00:00+07:00")
  endTime: string; // ISO 8601 with timezone
  note?: string;
}

/**
 * Update Booking DTO
 */
export interface UpdateBookingDto extends Partial<CreateBookingDto> {
  status?: string;
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
