-- ==============================================================================
-- LeadVerify Talent Network — Core Database Schema & Security
-- Compliant with Handover Specification Section 5 & POPIA Security Controls
-- ==============================================================================

-- 1. Sequences & Enums
create sequence if not exists talent_reference_seq start 1000;

do $$ begin
  create type application_status as enum (
    'application_received',
    'under_review',
    'additional_information_required',
    'verification_pending',
    'verified',
    'unsuccessful',
    'withdrawn'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type document_kind as enum (
    'cv',
    'portfolio',
    'certificate',
    'reference',
    'identity'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type verification_type as enum (
    'contact',
    'identity',
    'experience',
    'skills',
    'portfolio',
    'performance'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type verification_status as enum (
    'unverified',
    'pending',
    'verified',
    'flagged',
    'rejected'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type consent_purpose as enum (
    'application_processing',
    'future_client_sharing',
    'marketing'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type admin_role as enum (
    'super_admin',
    'reviewer',
    'verifier'
  );
exception when duplicate_object then null; end $$;

-- 2. Core Tables

-- 2.1 Applicants (Personal Data & Retention Management)
create table if not exists applicants (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('LV-TN-' || lpad(nextval('talent_reference_seq')::text, 6, '0')),
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text,
  city text,
  province text,
  country text not null default 'South Africa',
  auth_user_id uuid,
  status application_status not null default 'application_received',
  magic_token_hash text,
  magic_token_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  withdrawn_at timestamptz,
  deleted_at timestamptz
);

create index if not exists idx_applicants_email on applicants(email);
create index if not exists idx_applicants_reference on applicants(reference);
create index if not exists idx_applicants_status on applicants(status);
create index if not exists idx_applicants_province on applicants(province);

-- 2.2 Professional Profiles
create table if not exists professional_profiles (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null unique references applicants(id) on delete cascade,
  job_title text not null,
  headline text,
  biography text,
  years_experience text not null,
  employment_status text not null,
  linkedin_url text,
  portfolio_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.3 Taxonomies (Categories, Skills, Industries)
create table if not exists professional_categories (
  id serial primary key,
  slug text not null unique,
  name text not null,
  parent_group text not null,
  sort_order int not null default 0,
  active boolean not null default true
);

create table if not exists applicant_categories (
  applicant_id uuid not null references applicants(id) on delete cascade,
  category_id int not null references professional_categories(id) on delete cascade,
  is_primary boolean not null default false,
  primary key (applicant_id, category_id)
);

create table if not exists skills (
  id serial primary key,
  slug text not null unique,
  name text not null,
  category_id int references professional_categories(id) on delete set null,
  active boolean not null default true
);

create table if not exists applicant_skills (
  applicant_id uuid not null references applicants(id) on delete cascade,
  skill_id int not null references skills(id) on delete cascade,
  primary key (applicant_id, skill_id)
);

create table if not exists industries (
  id serial primary key,
  slug text not null unique,
  name text not null,
  active boolean not null default true
);

create table if not exists applicant_industries (
  applicant_id uuid not null references applicants(id) on delete cascade,
  industry_id int not null references industries(id) on delete cascade,
  primary key (applicant_id, industry_id)
);

-- 2.4 Work Preferences
create table if not exists work_preferences (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null unique references applicants(id) on delete cascade,
  engagement_types text[] not null default '{}',
  work_modes text[] not null default '{}',
  weekly_availability text not null,
  preferred_hours text,
  earliest_availability date not null default current_date,
  compensation_structure text,
  compensation_expectation text,
  languages text[] not null default '{}',
  tools text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.5 Supporting Documents
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references applicants(id) on delete cascade,
  kind document_kind not null,
  storage_path text not null,
  original_name text not null,
  mime_type text not null,
  size_bytes bigint not null,
  scan_status text not null default 'clean' check (scan_status in ('pending', 'clean', 'quarantined')),
  uploaded_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_documents_applicant on documents(applicant_id);

-- 2.6 Verification Records (Strict: only verified with evidence)
create table if not exists verification_records (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references applicants(id) on delete cascade,
  type verification_type not null,
  status verification_status not null default 'unverified',
  reviewer_id uuid,
  completed_at timestamptz,
  evidence_reference text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_verifications_applicant on verification_records(applicant_id);

-- 2.7 Consent Records (Per-purpose versioned tracking)
create table if not exists consent_records (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references applicants(id) on delete cascade,
  purpose consent_purpose not null,
  granted boolean not null default false,
  policy_version text not null default '1.0',
  wording_version text not null default '1.0',
  granted_at timestamptz not null default now(),
  withdrawn_at timestamptz,
  ip_hash text
);

create index if not exists idx_consents_applicant on consent_records(applicant_id);

-- 2.8 Append-Only Application Status History
create table if not exists application_status_history (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references applicants(id) on delete cascade,
  from_status application_status,
  to_status application_status not null,
  changed_by text not null,
  note text,
  changed_at timestamptz not null default now()
);

create index if not exists idx_status_history_applicant on application_status_history(applicant_id);

-- 2.9 Administrative Users & Roles
create table if not exists administrative_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique not null,
  email text not null,
  role admin_role not null default 'reviewer',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2.10 Append-Only Audit Logs
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id text not null,
  actor_type text not null,
  action text not null,
  entity text not null,
  entity_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_entity on audit_logs(entity, entity_id);

-- 3. Append-Only Immutability Triggers
create or replace function enforce_append_only()
returns trigger as $$
begin
  raise exception 'Modifications or deletions are forbidden on immutable audit tables.';
end;
$$ language plpgsql;

drop trigger if exists trg_status_history_immutable on application_status_history;
create trigger trg_status_history_immutable
before update or delete on application_status_history
for each row execute function enforce_append_only();

drop trigger if exists trg_audit_logs_immutable on audit_logs;
create trigger trg_audit_logs_immutable
before update or delete on audit_logs
for each row execute function enforce_append_only();

-- 4. Role-Based Access Control SQL Helper
create or replace function has_role(required_role text)
returns boolean language sql security definer as $$
  select exists (
    select 1 from administrative_users
    where auth_user_id = auth.uid()
      and active = true
      and (
        role = 'super_admin'
        or role::text = required_role
        or (required_role = 'reviewer' and role in ('super_admin', 'reviewer'))
        or (required_role = 'verifier' and role in ('super_admin', 'verifier'))
      )
  );
$$;

-- 5. Row-Level Security (Deny by default)
alter table applicants enable row level security;
alter table professional_profiles enable row level security;
alter table applicant_categories enable row level security;
alter table applicant_skills enable row level security;
alter table applicant_industries enable row level security;
alter table work_preferences enable row level security;
alter table documents enable row level security;
alter table verification_records enable row level security;
alter table consent_records enable row level security;
alter table application_status_history enable row level security;
alter table administrative_users enable row level security;
alter table audit_logs enable row level security;

-- Admin policies
create policy admin_read_applicants on applicants
  for select using (has_role('reviewer'));

create policy admin_update_applicants on applicants
  for update using (has_role('reviewer'));

create policy admin_read_profiles on professional_profiles
  for select using (has_role('reviewer'));

create policy admin_read_preferences on work_preferences
  for select using (has_role('reviewer'));

create policy admin_read_documents on documents
  for select using (has_role('reviewer'));

create policy admin_verifications on verification_records
  for all using (has_role('verifier'));

create policy admin_status_history on application_status_history
  for select using (has_role('reviewer'));

create policy admin_audit_logs on audit_logs
  for select using (has_role('super_admin'));
