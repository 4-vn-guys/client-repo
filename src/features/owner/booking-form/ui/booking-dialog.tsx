'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { BookingForm } from './booking-form';
import type { Court } from '@/entities/court';
import type { CreateBookingDto, UpdateBookingDto } from '@/entities/booking';
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
    /** Pre-selected slots from grid multi-select */
    details?: Array<{ courtId: string; slotIndex: number }>;
  };
  onSubmit: (data: CreateBookingDto | UpdateBookingDto) => Promise<void>;
  isLoading: boolean;
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
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-semibold'>
            {isEditMode
              ? tBookingForm('editReservation')
              : tBookingForm('newReservation')}
          </DialogTitle>
        </DialogHeader>

        <BookingForm
          branchId={branchId}
          courts={courts}
          selectedDate={selectedDate}
          isOwnerRole={isOwnerRole}
          initialData={initialData}
          isEditMode={isEditMode}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
