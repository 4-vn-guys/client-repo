'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/shared/ui/button';

export function FeatureLockedCta() {
  const t = useTranslations('FeatureGate');

  return (
    <div className='border-border bg-card flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-xl border p-8 text-center'>
      <div className='bg-muted flex size-12 items-center justify-center rounded-full'>
        <Lock className='text-muted-foreground size-5' />
      </div>
      <p className='text-sm font-bold'>{t('lockedTitle')}</p>
      <p className='text-muted-foreground max-w-sm text-sm'>
        {t('lockedDescription')}
      </p>
      <Button asChild size='sm'>
        <Link href='/owner/modules'>{t('unlockCta')}</Link>
      </Button>
    </div>
  );
}
