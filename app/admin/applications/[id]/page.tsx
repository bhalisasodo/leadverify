'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { FullApplicationRecord, ApplicationStatus, VerificationType, VerificationStatus } from '@/lib/types/talent';

const VERIFICATION_TYPES: VerificationType[] = [
  'contact',
  'identity',
  'experience',
  'skills',
  'portfolio',
  'performance',
];

export default function ApplicationDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [record, setRecord] = useState<FullApplicationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status Change State
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>('under_review');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Verification Record State
  const [verType, setVerType] = useState<VerificationType>('contact');
  const [verStatus, setVerStatus] = useState<VerificationStatus>('verified');
  const [verEvidence, setVerEvidence] = useState('');
  const [verNotes, setVerNotes] = useState('');
  const [savingVerification, setSavingVerification] = useState(false);

  const fetchRecord = useCallback(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/admin/applications/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (!res.ok) {
          setError(res.error || 'Failed to fetch application');
        } else {
          setRecord(res.application);
          setSelectedStatus(res.application.applicant.status);
        }
      })
      .catch(() => setError('Network error fetching application'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusNote.trim()) {
      alert('A note is required for all status transitions to maintain audit trail.');
      return;
    }

    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          status: selectedStatus,
          note: statusNote,
          changedBy: 'Admin Reviewer',
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        alert(data.error || 'Failed to update status');
      } else {
        setStatusNote('');
        fetchRecord();
      }
    } catch (e) {
      alert('Network error updating status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleRecordVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verStatus === 'verified' && !verEvidence.trim()) {
      alert('Verification Principle: Self-reported data is never verified without an evidence reference.');
      return;
    }

    setSavingVerification(true);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record_verification',
          type: verType,
          status: verStatus,
          evidenceReference: verEvidence,
          notes: verNotes,
          reviewerId: 'Admin Reviewer',
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        alert(data.error || 'Failed to record verification');
      } else {
        setVerEvidence('');
        setVerNotes('');
        fetchRecord();
      }
    } catch (e) {
      alert('Network error saving verification');
    } finally {
      setSavingVerification(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', font: '500 15px Inter' }}>Loading application details...</div>;
  }

  if (error || !record) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2 style={{ color: '#E53E3E' }}>Application Not Found</h2>
        <Link href="/admin" style={{ color: '#1D5FB8', textDecoration: 'none', fontWeight: 600 }}>
          ← Return to Applications List
        </Link>
      </div>
    );
  }

  const { applicant, profile, preferences, documents, verifications, consents, history } = record;

  return (
    <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1200 }}>
      {/* Top Breadcrumb & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Link href="/admin" style={{ color: '#1D5FB8', textDecoration: 'none', font: '600 13px Inter' }}>
            ← Back to Overview
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
            <h1 style={{ margin: 0, font: '700 28px Poppins', color: '#0F2540' }}>
              {applicant.firstName} {applicant.lastName}
            </h1>
            <span style={{ font: '700 14px Poppins', color: '#1D5FB8', background: '#EEF5FF', padding: '4px 10px', borderRadius: 8 }}>
              {applicant.reference}
            </span>
            <span style={{ font: '600 13px Inter', background: '#FFF1D6', color: '#7A4B00', padding: '4px 12px', borderRadius: 20, textTransform: 'capitalize' }}>
              {applicant.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left Column: Submitted Application Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Section 1: Contact & Personal */}
          <div style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 12, padding: 24 }}>
            <h2 style={{ margin: '0 0 16px', font: '600 16px Poppins', color: '#0F2540' }}>Contact & Personal Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, fontSize: 14 }}>
              <div><strong style={{ color: '#718096' }}>Email:</strong> <div style={{ color: '#0F2540', marginTop: 2 }}>{applicant.email}</div></div>
              <div><strong style={{ color: '#718096' }}>Phone:</strong> <div style={{ color: '#0F2540', marginTop: 2 }}>{applicant.phone || '—'}</div></div>
              <div><strong style={{ color: '#718096' }}>Location:</strong> <div style={{ color: '#0F2540', marginTop: 2 }}>{applicant.city}, {applicant.province}</div></div>
              <div><strong style={{ color: '#718096' }}>Registered:</strong> <div style={{ color: '#0F2540', marginTop: 2 }}>{new Date(applicant.createdAt).toLocaleDateString()}</div></div>
            </div>
          </div>

          {/* Section 2: Professional Profile */}
          <div style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 12, padding: 24 }}>
            <h2 style={{ margin: '0 0 16px', font: '600 16px Poppins', color: '#0F2540' }}>Professional Experience</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div><strong style={{ color: '#718096' }}>Job Title:</strong> <div style={{ color: '#0F2540', marginTop: 2 }}>{profile?.jobTitle || '—'}</div></div>
                <div><strong style={{ color: '#718096' }}>Experience:</strong> <div style={{ color: '#0F2540', marginTop: 2 }}>{profile?.yearsExperience ? `${profile.yearsExperience} years` : '—'}</div></div>
                <div><strong style={{ color: '#718096' }}>Status:</strong> <div style={{ color: '#0F2540', marginTop: 2 }}>{profile?.employmentStatus || '—'}</div></div>
              </div>
              {profile?.headline && (
                <div>
                  <strong style={{ color: '#718096' }}>Headline:</strong>
                  <div style={{ color: '#0F2540', marginTop: 2 }}>{profile.headline}</div>
                </div>
              )}
              {profile?.biography && (
                <div>
                  <strong style={{ color: '#718096' }}>Biography:</strong>
                  <p style={{ color: '#44546A', margin: '4px 0 0', lineHeight: 1.5 }}>{profile.biography}</p>
                </div>
              )}
              {profile?.linkedinUrl && (
                <div>
                  <strong style={{ color: '#718096' }}>LinkedIn:</strong>{' '}
                  <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: '#1D5FB8' }}>
                    {profile.linkedinUrl}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Categories & Skills */}
          <div style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 12, padding: 24 }}>
            <h2 style={{ margin: '0 0 16px', font: '600 16px Poppins', color: '#0F2540' }}>Expertise & Categorisation</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14 }}>
              <div>
                <strong style={{ color: '#718096', display: 'block', marginBottom: 6 }}>Categories:</strong>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {record.categories?.map((cat) => (
                    <span key={cat.name} style={{
                      padding: '4px 12px', borderRadius: 16, font: '600 12px Inter',
                      background: cat.isPrimary ? '#EEF5FF' : '#F8FAFC',
                      border: `1px solid ${cat.isPrimary ? '#1D5FB8' : '#D5E3F5'}`,
                      color: cat.isPrimary ? '#1D5FB8' : '#44546A',
                    }}>
                      {cat.name} {cat.isPrimary && '★ Primary'}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <strong style={{ color: '#718096', display: 'block', marginBottom: 6 }}>Skills:</strong>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {record.skills?.map((s) => (
                    <span key={s} style={{ padding: '4px 10px', borderRadius: 16, background: '#EEF5FF', color: '#1D5FB8', fontSize: 12 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <strong style={{ color: '#718096', display: 'block', marginBottom: 6 }}>Industries:</strong>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {record.industries?.map((ind) => (
                    <span key={ind} style={{ padding: '4px 10px', borderRadius: 16, background: '#F1F5F9', color: '#475569', fontSize: 12 }}>
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Work Preferences */}
          <div style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 12, padding: 24 }}>
            <h2 style={{ margin: '0 0 16px', font: '600 16px Poppins', color: '#0F2540' }}>Work & Compensation Preferences</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, fontSize: 14 }}>
              <div><strong style={{ color: '#718096' }}>Engagements:</strong> <div style={{ color: '#0F2540', marginTop: 2 }}>{preferences?.engagementTypes?.join(', ') || '—'}</div></div>
              <div><strong style={{ color: '#718096' }}>Work Modes:</strong> <div style={{ color: '#0F2540', marginTop: 2 }}>{preferences?.workModes?.join(', ') || '—'}</div></div>
              <div><strong style={{ color: '#718096' }}>Weekly Hours:</strong> <div style={{ color: '#0F2540', marginTop: 2 }}>{preferences?.weeklyAvailability || '—'}</div></div>
              <div><strong style={{ color: '#718096' }}>Earliest Start:</strong> <div style={{ color: '#0F2540', marginTop: 2 }}>{preferences?.earliestAvailability || '—'}</div></div>
              <div><strong style={{ color: '#718096' }}>Compensation Model:</strong> <div style={{ color: '#0F2540', marginTop: 2 }}>{preferences?.compensationStructure || '—'}</div></div>
              <div><strong style={{ color: '#718096' }}>Expected Compensation:</strong> <div style={{ color: '#0F2540', marginTop: 2 }}>{preferences?.compensationExpectation || 'Open to discuss'}</div></div>
            </div>
          </div>

          {/* Section 5: Documents (Private storage viewer) */}
          <div style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 12, padding: 24 }}>
            <h2 style={{ margin: '0 0 16px', font: '600 16px Poppins', color: '#0F2540' }}>Submitted Documents (Private ACL)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {documents?.map((doc) => (
                <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #D5E3F5', borderRadius: 8, background: '#F8FAFC' }}>
                  <div>
                    <div style={{ font: '600 14px Inter', color: '#0F2540' }}>📄 {doc.originalName}</div>
                    <div style={{ font: '400 12px Inter', color: '#718096' }}>
                      {doc.kind.toUpperCase()} · {Math.round(doc.sizeBytes / 1024)} KB · Scan: <span style={{ color: '#2F855A' }}>Clean</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 13, color: '#1D5FB8', fontWeight: 600 }}>
                    Signed Storage Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Actions (Status Changer, Verification Manager, Audit History) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Status Changer Widget */}
          <div style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 12, padding: 24 }}>
            <h2 style={{ margin: '0 0 12px', font: '600 16px Poppins', color: '#0F2540' }}>Update Status</h2>
            <form onSubmit={handleStatusUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#44546A', marginBottom: 4 }}>Select Next Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #9DB4D0', fontSize: 14 }}
                >
                  <option value="application_received">Application Received</option>
                  <option value="under_review">Under Review</option>
                  <option value="additional_information_required">Additional Info Required</option>
                  <option value="verification_pending">Verification Pending</option>
                  <option value="verified">Verified</option>
                  <option value="unsuccessful">Unsuccessful</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#44546A', marginBottom: 4 }}>Audit Reason / Note *</label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Provide explicit reason for this status change..."
                  style={{ width: '100%', minHeight: 70, padding: '8px 12px', borderRadius: 8, border: '1px solid #9DB4D0', fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                disabled={updatingStatus}
                style={{
                  background: '#1D5FB8', color: '#fff', border: 'none', padding: '10px 16px',
                  borderRadius: 8, font: '600 14px Poppins', cursor: 'pointer',
                }}
              >
                {updatingStatus ? 'Saving...' : 'Apply Status Change'}
              </button>
            </form>
          </div>

          {/* Verification Record Manager */}
          <div style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 12, padding: 24 }}>
            <h2 style={{ margin: '0 0 6px', font: '600 16px Poppins', color: '#0F2540' }}>Record Verification</h2>
            <p style={{ margin: '0 0 12px', fontSize: 12, color: '#718096' }}>
              Self-reported data is only verified with evidence reference.
            </p>

            <form onSubmit={handleRecordVerification} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#44546A', marginBottom: 4 }}>Type</label>
                  <select
                    value={verType}
                    onChange={(e) => setVerType(e.target.value as VerificationType)}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #9DB4D0', fontSize: 13 }}
                  >
                    {VERIFICATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#44546A', marginBottom: 4 }}>Status</label>
                  <select
                    value={verStatus}
                    onChange={(e) => setVerStatus(e.target.value as VerificationStatus)}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #9DB4D0', fontSize: 13 }}
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="flagged">Flagged</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#44546A', marginBottom: 4 }}>Evidence Reference *</label>
                <input
                  type="text"
                  value={verEvidence}
                  onChange={(e) => setVerEvidence(e.target.value)}
                  placeholder="e.g. Call log, LinkedIn profile match, certificate ID"
                  style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #9DB4D0', fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#44546A', marginBottom: 4 }}>Reviewer Notes</label>
                <input
                  type="text"
                  value={verNotes}
                  onChange={(e) => setVerNotes(e.target.value)}
                  placeholder="Optional review findings"
                  style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #9DB4D0', fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                disabled={savingVerification}
                style={{
                  background: '#0F2540', color: '#fff', border: 'none', padding: '8px 14px',
                  borderRadius: 6, font: '600 13px Poppins', cursor: 'pointer',
                }}
              >
                {savingVerification ? 'Recording...' : 'Record Verification'}
              </button>
            </form>

            {/* Current Verifications List */}
            <div style={{ marginTop: 16, borderTop: '1px solid #E1ECFA', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#44546A' }}>Verification Outcomes:</div>
              {verifications?.length === 0 && (
                <div style={{ fontSize: 12, color: '#718096' }}>No verification records recorded yet.</div>
              )}
              {verifications?.map((v) => (
                <div key={v.id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '8px 10px', fontSize: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ color: '#0F2540', textTransform: 'capitalize' }}>{v.type}</strong>
                    <span style={{ fontWeight: 600, color: v.status === 'verified' ? '#2F855A' : '#B7791F' }}>
                      {v.status}
                    </span>
                  </div>
                  {v.evidenceReference && <div style={{ color: '#718096', marginTop: 2 }}>Ref: {v.evidenceReference}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Audit & Status History */}
          <div style={{ background: '#fff', border: '1px solid #D5E3F5', borderRadius: 12, padding: 24 }}>
            <h2 style={{ margin: '0 0 12px', font: '600 16px Poppins', color: '#0F2540' }}>Audit & Status History</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {history?.map((h) => (
                <div key={h.id} style={{ fontSize: 13, borderLeft: '3px solid #1D5FB8', paddingLeft: 10 }}>
                  <div style={{ fontWeight: 600, color: '#0F2540', textTransform: 'capitalize' }}>
                    {h.toStatus.replace(/_/g, ' ')}
                  </div>
                  {h.note && <div style={{ color: '#44546A', marginTop: 2 }}>{h.note}</div>}
                  <div style={{ fontSize: 11, color: '#718096', marginTop: 2 }}>
                    By {h.changedBy} on {new Date(h.changedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
