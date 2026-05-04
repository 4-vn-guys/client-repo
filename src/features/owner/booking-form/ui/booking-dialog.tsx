'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { BookingForm } from './booking-form';
import type { Court } from '@/entities/court';
import type {
  BookingGoodLine,
  CreateBookingDto,
  UpdateBookingDto,
} from '@/entities/booking';
import type { DepositPolicyInput } from '@/shared/lib/utils/deposit-policy';
import { useTranslations } from 'next-intl';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branchId: string;
  courts: Court[];
  selectedDate: Date;
  isOwnerRole: boolean;
  initialData?: {
    courtId?: string;
    startHour?: number;
    bookingTitle?: string;
    customerName?: string;
    note?: string;
    bookingId?: string; // For edit mode
    startMinute?: string;
    endHour?: number;
    endMinute?: string;
    status?: 'pending' | 'confirmed' | 'cancelled' | 'maintenance';
    statusPayment?: 'paid' | 'unpaid';
    totalPrice?: number;
    goods?: BookingGoodLine[];
    /** Pre-selected slots from grid multi-select */
    details?: Array<{ courtId: string; slotIndex: number }>;
  };
  onSubmit: (data: CreateBookingDto | UpdateBookingDto) => Promise<void>;
  isLoading: boolean;
  /** When set, players see how much deposit is required for this branch */
  depositPolicy?: DepositPolicyInput | null;
}

export function BookingDialog({
  open,
  onOpenChange,
  branchId,
  courts,
  selectedDate,
  isOwnerRole,
  initialData,
  onSubmit,
  isLoading,
  depositPolicy,
}: BookingDialogProps) {
  const isEditMode = !!initialData?.bookingId;
  const tBookingForm = useTranslations('BookingForm');

  const handleSubmit = async (data: CreateBookingDto | UpdateBookingDto) => {
    await onSubmit(data);
    // Close dialog on success
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[min(90vh,720px)] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl'>
        <div className='shrink-0 border-b px-6 pt-6 pb-4'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-semibold'>
              {isEditMode
                ? tBookingForm('editReservation')
                : tBookingForm('newReservation')}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6'>
          <BookingForm
            key={initialData?.bookingId ?? 'new-reservation'}
            branchId={branchId}
            courts={courts}
            selectedDate={selectedDate}
            isOwnerRole={isOwnerRole}
            initialData={initialData}
            isEditMode={isEditMode}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            depositPolicy={depositPolicy ?? null}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
