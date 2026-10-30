-- LeadVerify Network: Campaigns, Requirements & Commercial Terms

CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_industry VARCHAR(100) NOT NULL DEFAULT 'Technology',
    services_requested TEXT[] NOT NULL DEFAULT '{}', -- e.g. ARRAY['lead_generation', 'appointment_setting']
    status campaign_status_type NOT NULL DEFAULT 'submitted',
    target_start_date DATE,
    target_end_date DATE,
    lead_target_count INT DEFAULT 0,
    appointment_target_count INT DEFAULT 0,
    approved_by UUID REFERENCES user_profiles(id),
    approved_at TIMESTAMPTZ,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS campaign_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL UNIQUE REFERENCES campaigns(id) ON DELETE CASCADE,
    ideal_customer_profile TEXT NOT NULL,
    target_titles TEXT[] NOT NULL DEFAULT '{}',
    target_geographies TEXT[] NOT NULL DEFAULT '{"South Africa"}',
    target_company_sizes TEXT[] NOT NULL DEFAULT '{}',
    exclusion_criteria TEXT,
    pitch_guidelines TEXT,
    qualification_criteria TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_campaign_requirements_updated_at
    BEFORE UPDATE ON campaign_requirements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Commercial terms are versioned to preserve historical contracts accurately
CREATE TABLE IF NOT EXISTS campaign_commercial_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    version INT NOT NULL DEFAULT 1,
    currency VARCHAR(10) NOT NULL DEFAULT 'ZAR',
    client_monthly_retainer_cents BIGINT NOT NULL DEFAULT 0,
    client_per_verified_lead_cents BIGINT NOT NULL DEFAULT 0,
    client_per_attended_appointment_cents BIGINT NOT NULL DEFAULT 0,
    client_commission_bps INT NOT NULL DEFAULT 0, -- basis points (100 bps = 1.00%)
    payment_terms_days INT NOT NULL DEFAULT 14,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT campaign_version_unique UNIQUE (campaign_id, version)
);

CREATE INDEX idx_campaigns_business_id ON campaigns(business_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
