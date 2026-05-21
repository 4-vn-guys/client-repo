import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

export function CCCard({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={cn('cc-card', className)} style={style}>
      {children}
    </div>
  );
}

type PillTone =
  | 'default'
  | 'green'
  | 'purple'
  | 'amber'
  | 'red'
  | 'blue'
  | 'solid-green'
  | 'solid-purple';

export function CCPill({
  children,
  tone = 'default',
  className,
  style,
}: {
  children: ReactNode;
  tone?: PillTone;
  className?: string;
  style?: CSSProperties;
}) {
  const toneClass = tone === 'default' ? '' : tone;
  return (
    <span className={cn('cc-pill', toneClass, className)} style={style}>
      {children}
    </span>
  );
}

export function CCStat({
  label,
  value,
  delta,
  deltaDir = 'up',
  className,
}: {
  label: string;
  value: string | number;
  delta?: string;
  deltaDir?: 'up' | 'down';
  className?: string;
}) {
  return (
    <div className={cn('cc-stat', className)}>
      <div className='label'>{label}</div>
      <div className='value'>{value}</div>
      {delta && (
        <div className={cn('delta', deltaDir)}>
          {deltaDir === 'down' ? '▼' : '▲'} {delta}
        </div>
      )}
    </div>
  );
}

export function CCToggle({
  on,
  onChange,
  ariaLabel,
}: {
  on: boolean;
  onChange?: (next: boolean) => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type='button'
      role='switch'
      aria-checked={on}
      aria-label={ariaLabel}
      className={cn('cc-toggle', on && 'on')}
      onClick={() => onChange?.(!on)}
    />
  );
}

export function CCAvatar({
  initials,
  tone,
  size = 'sm',
  className,
  style,
}: {
  initials: string;
  tone?: 'purple' | 'green' | 'amber' | 'blue';
  size?: 'sm' | 'lg';
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={cn(
        'cc-avatar',
        size === 'lg' && 'lg',
        tone && tone,
        className
      )}
      style={style}
    >
      {initials}
    </span>
  );
}

export function CCTopBar({
  left,
  right,
}: {
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 28px',
        borderBottom: '1px solid var(--cc-line)',
        background: '#fff',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 13,
          color: 'var(--cc-ink-3)',
        }}
      >
        {left}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {right}
      </div>
    </div>
  );
}
