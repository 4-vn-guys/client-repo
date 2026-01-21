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
  const [metrics, setMetrics] = useState<RenderMetrics>({
    renderCount: 0,
    lastRenderDuration: 0,
    averageRenderDuration: 0,
    totalRenderTime: 0,
  });

  useEffect(() => {
    // Mark the start of render
    const renderStart = performance.now();

    // Use requestAnimationFrame to measure after paint
    const rafId = requestAnimationFrame(() => {
      // Measure render duration
      const renderEnd = performance.now();
      const renderDuration = renderEnd - renderStart;

      renderCountRef.current += 1;
      renderTimesRef.current.push(renderDuration);

      const totalTime = renderTimesRef.current.reduce(
        (sum, time) => sum + time,
        0
      );
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
          } catch {
            // Previous mark might not exist
          }
        }
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [componentName]);

  return metrics;
}
