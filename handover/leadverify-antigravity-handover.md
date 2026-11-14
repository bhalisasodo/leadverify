# LeadVerify: build handover for Antigravity

You are the lead engineer for LeadVerify, a South African B2B sales intelligence and outsourced sales company. I am handing you an exported design file plus photos. Your job is to turn them into a real, deployable application, in stages, and to ask before guessing.

Read this whole brief before touching anything. Then follow the workflow in section 3.

---

## 1. What you are building

**Phase 1 (preserve and rebuild):** the existing LeadVerify marketing website, designed in the `Website` artboard. It sells our services. Its content is approved. Rebuild it faithfully as real components. Do not rewrite copy.

**Phase 2 (build now):** the **LeadVerify Talent Network**: a free registration and verification programme for South African sales professionals and adjacent commercial talent. It consists of:
- a landing page
- a six-step application form
- confirmation and status pages
- a private admin dashboard for reviewing and verifying applications
- a secure, structured database behind all of it

**Phases 3 and 4 (do NOT build):** searchable talent directory, public profiles, client accounts, matching, marketplace, messaging, job posts, payments, subscriptions, ratings, AI ranking. Design the data model so these can be added later without a rebuild, but write no code for them.

Guiding principle: *build for today's requirements, architect for tomorrow's opportunities, and add no complexity before it creates business value.*

---

## 2. The design export (source of truth for look and flow)

The export is a canvas of artboards. Treat it as a visual and UX specification, not as code to ship. Rebuild each screen as clean, reusable, responsive components.

| Artboard file | What it is |
|---|---|
| `Main.dc.html` | Logo system: primary, stacked, icon, reversed, one-colour |
| `Colour.dc.html` | Colour palette and usage rules |
| `Type.dc.html` | Typography and brand voice |
| `Applications.dc.html` | Business card, email signature, avatar |
| `Website.dc.html` | **Phase 1** marketing site |
| `Talent.dc.html` | **Talent Network landing page** |
| `Apply.dc.html` | Application step 1, Personal information |
| `Apply2.dc.html` | Step 2, Professional information |
| `Apply3.dc.html` | Step 3, Professional expertise |
| `Apply4.dc.html` | Step 4, Work preferences |
| `Apply5.dc.html` | Step 5, Supporting documents |
| `Consent.dc.html` | Step 6, Consent and submit (mobile layout, 390px) |
| `Confirmation.dc.html` | Application received and status tracker |
| `Admin.dc.html` | Admin overview (sample data) |
| `canvas.json` | Artboard layout index |

Extract the exact values you need from the artboard markup. If anything is ambiguous, the artboard wins over this document for visuals, and this document wins for behaviour.

### Design tokens

| Token | Value | Use |
|---|---|---|
| Verify Blue | `#2B85E8` | Logo "Lead", icons, large text only (3.7:1 on white) |
| Lead Sky | `#5DA9FF` | Logo "Verify", graphic accents. Never text on white (2.4:1) |
| Deep Blue | `#1D5FB8` | Buttons, links, small text, dark sections (6:1 with white) |
| Ink | `#0F2540` | Headings, dark backgrounds |
| Slate | `#44546A` | Body text |
| Mist | `#EEF5FF` | Section and card backgrounds |
| Border | `#D5E3F5` | Card and input borders |

- **Fonts:** Poppins (600/700) for headings and buttons, Inter (400/500/600) for body. Load via `next/font`. Fallbacks: Arial, Helvetica.
- **Shape:** cards radius 16px, buttons and inputs radius 10 to 12px, photos radius 20px. Page container max-width 1120px with 32px side padding.
- **Accessibility:** minimum tap target 44px (inputs and buttons are 48 to 52px in the design). Visible focus rings. Every input has a real `<label>`. Status is never shown by colour alone (badges carry text). Use Deep Blue, not Verify Blue or Lead Sky, for small text.
- **Logo:** magnifier ring (Lead Sky) with a check mark (Verify Blue), wordmark "Lead" in Verify Blue and "Verify" in Lead Sky, tagline "Your outsourced sales intelligence partner." The icon is built from SVG circles and paths in the artboards. Reuse that SVG. Do not re-trace it.

### Photography

Photos were supplied as files and are referenced in the artboards by internal asset IDs that will not resolve outside the design tool. Use the supplied files and map them as below. Serve through `next/image` with `sizes`, modern formats, and meaningful `alt` text (the alt text in the artboards is a good starting point).

| Slot | File | Ratio | Notes |
|---|---|---|---|
| Website hero | `hero.jpg` | 4:5 crop | `object-position: 62% 50%` |
| Website "Selling is a human job" | `story.jpg` | 3:2 | `60% 40%` |
| Website photo row | `research.jpg`, `call.jpg`, `handshake.jpg` | 4:3 | |
| Talent hero | `tn_hero.jpg` | 4:5 | `50% 62%` |
| Talent "What it is" | `tn_why.jpg` | 3:2 | `50% 40%` |
| Talent photo strip | `tn_celebrate.jpg`, `tn_network.jpg`, `tn_remote.jpg` | 4:3 | |

These images are AI-generated. Keep an internal note of that, and do not present them as real team members, clients or testimonials. Team portraits on the site are placeholders until real headshots are supplied: build the portrait component with a graceful fallback.

### Known gaps in the mockups (do not invent, ask me)

- Dropdowns show placeholder text only. The option lists (industries, languages, years of experience ranges, weekly hours, compensation structures, employment statuses) are undecided.
- The admin screen uses made-up sample data. Real data comes from the database.
- The nav item "Talent Network" links to `/talent-network`. All other links are placeholders.
- File upload types and size limits are undecided.
- Email copy, privacy notice text and consent wording versions are not final.

---

## 3. Workflow (follow in order)

1. **Inspect** the repo (or set up a new one if none exists) and the export. Identify framework, styling system, components, routes and any backend.
2. **Write an implementation assessment** and STOP for my approval. It must cover: current architecture, proposed changes, database design, security considerations, routes and components, integration risks, and the implementation sequence. Keep it concise. Also list every open question (section 10).
3. **Implement incrementally** in the order in section 9. After each stage, summarise what changed, how you tested it, and what is next. Commit in small, reviewable steps.
4. **Preserve existing functionality.** Do not remove or rewrite approved business content without asking.

---

## 4. Stack and architecture

If no stack already exists, use:
- **Next.js (App Router) with TypeScript**
- **Tailwind CSS**, with the tokens above in the theme config
- **Supabase**: PostgreSQL, Auth, Storage, Row Level Security
- **Zod** for validation, **React Hook Form** for forms
- A transactional email provider (ask me which)

Build a **modular monolith**. No microservices, queues or extra infrastructure unless I ask.

Suggested structure:

```
/app
  /(site)            Phase 1 marketing pages
  /talent-network    landing, /apply, /apply/confirmation, /status
  /admin             overview, applications, applications/[id]
/components
  /ui                button, input, select, checkbox group, chip, badge, card, file-upload, stepper
  /site, /talent, /admin
/lib
  /config            env access and app settings, no secrets in source
  /db                typed data-access layer (all queries live here)
  /services          business logic: applications, verification, consent, documents, email
  /validation        zod schemas shared by client and server
  /auth              session and role helpers
/supabase
  /migrations        versioned SQL migrations
  seed.sql           taxonomy seed data
/docs                README, architecture, security checklist, deployment
```

Rules:
- Components never call the database directly. They call services, which call the data-access layer.
- Server-side validation is authoritative. Client validation is only for convenience.
- Configuration, credentials and email settings live in environment variables, with a documented `.env.example`.
- Use consistent naming, shared utilities, structured logging and explicit error handling.

---

## 5. Database design

Use PostgreSQL with UUID primary keys (`gen_random_uuid()`), `created_at` and `updated_at` timestamps, and migrations only (no manual schema changes). Use many-to-many join tables for categories, skills and industries. Keep personal data separate from professional profile data.

**Core tables**

- `applicants`: id, reference (unique, human-friendly such as `LV-TN-000123`), first_name, last_name, email (unique), phone, city, province, country, auth_user_id (nullable), status (enum), created_at, updated_at, withdrawn_at, deleted_at
- `professional_profiles`: id, applicant_id (unique FK), job_title, headline, biography, years_experience, employment_status, linkedin_url, portfolio_url
- `professional_categories`: id, slug, name, parent_group (the six groups from the landing page), active
- `applicant_categories`: applicant_id, category_id, is_primary (exactly one primary per applicant)
- `skills`: id, slug, name, category_id (nullable), active
- `applicant_skills`: applicant_id, skill_id
- `industries`, `applicant_industries`
- `languages` (or a validated array, ask me), `tools` (free text array is acceptable now)
- `work_preferences`: applicant_id, engagement_types (freelance, part_time, full_time), work_modes (remote, hybrid, on_site), weekly_availability, preferred_hours, earliest_availability, compensation_structure, compensation_expectation (optional)
- `documents`: id, applicant_id, kind (cv, portfolio, certificate, reference, identity), storage_path, original_name, mime_type, size_bytes, scan_status, uploaded_at, deleted_at
- `verification_records`: id, applicant_id, type (contact, identity, experience, skills, portfolio, performance), status, reviewer_id, completed_at, evidence_reference, notes
- `consent_records`: id, applicant_id, purpose (application_processing, future_client_sharing, marketing), granted (bool), policy_version, wording_version, granted_at, withdrawn_at, ip_hash (optional, ask me)
- `application_status_history`: id, applicant_id, from_status, to_status, changed_by, note, changed_at (append-only)
- `administrative_users`: id, auth_user_id, role (super_admin, reviewer, verifier), active
- `audit_logs`: id, actor_id, actor_type, action, entity, entity_id, metadata (jsonb), created_at (append-only)

**Application status enum:** `application_received`, `under_review`, `additional_information_required`, `verification_pending`, `verified`, `unsuccessful`, `withdrawn`.

**Verification principle:** self-reported data is never labelled verified. Something is "verified" only when a `verification_records` row with status verified and an evidence reference exists for that type.

**Consent principle:** three separate purposes, stored separately. Only `application_processing` is required to submit. `future_client_sharing` must state that sharing does not exist yet and that we will ask again before it starts. Never pre-tick any box. Record the wording version shown.

**Triggers and constraints:** write a status-history row and an audit row on every status change. Prevent updates and deletes on the two append-only tables. Index reference, email, status, province and the join tables.

---

## 6. Security and POPIA requirements

Treat this as an operating responsibility, not a checkbox.

- **Row Level Security on every table, deny by default.** Applicants can never read other applicants' rows. Admin access is granted through role checks (a `has_role()` SQL function). The Supabase service-role key is used server-side only and never reaches the browser.
- **No public APIs expose applicant data.**
- **Documents:** private storage bucket only. Access through short-lived signed URLs, issued server-side after a role check. Validate file type (by content, not just extension), enforce size limits, randomise storage filenames, and run virus scanning before a reviewer can open a file (ask me which scanner). Never place CVs or identity documents in a public bucket.
- **Data minimisation:** do not collect identity documents at registration. They are requested only during identity verification, and only if I enable that step.
- **Applicant access without accounts:** applicants do not need an account to apply. Status checks, updates and withdrawal use a signed, expiring link sent by email. Store only a hash of any token.
- **Admin authentication:** secure sign-in, strong sessions, ideally MFA for admins. Every sensitive view and export writes an audit log.
- **Retention and deletion:** implement soft delete plus a documented hard-delete procedure, a withdrawal flow, and a configurable retention schedule (ask me the periods).
- **Rate limiting and abuse protection** on the application, upload and status endpoints. Add a spam check that does not harm accessibility.
- **Transport and headers:** HTTPS only, secure cookies, a content security policy, no sensitive data in logs.
- **POPIA items that are not code (list them in the README for me to action):** a named Information Officer, a published privacy notice, operator agreements with vendors such as Supabase and the email provider, a decision on hosting region and cross-border transfer, and a breach-response procedure. Do not claim legal compliance in the interface or documentation. Flag where I should get professional advice.

---

## 7. Screens and behaviour

**Talent landing (`/talent-network`):** rebuild from `Talent.dc.html`. Keep all copy. Positioning line: "Your skills deserve better opportunities." Never promise work, employment or earnings. Registration is free and guarantees nothing. FAQs use native `<details>`.

**Application (`/talent-network/apply`):** six steps as designed.
- Step 1: personal information. Step 2: professional. Step 3: expertise. Step 4: preferences. Step 5: documents. Step 6: consent and submit.
- Required fields are marked, everything else is labelled optional. Required set: Step 1 all fields. Step 2 job title, employment status, years of experience. Step 3 primary category. Step 4 type of work, where you work, weekly availability, earliest availability. Step 5 CV. Step 6 the application-processing consent.
- Save progress so applicants can return. Mobile-first, keyboard accessible, with clear inline errors and focus moved to the first error.
- Multiple categories and skills are selectable. Exactly one primary category.
- On submit: create the records in one transaction, create consent rows, write the first status-history row, issue the reference, send the confirmation email, and redirect to the confirmation page.

**Confirmation:** show the reference number, a plain-language "what happens next", and the status tracker. Repeat that registration does not guarantee work. Include the update and withdraw link.

**Admin (`/admin`):** behind authentication and role checks.
- Overview: total registrations, new applications, under review, verified professionals, additional information required.
- Applications list: search by reference, name or email. Filter by status, category and province. Paginate.
- Application detail: all submitted information, signed-link document viewer, status change with required note, verification records (type, status, reviewer, date, evidence reference, notes), internal notes, full status and audit history.
- Role permissions: super_admin (everything, user management), reviewer (view and update status), verifier (record verification outcomes). Sensitive documents only for authorised roles.
- Do not build a talent search or public profile views.

**Emails:** application received, additional information required, status updates, withdrawal confirmation. Plain, short, no promises of work. Provide templates and keep wording in one place.

---

## 8. Quality bar

- TypeScript throughout, strict mode. Lint and format configured.
- Unit tests for validation and services. Integration tests for the application flow, upload handling and RLS (prove an applicant cannot read another applicant, and a non-admin cannot read documents).
- Test mobile layouts (360 to 430px) and desktop. Run an accessibility pass (keyboard, labels, contrast, screen reader order).
- Performance: optimised images, no layout shift, fast form submission, indexed queries.
- Logging and error handling that never leak personal data.

---

## 9. Implementation sequence

1. Repo setup, tokens, fonts, base UI components, Phase 1 site rebuilt faithfully, "Talent Network" added to the nav.
2. Database schema, migrations, seed taxonomy, RLS policies, and RLS tests.
3. Talent Network landing page.
4. Application form (all six steps), validation, draft saving, and submission transaction.
5. Secure document upload, scanning, signed access.
6. Consent management and confirmation workflow, plus emails.
7. Admin authentication, roles, overview, list, detail.
8. Verification records, status management, audit logging.
9. Documentation: README (architecture and how Phases 3 and 4 extend it), database diagram, deployment instructions, security and POPIA checklist.
10. Full test pass and a written test report.

---

## 10. Questions to ask me before building

Put these in your assessment and wait for answers:
1. Option lists: industries, languages, years-of-experience ranges, weekly hours, compensation structures, employment statuses.
2. File types and size limits for uploads, and which virus scanner to use.
3. Retention periods for unsuccessful, withdrawn and inactive applications.
4. Hosting provider and region, and the email provider and sending domain.
5. Who is the Information Officer, and where is the privacy notice text?
6. Do admins need MFA at launch, and who are the first admin users?
7. Is identity verification enabled in this phase, or only designed for?
8. Do you have an existing repo, domain and deployment target I should use?

---

## 11. Definition of done

- The existing website is fully functional and looks like the design.
- A South African professional can discover the Talent Network, understand it, and complete registration on mobile or desktop.
- Their data is stored in the structured schema with separate, versioned consents.
- Documents are private and only accessible to authorised staff.
- Administrators can review, request more information, record verification outcomes and see full history.
- Applicants get appropriate email confirmations and status communications.
- RLS and permission tests pass.
- Documentation and migrations let a new engineer deploy and extend the system without a rebuild.

Do not add features outside this brief. When in doubt, ask.
