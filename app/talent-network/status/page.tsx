'use client';

import { Suspense, useState, useEffect } from 'react';
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

function StatusContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const refParam = searchParams.get('ref') || '';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawnNotice, setWithdrawnNotice] = useState(false);

  useEffect(() => {
    import('@/lib/services/clientDemo').then(({ clientDemoDb }) => {
      const app = clientDemoDb.getApplicationByToken(token);
      if (app) {
        setData(app);
      } else {
        setError('No active application found matching this token.');
      }
      setLoading(false);
    });
  }, [token]);

  const handleWithdraw = async () => {
    if (!confirm('Are you sure you want to withdraw your application? This will cancel your verification and schedule your data for deletion under POPIA.')) {
      return;
    }

    setWithdrawing(true);
    const { clientDemoDb } = await import('@/lib/services/clientDemo');
    const ok = clientDemoDb.withdrawApplication(token);
    if (ok) {
      setWithdrawnNotice(true);
      if (data?.applicant) {
        setData({
          ...data,
          applicant: { ...data.applicant, status: 'withdrawn' },
        });
      }
    }
    setWithdrawing(false);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 60, font: '500 16px Inter', color: '#44546A' }}>Loading your application status...</div>;
  }

  if (error || !data) {
    return (
      <div style={{ maxWidth: 560, margin: '60px auto', padding: 32, background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: 12, textAlign: 'center' }}>
        <h2 style={{ color: '#C53030', margin: '0 0 12px', font: '700 24px Poppins' }}>Unable to Access Application</h2>
        <p style={{ color: '#44546A', fontSize: 15 }}>{error || 'The status link is invalid or has expired.'}</p>
        <Link href="/talent-network" style={{ display: 'inline-block', marginTop: 16, color: '#1D5FB8', fontWeight: 600, textDecoration: 'none' }}>
          ← Return to Talent Network
        </Link>
      </div>
    );
  }

  const { applicant, history } = data;

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {withdrawnNotice && (
          <div style={{ background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: 8, padding: 16, color: '#C53030', font: '500 14px Inter' }}>
            Your application has been successfully withdrawn. Personal information and documents are scheduled for deletion.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ font: '600 12px Poppins', letterSpacing: '.12em', color: '#1D5FB8', textTransform: 'uppercase' }}>Talent Application Tracker</div>
            <h1 style={{ margin: '4px 0 0', font: '700 32px Poppins', color: '#0F2540' }}>Hello, {applicant.firstName}</h1>
            <div style={{ font: '500 15px Inter', color: '#44546A', marginTop: 4 }}>
              Reference: <strong style={{ color: '#0F2540' }}>{applicant.reference || refParam}</strong>
            </div>
          </div>

          <div style={{
            padding: '6px 16px', borderRadius: 20, font: '600 13px Poppins', textTransform: 'capitalize',
            background: applicant.status === 'verified' ? '#C6F6D5' : applicant.status === 'withdrawn' ? '#EDF2F7' : '#EEF5FF',
            color: applicant.status === 'verified' ? '#22543D' : applicant.status === 'withdrawn' ? '#4A5568' : '#1D5FB8',
          }}>
            Status: {applicant.status.replace(/_/g, ' ')}
          </div>
        </div>

        {/* Activity & Review Timeline */}
        <div style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 12, padding: 24 }}>
          <h2 style={{ margin: '0 0 16px', font: '600 18px Poppins', color: '#0F2540' }}>Status Activity History</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {history?.map((h: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1D5FB8', marginTop: 6, flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ font: '600 14px Inter', color: '#0F2540', textTransform: 'capitalize' }}>
                    {h.toStatus.replace(/_/g, ' ')}
                  </div>
                  {h.note && <div style={{ font: '400 13px Inter', color: '#44546A', marginTop: 2 }}>{h.note}</div>}
                  <div style={{ font: '400 12px Inter', color: '#718096', marginTop: 4 }}>
                    {new Date(h.changedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        {applicant.status !== 'withdrawn' && (
          <div style={{ borderTop: '1px solid #E1ECFA', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <span style={{ font: '400 13px Inter', color: '#718096' }}>
              Want to remove your profile from consideration?
            </span>
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={withdrawing}
              style={{
                padding: '8px 18px', borderRadius: 8, border: '1px solid #E2E8F0',
                background: '#fff', color: '#E53E3E', font: '600 13px Inter', cursor: 'pointer',
              }}
            >
              {withdrawing ? 'Processing Withdrawal...' : 'Withdraw Application'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StatusPage() {
  return (
    <>
      <header style={{ background: '#fff', borderBottom: '1px solid #E1ECFA', padding: '0 48px', display: 'flex', alignItems: 'center', minHeight: 64 }}>
        <Link href="/talent-network" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <LogoMark />
          <span style={{ font: '700 22px/1 Poppins,sans-serif', letterSpacing: '-0.02em' }}>
            <span style={{ color: '#2B85E8' }}>Lead</span><span style={{ color: '#5DA9FF' }}>Verify</span>
          </span>
        </Link>
      </header>

      <main style={{ padding: '60px 0 90px', background: '#F8FAFC', minHeight: 'calc(100vh - 64px)' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: 40, font: '500 15px Inter' }}>Loading application status...</div>}>
          <StatusContent />
        </Suspense>
      </main>
    </>
  );
}
