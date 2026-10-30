-- LeadVerify Network: Invoices, Client Payments, Compensation Accruals & Immutable Double-Entry Ledger

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE RESTRICT,
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE RESTRICT,
    subtotal_cents BIGINT NOT NULL DEFAULT 0,
    tax_cents BIGINT NOT NULL DEFAULT 0,
    total_cents BIGINT NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'ZAR',
    status invoice_status_type NOT NULL DEFAULT 'draft',
    issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS client_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
    amount_cents BIGINT NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'ZAR',
    payment_method VARCHAR(50) NOT NULL DEFAULT 'bank_transfer', -- 'bank_transfer', 'credit_card', 'manual'
    payment_reference VARCHAR(255) NOT NULL,
    recorded_by UUID NOT NULL REFERENCES user_profiles(id),
    paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agent compensation calculations: accrued upon QA approval, payable upon conditions
CREATE TABLE IF NOT EXISTS compensation_calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE RESTRICT,
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE RESTRICT,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE RESTRICT,
    deliverable_id UUID REFERENCES deliverables(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL, -- 'verified_lead_unit', 'attended_appointment_unit', 'closed_deal_commission', 'base_hourly'
    units_count INT NOT NULL DEFAULT 1,
    unit_rate_cents BIGINT NOT NULL DEFAULT 0,
    amount_cents BIGINT NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'ZAR',
    status compensation_status_type NOT NULL DEFAULT 'accrued',
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_by UUID REFERENCES user_profiles(id),
    approved_at TIMESTAMPTZ,
    notes TEXT
);

-- Agent payouts (settlement records)
CREATE TABLE IF NOT EXISTS agent_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE RESTRICT,
    payout_reference VARCHAR(100) NOT NULL UNIQUE,
    amount_cents BIGINT NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'ZAR',
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    authorized_by UUID NOT NULL REFERENCES user_profiles(id),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Immutable Double-Entry Ledger
-- Ensures traceable, auditable transactions without silent overwrites
CREATE TABLE IF NOT EXISTS ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE RESTRICT,
    reference_type VARCHAR(100) NOT NULL, -- 'invoice_issued', 'client_payment', 'agent_accrual', 'agent_payout', 'adjustment'
    reference_id UUID,
    account ledger_account_type NOT NULL,
    direction ledger_direction_type NOT NULL,
    amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
    currency VARCHAR(10) NOT NULL DEFAULT 'ZAR',
    description TEXT NOT NULL,
    actor_id UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent any UPDATE or DELETE on ledger_entries to maintain immutability
CREATE OR REPLACE FUNCTION prevent_ledger_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Ledger entries are strictly immutable. Corrections must be recorded via new adjustment entries.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_ledger_immutability
    BEFORE UPDATE OR DELETE ON ledger_entries
    FOR EACH ROW
    EXECUTE FUNCTION prevent_ledger_modification();

CREATE INDEX idx_ledger_campaign ON ledger_entries(campaign_id);
CREATE INDEX idx_ledger_account ON ledger_entries(account);
CREATE INDEX idx_ledger_transaction ON ledger_entries(transaction_id);
CREATE INDEX idx_compensation_agent ON compensation_calculations(agent_id);
CREATE INDEX idx_invoices_business ON invoices(business_id);
