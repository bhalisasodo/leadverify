import crypto from 'crypto';
import { getSupabase } from '@/lib/supabase/client';
import { emailService } from '@/lib/services/email';
import type {
  FullApplicationInput,
  PersonalInfoInput,
  ProfessionalInfoInput,
  ExpertiseInput,
  PreferencesInput,
  DocumentsInput,
  ConsentInput,
} from '@/lib/validation/application';
import type {
  FullApplicationRecord,
  Applicant,
  ProfessionalProfile,
  WorkPreferences,
  DocumentRecord,
  VerificationRecord,
  ConsentRecord,
  ApplicationStatusHistory,
  ApplicationStatus,
  VerificationType,
  VerificationStatus,
} from '@/lib/types/talent';

// ── In-Memory Fallback Store (Ensures seamless local development & testing) ────
class TalentStore {
  private static instance: TalentStore;
  private seq = 100;
  public records: Map<string, FullApplicationRecord> = new Map();

  private constructor() {
    this.seedSample();
  }

  public static getInstance(): TalentStore {
    if (!TalentStore.instance) {
      TalentStore.instance = new TalentStore();
    }
    return TalentStore.instance;
  }

  public nextReference(): string {
    this.seq += 1;
    return `LV-TN-${String(this.seq).padStart(6, '0')}`;
  }

  private seedSample() {
    const id = '00000000-0000-0000-0000-000000000001';
    const ref = 'LV-TN-000100';
    const now = new Date().toISOString();

    const sample: FullApplicationRecord = {
      applicant: {
        id,
        reference: ref,
        firstName: 'Sipho',
        lastName: 'Dlamini',
        email: 'sipho.dlamini@example.co.za',
        phone: '+27 82 555 1234',
        city: 'Johannesburg',
        province: 'Gauteng',
        country: 'South Africa',
        status: 'under_review',
        createdAt: now,
        updatedAt: now,
      },
      profile: {
        id: 'prof-001',
        applicantId: id,
        jobTitle: 'Senior B2B Sales Executive',
        headline: '10+ years closing enterprise SaaS and ICT solutions across Southern Africa',
        biography: 'Experienced sales professional specializing in high-ticket enterprise contracts, pipeline generation, and strategic objection handling.',
        yearsExperience: '6 to 10',
        employmentStatus: 'Between roles',
        linkedinUrl: 'https://linkedin.com/in/siphodlamini',
        createdAt: now,
        updatedAt: now,
      },
      categories: [
        { name: 'Sales', isPrimary: true },
        { name: 'Business development', isPrimary: false },
      ],
      skills: ['Cold calling', 'Closing deals', 'Pipeline management'],
      industries: ['Software, Cloud & Technology', 'Financial Services, Fintech & Insurance'],
      preferences: {
        id: 'pref-001',
        applicantId: id,
        engagementTypes: ['Full-time contract', 'Permanent placement'],
        workModes: ['Remote', 'Hybrid'],
        weeklyAvailability: '40+ hours (Full-time)',
        preferredHours: 'Standard SAST business hours',
        earliestAvailability: '2026-12-01',
        compensationStructure: 'Base plus commission',
        compensationExpectation: 'R45,000 base + performance incentives',
        languages: ['English', 'isiZulu'],
        tools: ['HubSpot', 'Salesforce', 'LinkedIn Sales Navigator'],
        createdAt: now,
        updatedAt: now,
      },
      documents: [
        {
          id: 'doc-001',
          applicantId: id,
          kind: 'cv',
          storagePath: 'applicant-documents/001/cv_sipho_dlamini.pdf',
          originalName: 'Sipho_Dlamini_Executive_CV.pdf',
          mimeType: 'application/pdf',
          sizeBytes: 1024 * 450,
          scanStatus: 'clean',
          uploadedAt: now,
        },
      ],
      verifications: [
        {
          id: 'ver-001',
          applicantId: id,
          type: 'contact',
          status: 'verified',
          reviewerId: 'admin-001',
          completedAt: now,
          evidenceReference: 'Phone verification with applicant completed on 2026-11-12',
          notes: 'Direct phone number and email confirmed responsive.',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'ver-002',
          applicantId: id,
          type: 'experience',
          status: 'pending',
          evidenceReference: 'Awaiting reference check from former sales director',
          createdAt: now,
          updatedAt: now,
        },
      ],
      consents: [
        {
          id: 'con-001',
          applicantId: id,
          purpose: 'application_processing',
          granted: true,
          policyVersion: '1.0',
          wordingVersion: '1.0',
          grantedAt: now,
        },
        {
          id: 'con-002',
          applicantId: id,
          purpose: 'future_client_sharing',
          granted: true,
          policyVersion: '1.0',
          wordingVersion: '1.0',
          grantedAt: now,
        },
      ],
      history: [
        {
          id: 'hist-001',
          applicantId: id,
          toStatus: 'application_received',
          changedBy: 'System',
          note: 'Online talent application submitted',
          changedAt: now,
        },
        {
          id: 'hist-002',
          applicantId: id,
          fromStatus: 'application_received',
          toStatus: 'under_review',
          changedBy: 'Reviewer',
          note: 'Initial profile screening commenced',
          changedAt: now,
        },
      ],
    };

    this.records.set(id, sample);
  }
}

const memoryStore = TalentStore.getInstance();

export const applicationService = {
  async submit(input: FullApplicationInput): Promise<{ ok: boolean; reference: string; statusToken: string }> {
    const supabase = getSupabase();
    const statusToken = crypto.randomBytes(24).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(statusToken).digest('hex');
    const tokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const now = new Date().toISOString();

    const id = crypto.randomUUID();
    const reference = memoryStore.nextReference();

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
        magicTokenHash: tokenHash,
        magicTokenExpiresAt: tokenExpires,
        createdAt: now,
        updatedAt: now,
      },
      profile: {
        id: crypto.randomUUID(),
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
        id: crypto.randomUUID(),
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
          id: crypto.randomUUID(),
          applicantId: id,
          kind: 'cv',
          storagePath: input.documents.cv.storagePath,
          originalName: input.documents.cv.originalName,
          mimeType: input.documents.cv.mimeType,
          sizeBytes: input.documents.cv.sizeBytes,
          scanStatus: 'clean',
          uploadedAt: now,
        },
      ],
      verifications: [],
      consents: [
        {
          id: crypto.randomUUID(),
          applicantId: id,
          purpose: 'application_processing',
          granted: input.consent.consentProcessing,
          policyVersion: '1.0',
          wordingVersion: '1.0',
          grantedAt: now,
        },
        {
          id: crypto.randomUUID(),
          applicantId: id,
          purpose: 'future_client_sharing',
          granted: input.consent.consentSharing,
          policyVersion: '1.0',
          wordingVersion: '1.0',
          grantedAt: now,
        },
        {
          id: crypto.randomUUID(),
          applicantId: id,
          purpose: 'marketing',
          granted: input.consent.consentMarketing,
          policyVersion: '1.0',
          wordingVersion: '1.0',
          grantedAt: now,
        },
      ],
      history: [
        {
          id: crypto.randomUUID(),
          applicantId: id,
          toStatus: 'application_received',
          changedBy: 'Applicant',
          note: 'Application successfully received online',
          changedAt: now,
        },
      ],
    };

    // If Supabase is available, insert into PostgreSQL
    if (supabase) {
      try {
        await supabase.from('applicants').insert({
          id,
          first_name: newRecord.applicant.firstName,
          last_name: newRecord.applicant.lastName,
          email: newRecord.applicant.email,
          phone: newRecord.applicant.phone,
          city: newRecord.applicant.city,
          province: newRecord.applicant.province,
          country: newRecord.applicant.country,
          status: 'application_received',
          magic_token_hash: tokenHash,
          magic_token_expires_at: tokenExpires,
        });
        // Profiles & Preferences
        await supabase.from('professional_profiles').insert({
          id: newRecord.profile.id,
          applicant_id: id,
          job_title: newRecord.profile.jobTitle,
          headline: newRecord.profile.headline,
          biography: newRecord.profile.biography,
          years_experience: newRecord.profile.yearsExperience,
          employment_status: newRecord.profile.employmentStatus,
          linkedin_url: newRecord.profile.linkedinUrl,
          portfolio_url: newRecord.profile.portfolioUrl,
        });
        await supabase.from('work_preferences').insert({
          id: newRecord.preferences.id,
          applicant_id: id,
          engagement_types: newRecord.preferences.engagementTypes,
          work_modes: newRecord.preferences.workModes,
          weekly_availability: newRecord.preferences.weeklyAvailability,
          preferred_hours: newRecord.preferences.preferredHours,
          earliest_availability: newRecord.preferences.earliestAvailability,
          compensation_structure: newRecord.preferences.compensationStructure,
          compensation_expectation: newRecord.preferences.compensationExpectation,
          languages: newRecord.preferences.languages,
          tools: newRecord.preferences.tools,
        });
      } catch (err) {
        console.warn('[ApplicationService] Supabase insert error, falling back to local store:', err);
      }
    }

    // Save to memory store as well
    memoryStore.records.set(id, newRecord);

    // Send confirmation email
    await emailService.sendApplicationReceived(input.personal.email, reference, statusToken);

    return { ok: true, reference, statusToken };
  },

  async list(filters?: { search?: string; status?: string; province?: string }): Promise<FullApplicationRecord[]> {
    let list = Array.from(memoryStore.records.values());

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter((r) =>
        r.applicant.reference.toLowerCase().includes(q) ||
        r.applicant.firstName.toLowerCase().includes(q) ||
        r.applicant.lastName.toLowerCase().includes(q) ||
        r.applicant.email.toLowerCase().includes(q) ||
        r.profile.jobTitle.toLowerCase().includes(q)
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

  async getById(id: string): Promise<FullApplicationRecord | null> {
    return memoryStore.records.get(id) || null;
  },

  async getByToken(token: string): Promise<FullApplicationRecord | null> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    for (const record of memoryStore.records.values()) {
      if (record.applicant.magicTokenHash === tokenHash) {
        return record;
      }
    }
    return null;
  },

  async updateStatus(
    id: string,
    toStatus: ApplicationStatus,
    changedBy: string,
    note?: string
  ): Promise<boolean> {
    const record = memoryStore.records.get(id);
    if (!record) return false;

    const fromStatus = record.applicant.status;
    record.applicant.status = toStatus;
    record.applicant.updatedAt = new Date().toISOString();

    record.history.unshift({
      id: crypto.randomUUID(),
      applicantId: id,
      fromStatus,
      toStatus,
      changedBy,
      note,
      changedAt: new Date().toISOString(),
    });

    await emailService.sendStatusUpdated(record.applicant.email, record.applicant.reference, toStatus, note);
    return true;
  },

  async recordVerification(
    applicantId: string,
    type: VerificationType,
    status: VerificationStatus,
    reviewerId: string,
    evidenceReference?: string,
    notes?: string
  ): Promise<boolean> {
    const record = memoryStore.records.get(applicantId);
    if (!record) return false;

    const existingIndex = record.verifications.findIndex((v) => v.type === type);
    const now = new Date().toISOString();

    const verification: VerificationRecord = {
      id: crypto.randomUUID(),
      applicantId,
      type,
      status,
      reviewerId,
      completedAt: status === 'verified' ? now : undefined,
      evidenceReference,
      notes,
      createdAt: now,
      updatedAt: now,
    };

    if (existingIndex >= 0) {
      record.verifications[existingIndex] = verification;
    } else {
      record.verifications.push(verification);
    }

    return true;
  },

  async withdrawByToken(token: string): Promise<boolean> {
    const record = await this.getByToken(token);
    if (!record) return false;

    record.applicant.status = 'withdrawn';
    record.applicant.withdrawnAt = new Date().toISOString();
    record.applicant.deletedAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(); // 90 days retention

    record.history.unshift({
      id: crypto.randomUUID(),
      applicantId: record.applicant.id,
      fromStatus: record.applicant.status,
      toStatus: 'withdrawn',
      changedBy: 'Applicant',
      note: 'Voluntary withdrawal via secure link',
      changedAt: new Date().toISOString(),
    });

    await emailService.sendWithdrawalConfirmed(record.applicant.email, record.applicant.reference);
    return true;
  },

  async getOverviewMetrics() {
    const all = Array.from(memoryStore.records.values());
    const totalRegistrations = all.length;
    const newApplications = all.filter((r) => r.applicant.status === 'application_received').length;
    const underReview = all.filter((r) => r.applicant.status === 'under_review').length;
    const verified = all.filter((r) => r.applicant.status === 'verified').length;
    const additionalInfo = all.filter((r) => r.applicant.status === 'additional_information_required').length;

    return {
      totalRegistrations,
      newApplications,
      underReview,
      verified,
      additionalInfo,
    };
  },
};
