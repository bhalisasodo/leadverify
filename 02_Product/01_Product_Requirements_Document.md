# LeadVerify Network — Product Requirements Document (PRD)

**Version:** 0.1  
**Status:** Proposed MVP specification  
**Product type:** Web application  
**Primary operating model:** Managed sales network

## 1. Product vision

Build a web-based operating system that enables LeadVerify to onboard and verify sales agents, onboard technology-business clients, assess and approve campaign requests, match agents to campaigns, coordinate work, validate deliverables, report performance, and reconcile campaign finances.

The MVP is for LeadVerify's internal managed-service operation. It is not a public freelancer marketplace.

## 2. Product goals

1. Centralise client, agent, campaign, task, deliverable, and financial records.
2. Make open agent registration possible without granting automatic campaign access.
3. Enable LeadVerify administrators to approve clients and campaigns.
4. Support manual agent matching and campaign assignment.
5. Track campaign tasks, leads, appointments, and sales outcomes.
6. Validate deliverables against campaign-specific acceptance criteria.
7. Calculate agent compensation transparently and traceably.
8. Provide clients with a clear view of campaign status and results.
9. Enforce role-based access and auditable actions.
10. Establish a data model that can support future automated matching and marketplace capabilities.

## 3. Non-goals for MVP

- Public self-service agent marketplace or direct client-agent hiring.
- Automated AI agent matching.
- Automated cold outreach or autonomous AI sales agents.
- Built-in full CRM functionality.
- Native mobile applications.
- Automated bank payouts or escrow.
- Complex subscription billing.
- Video conferencing.
- Public agent rankings based on small or incomparable samples.
- Multi-industry expansion before technology-market validation.

## 4. User roles

### Business user
A representative of a client business. Can manage company profile, submit campaign requests, view approved campaigns, view reports, and access invoices or payment records when enabled.

### Agent
A registered sales professional. Can maintain profile, submit verification information, complete assessments, set availability, view eligible opportunities, apply or accept assignments, submit deliverables, and view compensation records.

### Operations administrator
LeadVerify staff member. Can manage businesses, review agents, approve campaigns, match agents, create tasks, review deliverables, manage campaign status, prepare reports, and maintain operational records.

### Finance administrator
Authorised staff member who can review invoices, client receipts, compensation calculations, adjustments, and payout status. Separation of duties should be supported even if one person initially holds multiple roles.

### Super administrator
Manages roles, configuration, sensitive access, and audit review.

## 5. Core modules

### 5.1 Authentication and account management
- Sign up, sign in, sign out, password reset.
- Role-aware onboarding.
- Account status: pending, active, suspended, rejected.
- Business users belong to a business organisation.
- An agent account is separate from a business account.
- Secure session handling.
- Admin-managed role assignment; users must not self-assign privileged roles.

### 5.2 Business onboarding
Capture:
- Legal / trading name.
- Registration number where applicable.
- Website and business email.
- Business description.
- Technology category.
- Product/service description.
- Country and operating region.
- Primary contact details.
- Billing contact and billing details.
- Verification status and review notes.

Do not collect unnecessary personal or company information. Define retention and access rules.

### 5.3 Agent onboarding
Capture:
- Full name and contact details.
- Location/time zone.
- Languages.
- Work history and relevant experience.
- Sales specialisations.
- Industry experience.
- Preferred channels.
- Availability and capacity.
- Compensation preferences.
- References and supporting evidence where appropriate.
- Identity verification status.
- Assessment results.
- Contract acceptance status.

Agent states:
- registered
- application_submitted
- verification_pending
- assessment_pending
- approved
- rejected
- suspended
- inactive

Approval is required before access to campaign opportunities or client data.

### 5.4 Verification and assessment
- Admin review queue.
- Identity check status and provider/reference (do not store unnecessary identity-document copies).
- Skills assessment records.
- Practical assessment results.
- Reference check status.
- Reviewer, timestamp, and decision notes.
- Expiry/recheck date where appropriate.
- Consent and privacy notices.

### 5.5 Campaign request and approval
Business submits:
- Campaign name and objective.
- Product/service being sold.
- Target market and ideal customer profile.
- Geography.
- Required service modules.
- Target deliverables and volumes.
- Campaign duration.
- Preferred channels.
- Client-provided scripts and materials.
- Existing CRM / data requirements.
- Budget and commercial preference.
- Commission structure, if applicable.
- Sales cycle and conversion information.
- Regulatory or compliance considerations.

Admin review:
- Business legitimacy and product viability.
- Scope clarity.
- Deliverable definitions.
- Target market feasibility.
- Agent skill requirements.
- Campaign economics.
- Client payment risk.
- Legal/regulatory restrictions.
- Data processing requirements.

Campaign statuses:
- draft
- submitted
- under_review
- clarification_required
- approved
- staffing
- ready
- active
- paused
- quality_review
- completed
- cancelled
- rejected

### 5.6 Agent matching and assignment
MVP matching is manual, with filters:
- Skills and specialisations.
- Industry experience.
- Language.
- Location/time zone.
- Availability and capacity.
- Assessment status.
- Campaign eligibility.
- Previous performance, where sufficient data exists.

Admin can assign one or more agents to a campaign and role. Record assignment terms, responsibilities, compensation basis, start/end dates, and acceptance.

### 5.7 Task management
- Create campaign tasks.
- Assign to one or more agents.
- Set due dates, instructions, status, and expected output.
- Track progress and submission.
- Keep task history.
- Notify agents of new or changed assignments.

Task statuses:
- draft
- assigned
- accepted
- in_progress
- submitted
- revision_requested
- accepted
- rejected
- cancelled

### 5.8 Lead management
Capture:
- Campaign.
- Assigned agent / source.
- Prospect/company name.
- Contact name and role.
- Business contact details.
- Website/domain.
- Geography.
- Source and collection date.
- Outreach channel and history.
- Qualification responses.
- Qualification status.
- Duplicate check status.
- Consent / lawful basis metadata where relevant.
- Review status and reviewer.
- Notes and timestamps.

Lead statuses:
- new
- research_in_progress
- contacted
- responded
- qualified
- disqualified
- duplicate
- converted
- closed

Do not assume every lead submission is payable. Campaign-specific acceptance criteria determine whether it is accepted.

### 5.9 Appointment management
Capture:
- Campaign and lead.
- Assigned agent.
- Meeting date/time and time zone.
- Meeting channel/location.
- Attendees and roles.
- Qualification notes.
- Confirmation status.
- Attendance status.
- Outcome and follow-up.
- Evidence or reference where contractually appropriate.

### 5.10 Sales opportunity / conversion tracking
Capture:
- Campaign and prospect.
- Opportunity owner / assigned closer.
- Stage.
- Estimated value and currency.
- Outcome.
- Contract / order reference where appropriate.
- Attributed agents and contribution roles.
- Client-confirmed revenue.
- Commission basis and status.
- Refund / reversal / clawback status.

### 5.11 Deliverable review
- Agents submit deliverables.
- Admin reviews against campaign-specific criteria.
- Accept, reject, or request correction.
- Record reason, reviewer, date, and evidence.
- Accepted deliverables become eligible for compensation calculation according to the agreement.
- Rejected deliverables must not trigger payable compensation unless the campaign agreement explicitly says otherwise.

### 5.12 Reporting
Client reports:
- Campaign status and dates.
- Activity summary.
- Leads submitted and accepted.
- Qualification breakdown.
- Appointments booked, confirmed, attended.
- Sales outcomes where available.
- Performance against agreed KPIs.
- Issues, risks, and next steps.

Internal reports:
- Campaign revenue and costs.
- Agent allocation and utilisation.
- Deliverable acceptance/rejection.
- Contribution margin.
- Client collection status.
- Agent compensation status.
- Campaign performance.

### 5.13 Financial management
- Campaign commercial terms.
- Client invoice records.
- Payments received.
- Agent compensation rules.
- Compensation calculations.
- Adjustments and reversals.
- Payout records and status.
- Transaction ledger.
- Audit history.

MVP may record and reconcile payments without initiating automated transfers.

## 6. User journeys

### Business journey
1. Business registers.
2. Completes company profile.
3. Submits campaign request.
4. Receives clarification if required.
5. Reviews and accepts proposal / statement of work outside or inside the platform, depending on MVP scope.
6. Campaign is approved.
7. Views status and reporting.
8. Reviews deliverables/outcomes.
9. Receives invoice and payment instructions.
10. Renews or closes campaign.

### Agent journey
1. Agent registers.
2. Completes profile.
3. Submits verification information and consents.
4. Completes relevant assessment.
5. Receives approval or rejection.
6. Sets availability.
7. Views eligible campaign opportunity details.
8. Applies or accepts assignment.
9. Completes assigned work.
10. Submits deliverables.
11. Receives review result.
12. Views compensation calculation and payment status.

### Admin journey
1. Reviews business and agent applications.
2. Reviews campaign requests.
3. Approves, rejects, or requests clarification.
4. Defines campaign KPIs and commercial terms.
5. Matches and assigns agents.
6. Monitors execution.
7. Reviews deliverables.
8. Produces client reports.
9. Reconciles client payments and agent compensation.
10. Closes or renews campaign.

## 7. Functional requirements by priority

### P0 — Required for pilot
- Authentication and role-based access.
- Business registration and profile.
- Agent registration and profile.
- Verification and approval workflow.
- Campaign request submission.
- Campaign review and status management.
- Manual agent matching and assignment.
- Task creation and assignment.
- Lead and appointment records.
- Deliverable submission and review.
- Campaign dashboard and basic reporting.
- Compensation calculation records.
- Financial ledger / audit history.
- Admin audit logs.

### P1 — Useful after initial pilot
- Email and in-app notifications.
- Client invoice view.
- Agent earnings view.
- Campaign history.
- Exportable reports.
- Bulk lead import/export with access controls.
- Basic integrations with external CRM tools.
- Enhanced analytics.

### P2 — Later
- Automated matching recommendations.
- Public agent profiles.
- Agent team formation.
- Automated payment provider integration.
- Advanced CRM integrations.
- AI-assisted campaign planning and sales coaching.
- Subscription billing.
- Multi-country support.

## 8. Non-functional requirements
- Responsive web interface.
- Secure authentication and server-side authorisation.
- Database-level row access policies.
- Auditability of sensitive actions.
- Data minimisation and retention controls.
- Backups and recovery plan.
- Clear error handling.
- Accessible forms and readable status indicators.
- Pagination and filtering for growing datasets.
- No secrets committed to source control.
- Environment-specific configuration.
- Automated tests for critical permissions and financial calculations.

## 9. Acceptance criteria

1. A business can register and submit a campaign request.
2. A business cannot approve its own campaign.
3. An agent can register but cannot access campaign data before approval and assignment/eligibility.
4. An agent cannot view another agent's private profile, documents, assignments, or compensation.
5. An admin can review and approve/reject agents and campaigns.
6. An admin can assign multiple agents and roles to one campaign.
7. An assigned agent can view only the campaign information needed for their work.
8. An agent can submit leads and other deliverables.
9. An admin can accept, reject, or request corrections to deliverables.
10. Compensation eligibility is calculated only from the relevant agreed basis and accepted/verified outcomes.
11. Financial adjustments are traceable and cannot silently overwrite prior ledger entries.
12. A business can view only its own campaigns and authorised reports.
13. All privileged actions are logged.
14. Campaigns cannot become active without approved scope, commercial terms, and assigned capacity.
15. Critical access-control and financial tests pass before pilot release.

## 10. MVP release definition

The MVP is ready for a controlled pilot when:
- P0 workflows are complete.
- At least one test business and multiple test agents can complete end-to-end journeys.
- Permissions are tested across all roles.
- A test campaign can be created, staffed, executed, reviewed, reported, and financially reconciled.
- Backup, error monitoring, and basic operational support are in place.
- The founders approve the outstanding commercial and legal decisions.
