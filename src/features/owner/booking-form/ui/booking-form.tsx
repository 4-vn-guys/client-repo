'use client';

import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import type { Court } from '@/entities/court';
import {
  useBookingFormSchema,
  type CreateBookingDto,
  type UpdateBookingDto,
} from '@/entities/booking';
import { CourtSelector } from './court-selector';
import { EnhancedTimeInputs } from './enhanced-time-inputs';
import { ExtrasSection } from './extras-section';
import { Input } from '@/shared/ui/input';
import { Field, FieldLabel, FieldError } from '@/shared/ui/field';
import { cn } from '@/shared/lib/utils';

interface BookingFormProps {
  courts: Court[];
  selectedDate: Date;
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
    statusPayment?: 'unpaid' | 'paid' | 'refunded';
    totalPrice?: number;
  };
  isEditMode?: boolean;
  onSubmit: (data: CreateBookingDto | UpdateBookingDto) => Promise<void>;
  isLoading: boolean;
}

export function BookingForm({
  courts,
  selectedDate,
  initialData,
  isEditMode = false,
  onSubmit,
  isLoading,
}: BookingFormProps) {
  const { bookingFormSchema } = useBookingFormSchema();

  const form = useForm({
    defaultValues: {
      courtId: initialData?.courtId || '',
      bookingTitle: initialData?.bookingTitle || '',
      customerName: initialData?.customerName || '',
      type: 'walk-in' as 'walk-in' | 'reservation',
      status: (initialData?.status || 'pending') as 'pending' | 'confirmed' | 'cancelled' | 'maintenance',
      statusPayment: (initialData?.statusPayment || 'unpaid') as 'unpaid' | 'paid' | 'refunded',
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
    validatorAdapter: zodValidator(),
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
          // Update booking - can include status, payment, and price fields
          const updateDto: UpdateBookingDto = {
            bookingTitle: value.bookingTitle,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            totalPrice: value.totalPrice,
            note: value.note || undefined,
            status: value.status,
            statusPayment: value.statusPayment,
          };
          await onSubmit(updateDto);
        } else {
          // Create booking - only core fields
          const createDto: CreateBookingDto = {
            courtId: value.courtId,
            bookingTitle: value.bookingTitle,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            note: value.note || undefined,
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
      {/* Customer Name */}
      <form.Field
        name='customerName'
        validators={{
          onChange: bookingFormSchema.shape.customerName,
        }}
      >
        {field => {
          const hasError =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;
          return (
            <Field>
              <FieldLabel htmlFor={field.name}>Customer Name</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                placeholder='Search or enter name...'
                className={cn(hasError && 'border-destructive')}
              />
              <div className='mt-1 min-h-5'>
                {hasError && (
                  <FieldError errors={field.state.meta.errors as string[]} />
                )}
              </div>
            </Field>
          );
        }}
      </form.Field>

      {/* Status Fields */}
      <div className='grid grid-cols-2 gap-4'>
        <form.Field name='status'>
          {field => (
            <Field>
              <FieldLabel htmlFor={field.name}>Booking Status</FieldLabel>
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
                <option value='pending'>Pending</option>
                <option value='confirmed'>Confirmed</option>
                <option value='cancelled'>Cancelled</option>
                <option value='maintenance'>Maintenance</option>
              </select>
            </Field>
          )}
        </form.Field>

        <form.Field name='statusPayment'>
          {field => (
            <Field>
              <FieldLabel htmlFor={field.name}>Payment Status</FieldLabel>
              <select
                id={field.name}
                value={field.state.value}
                onChange={e =>
                  field.handleChange(
                    e.target.value as 'unpaid' | 'paid' | 'refunded'
                  )
                }
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:outline-none'
              >
                <option value='unpaid'>Unpaid</option>
                <option value='paid'>Paid</option>
                <option value='refunded'>Refunded</option>
              </select>
            </Field>
          )}
        </form.Field>
      </div>

      {/* Total Price */}
      <form.Field name='totalPrice'>
        {field => (
          <Field>
            <FieldLabel htmlFor={field.name}>Total Price</FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              type='number'
              min='0'
              step='0.01'
              value={field.state.value}
              onChange={e => field.handleChange(parseFloat(e.target.value) || 0)}
              placeholder='Enter total price...'
            />
          </Field>
        )}
      </form.Field>

      {/* Court & Time Section */}
      <div className='space-y-4 border-t pt-6'>
        <h3 className='text-sm font-semibold tracking-wide text-violet-600 uppercase'>
          Court & Time
        </h3>

        {/* Court Selector */}
        <form.Field
          name='courtId'
          validators={{
            onChange: bookingFormSchema.shape.courtId,
          }}
        >
          {field => (
            <CourtSelector
              courts={courts}
              selectedCourtId={field.state.value}
              onSelectCourt={field.handleChange}
              error={
                field.state.meta.isTouched && field.state.meta.errors.length > 0
                  ? String(field.state.meta.errors[0])
                  : undefined
              }
            />
          )}
        </form.Field>

        {/* Booking Title */}
        <form.Field
          name='bookingTitle'
          validators={{
            onChange: bookingFormSchema.shape.bookingTitle,
          }}
        >
          {field => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Booking Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  placeholder='Enter booking description...'
                  className={cn(hasError && 'border-destructive')}
                />
                <div className='mt-1 min-h-5'>
                  {hasError && (
                    <FieldError errors={field.state.meta.errors as string[]} />
                  )}
                </div>
              </Field>
            );
          }}
        </form.Field>

        {/* Enhanced Time Inputs */}
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
      </div>

      {/* Extras Section */}
      <form.Field name='extras'>
        {extrasField => (
          <form.Field
            name='note'
            validators={{
              onChange: bookingFormSchema.shape.note,
            }}
          >
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
