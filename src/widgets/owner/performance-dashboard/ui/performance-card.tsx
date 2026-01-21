import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib';

interface PerformanceCardProps {
  title: string;
  value: string | number;
  rating: 'good' | 'needs-improvement' | 'poor';
  description?: string;
  unit?: string;
}

const ratingColors = {
  good: 'text-green-500',
  'needs-improvement': 'text-yellow-500',
  poor: 'text-red-500',
};

const ratingBgColors = {
  good: 'bg-green-500/10',
  'needs-improvement': 'bg-yellow-500/10',
  poor: 'bg-red-500/10',
};

export function PerformanceCard({
  title,
  value,
  rating,
  description,
  unit = 'ms',
}: PerformanceCardProps) {
  const displayValue = typeof value === 'number' ? value.toFixed(2) : value;

  return (
    <Card
      className={cn('transition-all hover:shadow-lg', ratingBgColors[rating])}
    >
      <CardHeader className='pb-3'>
        <CardTitle className='text-muted-foreground text-sm font-medium'>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          <div className='flex items-baseline gap-2'>
            <span className={cn('text-3xl font-bold', ratingColors[rating])}>
              {displayValue}
            </span>
            {unit && (
              <span className='text-muted-foreground text-sm'>{unit}</span>
            )}
          </div>
          {description && (
            <p className='text-muted-foreground text-xs'>{description}</p>
          )}
          <div className='flex items-center gap-2'>
            <div
              className={cn(
                'h-2 w-2 rounded-full',
                rating === 'good' && 'bg-green-500',
                rating === 'needs-improvement' && 'bg-yellow-500',
                rating === 'poor' && 'bg-red-500'
              )}
            />
            <span className='text-xs capitalize'>
              {rating.replace('-', ' ')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
