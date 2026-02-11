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

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courts: Court[];
  selectedDate: Date;
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
    statusPayment?: 'unpaid' | 'paid' | 'refunded';
    totalPrice?: number;
  };
  onSubmit: (data: CreateBookingDto | UpdateBookingDto) => Promise<void>;
  isLoading: boolean;
}

export function BookingDialog({
  open,
  onOpenChange,
  courts,
  selectedDate,
  initialData,
  onSubmit,
  isLoading,
}: BookingDialogProps) {
  const isEditMode = !!initialData?.bookingId;

  const handleSubmit = async (data: CreateBookingDto) => {
    await onSubmit(data);
    // Close dialog on success
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-semibold'>
            {isEditMode ? 'Edit Reservation' : 'New Reservation'}
          </DialogTitle>
        </DialogHeader>

        <BookingForm
          courts={courts}
          selectedDate={selectedDate}
          initialData={initialData}
          isEditMode={isEditMode}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
