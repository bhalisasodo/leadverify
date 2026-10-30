-- LeadVerify Network: Immutable System Audit Logs

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    actor_email VARCHAR(255),
    actor_role user_role_type,
    action VARCHAR(100) NOT NULL, -- e.g. 'agent.approved', 'campaign.status_changed', 'deliverable.reviewed', 'payout.authorized'
    entity_type VARCHAR(100) NOT NULL, -- 'agent', 'campaign', 'deliverable', 'invoice', 'ledger'
    entity_id UUID NOT NULL,
    previous_state JSONB,
    new_state JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enforce immutability on audit logs
CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit logs are strictly append-only and cannot be altered or deleted.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_audit_immutability
    BEFORE UPDATE OR DELETE ON audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION prevent_audit_log_modification();

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
