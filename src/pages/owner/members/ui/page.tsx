'use client';

import {
  CCAvatar,
  CCCard,
  CCIcons,
  CCPill,
  OwnerPageBody,
  OwnerPageHeader,
} from '@/shared/ui/court-connect';

type Tier = {
  name: 'Bronze' | 'Silver' | 'Gold';
  count: number;
  color: string;
  bg: string;
  perks: string[];
  hilite?: boolean;
};

const TIERS: Tier[] = [
  {
    name: 'Bronze',
    count: 124,
    color: '#a16207',
    bg: '#fef3c7',
    perks: ['Booking 7 days ahead', 'Standard pricing'],
  },
  {
    name: 'Silver',
    count: 56,
    color: '#475569',
    bg: '#e2e8f0',
    perks: ['10% off morning', 'Priority queue'],
  },
  {
    name: 'Gold',
    count: 28,
    color: '#a16207',
    bg: '#fef9c3',
    perks: ['20% off morning', 'Free shuttlecock', 'Reserve 14 days ahead'],
    hilite: true,
  },
];

type Status = 'active' | 'new' | 'lapsing';

type Member = {
  n: string;
  t: Tier['name'];
  j: string;
  lv: string;
  s: number;
  sp: string;
  st: Status;
  tone: 'purple' | 'green' | 'amber' | 'blue';
};

const MEMBERS: Member[] = [
  {
    n: 'Minh-Anh Tran',
    t: 'Gold',
    j: 'Jan 2024',
    lv: '2h ago',
    s: 142,
    sp: '14.2M',
    st: 'active',
    tone: 'purple',
  },
  {
    n: 'Jin-Ki Park',
    t: 'Silver',
    j: 'Mar 2024',
    lv: 'yesterday',
    s: 87,
    sp: '6.8M',
    st: 'active',
    tone: 'green',
  },
  {
    n: 'Thomas Hoang',
    t: 'Gold',
    j: 'Aug 2023',
    lv: '3 days',
    s: 198,
    sp: '21.4M',
    st: 'active',
    tone: 'amber',
  },
  {
    n: 'Linh Pham',
    t: 'Bronze',
    j: 'May 2026',
    lv: '2h ago',
    s: 4,
    sp: '320k',
    st: 'new',
    tone: 'blue',
  },
  {
    n: 'Hoa Truong',
    t: 'Silver',
    j: 'Nov 2023',
    lv: '12 days',
    s: 68,
    sp: '5.1M',
    st: 'lapsing',
    tone: 'purple',
  },
];

const STATUS_TONE: Record<Status, 'green' | 'blue' | 'amber'> = {
  active: 'green',
  new: 'blue',
  lapsing: 'amber',
};

function tierPillStyle(t: Tier['name']) {
  if (t === 'Gold') return { background: '#fef9c3', color: '#a16207' };
  if (t === 'Silver') return { background: '#e2e8f0', color: '#475569' };
  return { background: '#fef3c7', color: '#a16207' };
}

export default function MembersPage() {
  return (
    <>
      <OwnerPageHeader
        title='Members'
        actions={
          <button className='cc-btn cc-btn-primary'>
            <CCIcons.plus size={14} /> New tier
          </button>
        }
      />
      <OwnerPageBody>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 12,
            marginBottom: 18,
          }}
        >
          {TIERS.map(t => (
            <CCCard
              key={t.name}
              style={{
                padding: 18,
                borderTop: `4px solid ${t.color}`,
                position: 'relative',
              }}
            >
              {t.hilite && (
                <CCPill
                  tone='purple'
                  style={{ position: 'absolute', top: 12, right: 12 }}
                >
                  most-loved
                </CCPill>
              )}
              <div
                style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: t.bg,
                  color: t.color,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {t.name}
              </div>
              <div
                className='cc-display'
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  margin: '10px 0 4px',
                }}
              >
                {t.count}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--cc-mute)' }}>
                active members
              </div>
              <div style={{ marginTop: 12 }}>
                {t.perks.map(p => (
                  <div
                    key={p}
                    style={{
                      fontSize: 12,
                      color: 'var(--cc-ink-3)',
                      display: 'flex',
                      gap: 6,
                      alignItems: 'center',
                      padding: '3px 0',
                    }}
                  >
                    <CCIcons.check
                      size={12}
                      style={{ color: 'var(--cc-green)' }}
                    />{' '}
                    {p}
                  </div>
                ))}
              </div>
            </CCCard>
          ))}
        </div>

        <CCCard style={{ padding: 0 }}>
          <div
            style={{
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--cc-line-2)',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              All members · {MEMBERS.length + 203}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className='cc-btn cc-btn-sm'>
                <CCIcons.filter size={12} /> Tier · all
              </button>
              <button className='cc-btn cc-btn-sm' aria-label='Search'>
                <CCIcons.search size={12} />
              </button>
            </div>
          </div>
          <table className='cc-table'>
            <thead>
              <tr>
                <th>Member</th>
                <th>Tier</th>
                <th>Joined</th>
                <th>Last visit</th>
                <th>Sessions</th>
                <th>Spend</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {MEMBERS.map(m => (
                <tr key={m.n}>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <CCAvatar initials={m.n.slice(0, 2)} tone={m.tone} />
                      <span style={{ fontWeight: 600 }}>{m.n}</span>
                    </div>
                  </td>
                  <td>
                    <span className='cc-pill' style={tierPillStyle(m.t)}>
                      {m.t}
                    </span>
                  </td>
                  <td>{m.j}</td>
                  <td>{m.lv}</td>
                  <td style={{ fontVariantNumeric: 'tabular-nums' }}>{m.s}</td>
                  <td
                    style={{
                      fontVariantNumeric: 'tabular-nums',
                      fontWeight: 600,
                    }}
                  >
                    {m.sp}
                  </td>
                  <td>
                    <CCPill tone={STATUS_TONE[m.st]}>{m.st}</CCPill>
                  </td>
                  <td>
                    <button
                      className='cc-btn cc-btn-sm cc-btn-ghost'
                      aria-label='Member actions'
                    >
                      ···
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CCCard>
      </OwnerPageBody>
    </>
  );
}
