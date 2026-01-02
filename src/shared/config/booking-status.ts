export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  MAINTENANCE: 'maintenance',
} as const;

export type BookingStatus =
  (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export const bookingStatusColors: Record<
  BookingStatus,
  { bg: string; text: string; border: string }
> = {
  confirmed: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  pending: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  maintenance: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200',
  },
};

export const bookingStatusDotColors: Record<BookingStatus, string> = {
  confirmed: 'bg-emerald-500',
  pending: 'bg-amber-400',
  cancelled: 'bg-red-500',
  maintenance: 'bg-gray-400',
};
