import { cn } from '@/shared/lib/utils';
import { courtTypeColors, type CourtType } from '@/shared/config/court-types';

interface CourtLabelProps {
  name: string;
  type: CourtType;
  className?: string;
}

export function CourtLabel({ name, type, className }: CourtLabelProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <span className='text-foreground text-sm font-medium'>{name}</span>
      <span className={cn('text-xs capitalize', courtTypeColors[type])}>
        {type}
      </span>
    </div>
  );
}
