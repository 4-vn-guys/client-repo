/**
 * Add-on item (goods/services) attached to a booking
 */
export interface BookingGoodLine {
  /** Pro Shop catalog id — when set, stock is reserved until cancel/pickup */
  productId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Detail item for create booking - each court slot in the booking
 */
export interface CreateBookingDetailDto {
  courtId: string;
  startTime: string; // ISO 8601 (e.g., "2026-01-10T14:00:00Z")
  endTime: string;
}

/**
 * Create Booking DTO - matches API create endpoint
 * - branchId, bookingTitle, note, details required
 * - userName required only for owner role (backend resolves user from auth for regular users)
 * - status, statusPayment, totalPrice optional (owner can set when creating on behalf of customer)
 */
export interface CreateBookingDto {
  branchId: string;
  bookingTitle: string;
  userName?: string; // Required when logged in as owner (booking on behalf of customer)
  note?: string;
  details: CreateBookingDetailDto[];
  status?: 'pending' | 'confirmed' | 'cancelled' | 'maintenance';
  statusPayment?: 'paid' | 'unpaid';
  totalPrice?: number;
  goods?: BookingGoodLine[];
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
  statusPayment?: 'paid' | 'unpaid';
  goods?: BookingGoodLine[] | null;
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
