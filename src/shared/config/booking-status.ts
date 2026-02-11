/** Normalized booking status - lowercase throughout the app */
export enum StatusBooking {
  Confirm = 'confirmed',
  Pending = 'pending',
  Cancelled = 'cancelled',
  Maintenance = 'maintenance',
}

/** Normalized payment status - lowercase throughout the app */
export enum StatusPayment {
  Paid = 'paid',
  UnPaid = 'unpaid',
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'maintenance';
export type BookingPaymentStatus = 'paid' | 'unpaid';

/** Legacy constants for backward compatibility */
export const BOOKING_STATUS = {
  PENDING: StatusBooking.Pending,
  CONFIRMED: StatusBooking.Confirm,
  CANCELLED: StatusBooking.Cancelled,
  MAINTENANCE: StatusBooking.Maintenance,
} as const;

export const BOOKING_PAYMENT_STATUS = {
  unpaid: StatusPayment.UnPaid,
  paid: StatusPayment.Paid,
} as const;

export const bookingStatusColors: Record<
  BookingStatus,
  { bg: string; text: string; border: string }
> = {
  pending: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  confirmed: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  maintenance: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
};

export const bookingStatusDotColors: Record<BookingStatus, string> = {
  pending: 'bg-amber-400',
  confirmed: 'bg-emerald-500',
  cancelled: 'bg-red-500',
  maintenance: 'bg-slate-400',
};

/** Map API (any format) to normalized lowercase */
export const API_STATUS_MAP: Record<string, BookingStatus> = {
  Pending: 'pending',
  pending: 'pending',
  Confirmed: 'confirmed',
  confirmed: 'confirmed',
  Cancelled: 'cancelled',
  cancelled: 'cancelled',
  Completed: 'confirmed', // map completed -> confirmed
  Maintenance: 'maintenance',
  maintenance: 'maintenance',
};

/** Map API (any format) to normalized lowercase */
export const API_STATUS_PAYMENT_MAP: Record<string, BookingPaymentStatus> = {
  UnPaid: 'unpaid',
  unpaid: 'unpaid',
  Paid: 'paid',
  paid: 'paid',
  Refunded: 'unpaid', // map refunded -> unpaid
};

/** Convert our lowercase status to API format (many backends expect PascalCase) */
export const toApiStatus = (
  s: BookingStatus
): 'Pending' | 'Confirmed' | 'Cancelled' | 'Maintenance' => {
  const map: Record<BookingStatus, 'Pending' | 'Confirmed' | 'Cancelled' | 'Maintenance'> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    maintenance: 'Maintenance',
  };
  return map[s] ?? 'Pending';
};

/** Convert our lowercase statusPayment to API format */
export const toApiStatusPayment = (
  s: BookingPaymentStatus
): 'UnPaid' | 'Paid' => {
  const map: Record<BookingPaymentStatus, 'UnPaid' | 'Paid'> = {
    unpaid: 'UnPaid',
    paid: 'Paid',
  };
  return map[s] ?? 'UnPaid';
};