'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { CalendarClock, MapPin, Users } from 'lucide-react';

import type { Match, MatchLevel } from '@/entities/match';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date.toLocaleString();
}

export function MatchCard({
  match,
  action,
}: {
  match: Match;
  action?: ReactNode;
}) {
  const t = useTranslations('EventsPage');
  const starts = formatDate(match.startsAt);

  const levelLabel: Record<MatchLevel, string> = {
    beginner: t('levelBeginner'),
    intermediate: t('levelIntermediate'),
    pro: t('levelPro'),
  };

  const isFull = match.spotsOpen <= 0 || match.status === 'full';

  return (
    <Card className='flex flex-col'>
      <CardContent className='flex flex-1 flex-col gap-3 p-5'>
        <div className='flex items-start justify-between gap-2'>
          <span className='min-w-0 flex-1 truncate font-semibold'>
            {match.title}
          </span>
          <Badge variant='secondary' className='capitalize'>
            {levelLabel[match.level]}
          </Badge>
        </div>

        {match.branchName && (
          <div className='text-muted-foreground flex items-center gap-1 text-xs'>
            <MapPin className='size-3' />
            <span className='truncate'>
              {match.branchName}
              {match.courtName ? ` · ${match.courtName}` : ''}
            </span>
          </div>
        )}

        {starts && (
          <div className='text-muted-foreground flex items-center gap-1 text-xs'>
            <CalendarClock className='size-3' />
            <span>{starts}</span>
          </div>
        )}

        <div className='text-muted-foreground flex items-center gap-1 text-xs'>
          <Users className='size-3' />
          <span>
            {isFull
              ? t('full')
              : t('spots', { open: match.spotsOpen, capacity: match.capacity })}
          </span>
        </div>

        <div className='text-muted-foreground text-xs'>
          {t('hostedBy', { name: match.hostName })}
        </div>

        {match.note && (
          <p className='text-muted-foreground text-xs'>{match.note}</p>
        )}

        {action && <div className='mt-auto pt-2'>{action}</div>}
      </CardContent>
    </Card>
  );
}
