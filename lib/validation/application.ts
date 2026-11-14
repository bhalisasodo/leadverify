import { z } from 'zod';

export const SA_PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
  'Western Cape',
] as const;

export const EMPLOYMENT_STATUSES = [
  'Employed full-time',
  'Employed part-time',
  'Self-employed or freelancer',
  'Between roles',
  'Student or recent graduate',
  'Other',
] as const;

export const YEARS_OF_EXPERIENCE = [
  'Less than 1',
  '1 to 2',
  '3 to 5',
  '6 to 10',
  'More than 10',
] as const;

export const WORK_TYPES = [
  'Full-time contract',
  'Part-time contract',
  'Freelance / Project-based',
  'Permanent placement',
] as const;

export const WORK_MODES = [
  'Remote',
  'Hybrid',
  'On-site',
] as const;

export const WEEKLY_AVAILABILITY = [
  'Under 10 hours',
  '10 to 20 hours',
  '20 to 30 hours',
  '30 to 40 hours',
  '40+ hours (Full-time)',
] as const;

export const COMPENSATION_STRUCTURES = [
  'Fixed monthly retainer',
  'Hourly rate',
  'Commission only',
  'Base plus commission',
  'Per appointment or lead fee',
  'Open to discuss',
] as const;

export const CATEGORY_GROUPS = [
  'Sales',
  'Business development',
  'Lead generation',
  'Customer success',
  'Marketing',
  'Sales operations',
] as const;

// ── Step 1: Personal Info Schema ─────────────────────────────────────────────
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name is required (at least 2 characters)'),
  lastName: z.string().min(2, 'Last name is required (at least 2 characters)'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number (min 7 digits)'),
  city: z.string().min(2, 'City is required'),
  province: z.enum(SA_PROVINCES, {
    errorMap: () => ({ message: 'Please select a South African province' }),
  }),
  country: z.string().default('South Africa'),
});

// ── Step 2: Professional Info Schema ─────────────────────────────────────────
export const professionalInfoSchema = z.object({
  jobTitle: z.string().min(2, 'Job title is required'),
  employmentStatus: z.string().min(1, 'Please select your current employment status'),
  yearsExperience: z.string().min(1, 'Please select your years of experience'),
  headline: z.string().max(160, 'Headline must be 160 characters or less').optional().or(z.literal('')),
  biography: z.string().max(2000, 'Biography must be 2000 characters or less').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Please enter a valid portfolio URL').optional().or(z.literal('')),
});

// ── Step 3: Expertise Schema ────────────────────────────────────────────────
export const expertiseSchema = z.object({
  primaryCategory: z.string().min(1, 'Please select exactly one primary category'),
  secondaryCategories: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  industries: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
});

// ── Step 4: Preferences Schema ──────────────────────────────────────────────
export const preferencesSchema = z.object({
  workTypes: z.array(z.string()).min(1, 'Select at least one preferred engagement type'),
  workModes: z.array(z.string()).min(1, 'Select at least one preferred work mode'),
  weeklyAvailability: z.string().min(1, 'Please select your weekly availability'),
  preferredHours: z.string().optional().or(z.literal('')),
  earliestAvailability: z.string().min(1, 'Please specify your earliest start date'),
  compensationStructure: z.string().min(1, 'Please select a preferred compensation structure'),
  compensationExpectation: z.string().optional().or(z.literal('')),
});

// ── Step 5: Documents Schema ────────────────────────────────────────────────
export const documentItemSchema = z.object({
  kind: z.enum(['cv', 'portfolio', 'certificate', 'reference', 'identity']),
  storagePath: z.string().min(1, 'Storage path required'),
  originalName: z.string().min(1, 'File name required'),
  mimeType: z.string().min(1, 'MIME type required'),
  sizeBytes: z.number().max(10 * 1024 * 1024, 'File exceeds 10MB limit'),
});

export const documentsSchema = z.object({
  cv: documentItemSchema,
  portfolio: documentItemSchema.optional().nullable(),
  certificates: z.array(documentItemSchema).default([]),
  referencesText: z.string().max(1000).optional().or(z.literal('')),
});

// ── Step 6: Consent Schema ──────────────────────────────────────────────────
export const consentSchema = z.object({
  consentProcessing: z.literal(true, {
    errorMap: () => ({ message: 'You must grant consent to process your application' }),
  }),
  consentSharing: z.boolean().default(false),
  consentMarketing: z.boolean().default(false),
});

// ── Full Submission Composite Schema ────────────────────────────────────────
export const fullApplicationSchema = z.object({
  personal: personalInfoSchema,
  professional: professionalInfoSchema,
  expertise: expertiseSchema,
  preferences: preferencesSchema,
  documents: documentsSchema,
  consent: consentSchema,
});

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type ProfessionalInfoInput = z.infer<typeof professionalInfoSchema>;
export type ExpertiseInput = z.infer<typeof expertiseSchema>;
export type PreferencesInput = z.infer<typeof preferencesSchema>;
export type DocumentsInput = z.infer<typeof documentsSchema>;
export type ConsentInput = z.infer<typeof consentSchema>;
export type FullApplicationInput = z.infer<typeof fullApplicationSchema>;
