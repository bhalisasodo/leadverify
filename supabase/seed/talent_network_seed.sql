-- ==============================================================================
-- LeadVerify Talent Network — Taxonomy & System Seeds
-- ==============================================================================

-- 1. Categories
insert into professional_categories (slug, name, parent_group, sort_order) values
  ('sales-closer', 'Sales Closers & Account Executives', 'Sales', 1),
  ('sales-sdr', 'Sales Development Representatives (SDR / BDR)', 'Sales', 2),
  ('telesales', 'Outbound Telesales & Phone Pros', 'Sales', 3),
  ('bd-partnerships', 'Partnerships & Strategic Alliances', 'Business development', 4),
  ('bd-manager', 'Business Development Management', 'Business development', 5),
  ('leadgen-research', 'Prospect & Account Research', 'Lead generation', 6),
  ('leadgen-appointment', 'Appointment Setting', 'Lead generation', 7),
  ('cs-account-mgmt', 'Account Management & Retention', 'Customer success', 8),
  ('cs-support', 'Customer Success & Support', 'Customer success', 9),
  ('mkt-digital', 'Digital & Performance Marketing', 'Marketing', 10),
  ('mkt-email', 'Cold & Nurture Email Marketing', 'Marketing', 11),
  ('salesops-crm', 'CRM Architecture & Administration', 'Sales operations', 12),
  ('salesops-analytics', 'Sales Pipeline Analytics', 'Sales operations', 13)
on conflict (slug) do nothing;

-- 2. Skills
insert into skills (slug, name, active) values
  ('cold-calling', 'Cold calling & Outbound Discovery', true),
  ('pipeline-management', 'Pipeline & CRM Management (HubSpot/Salesforce)', true),
  ('prospect-research', 'Prospect Research & List Building', true),
  ('appointment-setting', 'High-Converting Appointment Setting', true),
  ('closing-deals', 'Objection Handling & Closing', true),
  ('email-deliverability', 'Cold Email Strategy & Deliverability', true),
  ('linkedin-outreach', 'Social Selling & LinkedIn Outreach', true),
  ('b2b-contract-negotiation', 'B2B Contract Negotiation', true)
on conflict (slug) do nothing;

-- 3. Industries
insert into industries (slug, name, active) values
  ('saas-tech', 'Software, Cloud & Technology', true),
  ('financial-services', 'Financial Services, Fintech & Insurance', true),
  ('telecoms', 'Telecommunications & Networks', true),
  ('logistics-freight', 'Logistics, Supply Chain & Transport', true),
  ('manufacturing-industrial', 'Manufacturing & Heavy Industry', true),
  ('professional-services', 'Professional Services, Legal & Consulting', true),
  ('healthcare-pharma', 'Healthcare & Medical Devices', true),
  ('retail-ecommerce', 'Retail, FMCG & E-Commerce', true),
  ('mining-energy', 'Energy, Solar & Mining', true)
on conflict (slug) do nothing;
