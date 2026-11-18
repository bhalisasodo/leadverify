import type {
  FullApplicationRecord,
  ApplicationStatus,
  VerificationType,
  VerificationStatus,
} from '@/lib/types/talent';
import type { FullApplicationInput } from '@/lib/validation/application';

const STORAGE_KEY = 'leadverify_demo_db_v1';

const INITIAL_SAMPLES: FullApplicationRecord[] = [
  {
    applicant: {
      id: '00000000-0000-0000-0000-000000000001',
      reference: 'LV-TN-000122',
      firstName: 'Sipho',
      lastName: 'Dlamini',
      email: 'sipho.dlamini@example.co.za',
      phone: '+27 82 555 1234',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      country: 'South Africa',
      status: 'under_review',
      magicTokenHash: 'demo-token-hash-1',
      createdAt: '2026-11-12T08:30:00.000Z',
      updatedAt: '2026-11-13T10:15:00.000Z',
    },
    profile: {
      id: 'prof-001',
      applicantId: '00000000-0000-0000-0000-000000000001',
      jobTitle: 'Senior B2B Sales Executive',
      headline: 'Enterprise SaaS closer with 8+ years across Southern Africa',
      biography: 'Proven track record exceeding outbound quotas and closing enterprise deals.',
      yearsExperience: '6 to 10',
      employmentStatus: 'Between roles',
      linkedinUrl: 'https://linkedin.com/in/siphodlamini',
      createdAt: '2026-11-12T08:30:00.000Z',
      updatedAt: '2026-11-12T08:30:00.000Z',
    },
    categories: [
      { name: 'Sales', isPrimary: true },
      { name: 'Business development', isPrimary: false },
    ],
    skills: ['Cold calling', 'Closing deals', 'Pipeline management'],
    industries: ['Software, Cloud & Technology', 'Financial Services, Fintech & Insurance'],
    preferences: {
      id: 'pref-001',
      applicantId: '00000000-0000-0000-0000-000000000001',
      engagementTypes: ['Full-time contract', 'Permanent placement'],
      workModes: ['Remote', 'Hybrid'],
      weeklyAvailability: '40+ hours (Full-time)',
      preferredHours: 'Standard SAST business hours',
      earliestAvailability: '2026-12-01',
      compensationStructure: 'Base plus commission',
      compensationExpectation: 'R45,000 base + commission',
      languages: ['English', 'isiZulu'],
      tools: ['HubSpot', 'Salesforce'],
      createdAt: '2026-11-12T08:30:00.000Z',
      updatedAt: '2026-11-12T08:30:00.000Z',
    },
    documents: [
      {
        id: 'doc-001',
        applicantId: '00000000-0000-0000-0000-000000000001',
        kind: 'cv',
        storagePath: 'applicant-documents/cv/sipho_cv.pdf',
        originalName: 'Sipho_Dlamini_Executive_CV.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 1024 * 320,
        scanStatus: 'clean',
        uploadedAt: '2026-11-12T08:30:00.000Z',
      },
    ],
    verifications: [
      {
        id: 'ver-001',
        applicantId: '00000000-0000-0000-0000-000000000001',
        type: 'contact',
        status: 'verified',
        reviewerId: 'Reviewer-1',
        completedAt: '2026-11-13T09:00:00.000Z',
        evidenceReference: 'Phone verification on +27 82 555 1234',
        notes: 'Applicant answered and confirmed application details.',
        createdAt: '2026-11-13T09:00:00.000Z',
        updatedAt: '2026-11-13T09:00:00.000Z',
      },
    ],
    consents: [
      {
        id: 'con-001',
        applicantId: '00000000-0000-0000-0000-000000000001',
        purpose: 'application_processing',
        granted: true,
        policyVersion: '1.0',
        wordingVersion: '1.0',
        grantedAt: '2026-11-12T08:30:00.000Z',
      },
    ],
    history: [
      {
        id: 'hist-001',
        applicantId: '00000000-0000-0000-0000-000000000001',
        toStatus: 'application_received',
        changedBy: 'Applicant',
        note: 'Online talent application submitted',
        changedAt: '2026-11-12T08:30:00.000Z',
      },
      {
        id: 'hist-002',
        applicantId: '00000000-0000-0000-0000-000000000001',
        fromStatus: 'application_received',
        toStatus: 'under_review',
        changedBy: 'Senior Reviewer',
        note: 'Commencing background screening and commercial assessment',
        changedAt: '2026-11-13T10:15:00.000Z',
      },
    ],
  },
  {
    applicant: {
      id: '00000000-0000-0000-0000-000000000002',
      reference: 'LV-TN-000123',
      firstName: 'Thandi',
      lastName: 'Mokoena',
      email: 'thandi.mokoena@example.co.za',
      phone: '+27 71 234 5678',
      city: 'Johannesburg',
      province: 'Gauteng',
      country: 'South Africa',
      status: 'application_received',
      magicTokenHash: 'demo-token-hash-2',
      createdAt: '2026-11-14T09:00:00.000Z',
      updatedAt: '2026-11-14T09:00:00.000Z',
    },
    profile: {
      id: 'prof-002',
      applicantId: '00000000-0000-0000-0000-000000000002',
      jobTitle: 'Lead Generation Specialist',
      headline: 'Prospect research & appointment setting expert',
      biography: 'Specialised in cold outreach list building and high-conversion messaging.',
      yearsExperience: '3 to 5',
      employmentStatus: 'Self-employed or freelancer',
      createdAt: '2026-11-14T09:00:00.000Z',
      updatedAt: '2026-11-14T09:00:00.000Z',
    },
    categories: [{ name: 'Lead generation', isPrimary: true }],
    skills: ['Prospect research', 'Appointment setting', 'Cold calling'],
    industries: ['Software, Cloud & Technology', 'Professional Services & Consulting'],
    preferences: {
      id: 'pref-002',
      applicantId: '00000000-0000-0000-0000-000000000002',
      engagementTypes: ['Part-time contract', 'Freelance / Project-based'],
      workModes: ['Remote'],
      weeklyAvailability: '20 to 30 hours',
      preferredHours: 'Flexible',
      earliestAvailability: '2026-11-20',
      compensationStructure: 'Per appointment or lead fee',
      languages: ['English', 'Sesotho'],
      tools: ['LinkedIn Sales Navigator'],
      createdAt: '2026-11-14T09:00:00.000Z',
      updatedAt: '2026-11-14T09:00:00.000Z',
    },
    documents: [
      {
        id: 'doc-002',
        applicantId: '00000000-0000-0000-0000-000000000002',
        kind: 'cv',
        storagePath: 'applicant-documents/cv/thandi_cv.pdf',
        originalName: 'Thandi_Mokoena_CV.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 1024 * 210,
        scanStatus: 'clean',
        uploadedAt: '2026-11-14T09:00:00.000Z',
      },
    ],
    verifications: [],
    consents: [
      {
        id: 'con-002',
        applicantId: '00000000-0000-0000-0000-000000000002',
        purpose: 'application_processing',
        granted: true,
        policyVersion: '1.0',
        wordingVersion: '1.0',
        grantedAt: '2026-11-14T09:00:00.000Z',
      },
    ],
    history: [
      {
        id: 'hist-003',
        applicantId: '00000000-0000-0000-0000-000000000002',
        toStatus: 'application_received',
        changedBy: 'Applicant',
        note: 'Online talent application submitted',
        changedAt: '2026-11-14T09:00:00.000Z',
      },
    ],
  },
];

function getStoredRecords(): FullApplicationRecord[] {
  if (typeof window === 'undefined') return INITIAL_SAMPLES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLES));
      return INITIAL_SAMPLES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_SAMPLES;
  }
}

function saveStoredRecords(records: FullApplicationRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    // Ignore
  }
}

export const clientDemoDb = {
  getOverviewMetrics() {
    const all = getStoredRecords();
    return {
      totalRegistrations: all.length,
      newApplications: all.filter((r) => r.applicant.status === 'application_received').length,
      underReview: all.filter((r) => r.applicant.status === 'under_review').length,
      verified: all.filter((r) => r.applicant.status === 'verified').length,
      additionalInfo: all.filter((r) => r.applicant.status === 'additional_information_required').length,
    };
  },

  listApplications(filters?: { search?: string; status?: string; province?: string }) {
    let list = getStoredRecords();
    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter((r) =>
        r.applicant.reference.toLowerCase().includes(q) ||
        r.applicant.firstName.toLowerCase().includes(q) ||
        r.applicant.lastName.toLowerCase().includes(q) ||
        r.applicant.email.toLowerCase().includes(q) ||
        r.profile?.jobTitle?.toLowerCase().includes(q)
      );
    }
    if (filters?.status && filters.status !== 'all') {
      list = list.filter((r) => r.applicant.status === filters.status);
    }
    if (filters?.province && filters.province !== 'all') {
      list = list.filter((r) => r.applicant.province === filters.province);
    }
    return list;
  },

  getApplicationById(id: string): FullApplicationRecord | null {
    const list = getStoredRecords();
    return list.find((r) => r.applicant.id === id) || null;
  },

  getApplicationByToken(token: string): FullApplicationRecord | null {
    const list = getStoredRecords();
    return list.find((r) => r.applicant.magicTokenHash === token) || list[0] || null;
  },

  submitApplication(input: FullApplicationInput): { ok: boolean; reference: string; statusToken: string } {
    const list = getStoredRecords();
    const nextNum = list.length + 124;
    const reference = `LV-TN-${String(nextNum).padStart(6, '0')}`;
    const id = `app-demo-${Date.now()}`;
    const statusToken = `demo-token-${Date.now()}`;
    const now = new Date().toISOString();

    const newRecord: FullApplicationRecord = {
      applicant: {
        id,
        reference,
        firstName: input.personal.firstName,
        lastName: input.personal.lastName,
        email: input.personal.email,
        phone: input.personal.phone,
        city: input.personal.city,
        province: input.personal.province,
        country: input.personal.country,
        status: 'application_received',
        magicTokenHash: statusToken,
        createdAt: now,
        updatedAt: now,
      },
      profile: {
        id: `prof-${Date.now()}`,
        applicantId: id,
        jobTitle: input.professional.jobTitle,
        headline: input.professional.headline || '',
        biography: input.professional.biography || '',
        yearsExperience: input.professional.yearsExperience,
        employmentStatus: input.professional.employmentStatus,
        linkedinUrl: input.professional.linkedinUrl || '',
        portfolioUrl: input.professional.portfolioUrl || '',
        createdAt: now,
        updatedAt: now,
      },
      categories: [
        { name: input.expertise.primaryCategory, isPrimary: true },
        ...input.expertise.secondaryCategories.map((c) => ({ name: c, isPrimary: false })),
      ],
      skills: input.expertise.skills,
      industries: input.expertise.industries,
      preferences: {
        id: `pref-${Date.now()}`,
        applicantId: id,
        engagementTypes: input.preferences.workTypes,
        workModes: input.preferences.workModes,
        weeklyAvailability: input.preferences.weeklyAvailability,
        preferredHours: input.preferences.preferredHours || '',
        earliestAvailability: input.preferences.earliestAvailability,
        compensationStructure: input.preferences.compensationStructure,
        compensationExpectation: input.preferences.compensationExpectation || '',
        languages: input.expertise.languages,
        tools: [],
        createdAt: now,
        updatedAt: now,
      },
      documents: [
        {
          id: `doc-${Date.now()}`,
          applicantId: id,
          kind: 'cv',
          storagePath: input.documents.cv.storagePath || 'demo/cv.pdf',
          originalName: input.documents.cv.originalName || 'My_CV.pdf',
          mimeType: input.documents.cv.mimeType || 'application/pdf',
          sizeBytes: input.documents.cv.sizeBytes || 1024 * 250,
          scanStatus: 'clean',
          uploadedAt: now,
        },
      ],
      verifications: [],
      consents: [
        {
          id: `con-${Date.now()}`,
          applicantId: id,
          purpose: 'application_processing',
          granted: input.consent.consentProcessing,
          policyVersion: '1.0',
          wordingVersion: '1.0',
          grantedAt: now,
        },
      ],
      history: [
        {
          id: `hist-${Date.now()}`,
          applicantId: id,
          toStatus: 'application_received',
          changedBy: 'Applicant',
          note: 'Application successfully received via Talent Portal',
          changedAt: now,
        },
      ],
    };

    list.unshift(newRecord);
    saveStoredRecords(list);
    return { ok: true, reference, statusToken };
  },

  updateStatus(id: string, status: ApplicationStatus, note?: string): boolean {
    const list = getStoredRecords();
    const item = list.find((r) => r.applicant.id === id);
    if (!item) return false;

    const fromStatus = item.applicant.status;
    item.applicant.status = status;
    item.applicant.updatedAt = new Date().toISOString();
    item.history.unshift({
      id: `hist-${Date.now()}`,
      applicantId: id,
      fromStatus,
      toStatus: status,
      changedBy: 'Admin Reviewer',
      note: note || 'Status updated via admin console',
      changedAt: new Date().toISOString(),
    });

    saveStoredRecords(list);
    return true;
  },

  recordVerification(
    applicantId: string,
    type: VerificationType,
    status: VerificationStatus,
    evidenceReference?: string,
    notes?: string
  ): boolean {
    const list = getStoredRecords();
    const item = list.find((r) => r.applicant.id === applicantId);
    if (!item) return false;

    const now = new Date().toISOString();
    const existingIdx = item.verifications.findIndex((v) => v.type === type);
    const verRecord = {
      id: `ver-${Date.now()}`,
      applicantId,
      type,
      status,
      reviewerId: 'Admin Verifier',
      completedAt: status === 'verified' ? now : undefined,
      evidenceReference,
      notes,
      createdAt: now,
      updatedAt: now,
    };

    if (existingIdx >= 0) {
      item.verifications[existingIdx] = verRecord;
    } else {
      item.verifications.push(verRecord);
    }

    saveStoredRecords(list);
    return true;
  },

  withdrawApplication(token: string): boolean {
    const list = getStoredRecords();
    const item = list.find((r) => r.applicant.magicTokenHash === token) || list[0];
    if (!item) return false;

    item.applicant.status = 'withdrawn';
    item.applicant.withdrawnAt = new Date().toISOString();
    item.history.unshift({
      id: `hist-${Date.now()}`,
      applicantId: item.applicant.id,
      fromStatus: item.applicant.status,
      toStatus: 'withdrawn',
      changedBy: 'Applicant',
      note: 'Voluntary withdrawal via secure self-service portal',
      changedAt: new Date().toISOString(),
    });

    saveStoredRecords(list);
    return true;
  },
};
