# ResuMate System Design V1 — Stages 1–7

**Status:** Senior Review Checkpoint — System Design V1 Foundation  
**Project:** ResuMate  
**Scope:** System Design Stage 1 through Stage 7  
**Purpose:** Senior-review-ready source-of-truth checkpoint before implementation specification and agentic build planning.

---

## 0. Executive Summary

ResuMate V1 is being designed as a **modular monolith** with a **TanStack Start + Node.js** application, **managed PostgreSQL**, **structured Resume JSONB snapshots**, **private object storage**, **background processing for long-running work**, **server-side PDF generation**, and an **AI harness** that uses structured operations rather than allowing the model to mutate application data directly.

The architecture prioritizes user control, career-fact truthfulness, independent Resume Version / Variation snapshots, predictable editor → preview → export behavior, cross-device continuity without silent overwrites, graceful degradation, privacy and access control, manageable cost for a small development team, and technology choices based on actual access patterns and requirements rather than architecture fashion.

A core architecture invariant is:

> **No AI model is ResuMate's memory or source of truth. ResuMate reconstructs task context from persisted application state for every AI operation.**

Another core invariant is:

> **Version and Variation may share one underlying Resume entity/table, but their content snapshots are independent. Updating one Resume must never mutate any other Resume.**

---

# Stage 1 — Requirements, Criticality, Performance & Capacity

## 1.1 Primary MVP User Journey

```text
Sign up / Login
    ↓
Create OR Upload Resume
    ↓
Edit in structured document editor
    ↓
AI enhance / tailor
    ↓
Preview
    ↓
Save Version / Variation
    ↓
Export PDF
    ↓
Public Profile / Live CV
```

Public Profile / Live CV is intentionally lightweight in V1, similar to a simple HTML CV page. Rich portfolio capabilities remain future scope.

## 1.2 Resume Creation Entry Points

All three entry paths are MVP scope:

1. **Form-based creation**
2. **AI / Chat-assisted creation**
3. **Existing CV upload**

### Form-based creation goal

The form is primarily for absolute beginners who may not know what a Resume normally contains.

Users provide required factual information and AI may assist with narrative fields such as:

- Profile / Summary
- Experience Descriptions
- short / medium / long wording suggestions

AI must use user-provided facts and must not fabricate unsupported evidence.

### Chat-assisted creation goal

Chat is more flexible for users who prefer instruction-based workflows.

If required factual information is missing, the system must ask for facts that AI is not allowed to invent.

## 1.3 Upload Formats

MVP supported inputs:

- PDF
- DOCX
- JPG
- JPEG
- PNG

Scanned/image documents with weak extraction must go through review rather than silent guessing.

## 1.4 Existing Resume Paths

Two upload paths are MVP scope:

### A. Use As-Is

The original Resume design/file is preserved.

Background extraction may be used for future job matching, relevance analysis, job searching, and internal understanding.

The extracted representation is not automatically shown as a replacement Resume.

### B. Extract → Structured Editor

The uploaded file is parsed and reconstructed into the ResuMate structured editor.

If a user later edits or tailors an original Use-As-Is Resume into a new Variation, that new editable Variation uses the ResuMate structured canvas.

Pixel-perfect editing of arbitrary imported PDF/Canva/Word layouts is explicitly out of scope.

## 1.5 AI Operations in V1

V1 includes Rewrite, Shorten, Expand, Grammar improvement, Bullet ↔ Paragraph, Reorder section, Reorder item, Show / hide section, Create custom section, Resume quality analysis, ATS-related diagnostics, and Job tailoring.

## 1.6 Job Tailoring Input UX

Two user modes are supported.

### Structured mode

Separate inputs may include Target Role(s), Applied Position, JD, Requirements, Company, and other relevant context.

### Flexible / quick mode

A single input may contain job-post URL, pasted hiring post, target role, applied position, or mixed text.

The tailoring engine must normalize the input into internal Job Context.

## 1.7 Export

MVP export is PDF only. DOCX export is future scope.

## 1.8 Public Profile / Live CV

MVP-lite includes Create, Preview, Publish, Unpublish, Share URL, and Choose visible sections.

Future scope includes custom domains, themes, analytics, password protection, and richer portfolio templates.

## 1.9 Must-Not-Lose Data

Must not lose:

- Account data
- Saved Versions
- Saved Variations
- User-edited Resume content
- Saved Use-As-Is original Resume
- Active CV selection
- Public Profile publish state

Recomputable / temporary:

- AI suggestions
- analysis results
- temporary working state
- intermediate processing output

## 1.10 Working Draft / Autosave

Chosen approach:

> **Server-backed debounced autosave with immediate local state and limited temporary draft retention.**

```text
Local editor state
    ↓
instant UI
    ↓
debounced autosave
    ↓
single current Working Draft
```

Undo/Redo, Working Draft, and Version/Variation are separate concerns:

```text
Undo/Redo
→ short-term editing history

Working Draft
→ crash / cross-device recovery

Version / Variation
→ intentional persisted Resume
```

## 1.11 Delete & Backup Principle

User-facing deletion in MVP is permanent from active product data after confirmation.

Infrastructure backups may retain historical copies temporarily for disaster recovery according to a retention policy.

Future Trash/Restore behavior is separate product functionality.

## 1.12 Performance Targets

Initial targets:

- local editor interactions: near-instant
- normal server reads/writes: ~1–2 seconds acceptable
- selected-text AI rewrite: ~3–8 seconds target
- full Resume analysis / tailoring: 10–30 seconds acceptable with progress UI
- upload / extraction: asynchronous status
- PDF generation: 2–5 seconds acceptable

These are product targets, not strict SLA contracts.

## 1.13 Initial Capacity Assumptions

```text
Launch:             100–500 users
First 6 months:     1k–5k users
1-year success:     10k–50k users
```

Typical-user planning assumptions:

```text
Root Resumes:             ~2
Variations per root:      ~2
Uploads per month:        ~5
PDF exports per month:    ~10
AI usage:                 Medium
```

Cost philosophy:

> **Balanced cost + good UX**

---

# Stage 2 — Access Patterns & Data Model

## 2.1 Resume Owner vs Resume Subject

A Resume has an account owner and a Resume subject. The Resume subject may differ from the account owner.

## 2.2 Resume Subject Storage

No reusable shared Person/Subject entity in V1.

Each Resume stores its own subject/personal-details snapshot because two Resumes for the same person may intentionally differ.

## 2.3 User Profile vs Resume Personal Details

User Profile is private account-level information.

Existing Resume content is not automatically updated when User Profile changes.

For convenience, a user may copy personal details from a chosen Resume into another Resume.

## 2.4 Version / Variation Storage Shape

Preferred logical model:

```text
Resume
- id
- kind: VERSION | VARIATION
- ownerUserId
- rootVersionId
- sourceResumeId
- ...
```

Hard invariant:

> Updating one Resume must never change another Resume.

## 2.5 Variation Lineage

A Variation tracks both `rootVersionId` and `sourceResumeId`.

## 2.6 Direct Edit

Direct Edit updates the current persisted Resume.

MVP keeps `updatedAt`, Undo/Redo in editor session, and Working Draft recovery. Full revision history is not included in V1.

## 2.7 Root Delete Promotion

If a root Version is deleted while Variations are preserved, the oldest Variation becomes root Version, root references are updated, and the operation is transactional.

## 2.8 Hybrid Data Model

Chosen model:

> **Relational metadata + structured JSON Resume snapshot**

Relational/query-heavy metadata includes ownerUserId, kind, rootVersionId, sourceResumeId, revision, timestamps, and active/public references.

Flexible Resume document state uses JSON/JSONB.

## 2.9 Stable Section / Block / Item IDs

Sections, blocks, and items use stable unique identifiers.

This is essential for AI patches, drag/reorder, preview diffs, undo/redo, and validation.

## 2.10 Content vs Presentation

Content and presentation are separate concepts. Presentation changes must not silently delete underlying content.

## 2.11 Custom Sections

Custom Sections use a generic block model.

## 2.12 Main Access Patterns

Dashboard retrieves root Resume summaries ordered by recent updates and does not load full Resume JSON.

Version Group retrieval is pagination-ready.

Editor open loads full Resume snapshot in one request.

Working Draft supports get, upsert, and delete-after-save/discard.

Active CV supports get, set/replace, and clear.

Dashboard supports search by name/title, filter by target role, and sort by updated date.

## 2.13 Public Profile Snapshot

Public Profile does not directly render a live mutable Resume record.

Publish flow creates a **published snapshot**. Underlying Resume edits do not silently alter the public page.

## 2.14 Original File Storage

Raw file bytes are stored in object storage.

Database keeps file metadata/reference such as id, storageKey, mimeType, size, originalFilename, checksum, and uploadedAt.

## 2.15 Use-As-Is Extracted Metadata

Use-As-Is Resume extraction is persisted internally as derived system-owned metadata.

It is useful for job matching, search, analysis, and future tailoring, but is not automatically treated as a user-facing editable Resume.

## 2.16 AI Analysis Cache

AI/ATS analysis may be cached for a short period to avoid repeated expensive calls.

Cache identity should depend conceptually on Resume content hash + Job Context hash + analysis version + model/config version.

## 2.17 Job Context Persistence

Persist Job Context with a saved Resume/Variation as related context data, not as visible Resume content.

## 2.18 Public/Sensitive Visibility

Public Profile behavior:

- sensitive fields default hidden
- publish flow includes visibility review
- user explicitly decides what becomes public

---

# Stage 3 — High-Level Architecture & Component Responsibilities

## 3.1 Architecture Style

Chosen architecture:

> **Modular Monolith + background worker where justified**

Microservices only if later scaling/team/deployment requirements justify decomposition.

## 3.2 Initial Modules

Starting module boundaries:

```text
Auth
User/Profile
Resume
Working Draft
File/Upload
AI
Job Context/Tailoring
Analysis/ATS
Public Profile
Export/Rendering
```

## 3.3 Client Editor State

Client owns fast interaction state such as typing, drag/reorder, bullet ↔ paragraph, and undo/redo.

## 3.4 Server-Authoritative Business Rules

Server is authoritative for Version / Variation creation, root promotion, delete rules, Active CV, publish permissions, ownership checks, and core invariants.

## 3.5 AI Apply Flow

```text
AI Result
  ↓
Proposed Patch
  ↓
Preview
  ↓
Accept / Edit / Reject
  ↓
Apply to Working State
```

## 3.6 Async / Background Candidates

Long-running candidates:

- PDF/DOCX/Image extraction
- OCR
- Use-As-Is background extraction
- Full Resume analysis
- Job tailoring
- Large AI enhancement

Small selected-text rewrites may remain synchronous.

## 3.7 ProcessingJob Model

Long-running work uses a job model with states QUEUED, PROCESSING, COMPLETED, FAILED, and CANCELLED.

## 3.8 Cancellation

Product-level cancellation is supported. ResuMate marks the job cancelled, attempts provider abort if supported, and ignores late results.

## 3.9 Queue Strategy

V1 uses ProcessingJob abstraction, worker/job interface, and background execution.

A durable queue is introduced when real reliability/retry/burst-control needs justify it.

## 3.10 Direct File Upload

Browser receives temporary signed upload permission and uploads directly to object storage. DB stores metadata/reference.

## 3.11 AI Harness

ResuMate AI is not a raw model call.

```text
User Instruction
   ↓
Task Router
   ↓
Context Builder
   ↓
Prompt / Tool Contract
   ↓
Model
   ↓
Structured Output
   ↓
Schema Validation
   ↓
Business / Evidence Validation
   ↓
Proposed Patch
   ↓
Preview
   ↓
User decision
```

## 3.12 Least-Context Principle

Only task-relevant context is sent to the AI provider.

## 3.13 AI Provider Abstraction

Business logic uses a provider-neutral AI service boundary.

## 3.14 Renderer

Structured Resume state is rendered into Editor Canvas, Preview, PDF, and Public Profile.

## 3.15 Preview ≈ Export

Editor Preview and PDF should share as much layout/rendering behavior as practical.

## 3.16 PDF Generation

PDF generation is server-side.

## 3.17 Public Profile V1

V1 Public Profile is a simple HTML Live CV. A richer portfolio builder is future scope.

## 3.18 Failure Handling

Background failures get limited automatic retry, then FAILED status and user retry option. Unlimited retries are forbidden.

---

# Stage 4 — Detailed Request/Data Flows & API Boundaries

## 4.1 API Boundary

Default same-app boundary: TanStack Start server functions.

External/public HTTP boundary: server routes.

## 4.2 Command vs Query Mental Model

Queries read state. Commands change state. This is a mental separation, not a requirement to implement full CQRS.

## 4.3 Resume Revision Number

Every persisted Resume has a revision integer.

## 4.4 Stale Update Protection

Save request includes `expectedRevision`.

If server revision differs, the write is rejected with a conflict.

## 4.5 Conflict UX

V1 warns the user and reloads the newest server version. No automatic merge or collaborative diff/merge system in MVP.

## 4.6 Autosave Payload

V1 autosave sends the full Working Draft JSON snapshot.

## 4.7 Autosave Status UX

Editor displays Saving..., Saved, and Offline / retrying... statuses.

## 4.8 Upload Handshake

```text
1. Client sends filename/type/size
2. Server validates
3. Server creates pending File record
4. Server returns signed upload target
5. Browser uploads to object storage
6. Client confirms
7. Server verifies object
8. ProcessingJob starts
```

## 4.9 Pending Upload Cleanup

Abandoned PENDING uploads are cleaned by scheduled/lifecycle policy.

## 4.10 File Security Baseline

MIME/type validation, extension validation, size limit, ownership, random storage key, private objects, and short-lived signed URLs.

## 4.11 Long-Running Job Updates

V1 uses polling first. SSE/WebSocket are not required initially.

## 4.12 ProcessingJob Ownership

Users may inspect only their own private jobs.

## 4.13 Idempotency

Idempotency keys are used for costly/retriable operations such as extraction, tailoring, full analysis, and export generation.

## 4.14 Retry Semantics

Retries remain under the same job identity.

## 4.15 ProposedPatch Model

AI results are returned as operations rather than whole-Resume replacement.

## 4.16 Partial AI Failure

Valid patches may still be previewed if another proposed operation is invalid.

## 4.17 PDF Export Flow

Initial V1: user clicks Export → server renders → short wait → download.

If performance consistently exceeds the desired threshold, export may move to ProcessingJob-based async flow.

## 4.18 Generated PDF Retention

Generated export is short-lived by default.

PDF is a **derived artifact**, not Resume source of truth.

## 4.19 Version / Variation Persistence Format

A Version/Variation is stored as structured Resume state, not as PDF.

Dashboard fetches lightweight metadata. Editor fetches full Resume state only when needed.

## 4.20 Atomic Public Publish

A new public snapshot replaces the old one only after successful generation/validation.

---

# Stage 5 — Technology Selection & Deployment Topology

## 5.1 Framework

**TanStack Start**

## 5.2 Runtime

**Node.js server/container runtime**

## 5.3 Database

**Managed PostgreSQL**

## 5.4 Resume JSON Boundary

`Resume.contentJson` uses JSONB. Frequently queried metadata is modeled as relational columns.

## 5.5 ORM

Current recommendation:

> **Drizzle ORM — preferred, but validate with an implementation spike before irreversible lock.**

Prisma remains a valid fallback.

## 5.6 Authentication

Current recommended implementation:

> **Better Auth + PostgreSQL**

V1 login: Email/password + Google OAuth.

Future: LinkedIn login/integration and potential LinkedIn profile import workflows.

## 5.7 Object Storage

Architecture-level decision:

> **S3-compatible storage abstraction**

Current preferred implementation candidate: Cloudflare R2.

## 5.8 Background Processing

V1 uses ProcessingJob DB model + job abstraction + worker process.

No mandatory Redis/BullMQ on day one.

## 5.9 AI Provider

Primary V1 direction:

> **OpenAI API direct**

Architecture remains provider-neutral through an adapter.

## 5.10 Model Routing

Different tasks may use different model classes. Business logic refers to task classes rather than hard-coding model names.

## 5.11 AI Context Handoff

Hard invariant:

> **Application owns context. Models do not own context.**

Every task reconstructs context from canonical application state.

## 5.12 Document Extraction

Deterministic parser first → extraction-confidence check → OCR only if required → normalize → AI semantic mapping → user review.

## 5.13 OCR

Current candidate: PaddleOCR / PaddleOCR-VL proof-of-concept behind an OCR abstraction.

## 5.14 PDF Rendering

Resume JSON → HTML/CSS renderer → headless browser → PDF.

## 5.15 Hosting

Current preferred V1 candidate:

> **Railway**

Render remains a viable fallback.

## 5.16 Initial Deployment Topology

```text
                    USER
                      │
                      ▼
              TanStack Start
               React Client
                      │
                      ▼
          Modular Monolith / Node
                Web Process
          ┌───────────┼─────────────┐
          ▼           ▼             ▼
    PostgreSQL    Object Storage   AI Provider
                    (S3-like)

                      │
                      ▼
                Worker Process
                 ├─ Extraction
                 ├─ OCR
                 ├─ AI jobs
                 └─ future PDF jobs
```

## 5.17 Observability Baseline

Track structured errors, request timing, job failures, AI latency, model/provider, token/cost metrics, PDF duration, and extraction failures.

Do not log raw sensitive Resume content by default.

---

# Stage 6 — Security, Reliability & Failure Design

## 6.1 Authentication & Ownership Authorization

Private resources require:

```text
authenticated user
+
resource ownership
```

Knowing an ID alone grants no access.

## 6.2 Public Profile Exception

Anonymous access is permitted only to the published Public Profile snapshot.

Private Resume data is never exposed through anonymous routes.

## 6.3 Multiple Device Sessions

V1 allows multiple-device login.

## 6.4 Data Classification

### Sensitive
- NRC
- Passport
- DOB
- Phone
- Address
- Original CV

### Private
- Resume content
- Working Draft
- Job Context
- unpublished analysis/context

### Public
- only user-approved Public Profile fields

## 6.5 AI Data Minimization

Sensitive data is not sent to the AI provider unless the task requires it.

Example: if the user asks to rewrite a Work Experience description, the model may need the role, company, original description, relevant Resume facts, and possibly Job Context. It does not need NRC, Passport number, home address, or unrelated contact details.

Likewise, section reordering for a Frontend Developer role needs section structure and Job Context, not identity-document fields.

## 6.6 Production Logging Policy

Do not store raw Resume text, NRC, Passport, password, session/API tokens, or full original CV content in normal production logs.

Prefer metadata such as jobId, resumeId, operation, duration, provider, model, token count, status, and safe error code.

## 6.7 Upload Allowlist

Allowed in V1: PDF, DOCX, JPG, JPEG, PNG.

Block ZIP, executables, macro-enabled DOCM, and unsupported types.

## 6.8 File Validation

Validate extension, MIME, magic bytes/file signature, size, ownership, random storage key, private object status, and signed URL expiry.

## 6.9 Malware Scanning

Chosen maturity path:

1. validation + private storage first
2. scanner integration-ready
3. introduce malware scanning before wider public scale

## 6.10 Rate Limit + Quota

AI endpoints use both rate limits and quotas.

Rate limit controls burst frequency. Quota controls total permitted usage.

## 6.11 Other Abuse Limits

Separate protection for file upload, PDF export, password reset, Public Profile, and expensive processing.

## 6.12 Graceful AI Degradation

If AI provider is unavailable, existing Resume open/edit/save, Version/Variation management, Public Profile, and non-AI functionality remain available where possible.

AI rewrite, tailoring, and AI analysis become unavailable/degraded.

## 6.13 OCR Degradation

If OCR is unavailable, digital PDF/DOCX parsing may still work; scanned files receive retry/manual-entry paths.

## 6.14 Object Storage Degradation

Storage outage should primarily affect upload, download, Use-As-Is originals, and temporary stored artifacts.

Existing structured Resume editing/saving should remain usable where possible.

## 6.15 Retry Policy

Automatic retry only for transient failures.

Use limited retry + exponential backoff + jitter.

Do not blindly retry auth failures, invalid input, permanent validation failures, or deterministic bad requests.

## 6.16 Timeout Classes

Separate timeout policies exist for normal API, small AI, full AI job, OCR, and PDF rendering.

Exact numbers are tuned later.

## 6.17 Automated Database Backups

Production uses managed PostgreSQL automated backups.

PITR should be enabled from production launch if cost is reasonable.

Why PITR matters:

A normal backup gives discrete restore points. If a destructive migration or corruption happens hours after the latest backup, restoring only that backup may lose all changes since then.

PITR allows restoring close to the moment before the incident, reducing potential data loss.

Useful cases include accidental destructive SQL, bad migrations, application bugs that corrupt many rows, operator mistakes, and database/storage incidents.

PITR is disaster recovery, not a user-facing Trash feature.

## 6.18 Restore Drills

Backups are periodically tested through actual restore exercises.

Initial small-team cadence may be monthly/manual and around major high-risk releases.

## 6.19 Initial RPO / RTO

```text
RPO:
as close to zero as practical
target <= 1 hour

RTO:
a few hours
```

These are internal resilience targets, not contractual SLA promises.

## 6.20 Secrets Separation

Dev, staging, and production use separate credentials and environments.

Production secrets must never be committed to Git.

## 6.21 Production Deployment Safety

Before risky DB migration or major release:

```text
backup / recovery check
   ↓
migration
   ↓
health check
   ↓
rollback path
```

---

# Cross-Stage Architecture Invariants

## Resume Integrity

1. Every Variation belongs to one root Version.
2. Version and Variation snapshots are independent.
3. Editing one Resume must never mutate another Resume.
4. Direct Edit updates the current Resume only.
5. Structural/presentation changes do not silently remove career facts.
6. Upload is not a Version until explicitly saved.
7. Working Draft is recovery/editing state, not a persisted Resume lifecycle type.

## AI Truth & Control

1. AI may transform and professionally express user-supported facts.
2. AI may not fabricate unsupported career evidence.
3. AI may create empty structure, but factual population requires evidence.
4. AI proposes changes; it does not directly persist them.
5. User receives preview and Accept/Edit/Reject control.
6. Model output must pass schema + target + business/evidence validation.
7. Application state, not model memory, is the source of truth.
8. Context is reconstructed per task from canonical persisted state.
9. Only necessary context is sent to AI providers.

## Security

1. Server is authoritative for ownership and business invariants.
2. Private resources require authentication + ownership checks.
3. Sensitive data is private by default.
4. Public Profile is a controlled published snapshot.
5. Raw private Resume content is not normally logged.
6. Uploaded objects are private by default.

## Reliability

1. One dependency failure should not unnecessarily bring down the whole app.
2. Long-running operations are modeled as jobs.
3. Duplicate costly operations are protected by idempotency.
4. Transient failures get limited retry with backoff/jitter.
5. Permanent errors are not endlessly retried.
6. Saved durable data requires backups and restore testing.

---

# Initial V1 System Architecture Snapshot

```text
                                   USER
                                     │
                                     ▼
                         ┌─────────────────────┐
                         │ TanStack Start UI   │
                         │ React Editor        │
                         └─────────┬───────────┘
                                   │
                                   ▼
                   ┌─────────────────────────────────┐
                   │ ResuMate Modular Monolith       │
                   │ Node.js                         │
                   │                                 │
                   │ Auth                            │
                   │ User/Profile                    │
                   │ Resume                          │
                   │ Working Draft                   │
                   │ File/Upload                     │
                   │ AI Harness                      │
                   │ Job Context/Tailoring           │
                   │ Analysis/ATS                    │
                   │ Public Profile                  │
                   │ Export/Rendering                │
                   └───────┬────────┬─────────┬──────┘
                           │        │         │
                           ▼        ▼         ▼
                      PostgreSQL   Object    AI Provider
                    Relational +   Storage    Adapter
                       JSONB        (S3)
                           │
                           ▼
                    ProcessingJob State
                           │
                           ▼
                     Worker Process
                      ├─ Extraction
                      ├─ OCR
                      ├─ AI jobs
                      └─ future async PDF
```

---

# Technology Status

## Locked / Strong Direction

- TanStack Start
- React
- Node.js runtime
- Modular Monolith
- Managed PostgreSQL
- relational metadata + JSONB Resume snapshot
- private object storage
- S3-compatible storage boundary
- server-side PDF rendering
- ProcessingJob abstraction
- separate-worker-ready architecture
- deterministic-first extraction
- structured AI operations
- application-owned AI context
- provider abstraction
- security/access-control rules
- backup / recovery discipline
- graceful degradation

## Preferred but Provisional Pending Implementation Spike

- Drizzle ORM
- Better Auth
- Railway
- Cloudflare R2
- PaddleOCR / PaddleOCR-VL
- OpenAI API direct

These are technology choices, not immutable domain truths. They may be changed if implementation evidence shows a better fit.

---

# Deferred / Future Scope

Not required for V1:

- microservices
- Redis/BullMQ unless justified
- SSE/WebSocket unless polling becomes insufficient
- full revision history
- collaborative real-time editing
- automatic merge conflict resolution
- Trash/Restore UI
- DOCX export
- advanced Portfolio builder
- custom Public Profile domain
- Profile analytics
- Profile password protection
- multiple AI providers in production from day one
- heavy multi-model voting/verification
- arbitrary Canva-style editing
- automatic Resume mutation from AI
- pixel-perfect imported-layout editing

---

# Next System Design Area

Stages 1–6 establish the **first major System Design Foundation checkpoint**.

Recommended next direction:

> **Scaling, Performance & Cost Design**

Potential topics:

- query/index strategy
- connection pooling
- caching boundaries
- Public Profile caching
- AI cost budgets
- OCR/PDF compute cost
- worker concurrency
- job backpressure
- storage lifecycle
- pagination thresholds
- performance testing
- capacity calculations
- when Redis/queue becomes justified
- when component decomposition becomes justified

---

# Checkpoint Rule

If future architecture work conflicts with this document:

1. identify the exact conflicting decision,
2. explain why new evidence requires reconsideration,
3. revise the decision explicitly,
4. update the checkpoint,
5. never silently replace established product truth.

---

# Stage 7 — Scaling, Performance & Cost Design

## 7.1 Scaling Principle

ResuMate will scale from **measured bottlenecks**, not hypothetical future scale.

```text
Measure
  ↓
Find bottleneck
  ↓
Apply the simplest useful optimization
  ↓
Measure again
```

Preferred progression:

```text
Indexes
   ↓
Connection tuning
   ↓
Caching
   ↓
Worker concurrency tuning
   ↓
Durable queue
   ↓
Horizontal scaling
   ↓
Component/service separation
```

The project should not introduce Redis, complex queues, microservices, or large infrastructure merely because the system may have 50,000 users in the future.

---

## 7.2 Initial Load Assumptions

Planning assumptions for V1 launch:

```text
Registered users at launch:
100–500

Initial concurrent baseline test:
25 simultaneous active users

Higher-load success scenario:
100 concurrent users
```

`100 concurrent users` does **not** mean 100 simultaneous full AI tailoring jobs. Load testing should use a realistic workload mix.

Example only:

```text
70% dashboard / Resume read / editor activity
15% autosave
8% public/profile activity
4% AI job creation
2% upload
1% PDF export
```

The real mix should be refined later from telemetry.

---

## 7.3 Baseline Performance Metrics

Performance must not be judged from average latency alone.

V1 baseline metrics:

- **p95 latency**
- **error rate**
- **throughput**

Later acceptance criteria may define separate targets for:

- Dashboard
- Resume open
- Autosave
- Public Profile
- File upload
- Job creation
- PDF export

Exact numeric thresholds are intentionally not hard-locked yet. They must be based on implementation measurements.

---

## 7.4 Database Index Strategy

Initial indexes should come from real Stage 2 access patterns.

Do **not** index everything.

Initial candidate index classes may include:

```text
Resume(owner_user_id, kind, updated_at)
Resume(root_version_id, updated_at)
ProcessingJob(user_id, status, created_at)
WorkingDraft(user_id, resume_id) UNIQUE
PublicProfile(slug) UNIQUE
```

These are architecture candidates, not final SQL definitions.

Future index changes should use:

```text
real slow-query evidence
+
EXPLAIN ANALYZE
+
production-like data volume
```

---

## 7.5 JSONB Indexing

Resume JSONB existence does **not** automatically justify a day-one GIN index.

Current core access patterns mainly use relational metadata:

- owner
- Resume id
- rootVersionId
- kind
- updatedAt
- status

A GIN or JSON-specific index should be introduced only when real JSON-inside search requirements or measured slow queries justify it.

Rule:

> **JSONB exists ≠ GIN index required immediately.**

---

## 7.6 Database Connection Pooling

Web and worker processes use **bounded connection pools**.

If the managed PostgreSQL provider exposes a pooled endpoint / PgBouncer, prefer it where appropriate.

Exact pool size is determined later using:

- DB connection limits
- app instance count
- worker instance count
- CPU/RAM allocation
- query timing
- real concurrency

Important future rule:

> **Horizontal application scaling must also re-evaluate the PostgreSQL connection budget.**

Example risk:

```text
20 connections/process
×
10 web replicas
=
up to 200 potential DB connections
```

---

## 7.7 Dashboard Performance Invariant

Dashboard must remain lightweight.

It should fetch:

- lightweight Resume metadata
- variation count/summary where needed
- active indicator
- target-role summary
- timestamps
- pagination data

It should **not** fetch complete Resume JSON for every card/list item.

This is a locked performance invariant.

---

## 7.8 Private Resume Cache Policy

Day-one architecture does **not** place current editable Resumes or Working Drafts in Redis/shared cache.

Authoritative state remains:

```text
PostgreSQL
+
client editor state
```

Redis must be introduced because of a measured need, not because it is commonly used in scalable systems.

---

## 7.9 Public Profile Caching

Public Profile is a high-priority CDN/HTTP caching candidate because it is:

```text
published snapshot
+
read-heavy
+
write-rare
```

Target direction:

```text
Public request
   ↓
CDN / HTTP cache
   ↓ cache miss
Application
```

On profile update/unpublish:

```text
new published snapshot
   ↓
cache invalidate / purge
   ↓
serve new state
```

---

## 7.10 Analysis Cache

ATS / Resume-quality analysis may use short-lived caching.

Cache must be invalidated if any relevant identity changes:

- Resume content/hash
- Job Context/hash
- analysis version
- model/config version

The cache is an optimization, not durable product history.

---

## 7.11 Worker Concurrency

Do not use one global worker-concurrency number.

Separate classes:

```text
AI concurrency
OCR concurrency
PDF concurrency
```

Reason:

- AI often waits on an external provider
- OCR may consume significant CPU/GPU
- headless-browser PDF generation may consume significant RAM/CPU

Exact limits must come from benchmarking the actual deployment environment.

---

## 7.12 Backpressure

If incoming expensive work exceeds processing capacity, the system should not start everything simultaneously.

Desired behavior:

```text
Incoming jobs
    ↓
bounded processing capacity
    ↓
remaining jobs wait
    ↓
Queued / High demand UX
```

User-facing status may include:

```text
QUEUED
High demand
Waiting for processing capacity
```

The queue is a pressure buffer, not a magic way to create infinite capacity.

---

## 7.13 Durable Queue Trigger

Redis/BullMQ/managed queue is **not required on day one**.

Evaluate a durable queue if measurable signals appear:

- jobs occasionally lost
- workers race for the same job
- DB job polling becomes expensive
- persistent backlog becomes meaningful
- retries become difficult to schedule
- multiple workers need stronger coordination
- priority queues become necessary
- distributed job coordination becomes necessary

Until then:

```text
ProcessingJob DB model
+
worker abstraction
```

is sufficient.

---

## 7.14 Task-Based AI Model Routing

ResuMate uses task classes, not hard-coded business logic tied to one model name.

Conceptual direction:

```text
Small/simple rewrite
→ cheaper/faster candidate

Medium complexity operation
→ mid-tier candidate

Full tailoring / complex restructuring
→ stronger candidate
```

Actual task-to-model mapping must be based on evaluation.

---

## 7.15 AI Context / Token Budget

Each AI operation class has its own:

- input context budget
- maximum output budget

The system must not automatically send:

- full account data
- unrelated Resumes
- unrelated history
- unnecessary private fields

Longer context is not automatically better.

This is both a **quality** and **cost** rule.

---

## 7.16 Prompt Caching Readiness

Static AI instructions should be organized consistently so provider prompt caching can be used where supported.

Recommended ordering:

```text
Stable ResuMate truth rules
Stable schemas
Stable operation definitions
----------------------------
Dynamic Resume context
Dynamic Job Context
Dynamic user instruction
```

This makes context engineering and cost optimization compatible.

---

## 7.17 AI Quality vs Cost Rule

Locked routing principle:

> **Choose the cheapest model that reliably meets the required quality threshold.**

Not:

> choose the cheapest model.

Evaluation must consider:

- factual correctness
- evidence-boundary compliance
- Resume-writing quality
- tailoring relevance
- structured-output correctness
- latency
- cost

A cheaper model that causes repeated failures/retries may be more expensive in practice.

---

## 7.18 Storage Lifecycle

### Durable

- Use-As-Is original Resume
- explicitly preserved artifact
- persisted structured Resume state

### Short-lived / expiring

- generated PDF by default
- abandoned upload
- temporary processing artifact

### Extract/Rebuild original upload

Default direction:

```text
Structured import succeeds
    ↓
limited recovery/reprocessing retention
    ↓
auto-delete after configured period
```

User may delete earlier.

Future paid plans may extend retention.

Retention duration is configurable product policy, not a core domain invariant.

Important distinction:

> **Use-As-Is originals remain durable because the Resume representation depends on the original file.**

---

## 7.19 Subscription-Ready Retention Policy

Future account plans may change retention entitlement.

Example only:

```text
Free
→ shorter source-file retention

Paid
→ longer/permanent retention option
```

The storage architecture must not hard-code one subscription plan.

---

# Budget & Cost Design

## 7.20 Cost Categories

Monthly operating cost should be viewed as two broad groups.

```text
Monthly Cost
│
├── Baseline / semi-fixed
│   ├── web hosting
│   ├── managed PostgreSQL
│   ├── worker runtime
│   └── monitoring/platform baseline
│
└── Usage-variable
    ├── AI tokens
    ├── OCR compute/service
    ├── PDF compute
    ├── object storage
    └── bandwidth/operations
```

AI is currently expected to be the largest usage-variable risk.

---

## 7.21 Early Infrastructure Planning Estimate

**Planning figures only — not provider guarantees. Re-check pricing before production approval.**

Rough early-production assumption:

| Component | Rough monthly planning range |
|---|---:|
| TanStack/Node web service | ~$7–12 |
| Managed PostgreSQL | ~$8–15 |
| Background worker | ~$6–15 |
| DB volume/backups/network | ~$2–8 |
| R2 early storage | ~$0–2 |
| **Likely early range** | **~$25–50/month** |

Main wildcards:

- PaddleOCR compute
- headless Chromium PDF load
- always-on worker memory
- backup/PITR tier
- real user traffic

### Infrastructure guardrail

```text
Target early production:
~$50/month

Warning/review range:
~$60–75/month

Architecture-review ceiling:
~$100/month
```

The `$100/month` figure is **not** an automatic shutdown limit.

It means:

> If V1 infrastructure approaches this level before meaningful usage growth, investigate the architecture/cost drivers before adding more infrastructure.

---

## 7.22 AI Cost Planning Model

AI pricing changes over time. Any exact price must be date-stamped and rechecked before production budgeting.

For system-design planning, use operation-level cost models instead of assuming one flat AI cost.

Illustrative operation assumptions:

### Small rewrite

```text
~2,000 input tokens
~500 output tokens
Planning example ≈ $0.001 / operation
```

### Medium enhancement

```text
~6,000 input tokens
~1,500 output tokens
Planning example ≈ $0.03 / operation
```

### Full tailoring

```text
~10,000 input tokens
~2,000 output tokens
Planning example ≈ $0.08 / operation
```

These values are architecture estimates only.

Actual cost depends on:

- chosen model
- provider pricing at that time
- reasoning usage
- retries
- context size
- output length
- cache hits
- tool calls

---

## 7.23 Planning AI Cost per Active User

Example active user/month:

```text
20 small rewrites
4 medium enhancements
2 full tailoring operations
```

Illustrative calculation:

```text
20 × $0.001 = $0.02
4 × $0.03   = $0.12
2 × $0.08   = $0.16

base ≈ $0.30
```

With planning safety factor:

```text
≈ $0.45 / active user / month
```

Example planning table:

| Monthly active users | Rough planning AI cost |
|---:|---:|
| 100 | ~$45 |
| 250 | ~$113 |
| 500 | ~$225 |
| 1,000 | ~$450 |

This is a **budgeting model, not a forecast guarantee**.

The two most important metrics later are:

```text
AI cost per active user
AI cost per operation type
```

---

## 7.24 Launch AI Budget Guardrail

Initial recommendation for senior review:

```text
Target:
~$100/month

Warning:
~$150/month

Emergency review:
~$250/month
```

`Emergency review` means investigate, not automatically disable AI.

Review:

- task type consuming budget
- model assignment
- retries
- abuse
- oversized context
- oversized output
- routing mistakes
- genuine user growth

---

## 7.25 Free-Launch Policy

Launch can be generous but must not be unlimited.

Use:

```text
Generous quota
+
rate limit
+
per-operation token/output ceiling
+
system-wide spend monitoring
```

Goal:

- encourage adoption
- provide meaningful free usage
- block abuse
- avoid accidental runaway spend
- keep the product sustainable

---

## 7.26 Cost Observability

V1 launch requirement:

For every AI operation, collect non-PII telemetry such as:

```text
taskType
provider
model
inputTokens
cachedInputTokens
outputTokens
latency
estimated/actual cost
retryCount
success/failure
```

This data is required for evidence-based routing and budget decisions.

---

# Load Testing

## 7.27 Test Phases

Before production:

```text
Smoke test
   ↓
Expected-load test
   ↓
Stress test
   ↓
Spike test
```

Soak testing may be added for long-running stability concerns.

---

## 7.28 Load-Test Cost Control

Majority load tests should use:

- mock AI provider
- mock OCR provider

Real external providers should be tested separately with smaller integration tests.

Reasons:

- avoid unnecessary cost
- avoid provider-rate-limit distortion
- isolate ResuMate infrastructure behavior

---

## 7.29 Performance Signals to Observe

Track at minimum:

- p95 request latency
- error rate
- throughput
- DB query duration
- DB connection usage
- worker queue depth/backlog
- worker processing duration
- AI latency
- PDF duration
- extraction duration
- memory/CPU pressure

---

# Stage 7 — Locked Decisions Summary

```text
SCALE
──────────────────────────────
✓ 25 concurrent initial baseline
✓ 100 concurrent success scenario
✓ progressive scaling
✓ no premature infrastructure

PERFORMANCE
──────────────────────────────
✓ p95 latency
✓ error rate
✓ throughput
✓ lightweight dashboard
✓ pagination
✓ evidence-based indexes
✓ EXPLAIN ANALYZE
✓ no day-one JSONB GIN index
✓ bounded DB pooling

CACHE
──────────────────────────────
✓ editable Resume stays DB/client authoritative
✓ no Redis day one
✓ Public Profile is CDN/HTTP-cache candidate
✓ short-lived analysis cache
✓ explicit cache invalidation

WORKERS
──────────────────────────────
✓ separate AI/OCR/PDF concurrency
✓ benchmark before selecting limits
✓ backpressure
✓ Queued/High demand UX
✓ durable queue only after measurable trigger

AI COST
──────────────────────────────
✓ task-based model routing
✓ context/token budget per operation
✓ prompt-caching-ready context ordering
✓ quality-first model selection
✓ cheapest model that reliably passes requirements
✓ per-operation cost telemetry
✓ generous but bounded free launch

STORAGE
──────────────────────────────
✓ lifecycle categories
✓ temporary files expire
✓ Use-As-Is original durable
✓ Extract/Rebuild original configurable retention
✓ subscription-ready retention entitlement

BUDGET
──────────────────────────────
Infrastructure target:
~$50/month

Infrastructure architecture-review ceiling:
~$100/month

Initial AI target:
~$100/month

AI warning:
~$150/month

AI emergency review:
~$250/month

These are planning guardrails,
not contractual provider costs.

TESTING
──────────────────────────────
✓ smoke
✓ expected load
✓ stress
✓ spike
✓ mock expensive providers for most load tests
```

---

# Senior Review Decision Sheet

The following decisions should receive explicit senior review before Stage 8 implementation specification.

## Product / Scope

- Keep Form + Chat + Upload as V1 entry points?
- Keep simple HTML Live CV as V1 Public Profile?
- Keep advanced Portfolio builder deferred?

## Domain / Data

- Approve unified Resume entity with `VERSION | VARIATION` kind?
- Approve independent JSONB snapshots?
- Approve Resume-local subject/personal details?
- Approve Job Context persistence?

## Architecture

- Approve Modular Monolith?
- Approve web + worker process topology?
- Approve ProcessingJob abstraction without day-one Redis/BullMQ?
- Approve server-side PDF rendering?

## Technology

- Approve PostgreSQL + JSONB?
- Approve Drizzle implementation spike before final ORM lock?
- Approve Better Auth direction?
- Approve S3-compatible storage / Cloudflare R2 candidate?
- Approve Railway as current hosting candidate?
- Approve PaddleOCR/PaddleOCR-VL proof-of-concept?
- Approve OpenAI direct as primary V1 provider?

## Security / Reliability

- Approve ownership checks on every private resource?
- Approve Public Profile snapshot separation?
- Approve backup + PITR direction?
- Approve RPO <= 1 hour / RTO a few hours as internal V1 target?

## Scale / Cost

- Approve 25 concurrent baseline / 100 concurrent success test?
- Approve progressive scaling?
- Approve no day-one Redis?
- Approve CDN caching for Public Profile?
- Approve ~$50/month early infrastructure target?
- Approve ~$100/month infrastructure review ceiling?
- Approve ~$100/month initial AI target?
- Approve ~$150 AI warning threshold?
- Approve ~$250 AI emergency-review threshold?

---

# Implementation Readiness After Stage 7

Stages 1–7 establish the **System Design V1 Foundation**.

The project is now ready for senior review, but not yet ready for uncontrolled implementation.

Remaining preparation stages:

## Stage 8 — Detailed Technical Specification

Expected outputs:

- final DB schema
- JSONB Resume schema
- Drizzle/ORM schema direction
- WorkingDraft schema
- ProcessingJob schema
- JobContext schema
- OriginalFile schema
- PublicProfile snapshot schema
- key indexes
- server function contracts
- server routes
- service interfaces
- AI operation schemas
- ProposedPatch schema
- error model
- authorization matrix

## Stage 9 — Agentic Implementation Plan

Expected outputs:

- repository/folder structure
- module ownership
- dependency rules
- coding conventions
- environment setup
- migration sequence
- implementation order
- Codex instructions
- Claude Code instructions
- persistent context/checkpoint files
- feature task breakdown
- verification steps for coding agents

## Stage 10 — Test / Verify / Audit + Build Gate

Expected outputs:

- unit tests
- integration tests
- E2E flows
- AI truthfulness/evaluation suite
- extraction tests
- stale-write conflict tests
- file-upload security tests
- worker retry/idempotency tests
- backup/restore checklist
- load test scenarios
- production readiness checklist
- V1 build gate

After Stage 10:

> **Begin V1 implementation with Codex + Claude Code.**

---

# Updated Checkpoint Rule

If future architecture or implementation work conflicts with this document:

1. identify the exact existing decision,
2. identify the new evidence,
3. explain why a conflict exists,
4. propose the smallest necessary revision,
5. explicitly approve that revision,
6. update the relevant checkpoint/spec,
7. never silently replace established product truth.

Technology choices are easier to revise than domain/product invariants.

---

# System Design V1 Checkpoint Status

**Stages 1–7: COMPLETE**

Current next step:

```text
Senior Review
   ↓
Corrections / Approval
   ↓
Stage 8 — Detailed Technical Specification
```

This file is the current **ResuMate System Design V1 Foundation** for senior review and for generating the planned HTML web presentation.
