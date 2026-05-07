'use client';

import { ReactNode } from 'react';
import { useFeatureAccess } from '../model/use-feature-access';

export function FeatureGate({
  featureKey,
  fallback,
  children,
}: {
  featureKey: string;
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const { hasFeature, isLoading } = useFeatureAccess();

  if (isLoading) {
    return (
      <div className='flex min-h-[240px] items-center justify-center text-sm text-gray-500'>
        Checking feature access...
      </div>
    );
  }

  if (!hasFeature(featureKey)) {
    return (
      fallback ?? (
        <div className='border-border bg-card rounded-xl border p-6 text-sm text-gray-600'>
          This module is not enabled for your owner account yet.
        </div>
      )
    );
  }

  return <>{children}</>;
}
