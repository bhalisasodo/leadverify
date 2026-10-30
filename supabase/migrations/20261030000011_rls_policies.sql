-- LeadVerify Network: Row Level Security (RLS) Policies
-- Enforces multi-tenant isolation for businesses and work isolation for agents.

-- Enable RLS across all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_commercial_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_compensation_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverable_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE compensation_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. USER PROFILES
CREATE POLICY "Users can view and update own profile"
    ON user_profiles FOR ALL
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
    ON user_profiles FOR SELECT
    USING (is_admin());

-- 2. BUSINESSES & MEMBERSHIPS
CREATE POLICY "Business members can view their business"
    ON businesses FOR SELECT
    USING (
        id IN (
            SELECT business_id FROM business_memberships
            WHERE user_id = auth.uid()
        ) OR is_admin()
    );

CREATE POLICY "Business owners/admins can update their business"
    ON businesses FOR UPDATE
    USING (
        id IN (
            SELECT business_id FROM business_memberships
            WHERE user_id = auth.uid() AND membership_role IN ('owner', 'admin')
        ) OR is_admin()
    );

-- 3. AGENTS
CREATE POLICY "Agents can view and edit own profile"
    ON agents FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view and manage all agents"
    ON agents FOR ALL
    USING (is_admin());

-- 4. CAMPAIGNS
CREATE POLICY "Businesses can view own campaigns"
    ON campaigns FOR SELECT
    USING (
        business_id IN (
            SELECT business_id FROM business_memberships
            WHERE user_id = auth.uid()
        ) OR is_admin()
    );

CREATE POLICY "Businesses can create campaigns"
    ON campaigns FOR INSERT
    WITH CHECK (
        business_id IN (
            SELECT business_id FROM business_memberships
            WHERE user_id = auth.uid()
        ) OR is_admin()
    );

-- Approved agents can view campaigns they are assigned to
CREATE POLICY "Assigned agents can view campaign overview"
    ON campaigns FOR SELECT
    USING (
        id IN (
            SELECT campaign_id FROM assignments a
            JOIN agents ag ON a.agent_id = ag.id
            WHERE ag.user_id = auth.uid()
              AND a.status IN ('offered', 'accepted', 'active', 'completed')
        )
    );

-- 5. ASSIGNMENTS & TASKS
CREATE POLICY "Agents can view their own assignments"
    ON assignments FOR SELECT
    USING (
        agent_id IN (
            SELECT id FROM agents WHERE user_id = auth.uid()
        ) OR is_admin()
    );

CREATE POLICY "Agents can update their offered assignments (accept/decline)"
    ON assignments FOR UPDATE
    USING (
        agent_id IN (
            SELECT id FROM agents WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Agents can view and update assigned tasks"
    ON tasks FOR ALL
    USING (
        assignment_id IN (
            SELECT a.id FROM assignments a
            JOIN agents ag ON a.agent_id = ag.id
            WHERE ag.user_id = auth.uid()
        ) OR is_admin()
    );

-- 6. LEADS, APPOINTMENTS & DELIVERABLES
CREATE POLICY "Agents can view and submit leads for assigned campaigns"
    ON leads FOR ALL
    USING (
        agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid())
        OR is_admin()
    );

CREATE POLICY "Businesses can view accepted/verified leads for own campaigns"
    ON leads FOR SELECT
    USING (
        campaign_id IN (
            SELECT c.id FROM campaigns c
            JOIN business_memberships bm ON bm.business_id = c.business_id
            WHERE bm.user_id = auth.uid()
        ) AND status IN ('verified', 'accepted')
    );

CREATE POLICY "Agents manage own deliverables"
    ON deliverables FOR ALL
    USING (
        agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid())
        OR is_admin()
    );

CREATE POLICY "Businesses view approved deliverables"
    ON deliverables FOR SELECT
    USING (
        campaign_id IN (
            SELECT c.id FROM campaigns c
            JOIN business_memberships bm ON bm.business_id = c.business_id
            WHERE bm.user_id = auth.uid()
        ) AND status = 'approved'
    );

-- 7. FINANCE & AUDIT
CREATE POLICY "Finance and Super Admins manage ledger"
    ON ledger_entries FOR ALL
    USING (
        has_role('finance_admin') OR has_role('super_admin')
    );

CREATE POLICY "Businesses view own invoices"
    ON invoices FOR SELECT
    USING (
        business_id IN (
            SELECT business_id FROM business_memberships
            WHERE user_id = auth.uid()
        ) OR is_admin()
    );

CREATE POLICY "Agents view own compensation"
    ON compensation_calculations FOR SELECT
    USING (
        agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid())
        OR is_admin()
    );

CREATE POLICY "Audit logs readable only by super_admin and operations_admin"
    ON audit_logs FOR SELECT
    USING (
        has_role('super_admin') OR has_role('operations_admin')
    );
