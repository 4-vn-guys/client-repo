export const TIMELINE_CONFIG = {
  startHour: 6,
  endHour: 23,
  slotWidth: 30, // pixels per hour
};

export function generateTimeSlots(startHour = 6, endHour = 23): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour}:00`);
  }
  return slots;
}

export function calculateBookingPosition(
  startTime: Date,
  duration: number,
  slotWidth: number = TIMELINE_CONFIG.slotWidth
): { left: number; width: number } {
  const startHour = startTime.getHours();
  const startMinutes = startTime.getMinutes();

  // Calculate offset from 6:00 AM
  const hoursFromStart =
    startHour - TIMELINE_CONFIG.startHour + startMinutes / 60;
  const left = hoursFromStart * slotWidth;
  const width = duration * slotWidth;

  return { left, width };
}
