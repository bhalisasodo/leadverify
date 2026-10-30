-- LeadVerify Network: Leads, Outreach Activities, Appointments & Opportunities

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE RESTRICT,
    company_name VARCHAR(255) NOT NULL,
    company_domain VARCHAR(255),
    contact_name VARCHAR(255) NOT NULL,
    contact_title VARCHAR(255),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    linkedin_url VARCHAR(500),
    industry VARCHAR(100),
    country VARCHAR(100) DEFAULT 'South Africa',
    custom_qualification_data JSONB DEFAULT '{}'::jsonb,
    status lead_status_type NOT NULL DEFAULT 'submitted',
    rejection_reason TEXT,
    verified_by UUID REFERENCES user_profiles(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Enforce lead deduplication per campaign on email
    CONSTRAINT lead_campaign_email_unique UNIQUE (campaign_id, contact_email)
);

CREATE TRIGGER set_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS outreach_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL, -- 'email', 'phone', 'linkedin'
    activity_type VARCHAR(100) NOT NULL, -- 'first_touch', 'follow_up', 'connected', 'call_completed'
    notes TEXT,
    outcome VARCHAR(100),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE RESTRICT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status appointment_status_type NOT NULL DEFAULT 'scheduled',
    meeting_link VARCHAR(500),
    calendar_event_id VARCHAR(255),
    client_attended BOOLEAN DEFAULT FALSE,
    prospect_attended BOOLEAN DEFAULT FALSE,
    client_feedback TEXT,
    verified_by UUID REFERENCES user_profiles(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    deal_title VARCHAR(255) NOT NULL,
    deal_size_cents BIGINT NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'ZAR',
    stage VARCHAR(100) NOT NULL DEFAULT 'qualification', -- 'qualification', 'proposal', 'negotiation', 'won', 'lost'
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_opportunities_updated_at
    BEFORE UPDATE ON opportunities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_leads_campaign ON leads(campaign_id);
CREATE INDEX idx_leads_agent ON leads(agent_id);
CREATE INDEX idx_leads_company_domain ON leads(campaign_id, company_domain);
CREATE INDEX idx_appointments_campaign ON appointments(campaign_id);
