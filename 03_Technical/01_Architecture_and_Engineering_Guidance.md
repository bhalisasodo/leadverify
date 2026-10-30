# LeadVerify — Technical Architecture & Engineering Guidance

## 1. Architecture principle

Start with a modular monolith: one web application, one backend/API layer, and one relational database. Keep boundaries clean so modules can evolve without prematurely introducing microservices.

## 2. Proposed stack

| Layer | Recommendation |
|---|---|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS and a consistent component system |
| Backend platform | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Authorisation | PostgreSQL Row Level Security (RLS) plus server-side checks |
| File storage | Supabase Storage |
| Hosting | Render or Vercel; select one deployment target for MVP |
| Email | Resend or another transactional email provider |
| Product analytics | PostHog, subject to privacy review |
| Error monitoring | Sentry or equivalent |
| Source control | GitHub |

This is a proposed stack, not a locked decision. Confirm hosting, budget, and developer familiarity before implementation.

## 3. Application modules

- Identity and access.
- Business accounts.
- Agent network.
- Verification and assessment.
- Campaign management.
- Matching and assignments.
- Task execution.
- Lead and appointment records.
- Deliverable review.
- Reporting.
- Commercial agreements.
- Financial ledger.
- Notifications.
- Audit and compliance.

## 4. Suggested repository structure

```text
leadverify/
  README.md
  docs/
  src/
    app/
      routes/
      layouts/
    components/
      ui/
      forms/
      tables/
      status/
    features/
      auth/
      businesses/
      agents/
      verification/
      campaigns/
      assignments/
      tasks/
      leads/
      appointments/
      deliverables/
      reports/
      finance/
      admin/
    lib/
      supabase/
      permissions/
      validation/
      formatting/
    hooks/
    types/
  supabase/
    migrations/
    seed/
    functions/
  tests/
    unit/
    integration/
    e2e/
  .env.example
```

Adapt to the framework's conventions, but preserve clear feature boundaries.

## 5. Authentication and authorisation

- Use Supabase Auth or an equivalent managed authentication provider.
- Never trust role claims supplied by the browser.
- Enforce access on the server/database, not only through UI visibility.
- Use RLS for business- and agent-scoped records.
- Keep privileged service keys server-side only.
- Use explicit admin roles and least-privilege access.
- Log role changes and sensitive admin actions.
- Test cross-tenant access and IDOR-style attacks.

## 6. Data ownership and tenant isolation

- A business user can access only their own organisation's records.
- An agent can access their own profile, applications, assignments, and compensation records.
- An agent can access campaign data only after the assignment is active and only to the extent needed for the task.
- An agent must not see other agents' private information or compensation.
- Client users must not see agent private verification documents or internal assessment notes.
- Only authorised LeadVerify staff can access cross-client operations data.
- Finance permissions should be separate from general operations permissions where possible.

## 7. Financial integrity

- Use integer minor units for money (e.g. cents) or a suitable exact decimal type. Never use floating-point arithmetic for financial amounts.
- Store currency explicitly (initially likely ZAR, but confirm).
- Preserve original agreed compensation terms and version them.
- Record every invoice, receipt, earning, adjustment, reversal, and payout as a traceable event.
- Do not silently overwrite balances.
- Use idempotency for payment webhooks and transaction ingestion.
- Reconcile calculated amounts with the signed campaign/assignment terms.
- Distinguish estimated, accrued, approved, payable, paid, reversed, and disputed amounts.

## 8. Matching logic

MVP matching is manual. Provide filters and a suitability view using:
- Verification and approval status.
- Skills.
- Industry experience.
- Language.
- Location/time zone.
- Availability and capacity.
- Assessment results.
- Campaign eligibility.
- Performance history when sample size is meaningful.

Do not implement opaque automated ranking in the first release. Record the reasons for admin matching decisions so future recommendations can be evaluated.

## 9. Integrations

MVP:
- Transactional email.
- Optional analytics/error monitoring.
- Export to CSV for operational analysis.

Later:
- CRM integrations.
- Calendar integrations.
- Payment providers.
- Identity verification provider.
- Communication providers, subject to channel rules and consent.

Do not build direct outreach automation until legal basis, channel policies, opt-outs, suppression lists, and audit requirements are defined.

## 10. Environments and secrets

- Separate local, staging, and production environments.
- Use `.env.example` with placeholder names only.
- Never commit real API keys, service-role keys, passwords, or customer data.
- Apply database migrations through version control.
- Seed only synthetic test data.
- Use backups and test restoration.
- Protect production data from test scripts.

## 11. Quality and testing

- Unit tests for validation, qualification rules, commission calculations, and status transitions.
- Integration tests for database policies and workflows.
- E2E tests for business, agent, and admin journeys.
- Security tests for role boundaries and tenant isolation.
- Test financial rounding, refunds, duplicate events, partial payments, and reversals.
- Test timezone handling for meetings and deadlines.

## 12. Deployment

- Automated build and test pipeline.
- Staging deployment before production.
- Database migrations reviewed and applied in order.
- Health checks and error monitoring.
- Rollback plan for application releases and database migrations.
- Production launch checklist signed off by founders.
