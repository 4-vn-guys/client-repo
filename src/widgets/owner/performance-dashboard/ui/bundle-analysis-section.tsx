'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Package, TrendingUp, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface BundleInfo {
  totalSize: string;
  recommendations: string[];
}

export function BundleAnalysisSection() {
  const tPerformance = useTranslations('OwnerPerformancePage');
  const [bundleInfo] = useState<BundleInfo>({
    totalSize: tPerformance('runBuildToAnalyze'),
    recommendations: [
      tPerformance('recommendationAnalyze'),
      tPerformance('recommendationDuplicates'),
      tPerformance('recommendationDynamic'),
      tPerformance('recommendationImages'),
    ],
  });

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Package className='text-primary h-5 w-5' />
        <h2 className='text-2xl font-bold'>
          {tPerformance('bundleAnalysis')}
        </h2>
      </div>
      <p className='text-muted-foreground text-sm'>
        {tPerformance('bundleDescription')}
      </p>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-muted-foreground flex items-center gap-2 text-sm font-medium'>
              <Package className='h-4 w-4' />
              {tPerformance('totalBundleSize')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{bundleInfo.totalSize}</div>
            <p className='text-muted-foreground mt-2 text-xs'>
              {tPerformance('runProductionBuild')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-muted-foreground flex items-center gap-2 text-sm font-medium'>
              <TrendingUp className='h-4 w-4' />
              {tPerformance('optimizationTips')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm'>
              <li className='flex items-start gap-2'>
                <AlertCircle className='text-primary mt-0.5 h-4 w-4 flex-shrink-0' />
                <span>{tPerformance('dynamicImports')}</span>
              </li>
              <li className='flex items-start gap-2'>
                <AlertCircle className='text-primary mt-0.5 h-4 w-4 flex-shrink-0' />
                <span>{tPerformance('lazyLoad')}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className='border-blue-500/20 bg-blue-500/10'>
        <CardHeader>
          <CardTitle className='text-sm font-medium'>
            {tPerformance('howToAnalyze')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2 text-sm'>
            <p className='bg-background/50 rounded p-3 font-mono'>
              pnpm run analyze
            </p>
            <p className='text-muted-foreground'>
              {tPerformance('analyzeDescription')}
            </p>
            <ul className='text-muted-foreground ml-2 list-inside list-disc space-y-1'>
              <li>{tPerformance('moduleSize')}</li>
              <li>{tPerformance('dependenciesTree')}</li>
              <li>{tPerformance('largestImports')}</li>
              <li>{tPerformance('optimizationOpportunities')}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-sm font-medium'>
            {tPerformance('recommendationsTitle')}
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
