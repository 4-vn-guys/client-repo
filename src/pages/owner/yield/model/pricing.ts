export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const HOURS = Array.from({ length: 16 }, (_, i) => 6 + i);

export const TIER_COLORS = [
  '#dbeafe',
  '#bfdbfe',
  '#fde68a',
  '#fed7aa',
  '#fb923c',
  '#dc2626',
];

export const TIER_PRICES = [60, 80, 100, 120, 140, 160];

export function tierFor(dayIndex: number, hour: number): number {
  let t = 0;
  if (hour >= 17 && hour <= 21) t += 3;
  else if (hour >= 9 && hour <= 16) t += 1;
  if (dayIndex >= 4) t += 2;
  if (hour === 18 || hour === 19) t = Math.max(t, 5);
  return Math.min(t, 5);
}

export function priceFor(tier: number): number {
  return TIER_PRICES[tier] ?? TIER_PRICES[0];
}

export type AutoPilotRule = {
  id: string;
  name: string;
  desc: string;
  val: string;
  on: boolean;
};

export const DEFAULT_RULES: AutoPilotRule[] = [
  {
    id: 'last-mile',
    name: 'Last-mile flash',
    desc: 'Discount empty slots 2h before start',
    val: '−15 to −30%',
    on: true,
  },
  {
    id: 'peak-surge',
    name: 'Peak-hour surge',
    desc: 'Increase 18:00–20:00 when occupancy > 80%',
    val: '+10%',
    on: true,
  },
  {
    id: 'member-bonus',
    name: 'Member bonus',
    desc: 'Gold members get 20% off morning slots',
    val: '−20%',
    on: true,
  },
  {
    id: 'rainy-day',
    name: 'Rainy-day boost',
    desc: 'Weather API · sunny weekends only',
    val: '+5%',
    on: false,
  },
];
