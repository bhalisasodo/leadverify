# LeadVerify — Proposed Data Model

This is a conceptual schema for engineering implementation. It is not a final migration. Review constraints, privacy requirements, and Supabase RLS policies before deployment.

## 1. Core entities and relationships

```text
auth.users
   |
   +---- user_profiles
   |
   +---- business_memberships ---- businesses
   |
   +---- agents ---- agent_skills
   |             +-- agent_verifications
   |             +-- agent_assessments
   |             +-- agent_availability
   |
   +---- audit_logs

businesses
   +---- campaigns
            +---- campaign_requirements
            +---- campaign_commercial_terms
            +---- assignments ---- agents
            |        +-- tasks
            |        +-- compensation_terms
            |
            +---- leads
            |      +-- outreach_activities
            |
            +---- appointments
            +---- opportunities / conversions
            +---- deliverables
            +---- invoices
            +---- client_payments
            +---- ledger_entries
            +---- reports
```

## 2. Suggested tables

### user_profiles
- id (UUID, references auth.users)
- display_name
- email (or use auth identity as source of truth)
- phone
- timezone
- status
- created_at
- updated_at

### user_roles
- id
- user_id
- role (`business_user`, `agent`, `operations_admin`, `finance_admin`, `super_admin`)
- granted_by
- created_at

### businesses
- id
- legal_name
- trading_name
- registration_number (nullable)
- website
- business_email
- description
- technology_category
- country
- region
- verification_status
- created_at
- updated_at

### business_memberships
- id
- business_id
- user_id
- membership_role
- status
- created_at

### agents
- id
- user_id
- profile_summary
- location
- timezone
- languages (normalised table preferred as data grows)
- years_experience
- availability_status
- capacity_hours_per_week
- onboarding_status
- approval_status
- created_at
- updated_at

### agent_skills
- id
- agent_id
- skill_code
- proficiency_level
- evidence_reference
- assessed_at

### agent_verifications
- id
- agent_id
- verification_type
- status
- provider_reference (if applicable)
- reviewer_user_id
- reviewed_at
- expiry_at
- notes (restricted)
- created_at

Avoid storing raw identity documents unless necessary and justified. Prefer a suitable verification provider and store only the minimum required result/reference.

### agent_assessments
- id
- agent_id
- assessment_type
- score
- rubric_version
- result
- reviewer_user_id
- completed_at
- notes

### campaigns
- id
- business_id
- name
- objective
- product_description
- target_market
- ideal_customer_profile
- geography
- requested_services (normalised campaign_services table recommended)
- start_date
- end_date
- status
- owner_user_id
- approved_by
- approved_at
- created_at
- updated_at

### campaign_requirements
- id
- campaign_id
- requirement_type
- description
- required_skill
- quantity_target
- acceptance_criteria (structured JSON with versioning)
- due_date

### campaign_commercial_terms
- id
- campaign_id
- version
- currency
- commercial_model (`performance`, `hybrid`, `retainer`, `commission_share`)
- activation_fee_minor
- retainer_amount_minor
- outcome_fee_rules (structured, versioned)
- commission_rate (nullable)
- payment_terms
- attribution_rules
- reversal_rules
- approved_by
- approved_at
- created_at

### assignments
- id
- campaign_id
- agent_id
- role
- status
- start_date
- end_date
- capacity_commitment
- compensation_model
- terms_version
- accepted_at
- created_at

### assignment_compensation_terms
- id
- assignment_id
- currency
- fixed_amount_minor
- per_accepted_lead_minor
- per_attended_appointment_minor
- commission_rate
- other_rule_json
- effective_from
- effective_to
- approved_by
- created_at

### tasks
- id
- campaign_id
- assignment_id
- title
- instructions
- status
- due_at
- created_by
- created_at
- updated_at

### leads
- id
- campaign_id
- submitted_by_agent_id
- company_name
- prospect_name
- job_title
- business_email
- business_phone
- website
- geography
- source
- collected_at
- qualification_data (structured JSON)
- status
- duplicate_of_lead_id (nullable)
- review_status
- reviewed_by
- reviewed_at
- created_at

### outreach_activities
- id
- lead_id
- agent_id
- channel
- activity_type
- occurred_at
- outcome
- notes
- lawful_basis_or_consent_reference (where appropriate; avoid unnecessary personal data)

### appointments
- id
- campaign_id
- lead_id
- agent_id
- scheduled_at
- timezone
- meeting_channel
- confirmation_status
- attendance_status
- outcome
- created_at
- updated_at

### opportunities
- id
- campaign_id
- lead_id
- owner_agent_id (nullable)
- stage
- estimated_value_minor
- currency
- outcome
- client_confirmed_revenue_minor
- closed_at
- attribution_status
- created_at

### deliverables
- id
- campaign_id
- assignment_id
- task_id (nullable)
- deliverable_type
- record_reference
- submitted_at
- status
- reviewer_id
- reviewed_at
- review_reason
- version

### invoices
- id
- business_id
- campaign_id
- invoice_number
- currency
- amount_minor
- status
- issued_at
- due_at
- paid_at

### client_payments
- id
- invoice_id
- amount_minor
- currency
- payment_reference
- received_at
- status

### ledger_entries
- id
- campaign_id
- business_id (nullable)
- agent_id (nullable)
- entry_type
- direction
- amount_minor
- currency
- source_type
- source_id
- status
- effective_at
- created_by
- created_at
- reversal_of_entry_id (nullable)

Ledger entries should be immutable in principle. Corrections should be represented by compensating entries rather than destructive edits.

### agent_payouts
- id
- agent_id
- campaign_id
- amount_minor
- currency
- status (`calculated`, `pending_approval`, `approved`, `paid`, `held`, `disputed`, `reversed`)
- payment_reference
- approved_by
- paid_at
- created_at

### audit_logs
- id
- actor_user_id
- action
- entity_type
- entity_id
- before_state (restricted)
- after_state (restricted)
- reason
- created_at

## 3. Important constraints and indexes

- Foreign keys for all entity relationships.
- Unique business membership per user/business where appropriate.
- Unique invoice number within the issuing entity.
- Index campaign status, business_id, agent_id, assignment status, lead campaign_id, and timestamps.
- Duplicate detection should use normalised business contact/domain fields and campaign-specific rules, not a single naive global uniqueness constraint.
- Enforce currency consistency for a given financial calculation.
- Store timestamps in UTC and retain the relevant timezone for user-facing scheduling.
- Define deletion/anonymisation strategy for personal data and audit records with legal advice.

## 4. RLS policy design checklist

- Business users: rows belonging to their business only.
- Agents: own profile and assigned campaign/task records only.
- Operations admins: authorised operational access.
- Finance admins: financial data access; no unnecessary identity-document access.
- Super admins: restricted, audited elevated access.
- Storage: private buckets, short-lived signed URLs, access checks.
- No public read access to agent records, leads, campaign data, or financial records.
- Test every policy with at least two businesses and two agents to detect cross-tenant leaks.
