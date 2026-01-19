'use client';

import { useEffect, useState } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

export interface WebVitalsMetrics {
    CLS: number | null;
    INP: number | null;
    FCP: number | null;
    LCP: number | null;
    TTFB: number | null;
}

export interface WebVitalMetric {
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
}

const getRating = (metric: Metric): 'good' | 'needs-improvement' | 'poor' => {
    const { name, value } = metric;
    
    // Thresholds based on Web Vitals recommendations
    const thresholds = {
        CLS: { good: 0.1, poor: 0.25 },
        INP: { good: 200, poor: 500 },
        FCP: { good: 1800, poor: 3000 },
        LCP: { good: 2500, poor: 4000 },
        TTFB: { good: 800, poor: 1800 },
    };
    
    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return 'good';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
};

export function useWebVitals() {
    const [metrics, setMetrics] = useState<WebVitalsMetrics>({
        CLS: null,
        INP: null,
        FCP: null,
        LCP: null,
        TTFB: null,
    });

    const [detailedMetrics, setDetailedMetrics] = useState<WebVitalMetric[]>([]);

    useEffect(() => {
        const handleMetric = (metric: Metric) => {
            setMetrics((prev) => ({
                ...prev,
                [metric.name]: metric.value,
            }));

            setDetailedMetrics((prev) => {
                const filtered = prev.filter((m) => m.name !== metric.name);
                return [
                    ...filtered,
                    {
                        name: metric.name,
                        value: metric.value,
                        rating: getRating(metric),
                    },
                ];
            });
        };

        onCLS(handleMetric);
        onINP(handleMetric);
        onFCP(handleMetric);
        onLCP(handleMetric);
        onTTFB(handleMetric);
    }, []);

    return { metrics, detailedMetrics };
}
