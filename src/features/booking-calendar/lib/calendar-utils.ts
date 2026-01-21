export const TIMELINE_CONFIG = {
  startHour: 6,
  endHour: 23,
  slotWidth: 80, // pixels per hour on desktop
  mobileSlotWidth: 60, // pixels per hour on mobile
  rowHeight: 88, // increased row height for better spacing
  intervalMinutes: 60, // 1-hour intervals
};

export function generateTimeSlots(startHour = 6, endHour = 23): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour}:00`);
  }
  return slots;
}

export function formatTimeLabel(timeString: string): string {
  const [hour, minute] = timeString.split(':');
  return `${hour.padStart(2, '0')}:${minute}`;
}

export function calculateBookingPosition(
  startTime: Date | string,
  duration: number,
  slotWidth: number = TIMELINE_CONFIG.slotWidth
): { left: number; width: number } {
  // Convert string to Date if needed
  const date = typeof startTime === 'string' ? new Date(startTime) : startTime;
  const startHour = date.getHours();
  const startMinutes = date.getMinutes();

  // Calculate offset from start hour in hourly intervals
  const totalMinutesFromStart =
    (startHour - TIMELINE_CONFIG.startHour) * 60 + startMinutes;
  const intervalCount = totalMinutesFromStart / TIMELINE_CONFIG.intervalMinutes;
  const left = intervalCount * slotWidth;

  // Duration is in hours, convert to hourly intervals
  const durationIntervals = (duration * 60) / TIMELINE_CONFIG.intervalMinutes;
  const width = durationIntervals * slotWidth;

  return { left, width };
}
