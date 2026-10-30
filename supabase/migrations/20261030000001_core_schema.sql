-- LeadVerify Network: Core Extensions and Enums Migration
-- Single source of truth for platform enum types and timestamp management functions.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom Domain Enums
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM (
        'business_user',
        'agent',
        'operations_admin',
        'finance_admin',
        'super_admin'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE account_status_type AS ENUM (
        'pending',
        'active',
        'suspended',
        'rejected'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE agent_verification_status_type AS ENUM (
        'unverified',
        'submitted',
        'under_review',
        'verified',
        'rejected',
        'suspended'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE agent_approval_status_type AS ENUM (
        'draft',
        'pending_review',
        'approved',
        'rejected',
        'suspended'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE campaign_status_type AS ENUM (
        'draft',
        'submitted',
        'under_review',
        'changes_requested',
        'approved',
        'staffing',
        'active',
        'paused',
        'completed',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE assignment_status_type AS ENUM (
        'proposed',
        'offered',
        'accepted',
        'rejected',
        'active',
        'completed',
        'withdrawn',
        'terminated'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status_type AS ENUM (
        'todo',
        'in_progress',
        'in_review',
        'completed',
        'blocked'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE lead_status_type AS ENUM (
        'submitted',
        'verified',
        'accepted',
        'rejected',
        'duplicate'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status_type AS ENUM (
        'scheduled',
        'attended',
        'no_show',
        'rescheduled',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE deliverable_status_type AS ENUM (
        'submitted',
        'in_review',
        'revision_requested',
        'approved',
        'rejected'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status_type AS ENUM (
        'draft',
        'issued',
        'paid',
        'overdue',
        'void'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE compensation_status_type AS ENUM (
        'accrued',
        'approved',
        'paid',
        'adjusted'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE ledger_account_type AS ENUM (
        'client_receivable',
        'agent_payable',
        'platform_revenue',
        'fee_reserve'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE ledger_direction_type AS ENUM (
        'debit',
        'credit'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Standard updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
