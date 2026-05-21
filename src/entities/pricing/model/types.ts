export type AutoPilotRuleKind =
  | 'last_mile_flash'
  | 'peak_hour_surge'
  | 'member_bonus'
  | 'rainy_day_boost'
  | 'custom';

export type AutoPilotRule = {
  id: string;
  branchId: string;
  kind: AutoPilotRuleKind;
  name: string;
  description: string;
  effectLabel: string;
  isActive: boolean;
  config: Record<string, unknown> | null;
};

export type HeatGrid = {
  days: string[];
  hours: number[];
  tiers: number[][];
  prices: number[];
};
