export const TIMELINE_CONFIG = {
  startHour: 6,
  endHour: 23,
  slotWidth: 80, // pixels per hour on desktop
  mobileSlotWidth: 60, // pixels per hour on mobile
  rowHeight: 88, // increased row height for better spacing
  intervalMinutes: 60, // 1-hour intervals
};

/** Matches Tailwind `w-32` / `md:w-40` on court label column */
export const TIMELINE_LABEL_WIDTH = {
  sm: 128,
  md: 160,
} as const;

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

/**
 * Horizontal offset (px) for the "current time" marker within the time columns only
 * (excluding the court label). Returns null if now is outside the visible timeline window.
 */
export function getNowOffsetWithinTimeline(
  now: Date,
  slotWidth: number,
  intervalMinutes: number = TIMELINE_CONFIG.intervalMinutes
): number | null {
  const totalSeconds =
    now.getHours() * 3600 +
    now.getMinutes() * 60 +
    now.getSeconds() +
    now.getMilliseconds() / 1000;
  const minuteFloat = totalSeconds / 60;

  const gridStart = TIMELINE_CONFIG.startHour * 60;
  const gridEnd = (TIMELINE_CONFIG.endHour + 1) * 60;

  if (minuteFloat < gridStart || minuteFloat >= gridEnd) {
    return null;
  }

  return ((minuteFloat - gridStart) / intervalMinutes) * slotWidth;
}
