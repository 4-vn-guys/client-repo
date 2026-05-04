'use client';

import { useMemo } from 'react';
import { TimeInput } from './time-input';
import { Button } from '@/shared/ui/button';
import { useTranslations } from 'next-intl';

interface EnhancedTimeInputsProps {
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
  onStartTimeChange: (hour: string, minute: string) => void;
  onEndTimeChange: (hour: string, minute: string) => void;
  startTimeError?: string;
  endTimeError?: string;
}

const PRESET_DURATIONS = [
  { label: '30min', minutes: 30 },
  { label: '1hr', minutes: 60 },
  { label: '1.5hr', minutes: 90 },
  { label: '2hr', minutes: 120 },
];

export function EnhancedTimeInputs({
  startHour,
  startMinute,
  endHour,
  endMinute,
  onStartTimeChange,
  onEndTimeChange,
  startTimeError,
  endTimeError,
}: EnhancedTimeInputsProps) {
  const tBookingForm = useTranslations('BookingForm');

  // Calculate duration and validate
  const { duration, isValid } = useMemo(() => {
    const startTotal = parseInt(startHour) * 60 + parseInt(startMinute);
    const endTotal = parseInt(endHour) * 60 + parseInt(endMinute);
    const diff = endTotal - startTotal;

    if (diff <= 0) {
      return { duration: '0h', isValid: false };
    }

    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    const durationText = minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;

    return { duration: durationText, isValid: true };
  }, [startHour, startMinute, endHour, endMinute]);

  // Handle preset duration click
  const handlePresetClick = (minutes: number) => {
    const startTotal = parseInt(startHour) * 60 + parseInt(startMinute);
    const endTotal = startTotal + minutes;

    const newEndHour = Math.floor(endTotal / 60);
    const newEndMinute = endTotal % 60;

    // Ensure end hour doesn't exceed 23:45
    if (newEndHour < 24) {
      onEndTimeChange(
        newEndHour.toString().padStart(2, '0'),
        newEndMinute.toString().padStart(2, '0')
      );
    }
  };

  return (
    <div className='space-y-4'>
      {/* Start and End Time Row */}
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='mb-2 block text-base font-medium'>
            {tBookingForm('startTime')}
          </label>
          <TimeInput
            hour={startHour}
            minute={startMinute}
            onHourChange={hour => onStartTimeChange(hour, startMinute)}
            onMinuteChange={minute => onStartTimeChange(startHour, minute)}
            error={startTimeError}
          />
        </div>

        <div>
          <label className='mb-2 block text-base font-medium'>
            {tBookingForm('endTime')}
          </label>
          <TimeInput
            hour={endHour}
            minute={endMinute}
            onHourChange={hour => onEndTimeChange(hour, endMinute)}
            onMinuteChange={minute => onEndTimeChange(endHour, minute)}
            error={endTimeError}
          />
        </div>
      </div>

      {/* Duration Display */}
      <div className='flex items-center justify-between rounded-lg border border-violet-200 bg-violet-50 p-3 dark:border-violet-800 dark:bg-violet-950'>
        <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          {tBookingForm('duration')}
        </span>
        <span
          className={`text-lg font-semibold ${
            isValid
              ? 'text-violet-600 dark:text-violet-400'
              : 'text-destructive'
          }`}
        >
          {duration}
        </span>
      </div>

      {/* Preset Duration Buttons */}
      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
          {tBookingForm('quickSelectDuration')}
        </label>
        <div className='flex flex-wrap gap-2'>
          {PRESET_DURATIONS.map(preset => (
            <Button
              key={preset.label}
              type='button'
              variant='outline'
              size='sm'
              onClick={() => handlePresetClick(preset.minutes)}
              className='text-xs hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700'
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Validation Message (avoid duplicating Zod message shown on end time) */}
      {!isValid && !endTimeError && (
        <p className='text-destructive text-sm'>
          {tBookingForm('endTimeAfterStart')}
        </p>
      )}
    </div>
  );
}
