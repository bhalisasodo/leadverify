-- LeadVerify Network: Assignments, Compensation Terms & Tasks

CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE RESTRICT,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE RESTRICT,
    role_in_campaign VARCHAR(100) NOT NULL, -- e.g. 'Outbound SDR', 'Lead Researcher', 'Account Executive'
    status assignment_status_type NOT NULL DEFAULT 'offered',
    offered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    rejection_reason TEXT,
    allocated_hours_per_week INT NOT NULL DEFAULT 20,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT assignment_campaign_agent_unique UNIQUE (campaign_id, agent_id)
);

CREATE TRIGGER set_assignments_updated_at
    BEFORE UPDATE ON assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Specific compensation agreed with the agent for this assignment
CREATE TABLE IF NOT EXISTS assignment_compensation_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL UNIQUE REFERENCES assignments(id) ON DELETE CASCADE,
    currency VARCHAR(10) NOT NULL DEFAULT 'ZAR',
    base_hourly_rate_cents BIGINT NOT NULL DEFAULT 0,
    per_verified_lead_cents BIGINT NOT NULL DEFAULT 0,
    per_attended_appointment_cents BIGINT NOT NULL DEFAULT 0,
    commission_bps INT NOT NULL DEFAULT 0, -- basis points (100 bps = 1.00%)
    agreed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status_type NOT NULL DEFAULT 'todo',
    target_count INT DEFAULT 0,
    completed_count INT DEFAULT 0,
    due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_assignments_campaign ON assignments(campaign_id);
CREATE INDEX idx_assignments_agent ON assignments(agent_id);
CREATE INDEX idx_tasks_campaign ON tasks(campaign_id);
CREATE INDEX idx_tasks_assignment ON tasks(assignment_id);
