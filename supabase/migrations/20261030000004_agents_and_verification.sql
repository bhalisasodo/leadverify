-- LeadVerify Network: Agents, Skills, Verification & Assessments

CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
    profile_summary TEXT,
    location VARCHAR(100) NOT NULL DEFAULT 'South Africa',
    timezone VARCHAR(50) NOT NULL DEFAULT 'Africa/Johannesburg',
    years_experience INT NOT NULL DEFAULT 0,
    availability_status VARCHAR(50) NOT NULL DEFAULT 'available', -- 'available', 'busy', 'unavailable'
    capacity_hours_per_week INT NOT NULL DEFAULT 40,
    onboarding_status account_status_type NOT NULL DEFAULT 'pending',
    approval_status agent_approval_status_type NOT NULL DEFAULT 'draft',
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES user_profiles(id),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_agents_updated_at
    BEFORE UPDATE ON agents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS agent_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL, -- e.g., 'Cold Outbound', 'B2B SaaS', 'DevOps Qualification'
    proficiency_level VARCHAR(50) NOT NULL DEFAULT 'intermediate', -- 'beginner', 'intermediate', 'expert'
    years_experience INT DEFAULT 1,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT agent_skill_unique UNIQUE (agent_id, skill_name)
);

CREATE TABLE IF NOT EXISTS agent_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- 'government_id', 'proof_of_residence', 'cv', 'tax_certificate'
    document_url TEXT NOT NULL,
    status agent_verification_status_type NOT NULL DEFAULT 'submitted',
    reviewed_by UUID REFERENCES user_profiles(id),
    review_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    assessment_type VARCHAR(100) NOT NULL, -- 'tech_sales_readiness', 'outbound_qualification_test'
    score_percentage NUMERIC(5,2),
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    answers_payload JSONB DEFAULT '{}'::jsonb,
    reviewed_by UUID REFERENCES user_profiles(id),
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agents_approval_status ON agents(approval_status);
CREATE INDEX idx_agents_user_id ON agents(user_id);
