'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LogoMark({ stroke = '#5DA9FF', checkStroke = '#2B85E8' }: { stroke?: string; checkStroke?: string }) {
  return (
    <svg width="38" height="38" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="45" cy="42" r="30" fill="none" stroke={stroke} strokeWidth="12" />
      <path d="M67 64L88 85" stroke={stroke} strokeWidth="12" strokeLinecap="round" />
      <path d="M31 42L41 52L58 31" fill="none" stroke={checkStroke} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const STATUS_STEPS = [
  { label: 'Application Received', active: true, desc: 'Your submission is safely received in our queue' },
  { label: 'Under Review', active: false, desc: 'Our talent team evaluates commercial background and alignment' },
  { label: 'Verification Pending', active: false, desc: 'Contact details, track record and endorsements verified' },
  { label: 'Verified', active: false, desc: 'Verified status issued with verified badge' },
];

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('ref') || 'LV-TN-000100';
  const token = searchParams.get('token') || '';

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px', boxSizing: 'border-box', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Check icon + heading */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: '#EEF5FF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
              <circle cx="16" cy="16" r="16" fill="#1D5FB8" />
              <path d="M9 16.5L14 21.5L23 11" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 style={{ margin: 0, font: '700 36px/1.15 Poppins', color: '#0F2540' }}>Application received</h1>
          <p style={{ margin: 0, font: '400 16px/1.6 Inter', color: '#44546A' }}>
            Thank you for registering. We have sent a confirmation email to your address. Please keep your reference number to check your status or manage your registration.
          </p>
        </div>

        {/* Reference box */}
        <div style={{ background: '#EEF5FF', border: '1px solid #D5E3F5', borderRadius: 14, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ font: '600 11px Poppins', letterSpacing: '.12em', textTransform: 'uppercase', color: '#1D5FB8' }}>Your Reference Number</div>
          <div style={{ font: '700 32px/1 Poppins', color: '#0F2540' }}>{reference}</div>
          <div style={{ font: '400 13px Inter', color: '#44546A', marginTop: 4 }}>
            Quote this reference whenever contacting LeadVerify support.
          </div>
        </div>

        {/* Status Tracker */}
        <div style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 14, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ font: '600 15px Poppins', color: '#0F2540' }}>Verification Workflow Progress</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {STATUS_STEPS.map(({ label, active, desc }, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: active ? '#1D5FB8' : '#EEF5FF',
                  color: active ? '#fff' : '#44546A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  font: '600 12px Poppins', flexShrink: 0, marginTop: 2,
                }}>
                  {active ? '✓' : i + 1}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ font: `${active ? '600' : '500'} 15px Inter`, color: active ? '#0F2540' : '#44546A' }}>{label}</span>
                    {active && (
                      <span style={{ padding: '2px 8px', borderRadius: 12, font: '600 11px Poppins', background: '#EEF5FF', color: '#1D5FB8' }}>
                        Current Status
                      </span>
                    )}
                  </div>
                  <span style={{ font: '400 13px Inter', color: '#718096', marginTop: 2 }}>{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Self-service management links */}
        {token && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href={`/talent-network/status?token=${encodeURIComponent(token)}&ref=${encodeURIComponent(reference)}`}
              style={{
                display: 'inline-flex', alignItems: 'center', minHeight: 46, padding: '0 24px',
                borderRadius: 10, background: '#1D5FB8', color: '#fff', textDecoration: 'none', font: '600 14px Poppins',
              }}
            >
              Open Live Status Tracker
            </Link>
          </div>
        )}

        {/* Regulatory disclaimer */}
        <p style={{ margin: 0, font: '400 13px/1.6 Inter', color: '#718096', borderTop: '1px solid #E1ECFA', paddingTop: 20 }}>
          Registration is free and does not guarantee employment, client placement, contracts or earnings. LeadVerify processes your information in compliance with POPIA. You can request changes or withdraw at any time.
        </p>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <>
      <div style={{ background: '#fff', borderBottom: '1px solid #E1ECFA', padding: '0 48px', display: 'flex', alignItems: 'center', minHeight: 64 }}>
        <a href="/talent-network" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <LogoMark />
          <span style={{ font: '700 22px/1 Poppins,sans-serif', letterSpacing: '-0.02em' }}>
            <span style={{ color: '#2B85E8' }}>Lead</span><span style={{ color: '#5DA9FF' }}>Verify</span>
          </span>
        </a>
      </div>

      <main style={{ padding: '60px 0 90px', background: '#fff' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: 40, font: '500 15px Inter' }}>Loading confirmation...</div>}>
          <ConfirmationContent />
        </Suspense>
      </main>
    </>
  );
}
