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
