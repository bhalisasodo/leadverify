# LeadVerify — Project Documentation Pack

**Purpose:** Single source of truth for the LeadVerify business model, product requirements, operating model, technical foundation, and initial implementation instructions.

**Product direction:** A managed, technology-focused sales execution network. Businesses purchase managed campaigns from LeadVerify. LeadVerify recruits and verifies sales professionals, assigns them to campaigns, manages execution and quality, and administers client billing and agent compensation.

## Pack contents

| Folder | Contents |
|---|---|
| `01_Strategy` | Business model, positioning, market focus, strategic assumptions |
| `02_Product` | Product requirements, workflows, user stories, acceptance criteria |
| `03_Technical` | Architecture, proposed data model, security, integrations |
| `04_Operations_Commercial` | Campaign operations, commercial models, agent operations, compliance checklist |
| `05_Antigravity_Pack` | Start prompt, implementation sequence, coding-agent guardrails, definition of done |

## Important status labels

- **DECIDED:** Explicitly selected by the founders in the planning discussion.
- **PROPOSED:** Recommended direction, not yet formally approved.
- **OPEN:** Requires founder input, validation, legal advice, or commercial testing.
- **ILLUSTRATIVE:** Example numbers or scenarios, not actual pricing or forecasts.

## Confirmed strategic decisions

1. Initial customer segment: small businesses.
2. Initial industry: technology.
3. Initial service capabilities: lead generation, lead qualification, appointment setting, closing deals, and outbound sales.
4. Agent supply: founders have access to some potential agents.
5. Agent onboarding: open registration, with verification and approval before campaign access.
6. Business interaction: managed. Clients engage LeadVerify, not agents directly.
7. Long-term ambition: a distributed sales network / marketplace-ready infrastructure.
8. Initial delivery model: managed sales network; matching and campaign operations may be manual in the MVP.

## Product principle

Build a **managed-sales operating system with marketplace-ready architecture**, not a public freelancer marketplace with managed services bolted on.

## How to use this pack

- Read the strategy and PRD before implementation.
- Treat `05_Antigravity_Pack/ANTIGRAVITY_START_PROMPT.md` as the initial coding-agent instruction.
- Implement in the sequence in `IMPLEMENTATION_PLAN.md`.
- Do not invent unresolved commercial, legal, or product decisions. Record them as assumptions and ask the founders.
- Keep this documentation updated as decisions change.

## Current status

This is a planning and implementation specification based on the founders' stated direction. It is not legal, tax, accounting, or financial advice. Pricing, contracts, privacy practices, contractor classification, regulated-industry eligibility, and payment flows require validation before launch.
