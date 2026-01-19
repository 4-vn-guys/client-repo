import type { CourtType } from '@/shared/config';
import type { Booking } from '@/entities/booking';

export interface Court {
  id: string;
  name: string;
  branchId: string;
  surfaceType: string;
  defaultHourlyRate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  bookings: Booking[];
  // Legacy support for mock data
  type?: CourtType;
  isAvailable?: boolean;
}
