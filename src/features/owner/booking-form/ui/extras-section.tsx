'use client';

import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { Zap, ShoppingBag, Droplets } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ExtrasData {
  rackets: boolean;
  shoes: boolean;
  water: boolean;
}

interface ExtrasSectionProps {
  extras: ExtrasData;
  note: string;
  onExtrasChange: (extras: ExtrasData) => void;
  onNoteChange: (note: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isEditMode: boolean;
  noteError?: string;
}

export function ExtrasSection({
  extras,
  note,
  onExtrasChange,
  onNoteChange,
  onSubmit,
  isLoading,
  isEditMode,
  noteError,
}: ExtrasSectionProps) {
  const tBookingForm = useTranslations('BookingForm');

  const toggleExtra = (key: keyof ExtrasData) => {
    onExtrasChange({
      ...extras,
      [key]: !extras[key],
    });
  };

  return (
    <div className='space-y-4'>
      <div className='space-y-3'>
        <h3 className='text-sm font-semibold tracking-wide text-violet-600 uppercase'>
          {tBookingForm('extrasAndNotes')}
        </h3>

        {/* Extras */}
        <div className='flex flex-wrap gap-2'>
          <button
            type='button'
            onClick={() => toggleExtra('rackets')}
            className={cn(
              'flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors',
              extras.rackets
                ? 'border-violet-300 bg-violet-50 text-violet-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            )}
          >
            <Zap className='size-4' />
            {tBookingForm('rackets')}
          </button>
          <button
            type='button'
            onClick={() => toggleExtra('shoes')}
            className={cn(
              'flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors',
              extras.shoes
                ? 'border-violet-300 bg-violet-50 text-violet-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            )}
          >
            <ShoppingBag className='size-4' />
            {tBookingForm('shoes')}
          </button>
          <button
            type='button'
            onClick={() => toggleExtra('water')}
            className={cn(
              'flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors',
              extras.water
                ? 'border-violet-300 bg-violet-50 text-violet-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            )}
          >
            <Droplets className='size-4' />
            {tBookingForm('water')}
          </button>
        </div>

        {/* Notes */}
        <div className='space-y-2'>
          <textarea
            value={note}
            onChange={e => onNoteChange(e.target.value)}
            placeholder={tBookingForm('notePlaceholder')}
            rows={3}
            className='w-full resize-none rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-violet-500 focus:outline-none'
          />
          {noteError && <p className='text-destructive text-sm'>{noteError}</p>}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type='submit'
        onClick={onSubmit}
        disabled={isLoading}
        className='w-full bg-violet-600 py-6 text-base font-semibold text-white hover:bg-violet-700'
      >
        {isLoading
          ? isEditMode
            ? tBookingForm('updatingBooking')
            : tBookingForm('creatingBooking')
          : isEditMode
            ? tBookingForm('updateBooking')
            : tBookingForm('createBooking')}
      </Button>
    </div>
  );
}
