'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { useAuthStore } from '@/shared/store';
import { useFeatureAccess } from '../model/use-feature-access';
import { FeatureLockedCta } from './feature-locked-cta';

export function FeatureGate({
  featureKey,
  fallback,
  children,
}: {
  featureKey: string;
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const t = useTranslations('FeatureGate');
  const user = useAuthStore(state => state.user);
  const { hasFeature, isLoading } = useFeatureAccess();

  if (isLoading) {
    return (
      <div className='flex min-h-[240px] items-center justify-center text-sm text-gray-500'>
        {t('checking')}
      </div>
    );
  }

  if (!hasFeature(featureKey)) {
    if (fallback !== undefined) return <>{fallback}</>;
    // Admins always pass hasFeature; only owners get the self-serve unlock CTA.
    if (user?.role === 'owner') return <FeatureLockedCta />;
    return (
      <div className='border-border bg-card rounded-xl border p-6 text-sm text-gray-600'>
        {t('notEnabled')}
      </div>
    );
  }

  return <>{children}</>;
}
