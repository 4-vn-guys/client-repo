import type { Court } from '@/entities/court';

export type EstimateCourtRentalParams = {
  courts: Court[];
  isMultiSlotMode: boolean;
  initialDetails?: Array<{ courtId: string; slotIndex: number }>;
  courtId?: string;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
};

/**
 * Client-side estimate of court rental from default hourly rates (server may differ if price rules apply).
 */
export function estimateCourtRental({
  courts,
  isMultiSlotMode,
  initialDetails,
  courtId,
  startHour,
  startMinute,
  endHour,
  endMinute,
}: EstimateCourtRentalParams): number {
  if (isMultiSlotMode && initialDetails?.length) {
    return initialDetails.reduce((sum, d) => {
      const court = courts.find((c) => c.id === d.courtId);
      return sum + (court?.defaultHourlyRate ?? 0);
    }, 0);
  }
  if (!courtId) return 0;
  const court = courts.find((c) => c.id === courtId);
  const rate = court?.defaultHourlyRate ?? 0;
  const sh = parseInt(startHour, 10);
  const sm = parseInt(startMinute, 10);
  const eh = parseInt(endHour, 10);
  const em = parseInt(endMinute, 10);
  const startM = sh * 60 + sm;
  const endM = eh * 60 + em;
  const hours = Math.max(0, (endM - startM) / 60);
  return rate * hours;
}

export function sumGoodsSubtotal(
  lines: Array<{ quantity: number; unitPrice: number }>,
): number {
  return lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
}
