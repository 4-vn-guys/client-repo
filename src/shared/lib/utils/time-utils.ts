/**
 * Time Utilities
 * Helper functions for time calculations and formatting
 */

/**
 * Convert grid column position to time in hours (24-hour format)
 * Assumes grid starts at 6:00 AM with 1-hour intervals
 * @param columnIndex - The column index in the timeline grid (0-based)
 * @returns Time in hours (0-23)
 */
export function gridColumnToHour(columnIndex: number): number {
  const START_HOUR = 6; // Grid starts at 6:00 AM
  return (START_HOUR + columnIndex) % 24;
}

/**
 * Convert hour to grid column position
 * @param hour - Hour in 24-hour format (0-23)
 * @returns Column index in the grid
 */
export function hourToGridColumn(hour: number): number {
  const START_HOUR = 6;
  return (hour - START_HOUR + 24) % 24;
}

/**
 * Calculate duration in hours between two times
 * @param startTime - Start time as ISO string or Date
 * @param endTime - End time as ISO string or Date
 * @returns Duration in hours
 */
export function calculateDuration(
  startTime: string | Date,
  endTime: string | Date
): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationInMs = end.getTime() - start.getTime();
  return durationInMs / (1000 * 60 * 60); // Convert to hours
}

/**
 * Format time for display (e.g., "6:00", "18:00")
 * @param hour - Hour in 24-hour format
 * @param minute - Minute (default: 0)
 * @returns Formatted time string
 */
export function formatTimeDisplay(hour: number, minute: number = 0): string {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

/**
 * Generate time slots for a day (6 AM to midnight)
 * @returns Array of time slot objects with hour and label
 */
export function generateTimeSlots(): Array<{ hour: number; label: string }> {
  const slots: Array<{ hour: number; label: string }> = [];
  const START_HOUR = 6;
  const END_HOUR = 24;

  for (let hour = START_HOUR; hour < END_HOUR; hour++) {
    slots.push({
      hour,
      label: formatTimeDisplay(hour),
    });
  }

  return slots;
}

/**
 * Create ISO datetime string with timezone offset
 * @param date - Date object
 * @param hour - Hour in 24-hour format
 * @param minute - Minute (default: 0)
 * @returns ISO string with timezone (e.g., "2026-01-22T18:00:00+07:00")
 */
export function createISOWithTimezone(
  date: Date,
  hour: number,
  minute: number = 0
): string {
  const newDate = new Date(date);
  newDate.setHours(hour, minute, 0, 0);

  // Get timezone offset in minutes and convert to ±HH:MM format
  const offset = -newDate.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offset) / 60);
  const offsetMinutes = Math.abs(offset) % 60;
  const offsetSign = offset >= 0 ? '+' : '-';
  const offsetString = `${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;

  // Format: YYYY-MM-DDTHH:mm:ss±HH:MM
  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
  const day = newDate.getDate().toString().padStart(2, '0');
  const hourStr = newDate.getHours().toString().padStart(2, '0');
  const minuteStr = newDate.getMinutes().toString().padStart(2, '0');
  const secondStr = newDate.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day}T${hourStr}:${minuteStr}:${secondStr}${offsetString}`;
}

/**
 * Add hours to a date
 * @param date - Base date
 * @param hours - Number of hours to add
 * @returns New date with hours added
 */
export function addHours(date: Date, hours: number): Date {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
}

/**
 * Extract hour from ISO datetime string
 * @param isoString - ISO datetime string
 * @returns Hour in 24-hour format
 */
export function getHourFromISO(isoString: string): number {
  return new Date(isoString).getHours();
}

/**
 * Extract date (without time) from ISO string or Date
 * @param dateInput - ISO string or Date
 * @returns Date object with time set to midnight
 */
export function getDateWithoutTime(dateInput: string | Date): Date {
  const date = new Date(dateInput);
  date.setHours(0, 0, 0, 0);
  return date;
}
