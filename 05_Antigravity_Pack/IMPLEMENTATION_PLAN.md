# LeadVerify — Antigravity Implementation Plan

## Phase 0 — Repository discovery and technical plan
Deliver:
- Existing repository assessment.
- Existing stack and dependency review.
- Environment/deployment review.
- Route/page inventory.
- Data model and migration plan.
- Role/permission matrix.
- Security and integration risks.
- Founder decision list.

Exit gate: founders approve architecture and scope.

## Phase 1 — Foundation
Build:
- Application shell and navigation by role.
- Authentication.
- User profiles and roles.
- Business accounts and memberships.
- Agent profiles.
- Database migrations.
- RLS and permission tests.
- Staging environment and synthetic seed data.

Exit gate:
- Business, agent, and admin can sign in.
- Cross-tenant access tests pass.
- No privileged credentials exposed.

## Phase 2 — Onboarding and approvals
Build:
- Business onboarding.
- Agent open registration.
- Agent profile completion.
- Verification review queue.
- Assessment records.
- Approve/reject/suspend actions.
- Audit logging.

Exit gate:
- Agent can register but cannot access campaign data until approved.
- Admin decisions are recorded and auditable.

## Phase 3 — Campaign management
Build:
- Campaign request forms.
- Admin review and clarification workflow.
- Campaign statuses and transitions.
- Campaign requirements and acceptance criteria.
- Commercial terms versioning.
- Campaign approval gate.

Exit gate:
- A business can submit a campaign and admin can approve/reject/request clarification.

## Phase 4 — Matching, assignments, and tasks
Build:
- Admin agent search/filter.
- Manual matching.
- Multiple agents and roles per campaign.
- Assignment terms and acceptance.
- Capacity/availability tracking.
- Task allocation and status workflow.
- Assignment-scoped access.

Exit gate:
- Approved agents can accept assignments and access only permitted campaign data.

## Phase 5 — Execution and quality assurance
Build:
- Lead submission.
- Appointment records.
- Opportunity/conversion tracking.
- Deliverable submission.
- Accept/reject/revision workflow.
- Duplicate checks and quality review.
- Activity history.

Exit gate:
- Campaign work can be submitted, reviewed, and validated.

## Phase 6 — Reporting and finance
Build:
- Client campaign dashboard.
- Basic client reports.
- Internal performance dashboards.
- Invoice and payment records.
- Compensation calculation engine.
- Financial ledger.
- Agent earnings/payout status view.
- Reconciliation and adjustment flows.

Exit gate:
- Test campaign can be financially reconciled with immutable/auditable events.

## Phase 7 — Pilot hardening
- E2E tests across all roles.
- Security review and RLS testing.
- Financial edge-case tests.
- Accessibility and responsive review.
- Error monitoring.
- Backups and recovery.
- Privacy and retention controls.
- Production checklist.
- Founder sign-off.

## Phase 8 — Post-pilot improvements
Only after evidence from live campaigns:
- Email/in-app notifications.
- CRM integrations.
- Automated matching recommendations.
- Enhanced agent performance analytics.
- Payment-provider integrations.
- Public agent profiles or marketplace discovery.
- AI-assisted campaign planning.

## Suggested route inventory

Public:
- `/`
- `/login`
- `/register/business`
- `/register/agent`
- `/forgot-password`
- `/privacy`
- `/terms`

Business:
- `/business/dashboard`
- `/business/profile`
- `/business/campaigns`
- `/business/campaigns/new`
- `/business/campaigns/:id`
- `/business/reports`
- `/business/billing`

Agent:
- `/agent/dashboard`
- `/agent/profile`
- `/agent/verification`
- `/agent/assessments`
- `/agent/opportunities`
- `/agent/assignments`
- `/agent/assignments/:id`
- `/agent/deliverables`
- `/agent/earnings`

Admin:
- `/admin/dashboard`
- `/admin/businesses`
- `/admin/agents`
- `/admin/agents/:id`
- `/admin/verifications`
- `/admin/campaigns`
- `/admin/campaigns/:id`
- `/admin/assignments`
- `/admin/tasks`
- `/admin/deliverables`
- `/admin/leads`
- `/admin/appointments`
- `/admin/reports`
- `/admin/finance`
- `/admin/audit-logs`
- `/admin/settings`

Routes are proposals. Implement route guards and server-side permissions; route names do not constitute security.

## Pilot exit criteria
- At least one test campaign completes end-to-end.
- At least two agents and one business can complete their workflows.
- Business and agent data isolation tests pass.
- Deliverable review works.
- Compensation calculation can be reconciled.
- Audit trail is complete for critical events.
- Founders approve legal, commercial, privacy, and operational readiness.
