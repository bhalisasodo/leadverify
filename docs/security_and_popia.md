# LeadVerify Talent Network — Security Architecture & POPIA Compliance Guide

> [!CAUTION]
> **Legal Disclaimer:** This document details the technical controls and architectural design implemented in the LeadVerify Talent Network codebase. Technical safeguards do not constitute formal legal compliance. LeadVerify management must obtain professional legal counsel from a qualified South African attorney regarding regulatory registration and POPIA obligations.

---

## 1. Technical Security Architecture

### 1.1 Row-Level Security (RLS) Deny-by-Default
All tables in the Talent Network database have Row-Level Security enabled immediately upon creation:
- **Default Deny:** Without an explicit policy, no database role (including anonymous public users) can select, insert, update, or delete rows.
- **Role Verification Function:** Role enforcement is handled at the database engine level via `has_role(required_role text)`:
  - `super_admin`: Full administrative and configuration oversight.
  - `reviewer`: Read-only access to applicant profiles, work preferences, and status updates.
  - `verifier`: Read and write access to verification records and evidence logging.
- **Service-Role Boundary:** The Supabase Service-Role key resides strictly in server-side API endpoints (`/app/api/...`) and is never delivered to client browsers.

### 1.2 Private Document Storage & Short-Lived Access
- **Private ACL Storage Bucket:** Supporting documents (CVs, portfolios, certificates) are saved to the isolated `applicant-documents` bucket. Public access is disabled.
- **Filename Sanitisation & Randomisation:** Files are stored with UUID identifiers (`applicant-documents/{kind}/{uuid}.{ext}`). User-supplied filenames are retained only as display metadata in the database.
- **Time-Limited Signed URLs:** When an authorised administrator reviews a candidate, the system generates a short-lived signed URL (valid for 15 minutes). Direct permanent URLs are never generated.
- **File Validation:** Files are verified for maximum size (10MB) and restricted to approved MIME types (PDF, Word, PNG, JPEG).

### 1.3 Accountless Applicant Security
- **No Password Vulnerabilities:** Applicants do not create traditional user passwords.
- **Cryptographic Token Hashing:** Application tracking, document updates, and voluntary withdrawals rely on a 48-character cryptographically secure token.
- **SHA-256 Storage:** Only the cryptographic SHA-256 hash of the status token is stored in the database (`magic_token_hash`). If the database is compromised, status tokens cannot be reversed.
- **Automatic Expiration:** Tokens have a default 30-day lifecycle.

### 1.4 Append-Only Audit Immutability
- Critical security and compliance tables (`application_status_history`, `consent_records`, `audit_logs`) are protected by PostgreSQL database triggers (`trg_status_history_immutable`, `trg_audit_logs_immutable`).
- Any attempt by any user or query to execute an `UPDATE` or `DELETE` statement raises an immediate exception.

---

## 2. POPIA Non-Technical Management Checklist

The following actions are non-technical organizational responsibilities that must be completed by LeadVerify executive management:

- [ ] **1. Information Officer Registration:**
  - Appoint a designated Information Officer (and optional Deputy Information Officers) and formally register them with the South African Information Regulator.
- [ ] **2. Published Privacy Notice:**
  - Finalise and publish a comprehensive POPIA Privacy Notice detailing lawful bases of processing, categories of personal information collected, rights of data subjects, and contact information.
- [ ] **3. Operator / Vendor Agreements:**
  - Execute formal Operator Agreements (POPIA Section 21) with all third-party sub-processors, including Supabase (cloud database), the hosting provider (e.g. Vercel), and the transactional email service.
- [ ] **4. Cross-Border Data Transfer Assessment:**
  - Confirm the physical hosting region for cloud servers. If servers are hosted outside South Africa (e.g., EU or US), verify Section 72 cross-border compliance (adequate level of protection, binding corporate rules, or explicit data subject consent).
- [ ] **5. Data Retention & Deletion Schedule:**
  - Formally adopt retention timelines:
    - Successful applicants / verified talent: active while in network.
    - Unsuccessful / withdrawn applications: 90-day soft-retention buffer followed by automated hard-deletion.
- [ ] **6. Security Compromises & Breach Response Plan:**
  - Establish a written Section 22 Incident Response Procedure for identifying, containing, and reporting data breaches to both the Information Regulator and affected data subjects without unreasonable delay.
