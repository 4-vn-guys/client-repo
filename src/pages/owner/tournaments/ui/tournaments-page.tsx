'use client';

import {
  CCAvatar,
  CCCard,
  CCIcons,
  CCPill,
  CCStat,
  OwnerPageBody,
  OwnerPageHeader,
} from '@/shared/ui/court-connect';

type BracketBox = [string, string, [number, number]?];
type Column = { col: string; boxes: BracketBox[] };

const COLUMNS: Column[] = [
  {
    col: 'Quarters',
    boxes: [
      ['Levi & Minh', 'Pham & Vu', [2, 0]],
      ['Thomas & Jin', 'Hoa & Mai', [2, 1]],
      ['You & Mai', 'Q & B', [1, 2]],
      ['Tran & Khoa', 'Anh & Sang', [2, 1]],
    ],
  },
  {
    col: 'Semis',
    boxes: [
      ['Levi & Minh', 'Thomas & Jin'],
      ['Q & B', 'Tran & Khoa'],
    ],
  },
  { col: 'Final', boxes: [['—', '—']] },
  { col: 'Champion', boxes: [] },
];

const REGISTRATIONS = [
  {
    n: 'Nguyen & Pham',
    s: 'Pro',
    t: '2 min ago',
    isNew: true,
    tone: 'purple' as const,
  },
  { n: 'Le & Tran', s: 'Inter', t: '1h', tone: 'green' as const },
  { n: 'Hoang & Vo', s: 'Pro', t: '3h', tone: 'amber' as const },
  { n: 'Mai & Linh', s: 'Beg', t: 'yesterday', tone: 'blue' as const },
];

const ALLOCATIONS = [
  { c: 'Court A', m: 'SF1 · Sat 17:00', dur: '90m' },
  { c: 'Court B', m: 'SF2 · Sat 18:00', dur: '90m' },
  { c: 'Court C', m: 'Final · Sun 17:00', dur: '120m' },
];

function BracketMatch({ box }: { box: BracketBox }) {
  const [a, b, score] = box;
  const aWin = score ? score[0] > score[1] : false;
  const bWin = score ? score[1] > score[0] : false;
  return (
    <div
      style={{
        border: '1px solid var(--cc-line)',
        borderRadius: 8,
        padding: 8,
        marginBottom: 12,
        fontSize: 11.5,
        background: '#fff',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: aWin ? 700 : 500,
          color: aWin ? 'var(--cc-purple-600)' : 'var(--cc-ink-2)',
        }}
      >
        <span>{a}</span>
        {score && <span>{score[0]}</span>}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: bWin ? 700 : 500,
          color: bWin ? 'var(--cc-purple-600)' : 'var(--cc-ink-3)',
          marginTop: 3,
        }}
      >
        <span>{b}</span>
        {score && <span>{score[1]}</span>}
      </div>
    </div>
  );
}

export function OwnerTournamentsPage() {
  return (
    <>
      <OwnerPageHeader
        title='Tournaments'
        actions={
          <button className='cc-btn cc-btn-primary'>
            <CCIcons.plus size={14} /> Create event
          </button>
        }
      />
      <OwnerPageBody>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 12,
            marginBottom: 18,
          }}
        >
          <CCStat label='Active events' value='3' />
          <CCStat label='Registrations' value='84' delta='9 new' />
          <CCStat label='Entry-fee revenue' value='12.6M' />
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18 }}
        >
          <CCCard style={{ padding: 18 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <div>
                <div
                  className='cc-display'
                  style={{ fontSize: 14, fontWeight: 700 }}
                >
                  May Open · Doubles
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--cc-mute)' }}>
                  16 teams · single elim · entry 200k
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <CCPill tone='amber'>Live · Round of 8</CCPill>
                <button className='cc-btn cc-btn-sm'>Edit</button>
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4,1fr)',
                gap: 16,
                marginTop: 14,
              }}
            >
              {COLUMNS.map(c => (
                <div
                  key={c.col}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                  }}
                >
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: 'var(--cc-mute)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: 6,
                    }}
                  >
                    {c.col}
                  </div>
                  {c.boxes.length === 0 ? (
                    <div
                      style={{
                        flex: 1,
                        border: '1px dashed var(--cc-mute-2)',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--cc-mute)',
                        fontSize: 11,
                      }}
                    >
                      🏆 TBD
                    </div>
                  ) : (
                    c.boxes.map((b, i) => <BracketMatch key={i} box={b} />)
                  )}
                </div>
              ))}
            </div>
          </CCCard>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <CCCard style={{ padding: 14 }}>
              <div
                style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 10 }}
              >
                Registrations
              </div>
              {REGISTRATIONS.map((r, i) => (
                <div
                  key={r.n}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '7px 0',
                    borderTop: i ? '1px solid var(--cc-line-2)' : 'none',
                  }}
                >
                  <CCAvatar
                    initials={r.n.split(' ')[0].slice(0, 2)}
                    tone={r.tone}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>{r.n}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--cc-mute)' }}>
                      {r.s} · {r.t}
                    </div>
                  </div>
                  {r.isNew && <CCPill tone='green'>new</CCPill>}
                </div>
              ))}
            </CCCard>

            <CCCard style={{ padding: 14 }}>
              <div
                style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 10 }}
              >
                Court allocation
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--cc-mute)',
                  marginBottom: 8,
                }}
              >
                Auto-blocks reserved during matches
              </div>
              {ALLOCATIONS.map((a, i) => (
                <div
                  key={a.c}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '7px 0',
                    borderTop: i ? '1px solid var(--cc-line-2)' : 'none',
                    fontSize: 12,
                  }}
                >
                  <CCIcons.lock
                    size={12}
                    style={{ color: 'var(--cc-amber)' }}
                  />
                  <span style={{ fontWeight: 600 }}>{a.c}</span>
                  <span style={{ color: 'var(--cc-ink-3)' }}>{a.m}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--cc-mute)' }}>
                    {a.dur}
                  </span>
                </div>
              ))}
            </CCCard>
          </div>
        </div>
      </OwnerPageBody>
    </>
  );
}
