'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  fullApplicationSchema,
  SA_PROVINCES,
  EMPLOYMENT_STATUSES,
  YEARS_OF_EXPERIENCE,
  WORK_TYPES,
  WORK_MODES,
  WEEKLY_AVAILABILITY,
  COMPENSATION_STRUCTURES,
  CATEGORY_GROUPS,
  type FullApplicationInput,
} from '@/lib/validation/application';

function LogoMark({ stroke = '#5DA9FF', checkStroke = '#2B85E8' }: { stroke?: string; checkStroke?: string }) {
  return (
    <svg width="38" height="38" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="45" cy="42" r="30" fill="none" stroke={stroke} strokeWidth="12" />
      <path d="M67 64L88 85" stroke={stroke} strokeWidth="12" strokeLinecap="round" />
      <path d="M31 42L41 52L58 31" fill="none" stroke={checkStroke} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const labelStyle: React.CSSProperties = { font: '500 14px Inter', color: '#44546A', marginBottom: 6, display: 'block' };
const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '10px 14px',
  border: '1px solid #9DB4D0', borderRadius: 8, font: '400 15px Inter',
  color: '#0F2540', outline: 'none',
};
const errorText: React.CSSProperties = { color: '#E53E3E', fontSize: 13, marginTop: 4, fontFamily: 'Inter' };
const fieldRow: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 };
const fieldGroup: React.CSSProperties = { display: 'flex', flexDirection: 'column' };

const STEP_LABELS = ['Personal', 'Professional', 'Expertise', 'Preferences', 'Documents', 'Consent'];

const SKILL_TAGS = [
  'Cold calling', 'Prospect research', 'Appointment setting', 'Closing deals',
  'Pipeline management', 'HubSpot / Salesforce', 'Social selling (LinkedIn)', 'B2B Objection handling'
];

const INDUSTRY_TAGS = [
  'Software, Cloud & Technology', 'Financial Services & Insurance', 'Telecommunications',
  'Logistics & Transport', 'Professional Services & Consulting', 'Manufacturing & Heavy Industry'
];

const LANGUAGE_TAGS = ['English', 'Afrikaans', 'isiZulu', 'isiXhosa', 'Sesotho', 'Setswana'];

export default function TalentApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [draftNotice, setDraftNotice] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FullApplicationInput>({
    resolver: zodResolver(fullApplicationSchema) as any,
    mode: 'onTouched',
    defaultValues: {
      personal: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        province: 'Gauteng',
        country: 'South Africa',
      },
      professional: {
        jobTitle: '',
        employmentStatus: 'Employed full-time',
        yearsExperience: '3 to 5',
        headline: '',
        biography: '',
        linkedinUrl: '',
        portfolioUrl: '',
      },
      expertise: {
        primaryCategory: 'Sales',
        secondaryCategories: [],
        skills: ['Cold calling', 'Appointment setting'],
        industries: ['Software, Cloud & Technology'],
        languages: ['English'],
      },
      preferences: {
        workTypes: ['Full-time contract'],
        workModes: ['Remote', 'Hybrid'],
        weeklyAvailability: '40+ hours (Full-time)',
        preferredHours: '',
        earliestAvailability: new Date().toISOString().split('T')[0],
        compensationStructure: 'Fixed monthly retainer',
        compensationExpectation: '',
      },
      documents: {
        cv: {
          kind: 'cv',
          storagePath: '',
          originalName: '',
          mimeType: '',
          sizeBytes: 0,
        },
        certificates: [],
        referencesText: '',
      },
      consent: {
        consentProcessing: true,
        consentSharing: false,
        consentMarketing: false,
      },
    },
  });

  // Draft persistence in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('leadverify_talent_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        reset(parsed);
        setDraftNotice(true);
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [reset]);

  const formValues = watch();

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('leadverify_talent_draft', JSON.stringify(formValues));
      } catch (e) {
        // Ignore
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [formValues]);

  // Step Validation Guard before advancing
  const handleNextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger('personal');
    } else if (step === 2) {
      isValid = await trigger('professional');
    } else if (step === 3) {
      isValid = await trigger('expertise');
    } else if (step === 4) {
      isValid = await trigger('preferences');
    } else if (step === 5) {
      isValid = await trigger('documents');
      if (!formValues.documents?.cv?.storagePath) {
        setUploadError('Please upload your CV before proceeding.');
        return;
      }
    }

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 6));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CV File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCv(true);
    setUploadError(null);

    // Validate size and format
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File exceeds 10MB limit');
      setUploadingCv(false);
      return;
    }

    const fakePath = `applicant-documents/cv/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    setValue('documents.cv', {
      kind: 'cv',
      storagePath: fakePath,
      originalName: file.name,
      mimeType: file.type || 'application/pdf',
      sizeBytes: file.size,
    }, { shouldValidate: true });
    setUploadingCv(false);
  };

  const onSubmit = async (data: FullApplicationInput) => {
    setServerError(null);
    try {
      const { clientDemoDb } = await import('@/lib/services/clientDemo');
      const result = clientDemoDb.submitApplication(data);

      // Clear draft on successful submission
      try {
        localStorage.removeItem('leadverify_talent_draft');
      } catch (e) {
        // Ignore
      }

      router.push(`/talent-network/apply/confirmation?ref=${encodeURIComponent(result.reference)}&token=${encodeURIComponent(result.statusToken)}`);
    } catch (err: any) {
      setServerError('A network error occurred while submitting. Please try again.');
    }
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Top bar */}
      <header style={{ background: '#fff', borderBottom: '1px solid #E1ECFA', padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 64 }}>
        <Link href="/talent-network" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <LogoMark />
          <span style={{ font: '700 22px/1 Poppins,sans-serif', letterSpacing: '-0.02em' }}>
            <span style={{ color: '#2B85E8' }}>Lead</span><span style={{ color: '#5DA9FF' }}>Verify</span>
          </span>
        </Link>
        <div style={{ font: '500 13px Inter', color: '#44546A' }}>Talent Network Registration</div>
      </header>

      {draftNotice && (
        <div style={{ background: '#EEF5FF', borderBottom: '1px solid #D5E3F5', padding: '8px 24px', textAlign: 'center', fontSize: 13, color: '#1D5FB8' }}>
          We restored your previously saved application draft.
        </div>
      )}

      {/* Main Container */}
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 32px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 48, boxSizing: 'border-box' }}>
        {/* Step indicator sidebar */}
        <aside>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {STEP_LABELS.map((lbl, i) => {
              const n = i + 1;
              const isActive = n === step;
              const isDone = n < step;
              return (
                <li key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, background: isActive ? '#EEF5FF' : 'transparent' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: isActive || isDone ? '#1D5FB8' : '#EEF5FF',
                    color: isActive || isDone ? '#fff' : '#44546A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    font: '600 13px Poppins', flexShrink: 0,
                  }}>
                    {isDone ? '✓' : n}
                  </div>
                  <span style={{ font: `${isActive ? '600' : '400'} 14px Inter`, color: isActive ? '#0F2540' : '#44546A' }}>{lbl}</span>
                </li>
              );
            })}
          </ol>
        </aside>

        {/* Form Wizard Area */}
        <main>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {serverError && (
              <div style={{ background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: 8, padding: 14, color: '#C53030', fontSize: 14 }}>
                {serverError}
              </div>
            )}

            {/* ── STEP 1: PERSONAL INFORMATION ─────────────────────────────── */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <div style={{ font: '600 12px Poppins', letterSpacing: '.12em', color: '#1D5FB8', textTransform: 'uppercase', marginBottom: 6 }}>Step 1 of 6</div>
                  <h1 style={{ margin: 0, font: '700 30px/1.2 Poppins', color: '#0F2540' }}>Personal information</h1>
                  <p style={{ margin: '8px 0 0', font: '400 15px Inter', color: '#44546A' }}>We use these details to contact you about your application.</p>
                </div>

                <div style={fieldRow}>
                  <div style={fieldGroup}>
                    <label style={labelStyle}>First name *</label>
                    <input style={inputStyle} {...register('personal.firstName')} placeholder="e.g. Sipho" />
                    {errors.personal?.firstName && <span style={errorText}>{errors.personal.firstName.message}</span>}
                  </div>
                  <div style={fieldGroup}>
                    <label style={labelStyle}>Last name *</label>
                    <input style={inputStyle} {...register('personal.lastName')} placeholder="e.g. Dlamini" />
                    {errors.personal?.lastName && <span style={errorText}>{errors.personal.lastName.message}</span>}
                  </div>
                </div>

                <div style={fieldRow}>
                  <div style={fieldGroup}>
                    <label style={labelStyle}>Email address *</label>
                    <input style={inputStyle} type="email" {...register('personal.email')} placeholder="sipho@example.co.za" />
                    {errors.personal?.email && <span style={errorText}>{errors.personal.email.message}</span>}
                  </div>
                  <div style={fieldGroup}>
                    <label style={labelStyle}>Phone number *</label>
                    <input style={inputStyle} type="tel" {...register('personal.phone')} placeholder="+27 82 123 4567" />
                    {errors.personal?.phone && <span style={errorText}>{errors.personal.phone.message}</span>}
                  </div>
                </div>

                <div style={fieldRow}>
                  <div style={fieldGroup}>
                    <label style={labelStyle}>City *</label>
                    <input style={inputStyle} {...register('personal.city')} placeholder="e.g. Johannesburg" />
                    {errors.personal?.city && <span style={errorText}>{errors.personal.city.message}</span>}
                  </div>
                  <div style={fieldGroup}>
                    <label style={labelStyle}>Province *</label>
                    <select style={inputStyle} {...register('personal.province')}>
                      {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {errors.personal?.province && <span style={errorText}>{errors.personal.province.message}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: PROFESSIONAL INFORMATION ─────────────────────────── */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <div style={{ font: '600 12px Poppins', letterSpacing: '.12em', color: '#1D5FB8', textTransform: 'uppercase', marginBottom: 6 }}>Step 2 of 6</div>
                  <h1 style={{ margin: 0, font: '700 30px/1.2 Poppins', color: '#0F2540' }}>Professional details</h1>
                  <p style={{ margin: '8px 0 0', font: '400 15px Inter', color: '#44546A' }}>Tell us about your sales and commercial experience.</p>
                </div>

                <div style={fieldRow}>
                  <div style={fieldGroup}>
                    <label style={labelStyle}>Current or recent job title *</label>
                    <input style={inputStyle} {...register('professional.jobTitle')} placeholder="e.g. B2B Account Executive" />
                    {errors.professional?.jobTitle && <span style={errorText}>{errors.professional.jobTitle.message}</span>}
                  </div>
                  <div style={fieldGroup}>
                    <label style={labelStyle}>Employment status *</label>
                    <select style={inputStyle} {...register('professional.employmentStatus')}>
                      {EMPLOYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div style={fieldRow}>
                  <div style={fieldGroup}>
                    <label style={labelStyle}>Years of sales / commercial experience *</label>
                    <select style={inputStyle} {...register('professional.yearsExperience')}>
                      {YEARS_OF_EXPERIENCE.map((y) => <option key={y} value={y}>{y} years</option>)}
                    </select>
                  </div>
                  <div style={fieldGroup}>
                    <label style={labelStyle}>Professional headline (optional)</label>
                    <input style={inputStyle} {...register('professional.headline')} placeholder="e.g. Enterprise SaaS Closer & BD Specialist" />
                  </div>
                </div>

                <div style={fieldGroup}>
                  <label style={labelStyle}>Professional biography (optional)</label>
                  <textarea style={{ ...inputStyle, minHeight: 90 }} {...register('professional.biography')} placeholder="Summarise your key achievements and commercial strengths..." />
                </div>

                <div style={fieldRow}>
                  <div style={fieldGroup}>
                    <label style={labelStyle}>LinkedIn profile URL (optional)</label>
                    <input style={inputStyle} {...register('professional.linkedinUrl')} placeholder="https://linkedin.com/in/username" />
                  </div>
                  <div style={fieldGroup}>
                    <label style={labelStyle}>Portfolio or website URL (optional)</label>
                    <input style={inputStyle} {...register('professional.portfolioUrl')} placeholder="https://yourportfolio.co.za" />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: EXPERTISE & CATEGORIES ───────────────────────────── */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <div style={{ font: '600 12px Poppins', letterSpacing: '.12em', color: '#1D5FB8', textTransform: 'uppercase', marginBottom: 6 }}>Step 3 of 6</div>
                  <h1 style={{ margin: 0, font: '700 30px/1.2 Poppins', color: '#0F2540' }}>Professional expertise</h1>
                  <p style={{ margin: '8px 0 0', font: '400 15px Inter', color: '#44546A' }}>Select your primary category, skills, and industry specialisations.</p>
                </div>

                <div style={fieldGroup}>
                  <label style={labelStyle}>Primary Category * (Select exactly one)</label>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {CATEGORY_GROUPS.map((cat) => {
                      const isSelected = formValues.expertise?.primaryCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setValue('expertise.primaryCategory', cat, { shouldValidate: true })}
                          style={{
                            padding: '10px 18px', borderRadius: 24, font: '600 14px Inter', cursor: 'pointer',
                            border: `2px solid ${isSelected ? '#1D5FB8' : '#D5E3F5'}`,
                            background: isSelected ? '#EEF5FF' : '#fff',
                            color: isSelected ? '#1D5FB8' : '#44546A',
                          }}
                        >
                          {cat} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={fieldGroup}>
                  <label style={labelStyle}>Core Skills (Select all that apply)</label>
                  <Controller
                    name="expertise.skills"
                    control={control}
                    render={({ field }) => (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {SKILL_TAGS.map((skill) => {
                          const active = field.value?.includes(skill);
                          return (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => {
                                const next = active ? field.value.filter((s: string) => s !== skill) : [...(field.value || []), skill];
                                field.onChange(next);
                              }}
                              style={{
                                padding: '8px 14px', borderRadius: 20, font: '500 13px Inter', cursor: 'pointer',
                                border: `1px solid ${active ? '#1D5FB8' : '#D5E3F5'}`,
                                background: active ? '#EEF5FF' : '#fff',
                                color: active ? '#1D5FB8' : '#44546A',
                              }}
                            >
                              {skill}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>

                <div style={fieldGroup}>
                  <label style={labelStyle}>Industry Experience</label>
                  <Controller
                    name="expertise.industries"
                    control={control}
                    render={({ field }) => (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {INDUSTRY_TAGS.map((ind) => {
                          const active = field.value?.includes(ind);
                          return (
                            <button
                              key={ind}
                              type="button"
                              onClick={() => {
                                const next = active ? field.value.filter((s: string) => s !== ind) : [...(field.value || []), ind];
                                field.onChange(next);
                              }}
                              style={{
                                padding: '8px 14px', borderRadius: 20, font: '500 13px Inter', cursor: 'pointer',
                                border: `1px solid ${active ? '#1D5FB8' : '#D5E3F5'}`,
                                background: active ? '#EEF5FF' : '#fff',
                                color: active ? '#1D5FB8' : '#44546A',
                              }}
                            >
                              {ind}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>

                <div style={fieldGroup}>
                  <label style={labelStyle}>Languages</label>
                  <Controller
                    name="expertise.languages"
                    control={control}
                    render={({ field }) => (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {LANGUAGE_TAGS.map((lang) => {
                          const active = field.value?.includes(lang);
                          return (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => {
                                const next = active ? field.value.filter((s: string) => s !== lang) : [...(field.value || []), lang];
                                field.onChange(next);
                              }}
                              style={{
                                padding: '6px 12px', borderRadius: 16, font: '500 13px Inter', cursor: 'pointer',
                                border: `1px solid ${active ? '#1D5FB8' : '#D5E3F5'}`,
                                background: active ? '#EEF5FF' : '#fff',
                                color: active ? '#1D5FB8' : '#44546A',
                              }}
                            >
                              {lang}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>
              </div>
            )}

            {/* ── STEP 4: WORK PREFERENCES ─────────────────────────────────── */}
            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <div style={{ font: '600 12px Poppins', letterSpacing: '.12em', color: '#1D5FB8', textTransform: 'uppercase', marginBottom: 6 }}>Step 4 of 6</div>
                  <h1 style={{ margin: 0, font: '700 30px/1.2 Poppins', color: '#0F2540' }}>Work preferences</h1>
                  <p style={{ margin: '8px 0 0', font: '400 15px Inter', color: '#44546A' }}>What types of commercial engagements suit you best?</p>
                </div>

                <div style={fieldGroup}>
                  <label style={labelStyle}>Preferred engagement types *</label>
                  <Controller
                    name="preferences.workTypes"
                    control={control}
                    render={({ field }) => (
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {WORK_TYPES.map((t) => {
                          const active = field.value?.includes(t);
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => {
                                const next = active ? field.value.filter((x: string) => x !== t) : [...(field.value || []), t];
                                field.onChange(next);
                              }}
                              style={{
                                padding: '8px 16px', borderRadius: 20, font: '500 14px Inter', cursor: 'pointer',
                                border: `1.5px solid ${active ? '#1D5FB8' : '#D5E3F5'}`,
                                background: active ? '#EEF5FF' : '#fff',
                                color: active ? '#1D5FB8' : '#44546A',
                              }}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                  {errors.preferences?.workTypes && <span style={errorText}>{errors.preferences.workTypes.message}</span>}
                </div>

                <div style={fieldGroup}>
                  <label style={labelStyle}>Where do you work? *</label>
                  <Controller
                    name="preferences.workModes"
                    control={control}
                    render={({ field }) => (
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {WORK_MODES.map((m) => {
                          const active = field.value?.includes(m);
                          return (
                            <button
                              key={m}
                              type="button"
                              onClick={() => {
                                const next = active ? field.value.filter((x: string) => x !== m) : [...(field.value || []), m];
                                field.onChange(next);
                              }}
                              style={{
                                padding: '8px 16px', borderRadius: 20, font: '500 14px Inter', cursor: 'pointer',
                                border: `1.5px solid ${active ? '#1D5FB8' : '#D5E3F5'}`,
                                background: active ? '#EEF5FF' : '#fff',
                                color: active ? '#1D5FB8' : '#44546A',
                              }}
                            >
                              {m}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                  {errors.preferences?.workModes && <span style={errorText}>{errors.preferences.workModes.message}</span>}
                </div>

                <div style={fieldRow}>
                  <div style={fieldGroup}>
                    <label style={labelStyle}>Weekly availability *</label>
                    <select style={inputStyle} {...register('preferences.weeklyAvailability')}>
                      {WEEKLY_AVAILABILITY.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div style={fieldGroup}>
                    <label style={labelStyle}>Earliest availability date *</label>
                    <input style={inputStyle} type="date" {...register('preferences.earliestAvailability')} />
                  </div>
                </div>

                <div style={fieldRow}>
                  <div style={fieldGroup}>
                    <label style={labelStyle}>Preferred compensation structure *</label>
                    <select style={inputStyle} {...register('preferences.compensationStructure')}>
                      {COMPENSATION_STRUCTURES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={fieldGroup}>
                    <label style={labelStyle}>Compensation expectation note (optional)</label>
                    <input style={inputStyle} {...register('preferences.compensationExpectation')} placeholder="e.g. R35,000 / mo or R350 / hr" />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 5: SUPPORTING DOCUMENTS ─────────────────────────────── */}
            {step === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <div style={{ font: '600 12px Poppins', letterSpacing: '.12em', color: '#1D5FB8', textTransform: 'uppercase', marginBottom: 6 }}>Step 5 of 6</div>
                  <h1 style={{ margin: 0, font: '700 30px/1.2 Poppins', color: '#0F2540' }}>Supporting documents</h1>
                  <p style={{ margin: '8px 0 0', font: '400 15px Inter', color: '#44546A' }}>Upload your CV or resume. Stored privately and securely in compliance with POPIA.</p>
                </div>

                <div style={{ border: '2px dashed #9DB4D0', borderRadius: 12, padding: 32, textAlign: 'center', background: '#F8FAFC' }}>
                  <div style={{ font: '600 16px Poppins', color: '#0F2540', marginBottom: 6 }}>Upload your CV *</div>
                  <div style={{ font: '400 13px Inter', color: '#44546A', marginBottom: 16 }}>PDF, DOC, DOCX up to 10MB</div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="cv-upload-input"
                  />
                  <label
                    htmlFor="cv-upload-input"
                    style={{
                      display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '0 24px',
                      borderRadius: 10, font: '600 14px Poppins', background: '#1D5FB8', color: '#fff', cursor: 'pointer',
                    }}
                  >
                    {uploadingCv ? 'Uploading...' : 'Choose File'}
                  </label>

                  {formValues.documents?.cv?.originalName && (
                    <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EEF5FF', padding: '8px 16px', borderRadius: 8, color: '#1D5FB8', font: '500 14px Inter' }}>
                      <span>📄 {formValues.documents.cv.originalName}</span>
                      <span style={{ fontSize: 12, color: '#44546A' }}>({Math.round(formValues.documents.cv.sizeBytes / 1024)} KB)</span>
                    </div>
                  )}

                  {uploadError && <div style={{ ...errorText, marginTop: 12 }}>{uploadError}</div>}
                </div>

                <div style={fieldGroup}>
                  <label style={labelStyle}>References / Endorsements note (optional)</label>
                  <textarea style={{ ...inputStyle, minHeight: 80 }} {...register('documents.referencesText')} placeholder="Names, companies, or contact references we may contact with your permission..." />
                </div>
              </div>
            )}

            {/* ── STEP 6: CONSENT & SUBMIT ─────────────────────────────────── */}
            {step === 6 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <div style={{ font: '600 12px Poppins', letterSpacing: '.12em', color: '#1D5FB8', textTransform: 'uppercase', marginBottom: 6 }}>Step 6 of 6</div>
                  <h1 style={{ margin: 0, font: '700 30px/1.2 Poppins', color: '#0F2540' }}>Consent and submission</h1>
                  <p style={{ margin: '8px 0 0', font: '400 15px Inter', color: '#44546A' }}>Please review our consent agreements before submitting your application.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, background: '#F8FAFC', border: '1px solid #D5E3F5', borderRadius: 12, padding: 24 }}>
                  {/* Purpose 1 (Required) */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      style={{ marginTop: 4, width: 18, height: 18, accentColor: '#1D5FB8' }}
                      {...register('consent.consentProcessing')}
                    />
                    <div>
                      <span style={{ font: '600 15px Inter', color: '#0F2540' }}>Application processing consent (Required) *</span>
                      <p style={{ margin: '4px 0 0', font: '400 13px/1.5 Inter', color: '#44546A' }}>
                        I agree that LeadVerify may process my personal information, CV, and commercial background strictly to review my application for the LeadVerify Talent Network, in compliance with POPIA.
                      </p>
                    </div>
                  </label>
                  {errors.consent?.consentProcessing && <span style={errorText}>{errors.consent.consentProcessing.message}</span>}

                  <hr style={{ border: 'none', borderTop: '1px solid #D5E3F5', margin: 0 }} />

                  {/* Purpose 2 (Optional) */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      style={{ marginTop: 4, width: 18, height: 18, accentColor: '#1D5FB8' }}
                      {...register('consent.consentSharing')}
                    />
                    <div>
                      <span style={{ font: '600 15px Inter', color: '#0F2540' }}>Future client introduction sharing (Optional)</span>
                      <p style={{ margin: '4px 0 0', font: '400 13px/1.5 Inter', color: '#44546A' }}>
                        I agree that LeadVerify may consider introducing my profile to verified prospective commercial clients. (We will always confirm with you first before sharing personal contact details).
                      </p>
                    </div>
                  </label>

                  <hr style={{ border: 'none', borderTop: '1px solid #D5E3F5', margin: 0 }} />

                  {/* Purpose 3 (Optional) */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      style={{ marginTop: 4, width: 18, height: 18, accentColor: '#1D5FB8' }}
                      {...register('consent.consentMarketing')}
                    />
                    <div>
                      <span style={{ font: '600 15px Inter', color: '#0F2540' }}>Talent insights & events updates (Optional)</span>
                      <p style={{ margin: '4px 0 0', font: '400 13px/1.5 Inter', color: '#44546A' }}>
                        I wish to receive occasional news, market updates, and talent intelligence newsletters from LeadVerify.
                      </p>
                    </div>
                  </label>
                </div>

                <div style={{ background: '#EEF5FF', borderRadius: 8, padding: 16, fontSize: 13, color: '#44546A' }}>
                  <strong>Important Notice:</strong> Registration is 100% free and does not guarantee employment, client placement, contracts or earnings. You may update or withdraw your registration at any time.
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button type="button" onClick={handlePrevStep} style={{ minHeight: 48, padding: '0 24px', borderRadius: 10, border: '1.5px solid #1D5FB8', background: '#fff', color: '#1D5FB8', font: '600 15px Poppins', cursor: 'pointer' }}>
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      minHeight: 48, padding: '0 32px', borderRadius: 10,
                      background: '#1D5FB8', color: '#fff', border: 'none',
                      font: '600 16px Poppins', cursor: 'pointer',
                      opacity: isSubmitting ? 0.7 : 1,
                    }}
                  >
                    {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Nav for Steps 1–5 */}
            {step < 6 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid #D5E3F5' }}>
                <span style={{ font: '400 13px Inter', color: '#44546A' }}>Your progress is automatically saved.</span>
                <div style={{ display: 'flex', gap: 12 }}>
                  {step > 1 && (
                    <button type="button" onClick={handlePrevStep} style={{ minHeight: 44, padding: '0 20px', borderRadius: 10, border: '1.5px solid #1D5FB8', background: '#fff', color: '#1D5FB8', font: '600 14px Poppins', cursor: 'pointer' }}>
                      Back
                    </button>
                  )}
                  <button type="button" onClick={handleNextStep} style={{ minHeight: 44, padding: '0 24px', borderRadius: 10, border: 'none', background: '#1D5FB8', color: '#fff', font: '600 14px Poppins', cursor: 'pointer' }}>
                    Continue
                  </button>
                </div>
              </div>
            )}
          </form>
        </main>
      </div>
    </div>
  );
}
