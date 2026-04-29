'use client';

import { WebVitalsSection } from './web-vitals-section';
import { BundleAnalysisSection } from './bundle-analysis-section';
import { Separator } from '@/shared/ui/separator';
import { Gauge } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function PerformanceDashboard() {
  const tPerformance = useTranslations('OwnerPerformancePage');

  return (
    <div className='space-y-8'>
      <div className='space-y-2'>
        <div className='flex items-center gap-3'>
          <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg'>
            <Gauge className='text-primary h-6 w-6' />
          </div>
          <div>
            <h1 className='text-3xl font-bold'>{tPerformance('title')}</h1>
            <p className='text-muted-foreground'>
              {tPerformance('description')}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <WebVitalsSection />

      <Separator />

      <BundleAnalysisSection />

      <div className='bg-muted/30 border-border/50 mt-8 rounded-lg border p-4'>
        <h3 className='mb-2 flex items-center gap-2 font-semibold'>
          <Gauge className='h-4 w-4' />
          {tPerformance('aboutTitle')}
        </h3>
        <p className='text-muted-foreground text-sm'>
          {tPerformance('aboutDescription')}
        </p>
      </div>
    </div>
  );
}
