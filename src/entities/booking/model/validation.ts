import { useMemo } from 'react';
import z from 'zod';

/**
 * Hook for booking form validation schemas
 * Follows TanStack Form pattern with Zod validation
 */
export function useBookingFormSchema() {
  const bookingFormSchema = useMemo(
    () =>
      z
        .object({
          courtId: z.string().nonempty({ message: 'Please select a court' }),
          bookingTitle: z
            .string()
            .min(3, { message: 'Title must be at least 3 characters' })
            .max(100, { message: 'Title must not exceed 100 characters' })
            .nonempty({ message: 'Booking title is required' }),
          customerName: z
            .string()
            .min(2, { message: 'Customer name must be at least 2 characters' })
            .nonempty({ message: 'Customer name is required' }),
          type: z.enum(['walk-in', 'reservation']).default('walk-in'),
          status: z.enum(['unpaid', 'paid', 'pending']).default('unpaid'),
          startHour: z
            .string()
            .regex(/^([0-1]?[0-9]|2[0-3])$/, { message: 'Invalid hour' }),
          startMinute: z.string().regex(/^(00|15|30|45)$/, {
            message: 'Minutes must be 00, 15, 30, or 45',
          }),
          endHour: z
            .string()
            .regex(/^([0-1]?[0-9]|2[0-3])$/, { message: 'Invalid hour' }),
          endMinute: z.string().regex(/^(00|15|30|45)$/, {
            message: 'Minutes must be 00, 15, 30, or 45',
          }),
          note: z
            .string()
            .max(500, { message: 'Note must not exceed 500 characters' })
            .optional()
            .default(''),
          extras: z
            .object({
              rackets: z.boolean().default(false),
              shoes: z.boolean().default(false),
              water: z.boolean().default(false),
            })
            .optional()
            .default({ rackets: false, shoes: false, water: false }),
        })
        .refine(
          data => {
            // Validate that end time is after start time
            const startTotal =
              parseInt(data.startHour) * 60 + parseInt(data.startMinute);
            const endTotal =
              parseInt(data.endHour) * 60 + parseInt(data.endMinute);
            return endTotal > startTotal;
          },
          {
            message: 'End time must be after start time',
            path: ['endHour'],
          }
        ),
    []
  );

  return {
    bookingFormSchema,
  };
}

export type BookingFormSchema = z.infer<
  ReturnType<typeof useBookingFormSchema>['bookingFormSchema']
>;
