-- LeadVerify Network: Synthetic Test Seed Data
-- Creates 2 small tech businesses, 4 agents (varying states), 2 campaigns, assignments, and test leads.

-- 1. Test User Profiles
INSERT INTO user_profiles (id, display_name, email, phone, timezone, status)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Admin Alice', 'alice.ops@leadverify.test', '+27110001001', 'Africa/Johannesburg', 'active'),
    ('a0000000-0000-0000-0000-000000000002', 'Finance Bob', 'bob.finance@leadverify.test', '+27110001002', 'Africa/Johannesburg', 'active'),
    ('b0000000-0000-0000-0000-000000000001', 'Carl Cloud (CloudCore)', 'carl@cloudcore.test', '+27110002001', 'Africa/Johannesburg', 'active'),
    ('b0000000-0000-0000-0000-000000000002', 'Dana Dev (DevMetrics)', 'dana@devmetrics.test', '+27110002002', 'Africa/Johannesburg', 'active'),
    ('c0000000-0000-0000-0000-000000000001', 'Sarah Sales', 'sarah.agent@leadverify.test', '+27820003001', 'Africa/Johannesburg', 'active'),
    ('c0000000-0000-0000-0000-000000000002', 'Mike Closer', 'mike.agent@leadverify.test', '+27820003002', 'Africa/Johannesburg', 'active'),
    ('c0000000-0000-0000-0000-000000000003', 'Paul Pending', 'paul.pending@leadverify.test', '+27820003003', 'Africa/Johannesburg', 'active'),
    ('c0000000-0000-0000-0000-000000000004', 'Reggie Registered', 'reggie.reg@leadverify.test', '+27820003004', 'Africa/Johannesburg', 'active')
ON CONFLICT (id) DO NOTHING;

-- 2. User Roles
INSERT INTO user_roles (user_id, role)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'operations_admin'),
    ('a0000000-0000-0000-0000-000000000001', 'super_admin'),
    ('a0000000-0000-0000-0000-000000000002', 'finance_admin'),
    ('b0000000-0000-0000-0000-000000000001', 'business_user'),
    ('b0000000-0000-0000-0000-000000000002', 'business_user'),
    ('c0000000-0000-0000-0000-000000000001', 'agent'),
    ('c0000000-0000-0000-0000-000000000002', 'agent'),
    ('c0000000-0000-0000-0000-000000000003', 'agent'),
    ('c0000000-0000-0000-0000-000000000004', 'agent')
ON CONFLICT DO NOTHING;

-- 3. Two Client Businesses
INSERT INTO businesses (id, legal_name, trading_name, registration_number, website, business_email, technology_category, country, verification_status)
VALUES
    ('10000000-0000-0000-0000-000000000001', 'CloudCore Technologies (Pty) Ltd', 'CloudCore', '2023/123456/07', 'https://cloudcore.test', 'info@cloudcore.test', 'Cloud Infrastructure & DevOps', 'South Africa', 'active'),
    ('10000000-0000-0000-0000-000000000002', 'DevMetrics Analytics (Pty) Ltd', 'DevMetrics', '2022/987654/07', 'https://devmetrics.test', 'contact@devmetrics.test', 'Developer Tooling & Analytics', 'South Africa', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO business_memberships (business_id, user_id, membership_role)
VALUES
    ('10000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'owner'),
    ('10000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'owner')
ON CONFLICT DO NOTHING;

-- 4. Four Agents with different verification / approval statuses
INSERT INTO agents (id, user_id, profile_summary, years_experience, availability_status, capacity_hours_per_week, onboarding_status, approval_status)
VALUES
    ('20000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Senior B2B tech SDR with 5+ years experience in SaaS and DevOps outreach.', 5, 'available', 30, 'active', 'approved'),
    ('20000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'Account Executive experienced in closing technical contracts.', 7, 'available', 40, 'active', 'approved'),
    ('20000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'Outbound sales rep, submitted verification and awaiting review.', 2, 'available', 20, 'pending', 'pending_review'),
    ('20000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', 'Newly registered agent profile.', 1, 'available', 15, 'pending', 'draft')
ON CONFLICT (id) DO NOTHING;

-- Skills for approved agents
INSERT INTO agent_skills (agent_id, skill_name, proficiency_level, years_experience, is_primary)
VALUES
    ('20000000-0000-0000-0000-000000000001', 'B2B SaaS Cold Outreach', 'expert', 5, TRUE),
    ('20000000-0000-0000-0000-000000000001', 'DevOps Lead Qualification', 'expert', 4, FALSE),
    ('20000000-0000-0000-0000-000000000002', 'Enterprise Sales Closing', 'expert', 7, TRUE)
ON CONFLICT DO NOTHING;

-- 5. Campaign for CloudCore
INSERT INTO campaigns (id, business_id, title, description, target_industry, services_requested, status, target_start_date, target_end_date, lead_target_count, appointment_target_count)
VALUES
    ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Q4 DevOps Outbound Sprint', 'Generate qualified appointments with Heads of Engineering for cloud migration assessment.', 'Technology', ARRAY['lead_generation', 'appointment_setting'], 'active', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 50, 15)
ON CONFLICT (id) DO NOTHING;

INSERT INTO campaign_requirements (campaign_id, ideal_customer_profile, target_titles, target_geographies, target_company_sizes, pitch_guidelines, qualification_criteria)
VALUES
    ('30000000-0000-0000-0000-000000000001', 'B2B Tech companies running on legacy infra considering AWS/GCP migration.', ARRAY['VP Engineering', 'Head of DevOps', 'CTO'], ARRAY['South Africa', 'Remote EU'], ARRAY['50-250 employees'], 'Focus on 40% cloud cost reduction and managed migration SLA.', 'Must have 50+ VMs or microservices architecture and budget approved for 2027.')
ON CONFLICT DO NOTHING;

-- Commercial Terms: R15,000 retainer (1,500,000 cents), R500 per verified lead (50,000 cents), R1,500 per appointment (150,000 cents)
INSERT INTO campaign_commercial_terms (campaign_id, version, currency, client_monthly_retainer_cents, client_per_verified_lead_cents, client_per_attended_appointment_cents, client_commission_bps)
VALUES
    ('30000000-0000-0000-0000-000000000001', 1, 'ZAR', 1500000, 50000, 150000, 500)
ON CONFLICT DO NOTHING;

-- 6. Assignment of Sarah Sales to CloudCore campaign
INSERT INTO assignments (id, campaign_id, agent_id, role_in_campaign, status, allocated_hours_per_week)
VALUES
    ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Lead Qualification & Outbound SDR', 'active', 20)
ON CONFLICT (id) DO NOTHING;

-- Compensation terms for Sarah: R250 per verified lead (25,000 cents), R750 per appointment (75,000 cents)
INSERT INTO assignment_compensation_terms (assignment_id, currency, base_hourly_rate_cents, per_verified_lead_cents, per_attended_appointment_cents, commission_bps)
VALUES
    ('40000000-0000-0000-0000-000000000001', 'ZAR', 0, 25000, 75000, 200)
ON CONFLICT DO NOTHING;
