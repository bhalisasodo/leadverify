import Link from 'next/link';

function LogoMark({ stroke = '#5DA9FF', checkStroke = '#2B85E8' }: { stroke?: string; checkStroke?: string }) {
  return (
    <svg width="34" height="34" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="45" cy="42" r="30" fill="none" stroke="#fff" strokeWidth="12" />
      <path d="M67 64L88 85" stroke="#fff" strokeWidth="12" strokeLinecap="round" />
      <path d="M31 42L41 52L58 31" fill="none" stroke="#5DA9FF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Dark Sidebar */}
      <aside style={{ background: '#0F2540', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 8, color: '#B7CBE6' }}>
        <div style={{ padding: '0 8px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoMark />
          <span style={{ font: '700 20px Poppins', color: '#fff' }}>LeadVerify</span>
        </div>

        <div style={{ font: '600 11px Poppins', letterSpacing: '.12em', color: '#7E9BBF', padding: '8px 12px', textTransform: 'uppercase' }}>
          TALENT ADMIN
        </div>

        <Link
          href="/admin"
          style={{
            padding: '12px 16px', borderRadius: 10, font: '600 14px Inter',
            color: '#fff', background: '#1D5FB8', textDecoration: 'none',
          }}
        >
          Overview & Applications
        </Link>

        <Link
          href="/talent-network"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '12px 16px', borderRadius: 10, font: '500 14px Inter',
            color: '#B7CBE6', textDecoration: 'none',
          }}
        >
          Public Talent Portal ↗
        </Link>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #1F3656', paddingTop: 16, paddingLeft: 12, paddingRight: 12 }}>
          <div style={{ font: '600 13px Inter', color: '#fff' }}>Admin Reviewer</div>
          <div style={{ font: '400 12px Inter', color: '#7E9BBF' }}>Internal Access Mode</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ background: '#EEF5FF', minHeight: '100vh', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
