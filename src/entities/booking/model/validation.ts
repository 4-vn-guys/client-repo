import { useMemo } from 'react';
import z from 'zod';

/**
 * Hook for booking form validation schemas
 * Follows TanStack Form pattern with Zod validation
 * @param requireCustomerName - When true (owner role), customer name is required. When false (user role), backend resolves user from auth.
 * @param isMultiSlotMode - When true, courtId is optional (slots come from grid selection). When false, courtId is required.
 */
export function useBookingFormSchema(requireCustomerName = true, isMultiSlotMode = false) {
  const bookingFormSchema = useMemo(() => {
    const base = z
      .object({
        courtId: isMultiSlotMode
          ? z.string().optional()
          : z.string().nonempty({ message: 'Please select a court' }),
        bookingTitle: z
          .string()
          .min(3, { message: 'Title must be at least 3 characters' })
          .max(100, { message: 'Title must not exceed 100 characters' })
          .nonempty({ message: 'Booking title is required' }),
        /** Always a string in the form; owner rules applied via superRefine when needed */
        customerName: z.string(),
        type: z.enum(['walk-in', 'reservation']).default('walk-in'),
        status: z
          .enum(['pending', 'confirmed', 'cancelled', 'maintenance'])
          .default('pending'),
        statusPayment: z
          .enum(['paid', 'unpaid'])
          .default('unpaid'),
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
          .optional(),
        totalPrice: z.number().min(0).default(0),
        goods: z
          .array(
            z.object({
              id: z.string(),
              name: z.string().max(200),
              quantity: z.number().min(1),
              unitPrice: z.number().min(0),
            }),
          )
          .default([]),
      })
      .refine(
        data => {
          const startTotal =
            parseInt(data.startHour) * 60 + parseInt(data.startMinute);
          const endTotal =
            parseInt(data.endHour) * 60 + parseInt(data.endMinute);
          return endTotal > startTotal;
        },
        {
          message: 'End time must be after start time',
          path: ['endHour'],
        },
      );

    if (!requireCustomerName) {
      return base;
    }

    return base.superRefine((data, ctx) => {
      const n = data.customerName.trim();
      if (!n) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Customer name is required',
          path: ['customerName'],
        });
        return;
      }
      if (n.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Customer name must be at least 2 characters',
          path: ['customerName'],
        });
      }
    });
  }, [requireCustomerName, isMultiSlotMode]);

  return {
    bookingFormSchema,
  };
}

export type BookingFormSchema = z.infer<
  ReturnType<typeof useBookingFormSchema>['bookingFormSchema']
>;
