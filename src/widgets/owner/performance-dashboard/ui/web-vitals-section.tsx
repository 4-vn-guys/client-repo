'use client';

import { useWebVitals } from '@/shared/lib/performance';
import { PerformanceCard } from './performance-card';
import { Activity, Zap, Eye, Clock, Network } from 'lucide-react';

const metricInfo = {
  CLS: {
    name: 'Cumulative Layout Shift',
    description: 'Visual stability - measures layout shifts',
    icon: Activity,
    unit: '',
  },
  INP: {
    name: 'Interaction to Next Paint',
    description: 'Responsiveness - time to process interactions',
    icon: Zap,
    unit: 'ms',
  },
  FCP: {
    name: 'First Contentful Paint',
    description: 'Loading - first content appears',
    icon: Eye,
    unit: 'ms',
  },
  LCP: {
    name: 'Largest Contentful Paint',
    description: 'Loading - main content visible',
    icon: Clock,
    unit: 'ms',
  },
  TTFB: {
    name: 'Time to First Byte',
    description: 'Server response time',
    icon: Network,
    unit: 'ms',
  },
};

export function WebVitalsSection() {
  const { detailedMetrics } = useWebVitals();

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Zap className='text-primary h-5 w-5' />
        <h2 className='text-2xl font-bold'>Core Web Vitals</h2>
      </div>
      <p className='text-muted-foreground text-sm'>
        Real-time performance metrics for this page. These metrics update as you
        interact with the application.
      </p>

      {detailedMetrics.length === 0 ? (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {Object.entries(metricInfo).map(([key, info]) => (
            <PerformanceCard
              key={key}
              title={info.name}
              value='Measuring...'
              rating='good'
              description={info.description}
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
                title={info.name}
                value={metric.value}
                rating={metric.rating}
                description={info.description}
                unit={info.unit}
              />
            );
          })}
        </div>
      )}

      <div className='bg-muted/50 mt-6 rounded-lg p-4'>
        <h3 className='mb-2 font-semibold'>Metric Thresholds</h3>
        <ul className='text-muted-foreground space-y-1 text-sm'>
          <li>
            • CLS: &lt;0.1 (good), 0.1-0.25 (needs improvement), &gt;0.25 (poor)
          </li>
          <li>
            • INP: &lt;200ms (good), 200-500ms (needs improvement), &gt;500ms
            (poor)
          </li>
          <li>
            • FCP: &lt;1.8s (good), 1.8-3s (needs improvement), &gt;3s (poor)
          </li>
          <li>
            • LCP: &lt;2.5s (good), 2.5-4s (needs improvement), &gt;4s (poor)
          </li>
          <li>
            • TTFB: &lt;800ms (good), 800-1800ms (needs improvement), &gt;1800ms
            (poor)
          </li>
        </ul>
      </div>
    </div>
  );
}
