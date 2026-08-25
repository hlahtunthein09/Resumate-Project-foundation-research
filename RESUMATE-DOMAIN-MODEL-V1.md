# ResuMate --- Domain Model v1

> **Status:** Approved Foundation\
> **Phase:** Domain Model Cross-Check --- Stages 1--18\
> **Date:** 26 August 2026\
> **Purpose:** Detailed conceptual domain foundation for ResuMate,
> consolidating the Research Foundation and the product-owner decisions
> made during the Stage 1--18 Domain Model Cross-Check.
>
> **Boundary:** This is not a database schema, API contract, class
> diagram, AI architecture, system architecture, or final implementation
> specification. It defines product meaning, conceptual objects,
> ownership, relationships, lifecycle behavior, invariants, edge cases,
> and scope boundaries that later technical design must respect.

------------------------------------------------------------------------

## 0. How to use this document

This file is the current **Domain Model v1 --- Approved Foundation**.
Later AI Architecture, System Design, database/API design,
specifications, implementation plans, and agents should begin from these
decisions rather than rediscovering product meaning.

Authority order:

``` text
Latest explicit product-owner decision
→ Domain Model Cross-Check decisions
→ Research Foundation
→ external references
→ generic assumptions
```

External products, schemas, and design patterns are validation
references. They do not automatically become ResuMate requirements.
Unresolved implementation details must remain unresolved until the
appropriate technical phase.

The model may evolve after senior review, implementation findings,
market evidence, or new research, but changes should be explicit.

------------------------------------------------------------------------

# 1. Domain purpose

ResuMate is an AI-powered Resume and career platform. Its Resume domain
exists so users can create, import, improve, tailor, preserve, organize,
reuse, share, and eventually use professional Resumes for job seeking
without first learning professional English writing, ATS terminology,
Canva-like design tools, or a complex product workflow.

The domain follows these principles:

-   **Simple UX:** non-technical users should understand the product.
-   **User control:** AI recommends and transforms; users decide what
    becomes persisted truth.
-   **Standalone Resumes:** persisted Resumes do not share mutable
    career records.
-   **Modular operations:** creation, extraction, analysis, enhancement,
    tailoring, templates, sharing, and Active CV selection are callable
    according to user intent rather than a forced linear sequence.
-   **Truth boundary:** AI may professionally express supported facts
    but may not fabricate career evidence.
-   **Localization:** Resume content/presentation conventions are
    contextual rather than globally fixed.
-   **Future extensibility:** Agency, Portfolio, Job, and Application
    domains must remain possible without inflating MVP.

------------------------------------------------------------------------

# 2. Core conceptual model

``` text
User
│
├── User Profile (private)
│
├── Version 1
│   ├── Variation 1
│   ├── Variation 2
│   └── Variation N
│
├── Version 2
│   └── Variation 1
│
└── Active CV Selection (0..1)
    └── references one existing Version OR Variation

Platform
└── Template Library
    ├── Template A
    ├── Template B
    └── Template N
```

A Version or Variation is a standalone Resume snapshot. A Variation is
grouped under one root Version. The UI keeps Variations flat even when
internal provenance knows that one Variation was created from another.

------------------------------------------------------------------------

# 3. Domain vocabulary

## 3.1 User

A **User** is an account holder using ResuMate.

In the personal MVP, the User owns Resume resources stored in the
account. A User may create Resumes for themselves or for someone else.

Therefore:

``` text
Account Owner ≠ necessarily Resume Subject
```

Future Agency users may manage many clients, but Agency workflows are
outside MVP.

## 3.2 User Profile

The **User Profile** is private account-level data used to operate
ResuMate. It may contain account information such as name, username,
email, phone, address, and future account-type information.

It is **not** a LinkedIn-style career profile and is not the source of
all Resume career data.

Career facts such as work experience, projects, certifications, and
skills belong inside Resume snapshots or, in the future, Portfolio.

**Hard rule:** User Profile remains private.

Retired official concepts:

-   Career Profile
-   Active Profile
-   Master Profile

## 3.3 Resume

The preferred current product term is **Resume**.

For current scope, ResuMate focuses on Resume rather than treating
Resume and Curriculum Vitae as the same product type. Cover Letter and
broader CV concepts may be future features.

Conceptually:

``` text
Resume Content
+
Selected Template
↓
Rendered Resume
```

The two persisted Resume identities in Domain Model v1 are **Version**
and **Variation**.

------------------------------------------------------------------------

# 4. Version

A **Version** is a persisted base Resume created/imported as its own
distinct Resume entry.

Core identity rule:

``` text
New creation
OR import/save
OR explicit Duplicate Version
→ Version
```

Current intended creation paths include:

-   Form creation
-   AI/Chat creation
-   Existing Resume upload/import
-   Explicit Version duplication

The exact entry-point list may evolve without changing the identity
rule.

## 4.1 Similarity does not merge Versions

If the user independently creates two nearly identical Web Developer
Resumes, they may still be two Versions. ResuMate does not need
expensive AI comparison merely to decide whether independent creations
"should really" be one Resume.

Version identity comes from the creation/persistence action and user
intent, not semantic similarity.

## 4.2 Save boundary

Before the user saves:

``` text
Entry Point
→ Temporary Working State
→ Preview
→ Save
→ Version
```

An unsaved Resume is not yet a persisted Version.

## 4.3 Standalone snapshot

Every Version owns its own Resume snapshot. Editing Version A must not
change Version B.

## 4.4 Editing a Version

Editing a Version creates a temporary working context. The user may:

``` text
Working State
├── Update Current Version
└── Save as Variation
```

A major edit does not automatically create a new Version.

## 4.5 Explicit Duplicate Version

``` text
Version A
→ Duplicate Version
→ Version B
```

Version B:

-   is independent;
-   does not inherit A's Variations;
-   has no future mutable data linkage to A.

## 4.6 Revision history

Full revision history is future scope. MVP does not require a permanent
revision-history system.

------------------------------------------------------------------------

# 5. Variation

A **Variation** is a persisted Resume branch derived from an existing
persisted Resume and grouped under one root Version.

Core identity rule:

``` text
Persisted Resume
→ branch / working copy
→ user saves branch
→ Variation
```

Possible reasons include:

-   ATS improvement;
-   general enhancement;
-   Target Role tailoring;
-   Applied Position tailoring;
-   full JD/Requirements tailoring;
-   custom instructions;
-   AI-suggested improvements;
-   concise/expanded rewriting;
-   editing an existing Variation.

## 5.1 Position ≠ Variation

Variation identity is not defined by job title.

``` text
Web Developer Version
├── Frontend — Company A JD
├── Frontend — Company B JD
├── General ATS Improvement
└── Concise Rewrite
```

One position may have many Variations. A Variation may also exist
without a target position or JD.

## 5.2 Save rule

Processing or previewing does not itself create a persisted Variation.

``` text
Persisted Resume
→ Enhance / Tailor / Edit
→ Working State
→ Preview
→ Save as Variation
→ Persisted Variation
```

## 5.3 Variation from Variation

A Variation may be edited or tailored again. The user may update the
current Variation or save a new Variation according to the supported
flow.

Internally, the system may know:

-   root Version;
-   immediate source Resume.

User-facing grouping stays flat:

``` text
Version A
├── Variation A1
├── Variation A2  ← internally may come from A1
└── Variation A3  ← internally may come from A2
```

No nested Variation tree is required in the UI.

## 5.4 Promotion

A general user-facing "promote Variation to Version" operation is
unnecessary because a Variation is already a standalone usable Resume.

There is one special exception: root Version deletion while preserving
Variations. In that case the oldest preserved Variation becomes the new
root Version.

## 5.5 Naming

ResuMate may suggest names for Versions/Variations based on context.
Users may rename them. Names are UX labels, not the source of domain
identity.

------------------------------------------------------------------------

# 6. Version--Variation relationship rules

1.  A Version can exist with zero Variations.
2.  A Version can have many Variations.
3.  Every persisted Variation belongs to exactly one root Version group.
4.  A Variation cannot remain as an ungrouped root-level Variation.
5.  A Variation may internally record another Variation as its immediate
    source.
6.  User-facing lineage remains flat under the root Version.
7.  Version and Variation are both standalone Resume snapshots.
8.  Editing one persisted Resume must not mutate another.
9.  Duplicate Version creates a new Version without copying source
    Variations.
10. Template switching creates neither Version nor Variation.
11. Position/title does not define Variation identity.
12. Branch-and-save behavior defines Variation creation.
13. New creation/import/explicit Version duplication defines Version
    creation.

------------------------------------------------------------------------

# 7. Active CV model

**Active CV** is the Resume selected by the user as the primary Resume
for job-seeking context.

It is a selection/reference, not another Resume type.

``` text
User
→ Active CV Selection (0..1)
→ Version OR Variation
```

## 7.1 Cardinality

For personal Domain Model v1, the user can have at most one Active CV.

Allowed states:

-   no Active CV;
-   one Active Version;
-   one Active Variation.

## 7.2 Optional

Users can use Resume-building features without Active CV. Active CV
mainly matters to future job-seeking features.

## 7.3 Deletion

If the Active Resume is deleted:

``` text
Active Resume deleted
→ No Active CV
```

ResuMate must not silently activate another Resume. The user explicitly
chooses the next Active CV.

## 7.4 Possible Outdated Active CV

"Outdated" must not be defined by age alone.

Bad rule:

``` text
Resume older than X months = outdated
```

Preferred conceptual signal:

``` text
Active CV
+
newer relevant career evidence / materially newer Resume evidence
→ Possible Outdated signal
→ warning/recommendation
```

Possible evidence includes a newer employment entry, qualification,
certification, current role, or other supported career fact absent from
Active CV.

The system may explain what appears newer or missing and recommend
review.

It must **not** automatically:

-   rewrite Active CV;
-   merge newer data into it;
-   activate another Resume;
-   assume newest Resume is necessarily correct;
-   treat age alone as proof of invalidity.

The user may keep the current Active CV, edit it, choose another Resume,
or create/update a Variation.

------------------------------------------------------------------------

# 8. Resume composition

A Version/Variation may conceptually contain:

``` text
Resume
├── Personal Details
├── Profile Summary
├── Education[]
├── Work Experience[]
│   └── Experience Description[]
├── Skills[]
├── Projects[]
├── Certifications[]
├── Languages[]
├── Custom Sections[]
├── Optional Job Context
└── Selected Template
```

This is not an all-fields-required schema.

A valid Resume may have no Work Experience, Projects, Certifications,
Job Context, photo, or localized ID. Structure should adapt to available
evidence.

------------------------------------------------------------------------

# 9. Content ownership and data boundaries

## 9.1 No shared mutable Career Facts object in v1

Domain Model v1 deliberately does not use one global mutable Career
Facts record referenced by every Resume.

``` text
Version A → owns its snapshot
Version B → owns its snapshot
Variation A1 → owns its snapshot
```

## 9.2 Personal details are Resume-local

Name, email, phone, and address inside a Resume belong to that Resume
snapshot. Changing them in one Resume does not automatically update
others.

## 9.3 Career sections are Resume-local

Education, Work Experience, Skills, Projects, Certifications, Languages,
and similar sections are snapshot content.

If the same work experience appears in two Versions, the domain treats
them as separate copies rather than one shared mutable record.

## 9.4 Account owner vs Resume subject

A user's dashboard may contain Resumes for other people. Therefore
Resume personal details must not be forced to match User Profile.

## 9.5 AI-generated content

Once AI-generated wording is accepted and saved, it becomes ordinary
Resume content. Domain Model v1 does not require a permanent
`AI Generated Content` object.

------------------------------------------------------------------------

# 10. Evidence vs narrative boundary

A critical domain distinction exists between factual evidence and
professional narrative.

## 10.1 Evidence-like fields

Examples:

-   company/employer;
-   position/title;
-   dates;
-   education;
-   certification;
-   project identity;
-   factual skill claim;
-   award;
-   measurable result.

AI must not silently alter or fabricate these.

## 10.2 Narrative/presentation fields

Examples:

-   Profile Summary;
-   Experience Description;
-   bullet wording;
-   section ordering;
-   emphasis;
-   concise/expanded phrasing.

AI may generate or rewrite these using supported evidence and reasonable
professional language.

## 10.3 Truth rule

> **AI may transform, synthesize, organize, clarify, and professionally
> express supported facts. AI may not fabricate unsupported career
> evidence.**

AI must not invent unsupported employers, dates, certifications, awards,
projects, technologies, skills, qualifications, metrics, revenue impact,
team sizes, or achievements.

When factual specificity is missing, ask the user or show the gap rather
than manufacturing evidence.

------------------------------------------------------------------------

# 11. Existing Resume / upload domain

An **Existing Resume** is a Resume the user already has and brings
through upload/import.

Current intended MVP formats:

-   PDF
-   DOCX
-   JPG/PNG image

Future formats may be added.

## 11.1 Upload ≠ Version

``` text
Upload File
→ Temporary / Original Input
→ Preview / Extract / Review
→ User chooses Save / Import
→ Version
```

Until save/import, the upload is not a persisted Version.

Current personal MVP intent is one Resume per upload/import action
rather than bulk personal upload.

------------------------------------------------------------------------

# 12. Existing Resume paths

## 12.1 Use As-Is

``` text
Original Resume
→ Use As-Is
→ Save/Register as Version
```

The original design remains as-is.

If future AI features need structured values, extraction may happen
internally/on demand according to later architecture.

## 12.2 Structured import

``` text
Original Resume
→ Extract Content
→ Structured Resume Data
→ User Review/Edit
→ ResuMate Template
→ Save as Version
```

ResuMate does not promise pixel-perfect reproduction of arbitrary
Canva/Word/PDF layouts.

## 12.3 Extract/enhance during import

The user may extract, review, edit, and apply enhancement before first
save. The resulting saved document is the imported Version.

Further persisted branching from that Version may create Variations.

## 12.4 Tailor persisted imported Resume

``` text
Imported Version
→ Working State + Job Context
→ Tailor
→ Preview
→ Update Current OR Save as Variation
```

------------------------------------------------------------------------

# 13. Extraction rules

Extraction exists to convert visually diverse inputs into structured
values that AI can reason over reliably.

## 13.1 Reviewability

Extraction is not assumed 100% accurate. Users must be able to
review/edit extracted information.

## 13.2 Semantic correction

If source content appears semantically misplaced, recommend correction
instead of silently changing it.

Example:

``` text
LANGUAGES
- HTML
- CSS
- JavaScript

Suggestion:
"These appear to be technical skills. Move them to Skills?"
```

User confirms or rejects.

## 13.3 Low confidence

Uncertain values must be flagged rather than guessed.

``` text
confident → present normally
uncertain → flag for review
```

If the document is practically unusable or critical fields cannot be
extracted reliably, request a clearer file or offer Form/Chat creation.

## 13.4 Complete failure

For unreadable, corrupted, password-protected, or unsupported files:

-   explain processing cannot continue;
-   do not hallucinate content;
-   request a usable/unlocked file;
-   offer another entry path when appropriate.

## 13.5 Multi-page input

Pages of one Resume should be interpreted as one document. Clearly
duplicated content may be compacted.

## 13.6 Unknown sections

``` text
Known equivalent exists → map/suggest mapping
No reliable equivalent → preserve as Custom Section
```

Meaningful content must not be silently discarded merely because the
schema did not anticipate it.

------------------------------------------------------------------------

# 14. Original file and layout boundary

If the user chooses **Use As-Is**, the original document/design remains
their chosen Resume representation.

If the user chooses structured extraction/reconstruction:

``` text
Original visual Resume
→ Extract structured content
→ Render with ResuMate Template
```

ResuMate does not need to recreate arbitrary uploaded layouts
pixel-perfectly.

Current product decision: after structured import, the original file
does not need to remain permanently solely for that imported structured
Version. If the untouched original itself is what the user wants to use,
choose Use As-Is.

Exact storage/caching is an architecture decision, not locked here.

------------------------------------------------------------------------

# 15. Job Context

**Job Context** is an optional composite concept used to orient or
tailor a Resume.

``` text
Job Context
├── Target Role(s)
├── Applied Position
├── Job Description
├── Requirements
├── Company
├── Location
└── Employment Type
```

Both Version and Variation may contain optional Job Context.

Not every field is mandatory.

## 15.1 Target Role

A Target Role is a broader role or role set that may fit the Resume
evidence, skills, knowledge, experience, or intended direction.

It can support general Resume orientation, tailoring, future job
discovery, and future Agency workflows.

It is context/attribute information in Domain Model v1, not an
independently managed reusable object.

## 15.2 Applied Position

Applied Position is a more specific position the user intends to pursue,
commonly connected to a particular hiring opportunity.

``` text
Target Role: Frontend Developer
Applied Position: Junior Frontend Engineer
```

The concepts remain distinct.

## 15.3 Flexible context input

Tailoring must support multiple forms:

-   Target Role only;
-   Applied Position only;
-   JD;
-   Requirements;
-   full hiring post;
-   combinations.

When context is insufficient for the requested tailoring, the
interaction layer may request more information.

## 15.4 AI inference

When a JD strongly indicates a role but does not explicitly state it, AI
may infer likely position/context. The user must be able to confirm/edit
the inference.

## 15.5 Structured parsing

A hiring post may be parsed into:

-   likely position;
-   responsibilities;
-   requirements;
-   preferred skills;
-   company;
-   location;
-   employment type;
-   other useful context.

## 15.6 User-brought vs future agent-discovered jobs

A user may bring a job and request tailoring. In the future, a
Job-Seeking Agent may discover a job and the user may choose to tailor
for it.

Both can use Job Context, but full Job/Application records are later
domains.

## 15.7 No forced auto-tailor/auto-apply

Domain Model v1 does not require automatic tailoring or automatic
application. User control remains central.

------------------------------------------------------------------------

# 16. Template & Presentation

A **Template** is a shared reusable presentation definition supplied by
ResuMate.

``` text
Structured Resume Content
+
Template
→ Rendered Resume
```

## 16.1 Platform library

Templates are platform-level reusable resources, not user-owned copies.

## 16.2 Selected Template

A Version/Variation may remember its selected Template.

## 16.3 Template switch

Changing Template:

-   does not change Resume content;
-   does not create Version;
-   does not create Variation.

The same content may be previewed through multiple Templates.

## 16.4 Capability metadata

Templates may conceptually describe capabilities such as:

-   photo support;
-   section/field support;
-   social-link support;
-   ATS suitability/risk;
-   visual emphasis;
-   region/context suitability.

This is not yet a final schema.

## 16.5 Missing presentation capability

If a Template cannot present meaningful Resume content well, the system
should warn/recommend/adapt rather than silently delete content.

## 16.6 Recommendation

ResuMate may recommend Templates based on Resume content, ATS concerns,
and localization. Final choice belongs to the user.

## 16.7 Future custom Template builder

A simple block-based user Template builder may be future scope. MVP
remains structured content + reusable platform Templates, not a
Canva-like freeform editor.

------------------------------------------------------------------------

# 17. Localization

Localization is a first-class domain concern.

## 17.1 Decision sources

Localization should combine:

1.  target job market/region --- primary;
2.  user's location where relevant;
3.  explicit user choice/override.

Nationality alone should not dictate Resume presentation.

## 17.2 Contextual fields

Fields such as:

-   Age;
-   Date of Birth;
-   Profile Photo;
-   NRC;
-   Passport;
-   Gender;
-   Marital Status;

must not be globally fixed as universally mandatory.

They are regional/contextual.

## 17.3 Recommendation rather than prohibition

Example:

``` text
Target market: US
Resume includes Photo + Age + NRC
→ ResuMate warns/recommends
→ user decides
```

## 17.4 Template/localization conflict

If localization suggests a capability absent from the selected Template,
recommend a better Template rather than silently discarding user data.

## 17.5 Variation-level adaptation

A Myanmar-oriented Version may be tailored into a Singapore/US-oriented
Variation. Localization can therefore differ between Version and
Variation.

------------------------------------------------------------------------

# 18. Ownership

## 18.1 Personal MVP

``` text
User
owns
Resume Resources
```

Versions, Variations, and related account resources belong to the
account owner.

## 18.2 Resume subject independence

The account owner may create a Resume for another person. Resume subject
and account owner do not need to match.

## 18.3 Future Agency

Future model may resemble:

``` text
Agency Account
├── Client A
│   ├── Versions
│   └── Variations
├── Client B
└── Client C
```

But Client/Organization/Workspace are not current user-facing MVP domain
objects.

Later architecture should remain extensible enough to add them.

------------------------------------------------------------------------

# 19. Lifecycle

Domain Model v1 intentionally avoids a large state machine.

## 19.1 New Resume

``` text
Create / Import
→ Temporary Working State
→ Preview / Review
→ Save
→ Persisted Version
```

## 19.2 Existing Resume modification

``` text
Persisted Version or Variation
→ Edit / Enhance / Tailor
→ Temporary Working State
→ Preview
→ Update Current OR Save as Variation
```

## 19.3 Active selection

`Active` is not a Resume lifecycle status. It is a separate user-level
selection/reference.

## 19.4 Archive

Archive is not required in MVP.

## 19.5 Delete

Delete requires confirmation.

Current MVP decision is direct deletion rather than Trash/restore.
Trash/soft-delete is future scope.

## 19.6 Root Version deletion

If a Version has Variations, the user may delete the whole group or
preserve Variations.

Preserve case:

``` text
Root Version deleted
→ oldest preserved Variation becomes Version/root
→ remaining Variations stay grouped under it
```

This is the special promotion exception.

------------------------------------------------------------------------

# 20. Temporary Working State

Working State is a temporary processing/editing context, not a persisted
Resume entity.

It may exist while:

-   editing;
-   extracting;
-   enhancing;
-   tailoring;
-   applying suggestions;
-   previewing.

``` text
Source Resume
→ Working State
→ Discard
  OR Update Current
  OR Save as Variation
```

The later architecture may implement this with client state, server
state, temporary storage, checkpoints, or another mechanism. Domain
Model v1 does not prescribe the implementation.

------------------------------------------------------------------------

# 21. ATS / Analysis results

ATS and analysis results are temporary/runtime outputs in v1.

They may include:

-   diagnostics;
-   score-like indicators;
-   parseability findings;
-   gaps;
-   recommendations;
-   suggested changes.

They are not required as permanent history records.

The useful persistent outcome is the Resume the user intentionally saves
after applying selected improvements.

ATS should be treated as explainable diagnostics rather than a universal
magic score.

------------------------------------------------------------------------

# 22. Hard invariants

1.  **Variation root:** every persisted Variation belongs to one root
    Version.
2.  **Standalone snapshots:** every Version/Variation is an independent
    Resume snapshot.
3.  **No cross-Resume mutation:** editing one Resume must not
    automatically alter another.
4.  **Template/content separation:** Template changes must not change
    Resume content.
5.  **AI truthfulness:** AI must not fabricate unsupported career facts.
6.  **Evidence protection:** factual evidence fields must not be
    silently changed without user confirmation.
7.  **Active validity:** Active CV may reference only an existing
    Version or Variation.
8.  **Active deletion:** deleting Active Resume produces No Active CV.
9.  **Profile privacy:** User Profile is private.
10. **Branch identity:** new creation/import/explicit Duplicate Version
    → Version; persisted Resume branch + save → Variation; Template
    switch → neither.
11. **Position ≠ Variation.**
12. **Upload ≠ Version until save/import.**
13. **User control:** AI output does not silently become persisted
    truth.
14. **Resume subject independence:** Resume subject need not equal
    account owner.
15. **No forced shared Career Facts:** v1 does not require shared
    mutable career records across Resumes.
16. **Working State is temporary:** unsaved processing is not
    Version/Variation.
17. **External references do not override explicit product truth.**

------------------------------------------------------------------------

# 23. Edge-case matrix

  -----------------------------------------------------------------------
  Edge case                           Domain Model v1 behavior
  ----------------------------------- -----------------------------------
  No Work Experience                  Resume creation remains allowed;
                                      emphasize available Education,
                                      Projects, Skills, Certifications,
                                      etc.

  Minimal data                        Build the best supported structure
                                      without inventing experience.

  Low-quality upload                  Flag uncertainty; request better
                                      input when reliable extraction is
                                      impossible.

  Corrupted/protected/unreadable file Do not guess; request usable input
                                      or another entry path.

  50+ Variations                      Domain imposes no conceptual limit;
                                      subscription/business policy may
                                      limit usage later.

  Root Version deleted, preserve      Oldest preserved Variation becomes
  Variations                          new Version/root.

  Delete Version + Variations         Delete whole group after
                                      confirmation.

  JD missing title                    AI may infer; user confirms/edits.

  JD requires missing skill           Show gap; never add fake skill.
                                      User adds only if true.

  Possible outdated Active CV         Compare newer relevant evidence;
                                      warning/recommendation only; no
                                      auto-switch/update.

  Duplicate upload                    Allowed; may become another Version
                                      by user choice.

  Template cannot present content     Do not silently delete meaningful
                                      content; warn/recommend/adapt.

  Unknown uploaded section            Map if reliable; otherwise preserve
                                      as Custom Section.

  Same experience in two Versions     Independent copies; editing one
                                      does not affect the other.

  Variation edited again              Update current or save another
                                      Variation according to user
                                      choice/flow.

  Variation from Variation            Track internal provenance; UI
                                      remains flat under root.

  Active Resume deleted               Active selection becomes empty.

  No Active CV                        Resume-building remains usable.

  Target market changes               Localization may change at
                                      Variation level.

  User wants original design          Use As-Is path.

  User wants structured enhancement   Extract/rebuild using ResuMate
                                      Template.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 24. External validation position

## Teal

Useful reference for comprehensive Resume/tailoring workflows. ResuMate
does **not** adopt a shared-master-data architecture in v1; it keeps
standalone Version/Variation snapshots.

## HelloCV

Useful reference for AI Resume/profile/job-agent ideas. ResuMate keeps
its own private User Profile + future Portfolio + optional Active CV +
Version/Variation model.

## Rezi

Useful for ATS/tailoring patterns. ResuMate favors explainable
diagnostics over chasing a supposedly universal score.

## Canva

Useful for Template/design diversity. ResuMate MVP is not a freeform
design editor.

## Structured Resume schemas / DDD

Useful for later technical validation. They do not override explicit
ResuMate product decisions.

------------------------------------------------------------------------

# 25. MVP boundary

## Current domain foundation

-   private User/Profile;
-   Resume creation;
-   Form creation;
-   AI/Chat creation;
-   Existing Resume upload/import;
-   Use As-Is;
-   extraction/review;
-   enhancement;
-   ATS/quality diagnostics;
-   tailoring foundation;
-   Version management;
-   Variation management;
-   standalone snapshots;
-   Template selection;
-   localization;
-   Active CV selection;
-   sharing/export concepts where supported;
-   user review/edit/control.

## Future scope

-   Portfolio implementation;
-   Job Platform integrations;
-   external job APIs;
-   full Job domain;
-   Application records/lifecycle;
-   auto-apply;
-   Agency multi-client workflows;
-   Organization/Workspace;
-   custom Template builder;
-   Trash/restore;
-   full revision history;
-   advanced publication permissions.

Future scope must not inflate MVP.

------------------------------------------------------------------------

# 26. What this model does not decide

Domain Model v1 does **not** lock:

-   database tables/collections;
-   SQL foreign keys;
-   JSON schema;
-   snapshot encoding;
-   template rendering engine;
-   blob storage;
-   event sourcing;
-   revision implementation;
-   provenance schema;
-   temporary-state persistence;
-   AI memory architecture;
-   vector storage;
-   tenant database strategy;
-   exact API contracts;
-   agent/service boundaries.

Example domain requirement:

> Every Variation belongs to one root Version and may internally know
> its immediate source.

Possible future implementations may use `root_version_id`,
`source_resume_id`, provenance events, or another equivalent design. The
domain meaning is locked; storage is not.

------------------------------------------------------------------------

# 27. AI Architecture implications

The next AI Architecture phase must respect this domain.

AI capabilities may include:

-   extraction;
-   semantic mapping;
-   Resume analysis;
-   ATS diagnostics;
-   professional writing;
-   enhancement;
-   tailoring;
-   Job Context parsing;
-   truth/evidence protection;
-   confidence handling;
-   localization recommendation;
-   Template recommendation;
-   future job matching.

Example boundary:

``` text
AI may rewrite Experience Description

but must not silently change:
Company
Position
Dates
Certification
unsupported Skill
```

The Domain Model does not decide how many agents/models/services
implement these capabilities.

------------------------------------------------------------------------

# 28. Decision summary

1.  `Resume` is the preferred current product term.
2.  User Profile is private account data, not a public career profile.
3.  Career Profile / Active Profile / Master Profile are retired
    official concepts.
4.  Version = distinct persisted base Resume entry.
5.  Semantic similarity does not merge independent Versions.
6.  Explicit Duplicate Version creates an independent Version.
7.  Variation = saved branch from an existing persisted Resume.
8.  Enhancement/tailoring/ATS/custom edits may create Variations.
9.  Position ≠ Variation.
10. Variation can exist without specific Job Context.
11. Every Variation belongs to one root Version.
12. Internal Variation provenance may be tracked.
13. UI shows Variations flat under Version.
14. Version/Variation are standalone snapshots.
15. Resume data is not shared-mutable across snapshots.
16. User Profile is not the automatic source of Resume personal details.
17. Account owner and Resume subject may differ.
18. Active CV is optional.
19. Personal v1 allows at most one Active CV.
20. Version or Variation may be Active.
21. Deleting Active Resume creates No Active CV.
22. Possible outdated Active CV triggers warning/recommendation only.
23. Template is presentation, not content.
24. Template switch creates neither Version nor Variation.
25. Templates come from a shared platform library in MVP.
26. Localization is contextual and user-controlled.
27. Target market/region is the primary localization context.
28. Job Context is optional on Version and Variation.
29. AI may infer missing Job Context but user can confirm/edit.
30. Upload becomes Version only after save/import.
31. Existing Resume may be used as-is.
32. Structured import extracts content and renders with ResuMate
    Template.
33. Arbitrary uploaded layouts are not pixel-perfect reproduced.
34. Extraction exposes uncertainty rather than guessing.
35. Unknown meaningful sections are preserved as Custom Sections when
    mapping is unreliable.
36. AI may write professionally but may not fabricate evidence.
37. Evidence fields must not be silently changed.
38. ATS analysis/suggestions are temporary/runtime in v1.
39. Working State is temporary.
40. MVP uses a minimal lifecycle rather than Draft/Ready/Archived
    complexity.
41. Direct delete is current MVP; Trash/history are future.
42. Root deletion may preserve Variations by promoting the oldest
    Variation to root.
43. Subscription limits are business policy, not conceptual domain
    cardinality.
44. Agency is future but architecture should remain extensible.
45. Portfolio, Job Platform, and Application Lifecycle are future.
46. External references validate ResuMate; they do not define it.
47. Domain Model v1 is sufficiently coherent to guide AI Architecture
    research while remaining explicitly revisable.

------------------------------------------------------------------------

# 29. Final domain diagram

``` text
                         ┌──────────────────────┐
                         │        USER          │
                         └──────────┬───────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
   ┌──────────────────┐   ┌──────────────────┐   ┌─────────────────────┐
   │  USER PROFILE    │   │    VERSION 1     │   │ ACTIVE CV SELECTION │
   │    (private)     │   │ standalone Resume│   │       0..1          │
   └──────────────────┘   └────────┬─────────┘   └──────────┬──────────┘
                                   │                        │
                          ┌────────┼────────┐               │
                          ▼        ▼        ▼               │
                        Var 1    Var 2    Var N             │
                                                           │
                 Active selection references one valid Version
                 or one valid Variation.

Each Version / Variation
│
├── Personal Details
├── Profile Summary
├── Education[]
├── Work Experience[]
│   └── Experience Description[]
├── Skills[]
├── Projects[]
├── Certifications[]
├── Languages[]
├── Custom Sections[]
├── Optional Job Context
│   ├── Target Role(s)
│   ├── Applied Position
│   ├── JD
│   ├── Requirements
│   ├── Company
│   ├── Location
│   └── Employment Type
└── Selected Template
        │
        ▼
Platform Template Library
```

Internal provenance may additionally know:

``` text
Variation
├── root Version
└── immediate source Resume
```

without exposing nested lineage in the main user experience.

------------------------------------------------------------------------

# 30. Approval state

The Stage 1--18 Cross-Check established enough product meaning,
ownership, lifecycle, relationships, invariants, and edge-case behavior
to designate this model:

> **ResuMate Domain Model v1 --- Approved Foundation**

"Approved Foundation" does not mean permanently immutable. It means
later work should start from this model rather than restart discovery.
Contradictions discovered later should be handled as explicit revisions.

Current progression:

``` text
Research Foundation
→ Domain Model v1 — Approved Foundation
→ AI Architecture Research
→ Agentic SDLC / Specification
→ System Design
→ Implementation Planning
```

------------------------------------------------------------------------

# 31. Source basis

This file consolidates:

-   **ResuMate --- Research Foundation & Product Context Handoff**
-   **Domain research stage 1 to 18**
-   **Domain object research**
-   explicit product-owner answers recorded through the Stage 1--18
    cross-check
-   the latest correction to **E8 --- Possible Outdated Active CV**,
    defining "possible outdated" by comparison with newer relevant
    career evidence rather than a simple Resume-age threshold.

External references discussed during research---including Teal, HelloCV,
Rezi, Canva, structured Resume schemas, and DDD patterns---remain
validation sources only.

------------------------------------------------------------------------

**End --- ResuMate Domain Model v1 --- Approved Foundation**
