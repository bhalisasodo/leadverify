# Implementation Assessment

## 1. Current Architecture
- **Framework:** The repository is a **Vite‑based React SPA** (see `package.json` scripts `dev`, `build`). It is **not** using Next.js/App Router as required.
- **Styling:** Tailwind CSS is present (`tailwind.config.js`) but the codebase currently uses plain CSS (`index.css`) and component‑scoped classNames. No design‑token integration.
- **State / Backend:** A **mock in‑memory store** (`src/lib/supabase/client.ts`) simulates Supabase‑like CRUD operations. Real Supabase client, authentication, Row‑Level Security (RLS) and storage are **not** wired.
- **Routing:** The app relies on a custom tab‑based navigation (`Navigation.tsx`) driven by a `activeTab` state – **no file‑based routing**.
- **Feature Scope:** Existing code focuses on **campaign/lead management** (admin, business, agent portals) which is unrelated to the LeadVerify Talent Network.
- **Database Migrations:** Supabase migrations exist under `supabase/migrations` but they define enums and tables for the campaign product, not the talent‑network schema outlined in the brief.
- **Tests:** Unit tests exist for ledger and permissions (`tests/unit`), unrelated to the forms or UI.

## 2. Proposed Changes to Meet the Brief
| Area | Gap | Action | Owner |
|------|-----|--------|-------|
| **Framework** | Vite SPA → Next.js (App Router) | Scaffold a new **Next.js (TypeScript) + Tailwind** project in `./app` (or upgrade the existing repo) | LeadVerify team / Antigravity
| **Styling** | No design‑token usage | Add Tailwind theme extensions for the brand tokens (Verify Blue, Lead Sky, etc.) and configure `@tailwindcss/forms` for inputs | Front‑end dev
| **Routing** | No page routes | Create `app/(site)/...`, `app/talent-network/...`, `app/admin/...` following the suggested folder structure | Front‑end dev
| **Components** | Only generic `Navigation` & portal components exist | Build a **UI component library** (`components/ui`) for Button, Input, Select, Checkbox, Card, FileUpload, Stepper, etc., re‑using Tailwind utilities and adhering to accessibility guidelines. | Front‑end dev
| **Backend / Supabase** | Mock store only; missing tables, RLS, auth, storage | Deploy a Supabase project, run the **Talent Network migrations** (derived from section 5) and implement server‑side API routes (`app/api/*/route.ts`) that call Supabase services. | Backend dev / DevOps
| **Forms & Validation** | No application form, no Zod schemas | Implement multi‑step form using React Hook Form + Zod based on the design files (`Apply*.dc.html`). | Front‑end dev
| **File Uploads** | No storage integration | Use Supabase Storage with signed URLs, enforce virus scanning (to be decided). | Backend dev
| **Email Provider** | Not configured | Add integration with a transactional email service (e.g., SendGrid, Postmark – ask the user). | DevOps
| **Auth** | No auth – current store uses hard‑coded admin | Use Supabase Auth for **admin users** (MFA optional) and **applicant‑less** flow for talent applicants (email‑based magic link). | Backend dev
| **Documentation** | Minimal README | Add architecture docs, security checklist, POPIA notes, deployment instructions. | Docs author

## 3. Database Design (High‑Level)
- Re‑use the **core tables** defined in the brief (applicants, professional_profiles, categories, skills, industries, work_preferences, documents, verification_records, consent_records, application_status_history, administrative_users, audit_logs).
- Add **UUID primary keys**, timestamps (`created_at`, `updated_at`).
- Implement **many‑to‑many join tables** for categories & skills.
- Apply **Row‑Level Security (RLS)** policies per table (applicant can only read own rows, admin roles per `administrative_users`).
- Create **storage bucket** `applicant-documents` with private ACL; serve via signed URLs.
- Include **soft‑delete** (`deleted_at`) and **audit log** triggers.
- **Migration order:** core schema → taxonomy seed → RLS policies → audit triggers.

## 4. Security & POPIA Considerations
- **RLS** enforced on every table; default deny.
- **No public APIs** expose applicant data.
- **Document storage**: private bucket, signed URLs, size/type validation, virus scan (scanner to be selected).
- **Data minimisation:** collect identity docs only if verification step enabled.
- **Applicant access:** magic‑link token hashed in DB; short expiry (24 h).
- **Admin auth:** Supabase Auth with optional MFA; audit all privileged actions.
- **Retention:** soft‑delete + scheduled hard‑delete (periods to be defined).
- **Rate limiting / abuse protection** on form submissions and uploads.
- **Transport:** enforce HTTPS, HSTS, CSP, secure cookies.
- **POPIA non‑technical items** (Information Officer, privacy notice, vendor agreements, hosting region, breach response) must be documented – **do not claim compliance**.

> [!IMPORTANT] **Professional legal advice is required for POPIA compliance** – flag these items in the README.

## 5. New Routes & Components (Phase 1 & 2)
| Path | Page | Key Components |
|------|------|----------------|
| `/` | Marketing website (Phase 1) | Layout, Hero, Feature cards, Footer – rebuilt from `Website.dc.html`.
| `/talent-network` | Landing page (Phase 2) | `LandingHero`, `WhyLeadVerify`, `PhotoStrip`, `CTA` – from `Talent.dc.html`.
| `/talent-network/apply` (step 1‑6) | Multi‑step application wizard | `Stepper`, `PersonalInfoForm`, `ProfessionalInfoForm`, `ExpertiseForm`, `PreferencesForm`, `DocumentsForm`, `ConsentForm` – from `Apply*.dc.html`.
| `/talent-network/apply/confirmation` | Confirmation & status tracker | `ReferenceNumber`, `StatusTracker`, `WithdrawLink` – from `Confirmation.dc.html`.
| `/admin` | Admin dashboard (protected) | `AdminOverview`, `ApplicationsList`, `ApplicationDetail`, `StatusChanger`, `DocumentViewer` – from `Admin.dc.html`.
| API routes (e.g., `POST /api/applications`) | Server‑side endpoints for form submit, draft save, document upload, consent, status updates. |

## 6. Integration Risks
- **Existing codebase mismatch:** The current Vite/React app is unrelated; migrating to Next.js will require a new repo or extensive rewriting.
- **Design token mapping:** Careful extraction of colours, typography, spacing from the `.dc.html` files; any mismatch may break visual fidelity.
- **Supabase RLS policies:** Complex policy logic can cause hidden permission bugs; thorough testing needed.
- **File upload & virus scanning:** Need a scanner that works in the CI environment; integration may be non‑trivial.
- **Email provider selection:** Different providers have different API shapes; templating must align with the brief.
- **Applicant magic‑link flow:** Secure token generation and hashing must be implemented correctly to avoid replay attacks.
- **Performance / image handling:** Need to configure `next/image` with the supplied photos; ensure proper `sizes` for responsive delivery.
- **Accessibility:** Minimum tap target, focus management, contrast – must be validated manually and with automated tools.

## 7. Implementation Sequence (Section 9 of the Brief)
1. **Repo setup** – initialise a Next.js app with Tailwind, add design tokens, create base UI components, rebuild the marketing site, add "Talent Network" link to the nav.
2. **Database schema** – write Supabase migrations for the talent‑network tables, seed taxonomy, add RLS policies, write tests for RLS.
3. **Talent Network landing page** – implement `/talent-network` using the design markup and photos.
4. **Application form** – build the six‑step wizard, client‑side Zod validation, draft‑save (Supabase `upsert`), final transaction on submit.
5. **Secure document upload** – integrate Supabase Storage, enforce type/size limits, hook in virus scanner.
6. **Consent & confirmation workflow** – store consent records, generate reference number, send confirmation email, display status tracker.
7. **Admin authentication & dashboard** – protect `/admin` with Supabase Auth, role checks, overview widgets, application list & detail view.
8. **Verification records & audit** – implement verification record CRUD, status‑history logging, audit log creation.
9. **Documentation** – architecture diagram, DB diagram, deployment steps, security & POPIA checklist.
10. **Full test pass** – run unit, integration, RLS, accessibility, performance tests and produce a test report.

## 8. Open Questions (Section 10 + Additional)
1. **Option lists** – full enumerations for industries, languages, experience ranges, weekly hours, compensation structures, employment statuses.
2. **File upload** – allowed MIME types, maximum file size, and which virus‑scanning service to use.
3. **Retention periods** – how long to keep unsuccessful, withdrawn, and inactive applications before hard delete.
4. **Hosting & Email** – preferred hosting provider/region for Supabase and next app, and which transactional email provider and sending domain should be used.
5. **Information Officer & Privacy Notice** – name, contact details, and location of the full privacy‑notice text.
6. **Admin MFA** – is multi‑factor authentication required at launch, and who are the initial admin users?
7. **Identity verification** – is the identity‑document step enabled for Phase 2, or only planned for later phases?
8. **Existing repo / domain** – is there an existing Git repository, custom domain, and deployment target that we should continue using?
9. **Design token precision** – any overrides beyond the colour palette (e.g., exact shadow values, line‑height) that are not in the `.dc.html` files?
10. **Email templates** – do you have finalized copy for the application‑received, additional‑info, status‑update, and withdrawal emails?

---
*This assessment is intended for review before any code changes are made. Please answer the open questions and approve the plan so we can proceed.*