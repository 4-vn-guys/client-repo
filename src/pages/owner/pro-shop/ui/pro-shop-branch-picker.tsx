'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchBranches } from '@/entities/venue';
import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ProShopBranchPicker() {
  const t = useTranslations('ProShopPage');
  const { data: branches = [], isLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches,
  });

  return (
    <div className='animate-in fade-in container mx-auto max-w-4xl space-y-8 p-4 pt-8 duration-500'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>
          {t('pickerTitle')}
        </h1>
        <p className='text-muted-foreground mt-2 text-sm'>
          {t('pickerSubtitle')}
        </p>
      </div>

      {isLoading ? (
        <p className='text-muted-foreground text-sm'>{t('loading')}</p>
      ) : branches.length === 0 ? (
        <p className='text-muted-foreground text-sm'>{t('noBranches')}</p>
      ) : (
        <ul className='grid gap-4 sm:grid-cols-2'>
          {branches.map(b => (
            <li key={b.id}>
              <Link
                href={`/owner/${b.id}/pro-shop`}
                className='bg-card hover:border-primary/40 border-border flex flex-col rounded-xl border p-5 shadow-sm transition-colors hover:shadow-md'
              >
                <span className='font-semibold'>{b.name}</span>
                <span className='text-muted-foreground mt-2 flex items-start gap-2 text-sm'>
                  <MapPin className='mt-0.5 size-4 shrink-0' />
                  {b.address}
                </span>
                <span className='text-primary mt-4 text-sm font-medium'>
                  {t('openInventory')} →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
