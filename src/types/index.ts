// LeadVerify Network: Core Domain Types

export type UserRole =
  | 'business_user'
  | 'agent'
  | 'operations_admin'
  | 'finance_admin'
  | 'super_admin';

export type AccountStatus = 'pending' | 'active' | 'suspended' | 'rejected';

export type AgentVerificationStatus =
  | 'unverified'
  | 'submitted'
  | 'under_review'
  | 'verified'
  | 'rejected'
  | 'suspended';

export type AgentApprovalStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'suspended';

export type CampaignStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'changes_requested'
  | 'approved'
  | 'staffing'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';

export type AssignmentStatus =
  | 'proposed'
  | 'offered'
  | 'accepted'
  | 'rejected'
  | 'active'
  | 'completed'
  | 'withdrawn'
  | 'terminated';

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'completed' | 'blocked';

export type LeadStatus = 'submitted' | 'verified' | 'accepted' | 'rejected' | 'duplicate';

export type AppointmentStatus =
  | 'scheduled'
  | 'attended'
  | 'no_show'
  | 'rescheduled'
  | 'cancelled';

export type DeliverableStatus =
  | 'submitted'
  | 'in_review'
  | 'revision_requested'
  | 'approved'
  | 'rejected';

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'overdue' | 'void';

export type CompensationStatus = 'accrued' | 'approved' | 'paid' | 'adjusted';

export type LedgerAccount =
  | 'client_receivable'
  | 'agent_payable'
  | 'platform_revenue'
  | 'fee_reserve';

export type LedgerDirection = 'debit' | 'credit';

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  phone?: string;
  timezone: string;
  status: AccountStatus;
  roles: UserRole[];
  created_at: string;
}

export interface Business {
  id: string;
  legal_name: string;
  trading_name?: string;
  registration_number?: string;
  website?: string;
  business_email: string;
  technology_category: string;
  country: string;
  region?: string;
  verification_status: AccountStatus;
  billing_email?: string;
  created_at: string;
}

export interface Agent {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  profile_summary: string;
  location: string;
  timezone: string;
  years_experience: number;
  availability_status: 'available' | 'busy' | 'unavailable';
  capacity_hours_per_week: number;
  approval_status: AgentApprovalStatus;
  skills: AgentSkill[];
  created_at: string;
}

export interface AgentSkill {
  id: string;
  agent_id: string;
  skill_name: string;
  proficiency_level: 'beginner' | 'intermediate' | 'expert';
  years_experience: number;
  is_primary: boolean;
}

export interface Campaign {
  id: string;
  business_id: string;
  business_name?: string;
  title: string;
  description: string;
  target_industry: string;
  services_requested: string[];
  status: CampaignStatus;
  target_start_date?: string;
  target_end_date?: string;
  lead_target_count: number;
  appointment_target_count: number;
  requirements?: CampaignRequirements;
  commercial_terms?: CampaignCommercialTerms;
  created_at: string;
}

export interface CampaignRequirements {
  id: string;
  campaign_id: string;
  ideal_customer_profile: string;
  target_titles: string[];
  target_geographies: string[];
  target_company_sizes: string[];
  exclusion_criteria?: string;
  pitch_guidelines?: string;
  qualification_criteria?: string;
}

export interface CampaignCommercialTerms {
  id: string;
  campaign_id: string;
  version: number;
  currency: string;
  client_monthly_retainer_cents: number;
  client_per_verified_lead_cents: number;
  client_per_attended_appointment_cents: number;
  client_commission_bps: number;
  payment_terms_days: number;
  is_active: boolean;
}

export interface Assignment {
  id: string;
  campaign_id: string;
  campaign_title?: string;
  agent_id: string;
  agent_name?: string;
  role_in_campaign: string;
  status: AssignmentStatus;
  allocated_hours_per_week: number;
  compensation_terms?: AssignmentCompensationTerms;
  created_at: string;
}

export interface AssignmentCompensationTerms {
  id: string;
  assignment_id: string;
  currency: string;
  base_hourly_rate_cents: number;
  per_verified_lead_cents: number;
  per_attended_appointment_cents: number;
  commission_bps: number;
}

export interface Lead {
  id: string;
  campaign_id: string;
  assignment_id?: string;
  agent_id: string;
  agent_name?: string;
  company_name: string;
  company_domain?: string;
  contact_name: string;
  contact_title?: string;
  contact_email: string;
  contact_phone?: string;
  linkedin_url?: string;
  status: LeadStatus;
  rejection_reason?: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  campaign_id: string;
  lead_id: string;
  agent_id: string;
  scheduled_at: string;
  status: AppointmentStatus;
  meeting_link?: string;
  client_attended: boolean;
  prospect_attended: boolean;
  client_feedback?: string;
  created_at: string;
}

export interface Deliverable {
  id: string;
  campaign_id: string;
  assignment_id: string;
  agent_id: string;
  agent_name?: string;
  title: string;
  deliverable_type: string;
  description?: string;
  item_count: number;
  file_attachment_url?: string;
  status: DeliverableStatus;
  submitted_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  business_id: string;
  business_name?: string;
  campaign_id: string;
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  currency: string;
  status: InvoiceStatus;
  issued_date: string;
  due_date: string;
}

export interface CompensationCalculation {
  id: string;
  assignment_id: string;
  campaign_id: string;
  agent_id: string;
  event_type: string;
  units_count: number;
  unit_rate_cents: number;
  amount_cents: number;
  currency: string;
  status: CompensationStatus;
  calculated_at: string;
}

export interface LedgerEntry {
  id: string;
  transaction_id: string;
  campaign_id: string;
  reference_type: string;
  reference_id?: string;
  account: LedgerAccount;
  direction: LedgerDirection;
  amount_cents: number;
  currency: string;
  description: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor_email?: string;
  actor_role?: UserRole;
  action: string;
  entity_type: string;
  entity_id: string;
  previous_state?: Record<string, unknown>;
  new_state?: Record<string, unknown>;
  created_at: string;
}
