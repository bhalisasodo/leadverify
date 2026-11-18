import Image from 'next/image';

/* ─── SVG helpers ───────────────────────────────────────────────── */
function LogoMark({ stroke = '#5DA9FF', checkStroke = '#2B85E8' }: { stroke?: string; checkStroke?: string }) {
  return (
    <svg width="38" height="38" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="45" cy="42" r="30" fill="none" stroke={stroke} strokeWidth="12" />
      <path d="M67 64L88 85" stroke={stroke} strokeWidth="12" strokeLinecap="round" />
      <path d="M31 42L41 52L58 31" fill="none" stroke={checkStroke} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckCircle({ fill = '#2B85E8' }: { fill?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" style={{ flex: 'none' }}>
      <circle cx="10" cy="10" r="10" fill={fill} />
      <path d="M5.5 10.3L8.6 13.2L14.5 7" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function HomePage() {
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

  return (
    <>
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <header style={{ background: '#fff', borderBottom: '1px solid #E1ECFA' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px', boxSizing: 'border-box', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 76, gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoMark />
            <span style={{ font: '700 24px/1 Poppins,sans-serif', letterSpacing: '-0.02em' }}>
              <span style={{ color: '#2B85E8' }}>Lead</span><span style={{ color: '#5DA9FF' }}>Verify</span>
            </span>
          </div>
          <nav style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap', font: '500 15px Inter' }}>
            <a href="#services" style={{ color: '#44546A', textDecoration: 'none' }}>Services</a>
            <a href="#process"  style={{ color: '#44546A', textDecoration: 'none' }}>How we work</a>
            <a href="#team"     style={{ color: '#44546A', textDecoration: 'none' }}>Team</a>
            <a href="#work"     style={{ color: '#44546A', textDecoration: 'none' }}>Our work</a>
            <a href="/talent-network" style={{ color: '#44546A', textDecoration: 'none' }}>Talent Network</a>
            <a href="#contact" style={btnPrimary}>Book a discovery call</a>
          </nav>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(180deg,#EEF5FF,#fff)', padding: '80px 0 88px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px', boxSizing: 'border-box', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 56, alignItems: 'center' }}>
          {/* Left col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ font: '600 13px Poppins', letterSpacing: '.14em', color: '#1D5FB8', textTransform: 'uppercase' }}>
              B2B sales intelligence · South Africa
            </div>
            <h1 style={{ margin: 0, font: '700 56px/1.08 Poppins', color: '#0F2540', letterSpacing: '-0.02em' }}>
              Real sales conversations, <span style={{ color: '#2B85E8' }}>verified</span> from the first call.
            </h1>
            <p style={{ margin: 0, font: '400 19px/1.6 Inter', color: '#44546A', maxWidth: 540 }}>
              We find the right prospects, reach the decision-makers who matter and book the meetings, so you can focus on delivery.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#contact" style={btnPrimary}>Book a discovery call</a>
              <a href="#process" style={btnOutline}>See how we work</a>
            </div>
            <div style={{ font: '400 14px Inter', color: '#44546A' }}>
              Start with a 30 to 60 day pilot: one niche, one area, clear targets.
            </div>
          </div>

          {/* Right col — hero photo + glassmorphic card */}
          <div style={{ position: 'relative', paddingBottom: 40 }}>
            <Image
              src="/photos/hero.jpg"
              alt="A LeadVerify team member on a phone call in a bright Durban office"
              width={600}
              height={750}
              style={{ display: 'block', width: '100%', aspectRatio: '4/5', objectFit: 'cover', objectPosition: '62% 50%', borderRadius: 20 }}
            />
            {/* Glassmorphic card */}
            <div style={{ position: 'absolute', left: -56, bottom: 0, width: 'min(84%,340px)' }}>
              <div style={{ background: 'rgba(255,255,255,.62)', WebkitBackdropFilter: 'blur(14px)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,.7)', borderRadius: 20, padding: 28, boxShadow: '0 20px 50px rgba(15,37,64,.18)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ font: '600 13px Poppins', letterSpacing: '.1em', color: '#44546A' }}>FROM LIST TO MEETING</div>
                {[
                  { label: 'Prospect list built',      sub: 'Businesses that match your ideal customer' },
                  { label: 'Decision-maker found',     sub: 'The owner, MD or head of sales' },
                  { label: 'Contact details verified', sub: 'Outreach goes to the right person' },
                  { label: 'Meeting booked',           sub: 'Interested prospects in your calendar', dark: true },
                ].map(({ label, sub, dark }) => (
                  <div key={label} style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'rgba(238,245,255,.55)', borderRadius: 12, padding: '14px 16px' }}>
                    <CheckCircle fill={dark ? '#1D5FB8' : '#2B85E8'} />
                    <div>
                      <div style={{ font: '600 16px Poppins', color: '#0F2540' }}>{label}</div>
                      <div style={{ font: '400 14px Inter', color: '#44546A' }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ────────────────────────────────────── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E1ECFA', padding: '32px 0' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px', boxSizing: 'border-box', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 24 }}>
          {[
            { stat: 'June 2026',    label: 'Operating since' },
            { stat: 'B2B only',     label: 'One niche at a time' },
            { stat: '4 early clients', label: 'Supported since launch' },
            { stat: '30 to 60 days',  label: 'Recommended pilot' },
          ].map(({ stat, label }) => (
            <div key={stat}>
              <div style={{ font: '700 22px Poppins', color: '#0F2540' }}>{stat}</div>
              <div style={{ font: '400 14px Inter', color: '#44546A' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── STORY ───────────────────────────────────────────────── */}
      <section id="story" style={{ background: '#fff', padding: '88px 0' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px', boxSizing: 'border-box', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 56, alignItems: 'center' }}>
            <div>
              <Image
                src="/photos/story.jpg"
                alt="Two colleagues smiling over a printed prospect list in a café"
                width={560}
                height={373}
                style={{ display: 'block', width: '100%', aspectRatio: '3/2', objectFit: 'cover', objectPosition: '60% 40%', borderRadius: 20 }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ font: '600 13px Poppins', letterSpacing: '.14em', color: '#1D5FB8', textTransform: 'uppercase' }}>Why it works</div>
              <h2 style={{ margin: '10px 0 0', font: '700 40px/1.15 Poppins', color: '#0F2540', letterSpacing: '-0.01em', maxWidth: 720 }}>Selling is a human job.</h2>
              <p style={{ margin: 0, font: '400 18px/1.7 Inter', color: '#44546A' }}>
                Owners end up answering enquiries at night and chasing leads between jobs. We take that on, researching, reaching out and following up the way a good salesperson would, so you walk into every meeting with someone who already knows why they are talking to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────────── */}
      <section id="services" style={{ background: '#fff', padding: '88px 0' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px', boxSizing: 'border-box', width: '100%' }}>
          <div style={{ font: '600 13px Poppins', letterSpacing: '.14em', color: '#1D5FB8', textTransform: 'uppercase' }}>What we do</div>
          <h2 style={{ margin: '10px 0 0', font: '700 40px/1.15 Poppins', color: '#0F2540', letterSpacing: '-0.01em', maxWidth: 720 }}>Five services. Use them alone or together.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20, marginTop: 40 }}>
            {[
              { n: '01', title: 'Prospect list building',  body: 'Targeted lists of businesses that match your ideal customer, so your team stops guessing who to call.' },
              { n: '02', title: 'Decision-maker research', body: 'We find the person who can actually say yes, and confirm their contact details.' },
              { n: '03', title: 'Lead generation',         body: 'We start conversations through official business channels and pass interested prospects to you.' },
              { n: '04', title: 'Appointment setting',     body: 'We follow up so interest does not go cold, and confirm time, person and purpose.' },
              { n: '05', title: 'Sales team building',     body: 'We recruit, train and manage a sales team for your offer and market.' },
            ].map(({ n, title, body }) => (
              <div key={n} style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 10, font: '400 15px/1.6 Inter' }}>
                <div style={{ font: '700 15px Poppins', color: '#2B85E8' }}>{n}</div>
                <h3 style={{ margin: 0, font: '600 20px Poppins', color: '#0F2540' }}>{title}</h3>
                <p style={{ margin: 0, color: '#44546A' }}>{body}</p>
              </div>
            ))}
            <div style={{ background: '#1D5FB8', border: '1px solid #D5E3F5', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 10, font: '400 15px/1.6 Inter' }}>
              <h3 style={{ margin: 0, font: '600 20px Poppins', color: '#fff' }}>Use one, or all five</h3>
              <p style={{ margin: 0, color: '#E6F0FF' }}>Pick a single service or hand us the full sales effort. You choose how much we take on.</p>
              <a href="#contact" style={{ color: '#fff', font: '600 15px Poppins' }}>Tell us what you need</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ─────────────────────────────────────────────── */}
      <section id="process" style={{ background: '#EEF5FF', padding: '88px 0' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px', boxSizing: 'border-box', width: '100%' }}>
          <div style={{ font: '600 13px Poppins', letterSpacing: '.14em', color: '#1D5FB8', textTransform: 'uppercase' }}>How we work</div>
          <h2 style={{ margin: '10px 0 0', font: '700 40px/1.15 Poppins', color: '#0F2540', letterSpacing: '-0.01em', maxWidth: 720 }}>A simple process, so you always know what comes next.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 16, marginTop: 40 }}>
            {[
              { n: '1', title: 'Discovery call',      body: 'We learn about your business, offer and ideal customers.' },
              { n: '2', title: 'Scope and targets',   body: 'We agree what we will do, who we target and what a good result looks like.' },
              { n: '3', title: 'Research and build',  body: 'We build the list, identify decision-makers and, if needed, recruit and train a team.' },
              { n: '4', title: 'Outreach and meetings', body: 'We reach out, follow up and book meetings.' },
              { n: '5', title: 'Report and improve',  body: 'Regular updates. We review what works and adjust.' },
            ].map(({ n, title, body }) => (
              <div key={n} style={{ background: '#fff', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 20, background: '#1D5FB8', color: '#fff', font: '700 16px Poppins', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</div>
                <h3 style={{ margin: '6px 0 0', font: '600 18px Poppins', color: '#0F2540' }}>{title}</h3>
                <p style={{ margin: 0, font: '400 14px/1.6 Inter', color: '#44546A' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAYS TO WORK ────────────────────────────────────────── */}
      <section id="ways" style={{ background: '#fff', padding: '88px 0' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px', boxSizing: 'border-box', width: '100%' }}>
          <div style={{ font: '600 13px Poppins', letterSpacing: '.14em', color: '#1D5FB8', textTransform: 'uppercase' }}>Ways to work with us</div>
          <h2 style={{ margin: '10px 0 0', font: '700 40px/1.15 Poppins', color: '#0F2540', letterSpacing: '-0.01em', maxWidth: 720 }}>Three starting points. Mix and match.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20, marginTop: 40 }}>
            {/* RESEARCH */}
            <div style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 10, font: '400 15px/1.6 Inter' }}>
              <div style={{ font: '600 13px Poppins', letterSpacing: '.1em', color: '#1D5FB8' }}>RESEARCH</div>
              <h3 style={{ margin: 0, font: '600 22px Poppins', color: '#0F2540' }}>Know exactly who to approach</h3>
              {['Prospect list building', 'Decision-maker research', 'Verified contact details', 'Clean, usable delivery'].map(item => (
                <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <CheckCircle /><span>{item}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #D5E3F5', marginTop: 8, paddingTop: 14, color: '#44546A' }}>Best for businesses with a sales team that need better prospects.</div>
            </div>
            {/* OUTBOUND */}
            <div style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 10, font: '400 15px/1.6 Inter' }}>
              <div style={{ font: '600 13px Poppins', letterSpacing: '.1em', color: '#1D5FB8' }}>OUTBOUND</div>
              <h3 style={{ margin: 0, font: '600 22px Poppins', color: '#0F2540' }}>We start the conversations</h3>
              {['Everything in Research', 'Outbound calls and outreach', 'Follow-up on interested prospects', 'Appointment setting and progress updates'].map(item => (
                <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <CheckCircle /><span>{item}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #D5E3F5', marginTop: 8, paddingTop: 14, color: '#44546A' }}>Best for owners who want meetings without doing the prospecting.</div>
            </div>
            {/* SALES TEAM */}
            <div style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 10, font: '400 15px/1.6 Inter' }}>
              <div style={{ font: '600 13px Poppins', letterSpacing: '.1em', color: '#1D5FB8' }}>SALES TEAM</div>
              <h3 style={{ margin: 0, font: '600 22px Poppins', color: '#0F2540' }}>We build and run it for you</h3>
              {['Recruit and screen salespeople', 'Train them on your offer', 'Manage targets, coaching and results', 'Optional performance incentives'].map(item => (
                <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <CheckCircle /><span>{item}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #D5E3F5', marginTop: 8, paddingTop: 14, color: '#44546A' }}>Best for businesses that want a sales team without the setup.</div>
            </div>
          </div>
          <p style={{ margin: '28px 0 0', font: '400 15px/1.6 Inter', color: '#44546A', maxWidth: 720 }}>
            We price each engagement to your needs. After a discovery call you receive a written proposal with scope, targets and cost, so there are no surprises.
          </p>
        </div>
      </section>

      {/* ── RESPECTFUL BY DESIGN ────────────────────────────────── */}
      <section style={{ background: '#0F2540', padding: '80px 0' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px', boxSizing: 'border-box', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ font: '600 13px Poppins', letterSpacing: '.14em', color: '#8EC1FF', textTransform: 'uppercase' }}>How we approach outreach</div>
            <h2 style={{ margin: '10px 0 0', font: '700 40px/1.15 Poppins', color: '#fff', letterSpacing: '-0.01em', maxWidth: 720 }}>Respectful by design.</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              'Targeted, not bulk: we focus on businesses that fit your ideal customer.',
              'We contact businesses through their official business channels first.',
              'We speak to an individual only once the business shows interest.',
              'We stop contacting anyone who asks us to.',
            ].map(text => (
              <div key={text} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', font: '400 16px/1.5 Inter', color: '#fff' }}>
                <CheckCircle fill="#5DA9FF" /><span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ────────────────────────────────────────────────── */}
      <section id="team" style={{ background: '#fff', padding: '88px 0' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px', boxSizing: 'border-box', width: '100%' }}>
          <div style={{ font: '600 13px Poppins', letterSpacing: '.14em', color: '#1D5FB8', textTransform: 'uppercase' }}>The people</div>
          <h2 style={{ margin: '10px 0 0', font: '700 40px/1.15 Poppins', color: '#0F2540', letterSpacing: '-0.01em', maxWidth: 720 }}>We have done the work ourselves.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20, marginTop: 40 }}>
            {[
              {
                name: 'Mabotse Kekana',
                role: 'Founder and CEO',
                bio: 'Leads strategy, client relationships and sales. Hands-on in prospect research, decision-maker identification, outreach and appointment setting.',
                photo: '/photos/team/mabotse_kekana.jpg',
                objectPosition: '50% 20%',
              },
              {
                name: 'Zinande Lunika',
                role: 'Co-founder & Chief Revenue Officer (CRO)',
                bio: 'Leads revenue strategy and commercial execution, driving sales performance, client acquisition, relationship development and revenue growth. Turns commercial opportunities into measurable business results.',
                photo: '/photos/team/zinande_lunika.jpg',
                objectPosition: '50% 20%',
              },
              {
                name: 'Bhalisa Sodo',
                role: 'Co-founder & Chief Growth Officer (CGO)',
                bio: "Leads growth strategy, market intelligence and business expansion. Uses data-driven research, market positioning and strategic initiatives to identify opportunities, sharpen targeting and accelerate LeadVerify's growth.",
                photo: '/photos/team/bhalisa_sodo.jpg',
                objectPosition: '50% 5%',
              },
            ].map(({ name, role, bio, photo, objectPosition }) => (
              <div key={name} style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 10, font: '400 15px/1.6 Inter' }}>
                <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 20, overflow: 'hidden', background: '#EEF5FF' }}>
                  <Image
                    src={photo}
                    alt={`Portrait of ${name}, ${role}`}
                    width={400}
                    height={400}
                    style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition }}
                  />
                </div>
                <h3 style={{ margin: '6px 0 0', font: '600 20px Poppins', color: '#0F2540' }}>{name}</h3>
                <div style={{ font: '600 14px Poppins', color: '#1D5FB8' }}>{role}</div>
                <p style={{ margin: 0, color: '#44546A' }}>{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR WORK ────────────────────────────────────────────── */}
      <section id="work" style={{ background: '#EEF5FF', padding: '88px 0' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px', boxSizing: 'border-box', width: '100%' }}>
          <div style={{ font: '600 13px Poppins', letterSpacing: '.14em', color: '#1D5FB8', textTransform: 'uppercase' }}>Our work</div>
          <h2 style={{ margin: '10px 0 0', font: '700 40px/1.15 Poppins', color: '#0F2540', letterSpacing: '-0.01em', maxWidth: 720 }}>Four early clients since June 2026.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 16, marginTop: 40 }}>
            {[
              { tag: 'DECISION-MAKER RESEARCH AND VERIFIED CONTACT DATA', client: 'TaskFlow Solutions',   body: 'Identified the right decision-makers at target companies and delivered verified contacts ready for outreach.' },
              { tag: 'OUTBOUND LEAD GENERATION FOR WEB DESIGN',           client: 'RoyinTech Designs',    body: "Found businesses likely to need a better website and started conversations on the client's behalf." },
              { tag: 'ONGOING LEAD-GENERATION SUPPORT',                   client: 'RevLink Partners',     body: 'Worked as an extension of their sales effort, keeping outreach and follow-up moving week after week.' },
              { tag: 'LEAD GENERATION AND LIST BUILDING',                 client: 'Prometheus Digital',   body: 'Built matching prospect lists and kept the pipeline supplied with relevant prospects.' },
            ].map(({ tag, client, body }) => (
              <div key={client} style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 10, font: '400 15px/1.6 Inter' }}>
                <div style={{ font: '600 13px Poppins', color: '#1D5FB8', letterSpacing: '.06em' }}>{tag}</div>
                <h3 style={{ margin: 0, font: '600 20px Poppins', color: '#0F2540' }}>{client}</h3>
                <p style={{ margin: 0, color: '#44546A' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO GALLERY ───────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '72px 0 0' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px', boxSizing: 'border-box', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
          <Image src="/photos/research.jpg"  alt="Researching prospects at a laptop in a shared office"      width={360} height={270} style={{ display: 'block', width: '100%', aspectRatio: '4/3', objectFit: 'cover', objectPosition: '60% 50%', borderRadius: 20 }} />
          <Image src="/photos/call.jpg"      alt="Smiling on a headset call while taking notes"              width={360} height={270} style={{ display: 'block', width: '100%', aspectRatio: '4/3', objectFit: 'cover', objectPosition: '55% 50%', borderRadius: 20 }} />
          <Image src="/photos/handshake.jpg" alt="A handshake between two business owners after a meeting"  width={360} height={270} style={{ display: 'block', width: '100%', aspectRatio: '4/3', objectFit: 'cover', objectPosition: '50% 50%', borderRadius: 20 }} />
        </div>
      </section>

      {/* ── CONTACT CTA ─────────────────────────────────────────── */}
      <section id="contact" style={{ background: '#1D5FB8', padding: '88px 0' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px', boxSizing: 'border-box', width: '100%', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
          <h2 style={{ margin: 0, font: '700 44px/1.1 Poppins', color: '#fff', maxWidth: 720, letterSpacing: '-0.01em' }}>Tell us who you want more of as customers.</h2>
          <p style={{ margin: 0, font: '400 18px/1.6 Inter', color: '#E6F0FF', maxWidth: 640 }}>We will suggest what we can do and how to start, often with a 30 to 60 day pilot.</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="mailto:info@leadverify.co.za" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 52, padding: '0 28px', borderRadius: 12, font: '600 16px Poppins', textDecoration: 'none', background: '#fff', color: '#1D5FB8' }}>Email info@leadverify.co.za</a>
            <a href="tel:+27734166079"             style={{ display: 'inline-flex', alignItems: 'center', minHeight: 52, padding: '0 28px', borderRadius: 12, font: '600 16px Poppins', textDecoration: 'none', border: '2px solid #fff', color: '#fff' }}>Call +27 73 416 6079</a>
          </div>
          <div style={{ font: '400 14px Inter', color: '#CFE3FF' }}>Mabotse Kekana, Founder and CEO</div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer style={{ background: '#0F2540', padding: '40px 0' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px', boxSizing: 'border-box', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoMark stroke="#fff" checkStroke="#CFE3FF" />
            <span style={{ font: '700 24px/1 Poppins,sans-serif', letterSpacing: '-0.02em' }}>
              <span style={{ color: '#fff' }}>Lead</span><span style={{ color: '#CFE3FF' }}>Verify</span>
            </span>
          </div>
          <div style={{ font: '400 14px/1.6 Inter', color: '#B7CBE6' }}>
            LeadVerify (Pty) Ltd · Registration No: 2026/895558/07<br />
            Your outsourced sales intelligence partner. South Africa.<br />
            info@leadverify.co.za · +27 73 416 6079
          </div>
        </div>
      </footer>
    </>
  );
}
