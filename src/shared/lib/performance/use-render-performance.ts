'use client';

import { useEffect, useRef, useState } from 'react';

export interface RenderMetrics {
    renderCount: number;
    lastRenderDuration: number;
    averageRenderDuration: number;
    totalRenderTime: number;
}

export function useRenderPerformance(componentName: string) {
    const renderCountRef = useRef(0);
    const renderTimesRef = useRef<number[]>([]);
    const renderStartRef = useRef<number>(0);
    const [metrics, setMetrics] = useState<RenderMetrics>({
        renderCount: 0,
        lastRenderDuration: 0,
        averageRenderDuration: 0,
        totalRenderTime: 0,
    });

    // Mark the start of render
    renderStartRef.current = performance.now();

    useEffect(() => {
        // Measure render duration
        const renderEnd = performance.now();
        const renderDuration = renderEnd - renderStartRef.current;

        renderCountRef.current += 1;
        renderTimesRef.current.push(renderDuration);

        const totalTime = renderTimesRef.current.reduce((sum, time) => sum + time, 0);
        const avgTime = totalTime / renderTimesRef.current.length;

        setMetrics({
            renderCount: renderCountRef.current,
            lastRenderDuration: renderDuration,
            averageRenderDuration: avgTime,
            totalRenderTime: totalTime,
        });

        // Log to performance timeline
        if (performance.mark && performance.measure) {
            const markName = `${componentName}-render-${renderCountRef.current}`;
            performance.mark(markName);
            
            if (renderCountRef.current > 1) {
                const prevMarkName = `${componentName}-render-${renderCountRef.current - 1}`;
                try {
                    performance.measure(
                        `${componentName}-render-duration`,
                        prevMarkName,
                        markName
                    );
                } catch (e) {
                    // Previous mark might not exist
                }
            }
        }
    });

    return metrics;
}
