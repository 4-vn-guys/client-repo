'use client';

import { useForm } from '@tanstack/react-form';
import type { Court } from '@/entities/court';
import {
  useBookingFormSchema,
  type CreateBookingDto,
  type UpdateBookingDto,
} from '@/entities/booking';
import { gridColumnToHour } from '@/shared/lib/utils/time-utils';
import { CourtSelector } from './court-selector';
import { EnhancedTimeInputs } from './enhanced-time-inputs';
import { ExtrasSection } from './extras-section';
import { Input } from '@/shared/ui/input';
import { Field, FieldLabel, FieldError } from '@/shared/ui/field';
import { cn } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';

interface BookingFormProps {
  branchId: string;
  courts: Court[];
  selectedDate: Date;
  isOwnerRole: boolean; // When true, include userName (owner books on behalf). When false, omit (backend uses auth).
  initialData?: {
    courtId?: string;
    startHour?: number;
    bookingTitle?: string;
    customerName?: string;
    note?: string;
    startMinute?: string;
    endHour?: number;
    endMinute?: string;
    status?: 'pending' | 'confirmed' | 'cancelled' | 'maintenance';
    statusPayment?: 'paid' | 'unpaid';
    totalPrice?: number;
    details?: Array<{ courtId: string; slotIndex: number }>;
  };
  isEditMode?: boolean;
  onSubmit: (data: CreateBookingDto | UpdateBookingDto) => Promise<void>;
  isLoading: boolean;
}

export function BookingForm({
  branchId,
  courts,
  selectedDate,
  isOwnerRole,
  initialData,
  isEditMode = false,
  onSubmit,
  isLoading,
}: BookingFormProps) {
  const tCommon = useTranslations('Common');
  const tBookingForm = useTranslations('BookingForm');
  const isMultiSlotMode =
    !isEditMode &&
    !!initialData?.details?.length;
  const { bookingFormSchema } = useBookingFormSchema(isOwnerRole, isMultiSlotMode);

  const form = useForm({
    defaultValues: {
      courtId: initialData?.courtId,
      bookingTitle: initialData?.bookingTitle || '',
      customerName: initialData?.customerName || '',
      type: 'walk-in' as 'walk-in' | 'reservation',
      status: (initialData?.status || 'pending') as 'pending' | 'confirmed' | 'cancelled' | 'maintenance',
      statusPayment: (initialData?.statusPayment || 'unpaid') as 'paid' | 'unpaid',
      totalPrice: initialData?.totalPrice || 0,
      startHour: initialData?.startHour?.toString().padStart(2, '0') || '14',
      startMinute: initialData?.startMinute || '00',
      endHour: initialData?.endHour?.toString().padStart(2, '0') || '16',
      endMinute: initialData?.endMinute || '00',
      note: initialData?.note || '',
      extras: {
        rackets: false,
        shoes: false,
        water: false,
      },
    },
    validators: {
      onChange: ({ value }) => {
        const result = bookingFormSchema.safeParse(value);
        if (result.success) return undefined;
        const msg =
          result.error.issues[0]?.message ??
          tBookingForm('validationFailed');
        return msg;
      },
    },
    onSubmit: async ({ value }) => {
      try {
        // Convert form data to API DTO
        const startDateTime = new Date(selectedDate);
        startDateTime.setHours(
          parseInt(value.startHour),
          parseInt(value.startMinute),
          0,
          0
        );

        const endDateTime = new Date(selectedDate);
        endDateTime.setHours(
          parseInt(value.endHour),
          parseInt(value.endMinute),
          0,
          0
        );

        // Different DTO based on edit mode
        if (isEditMode) {
          // Update booking - owner can adjust status/payment/price; user uses defaults
          const updateDto: UpdateBookingDto = {
            bookingTitle: value.bookingTitle,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            note: value.note || undefined,
            ...(isOwnerRole && {
              totalPrice: value.totalPrice,
              status: value.status,
              statusPayment: value.statusPayment,
            }),
          };
          await onSubmit(updateDto);
        } else {
          // Create booking - new API shape with details array
          const details: { courtId: string; startTime: string; endTime: string }[] =
            isMultiSlotMode && initialData?.details?.length
              ? initialData.details.map(({ courtId, slotIndex }) => {
                const startHour = gridColumnToHour(slotIndex);
                const startDt = new Date(selectedDate);
                startDt.setHours(startHour, 0, 0, 0);
                const endDt = new Date(selectedDate);
                endDt.setHours(startHour + 1, 0, 0, 0);
                return {
                  courtId,
                  startTime: startDt.toISOString(),
                  endTime: endDt.toISOString(),
                };
              })
              : value.courtId
                ? [
                    {
                      courtId: value.courtId,
                      startTime: startDateTime.toISOString(),
                      endTime: endDateTime.toISOString(),
                    },
                  ]
                : [];

          if (details.length === 0) {
            console.error('Cannot create booking: no court/time selected');
            return;
          }

          const createDto: CreateBookingDto = {
            branchId,
            bookingTitle: value.bookingTitle,
            ...(isOwnerRole && value.customerName
              ? { userName: value.customerName }
              : {}),
            note: value.note || undefined,
            details: details || [],
            ...(isOwnerRole && {
              status: value.status,
              statusPayment: value.statusPayment,
              totalPrice: value.totalPrice,
            }),
          };
          await onSubmit(createDto);
        }
      } catch (err) {
        console.error('Form submission error:', err);
      }
    },
  });

  return (
    <form
      className='space-y-6'
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {/* Customer Name - only when owner (booking on behalf of customer) */}
      {isOwnerRole && (
        <form.Field name='customerName'>
          {field => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  {tBookingForm('customerName')}
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  placeholder={tBookingForm('customerNamePlaceholder')}
                  className={cn(hasError && 'border-destructive')}
                />
                <div className='mt-1 min-h-5'>
                  {hasError && (
                    <FieldError
                      errors={
                        [...(field.state.meta.errors ?? [])].map(e => ({
                          message:
                            (typeof e === 'string'
                              ? e
                              : (e as unknown as { message?: string }).message) ||
                            tCommon('error'),
                        })) as Array<{ message?: string }>
                      }
                    />
                  )}
                </div>
              </Field>
            );
          }}
        </form.Field>
      )}

      {/* Status, Payment & Price - only for owner (e.g. customer called & paid, owner records it) */}
      {isOwnerRole && (
        <>
          <div className='grid grid-cols-2 gap-4'>
            <form.Field name='status'>
              {field => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    {tBookingForm('bookingStatus')}
                  </FieldLabel>
                  <select
                    id={field.name}
                    value={field.state.value}
                    onChange={e =>
                      field.handleChange(
                        e.target.value as 'pending' | 'confirmed' | 'cancelled' | 'maintenance'
                      )
                    }
                    className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:outline-none'
                  >
                    <option value='pending'>{tBookingForm('pending')}</option>
                    <option value='confirmed'>
                      {tBookingForm('confirmed')}
                    </option>
                    <option value='cancelled'>
                      {tBookingForm('cancelled')}
                    </option>
                    <option value='maintenance'>
                      {tBookingForm('maintenance')}
                    </option>
                  </select>
                </Field>
              )}
            </form.Field>

            <form.Field name='statusPayment'>
              {field => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    {tBookingForm('paymentStatus')}
                  </FieldLabel>
                  <select
                    id={field.name}
                    value={field.state.value}
                    onChange={e =>
                      field.handleChange(
                        e.target.value as 'paid' | 'unpaid'
                      )
                    }
                    className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:outline-none'
                  >
                    <option value='unpaid'>{tBookingForm('unpaid')}</option>
                    <option value='paid'>{tBookingForm('paid')}</option>
                  </select>
                </Field>
              )}
            </form.Field>
          </div>

          <form.Field name='totalPrice'>
            {field => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  {tBookingForm('totalPrice')}
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type='number'
                  min='0'
                  step='0.01'
                  value={field.state.value}
                  onChange={e => field.handleChange(parseFloat(e.target.value) || 0)}
                  placeholder={tBookingForm('totalPricePlaceholder')}
                />
              </Field>
            )}
          </form.Field>
        </>
      )}

      {/* Court & Time Section */}
      <div className='space-y-4 border-t pt-6'>
        <h3 className='text-sm font-semibold tracking-wide text-violet-600 uppercase'>
          {tBookingForm('courtAndTime')}
        </h3>

        {isMultiSlotMode ? (
          /* Multi-select from grid: show read-only summary */
          <div className='rounded-md border bg-muted/30 p-3'>
            <p className='mb-2 text-sm font-medium text-muted-foreground'>
              {tBookingForm('selectedSlots')}
            </p>
            <ul className='space-y-1 text-sm'>
              {initialData?.details?.map(({ courtId, slotIndex }) => {
                const court = courts.find((c) => c.id === courtId);
                const startHour = gridColumnToHour(slotIndex);
                const startStr = `${startHour.toString().padStart(2, '0')}:00`;
                const endStr = `${(startHour + 1).toString().padStart(2, '0')}:00`;
                return (
                  <li key={`${courtId}-${slotIndex}`}>
                    {court?.name ?? courtId} — {startStr}–{endStr}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          /* Single slot: court selector */
          <form.Field name='courtId'>
            {field => (
              <CourtSelector
                courts={courts}
                selectedCourtId={field.state.value ?? ''}
                onSelectCourt={field.handleChange}
                error={
                  field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                    ? String(field.state.meta.errors[0])
                    : undefined
                }
              />
            )}
          </form.Field>
        )}

        {/* Booking Title */}
        <form.Field name='bookingTitle'>
          {field => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  {tBookingForm('bookingTitle')}
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  placeholder={tBookingForm('bookingTitlePlaceholder')}
                  className={cn(hasError && 'border-destructive')}
                />
                <div className='mt-1 min-h-5'>
                  {hasError && (
                    <FieldError
                      errors={
                        [...(field.state.meta.errors ?? [])].map(e => ({
                          message:
                            (typeof e === 'string'
                              ? e
                              : (e as unknown as { message?: string }).message) ||
                            tCommon('error'),
                        })) as Array<{ message?: string }>
                      }
                    />
                  )}
                </div>
              </Field>
            );
          }}
        </form.Field>

        {/* Enhanced Time Inputs - only for single-slot mode */}
        {!isMultiSlotMode && (
          <form.Field name='startHour'>
            {startHourField => (
              <form.Field name='startMinute'>
                {startMinuteField => (
                  <form.Field name='endHour'>
                    {endHourField => (
                      <form.Field name='endMinute'>
                        {endMinuteField => (
                          <EnhancedTimeInputs
                            startHour={startHourField.state.value}
                            startMinute={startMinuteField.state.value}
                            endHour={endHourField.state.value}
                            endMinute={endMinuteField.state.value}
                            onStartTimeChange={(hour, minute) => {
                              startHourField.handleChange(hour);
                              startMinuteField.handleChange(minute);
                            }}
                            onEndTimeChange={(hour, minute) => {
                              endHourField.handleChange(hour);
                              endMinuteField.handleChange(minute);
                            }}
                            startTimeError={
                              startHourField.state.meta.isTouched &&
                                startHourField.state.meta.errors.length > 0
                                ? String(startHourField.state.meta.errors[0])
                                : undefined
                            }
                            endTimeError={
                              endHourField.state.meta.isTouched &&
                                endHourField.state.meta.errors.length > 0
                                ? String(endHourField.state.meta.errors[0])
                                : undefined
                            }
                          />
                        )}
                      </form.Field>
                    )}
                  </form.Field>
                )}
              </form.Field>
            )}
          </form.Field>
        )}
      </div>

      {/* Extras Section */}
      <form.Field name='extras'>
        {extrasField => (
          <form.Field name='note'>
            {noteField => (
              <ExtrasSection
                extras={extrasField.state.value}
                note={noteField.state.value}
                onExtrasChange={extrasField.handleChange}
                onNoteChange={noteField.handleChange}
                onSubmit={() => form.handleSubmit()}
                isLoading={isLoading}
                isEditMode={isEditMode}
                noteError={
                  noteField.state.meta.isTouched &&
                    noteField.state.meta.errors.length > 0
                    ? String(noteField.state.meta.errors[0])
                    : undefined
                }
              />
            )}
          </form.Field>
        )}
      </form.Field>
    </form>
  );
}
