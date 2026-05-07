import type { UserSettings } from './types';

const comfortableSpacing = {
  gap: '1.5rem',
  padding: '1.5rem',
};

const compactSpacing = {
  gap: '0.75rem',
  padding: '1rem',
};

export const applyLayoutSettings = (
  settings: Pick<UserSettings, 'compactMode' | 'layoutDensity'>
) => {
  if (typeof document === 'undefined') return;

  const compact = settings.compactMode || settings.layoutDensity === 'compact';
  const spacing = compact ? compactSpacing : comfortableSpacing;

  document.documentElement.dataset.layoutDensity = settings.layoutDensity;
  document.documentElement.dataset.compactMode = String(compact);
  document.documentElement.style.setProperty('--app-gap', spacing.gap);
  document.documentElement.style.setProperty('--app-padding', spacing.padding);
};
