'use client';

import { useMemo } from 'react';
import { useForm } from '@tanstack/react-form';
import type { Court } from '@/entities/court';
import {
  useBookingFormSchema,
  type BookingGoodLine,
  type CreateBookingDto,
  type UpdateBookingDto,
} from '@/entities/booking';
import { gridColumnToHour } from '@/shared/lib/utils/time-utils';
import {
  estimateCourtRental,
  sumGoodsSubtotal,
} from '@/shared/lib/utils/estimate-court-rental';
import {
  computeDepositAmount,
  type DepositPolicyInput,
} from '@/shared/lib/utils/deposit-policy';
import { CourtSelector } from './court-selector';
import { EnhancedTimeInputs } from './enhanced-time-inputs';
import {
  AdditionalServicesSection,
  toGoodsPayload,
  type GoodLineForm,
} from './additional-services-section';
import { Input } from '@/shared/ui/input';
import { Field, FieldLabel, FieldError } from '@/shared/ui/field';
import { cn } from '@/shared/lib/utils';
import { useLocale, useTranslations } from 'next-intl';

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
    bookingId?: string;
    startMinute?: string;
    endHour?: number;
    endMinute?: string;
    status?: 'pending' | 'confirmed' | 'cancelled' | 'maintenance';
    statusPayment?: 'paid' | 'unpaid';
    totalPrice?: number;
    details?: Array<{ courtId: string; slotIndex: number }>;
    goods?: BookingGoodLine[];
  };
  isEditMode?: boolean;
  onSubmit: (data: CreateBookingDto | UpdateBookingDto) => Promise<void>;
  isLoading: boolean;
  depositPolicy?: DepositPolicyInput | null;
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
  depositPolicy = null,
}: BookingFormProps) {
  const tCommon = useTranslations('Common');
  const tBookingForm = useTranslations('BookingForm');
  const locale = useLocale();
  const isMultiSlotMode =
    !isEditMode &&
    !!initialData?.details?.length;
  const { bookingFormSchema } = useBookingFormSchema(isOwnerRole, isMultiSlotMode);

  const editBaselineCourtRental = useMemo(() => {
    if (!isEditMode || initialData?.totalPrice === undefined) return null;
    const rawGoods = initialData?.goods ?? [];
    const goodsPortion = rawGoods.reduce((s, g) => s + g.quantity * g.unitPrice, 0);
    return Math.max(0, initialData.totalPrice - goodsPortion);
  }, [isEditMode, initialData?.totalPrice, initialData?.goods]);

  const initialGoodsRows: GoodLineForm[] = useMemo(() => {
    const g = initialData?.goods;
    if (!g?.length) return [];
    return g.map((line) => ({
      id: crypto.randomUUID(),
      ...(line.productId ? { productId: line.productId } : {}),
      name: line.name,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
    }));
  }, [initialData?.bookingId, initialData?.goods]);

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
      goods: initialGoodsRows,
    },
    validators: {
      // Zod Standard Schema input widens keys that use `.default()`; form values always match at runtime.
      onChange: bookingFormSchema as never,
      onSubmit: bookingFormSchema as never,
    },
    onSubmitInvalid: ({ formApi }) => {
      const touch = (name: 'bookingTitle' | 'startHour' | 'startMinute' | 'endHour' | 'endMinute' | 'customerName' | 'courtId') => {
        formApi.setFieldMeta(name, (prev) => ({ ...prev, isTouched: true }));
      };
      touch('bookingTitle');
      touch('startHour');
      touch('startMinute');
      touch('endHour');
      touch('endMinute');
      if (isOwnerRole) touch('customerName');
      if (!isMultiSlotMode) touch('courtId');
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

        const goodsPayload = isOwnerRole ? toGoodsPayload(value.goods as GoodLineForm[]) : [];
        const courtRentAmount =
          isOwnerRole && isEditMode && editBaselineCourtRental !== null
            ? editBaselineCourtRental
            : isOwnerRole
              ? estimateCourtRental({
                  courts,
                  isMultiSlotMode,
                  initialDetails: initialData?.details,
                  courtId: value.courtId,
                  startHour: value.startHour,
                  startMinute: value.startMinute,
                  endHour: value.endHour,
                  endMinute: value.endMinute,
                })
              : 0;
        const goodsSubtotalAmount = isOwnerRole ? sumGoodsSubtotal(goodsPayload) : 0;
        const combinedTotal = isOwnerRole ? courtRentAmount + goodsSubtotalAmount : 0;

        // Different DTO based on edit mode
        if (isEditMode) {
          // Update booking - owner can adjust status/payment/price; user uses defaults
          const updateDto: UpdateBookingDto = {
            bookingTitle: value.bookingTitle,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            note: value.note || undefined,
            ...(isOwnerRole && {
              totalPrice: combinedTotal,
              status: value.status,
              statusPayment: value.statusPayment,
              goods: goodsPayload.length ? goodsPayload : [],
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
              totalPrice: combinedTotal,
              ...(goodsPayload.length ? { goods: goodsPayload } : {}),
            }),
          };
          await onSubmit(createDto);
        }
      } catch (err) {
        console.error('Form submission error:', err);
        throw err;
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
              (field.state.meta.isTouched ||
                field.form.state.submissionAttempts > 0) &&
              field.state.meta.errors.length > 0;
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

          <p className='text-muted-foreground text-sm'>
            {tBookingForm('pricingMovedToSummary')}
          </p>
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
                  (field.state.meta.isTouched ||
                    field.form.state.submissionAttempts > 0) &&
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
              (field.state.meta.isTouched ||
                field.form.state.submissionAttempts > 0) &&
              field.state.meta.errors.length > 0;
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
                              (startHourField.state.meta.isTouched ||
                                startHourField.form.state.submissionAttempts > 0) &&
                              startHourField.state.meta.errors.length > 0
                                ? String(startHourField.state.meta.errors[0])
                                : undefined
                            }
                            endTimeError={
                              (endHourField.state.meta.isTouched ||
                                endHourField.form.state.submissionAttempts > 0) &&
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

      <form.Subscribe selector={(state) => state.values}>
        {(values) => {
          let courtRentDisplay = 0;
          if (isOwnerRole) {
            courtRentDisplay =
              isEditMode && editBaselineCourtRental !== null
                ? editBaselineCourtRental
                : estimateCourtRental({
                    courts,
                    isMultiSlotMode,
                    initialDetails: initialData?.details,
                    courtId: values.courtId,
                    startHour: values.startHour,
                    startMinute: values.startMinute,
                    endHour: values.endHour,
                    endMinute: values.endMinute,
                  });
          } else if (isMultiSlotMode && initialData?.details?.length) {
            courtRentDisplay = initialData.details.reduce((sum, d) => {
              const court = courts.find((c) => c.id === d.courtId);
              const rate = Number(court?.defaultHourlyRate ?? 0);
              return sum + rate;
            }, 0);
          } else {
            courtRentDisplay = estimateCourtRental({
              courts,
              isMultiSlotMode: false,
              initialDetails: undefined,
              courtId: values.courtId,
              startHour: values.startHour,
              startMinute: values.startMinute,
              endHour: values.endHour,
              endMinute: values.endMinute,
            });
          }

          const goodsPayloadLive = isOwnerRole ? toGoodsPayload(values.goods as GoodLineForm[]) : [];
          const goodsSubtotalDisplay = isOwnerRole ? sumGoodsSubtotal(goodsPayloadLive) : 0;
          const totalDisplay = courtRentDisplay + goodsSubtotalDisplay;

          const depositPreview =
            !isOwnerRole &&
            !isEditMode &&
            depositPolicy?.depositEnabled &&
            totalDisplay > 0
              ? computeDepositAmount(depositPolicy, totalDisplay)
              : null;

          const depositNotice =
            depositPreview && depositPreview.deposit > 0
              ? tBookingForm('depositCommitment', {
                  deposit: new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 2,
                  }).format(depositPreview.deposit),
                  balance: new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 2,
                  }).format(depositPreview.balance),
                  total: new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 2,
                  }).format(totalDisplay),
                })
              : null;

          return (
            <>
              {depositNotice ? (
                <div className="mb-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-950 dark:text-amber-100">
                  {depositNotice}
                </div>
              ) : null}
            <form.Field name='goods'>
              {(goodsField) => (
                <form.Field name='note'>
                  {(noteField) => (
                    <AdditionalServicesSection
                      isOwnerRole={isOwnerRole}
                      goods={goodsField.state.value as GoodLineForm[]}
                      onGoodsChange={goodsField.handleChange}
                      note={noteField.state.value}
                      onNoteChange={noteField.handleChange}
                      isLoading={isLoading}
                      isEditMode={isEditMode}
                      noteError={
                        (noteField.state.meta.isTouched ||
                          noteField.form.state.submissionAttempts > 0) &&
                        noteField.state.meta.errors.length > 0
                          ? String(noteField.state.meta.errors[0])
                          : undefined
                      }
                      courtRental={courtRentDisplay}
                      goodsSubtotal={goodsSubtotalDisplay}
                      totalAmount={totalDisplay}
                      locale={locale}
                      branchId={branchId}
                    />
                  )}
                </form.Field>
              )}
            </form.Field>
            </>
          );
        }}
      </form.Subscribe>
    </form>
  );
}
