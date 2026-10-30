# ANTIGRAVITY START PROMPT — LeadVerify Network

You are the lead product engineer and implementation agent for **LeadVerify Network**.

Your task is to implement a production-minded MVP for a managed sales execution network. You must use the documentation in this pack as the source of truth.

## 1. Product context

LeadVerify serves small technology businesses. It provides managed lead generation, outbound sales, lead qualification, appointment setting, and sales conversion using a network of verified sales professionals.

The founders have decided:
- Initial customer segment: small businesses.
- Initial industry: technology.
- Services: lead generation, lead qualification, appointment setting, closing deals, outbound sales.
- Agent onboarding: open registration.
- Campaign access: only after verification and approval.
- Business interaction: managed by LeadVerify; clients do not directly hire agents in the MVP.
- Long-term ambition: distributed sales network / marketplace-ready infrastructure.
- Initial agent supply: founders have access to some potential agents.

## 2. Product principle

Build a **managed-sales operating system with marketplace-ready architecture**.

Do not build a public freelancer marketplace as the MVP. Do not allow direct client-agent hiring. The internal admin team controls campaign approval, agent matching, assignments, quality assurance, and financial reconciliation.

## 3. Required reading

Before coding, read:
1. `README.md`
2. `01_Strategy/01_Business_Model_and_Positioning.md`
3. `02_Product/01_Product_Requirements_Document.md`
4. `02_Product/02_Workflows_and_User_Stories.md`
5. `03_Technical/01_Architecture_and_Engineering_Guidance.md`
6. `03_Technical/02_Proposed_Data_Model.md`
7. Relevant operations/commercial documents.

If a conflict exists, report it and ask for a decision. Do not silently invent a new business rule.

## 4. Initial implementation approach

Use a modular monolith. The proposed stack is React + TypeScript + Vite, Supabase/PostgreSQL, Supabase Auth, private Supabase Storage, and database RLS. Confirm the existing repository and stack before changing anything. If the repository already has a suitable established stack, explain the trade-offs before replacing it.

Build:
- Business portal.
- Agent portal.
- LeadVerify operations/admin dashboard.
- Authentication and role-based access.
- Business onboarding.
- Agent registration, verification and approval.
- Campaign submission and review.
- Manual agent matching and assignment.
- Task and deliverable management.
- Lead and appointment records.
- Deliverable review.
- Campaign reporting.
- Compensation calculations and auditable financial ledger.
- Audit logs.

## 5. Non-negotiable business rules

1. Clients contract with and interact with LeadVerify.
2. Clients cannot browse and hire agents directly in the MVP.
3. Anyone may register as an agent, but registration does not grant campaign access.
4. Agents must be approved before viewing eligible campaign opportunities.
5. Assignment-specific permissions control access to client/campaign data.
6. Campaigns require approved scope, deliverables, commercial terms, and staffing before activation.
7. Submitted leads are not automatically accepted or payable.
8. Deliverables are reviewed against campaign-specific acceptance criteria.
9. Agent compensation follows the specific campaign/assignment agreement.
10. Expected commission is not collected cash.
11. Financial events must be traceable; do not silently overwrite balances.
12. Use exact decimal/integer minor-unit handling for money, never floating point.
13. Business users only see their own organisation's data.
14. Agents only see their own profile and assigned work.
15. Privileged actions must be auditable.
16. Do not implement regulated-industry campaigns without a configurable eligibility check and founder-approved policy.

## 6. Engineering guardrails

- Inspect the repository before editing.
- Preserve existing working functionality unless a change is required and approved.
- Create a clear implementation plan before major code changes.
- Work in small, testable milestones.
- Use typed models and schema validation.
- Enforce permissions server-side and in PostgreSQL RLS; frontend hiding is not security.
- Never expose service-role keys or secrets in client code.
- Never commit real credentials or customer data.
- Use synthetic seed data only.
- Add migrations to version control.
- Add unit, integration, and end-to-end tests for critical workflows.
- Test tenant isolation with at least two businesses and two agents.
- Test financial calculations, adjustments, reversals, and duplicate events.
- Use accessible, responsive interfaces.
- Avoid placeholder buttons or fake success states.
- Do not claim integrations work unless implemented and tested.
- Document assumptions and unresolved decisions.

## 7. Visual and UX direction

Create a credible, modern B2B SaaS platform. It should feel professional, efficient, trustworthy, and technology-native.

Prioritise:
- Clear dashboards.
- Useful status indicators.
- Simple forms.
- Strong table filtering and search.
- Consistent campaign lifecycle views.
- Responsive layouts.
- Accessible contrast and keyboard navigation.
- Clear empty, loading, error, and success states.

Do not spend time on decorative complexity at the expense of workflow completeness.

Brand colours, logo, typography, and final visual identity have not been specified in this pack. Do not invent a permanent brand system. Use a restrained, easily replaceable design-token system and request approved brand assets when available.

## 8. Implementation order

Follow `IMPLEMENTATION_PLAN.md`.

Do not attempt to build every module in one large unreviewed change. First produce:
- Repository assessment.
- Architecture proposal.
- Database schema/migration plan.
- Route and role map.
- Implementation milestones.
- List of founder decisions required.

Then implement Phase 1 and report what is complete, what is tested, and what remains.

## 9. Definition of done

A feature is not done merely because the page renders. It must include:
- Data model and migration where needed.
- Server-side validation.
- Authorisation and RLS.
- Loading, empty, error, and success states.
- Audit events where relevant.
- Tests.
- Documentation.
- No unresolved critical security issue.

The MVP is ready for pilot only when the acceptance criteria in the PRD pass end-to-end.

## 10. First response required from you

Before implementation, provide:
1. Repository and existing-stack assessment.
2. Proposed architecture mapped to the current repository.
3. Database entities and migration sequence.
4. User roles and permission matrix.
5. Route/page inventory.
6. Phased implementation plan.
7. Risks, ambiguities, and founder decisions needed.

Do not start a large implementation until the founders approve the plan.
