-- LeadVerify Network: Businesses & Business Memberships

CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legal_name VARCHAR(255) NOT NULL,
    trading_name VARCHAR(255),
    registration_number VARCHAR(100),
    website VARCHAR(255),
    business_email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    description TEXT,
    technology_category VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'South Africa',
    region VARCHAR(100),
    verification_status account_status_type NOT NULL DEFAULT 'pending',
    billing_email VARCHAR(255),
    billing_address TEXT,
    tax_number VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_businesses_updated_at
    BEFORE UPDATE ON businesses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS business_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    membership_role VARCHAR(50) NOT NULL DEFAULT 'admin', -- 'owner', 'admin', 'viewer'
    status account_status_type NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT business_user_unique UNIQUE (business_id, user_id)
);

CREATE INDEX idx_business_memberships_business_id ON business_memberships(business_id);
CREATE INDEX idx_business_memberships_user_id ON business_memberships(user_id);
