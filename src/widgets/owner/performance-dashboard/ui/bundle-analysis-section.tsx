'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Package, TrendingUp, AlertCircle } from 'lucide-react';

interface BundleInfo {
  totalSize: string;
  recommendations: string[];
}

export function BundleAnalysisSection() {
  const [bundleInfo] = useState<BundleInfo>({
    totalSize: 'Run build to analyze',
    recommendations: [
      'Run "pnpm run analyze" to generate bundle analysis',
      'Check for duplicate dependencies',
      'Use dynamic imports for large components',
      'Optimize images and assets',
    ],
  });

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Package className='text-primary h-5 w-5' />
        <h2 className='text-2xl font-bold'>Bundle Analysis</h2>
      </div>
      <p className='text-muted-foreground text-sm'>
        Bundle size information and optimization recommendations.
      </p>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-muted-foreground flex items-center gap-2 text-sm font-medium'>
              <Package className='h-4 w-4' />
              Total Bundle Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{bundleInfo.totalSize}</div>
            <p className='text-muted-foreground mt-2 text-xs'>
              Run production build for accurate size
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-muted-foreground flex items-center gap-2 text-sm font-medium'>
              <TrendingUp className='h-4 w-4' />
              Optimization Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm'>
              <li className='flex items-start gap-2'>
                <AlertCircle className='text-primary mt-0.5 h-4 w-4 flex-shrink-0' />
                <span>Use Next.js dynamic imports</span>
              </li>
              <li className='flex items-start gap-2'>
                <AlertCircle className='text-primary mt-0.5 h-4 w-4 flex-shrink-0' />
                <span>Lazy load components</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className='border-blue-500/20 bg-blue-500/10'>
        <CardHeader>
          <CardTitle className='text-sm font-medium'>
            How to Analyze Bundle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2 text-sm'>
            <p className='bg-background/50 rounded p-3 font-mono'>
              pnpm run analyze
            </p>
            <p className='text-muted-foreground'>
              This will build your application and open an interactive bundle
              visualization showing:
            </p>
            <ul className='text-muted-foreground ml-2 list-inside list-disc space-y-1'>
              <li>Size of each module</li>
              <li>Dependencies tree</li>
              <li>Largest imports</li>
              <li>Optimization opportunities</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-sm font-medium'>
            Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className='space-y-3 text-sm'>
            {bundleInfo.recommendations.map((rec, idx) => (
              <li key={idx} className='flex items-start gap-2'>
                <span className='bg-primary/10 text-primary flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold'>
                  {idx + 1}
                </span>
                <span className='text-muted-foreground'>{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
