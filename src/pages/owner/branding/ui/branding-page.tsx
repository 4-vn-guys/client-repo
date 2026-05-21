'use client';

import { useState } from 'react';
import {
  CCCard,
  CCIcons,
  CCPill,
  OwnerPageBody,
  OwnerPageHeader,
} from '@/shared/ui/court-connect';

function Field({
  label,
  value,
  mono,
  swatch,
}: {
  label: string;
  value: string;
  mono?: boolean;
  swatch?: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 11.5,
          fontWeight: 600,
          color: 'var(--cc-ink-3)',
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          border: '1px solid var(--cc-line)',
          borderRadius: 8,
          padding: '7px 10px',
          background: '#fff',
        }}
      >
        {swatch && (
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: swatch,
              border: '1px solid rgba(0,0,0,.1)',
            }}
          />
        )}
        <span
          style={{
            fontSize: 12.5,
            fontFamily: mono ? 'var(--cc-font-mono)' : 'inherit',
            color: 'var(--cc-ink-2)',
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

const TEMPLATE_TABS = [
  'Booking confirmed',
  'Cancellation',
  'Slot re-listed',
  'Match invite',
] as const;

const CHANNELS = [
  { l: 'Email', icon: <CCIcons.mail size={14} />, on: true },
  { l: 'SMS', icon: <CCIcons.phone size={14} />, on: true },
  { l: 'Push', icon: <CCIcons.bell size={14} />, on: true },
  { l: 'Zalo', icon: <CCIcons.msg size={14} />, on: false },
];

export function OwnerBrandingPage() {
  const [activeTab, setActiveTab] = useState<string>(TEMPLATE_TABS[0]);

  return (
    <>
      <OwnerPageHeader title='Branding & comms' />
      <OwnerPageBody>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}
        >
          <CCCard style={{ padding: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
              Tenant branding
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: 'var(--cc-mute)',
                marginBottom: 14,
              }}
            >
              How TVC Badminton appears to your players & in emails.
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              <Field label='Display name' value='TVC Badminton DaNang' />
              <Field label='Subdomain' value='tvc.courtconnect.app' mono />
              <Field label='Primary color' value='#7C3AED' swatch='#7C3AED' />
              <Field label='Accent color' value='#10B981' swatch='#10B981' />
            </div>

            <div style={{ marginTop: 14 }}>
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: 'var(--cc-ink-3)',
                  marginBottom: 6,
                }}
              >
                Logo
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 22,
                  }}
                >
                  TVC
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: 12,
                    border: '1px dashed var(--cc-mute-2)',
                    borderRadius: 10,
                    fontSize: 11.5,
                    color: 'var(--cc-mute)',
                    textAlign: 'center',
                    fontFamily: 'var(--cc-font-mono)',
                  }}
                >
                  Drop SVG / PNG · max 2MB
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: 'var(--cc-ink-3)',
                  marginBottom: 6,
                }}
              >
                Player-app preview
              </div>
              <div
                style={{
                  border: '1px solid var(--cc-line)',
                  borderRadius: 12,
                  padding: 14,
                  background: 'var(--cc-bg-2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 7,
                      background: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 9,
                      fontWeight: 700,
                    }}
                  >
                    TVC
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>
                    TVC Badminton
                  </span>
                  <CCPill tone='green' style={{ marginLeft: 'auto' }}>
                    Open
                  </CCPill>
                </div>
                <button
                  style={{
                    background: '#7C3AED',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Book a court
                </button>
              </div>
            </div>
          </CCCard>

          <CCCard style={{ padding: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
              Email & SMS templates
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: 'var(--cc-mute)',
                marginBottom: 14,
              }}
            >
              Each tenant can override copy. Variables:{' '}
              <span
                className='cc-mono'
                style={{
                  background: 'var(--cc-bg-3)',
                  padding: '0 4px',
                  borderRadius: 4,
                }}
              >
                {'{{name}}'}
              </span>{' '}
              <span
                className='cc-mono'
                style={{
                  background: 'var(--cc-bg-3)',
                  padding: '0 4px',
                  borderRadius: 4,
                }}
              >
                {'{{court}}'}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 4,
                padding: 3,
                background: 'var(--cc-bg-3)',
                borderRadius: 10,
                marginBottom: 12,
              }}
            >
              {TEMPLATE_TABS.map(label => {
                const active = activeTab === label;
                return (
                  <button
                    key={label}
                    onClick={() => setActiveTab(label)}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '6px 8px',
                      borderRadius: 8,
                      fontSize: 11.5,
                      fontWeight: 600,
                      background: active ? '#fff' : 'transparent',
                      color: active
                        ? 'var(--cc-purple-600)'
                        : 'var(--cc-ink-3)',
                      boxShadow: active ? 'var(--cc-shadow-sm)' : 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
              {CHANNELS.map(c => (
                <div
                  key={c.l}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: c.on ? 'var(--cc-purple-50)' : 'var(--cc-bg-3)',
                    color: c.on ? 'var(--cc-purple-600)' : 'var(--cc-mute)',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {c.icon}
                  {c.l}
                  {c.on && <CCIcons.check size={12} stroke={2.5} />}
                </div>
              ))}
            </div>

            <Field
              label='Subject (en)'
              value='Booking confirmed · {{court}} · {{date}}'
            />
            <div style={{ marginTop: 12 }}>
              <Field
                label='Subject (vi)'
                value='Đã đặt sân thành công · {{court}}'
              />
            </div>

            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: 'var(--cc-ink-3)',
                  marginBottom: 6,
                }}
              >
                Body
              </div>
              <div
                style={{
                  border: '1px solid var(--cc-line)',
                  borderRadius: 10,
                  padding: 14,
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  background: '#fff',
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  Hi{' '}
                  <span
                    style={{
                      background: 'var(--cc-purple-50)',
                      color: 'var(--cc-purple-600)',
                      padding: '0 5px',
                      borderRadius: 4,
                      fontFamily: 'var(--cc-font-mono)',
                      fontSize: 11.5,
                    }}
                  >
                    {'{{name}}'}
                  </span>
                  ,
                </div>
                <p style={{ margin: '8px 0', color: 'var(--cc-ink-2)' }}>
                  Your booking at <strong>TVC Badminton</strong> is confirmed
                  for{' '}
                  <span
                    style={{
                      background: 'var(--cc-purple-50)',
                      color: 'var(--cc-purple-600)',
                      padding: '0 5px',
                      borderRadius: 4,
                      fontFamily: 'var(--cc-font-mono)',
                      fontSize: 11.5,
                    }}
                  >
                    {'{{court}}'}
                  </span>{' '}
                  on{' '}
                  <span
                    style={{
                      background: 'var(--cc-purple-50)',
                      color: 'var(--cc-purple-600)',
                      padding: '0 5px',
                      borderRadius: 4,
                      fontFamily: 'var(--cc-font-mono)',
                      fontSize: 11.5,
                    }}
                  >
                    {'{{date}}'}
                  </span>
                  .
                </p>
                <p style={{ margin: '8px 0', color: 'var(--cc-ink-2)' }}>
                  Show this QR at the front desk.
                </p>
                <div
                  style={{
                    display: 'inline-block',
                    padding: 10,
                    border: '1px solid var(--cc-line)',
                    borderRadius: 8,
                  }}
                >
                  <svg width='60' height='60' viewBox='0 0 60 60'>
                    <rect width='60' height='60' fill='#fff' />
                    <rect x='6' y='6' width='14' height='14' fill='#0f1115' />
                    <rect x='40' y='6' width='14' height='14' fill='#0f1115' />
                    <rect x='6' y='40' width='14' height='14' fill='#0f1115' />
                    <g fill='#0f1115'>
                      <rect x='26' y='6' width='3' height='3' />
                      <rect x='32' y='10' width='3' height='3' />
                      <rect x='26' y='16' width='3' height='3' />
                      <rect x='36' y='26' width='3' height='3' />
                      <rect x='42' y='32' width='3' height='3' />
                      <rect x='48' y='40' width='3' height='3' />
                      <rect x='32' y='44' width='3' height='3' />
                      <rect x='40' y='48' width='3' height='3' />
                    </g>
                  </svg>
                </div>
                <p
                  style={{
                    margin: '8px 0 0',
                    color: 'var(--cc-mute)',
                    fontSize: 11,
                  }}
                >
                  — TVC Badminton · sent via Court Connect
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className='cc-btn cc-btn-sm'>Send test</button>
              <button className='cc-btn cc-btn-sm'>Reset to default</button>
              <button
                className='cc-btn cc-btn-sm cc-btn-primary'
                style={{ marginLeft: 'auto' }}
              >
                Save template
              </button>
            </div>
          </CCCard>
        </div>
      </OwnerPageBody>
    </>
  );
}
