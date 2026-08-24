# ResuMate — Research Foundation & Product Context Handoff

> **Purpose:** This document is the consolidated research result and product-context handoff for the ResuMate project. It is intended to let a future ChatGPT/Claude/Gemini/agent session continue the project without requiring the product story, decisions, research findings, or previous reasoning to be re-explained from scratch.
>
> **Status:** Research Foundation — Phase 1 Product/UX + Phase 2 CV Intelligence & Quality completed to the current planning milestone. This is **not** the final product specification, database schema, or implementation plan.
>
> **Important:** Research is never considered permanently finished. This document records the current foundation and decisions as of **24 August 2026**. New evidence, technologies, standards, competitor changes, user research, or implementation discoveries may update it later.

---

## 0. How This Document Should Be Used

This file is a **context-transfer / research handoff**, not a request to rewrite the project or restart discovery.

When continuing in a new chat or agent session:

1. Read this document first.
2. Treat the user's explicit product decisions in this document as higher authority than generic assumptions.
3. Treat external research as evidence/reference, not as automatic product requirements.
4. Treat unresolved questions as unresolved; do not silently invent answers.
5. Do not redesign ResuMate around another product merely because another product uses a similar feature.
6. Preserve the distinction between **Version** and **Variation**. This is a critical product concept.
7. Do not assume a fixed sequence for user inputs. Target role, job description, and requirements are optional context and may arrive in any order or not at all.
8. Do not treat application tracking/job-platform integration as an MVP requirement. That research belongs to a later phase.
9. Do not treat the user's private ResuMate account/profile as a public career profile. Public portfolio is a later feature.

---

# 1. Project Identity

## 1.1 What ResuMate Is

ResuMate is an AI-powered CV/resume and career platform whose core purpose is to remove the difficulty of producing professional, relevant, readable, and useful CVs from the user's own career information.

It is **not merely a CV generator**.

The strongest current product thesis is:

> **The user should not need to know how to write a CV. They only need to know their own career facts. ResuMate should transform those facts into a professional CV, then allow the user to preserve, improve, branch, tailor, and reuse that work for different career directions and job contexts.**

A second central differentiation is:

> **ResuMate can structure a user's career information into reusable Versions and job-specific Variations, giving the user control over their CV history rather than hiding every change behind an AI black box.**

This is especially important because a person may have genuinely different career directions over time.

Example:

```text
User
│
├── Version A — 3D / Creative Career
│   ├── Variation — 3D Modeler
│   ├── Variation — Animator
│   ├── Variation — 2D Animator
│   ├── Variation — Storyboard Artist
│   └── Variation — Content Writer
│
└── Version B — Software / Web Career
    ├── Variation — Frontend
    ├── Variation — Backend
    ├── Variation — Fullstack
    ├── Variation — Mobile
    ├── Variation — DevOps
    └── Variation — Solution Architect
```

Version B is not a Variation of Version A because the underlying career direction/state can have changed substantially: education, projects, skills, experience, and professional identity may have changed.

---

# 2. Why ResuMate Exists

The original product discovery came from the developer's own experience with repeatedly making CVs for different jobs and positions, including using Canva and manually changing documents for different job contexts.

The original problem is not simply “writing a CV is hard.” It is a combination of:

- repetitive manual work,
- lack of technical/design knowledge,
- English-language writing difficulty,
- uncertainty about what belongs in a professional CV,
- uncertainty about section ordering and presentation,
- difficulty adapting the same career history to different jobs,
- difficulty turning raw experience into strong professional wording,
- and the need to preserve multiple useful CV forms instead of constantly overwriting one document.

The developer's original Why/Whom/What/Where/How answers are the primary product-discovery context for this reasoning. fileciteturn7file3L1-L1

The original brainstorming also considered accessibility for users who can describe what they did and what they know but cannot construct polished English CV sentences or professional CV structure themselves. AI suggestions for summaries and work-experience descriptions were explicitly discussed. fileciteturn7file3L1-L1

---

# 3. Product Discovery → Lifecycle Position

The work performed before this research phase should be understood as **Product Discovery / Problem Discovery**, not as final requirements engineering.

The discovery progression was roughly:

```text
Problem / Opportunity
        ↓
Why
Whom
What
Where
How
        ↓
User Personas
        ↓
User Journeys
        ↓
Product Concepts
        ↓
Existing Prototype Review
        ↓
Competitor Study
        ↓
External Research
        ↓
Current Product Foundation
```

The product is now sufficiently understood to move toward formal domain/AI/system design work, but the next stages should still preserve room for new evidence.

---

# 4. Product Principles Established During Discovery

## 4.1 No Learning Curve as a Core Goal

A non-technical user should not need to understand Canva, HTML/CSS, ATS terminology, or professional English writing in order to produce a useful CV.

The interface may become advanced for power users, but the **basic successful path should remain accessible**.

## 4.2 Eliminate Repeated Manual Work

The same career information should not have to be rewritten every time a user changes job targets.

## 4.3 User Controls the Result

AI may generate, improve, structure, and tailor, but important CV changes should remain inspectable and reversible.

## 4.4 AI Is Not a Black Box

ResuMate should help the user learn why a CV is structured or tailored a certain way.

The product should be easy to use without causing “brain rot”; it should gradually teach useful CV knowledge while doing the difficult work.

## 4.5 Preserve Original Work

Original CVs and earlier versions should not be destroyed simply because the AI produced a new version or variation.

## 4.6 Modern, Dynamic UX

The product should not feel like an old static document form. Visual presentation, progressive disclosure, contextual assistance, and modern interaction matter.

## 4.7 Localization Matters

CV conventions differ across regions. The product must not assume one Western resume convention is universal.

---

# 5. User Groups / Personas

## 5.1 Non-Tech / Basic User

This user may:

- have weak English,
- have little or no CV-writing knowledge,
- know what they did but not how to express it professionally,
- know their skills but not how to organize a CV,
- need AI to generate summaries, job descriptions, skill presentations, and structure,
- prefer a guided form or conversational flow.

The system should ask for core facts in manageable chunks rather than requiring one enormous prompt.

## 5.2 Power User / Helper

This user understands CV concepts better and may want extra control such as:

- additional instructions,
- tone preferences,
- emphasis instructions,
- custom content requirements,
- manual editing.

## 5.3 Existing CV Owner / Upgrader

This user already has a CV in PDF, DOCX, image, or text form and wants to:

- use it as-is,
- improve its writing/structure,
- extract its data,
- tailor it to a target role,
- tailor it to an actual job description,
- or create a new version/variation while preserving the original.

## 5.4 Agency / Enterprise — Future

Agency users should eventually be able to manage many clients/users and multiple CV Versions/Variations per client.

Agency is a future operating mode; it is intentionally not the first MVP feature set. The architecture should nevertheless avoid making future multi-user/client management unnecessarily difficult.

The original developer answers explicitly considered agencies as a future use case where many clients can be handled under an agency-oriented setup and each user can have multiple Versions/Variations. fileciteturn7file7

---

# 6. Core Product Domain Concepts

## 6.1 User Profile

For the current MVP, **User Profile** means the private ResuMate account/profile used to operate the product.

It is not a public career profile.

Non-tech users should not be forced to manually create a large “career profile” as a separate bureaucratic step. Existing CV data may later be reused/extracted to populate relevant account-side data.

The earlier term “Career Profile” should **not** be treated as a separate mandatory domain object at this stage.

## 6.2 Career Profile as a Public Object — Not MVP

The earlier idea of a public career profile was reconsidered because exposing a user's private profile/dashboard could create security/privacy problems.

The current direction is:

- private ResuMate User Profile;
- public Live CV only when the user explicitly chooses to publish it;
- public Portfolio as a later product feature.

## 6.3 Version

**Version** is a distinct CV representing a meaningful base career state or career direction.

A new Version may be appropriate when the user's professional identity changes substantially, e.g.:

```text
3D Modeler Career
       ↓
education / skills / projects / experience change
       ↓
Web Developer Career
```

The Web Developer CV is a new Version, not a Variation of the 3D Modeler Version.

Versions are valuable because users may want to preserve their career history and multiple professional directions.

## 6.4 Variation

**Variation** is a derived CV form based on one Version and adapted to a target job context.

The target context can be:

- target/applied position,
- actual hiring post,
- job description,
- requirements,
- company/job context,
- or another user-defined tailoring goal.

One position can produce many Variations because different employers can describe the same role differently.

Example:

```text
Web Developer Version
│
├── Frontend Variation — Company A JD
├── Frontend Variation — Company B JD
└── Frontend Variation — Company C JD
```

Therefore:

> **Position ≠ Variation.**

A Variation represents a tailored state for a particular context, not simply a job-title label.

## 6.5 Active CV Form

The current terminology should be **Active CV Form**, not Active Profile.

The user may choose a Version or Variation as the CV currently being used for job seeking.

This matters for the future job-seeking agent:

```text
All CV Versions / Variations
          ↓
User chooses Active CV Form
          ↓
Job-search context
          ↓
Agent uses the selected professional direction
```

The agent should not need to treat every historical CV as equally relevant to the user's current job search.

The original brainstorming also described an “active variation” concept for future job seeking. fileciteturn7file9

## 6.6 Live CV

A Version or Variation may later be published as a public Live CV, according to user choice.

A Live CV is not the private ResuMate dashboard.

## 6.7 Portfolio — Future

Portfolio is intentionally outside the MVP.

Future concept:

```text
User career information
+
Selected career achievements/projects/education
        ↓
Public Portfolio Website
```

A CV can include a portfolio URL so an employer can view the user's portfolio alongside the CV.

---

# 7. Application / Job Platform Scope Boundary

Application lifecycle and external job platform integration are intentionally **not part of the current CV-focused research foundation**.

The future concept is:

```text
Job
 ↓
Active CV Form
 ↓
Apply
 ↓
Application Record
 ↓
Applied / Viewed / Interview / Rejected / Offer
```

However:

- job platform integration,
- LinkedIn/JobNet APIs,
- ResuMate's own job platform,
- application tracking,
- application status lifecycle,

will be researched later when the product moves into the job-seeking/application phase.

Current priority is **CV creation, improvement, Version/Variation management, quality, tailoring, ATS, and professional output**.

---

# 8. CV Creation Must NOT Be a Fixed Linear Flow

A key correction made during research is that users will not necessarily provide information in a fixed order.

All of the following are valid entry paths:

### A. General-purpose CV

```text
Career facts
→ professional CV
```

No target role, JD, or requirements required.

### B. Target-position CV

```text
Career facts
+
Target / Applied Position
→ position-oriented CV
```

### C. Full job-post input

```text
Career facts
+
Full job post / JD / requirements
→ tailored CV
```

### D. JD-first input

A user may paste the complete hiring post before explicitly stating a target role. The AI should infer the role/context from the supplied job post.

### E. Existing CV — Use As-Is

```text
Existing CV
→ use directly
```

The user should not be forced to enhance or reprocess an existing CV just because it was uploaded.

### F. Existing CV — Enhance

```text
Original CV
→ new improved version
```

### G. Existing CV — Tailor

```text
Original CV
→ copy/branch
→ target/JD-specific Variation
```

The original remains unchanged.

Therefore, `targetRole`, `jobDescription`, and `requirements` should be understood as **optional context inputs**, not mandatory sequential form steps.

---

# 9. CV Content: What the User Provides vs What AI Does

The user's important distinction:

The user can often provide the **facts** even if they cannot write polished English or design a professional CV.

Examples of core factual/unique information include:

- name,
- age,
- address,
- email,
- phone number,
- social/media links,
- education,
- work experience.

Additional user-provided information may include:

- skills,
- languages,
- certifications,
- projects,
- interests,
- target role,
- job context,
- extra instructions.

The exact mandatory-field set should be finalized later during formal requirements work; the above list reflects the current product discussion.

## AI-Generated / AI-Assisted Content

AI should be able to create or improve:

- About / profile summary,
- professional summary,
- work-experience descriptions,
- experience bullets,
- skill presentation/prioritization,
- section organization,
- wording,
- job-specific emphasis,
- role-specific summaries,
- JD-specific tailoring,
- ATS improvements,
- structure/design recommendations.

### Critical Truth Boundary

The AI **may transform, synthesize, organize, clarify, and professionally express** facts the user supplied.

The AI must **not invent unsupported career facts** such as:

- fake employers,
- fake responsibilities,
- fake certifications,
- fake technologies,
- fake management experience,
- fake metrics,
- fake revenue increases,
- fake team sizes,
- fake achievements.

However, lack of a prewritten English sentence must **not** prevent the AI from generating professional wording.

Example:

```text
User facts:
Waiter — Uptown Hotel
Customer service
Menu recommendations
Order handling
Teamwork

AI:
Professional summary
Experience bullets
Skills presentation
```

The AI may also ask follow-up questions when a better factual achievement could be obtained, e.g. asking about volume, scale, frequency, tools, or measurable outcomes.

---

# 10. CV Quality Definition

A strong ResuMate CV should balance:

```text
Truthfulness
+
Professional writing
+
Specificity
+
Relevance
+
Readability
+
Information hierarchy
+
ATS compatibility
+
Visual quality
```

Harvard's resume guidance emphasizes specific, active, fact-based language; concise organization; readability; consistency; clear headings; reverse-chronological ordering; and tailoring to the type of position being pursued. It also warns against generic language, passive phrasing, poor organization, and missing results. citeturn501346search2

This research supports treating CV quality as multidimensional rather than as a single score.

---

# 11. Base CV Quality

A CV without a target job can still be improved substantially.

### General CV enhancement

```text
Career Data / Existing CV
        ↓
Content quality
Structure quality
Writing quality
Consistency
Readability
ATS compatibility
        ↓
Professional Base CV
```

Without a target role or JD, ResuMate can judge:

> **“Is this a good professional CV?”**

But it should not pretend to know:

> **“Is this CV a 92% match for a specific job?”**

when no target/job context exists.

This establishes two separate concepts:

### General CV Quality

How good is the CV itself?

### Job Match / Tailoring Quality

How appropriate is this CV for this particular role/job?

---

# 12. CV Structure / Information Architecture

CV section order should not be treated as one universal fixed template.

The system should understand that section prominence can depend on:

- career stage,
- industry,
- experience depth,
- target role,
- education relevance,
- project relevance,
- regional convention,
- template.

Typical sections may include:

- contact information,
- professional identity/title,
- About / Summary,
- work experience,
- education,
- skills,
- certifications,
- languages,
- projects,
- portfolio links,
- other context-specific sections.

The AI should determine what should be emphasized, reduced, reordered, or omitted based on available context.

---

# 13. CV Design / Templates

A major product decision clarified during research:

> **Content and presentation are separate concerns.**

A Version/Variation can be rendered using different templates without changing the underlying content.

```text
Same CV Content
│
├── Minimal Template
├── Modern Template
├── Corporate Template
├── Creative Template
├── Photo Template
├── No-photo Template
└── Localized Template
```

The template may change:

- section positioning,
- columns/layout,
- typography,
- spacing,
- color accents,
- photo/no-photo treatment,
- visual hierarchy,
- section placement.

The content source itself should remain intact.

Canva's current resume template ecosystem illustrates the wide range of user expectations around minimalist, modern, professional, corporate, creative, photo-based, and other resume styles. Canva also supports template-based layout/styling customization. urlCanva resume templateshttps://www.canva.com/resumes/templates/ urlCanva resume creation guidancehttps://www.canva.com/create/resumes/

Canva and Pinterest are useful **visual references**, not sources to copy blindly.

---

# 14. Visual Design Is Functional, Not Merely Decorative

The product goal is not simply “make the CV pretty.”

A reviewer should be able to understand quickly:

- who the person is,
- what role they fit,
- their strongest relevant experience,
- their important skills,
- and where the evidence is.

Poorly packed pages can create a cognitive burden; excessive visual decoration can harm clarity or machine parsing.

The design goal is:

> **Modern + dynamic + visually pleasing + easy to scan + appropriate to context.**

This is consistent with Harvard's emphasis on readability, skimmability, whitespace, consistent formatting, and concise organization. citeturn501346search2

---

# 15. ATS Research Results

## 15.1 ATS Is Not One Universal Score

Commercial products may display resume scores, but real ATS systems do not expose a universal “87/100” grade applicable to every employer.

Rezi's current documentation explains its score as a diagnostic system rather than an actual ATS score shown by recruiters. The useful concept is to identify weaknesses and improvement opportunities rather than chase an abstract number. urlRezi score explanationhttps://www.rezi.ai/rezi-docs/the-rezi-score-explained

Therefore ResuMate should prefer:

```text
ATS / Resume Diagnostic
├── Parseability
├── Section detection
├── Contact detection
├── Date consistency
├── Keyword/relevance
├── Skills alignment
├── Formatting risk
├── Content quality
└── Improvement suggestions
```

rather than making an absolute “ATS pass” promise.

## 15.2 ATS and Human Readability Both Matter

A resume can be technically machine-readable but difficult for a recruiter to read, or visually attractive but poorly parsed.

ResuMate should optimize for both:

```text
Machine-readable
+
Human-readable
+
Relevant
```

## 15.3 Parsing Constraints

Workday's official resume-parsing documentation explains that resume formatting and word order can affect parsing and provides guidance around clear sections, separating jobs, dates, and avoiding structures that make extraction unreliable. urlWorkday Resume REST API documentationhttps://developer.workday.com/documentation/GUID-f07adb7f-630e-42a2-9de9-a39652e34ec5-enHYPHENus/ResumeRESTAPI

This does **not** mean ResuMate must offer only boring templates.

Instead, every template can have an internal compatibility/risk profile.

Example:

```text
Template A — ATS-oriented
Risk: Low

Template B — Balanced
Risk: Medium/Low

Template C — Highly visual
Risk: Medium/High
```

The user can still choose visually rich templates, especially where industry/region makes them appropriate.

---

# 16. Localization

Localization is a first-class product consideration.

The product should not assume that Western resume conventions apply everywhere.

Examples discussed:

- Myanmar / Thailand and some regional contexts may include profile image, age, national/identity or passport-related information depending on local expectations and job context.
- Western contexts commonly omit such personal information.

Harvard's guidance is explicitly U.S.-oriented and advises against items such as pictures and age for that context; it is not a universal worldwide rule. citeturn501346search2

Therefore ResuMate should eventually consider:

```text
Region
+
Industry
+
Target role
+
Employer/job context
+
Template
+
User preference
```

when deciding whether fields such as:

- photo,
- age,
- nationality,
- national ID/passport information,
- address detail,

should be shown.

These should not become careless global hard-coded rules.

Localization should eventually cover both **content conventions** and **visual/template conventions**.

---

# 17. JD / Target Role Research

## 17.1 Target Role Is Optional

A user may have:

- no role,
- a general target role,
- an applied position,
- a full JD,
- a JD plus requirements,
- or only a pasted job post from which the role can be inferred.

The product should support all of these.

## 17.2 JD Tailoring Is Not Keyword Stuffing

The correct model is:

```text
User Career Evidence
+
Target Job Context
        ↓
Understand relevance
        ↓
Prioritize evidence
        ↓
Rewrite / reorder / select
        ↓
Tailored Variation
```

Teal's current tailoring workflow provides strong evidence for this model: build a comprehensive foundation, save the job description, analyze match, activate relevant experience, address legitimate gaps, reorder for impact, review, and export. Teal explicitly warns that a lower real match is better than a fake high match and that missing keywords do not justify pretending to possess a skill. citeturn501346search0

## 17.3 Missing Keyword ≠ Missing Skill

A job may use terminology that the user's existing CV does not currently use even though the user's experience supports the underlying capability.

Therefore ResuMate should distinguish:

```text
Requirement
│
├── User has evidence + wording already present
├── User has evidence but CV does not show it
└── User lacks evidence
```

Only the first two are legitimate optimization targets.

The third should not be fabricated.

## 17.4 One Position Can Produce Many Variations

A job title such as “Frontend Developer” is not sufficient to identify one universal CV because each employer may specify different frameworks, responsibilities, seniority, business domains, and preferred skills.

This is one of the central reasons Version → Variation exists.

---

# 18. Existing CV → AI Enhancement

Existing CV upload is a major entry point, not a secondary convenience.

Potential inputs:

- PDF,
- DOCX,
- image/scanned document,
- pasted text.

Industry evidence supports extraction workflows from uploaded resumes. Workday documents structured extraction from resume files; Teal supports existing-resume import; HelloCV positions its product around AI-powered resume/profile creation and uploaded existing CVs. urlWorkday Resume APIhttps://developer.workday.com/documentation/GUID-f07adb7f-630e-42a2-9de9-a39652e34ec5-enHYPHENus/ResumeRESTAPI citeturn501346search1

## User Choice After Upload

The product should not force one behavior.

### Use as-is

```text
Original CV
→ active/use directly
```

### Enhance

```text
Original CV
→ improve structure/content/ATS/design
→ new Version or improved copy
```

### Tailor

```text
Original CV
→ preserve original
→ branch/copy
→ target role/JD
→ Variation
```

This is consistent with the user's current product intention.

## Preserve the Original

An AI operation should not destroy the original uploaded CV simply because the user asked for improvement.

Branching provides:

- reversibility,
- auditability,
- comparison,
- user trust,
- safer experimentation.

---

# 19. Version → Variation: Current Product Rule Set

This is a critical section and should be preserved across future context transfers.

## Version

A meaningful base/career-state CV.

Examples:

```text
3D Career Version
Web Development Version
Hospitality Version
```

## Variation

A branch from one Version adapted for a specific target/context.

Examples:

```text
Web Development Version
├── Frontend Variation
├── Backend Variation
└── Fullstack Variation
```

or more specifically:

```text
Web Development Version
├── Frontend — Company A JD
├── Frontend — Company B JD
└── Frontend — Company C JD
```

## Original Preservation

```text
Original Version
   │
   ├── Variation A
   ├── Variation B
   └── Variation C
```

A Variation should not overwrite the parent Version.

## Template Independence

```text
Variation
   │
   ├── Template A
   ├── Template B
   └── Template C
```

Changing a template should not inherently change the underlying content.

---

# 20. Storage / Subscription Model

The system may eventually have:

- Free,
- Pro,
- Enterprise/Agency

tiers with different limits for storage and number of Versions/Variations.

However, the **technical capability** to branch Versions/Variations should not be hard-coded around a particular pricing number.

Separate:

```text
Product capability
≠
Subscription entitlement
```

Exact numerical limits are future business-policy decisions.

---

# 21. Competitor Research

## 21.1 Teal

Teal is one of the most important competitive references because its current workflow explicitly uses a comprehensive source resume/content library and creates job-specific tailored resumes from it. Teal also has resume syncing, job matching, relevant-bullet toggling, reordering, and a visual resume designer. citeturn501346search1turn501346search0turn501346search6

Important lessons for ResuMate:

- build a strong reusable foundation;
- do not rewrite everything from zero for each job;
- job context should drive relevance;
- relevant content can be selected/reordered;
- multiple resumes can share content;
- visual design is a distinct concern.

Important differentiation:

ResuMate's explicitly intended **Version → Variation career-state branching** should not be erased simply to copy Teal's master-resume model.

## 21.2 HelloCV

The user's `hellocv-feature-analysis` repository is a hands-on, screenshot-backed teardown. It documents AI profile creation, CV upload, AI/manual/advanced editing, My Agent, AI tools, Job Finder, Cover Letters, MCP, browser autofill, domains, pricing, and other features.

HelloCV is useful as a feature/UX reference, but it is **not ResuMate's source of truth**.

The most important differentiation identified during research is that HelloCV does not provide ResuMate's intended Version → Variation branching model in the same conceptual way.

The existing handoff explicitly records that distinction. fileciteturn7file5

---

# 22. Existing ResuMate Prototype Findings

The prototype has already implemented substantial CV functionality.

Current technical stack from `PROJECT-ANALYSIS.md` includes:

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Intent UI / React Aria
- Supabase Auth/Postgres/Storage/RLS
- multi-provider AI
- PDF parsing + OCR fallback
- DOCX parsing
- multiple templates
- resume analysis
- AI fixes
- upload and AI interview flows
- fork-based versioning
- PDF export.

The technical audit documents these capabilities in detail. fileciteturn7file8turn7file10

## Prototype's Important Existing Flows

### Upload & Analyze

Upload → extraction → AI analysis → edit/analyze → apply fixes → export.

### AI Interview

Conversational collection → generation → edit/analyze → export.

### Job Description Generation

Existing prototype can generate from job descriptions, though the current behavior must be re-evaluated against the stronger product model established in this research.

### Versioning

The prototype has fork-on-edit/version grouping, but the audit explicitly notes that the more complete Version → Variation branching model is **not yet implemented** in the current schema. fileciteturn7file9turn7file14

---

# 23. Existing Prototype Technical Risks Relevant to Future Build

These are not product decisions; they are technical audit findings to remember for later.

Critical issues documented in the audit include:

1. Live API keys committed to `.env.local`.
2. Missing `proxy.ts`/edge route-protection layer as expected by the current architecture.
3. Excessive type casting between Supabase types and app types.
4. AI prompts duplicated instead of consistently centralized.
5. Lack of AI rate limiting.
6. `dangerouslySetInnerHTML` risk in resume rendering.
7. Fragile client-side PDF export behavior around Tailwind v4 color handling.

The audit strongly recommends rotating exposed keys if the repository was ever exposed publicly. fileciteturn7file5turn7file13turn7file14

These issues should not be allowed to silently disappear when rebuilding.

---

# 24. Current AI Layer in Prototype

The prototype already has a multi-provider AI abstraction with functions for text generation, structured JSON generation, chat JSON, text analysis, and prompt-driven generation. The provider cascade and task-specific configuration are documented in `PROJECT-ANALYSIS.md`. fileciteturn7file13

The prototype also has a centralized prompt library, although the audit notes that several prompts are duplicated/inline elsewhere. fileciteturn7file13

The future architecture should build on the *concept* of task-specific AI services, but not assume the current implementation is the final architecture.

---

# 25. AI Architecture Implications Already Discovered

Although the formal AI Architecture phase has not begun, Phase 2 research already establishes several requirements:

## 25.1 AI should understand context, not merely prompt text

Inputs may include any subset of:

- career facts,
- existing CV,
- target role,
- job description,
- requirements,
- user instructions,
- template preferences,
- region/localization context.

## 25.2 Structured outputs are preferable

For tasks such as:

- extraction,
- CV analysis,
- section recommendations,
- JD analysis,
- match diagnostics,
- change proposals,

the system should prefer structured intermediate results rather than relying entirely on free-form text.

## 25.3 AI must distinguish fact from generated language

This distinction must be preserved throughout extraction, enhancement, tailoring, and rendering.

## 25.4 AI should support reviewable transformations

Instead of silently overwriting data:

```text
Input
 ↓
Proposal
 ↓
Preview
 ↓
User decision
 ↓
Persist
```

## 25.5 AI enhancer should be reusable

The original handoff identified the AI Enhancer/ATS engine as a standalone module callable from different entry points and existing Versions/Variations rather than being tied to only one creation flow. fileciteturn7file9

This remains a strong architectural direction, subject to later validation.

---

# 26. Agentic Coding Methodology Context

The supplied `agentic-coding-book.pdf` is a methodology reference, not a ResuMate product requirements document.

Its chapter structure covers:

- Coding Agents
- Harness System
- Context Engineering
- Full-Stack Skills
- SPEC & Dev Subagents
- Event Management Project
- Test-Verify-Audit
- MCP
- Deployment. fileciteturn7file0turn7file2

Its core idea relevant to ResuMate is that Agentic Coding is not merely asking AI to write code. The human still needs to define what to build, evaluate correctness, guide the agent when it drifts, provide the correct environment/context, control architecture, UX, security, maintenance, and quality.

This directly matches the reason ResuMate must have a persistent source of truth and a controlled specification workflow rather than relying on conversational memory.

---

# 27. Gemini Context Failure — Permanent Lesson

The previous Gemini session experienced a context failure during a model switch.

Instead of admitting context loss, it hallucinated a plausible but incorrect architecture/stack and lost key ResuMate concepts.

The documented lesson is:

> **Project truth must live in persistent artifacts, not chat memory.**

The existing handoff explicitly records the corrupted React/Express/MongoDB hallucination and the loss of Version/Variation architecture. fileciteturn7file1

This research document exists partly to prevent the same failure from happening again.

---

# 28. Research Methodology Used

This project research was intentionally broader than generic “resume advice.”

Research sources/context included:

1. Developer's original Why/Whom/What/Where/How brainstorming.
2. The historical Gemini conversation as context/history — **not authoritative where it conflicts with explicit decisions or contains hallucinated material**.
3. The ResuMate technical prototype audit.
4. The session handoff.
5. Hands-on HelloCV feature analysis repository.
6. External resume/CV guidance from Harvard.
7. ATS/parser-oriented technical documentation such as Workday.
8. Competitor/product workflows such as Teal and Rezi.
9. Resume visual/template references such as Canva.
10. User's own concrete CV example and product-use scenarios.

The aim was to compare:

```text
User intent
+
Actual prototype
+
Competitor behavior
+
Established professional guidance
+
Real ATS/parser constraints
+
Future scalability needs
```

rather than letting any one source dictate the product.

---

# 29. Current Product Thesis After Research

The strongest current synthesis is:

> **ResuMate is an AI-first CV production and career-document platform that transforms a user's real career information into professional, structured, readable, localized, and ATS-aware CVs; preserves meaningful career states as Versions; creates job-specific Variations from those Versions; and lets the user control, review, preserve, and reuse every meaningful output.**

Or more simply:

> **User knows their career. ResuMate knows how to turn that career into a professional CV.**

And for job targeting:

> **One Version can produce many Variations because every hiring post is a different context.**

---

# 30. Current Conceptual Model

```text
                              USER
                               │
                        Private User Profile
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
          New Career Data              Existing CV
                 │                  PDF / DOCX / Image / Text
                 └─────────────┬─────────────┘
                               ↓
                        CV UNDERSTANDING
                               │
                 ┌─────────────┴─────────────┐
                 ↓                           ↓
             CAREER FACTS               OPTIONAL CONTEXT
                                             │
                               ┌─────────────┼────────────┐
                               ↓             ↓            ↓
                         Target Role       JD       Requirements
                               │             │            │
                               └─────────────┼────────────┘
                                             ↓
                                       CV STRATEGY
                                             │
                              ┌──────────────┴──────────────┐
                              ↓                             ↓
                         BASE / VERSION              TAILORED
                              │                       VARIATION
                              └──────────────┬──────────────┘
                                             ↓
                                      QUALITY ENGINE
                               ┌─────────────┼─────────────┐
                               ↓             ↓             ↓
                           Content       Structure       ATS
                               │             │             │
                               └─────────────┼─────────────┘
                                             ↓
                                         USER REVIEW
                                             ↓
                                      TEMPLATE LAYER
                                             ↓
                                     FINAL CV OUTPUT
                                             │
                              ┌──────────────┴─────────────┐
                              ↓                            ↓
                         Active CV                 Optional Public Live CV
                                                           │
                                                           ↓
                                                 Future Portfolio
```

This is a research-derived conceptual model, **not yet a final system architecture**.

---

# 31. What Is in MVP vs Future — Current Direction

## Strong MVP priority

- User account/profile (private).
- CV creation via form.
- CV creation via AI/chat flow.
- Existing CV upload/import.
- Use uploaded CV as-is.
- Improve uploaded CV.
- Professional AI content generation.
- Base/general CV enhancement.
- ATS/quality diagnostics.
- Target-role-aware enhancement.
- JD/requirements-aware tailoring foundation.
- Version management.
- Variation management.
- Original preservation/branching.
- Template switching.
- Localized/template-specific CV presentation.
- PDF output.
- User review/edit/control.

## Future / later phases

- Full job search engine.
- LinkedIn/JobNet/other external job APIs.
- Application tracking/lifecycle.
- AI job-seeking agent with live external job search/application.
- Public portfolio website.
- Advanced public career profile concepts.
- Agency/enterprise multi-client workspace.
- Bulk agency workflows.
- MCP / external agent integrations if justified.
- Advanced application autofill.
- Subscription/entitlement limits and monetization refinement.

MVP scope can change after requirements analysis; the above is the current directional boundary, not a frozen specification.

---

# 32. Important Things We Deliberately Do NOT Assume Yet

These remain open for later domain/system research:

1. Exact database entity boundaries.
2. Exact source-of-truth representation for all CV content layers.
3. Whether each Version stores full content, references shared records, or uses a hybrid model.
4. Whether a Variation is stored as a full snapshot, a delta, or a hybrid snapshot + provenance structure.
5. Exact target-context object structure.
6. Exact ATS scoring formula.
7. Exact template compatibility metadata.
8. Exact localization rule engine.
9. Exact AI orchestration architecture.
10. Exact agent memory/context architecture.
11. Exact storage/entitlement limits.
12. Exact agency tenancy model.
13. Exact public Live CV permission model.
14. Exact portfolio data model.
15. Exact job-platform/application architecture.

These must be researched and decided later rather than guessed.

---

# 33. What the Research Has Already Changed / Clarified

Several assumptions were corrected during the research discussion:

### Correction 1 — Career Profile

A separate public “Career Profile” is not required for MVP. Keep a private User Profile now; Portfolio is a later public feature.

### Correction 2 — Active Profile

Use **Active CV Form** as the current job-seeking concept.

### Correction 3 — Application Lifecycle

Do not design full application lifecycle now. The user explicitly wants job-platform/application research later. CV remains the current priority.

### Correction 4 — Fixed Input Sequence

Target role, JD, requirements, and existing CV are optional context and may arrive in any order.

### Correction 5 — AI Writing

AI must write professional English even when the user cannot. Lack of a pre-written sentence is not a reason to refuse generation.

### Correction 6 — AI Truth Boundary

AI may transform existing facts but must not invent unsupported career claims.

### Correction 7 — Template vs Content

Template changes presentation; Version/Variation changes the content state/context. They should be separate concerns.

### Correction 8 — Localization

Photo/age/ID/passport rules are regional/contextual rather than universal Western rules.

### Correction 9 — Existing CV

Uploading an existing CV does not mean the user must enhance it. They may use it as-is, enhance it, or branch it into a Variation.

### Correction 10 — Version/Variation

Version/Variation is not a cosmetic feature or simple document versioning. It represents the user's need to preserve distinct career directions and job-specific adaptations.

---

# 34. External Research References

## Harvard — Resume Quality / Tailoring / AI

- Harvard College Guide to Creating a Strong Resume:
  https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/
- Harvard resume/CV guidance:
  https://careerservices.fas.harvard.edu/channels/create-a-resume-cv-or-cover-letter/

Harvard's guidance supports specific, active, fact-based language; concise organization; readability; consistency; tailoring to the type of role; and careful formatting. citeturn501346search2turn501346search4

## Teal — Master Resume / Tailoring / Match / Design

- Build your Resume in Teal:
  https://help.tealhq.com/en/articles/14435724-how-to-build-your-resume-in-teal
- Tailor Resume for a Specific Job:
  https://help.tealhq.com/en/articles/14435726-how-to-tailor-your-resume-for-a-specific-job
- Resume Designer:
  https://help.tealhq.com/en/articles/9508951-getting-started-resume-designer
- Presentation Tab:
  https://help.tealhq.com/en/articles/9510029-presentation-tab
- Resume Builder collection:
  https://help.tealhq.com/en/collections/9568976-resume-builder

Teal is especially important for the reusable-foundation → tailored-resume pattern and for the concept that relevant content can be selected, reordered, and reused rather than rewritten from scratch. citeturn501346search0turn501346search1turn501346search6turn501346search9

## Workday — Resume Parsing

- Workday Resume REST API:
  https://developer.workday.com/documentation/GUID-f07adb7f-630e-42a2-9de9-a39652e34ec5-enHYPHENus/ResumeRESTAPI

This is useful for understanding real machine-parsing constraints and why format, hierarchy, and extraction-friendly structure matter.

## Rezi — Resume/ATS Diagnostics

- Rezi Score explanation:
  https://www.rezi.ai/rezi-docs/the-rezi-score-explained
- Rezi AI tailoring discussion:
  https://www.rezi.ai/posts/ai-to-tailor-a-resume
- Rezi keyword/tailoring discussion:
  https://www.rezi.ai/posts/keywords-match-in-resume-doesnt-work-anymore

Rezi is useful as a reference for ATS/readiness diagnostics, job-context tailoring, and AI-assisted resume content improvement.

## Canva — Visual Resume References

- Resume template library:
  https://www.canva.com/resumes/templates/
- Resume creation:
  https://www.canva.com/create/resumes/

Canva is a **visual/design reference**, not ResuMate's product model. It is useful for studying modern template families, hierarchy, visual presentation, and template variety.

## HelloCV

- Main site:
  https://hello.cv/
- Autofill / job application workflow:
  https://hello.cv/autofill

In addition, the user's own hands-on repository is a primary competitor-study reference:

- https://github.com/hlahtunthein09/hellocv-feature-analysis

The repository was created specifically as a feature/UX teardown with hands-on verification and screenshots, and should be preferred over assumptions about what HelloCV does.

## GOV.UK Design System

The research discussion also used GOV.UK form/question-page patterns as UX references for chunked questions, reducing repetition, and review/check-answer patterns:

- https://design-system.service.gov.uk/patterns/question-pages/
- https://design-system.service.gov.uk/patterns/check-answers/

These are general UX references, not ResuMate-specific requirements.

---

# 35. Internal / Supplied Project References

## Primary Product Discovery

- `developer's answers.pdf`

This contains the developer's original Why/Whom/What/Where/How thinking, personas, use cases, AI suggestions, agency thinking, and product intent. Relevant excerpts confirm that AI suggestions for summaries and work-experience descriptions were part of the original concept. fileciteturn7file3turn7file4

## Existing Technical Audit

- `PROJECT-ANALYSIS.md`

This documents the actual prototype, technical stack, routes, data/actions, AI layer, extraction, rendering, testing, versioning, and security concerns. fileciteturn7file10turn7file8

## Session Context Transfer

- `RESUMATE-SESSION-HANDOFF.md`

This was explicitly created to transfer context after the corrupted Gemini session. It records core philosophy, Version/Variation, personas, prototype findings, HelloCV reference, and agentic-development next steps. fileciteturn7file1turn7file6

## Historical Gemini Conversation

- `chat with gemini.pdf`

Use this as historical context and idea trace only. It contains the earlier discussion and the corrupted/hallucinated section. It is **not** authoritative when it conflicts with explicit project decisions or the actual prototype.

## Agentic Coding Methodology

- `agentic-coding-book.pdf`

Use this to shape the development lifecycle, context management, specifications, subagents, testing, verification, audit, MCP, and deployment process. The book's chapter structure explicitly covers Harness Systems, Context Engineering, SPEC & Dev Subagents, Test-Verify-Audit, MCP, and Deployment. fileciteturn7file0turn7file16

## System Design Reference

- https://github.com/ByteByteGoHq/system-design-101

Use this as a general system-design reference. It is not ResuMate's specification.

---

# 36. Research Is a Living Layer

This research is intentionally **not declared “finished forever.”**

The current foundation is strong enough to proceed toward formal product/domain/system design, but future research should continue when:

- a new competitor introduces a meaningful pattern,
- an ATS/parser behavior changes,
- AI models or structured-output capabilities change,
- new localization requirements are discovered,
- users behave differently than expected,
- legal/privacy/security requirements change,
- a new job-platform API becomes strategically relevant,
- a new template/rendering technology becomes useful,
- the implementation reveals a domain problem not visible during product research.

Therefore:

> **Research is a continuous feedback loop, not a one-time phase that is permanently closed.**

---

# 37. Recommended Next Lifecycle Direction

The current research is sufficiently mature to stop expanding Phase 2 indefinitely.

The recommended sequence is now:

```text
PRODUCT DISCOVERY
       ↓
CV / PRODUCT RESEARCH  ← current research foundation
       ↓
DOMAIN MODEL CROSS-CHECK
       ↓
AI ARCHITECTURE RESEARCH
       ↓
AGENTIC SDLC / SPEC-DRIVEN DEVELOPMENT
       ↓
SYSTEM DESIGN
       ↓
PROJECT_SPEC.md
       ↓
IMPLEMENTATION PLAN
       ↓
AGENT / SUBAGENT BUILD
       ↓
TEST → VERIFY → AUDIT
       ↓
DEPLOYMENT
```

The order is deliberate.

Do not jump directly from “we know the features” to database/API coding.

---

# 38. Agentic Development Principles for ResuMate

The project should eventually use a persistent specification and controlled agent workflow.

Key principles:

- project truth lives in persistent files,
- requirements and domain concepts are explicit,
- agents work against the specification rather than memory,
- implementation should be reviewed independently,
- tests and verification are first-class,
- architecture should be auditable,
- security should be verified independently,
- changes should be reversible when possible,
- feature branches and controlled merges should be used,
- a SPEC Maintainer mechanism should keep the specification synchronized with reality.

The supplied Agentic Coding book specifically emphasizes context engineering, SPEC/subagents, and Test-Verify-Audit as parts of modern agentic software development. fileciteturn7file0turn7file16

---

# 39. Critical “Do Not Forget” List

These are the most important concepts to preserve in any future context transfer.

1. **ResuMate is not just a CV generator.**
2. **The user should not need to know professional CV English or design.**
3. **User career facts are the basis for AI-generated professional wording.**
4. **AI may write; AI may not invent unsupported career facts.**
5. **General CV and job-specific CV are different quality problems.**
6. **Target role/JD/requirements are optional context, and can arrive in any order.**
7. **Existing CV can be used as-is.**
8. **Existing CV can be improved without destroying the original.**
9. **Existing CV can branch into Variations.**
10. **Version ≠ Variation.**
11. **A career change can justify a new Version.**
12. **A job-specific adaptation belongs under a Version as a Variation.**
13. **One position can have many Variations because job posts differ by employer.**
14. **Active CV Form is the current job-seeking identity, not a public profile.**
15. **User Profile is private for MVP.**
16. **Public Portfolio is future.**
17. **Live CV is publishable by explicit user choice.**
18. **Application lifecycle/job-platform APIs are later scope.**
19. **Templates and content are separate layers.**
20. **Template choice may include photo/no-photo, creative/ATS-oriented, and regional variants.**
21. **Localization is not optional long-term.**
22. **ATS is a diagnostic/relevance/parseability concern, not a universal magical score.**
23. **Human readability and ATS compatibility must both matter.**
24. **Original data/version should be preserved when AI creates a new branch.**
25. **Future agency support is important, but not the current MVP focus.**
26. **Storage/subscription limits are business entitlements, not core domain constraints.**
27. **Research remains continuous.**
28. **Never repeat the Gemini context-loss failure by relying on chat memory alone.**

---

# 40. One-Sentence Handoff

> **ResuMate is building a user-controlled, AI-first CV system where people provide their real career facts—or upload an existing CV—and ResuMate turns that information into professional, structured, ATS-aware CVs; preserves meaningful career directions as Versions; creates job/context-specific Variations without destroying originals; supports multiple input paths and localized templates; and is designed from the beginning to scale later into job seeking, portfolio, and agency workflows.**

---

# 41. Current Handoff Instruction for the Next Chat

When this file is uploaded into a new chat, the next AI should treat the above as the current working context and continue from the **Domain Model Cross-Check → AI Architecture** stage unless the user explicitly changes direction.

The next AI should **not**:

- ask the user to explain ResuMate from the beginning,
- replace Version/Variation with a generic “master resume” concept,
- force target role/JD/requirements into a fixed sequence,
- assume existing CV upload must always trigger enhancement,
- turn User Profile into a public career profile for MVP,
- design application tracking before the user asks for the job-platform phase,
- treat Western resume conventions as global rules,
- assume ATS means a universal numerical score,
- or silently accept old Gemini-generated architecture as truth.

The next AI **should**:

- preserve the current product decisions,
- verify any newly changing external information through fresh research,
- distinguish evidence from inference,
- keep unresolved decisions explicitly unresolved,
- and continue the lifecycle from the current stage rather than restarting discovery.

---

# Appendix A — Current Research Sources Snapshot

| Source | Role in ResuMate research |
|---|---|
| Developer's answers.pdf | Primary product intent / discovery evidence |
| PROJECT-ANALYSIS.md | Existing prototype reality / technical audit |
| RESUMATE-SESSION-HANDOFF.md | Context transfer / prior project decisions |
| chat with gemini.pdf | Historical brainstorming; corrupted section is not authoritative |
| agentic-coding-book.pdf | Agentic SDLC / SPEC / subagent methodology |
| HelloCV feature-analysis repo | Hands-on competitor feature/UX reference |
| Teal | Master-content, tailoring, match, design, resume syncing reference |
| Harvard Career Services | Professional resume quality, language, structure, tailoring reference |
| Workday Resume API docs | Real resume parsing/ATS-oriented technical reference |
| Rezi | ATS/quality diagnostics and AI tailoring reference |
| Canva | Visual/template/design reference |
| GOV.UK Design System | Form/question/check-answer UX reference |
| ByteByteGo system-design-101 | General system-design reference |

---

# Appendix B — URLs

- https://github.com/hlahtunthein09/hellocv-feature-analysis
- https://github.com/ByteByteGoHq/system-design-101
- https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/
- https://careerservices.fas.harvard.edu/channels/create-a-resume-cv-or-cover-letter/
- https://help.tealhq.com/en/articles/14435724-how-to-build-your-resume-in-teal
- https://help.tealhq.com/en/articles/14435726-how-to-tailor-your-resume-for-a-specific-job
- https://help.tealhq.com/en/articles/9508951-getting-started-resume-designer
- https://help.tealhq.com/en/articles/9510029-presentation-tab
- https://developer.workday.com/documentation/GUID-f07adb7f-630e-42a2-9de9-a39652e34ec5-enHYPHENus/ResumeRESTAPI
- https://www.rezi.ai/rezi-docs/the-rezi-score-explained
- https://www.rezi.ai/posts/ai-to-tailor-a-resume
- https://hello.cv/
- https://hello.cv/autofill
- https://www.canva.com/resumes/templates/
- https://www.canva.com/create/resumes/
- https://design-system.service.gov.uk/patterns/question-pages/
- https://design-system.service.gov.uk/patterns/check-answers/
- https://github.com/github/spec-kit

---

# End of ResuMate Research Foundation
