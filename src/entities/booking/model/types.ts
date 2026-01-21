import type { BookingStatus } from '@/shared/config/';
import { Court } from '../../court';

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  paymentMethod: string | null;
  status: string;
  amount: number;
  transactionDate: string;
  invoiceCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  provider: string | null;
  providerId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Booking {
  id: string;
  courtId: string;
  userId: string;
  status: BookingStatus;
  bookingTitle: string;
  statusPayment: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  note: string | null;
  branchId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  payment?: Payment;
  user?: User;
  // Legacy support for mock data
  customerName?: string;
  duration?: number;
  price?: number;
}

export interface BookingsByBranchResponse {
  success: boolean;
  data: Court[];
}

// ============================================
// Role-Based Query Types (FSD Pattern)
// ============================================

/**
 * Owner bookings query - fetch all bookings for a branch
 */
export type OwnerBookingsQuery = {
  role: 'owner';
  branchId: string;
  date: Date;
};

/**
 * User bookings query - fetch only user's bookings
 */
export type UserBookingsQuery = {
  role: 'user';
  userId: string;
  date?: Date;
};

/**
 * Discriminated union for booking queries
 */
export type BookingsQuery = OwnerBookingsQuery | UserBookingsQuery;

// ============================================
// Calendar Configuration Types
// ============================================

/**
 * Calendar filter configuration based on user role
 */
export interface CalendarFilters {
  role: 'owner' | 'user';
  showAllCourts: boolean;
  canCreateBookings: boolean;
  canEditAllBookings: boolean;
  canDeleteBookings?: boolean;
}

/**
 * Booking data with associated court information
 */
export interface BookingWithCourt extends Booking {
  court?: Court;
}

/**
 * Calendar data structure
 */
export interface CalendarData {
  courts: Court[];
  bookings: Booking[];
  date: Date;
  filters: CalendarFilters;
}
