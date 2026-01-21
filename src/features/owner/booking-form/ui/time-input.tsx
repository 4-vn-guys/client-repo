'use client';

interface TimeInputProps {
  hour: string;
  minute: string;
  onHourChange: (hour: string) => void;
  onMinuteChange: (minute: string) => void;
  error?: string;
}

export function TimeInput({
  hour,
  minute,
  onHourChange,
  onMinuteChange,
  error,
}: TimeInputProps) {
  // Generate hour options (00-23)
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0')
  );

  // Generate minute options in 15-minute intervals
  const minutes = ['00', '15', '30', '45'];

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2'>
        {/* Hour Select */}
        <select
          value={hour}
          onChange={e => onHourChange(e.target.value)}
          className='flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-violet-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800'
        >
          {hours.map(h => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        <span className='text-lg font-semibold text-gray-500'>:</span>

        {/* Minute Select */}
        <select
          value={minute}
          onChange={e => onMinuteChange(e.target.value)}
          className='flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-violet-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800'
        >
          {minutes.map(m => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Display selected time */}
      <div className='text-center text-sm font-medium text-violet-600 dark:text-violet-400'>
        {hour}:{minute}
      </div>

      {error && <p className='text-destructive text-sm'>{error}</p>}
    </div>
  );
}
