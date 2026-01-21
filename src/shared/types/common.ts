/**
 * Common Types
 * Shared types used across the application
 */

/**
 * Error response type from APIs
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Booking Dialog Initial Data
 */
export interface BookingDialogInitialData {
  courtId?: string;
  bookingId?: string;
  bookingTitle?: string;
  customerName?: string;
  note?: string;
  startHour?: number;
  startMinute?: string;
  endHour?: number;
  endMinute?: string;
}

/**
 * Performance Metrics
 */
export interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}
