import Image from 'next/image';
import Link from 'next/link';

/* ─── SVG helpers ────────────────────────────────────────────────────────── */
function LogoMark({ stroke = '#5DA9FF', checkStroke = '#2B85E8' }: { stroke?: string; checkStroke?: string }) {
  return (
    <svg width="38" height="38" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="45" cy="42" r="30" fill="none" stroke={stroke} strokeWidth="12" />
      <path d="M67 64L88 85" stroke={stroke} strokeWidth="12" strokeLinecap="round" />
      <path d="M31 42L41 52L58 31" fill="none" stroke={checkStroke} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function TalentNetworkPage() {
  const inner = { maxWidth: 1120, margin: '0 auto', padding: '0 32px', boxSizing: 'border-box' as const, width: '100%' };
  const btnPrimary: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', minHeight: 52,
    padding: '0 28px', borderRadius: 12, font: '600 16px Poppins',
    textDecoration: 'none', background: '#1D5FB8', color: '#fff',
  };
  const btnOutline: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', minHeight: 52,
    padding: '0 28px', borderRadius: 12, font: '600 16px Poppins',
    textDecoration: 'none', border: '2px solid #1D5FB8', color: '#1D5FB8',
  };
  const eyebrow: React.CSSProperties = {
    font: '600 13px Poppins', letterSpacing: '.14em', textTransform: 'uppercase',
    color: '#1D5FB8',
  };

  const whoCards = [
    {
      border: '#2B85E8', circle: '#2B85E8', textColor: '#fff',
      title: 'Sales',
      body: 'Sales representatives, SDRs, BDRs, account executives, closers, telesales',
    },
    {
      border: '#5DA9FF', circle: '#5DA9FF', textColor: '#0F2540',
      title: 'Business development',
      body: 'BD managers, partnership specialists, BD representatives',
    },
    {
      border: '#1D5FB8', circle: '#1D5FB8', textColor: '#fff',
      title: 'Lead generation',
      body: 'Lead generation, prospect research, lead qualification, appointment setting',
    },
    {
      border: '#5DA9FF', circle: '#5DA9FF', textColor: '#0F2540',
      title: 'Customer success',
      body: 'Customer success, account management, retention, customer support',
    },
    {
      border: '#2B85E8', circle: '#2B85E8', textColor: '#fff',
      title: 'Marketing',
      body: 'Digital, social media and email marketing, strategy, marketing analysis',
    },
    {
      border: '#0F2540', circle: '#0F2540', textColor: '#fff',
      title: 'Sales operations',
      body: 'CRM administration, sales operations, sales analysis, sales training',
    },
  ];

  const steps = [
    { n: 1, title: 'Apply', body: 'Complete a short online application. Most details are optional.' },
    { n: 2, title: 'We review', body: 'We check your application and may ask for more information.' },
    { n: 3, title: 'We verify', body: 'Contact details, experience, skills and evidence are checked separately.' },
    { n: 4, title: 'You stay informed', body: 'You receive a status update at each stage.' },
  ];

  const faqs = [
    {
      q: 'Is registration free?',
      a: 'Yes. There is no fee to register.',
    },
    {
      q: 'Does registering guarantee work?',
      a: 'No. Registration does not guarantee employment, client placement, contracts or earnings.',
    },
    {
      q: 'Who can see my information?',
      a: 'Only authorised LeadVerify staff. We do not publish profiles. We will only share your details with prospective clients if you separately agree to that.',
    },
    {
      q: 'Can I update or withdraw my application?',
      a: 'Yes. You can update your details or withdraw at any time using the link in your confirmation email.',
    },
  ];

  return (
    <>
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <header style={{ background: '#fff', borderBottom: '1px solid #E1ECFA' }}>
        <div style={{ ...inner, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 76, gap: 16, flexWrap: 'wrap' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <LogoMark />
            <span style={{ font: '700 24px/1 Poppins,sans-serif', letterSpacing: '-0.02em' }}>
              <span style={{ color: '#2B85E8' }}>Lead</span><span style={{ color: '#5DA9FF' }}>Verify</span>
            </span>
          </Link>
          <nav style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap', font: '500 15px Inter' }}>
            <Link href="/"          style={{ color: '#44546A', textDecoration: 'none' }}>Home</Link>
            <Link href="/#services" style={{ color: '#44546A', textDecoration: 'none' }}>Services</Link>
            <Link href="/#process"  style={{ color: '#44546A', textDecoration: 'none' }}>How We Work</Link>
            <Link href="/#team"     style={{ color: '#44546A', textDecoration: 'none' }}>Team</Link>
            <Link href="/#work"     style={{ color: '#44546A', textDecoration: 'none' }}>Our Work</Link>
            <Link href="/talent-network" style={{ color: '#1D5FB8', textDecoration: 'none', fontWeight: 600 }}>Talent Network</Link>
            <Link href="/#contact"  style={btnOutline}>Book a Discovery Call</Link>
          </nav>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(180deg,#EEF5FF,#fff)', padding: '80px 0' }}>
        <div style={{ ...inner, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 56, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ font: '600 13px Poppins', letterSpacing: '.14em', color: '#1D5FB8', textTransform: 'uppercase' }}>
              LeadVerify Talent Network · South Africa
            </div>
            <h1 style={{ margin: 0, font: '700 52px/1.1 Poppins', color: '#0F2540', letterSpacing: '-0.02em' }}>
              Your skills deserve better{' '}
              <span style={{ color: '#2B85E8' }}>opportunities</span>.
            </h1>
            <p style={{ margin: 0, font: '400 19px/1.6 Inter', color: '#44546A', maxWidth: 640 }}>
              Join a growing network of sales professionals and commercial talent. Build your professional profile, showcase your expertise and position yourself for future business opportunities.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#apply" style={btnPrimary}>Register for free</a>
              <a href="#how"   style={btnOutline}>How it works</a>
            </div>
            <p style={{ margin: 0, font: '400 14px/1.5 Inter', color: '#44546A' }}>
              Registration is free. It does not guarantee employment, client placement, contracts or earnings.
            </p>
          </div>
          <div>
            <Image
              src="/photos/tn_hero.jpg"
              alt="A smiling young professional laughing on a headset call at her desk"
              width={560}
              height={700}
              style={{ display: 'block', width: '100%', aspectRatio: '4/5', objectFit: 'cover', objectPosition: '50% 62%', borderRadius: 20 }}
              priority
            />
          </div>
        </div>
      </section>

      {/* ── WHAT IT IS ──────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div style={{ ...inner, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 56, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={eyebrow}>What it is</div>
            <h2 style={{ margin: 0, font: '700 40px/1.15 Poppins', color: '#0F2540', letterSpacing: '-0.01em' }}>
              A verified network, built one step at a time.
            </h2>
            <p style={{ margin: 0, font: '400 17px/1.7 Inter', color: '#44546A' }}>
              LeadVerify helps South African businesses find customers. We are building a structured network of freelance sales professionals and adjacent commercial talent we can vouch for. Right now we are recruiting and verifying professionals. Searchable profiles and client matching come later, and you will be asked separately before your details are shared with anyone.
            </p>
          </div>
          <div>
            <Image
              src="/photos/tn_network.jpg"
              alt="Four colleagues laughing together around a laptop in a bright café"
              width={560}
              height={373}
              style={{ display: 'block', width: '100%', aspectRatio: '3/2', objectFit: 'cover', borderRadius: 20 }}
            />
          </div>
        </div>
      </section>

      {/* ── WHO SHOULD REGISTER ─────────────────────────────────────────── */}
      <section style={{ background: '#1D5FB8', padding: '80px 0' }}>
        <div style={{ ...inner, display: 'flex', flexDirection: 'column', gap: 48 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ font: '600 13px Poppins', letterSpacing: '.14em', textTransform: 'uppercase', color: '#CFE3FF' }}>
              Who should register
            </div>
            <h2 style={{ margin: 0, font: '700 40px/1.15 Poppins', color: '#fff', letterSpacing: '-0.01em' }}>
              Sales professionals and adjacent commercial talent.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
            {whoCards.map(({ border, circle, textColor, title, body }, i) => (
              <div key={title} style={{ background: '#fff', borderRadius: 16, padding: 28, borderTop: `4px solid ${border}`, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: circle,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  font: '700 15px Poppins', color: textColor, flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <h3 style={{ margin: 0, font: '600 18px Poppins', color: '#0F2540' }}>{title}</h3>
                <p style={{ margin: 0, font: '400 15px/1.6 Inter', color: '#44546A' }}>{body}</p>
              </div>
            ))}
          </div>

          <p style={{ margin: 0, font: '400 15px/1.6 Inter', color: '#E6F0FF' }}>
            Choose more than one category. All nine provinces, and remote professionals, are welcome.
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section id="how" style={{ background: '#fff', padding: '80px 0' }}>
        <div style={{ ...inner, display: 'flex', flexDirection: 'column', gap: 48 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={eyebrow}>How it works</div>
            <h2 style={{ margin: 0, font: '700 40px/1.15 Poppins', color: '#0F2540', letterSpacing: '-0.01em' }}>
              From application to verified.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
            {steps.map(({ n, title, body }) => (
              <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', background: '#1D5FB8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  font: '700 18px Poppins', color: '#fff', flexShrink: 0,
                }}>
                  {n}
                </div>
                <h3 style={{ margin: 0, font: '600 18px Poppins', color: '#0F2540' }}>{title}</h3>
                <p style={{ margin: 0, font: '400 15px/1.6 Inter', color: '#44546A' }}>{body}</p>
              </div>
            ))}
          </div>

          <p style={{ margin: 0, font: '400 15px/1.5 Inter', color: '#44546A', borderLeft: '3px solid #D5E3F5', paddingLeft: 16 }}>
            <strong>Self-reported is not verified.</strong> Anything you tell us stays unverified until we have checked it against evidence.
          </p>
        </div>
      </section>

      {/* ── PHOTO GALLERY ───────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '0 0 80px' }}>
        <div style={{ ...inner, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
          <Image
            src="/photos/tn_celebrate.jpg"
            alt="A professional celebrating good news at his desk"
            width={360} height={270}
            style={{ display: 'block', width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 20 }}
          />
          <Image
            src="/photos/tn_network.jpg"
            alt="Professionals exchanging contacts at an evening networking event"
            width={360} height={270}
            style={{ display: 'block', width: '100%', aspectRatio: '4/3', objectFit: 'cover', objectPosition: '50% 50%', borderRadius: 20 }}
          />
          <Image
            src="/photos/tn_remote.jpg"
            alt="A professional working remotely from a sunny home office with a headset and laptop"
            width={360} height={270}
            style={{ display: 'block', width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 20 }}
          />
        </div>
      </section>

      {/* ── SIX SHORT STEPS ─────────────────────────────────────────────── */}
      <section style={{ background: '#0F2540', padding: '80px 0' }}>
        <div style={{ ...inner, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 56, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ font: '600 13px Poppins', letterSpacing: '.14em', textTransform: 'uppercase', color: '#8EC1FF' }}>
              What we ask for
            </div>
            <h2 style={{ margin: 0, font: '700 40px/1.15 Poppins', color: '#fff', letterSpacing: '-0.01em' }}>
              Six short steps.
            </h2>
            <p style={{ margin: 0, font: '400 17px/1.7 Inter', color: '#CFE3FF' }}>
              We only ask for what we need. We never ask for identity documents at registration.
            </p>
          </div>

          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              'Contact details and location',
              'Job title, experience and a short bio',
              'Your categories, skills and tools',
              'Work preferences and availability',
              'CV and portfolio (certificates and references optional)',
              'Three separate consents, each with its own explanation',
            ].map((item) => (
              <li key={item} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
                  <circle cx="10" cy="10" r="10" fill="#2B85E8" />
                  <path d="M5.5 10.3L8.6 13.2L14.5 7" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ font: '400 16px/1.6 Inter', color: '#fff' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div style={{ ...inner, display: 'flex', flexDirection: 'column', gap: 48 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={eyebrow}>Questions</div>
            <h2 style={{ margin: 0, font: '700 40px/1.15 Poppins', color: '#0F2540', letterSpacing: '-0.01em' }}>
              Frequently asked questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {faqs.map(({ q, a }) => (
              <details key={q} style={{ borderBottom: '1px solid #D5E3F5', paddingBottom: 0 }}>
                <summary style={{
                  cursor: 'pointer', listStyle: 'none',
                  font: '600 17px/1.4 Poppins', color: '#0F2540',
                  padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  {q}
                  <span style={{ font: '400 22px Poppins', color: '#1D5FB8', flexShrink: 0 }}>+</span>
                </summary>
                <p style={{ margin: '0 0 20px', font: '400 16px/1.7 Inter', color: '#44546A' }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────────────── */}
      <section id="apply" style={{ background: '#1D5FB8', padding: '80px 0' }}>
        <div style={{ ...inner, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
          <h2 style={{ margin: 0, font: '700 40px/1.1 Poppins', color: '#fff', letterSpacing: '-0.01em' }}>
            Ready to build your professional profile?
          </h2>
          <p style={{ margin: 0, font: '400 18px/1.6 Inter', color: '#E6F0FF' }}>
            It takes a few minutes. You can pause and come back.
          </p>
          <Link
            href="/talent-network/apply"
            style={{
              display: 'inline-flex', alignItems: 'center', minHeight: 52,
              padding: '0 32px', borderRadius: 12, font: '600 16px Poppins',
              textDecoration: 'none', background: '#fff', color: '#1D5FB8',
            }}
          >
            Register for free
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer style={{ background: '#0F2540', padding: '32px 0' }}>
        <div style={{ ...inner, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ font: '400 14px/1.6 Inter', color: '#B7CBE6' }}>
            LeadVerify (Pty) Ltd · Registration No: 2026/895558/07<br />
            Your outsourced sales intelligence partner.
          </div>
          <div style={{ font: '400 14px Inter', color: '#B7CBE6', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <a href="/privacy" style={{ color: '#B7CBE6' }}>Privacy notice</a>
            <a href="mailto:info@leadverify.co.za" style={{ color: '#B7CBE6' }}>info@leadverify.co.za</a>
          </div>
        </div>
      </footer>
    </>
  );
}
