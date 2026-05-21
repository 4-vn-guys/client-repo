'use client';

import { useMemo } from 'react';
import {
  CCCard,
  CCIcons,
  OwnerPageBody,
  OwnerPageHeader,
} from '@/shared/ui/court-connect';

const COURTS = [
  { n: 'Court A', s: 'Synthetic', r: 100 },
  { n: 'Court B', s: 'Synthetic', r: 100 },
  { n: 'Court C', s: 'Wood · premium', r: 140 },
  { n: 'Court D', s: 'PVC', r: 100 },
];

type BookingKind =
  | 'paid'
  | 'member'
  | 'coach'
  | 'flash'
  | 'tour'
  | 'hold'
  | 'block';

type Block = {
  c: number;
  h: number;
  len: number;
  name: string;
  kind: BookingKind;
  split?: boolean;
};

const BOOKINGS: Block[] = [
  { c: 0, h: 6.5, len: 1.5, name: 'Linh P.', kind: 'paid' },
  { c: 0, h: 16, len: 2, name: 'Friday Squad', kind: 'paid', split: true },
  { c: 0, h: 18.5, len: 1, name: 'Auto-flash', kind: 'flash' },
  { c: 1, h: 7, len: 1, name: 'Mai N.', kind: 'paid' },
  { c: 1, h: 10, len: 1, name: 'Coach Tu', kind: 'coach' },
  { c: 1, h: 19, len: 2, name: 'Tournament SF', kind: 'tour' },
  { c: 2, h: 6, len: 2, name: 'Member · Gold', kind: 'member' },
  { c: 2, h: 13, len: 1.5, name: 'Hoa T.', kind: 'paid' },
  { c: 2, h: 17, len: 3, name: 'Locked · 2 hold', kind: 'hold' },
  { c: 3, h: 8, len: 1, name: 'Q. Tran', kind: 'paid' },
  { c: 3, h: 14, len: 1, name: '— blocked —', kind: 'block' },
  { c: 3, h: 19.5, len: 2, name: 'League final', kind: 'tour' },
];

const KIND_STYLES: Record<
  BookingKind,
  { bg: string; fg: string; bd: string; shadow?: string }
> = {
  paid: { bg: '#ede9fe', fg: '#5b21b6', bd: '#c4b5fd' },
  member: { bg: '#dcfce7', fg: '#15803d', bd: '#86efac' },
  coach: { bg: '#dbeafe', fg: '#1e40af', bd: '#93c5fd' },
  flash: {
    bg: 'linear-gradient(135deg,#f59e0b,#dc2626)',
    fg: '#fff',
    bd: '#dc2626',
    shadow: '0 4px 12px rgba(220,38,38,.3)',
  },
  tour: { bg: '#fef3c7', fg: '#92400e', bd: '#fcd34d' },
  hold: {
    bg: 'repeating-linear-gradient(45deg,#fff 0 6px,#fee2e2 6px 12px)',
    fg: '#991b1b',
    bd: '#fca5a5',
  },
  block: {
    bg: 'repeating-linear-gradient(45deg,#f3f4f6 0 6px,#e5e7eb 6px 12px)',
    fg: '#6b7280',
    bd: '#d1d5db',
  },
};

const TIER_COLORS = [
  '#dbeafe',
  '#bfdbfe',
  '#fde68a',
  '#fed7aa',
  '#fb923c',
  '#dc2626',
];

const CELL_W = 60;
const HOURS = Array.from({ length: 16 }, (_, i) => 6 + i);

function tierFor(h: number): number {
  if (h < 9) return 1;
  if (h < 15) return 2;
  if (h < 18) return 3;
  if (h < 21) return 5;
  return 2;
}

export function OwnerSchedulePage() {
  const currentTimeOffset = useMemo(() => (14.4 - 6) * CELL_W, []);

  return (
    <>
      <OwnerPageHeader
        title='Schedule'
        actions={
          <>
            <button className='cc-btn'>
              <CCIcons.cart size={14} /> Quick order
            </button>
            <button className='cc-btn cc-btn-primary'>
              <CCIcons.plus size={14} /> New booking
            </button>
          </>
        }
      />
      <OwnerPageBody>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 18,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--cc-mute)',
                fontWeight: 600,
              }}
            >
              TVC BADMINTON DA NANG · DT605 HOA TIEN
            </div>
            <h1
              className='cc-display'
              style={{ fontSize: 28, fontWeight: 700, margin: '4px 0 0' }}
            >
              Live operations · May 7
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className='cc-btn cc-btn-sm'>
              <CCIcons.cal size={13} /> May 07, 2026
            </button>
            <div
              style={{
                display: 'flex',
                background: '#fff',
                border: '1px solid var(--cc-line)',
                borderRadius: 10,
                padding: 2,
              }}
            >
              {(['Day', 'Week', 'Month'] as const).map((v, i) => (
                <span
                  key={v}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    background: i === 0 ? 'var(--cc-purple-50)' : 'transparent',
                    color: i === 0 ? 'var(--cc-purple-600)' : 'var(--cc-ink-3)',
                  }}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 16,
            marginBottom: 12,
            flexWrap: 'wrap',
            fontSize: 11.5,
            color: 'var(--cc-ink-3)',
          }}
        >
          {[
            { l: 'Paid', c: '#ede9fe' },
            { l: 'Member', c: '#dcfce7' },
            { l: 'Coach', c: '#dbeafe' },
            {
              l: 'Flash sale (auto)',
              c: 'linear-gradient(135deg,#f59e0b,#dc2626)',
            },
            { l: 'Tournament', c: '#fef3c7' },
            {
              l: 'Hold (concurrency)',
              c: 'repeating-linear-gradient(45deg,#fff 0 4px,#fee2e2 4px 8px)',
            },
          ].map(g => (
            <span
              key={g.l}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  background: g.c,
                  border: '1px solid var(--cc-line)',
                }}
              />{' '}
              {g.l}
            </span>
          ))}
          <span style={{ marginLeft: 'auto', color: 'var(--cc-mute)' }}>
            Drag any block to move · Hold ⌥ to duplicate
          </span>
        </div>

        <CCCard style={{ overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--cc-line)',
            }}
          >
            <div
              style={{
                width: 160,
                padding: '10px 14px',
                fontSize: 11.5,
                fontWeight: 700,
                color: 'var(--cc-mute)',
                textTransform: 'uppercase',
                borderRight: '1px solid var(--cc-line-2)',
              }}
            >
              Court
            </div>
            <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
              {HOURS.map(h => (
                <div
                  key={h}
                  style={{
                    width: CELL_W,
                    padding: '8px 0',
                    textAlign: 'center',
                    fontSize: 11,
                    color: 'var(--cc-ink-3)',
                    borderRight: '1px solid var(--cc-line-2)',
                    position: 'relative',
                  }}
                >
                  {String(h).padStart(2, '0')}:00
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -1,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: TIER_COLORS[tierFor(h)],
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {COURTS.map((ct, ci) => (
            <div
              key={ci}
              style={{
                display: 'flex',
                borderBottom:
                  ci < COURTS.length - 1
                    ? '1px solid var(--cc-line-2)'
                    : 'none',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 160,
                  padding: '14px',
                  borderRight: '1px solid var(--cc-line-2)',
                  fontSize: 13,
                }}
              >
                <div style={{ fontWeight: 600 }}>{ct.n}</div>
                <div style={{ fontSize: 11, color: 'var(--cc-mute)' }}>
                  {ct.s} · {ct.r}k base
                </div>
              </div>
              <div style={{ flex: 1, position: 'relative', height: 76 }}>
                {HOURS.map(h => (
                  <div
                    key={h}
                    style={{
                      position: 'absolute',
                      left: (h - 6) * CELL_W,
                      top: 0,
                      bottom: 0,
                      width: CELL_W,
                      borderRight: '1px solid var(--cc-line-2)',
                    }}
                  />
                ))}
                <div
                  style={{
                    position: 'absolute',
                    left: currentTimeOffset,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: 'var(--cc-red)',
                    zIndex: 5,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: -6,
                      left: -5,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: 'var(--cc-red)',
                      border: '2px solid #fff',
                      boxShadow: '0 0 0 2px var(--cc-red)',
                    }}
                  />
                </div>
                {BOOKINGS.filter(b => b.c === ci).map((b, i) => {
                  const s = KIND_STYLES[b.kind];
                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: (b.h - 6) * CELL_W + 2,
                        top: 8,
                        width: b.len * CELL_W - 4,
                        height: 60,
                        background: s.bg,
                        color: s.fg,
                        border: `1px solid ${s.bd}`,
                        borderRadius: 8,
                        padding: '6px 8px',
                        fontSize: 11.5,
                        fontWeight: 600,
                        overflow: 'hidden',
                        cursor: 'grab',
                        boxShadow: s.shadow ?? 'none',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        {b.kind === 'flash' && (
                          <CCIcons.bolt
                            size={10}
                            stroke={2}
                            fill='currentColor'
                          />
                        )}
                        {b.kind === 'tour' && <CCIcons.trophy size={10} />}
                        {b.kind === 'hold' && <CCIcons.lock size={10} />}
                        <span
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {b.name}
                        </span>
                      </div>
                      {b.split && (
                        <div
                          style={{
                            fontSize: 10,
                            opacity: 0.8,
                            marginTop: 2,
                          }}
                        >
                          · split 4 ways
                        </div>
                      )}
                      {b.kind === 'hold' && (
                        <div style={{ fontSize: 9.5, marginTop: 2 }}>
                          2 attempts in 4s · 1 won
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </CCCard>

        <CCCard
          style={{
            marginTop: 14,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderColor: '#fca5a5',
            background: '#fff1f2',
          }}
        >
          <CCIcons.shield size={18} style={{ color: '#dc2626' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#991b1b' }}>
              Concurrency safeguard active
            </div>
            <div style={{ fontSize: 11.5, color: '#9f1239' }}>
              3 simultaneous attempts on Court C · 17:00 — 1 confirmed, 2
              released after 8s lock. No double booking.
            </div>
          </div>
          <button className='cc-btn cc-btn-sm'>View audit</button>
        </CCCard>
      </OwnerPageBody>
    </>
  );
}
