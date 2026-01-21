/**
 * Performance measurement utilities
 * Provides helpers for marking and measuring performance metrics
 */

export class PerformanceMetrics {
  /**
   * Mark a point in time for performance measurement
   */
  static mark(markName: string): void {
    if (typeof window !== 'undefined' && performance.mark) {
      performance.mark(markName);
    }
  }

  /**
   * Measure the duration between two marks
   */
  static measure(
    measureName: string,
    startMark: string,
    endMark?: string
  ): PerformanceMeasure | null {
    if (typeof window !== 'undefined' && performance.measure) {
      try {
        return performance.measure(measureName, startMark, endMark);
      } catch (e) {
        console.warn(`Failed to measure ${measureName}:`, e);
        return null;
      }
    }
    return null;
  }

  /**
   * Get all performance entries of a specific type
   */
  static getEntries(type?: string): PerformanceEntry[] {
    if (typeof window !== 'undefined' && performance.getEntries) {
      const entries = performance.getEntries();
      return type ? entries.filter(entry => entry.entryType === type) : entries;
    }
    return [];
  }

  /**
   * Get entries by name
   */
  static getEntriesByName(name: string): PerformanceEntry[] {
    if (typeof window !== 'undefined' && performance.getEntriesByName) {
      return performance.getEntriesByName(name);
    }
    return [];
  }

  /**
   * Clear all performance entries
   */
  static clearEntries(): void {
    if (typeof window !== 'undefined' && performance.clearMarks) {
      performance.clearMarks();
      performance.clearMeasures?.();
    }
  }

  /**
   * Get navigation timing metrics
   */
  static getNavigationMetrics() {
    if (typeof window === 'undefined') return null;

    const navigation = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;
    if (!navigation) return null;

    return {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      ttfb: navigation.responseStart - navigation.requestStart,
      download: navigation.responseEnd - navigation.responseStart,
      domInteractive: navigation.domInteractive - navigation.fetchStart,
      domComplete: navigation.domComplete - navigation.fetchStart,
      loadComplete: navigation.loadEventEnd - navigation.fetchStart,
    };
  }

  /**
   * Get resource timing metrics
   */
  static getResourceMetrics() {
    if (typeof window === 'undefined') return [];

    const resources = performance.getEntriesByType(
      'resource'
    ) as PerformanceResourceTiming[];

    return resources.map(resource => ({
      name: resource.name,
      duration: resource.duration,
      size: resource.transferSize,
      type: resource.initiatorType,
    }));
  }
}
