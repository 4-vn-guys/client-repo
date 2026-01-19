'use client';

import { WebVitalsSection } from './web-vitals-section';
import { BundleAnalysisSection } from './bundle-analysis-section';
import { Separator } from '@/shared/ui/separator';
import { Gauge } from 'lucide-react';

export function PerformanceDashboard() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Gauge className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Performance Dashboard</h1>
                        <p className="text-muted-foreground">
                            Monitor your application's performance metrics in real-time
                        </p>
                    </div>
                </div>
            </div>

            <Separator />

            <WebVitalsSection />

            <Separator />

            <BundleAnalysisSection />

            <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-border/50">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Gauge className="w-4 h-4" />
                    About Performance Monitoring
                </h3>
                <p className="text-sm text-muted-foreground">
                    This dashboard uses Web Vitals to track Core Web Vitals metrics that Google
                    uses for Search ranking. The metrics are measured in real-time as you interact
                    with the application. For production monitoring, data is sent to Vercel Speed
                    Insights.
                </p>
            </div>
        </div>
    );
}
