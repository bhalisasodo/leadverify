# LeadVerify — Workflows & User Stories

## 1. Campaign lifecycle

`draft → submitted → under_review → (clarification_required ↔ under_review) → approved → staffing → ready → active → quality_review → completed`

Alternative terminal or pause states: `rejected`, `paused`, `cancelled`.

### Transition controls
- Business can create and submit a request.
- Only authorised LeadVerify staff can approve, reject, pause, activate, or complete campaigns.
- Campaign cannot become active until commercial terms, scope, deliverables, capacity, and required materials are confirmed.
- Every transition records actor, timestamp, previous state, new state, and reason.

## 2. Agent lifecycle

`registered → application_submitted → verification_pending → assessment_pending → approved`

Alternative states: `rejected`, `suspended`, `inactive`.

Approval is not automatic. Agent registration does not grant access to client data or campaigns.

## 3. Lead lifecycle

`new → research_in_progress → contacted → responded → qualified / disqualified / duplicate → converted / closed`

Campaign-specific criteria define what qualifies as a payable accepted lead.

## 4. Deliverable lifecycle

`draft → submitted → accepted / rejected / revision_requested`

A deliverable should retain review history. Revisions must not erase prior submissions or decisions.

## 5. User stories

### Business
- As a business user, I want to create a company profile so LeadVerify can understand and verify my business.
- As a business user, I want to submit a campaign request so LeadVerify can scope a sales campaign.
- As a business user, I want to see campaign status so I know what is happening.
- As a business user, I want to view campaign results so I can evaluate performance.
- As a business user, I want to view invoices and payment records so I can reconcile charges.

### Agent
- As an agent, I want to register openly so I can apply to join the network.
- As an agent, I want to describe my skills and experience so LeadVerify can assess campaign suitability.
- As an agent, I want to submit verification information securely.
- As an agent, I want to set my availability so I am not assigned beyond my capacity.
- As an agent, I want to see compensation and requirements before accepting an assignment.
- As an agent, I want to submit deliverables and see review feedback.
- As an agent, I want to see earned, pending, approved, and paid compensation separately.

### Operations administrator
- As an administrator, I want to review agent applications so only suitable agents enter the active network.
- As an administrator, I want to review campaign economics so LeadVerify does not accept unsustainable work.
- As an administrator, I want to match agents to campaigns by skill, availability, and experience.
- As an administrator, I want to review deliverables so clients pay only for agreed outputs.
- As an administrator, I want to see campaign performance and margin so I can make operational decisions.

### Finance administrator
- As a finance administrator, I want to record client invoices and receipts.
- As a finance administrator, I want to calculate agent compensation according to the accepted agreement.
- As a finance administrator, I want to record payouts and reversals.
- As a finance administrator, I want every financial event to be auditable.

## 6. Key business rules

1. Clients purchase managed services from LeadVerify.
2. Clients do not directly hire agents through the MVP.
3. Agents must be approved before accessing campaign opportunities.
4. Assignment-specific access is required before an agent can access client campaign data.
5. Every campaign must have an agreed scope and commercial model.
6. Deliverables are judged against criteria defined before work begins.
7. A submitted lead is not automatically an accepted or payable lead.
8. Duplicate, invalid, incomplete, or out-of-scope deliverables can be rejected according to campaign terms.
9. Agent compensation is governed by the specific assignment and campaign agreement.
10. Future client commission is not treated as collected cash.
11. Financial records are append-only or otherwise retain a complete adjustment history.
12. Client and agent personal information is only visible to authorised roles.
13. Admin actions affecting approval, assignment, acceptance, financial status, or access are audited.
14. Regulated sales activity requires a separate eligibility and authorisation check.

## 7. Example qualification criteria

A campaign might define a qualified B2B SaaS lead as:
- Company operates in the agreed geography.
- Company fits the agreed employee-size or revenue range.
- Prospect is a relevant decision-maker or influencer.
- Business contact information is valid.
- Prospect has a documented need or relevant interest.
- No duplicate exists within the defined lookback period.
- Outreach and data collection comply with the agreed legal and channel requirements.

This is an example only. Criteria must be campaign-specific and agreed before execution.
