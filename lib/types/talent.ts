export type ApplicationStatus =
  | 'application_received'
  | 'under_review'
  | 'additional_information_required'
  | 'verification_pending'
  | 'verified'
  | 'unsuccessful'
  | 'withdrawn';

export type DocumentKind = 'cv' | 'portfolio' | 'certificate' | 'reference' | 'identity';

export type VerificationType =
  | 'contact'
  | 'identity'
  | 'experience'
  | 'skills'
  | 'portfolio'
  | 'performance';

export type VerificationStatus =
  | 'unverified'
  | 'pending'
  | 'verified'
  | 'flagged'
  | 'rejected';

export type ConsentPurpose =
  | 'application_processing'
  | 'future_client_sharing'
  | 'marketing';

export type AdminRole = 'super_admin' | 'reviewer' | 'verifier';

export interface Applicant {
  id: string;
  reference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  province?: string;
  country: string;
  authUserId?: string;
  status: ApplicationStatus;
  magicTokenHash?: string;
  magicTokenExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
  withdrawnAt?: string;
  deletedAt?: string;
}

export interface ProfessionalProfile {
  id: string;
  applicantId: string;
  jobTitle: string;
  headline?: string;
  biography?: string;
  yearsExperience: string;
  employmentStatus: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkPreferences {
  id: string;
  applicantId: string;
  engagementTypes: string[];
  workModes: string[];
  weeklyAvailability: string;
  preferredHours?: string;
  earliestAvailability: string;
  compensationStructure?: string;
  compensationExpectation?: string;
  languages: string[];
  tools: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRecord {
  id: string;
  applicantId: string;
  kind: DocumentKind;
  storagePath: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  scanStatus: 'pending' | 'clean' | 'quarantined';
  uploadedAt: string;
  deletedAt?: string;
}

export interface VerificationRecord {
  id: string;
  applicantId: string;
  type: VerificationType;
  status: VerificationStatus;
  reviewerId?: string;
  completedAt?: string;
  evidenceReference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsentRecord {
  id: string;
  applicantId: string;
  purpose: ConsentPurpose;
  granted: boolean;
  policyVersion: string;
  wordingVersion: string;
  grantedAt: string;
  withdrawnAt?: string;
  ipHash?: string;
}

export interface ApplicationStatusHistory {
  id: string;
  applicantId: string;
  fromStatus?: ApplicationStatus;
  toStatus: ApplicationStatus;
  changedBy: string;
  note?: string;
  changedAt: string;
}

export interface AdministrativeUser {
  id: string;
  authUserId: string;
  email: string;
  role: AdminRole;
  active: boolean;
  createdAt: string;
}

export interface FullApplicationRecord {
  applicant: Applicant;
  profile: ProfessionalProfile;
  categories: { name: string; isPrimary: boolean }[];
  skills: string[];
  industries: string[];
  preferences: WorkPreferences;
  documents: DocumentRecord[];
  verifications: VerificationRecord[];
  consents: ConsentRecord[];
  history: ApplicationStatusHistory[];
}
