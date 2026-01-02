export const TIMELINE_CONFIG = {
  startHour: 6,
  endHour: 23,
  slotWidth: 60, // pixels per 30 minutes
  mobileSlotWidth: 40, // smaller on mobile
  rowHeight: 88, // increased row height for better spacing
  intervalMinutes: 30, // 30-minute intervals
};

export function generateTimeSlots(startHour = 6, endHour = 23): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour}:00`);
    if (hour < endHour) {
      slots.push(`${hour}:30`);
    }
  }
  return slots;
}

export function formatTimeLabel(timeString: string): string {
  const [hour, minute] = timeString.split(':');
  return `${hour.padStart(2, '0')}:${minute}`;
}

export function calculateBookingPosition(
  startTime: Date,
  duration: number,
  slotWidth: number = TIMELINE_CONFIG.slotWidth
): { left: number; width: number } {
  const startHour = startTime.getHours();
  const startMinutes = startTime.getMinutes();

  // Calculate offset from start hour in 30-minute intervals
  const totalMinutesFromStart = 
    (startHour - TIMELINE_CONFIG.startHour) * 60 + startMinutes;
  const intervalCount = totalMinutesFromStart / TIMELINE_CONFIG.intervalMinutes;
  const left = intervalCount * slotWidth;
  
  // Duration is in hours, convert to 30-minute intervals
  const durationIntervals = (duration * 60) / TIMELINE_CONFIG.intervalMinutes;
  const width = durationIntervals * slotWidth;

  return { left, width };
}
