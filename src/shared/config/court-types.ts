export const COURT_TYPE = {
  SYNTHETIC: 'synthetic',
  WOODEN: 'wooden',
} as const;

export type CourtType = (typeof COURT_TYPE)[keyof typeof COURT_TYPE];

export const courtTypeColors: Record<CourtType, string> = {
  synthetic: 'text-primary',
  wooden: 'text-amber-600',
};
