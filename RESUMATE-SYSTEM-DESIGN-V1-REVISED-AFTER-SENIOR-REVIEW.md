# ResuMate System Design V1 — Revised After Senior Review

**Status:** Senior-Reviewed Revision Checkpoint  
**Project:** ResuMate  
**Scope:** Revised System Design after Stage 1–7 review  
**Purpose:** Current V1 architecture reference before Stage 8  
**Date:** September 2026

---

# 1. Executive Summary

This document records the **revised ResuMate V1 system design** after senior review.

The revision does **not** fundamentally change the product/domain model. The main changes are deliberate simplifications intended to make V1 clearer, easier to implement, cheaper to operate, and safer for a small development team.

The three important revisions are:

1. **Terminology simplification**
   - Old: `Version`
   - New: `Resume`
   - Old: `Variation`
   - New: `Variant`
   - The underlying concept and lineage rules do not change.

2. **No ProcessingJob / background-worker architecture in V1**
   - Long operations are handled directly through application service calls for V1.
   - ProcessingJob, worker processes, durable queues, polling, and queue/backpressure UX are deferred until real usage shows they are needed.

3. **No PaddleOCR / dedicated OCR runtime in V1**
   - Resume extraction uses a multimodal LLM directly.
   - Extraction is still controlled through a strict schema, evidence rules, confidence/quality checks, and user review.
   - Dedicated OCR remains a future optimization if user growth, cost, accuracy, or throughput later justify it.

These items are **deferred, not rejected**.

The core V1 architecture remains:

- TanStack Start + React
- Node.js
- Modular Monolith
- Managed PostgreSQL
- Relational metadata + JSONB Resume snapshots
- Better Auth candidate
- S3-compatible private object storage / Cloudflare R2 candidate
- Direct OpenAI API candidate
- Structured AI operations
- Server-side PDF rendering
- Public Profile published snapshots
- Strong ownership/security rules
- Progressive scaling based on evidence

---

# 2. Senior Review Outcome

## 2.1 V1 scope

**Approved**

The current V1 product scope remains valid.

## 2.2 Unified Resume model

Senior feedback:

> The naming `VERSION / VARIANT` is confusing if Version is simply the root Resume.

Decision:

> Remove `Version` as a user-facing/product term.

Revised terminology:

```text
Resume
└─ Variant
```

Internal implementation may still use a root indicator, but the UI/domain language should avoid presenting `Version` as a separate first-class product concept.

## 2.3 Runtime topology

Senior feedback:

> Modular monolith is fine. Processing jobs are not needed for V1.

Decision:

- Keep Modular Monolith.
- Remove ProcessingJob from V1.
- Remove background-worker requirement from V1.
- Remove persistent queue/polling flow from V1.
- Keep service boundaries clean enough to introduce these later.

## 2.4 Technology candidates

Approved direction:

- Drizzle spike
- Better Auth
- R2
- Railway

Revision:

- Remove PaddleOCR from V1.
- Use direct LLM-based document extraction.

---

# 3. Revised Product Terminology

## 3.1 Resume

A **Resume** is the root, independently persisted Resume document.

It is not called a Version anymore.

## 3.2 Variant

A **Variant** is a saved alternative derived from a Resume or another Variant.

Reasons for creating a Variant may include:

- target role
- specific job
- ATS improvement
- different wording/style
- localization
- custom instruction
- role-specific tailoring

Example:

```text
Resume: Software Developer
├─ Variant: Frontend Developer
├─ Variant: Backend Developer
└─ Variant: Fullstack Developer
```

## 3.3 Lineage remains unchanged

A Variant still tracks:

```text
rootResumeId
sourceResumeId
```

Example:

```text
Resume A
  ↓
Variant A1
  ↓
Variant A2

A2.rootResumeId = A
A2.sourceResumeId = A1
```

The naming changed. The model concept did not.

---

# 4. Revised Resume Entity Model

Preferred logical model:

```text
Resume
- id
- kind: ROOT | VARIANT
- ownerUserId
- rootResumeId
- sourceResumeId
- revision
- contentJson
- createdAt
- updatedAt
- ...
```

Notes:

- `ROOT` is an implementation concept and does not need to appear in the UI.
- Root Resume and Variant may still share the same table/entity.
- Every Variant belongs to exactly one root Resume.
- Each Resume/Variant stores an independent content snapshot.
- Updating one Resume/Variant must never mutate another.

Hard invariant:

> **Resume and Variant snapshots are independent.**

---

# 5. Revised Lifecycle Terminology

Old terminology:

```text
Create → Save Version
Duplicate Version
Create Variation
```

Revised terminology:

```text
Create → Save Resume
Duplicate Resume
Create Variant
```

Persisted Resume/Variant editing remains:

```text
Direct Edit
OR
Create Copy & Edit
```

If Copy & Edit is chosen:

```text
Working State
   ↓
Save
   ↓
Variant
```

Working Draft remains temporary recovery/editing state and is not a user-facing Resume lifecycle type.

---

# 6. Root Delete / Variant Promotion

Behavior remains conceptually unchanged.

If a root Resume is deleted and Variants are preserved:

- oldest Variant is promoted to root Resume
- related root references are updated
- operation must be transactional

This is an internal consistency rule.

---

# 7. Revised V1 Runtime Architecture

## 7.1 Previous direction

Earlier architecture included:

```text
Web App
  ↓
ProcessingJob
  ↓
Worker
  ↓
AI / OCR / PDF
```

This is no longer required for V1.

## 7.2 Revised V1 direction

```text
User
  ↓
TanStack Start / React
  ↓
Node.js Modular Monolith
  ├─ PostgreSQL
  ├─ Object Storage
  ├─ OpenAI
  └─ Server-side PDF Renderer
```

Long operations are handled directly through application service boundaries.

Example:

```text
User clicks "Tailor Resume"
   ↓
Server Function
   ↓
AI Service
   ↓
OpenAI
   ↓
Structured ProposedPatch[]
   ↓
Preview
```

---

# 8. ProcessingJob Removed from V1

The following are removed from V1:

- ProcessingJob table/entity
- persistent QUEUED / PROCESSING / COMPLETED / FAILED lifecycle
- job polling
- dedicated worker process requirement
- persistent job ownership checks
- queue-depth management
- queue-specific retry state
- queue-specific backpressure UI

V1 UI may instead use simple request states such as:

```text
idle
loading
processing
success
error
```

---

# 9. Why ProcessingJob Is Deferred, Not Rejected

ProcessingJob is still a valid future architecture.

It is deferred because:

- V1 user scale is small
- developer count is small
- direct request/response flow is simpler
- fewer tables/services reduce implementation complexity
- fewer moving parts reduce operational risk
- most V1 AI operations can initially be handled synchronously or with bounded request execution

Potential future triggers for introducing ProcessingJob:

- operations regularly exceed comfortable request duration
- users need to leave and return while processing continues
- jobs are lost when app instances restart
- retries become complex
- multiple workers need coordination
- backlog becomes persistent
- priority scheduling is required
- AI provider latency becomes highly variable
- OCR/PDF workload grows
- job history/status becomes a real product requirement

Future migration path:

```text
Direct Service Call
      ↓
Measured Need
      ↓
ProcessingJob abstraction
      ↓
Worker
      ↓
Queue if necessary
```

The current service boundaries should be designed so this transition does not require rewriting business rules.

---

# 10. Revised Document Extraction Strategy

## 10.1 Old V1 direction

```text
Deterministic parser
  ↓
OCR
  ↓
AI semantic mapping
```

## 10.2 Revised V1 direction

```text
Upload Resume
   ↓
File validation
   ↓
Multimodal LLM extraction
   ↓
Structured extraction schema
   ↓
Validation
   ↓
Extraction-quality assessment
   ↓
User review
   ↓
Save Resume
```

Dedicated OCR is removed from V1.

---

# 11. Document Extraction Service Boundary

The application should still use an abstraction:

```text
DocumentExtractionService
  extract(file)
```

Initial implementation:

```text
OpenAIDocumentExtractor
```

Possible future implementations:

```text
PaddleOCRExtractor
ManagedOCRExtractor
HybridExtractor
```

This preserves implementation flexibility.

---

# 12. Extraction Is Not Enhancement

Hard rule:

> **Extraction answers: "What does this document actually contain?"**

Enhancement answers:

> **"How should this Resume be improved?"**

These operations must remain separate.

Flow:

```text
EXTRACT
"What does the uploaded file say?"
   ↓
REVIEW
"Is the extracted information correct?"
   ↓
ENHANCE
"How should wording/structure be improved?"
```

During extraction, the model must not:

- rewrite experience descriptions
- improve grammar for style
- infer missing achievements
- add metrics
- normalize uncertain job titles into more professional titles
- invent missing dates
- fabricate skills
- omit regional fields because they are uncommon in Western CVs

---

# 13. LLM Extraction Hard Rules

The extraction contract should explicitly require:

1. Extract only information visible or strongly supported by the document.
2. Do not infer unreadable career facts.
3. Use `null` or a review marker when a field cannot be read reliably.
4. Do not fabricate missing information.
5. Do not rewrite or enhance content during extraction.
6. Preserve unknown meaningful sections as Custom Sections.
7. Preserve regional/personal fields rather than silently deleting them.
8. Deduplicate repeated headers/footers when clearly repeated.
9. Do not merge unrelated columns.
10. Mark uncertain fields for review.
11. Preserve source/page metadata when feasible.
12. Return structured output according to a known schema.

Core principle:

> **Missing data is safer than fabricated data.**

---

# 14. Structured Output Does Not Equal Truth

A response may be valid JSON while still containing incorrect values.

Therefore:

```text
LLM Output
   ↓
Schema validation
   ↓
Business/evidence validation
   ↓
Extraction-quality checks
   ↓
User review
```

Schema correctness is necessary but not sufficient.

---

# 15. Suggested Extraction Result Shape

Conceptual example:

```json
{
  "personalDetails": {
    "name": {
      "value": "Aung Thant Zin",
      "confidence": "high",
      "needsReview": false
    },
    "phone": {
      "value": null,
      "confidence": "low",
      "needsReview": true
    }
  },
  "experience": [],
  "education": [],
  "skills": [],
  "customSections": [],
  "extractionQuality": "partial"
}
```

The exact schema will be finalized in Stage 8.

---

# 16. Extraction Quality Policy

The system must not rely only on a model's self-reported confidence score.

Use a composite quality decision based on factors such as:

- required-field coverage
- readable sections
- consistency
- missing-field rate
- uncertain-field rate
- document readability
- structural completeness

Initial policy direction:

## High quality

```text
~80%+
```

Action:

- show extracted Resume
- require review
- allow save/import

## Partial quality

```text
~50–79%
```

Action:

- show extracted content
- prominently flag uncertainty
- request missing/uncertain data
- allow user correction before save

## Unusable quality

```text
< ~50%
```

Action:

> Do not pretend extraction succeeded.

Offer:

- upload a clearer file
- upload original PDF/DOCX if available
- use Form
- use Chat-assisted creation

Thresholds are initial policy and may be tuned through evaluation.

---

# 17. Why LLM-Only Extraction Is Acceptable for V1

Benefits:

- significantly simpler infrastructure
- no OCR runtime to deploy
- no GPU/CPU-specific service requirement
- less operational maintenance
- lower platform complexity
- easier small-team implementation
- multimodal models can understand document layout and semantic grouping
- one AI provider can support extraction + enhancement + tailoring behind different task contracts

However, these benefits do not remove the need for strict validation and review.

---

# 18. Risks of LLM-Only Extraction

## 18.1 Hallucination

Risk:

The model completes or guesses unreadable text.

Mitigation:

- never infer unreadable facts
- null instead of guess
- field-level review markers
- user review before save
- factual extraction prompt contract

## 18.2 Layout confusion

Risk:

- two-column ordering mistakes
- duplicated headers
- footer content interpreted as Resume content
- sidebar content merged with main content

Mitigation:

- explicit layout rules
- preserve section boundaries
- deduplicate repeated headers/footers
- preserve unknown meaningful sections
- user review

## 18.3 Image quality

Risk:

- blur
- low resolution
- cropped document
- shadows
- skew
- unreadable small text

Mitigation:

- extraction-quality assessment
- stop below threshold
- clearer-upload fallback
- Form/Chat fallback

## 18.4 Factual normalization

Risk:

The model changes wording while "extracting."

Mitigation:

- extraction and enhancement are separate task types
- extraction prompt prohibits stylistic improvement
- output validation

## 18.5 Cost

Risk:

Multimodal extraction adds AI usage cost.

Mitigation:

- task-specific model routing
- benchmark weaker/stronger models
- per-operation token/image cost telemetry
- only use stronger model where quality requires it

---

# 19. Extraction Model Routing

Add a dedicated AI task class:

```text
DOCUMENT_EXTRACTION
```

Do not hard-code a specific model before evaluation.

Measure:

- field accuracy
- omission rate
- hallucination rate
- layout handling
- multilingual handling
- latency
- cost

Routing rule remains:

> **Use the cheapest model that reliably meets the extraction quality requirement.**

---

# 20. Revised AI Harness

The AI architecture remains controlled.

```text
User / File Input
    ↓
Task Router
    ↓
Context Builder
    ↓
Task Contract
    ↓
Provider Adapter
    ↓
Model
    ↓
Structured Output
    ↓
Schema Validation
    ↓
Evidence / Business Validation
    ↓
Result
```

Relevant task classes may include:

```text
DOCUMENT_EXTRACTION
SMALL_REWRITE
RESUME_ENHANCEMENT
FULL_TAILORING
ATS_ANALYSIS
EDITOR_COMMAND
```

Each task type has:

- dedicated instruction contract
- relevant context only
- specific output schema
- model route/config
- token/output budget
- validation rules

---

# 21. Revised Failure Handling

ProcessingJob-specific failure handling is removed from V1.

V1 operation failure behavior:

```text
External call
   ↓
Transient failure?
   ├─ Yes → limited retry + backoff + jitter
   └─ No  → fail
   ↓
Show user Retry / alternative action
```

Examples:

## Extraction failure

Offer:

- Retry
- Upload clearer file
- Use Form
- Use Chat

## AI enhancement failure

Offer:

- Retry
- Continue manual editing

## PDF failure

Offer:

- Retry export

Core graceful-degradation rule remains:

> Failure of one external dependency should not unnecessarily make the whole product unusable.

---

# 22. Revised Timeout Strategy

Operation-specific timeout classes remain.

Examples:

```text
normal API
small AI request
document extraction
full tailoring
PDF rendering
```

Exact timeout values are implementation/benchmark decisions.

---

# 23. Revised Scaling Strategy

The progressive-scaling principle remains unchanged:

> **Scale based on measured bottlenecks.**

V1 scaling order now emphasizes the simpler runtime:

```text
Measure
  ↓
Indexes
  ↓
DB connection tuning
  ↓
HTTP/CDN caching
  ↓
AI rate/concurrency control
  ↓
Horizontal app scaling
  ↓
Introduce job/worker architecture if needed
  ↓
Introduce durable queue if needed
  ↓
Split components only if justified
```

---

# 24. Revised Backpressure Strategy for V1

Because no persistent queue exists in V1, overload handling is simpler.

Possible controls:

- user/account rate limits
- global AI concurrency limits
- provider rate-limit handling
- request admission control
- 429 / Retry-After where appropriate
- 503/high-demand state if capacity is unavailable

User UX may say:

```text
High demand.
Please try again shortly.
```

A persistent queued-waiting UX is deferred until a real job system exists.

---

# 25. Revised Cost Model

## 25.1 Removed cost category

Dedicated OCR runtime cost is removed from V1:

```text
PaddleOCR CPU/GPU runtime
```

## 25.2 Added/expanded AI cost category

Document extraction becomes part of AI variable cost:

```text
AI Cost
├─ Document extraction
├─ Rewrite
├─ Enhancement
├─ Tailoring
└─ Analysis
```

This reduces infrastructure complexity but makes extraction an AI-cost item.

---

# 26. Revised Infrastructure Budget Interpretation

Earlier planning target remains useful:

```text
Target early infrastructure:
~$50/month

Architecture review ceiling:
~$100/month
```

With no dedicated worker/OCR runtime, V1 may be easier to keep near the lower end of the infrastructure range.

Actual costs still depend on:

- web service
- PostgreSQL
- R2
- headless PDF rendering load
- backup tier
- production traffic

---

# 27. AI Budget Implication

The previous AI budget guardrails remain useful:

```text
Target:
~$100/month

Warning:
~$150/month

Emergency review:
~$250/month
```

But Stage 8/implementation benchmarking must include:

```text
DOCUMENT_EXTRACTION
```

in cost telemetry.

Required telemetry:

```text
taskType
model
input tokens / image usage
cached input
output tokens
latency
cost
success/failure
retry count
```

---

# 28. Revised V1 High-Level Architecture

```text
                              USER
                                │
                                ▼
                     ┌────────────────────┐
                     │ TanStack Start UI  │
                     │ React Client       │
                     └─────────┬──────────┘
                               │
                               ▼
                 ┌────────────────────────────┐
                 │ ResuMate Modular Monolith  │
                 │ Node.js                    │
                 │                            │
                 │ Auth                       │
                 │ User/Profile               │
                 │ Resume / Variant           │
                 │ Working Draft              │
                 │ File/Upload                │
                 │ Document Extraction        │
                 │ AI Harness                 │
                 │ Job Context/Tailoring      │
                 │ Analysis/ATS               │
                 │ Public Profile             │
                 │ Export/Rendering           │
                 └──────┬────────┬────────────┘
                        │        │
              ┌─────────┘        └──────────────┐
              ▼                                  ▼
       Managed PostgreSQL               S3-Compatible Storage
     Relational Metadata + JSONB        Private Resume Files
              │
              │
              ▼
         OpenAI Adapter
         ├─ Extract
         ├─ Enhance
         ├─ Tailor
         └─ Analyze

Server-side PDF:
Resume JSON → renderer → headless browser → PDF
```

No V1 requirement for:

```text
ProcessingJob
Background Worker
PaddleOCR
Redis/BullMQ
Durable Queue
Job Polling
```

---

# 29. Revised Technology Status

## 29.1 Strong / approved direction

- TanStack Start
- React
- Node.js
- Modular Monolith
- Managed PostgreSQL
- relational metadata + JSONB Resume snapshots
- private S3-compatible object storage
- direct LLM document extraction
- structured AI operations
- provider abstraction
- server-side PDF rendering
- strong authorization
- progressive scaling
- cost observability

## 29.2 Preferred / provisional

- Drizzle ORM
- Better Auth
- Cloudflare R2
- Railway
- OpenAI direct

These remain implementation candidates to validate in Stage 8/9.

## 29.3 Explicitly deferred from V1

- PaddleOCR
- dedicated OCR runtime
- ProcessingJob entity
- worker service
- durable queue
- Redis/BullMQ
- job polling

---

# 30. What Was Removed and Why

The following items were removed **for V1 simplicity**, not because they are technically bad or useless.

## 30.1 PaddleOCR

Removed because:

- adds CPU/GPU runtime concerns
- adds deployment complexity
- adds another service/runtime to maintain
- adds operational burden for a small team
- initial user scale does not justify it yet
- multimodal LLM extraction is sufficient to validate the product

Not rejected forever.

## 30.2 ProcessingJob

Removed because:

- V1 does not yet need persistent long-running job orchestration
- adds DB/state complexity
- requires more retry/cancellation logic
- often leads naturally toward worker/queue infrastructure
- direct request/service flow is easier to build and debug
- simpler architecture helps reach V1 faster

Not rejected forever.

## 30.3 Background worker

Removed because:

- without OCR and persistent jobs, the worker has less justification
- one application runtime is easier to operate initially
- fewer deployments reduce failure modes

Not rejected forever.

## 30.4 Redis / BullMQ / durable queue

Still deferred because:

- there is no measured queue pressure yet
- no multi-worker coordination is required yet
- no persistent backlog exists yet
- the team should not pay complexity before need appears

---

# 31. When Deferred Components May Become Necessary

## 31.1 PaddleOCR / dedicated OCR

Reconsider if:

- LLM extraction cost becomes high
- high-volume scanned Resume traffic appears
- LLM extraction accuracy is insufficient
- multilingual/poor-quality scanned documents become common
- privacy/customer requirements favor local OCR
- extraction throughput becomes a major bottleneck

Possible future hybrid:

```text
Digital PDF/DOCX
→ deterministic parsing

Image / scanned PDF
→ OCR

Normalized text
→ LLM semantic mapping
```

or:

```text
File
→ cheap OCR
→ LLM only for semantic structuring
```

## 31.2 ProcessingJob

Reconsider if:

- extraction/tailoring regularly takes too long for direct request flow
- users need resumable background operations
- requests are lost during deploy/restart
- retries need durable tracking
- operations must continue after user leaves page
- job history is valuable
- priority execution is needed

## 31.3 Worker process

Reconsider if:

- PDF generation blocks web responsiveness
- AI/extraction workload competes with web requests
- CPU/memory-heavy processing grows
- independent scaling of processing becomes useful

## 31.4 Durable queue / Redis/BullMQ

Reconsider if:

- multiple workers require coordination
- backlog persists
- DB polling becomes expensive
- retry scheduling becomes complex
- priority jobs are required
- strict delivery guarantees become important

---

# 32. Future Evolution Path

The V1 architecture intentionally leaves a clean growth path.

```text
V1
Single Modular Monolith
Direct AI Extraction
Direct AI Operations

        ↓ user growth / measured pressure

Phase 2
Dedicated worker for heavy operations

        ↓ more backlog / retry complexity

Phase 3
ProcessingJob + durable queue

        ↓ extraction scale/cost pressure

Phase 4
OCR or hybrid extraction pipeline

        ↓ larger organizational scale

Phase 5
Selective component separation
```

The goal is not to avoid advanced architecture forever.

The goal is:

> **Use advanced architecture only when the product has evidence that it needs it.**

---

# 33. Revised Security Rules for LLM Extraction

Because raw Resume documents are now sent to an LLM for extraction, these rules become especially important:

1. Send only the uploaded Resume required for the extraction task.
2. Do not attach unrelated account data.
3. Do not send other Resumes.
4. Do not reuse extracted content across users.
5. Keep provider usage behind the server.
6. Never expose provider keys to the client.
7. Log operational metadata, not raw Resume content.
8. Apply file validation before sending content to the provider.
9. Preserve private-storage rules.
10. Require user review before saving extracted structured Resume data.

---

# 34. Revised Upload / Extract Flow

```text
1. User selects PDF / DOCX / JPG / JPEG / PNG

2. Client sends:
   - filename
   - type
   - size

3. Server validates:
   - allowed extension
   - MIME
   - file signature
   - size
   - user ownership

4. Server creates pending File metadata

5. Client uploads to private object storage

6. Server verifies object exists

7. User chooses:
   - Use As-Is
   - Extract & Edit

8A. Use As-Is:
   - retain original as durable Resume file
   - optional hidden extraction for product features

8B. Extract & Edit:
   - send file to DocumentExtractionService
   - multimodal LLM extracts structured data
   - validate schema/evidence/quality
   - show review UI

9. If quality >= acceptable threshold:
   - user reviews/corrects
   - save Resume

10. If quality too low:
   - do not fake success
   - ask for clearer upload
   - offer Form
   - offer Chat-assisted creation
```

---

# 35. Use-As-Is vs Extract & Edit Remains Important

## Use-As-Is

Source of visible Resume:

```text
Original file/design
```

Original file must remain durable while that Resume exists.

## Extract & Edit

Source of truth after successful save:

```text
Structured Resume JSON
```

Original source upload may follow limited-retention policy.

These two flows must not be confused.

---

# 36. Revised Subscription-Ready Storage Policy

For Extract & Edit source files:

```text
Default:
limited retention

User:
may delete earlier

Future paid plan:
may allow longer retention
```

For Use-As-Is:

```text
original file is required
→ durable while Resume exists
```

Subscription cannot silently delete a Use-As-Is Resume's underlying original file.

---

# 37. Revised Load / Performance Position

Initial load assumptions remain:

```text
Launch:
100–500 registered users

Baseline:
25 concurrent users

Higher-load success scenario:
100 concurrent users
```

Without ProcessingJobs, load testing should pay special attention to:

- direct AI operation latency
- request timeouts
- provider rate limits
- simultaneous extraction
- simultaneous tailoring
- PDF CPU/memory use
- DB connection usage

---

# 38. Direct-Request Capacity Guardrails

Until a queue exists, V1 should protect itself through:

- account rate limits
- AI operation quotas
- bounded concurrent AI operations
- provider timeout handling
- retry limits
- request cancellation where practical
- high-demand rejection rather than uncontrolled overload

If the direct-request model becomes unreliable, that is a signal to introduce background-job architecture.

---

# 39. Updated Architecture Invariants

## Resume / Variant

1. Root document is called Resume.
2. Derived persisted alternative is called Variant.
3. Every Variant has one root Resume.
4. Every Resume/Variant is an independent snapshot.
5. Editing one must never mutate another.

## AI

1. Application state is the source of truth.
2. Model memory is not trusted as product memory.
3. Extraction and enhancement are separate operations.
4. AI never fabricates unsupported career evidence.
5. Extraction uses `null`/review state when uncertain.
6. User reviews extracted content before persistence.
7. AI changes are structured and validated.

## Runtime

1. V1 uses a Modular Monolith.
2. V1 does not require ProcessingJob.
3. V1 does not require a worker service.
4. V1 does not require Redis/BullMQ.
5. Heavy infrastructure is added only after evidence.

## Extraction

1. V1 extraction uses a multimodal LLM.
2. Dedicated OCR is deferred.
3. Low-quality extraction must fail safely.
4. Extraction below usability threshold redirects the user to better inputs or other creation paths.

---

# 40. Stage 8 Readiness

This revised architecture should be treated as the current source of truth before Stage 8.

Stage 8 should now specify:

- final Resume/Variant DB schema
- root/lineage fields
- JSONB Resume document schema
- WorkingDraft schema
- File metadata schema
- JobContext schema
- Public Profile snapshot schema
- auth relationships
- server function contracts
- direct AI service contracts
- DocumentExtractionService interface
- extraction result schema
- extraction quality model
- ProposedPatch schema
- direct AI timeout/retry behavior
- PDF renderer interface
- authorization matrix
- indexes
- error taxonomy

Notably, Stage 8 should **not** define as V1 requirements:

- ProcessingJob schema
- worker process contract
- queue contract
- PaddleOCR integration

Those remain future-ready topics only.

---

# 41. Final Revised V1 Summary

```text
ResuMate V1

Frontend / Full-stack:
TanStack Start + React

Runtime:
Node.js

Architecture:
Modular Monolith

Data:
Managed PostgreSQL
Relational metadata + JSONB Resume snapshots

Resume model:
Resume
└─ Variant

Editing:
Local editor state
+ server-backed Working Draft
+ revision conflict protection

Files:
Private S3-compatible object storage

Extraction:
Direct multimodal LLM extraction
+ structured schema
+ quality checks
+ user review

AI:
Provider abstraction
OpenAI candidate
Task-based routing
Application-owned context
Structured operations
Evidence validation

PDF:
Server-side HTML/CSS → headless browser

Public Profile:
Published snapshot

Security:
Authentication + ownership
Private-by-default
Sensitive-data minimization

Scaling:
Progressive
No Redis/queue/worker until measured need

Deferred:
PaddleOCR
ProcessingJob
Worker service
Durable queue
Redis/BullMQ
```

---

# 42. Revision Philosophy

This revision intentionally removes some technically useful components from V1.

That does **not** mean those components are wrong.

It means:

> **V1 should contain the minimum architecture necessary to build the product clearly, correctly, securely, and maintainably.**

PaddleOCR, ProcessingJob, workers, and queues remain valid tools for later phases.

They should be introduced when their benefits exceed their complexity.

The architectural principle is:

> **Defer complexity, not capability.**

And:

> **Keep boundaries clean enough that deferred capability can be introduced without rewriting the product's core domain model.**

---

# 43. Checkpoint Status

**Senior feedback incorporated.**

Current V1 design status:

```text
Product scope             APPROVED
Resume / Variant naming   REVISED
Modular Monolith          APPROVED
ProcessingJob             DEFERRED
Worker service            DEFERRED
PaddleOCR                 DEFERRED
Direct LLM extraction     ADOPTED FOR V1
Drizzle                   APPROVED CANDIDATE
Better Auth               APPROVED CANDIDATE
R2                        APPROVED CANDIDATE
Railway                   APPROVED CANDIDATE
```

Next step:

> **Stage 8 — Detailed Technical Specification**
