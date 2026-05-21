'use client';

import {
  CCCard,
  CCIcons,
  OwnerPageBody,
  OwnerPageHeader,
} from '@/shared/ui/court-connect';

type CheckinStatus = 'in' | 'late' | 'no-show';

type Entry = {
  n: string;
  c: string;
  t: string;
  s: CheckinStatus;
  stat: string;
};

const ENTRIES: Entry[] = [
  { n: 'Linh Pham', c: 'Court A', t: '14:13', s: 'in', stat: 'on time' },
  { n: 'Mai Nguyen', c: 'Court B', t: '14:10', s: 'in', stat: 'early' },
  { n: 'Friday Squad (4)', c: 'Court A', t: '14:02', s: 'in', stat: 'on time' },
  { n: 'Hoa Truong', c: 'Court D', t: '13:45', s: 'late', stat: '15 min late' },
  { n: 'Q. Tran', c: 'Court C', t: '13:30', s: 'in', stat: 'on time' },
  {
    n: 'Anonymous',
    c: 'Court B',
    t: '13:00',
    s: 'no-show',
    stat: 'no-show · re-listed',
  },
  { n: 'Coach Tu', c: 'Court B', t: '10:00', s: 'in', stat: 'coach' },
];

const STATUS_TINT: Record<CheckinStatus, { bg: string; fg: string }> = {
  in: { bg: 'var(--cc-green-100)', fg: '#047857' },
  late: { bg: 'var(--cc-amber-50)', fg: '#b45309' },
  'no-show': { bg: 'var(--cc-red-50)', fg: '#b91c1c' },
};

function StatusIcon({ s }: { s: CheckinStatus }) {
  if (s === 'in') return <CCIcons.check size={14} stroke={2.5} />;
  if (s === 'late') return <CCIcons.clock size={14} />;
  return <CCIcons.x size={14} />;
}

export function OwnerCheckinPage() {
  return (
    <>
      <OwnerPageHeader title='Front desk · Check-in' />
      <OwnerPageBody>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 18,
            minHeight: 520,
          }}
        >
          <CCCard
            style={{ padding: 22, display: 'flex', flexDirection: 'column' }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--cc-mute)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              QR scanner · Cam 1
            </div>
            <div
              className='cc-display'
              style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}
            >
              Scan booking QR or member card
            </div>
            <div
              style={{
                flex: 1,
                marginTop: 18,
                position: 'relative',
                background: '#0f1115',
                borderRadius: 14,
                overflow: 'hidden',
                minHeight: 320,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(circle at center, #1f2937 0%, #0f1115 70%)',
                }}
              />
              <svg
                width='100%'
                height='100%'
                viewBox='0 0 400 400'
                style={{ position: 'absolute', inset: 0 }}
              >
                <defs>
                  <pattern
                    id='qrp'
                    width='14'
                    height='14'
                    patternUnits='userSpaceOnUse'
                  >
                    <rect width='14' height='14' fill='#fff' />
                    <rect x='0' y='0' width='6' height='6' fill='#000' />
                    <rect x='8' y='2' width='4' height='4' fill='#000' />
                    <rect x='2' y='8' width='4' height='4' fill='#000' />
                  </pattern>
                </defs>
                <rect
                  x='120'
                  y='120'
                  width='160'
                  height='160'
                  fill='url(#qrp)'
                  opacity='0.85'
                />
                {(
                  [
                    [110, 110, 1, 1],
                    [290, 110, -1, 1],
                    [110, 290, 1, -1],
                    [290, 290, -1, -1],
                  ] as const
                ).map(([x, y, sx, sy], i) => (
                  <path
                    key={i}
                    d={`M${x} ${y + sy * 22} L${x} ${y} L${x + sx * 22} ${y}`}
                    stroke='#7c3aed'
                    strokeWidth='4'
                    fill='none'
                    strokeLinecap='round'
                  />
                ))}
                <rect
                  x='120'
                  y='195'
                  width='160'
                  height='3'
                  fill='#10b981'
                  opacity='0.9'
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  bottom: 14,
                  left: 14,
                  right: 14,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(16,185,129,.95)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <CCIcons.check size={18} stroke={2.5} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>
                    Linh Pham · Court A · 14:00–15:30
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.9 }}>
                    Bronze member · paid · 1 racket rental
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600 }}>0.6s</span>
              </div>
            </div>
          </CCCard>

          <CCCard style={{ padding: 0 }}>
            <div
              style={{
                padding: '16px 18px',
                borderBottom: '1px solid var(--cc-line-2)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700 }}>
                Today&apos;s check-ins
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--cc-mute)' }}>
                62 of 78 expected · 4 no-shows
              </div>
            </div>
            <div style={{ padding: 4 }}>
              {ENTRIES.map((r, i) => (
                <div
                  key={r.n + r.t}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '11px 14px',
                    margin: 4,
                    borderRadius: 10,
                    background: i === 0 ? 'var(--cc-green-50)' : 'transparent',
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: STATUS_TINT[r.s].bg,
                      color: STATUS_TINT[r.s].fg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <StatusIcon s={r.s} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>{r.n}</div>
                    <div style={{ fontSize: 11, color: 'var(--cc-mute)' }}>
                      {r.c} · {r.stat}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--cc-mute)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {r.t}
                  </span>
                </div>
              ))}
            </div>
          </CCCard>
        </div>
      </OwnerPageBody>
    </>
  );
}
