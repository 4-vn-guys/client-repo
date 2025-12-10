import type { BookingStatus } from '@/shared/config/';

export interface Booking {
  id: string;
  courtId: string;
  customerName: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in hours
  price: number;
  status: BookingStatus;
}
