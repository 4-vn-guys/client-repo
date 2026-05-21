'use client';

import { Fragment, useState } from 'react';
import {
  CCCard,
  CCIcons,
  CCPill,
  CCStat,
  CCToggle,
  OwnerPageBody,
  OwnerPageHeader,
} from '@/shared/ui/court-connect';
import {
  DAYS,
  DEFAULT_RULES,
  HOURS,
  TIER_COLORS,
  TIER_PRICES,
  priceFor,
  tierFor,
  type AutoPilotRule,
} from '../model/pricing';

export function OwnerYieldPage() {
  const [rules, setRules] = useState<AutoPilotRule[]>(DEFAULT_RULES);
  const [autoPilot, setAutoPilot] = useState(true);
  const activeCount = rules.filter(r => r.on).length;

  return (
    <>
      <OwnerPageHeader
        title='Yield · Dynamic pricing'
        actions={
          <>
            <button className='cc-btn'>
              <CCIcons.cal size={14} /> Week of May 4
            </button>
            <button className='cc-btn cc-btn-primary'>
              <CCIcons.bolt size={14} /> Apply changes
            </button>
          </>
        }
      />
      <OwnerPageBody>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: 12,
            marginBottom: 18,
          }}
        >
          <CCStat
            label='Forecasted revenue'
            value='38.4M'
            delta='12% vs last wk'
          />
          <CCStat label='Slot occupancy' value='74%' delta='6 pts' />
          <CCStat
            label='Auto-pilot saves'
            value='42 slots'
            delta='filled w/ flash sale'
          />
          <CCStat label='Avg yield/court' value='1.18M' delta='9%' />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 18,
          }}
        >
          <CCCard style={{ padding: 16 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>
                  Heat-grid · Court A
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--cc-mute)' }}>
                  Color = price tier · click cell to override
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11.5,
                }}
              >
                {TIER_PRICES.map((p, i) => (
                  <span
                    key={p}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        background: TIER_COLORS[i],
                      }}
                    />
                    {p}k
                  </span>
                ))}
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '40px repeat(16, 1fr)',
                gap: 0,
              }}
            >
              <div />
              {HOURS.map(h => (
                <div
                  key={h}
                  style={{
                    fontSize: 9.5,
                    color: 'var(--cc-mute)',
                    textAlign: 'center',
                    padding: '0 0 6px',
                  }}
                >
                  {h}
                </div>
              ))}
              {DAYS.map((d, di) => (
                <Fragment key={d}>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--cc-ink-3)',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {d}
                  </div>
                  {HOURS.map(h => {
                    const t = tierFor(di, h);
                    return (
                      <div
                        key={h}
                        style={{
                          height: 28,
                          fontSize: 9,
                          borderRight: '1px solid rgba(255,255,255,.4)',
                          borderTop: '1px solid rgba(255,255,255,.4)',
                          background: TIER_COLORS[t],
                          color: t >= 4 ? '#fff' : 'var(--cc-ink-3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontVariantNumeric: 'tabular-nums',
                          cursor: 'pointer',
                        }}
                      >
                        {priceFor(t)}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </CCCard>

          <CCCard style={{ padding: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <CCIcons.bolt size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Auto-Pilot</div>
                <div style={{ fontSize: 11.5, color: 'var(--cc-mute)' }}>
                  AI yield rules · {activeCount} active
                </div>
              </div>
              <CCToggle
                on={autoPilot}
                onChange={setAutoPilot}
                ariaLabel='Toggle Auto-Pilot'
              />
            </div>

            {rules.map((r, i) => (
              <div
                key={r.id}
                style={{
                  padding: '10px 0',
                  borderTop: i ? '1px solid var(--cc-line-2)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>
                    {r.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--cc-mute)',
                      marginTop: 1,
                    }}
                  >
                    {r.desc}
                  </div>
                  <CCPill tone='purple' style={{ marginTop: 4, fontSize: 10 }}>
                    {r.val}
                  </CCPill>
                </div>
                <CCToggle
                  on={r.on}
                  onChange={next =>
                    setRules(prev =>
                      prev.map(p => (p.id === r.id ? { ...p, on: next } : p))
                    )
                  }
                  ariaLabel={`Toggle ${r.name}`}
                />
              </div>
            ))}
            <button
              className='cc-btn cc-btn-sm'
              style={{ marginTop: 10, width: '100%' }}
            >
              <CCIcons.plus size={12} /> New rule
            </button>
          </CCCard>
        </div>
      </OwnerPageBody>
    </>
  );
}
