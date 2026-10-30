-- LeadVerify Network: Deliverables, QA Reviews & Revision History

CREATE TABLE IF NOT EXISTS deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    deliverable_type VARCHAR(100) NOT NULL, -- 'verified_lead_batch', 'appointment_evidence', 'call_recording_batch'
    description TEXT,
    item_count INT NOT NULL DEFAULT 1,
    file_attachment_url TEXT,
    payload_data JSONB DEFAULT '{}'::jsonb,
    status deliverable_status_type NOT NULL DEFAULT 'submitted',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_deliverables_updated_at
    BEFORE UPDATE ON deliverables
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS deliverable_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deliverable_id UUID NOT NULL REFERENCES deliverables(id) ON DELETE CASCADE,
    reviewed_by UUID NOT NULL REFERENCES user_profiles(id),
    decision VARCHAR(50) NOT NULL, -- 'approved', 'revision_requested', 'rejected'
    acceptance_criteria_notes TEXT NOT NULL,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deliverables_campaign ON deliverables(campaign_id);
CREATE INDEX idx_deliverables_agent ON deliverables(agent_id);
CREATE INDEX idx_deliverables_status ON deliverables(status);
