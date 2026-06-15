'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { MatchList, MyMatchesList, TournamentList } from '@/features/events';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Button } from '@/shared/ui/button';

type EventsTab = 'tournaments' | 'matches';

export function EventsPage() {
  const t = useTranslations('EventsPage');
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState<EventsTab>('tournaments');

  if (!isAuthenticated) {
    return (
      <div className='mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8'>
        <p className='text-muted-foreground text-sm'>{t('loginRequired')}</p>
        <Link href='/login' className='mt-4 inline-block'>
          <Button>{t('loginCta')}</Button>
        </Link>
      </div>
    );
  }

  const tabs: { key: EventsTab; label: string }[] = [
    { key: 'tournaments', label: t('tabsTournaments') },
    { key: 'matches', label: t('tabsMatches') },
  ];

  return (
    <div className='mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold tracking-tight'>{t('title')}</h1>
        <p className='text-muted-foreground mt-1 text-sm'>{t('subtitle')}</p>
      </div>

      <div className='mb-6 inline-flex gap-1 rounded-lg border p-1'>
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type='button'
            onClick={() => setTab(key)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'tournaments' ? (
        <TournamentList />
      ) : (
        <div className='space-y-10'>
          <section>
            <h2 className='mb-4 text-lg font-semibold'>
              {t('matchesOpenTitle')}
            </h2>
            <MatchList />
          </section>
          <section>
            <h2 className='mb-4 text-lg font-semibold'>
              {t('myMatchesTitle')}
            </h2>
            <MyMatchesList />
          </section>
        </div>
      )}
    </div>
  );
}
