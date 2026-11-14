'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Metrics {
  totalRegistrations: number;
  newApplications: number;
  underReview: number;
  verified: number;
  additionalInfo: number;
}

const statusBadgeStyles: Record<string, { bg: string; text: string }> = {
  application_received: { bg: '#E3EEFC', text: '#1D5FB8' },
  under_review: { bg: '#FFF1D6', text: '#7A4B00' },
  additional_information_required: { bg: '#FDE3E3', text: '#8A1C1C' },
  verification_pending: { bg: '#FEF3C7', text: '#92400E' },
  verified: { bg: '#DDF3E4', text: '#14532D' },
  unsuccessful: { bg: '#EDF2F7', text: '#4A5568' },
  withdrawn: { bg: '#EDF2F7', text: '#4A5568' },
};

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalRegistrations: 0,
    newApplications: 0,
    underReview: 0,
    verified: 0,
    additionalInfo: 0,
  });
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('all');

  const loadData = useCallback(() => {
    setLoading(true);
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (statusFilter !== 'all') query.set('status', statusFilter);
    if (provinceFilter !== 'all') query.set('province', provinceFilter);

    Promise.all([
      fetch('/api/admin/overview').then((r) => r.json()),
      fetch(`/api/admin/applications?${query.toString()}`).then((r) => r.json()),
    ])
      .then(([mRes, aRes]) => {
        if (mRes.ok) setMetrics(mRes.metrics);
        if (aRes.ok) setApplications(aRes.applications);
      })
      .catch((err) => console.error('Admin fetch error:', err))
      .finally(() => setLoading(false));
  }, [search, statusFilter, provinceFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadData]);

  return (
    <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, font: '700 28px Poppins', color: '#0F2540' }}>Talent Network overview</h1>
          <div style={{ font: '400 14px Inter', color: '#44546A', marginTop: 4 }}>
            Review, verify, and manage incoming applications.
          </div>
        </div>
        <button
          onClick={loadData}
          style={{
            background: '#fff', border: '1px solid #D5E3F5', borderRadius: 8,
            padding: '8px 16px', font: '600 13px Inter', color: '#1D5FB8', cursor: 'pointer',
          }}
        >
          Refresh Data
        </button>
      </div>

      {/* Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        <div style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 14, padding: 18 }}>
          <div style={{ font: '400 13px Inter', color: '#44546A' }}>Total registrations</div>
          <div style={{ font: '700 32px Poppins', color: '#0F2540', marginTop: 4 }}>{metrics.totalRegistrations}</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 14, padding: 18 }}>
          <div style={{ font: '400 13px Inter', color: '#44546A' }}>New applications</div>
          <div style={{ font: '700 32px Poppins', color: '#1D5FB8', marginTop: 4 }}>{metrics.newApplications}</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 14, padding: 18 }}>
          <div style={{ font: '400 13px Inter', color: '#44546A' }}>Under review</div>
          <div style={{ font: '700 32px Poppins', color: '#B7791F', marginTop: 4 }}>{metrics.underReview}</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 14, padding: 18 }}>
          <div style={{ font: '400 13px Inter', color: '#44546A' }}>Verified professionals</div>
          <div style={{ font: '700 32px Poppins', color: '#2F855A', marginTop: 4 }}>{metrics.verified}</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 14, padding: 18 }}>
          <div style={{ font: '400 13px Inter', color: '#44546A' }}>Additional info required</div>
          <div style={{ font: '700 32px Poppins', color: '#C53030', marginTop: 4 }}>{metrics.additionalInfo}</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
        <input
          type="text"
          placeholder="Search reference, name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            minHeight: 44, border: '1px solid #9DB4D0', borderRadius: 10,
            padding: '0 14px', font: '400 14px Inter', background: '#fff', outline: 'none',
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            minHeight: 44, border: '1px solid #9DB4D0', borderRadius: 10,
            padding: '0 14px', font: '400 14px Inter', background: '#fff', cursor: 'pointer',
          }}
        >
          <option value="all">All statuses</option>
          <option value="application_received">Application Received</option>
          <option value="under_review">Under Review</option>
          <option value="additional_information_required">Additional Info Required</option>
          <option value="verification_pending">Verification Pending</option>
          <option value="verified">Verified</option>
          <option value="withdrawn">Withdrawn</option>
        </select>

        <select
          value={provinceFilter}
          onChange={(e) => setProvinceFilter(e.target.value)}
          style={{
            minHeight: 44, border: '1px solid #9DB4D0', borderRadius: 10,
            padding: '0 14px', font: '400 14px Inter', background: '#fff', cursor: 'pointer',
          }}
        >
          <option value="all">All provinces</option>
          <option value="Gauteng">Gauteng</option>
          <option value="Western Cape">Western Cape</option>
          <option value="KwaZulu-Natal">KwaZulu-Natal</option>
          <option value="Eastern Cape">Eastern Cape</option>
          <option value="Free State">Free State</option>
          <option value="Limpopo">Limpopo</option>
          <option value="Mpumalanga">Mpumalanga</option>
          <option value="North West">North West</option>
          <option value="Northern Cape">Northern Cape</option>
        </select>
      </div>

      {/* Applications Table */}
      <div style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #D5E3F5' }}>
              <th scope="col" style={{ textAlign: 'left', padding: '12px 16px', font: '600 12px Poppins', letterSpacing: '.08em', color: '#44546A' }}>REFERENCE</th>
              <th scope="col" style={{ textAlign: 'left', padding: '12px 16px', font: '600 12px Poppins', letterSpacing: '.08em', color: '#44546A' }}>APPLICANT</th>
              <th scope="col" style={{ textAlign: 'left', padding: '12px 16px', font: '600 12px Poppins', letterSpacing: '.08em', color: '#44546A' }}>JOB TITLE</th>
              <th scope="col" style={{ textAlign: 'left', padding: '12px 16px', font: '600 12px Poppins', letterSpacing: '.08em', color: '#44546A' }}>PROVINCE</th>
              <th scope="col" style={{ textAlign: 'left', padding: '12px 16px', font: '600 12px Poppins', letterSpacing: '.08em', color: '#44546A' }}>STATUS</th>
              <th scope="col" style={{ textAlign: 'right', padding: '12px 16px', font: '600 12px Poppins', letterSpacing: '.08em', color: '#44546A' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} style={{ padding: '32px 16px', textAlign: 'center', color: '#718096', font: '400 14px Inter' }}>
                  Loading applications...
                </td>
              </tr>
            )}

            {!loading && applications.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '32px 16px', textAlign: 'center', color: '#718096', font: '400 14px Inter' }}>
                  No applications match your filter criteria.
                </td>
              </tr>
            )}

            {!loading && applications.map((rec) => {
              const statusStyle = statusBadgeStyles[rec.applicant.status] || { bg: '#EEF5FF', text: '#1D5FB8' };
              const primaryCat = rec.categories?.find((c: any) => c.isPrimary)?.name || rec.categories?.[0]?.name || 'Commercial';

              return (
                <tr key={rec.applicant.id} style={{ borderTop: '1px solid #D5E3F5' }}>
                  <td style={{ padding: '14px 16px', font: '600 14px Poppins', color: '#1D5FB8' }}>
                    {rec.applicant.reference}
                  </td>
                  <td style={{ padding: '14px 16px', font: '500 14px Inter', color: '#0F2540' }}>
                    <div>{rec.applicant.firstName} {rec.applicant.lastName}</div>
                    <div style={{ fontSize: 12, color: '#718096' }}>{rec.applicant.email}</div>
                  </td>
                  <td style={{ padding: '14px 16px', font: '400 14px Inter', color: '#44546A' }}>
                    <div>{rec.profile?.jobTitle || primaryCat}</div>
                    <div style={{ fontSize: 12, color: '#718096' }}>{rec.profile?.yearsExperience ? `${rec.profile.yearsExperience} yrs` : ''}</div>
                  </td>
                  <td style={{ padding: '14px 16px', font: '400 14px Inter', color: '#44546A' }}>
                    {rec.applicant.province || 'South Africa'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      font: '600 12px Inter', background: statusStyle.bg, color: statusStyle.text,
                      borderRadius: 999, padding: '4px 12px', whiteSpace: 'nowrap', display: 'inline-block',
                      textTransform: 'capitalize',
                    }}>
                      {rec.applicant.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <Link
                      href={`/admin/applications/${rec.applicant.id}`}
                      style={{
                        padding: '6px 14px', borderRadius: 8, background: '#1D5FB8', color: '#fff',
                        textDecoration: 'none', font: '600 13px Inter', display: 'inline-block',
                      }}
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
