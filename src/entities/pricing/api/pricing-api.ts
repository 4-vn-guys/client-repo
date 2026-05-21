import { axiosInstance } from '@/shared/lib/axios';
import type { AutoPilotRule, HeatGrid } from '../model/types';

type Envelope<T> = { success?: boolean; data: T; message?: string } | T;

function unwrap<T>(payload: Envelope<T>): T {
  if (payload && typeof payload === 'object' && 'data' in (payload as object)) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export const pricingApi = {
  async getHeatGrid(branchId: string): Promise<HeatGrid> {
    const res = await axiosInstance.get<Envelope<HeatGrid>>(
      `/pricing/branches/${branchId}/heat-grid`
    );
    return unwrap(res.data);
  },

  async getAutoPilotRules(branchId: string): Promise<AutoPilotRule[]> {
    const res = await axiosInstance.get<Envelope<AutoPilotRule[]>>(
      `/pricing/branches/${branchId}/auto-pilot`
    );
    return unwrap(res.data);
  },

  async setAutoPilotActive(
    ruleId: string,
    isActive: boolean
  ): Promise<AutoPilotRule> {
    const res = await axiosInstance.patch<Envelope<AutoPilotRule>>(
      `/pricing/auto-pilot/${ruleId}`,
      { isActive }
    );
    return unwrap(res.data);
  },
};
