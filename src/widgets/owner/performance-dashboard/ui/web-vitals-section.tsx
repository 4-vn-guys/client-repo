'use client';

import { useWebVitals } from '@/shared/lib/performance';
import { PerformanceCard } from './performance-card';
import { Activity, Zap, Eye, Clock, Network } from 'lucide-react';
import { useTranslations } from 'next-intl';

const metricInfo = {
  CLS: {
    nameKey: 'clsName',
    descriptionKey: 'clsDescription',
    icon: Activity,
    unit: '',
  },
  INP: {
    nameKey: 'inpName',
    descriptionKey: 'inpDescription',
    icon: Zap,
    unit: 'ms',
  },
  FCP: {
    nameKey: 'fcpName',
    descriptionKey: 'fcpDescription',
    icon: Eye,
    unit: 'ms',
  },
  LCP: {
    nameKey: 'lcpName',
    descriptionKey: 'lcpDescription',
    icon: Clock,
    unit: 'ms',
  },
  TTFB: {
    nameKey: 'ttfbName',
    descriptionKey: 'ttfbDescription',
    icon: Network,
    unit: 'ms',
  },
};

export function WebVitalsSection() {
  const { detailedMetrics } = useWebVitals();
  const tPerformance = useTranslations('OwnerPerformancePage');

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Zap className='text-primary h-5 w-5' />
        <h2 className='text-2xl font-bold'>
          {tPerformance('coreWebVitals')}
        </h2>
      </div>
      <p className='text-muted-foreground text-sm'>
        {tPerformance('webVitalsDescription')}
      </p>

      {detailedMetrics.length === 0 ? (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {Object.entries(metricInfo).map(([key, info]) => (
            <PerformanceCard
              key={key}
              title={tPerformance(info.nameKey)}
              value={tPerformance('measuring')}
              rating='good'
              description={tPerformance(info.descriptionKey)}
              unit=''
            />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {detailedMetrics.map(metric => {
            const info = metricInfo[metric.name as keyof typeof metricInfo];
            return (
              <PerformanceCard
                key={metric.name}
                title={tPerformance(info.nameKey)}
                value={metric.value}
                rating={metric.rating}
                description={tPerformance(info.descriptionKey)}
                unit={info.unit}
              />
            );
          })}
        </div>
      )}

      <div className='bg-muted/50 mt-6 rounded-lg p-4'>
        <h3 className='mb-2 font-semibold'>
          {tPerformance('metricThresholds')}
        </h3>
        <ul className='text-muted-foreground space-y-1 text-sm'>
          <li>
            • CLS: &lt;0.1 ({tPerformance('good')}), 0.1-0.25 (
            {tPerformance('needsImprovement')}), &gt;0.25 (
            {tPerformance('poor')})
          </li>
          <li>
            • INP: &lt;200ms ({tPerformance('good')}), 200-500ms (
            {tPerformance('needsImprovement')}), &gt;500ms (
            {tPerformance('poor')})
          </li>
          <li>
            • FCP: &lt;1.8s ({tPerformance('good')}), 1.8-3s (
            {tPerformance('needsImprovement')}), &gt;3s (
            {tPerformance('poor')})
          </li>
          <li>
            • LCP: &lt;2.5s ({tPerformance('good')}), 2.5-4s (
            {tPerformance('needsImprovement')}), &gt;4s (
            {tPerformance('poor')})
          </li>
          <li>
            • TTFB: &lt;800ms ({tPerformance('good')}), 800-1800ms (
            {tPerformance('needsImprovement')}), &gt;1800ms (
            {tPerformance('poor')})
          </li>
        </ul>
      </div>
    </div>
  );
}
