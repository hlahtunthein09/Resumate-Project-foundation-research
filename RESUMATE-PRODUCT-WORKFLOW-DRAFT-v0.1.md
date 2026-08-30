# ResuMate Product Workflow & User Actions — Draft v0.1

> **Purpose:** High-level product workflow for senior review before moving deeper into system/AI architecture.
>
> **Scope:** User-facing workflow and Resume lifecycle only. Technical architecture, database design, services, APIs, and implementation details are intentionally excluded from this draft.

---

## 1. Core Product Idea

ResuMate helps a user create, import, improve, tailor, manage, preview, and export Resume versions while keeping the user in control of factual career information and AI-generated changes.

The user can:

- Create a new Resume from scratch.
- Create a Resume with AI/chat assistance.
- Upload an existing Resume.
- Use an uploaded Resume as-is.
- Extract and rebuild an uploaded Resume into structured ResuMate content.
- Review and correct extracted content before saving.
- Save a Resume as a persistent **Version**.
- Directly edit a saved Resume.
- Create a copy and edit it as a **Variation**.
- Enhance a Resume with AI.
- Analyze Resume quality / ATS-related issues.
- Tailor a Resume for a target role, applied position, job description, or requirements.
- Change Template without creating a new Version or Variation.
- Preview and export the final Resume.
- Share a Resume where supported.
- Set one saved Resume as **Active CV**.
- Duplicate a Version as a new independent root Resume.
- Delete a Resume with confirmation.

---

# 2. Diagram 1 — High-Level Product / User Journey

```mermaid
flowchart TD
    A[User] --> B[Login / Sign Up]
    B --> C[Resume Home / Dashboard]
    C --> D{What does the user want to do?}

    D --> E[Create New Resume]
    D --> F[Upload Existing Resume]
    D --> G[Open Saved Resume]

    E --> E1{Creation Method}
    E1 --> E2[Form Input]
    E1 --> E3[AI / Chat Assisted Creation]
    E2 --> W[Temporary Working State]
    E3 --> W

    F --> F1[Upload PDF / DOCX / Image]
    F1 --> F2{Import Path}
    F2 --> F3[Use As-Is]
    F2 --> F4[Extract / Rebuild]
    F4 --> F5[AI / Parser Extraction]
    F5 --> F6[User Reviews & Corrects Extracted Data]
    F6 --> W
    F3 --> W

    W --> H[Review / Edit Resume Content]
    H --> I[Select Template / Localization]
    I --> J[Preview]
    J --> K{Save?}
    K -->|Yes| L[Save as Version]
    K -->|Continue Editing| H

    L --> M[Saved Resume]
    G --> M

    M --> N{User Action}
    N --> N1[Direct Edit]
    N --> N2[Create Copy & Edit]
    N --> N3[AI Enhance]
    N --> N4[ATS / Resume Analysis]
    N --> N5[Tailor to Job]
    N --> N6[Change Template]
    N --> N7[Preview / Export]
    N --> N8[Share]
    N --> N9[Set as Active CV]
    N --> N10[Duplicate Version]
    N --> N11[Delete]

    N1 --> O[Update Current Resume]
    N2 --> P[Temporary Working State]
    P --> Q[Save as Variation]

    N3 --> R[AI Suggestions]
    R --> S[User Reviews / Accepts / Edits / Rejects]
    S --> T{Save Result}
    T -->|Update Current| O
    T -->|Save as New Variation| Q

    N4 --> U[Diagnostics / Recommendations]
    U --> S
    N5 --> V[Job Tailoring Flow]

    N6 --> M
    N7 --> X[PDF / Other Supported Export]
    N8 --> Y[Share Resume]
    N9 --> Z[Active CV Selection]
    N10 --> AA[New Independent Version]
    N11 --> AB[Delete Confirmation]
    AB -->|Confirm| AC[Delete Resume]
    AB -->|Cancel| M
```

---

# 3. Diagram 2 — Resume Lifecycle & User Actions

```mermaid
flowchart TD
    A[Create / Import] --> B[Temporary Working State]
    B --> C[Preview / Review]
    C --> D[Save]
    D --> E[Version]

    E --> F{Action on Persisted Resume}
    F --> G[Direct Edit]
    F --> H[Create Copy & Edit]
    F --> I[AI Enhance]
    F --> J[ATS / Quality Analysis]
    F --> K[Tailor to Job]
    F --> L[Change Template]
    F --> M[Set as Active CV]
    F --> N[Duplicate Version]
    F --> O[Delete]

    G --> P[Update Current Resume]
    H --> Q[Temporary Working State]
    Q --> R[Preview]
    R --> S[Save as Variation]

    I --> T[AI Suggestions]
    J --> U[Diagnostics / Recommendations]
    K --> V[Job Tailoring Suggestions]
    T --> W[User Review]
    U --> W
    V --> W

    W --> X{User Decision}
    X -->|Update Current| P
    X -->|Save as Variation| S
    X -->|Reject / Cancel| E

    L --> Y[Same Resume Content + Different Rendering]
    Y --> E
    M --> Z[Active CV 0..1]
    N --> AA[New Independent Root Version]

    O --> AB[Delete Confirmation]
    AB -->|Delete Variation| AC[Variation Removed]
    AB -->|Delete Version + All Variations| AD[Whole Resume Group Removed]
    AB -->|Delete Root but Preserve Variations| AE[Oldest Variation Becomes Root Version]
```

---

## 4. Version vs Variation Rules

### Version

A **Version** is a persisted independent Resume entry.

A new Version is created when the user:

- Creates a new Resume and saves it.
- Imports an existing Resume and saves it.
- Explicitly uses **Duplicate Version**.

A normal edit does **not** automatically create a new Version.

### Variation

A **Variation** is a persisted branch derived from an existing Version or Variation.

Typical reasons:

- General AI enhancement.
- ATS improvement.
- Target-role tailoring.
- Applied-position tailoring.
- Job Description tailoring.
- Requirements-based tailoring.
- Custom user instructions.
- AI-suggested improvements.

Every Variation belongs to one root Version.

A Variation is a standalone snapshot. Editing one Resume must not mutate another Resume.

---

# 5. Diagram 3 — AI Enhancement & Job Tailoring Flow

```mermaid
flowchart TD
    A[Saved Version / Variation] --> B{User Action}
    B --> C[AI Enhance]
    B --> D[ATS / Resume Analysis]
    B --> E[Tailor Resume]

    C --> C1[Analyze Resume Content]
    C1 --> C2[Generate Improvement Suggestions]

    D --> D1[Analyze Structure / Parseability / Content Quality]
    D1 --> D2[Generate Explainable Diagnostics]

    E --> E1[Provide Job Context]
    E1 --> E2[Target Role / Applied Position / JD / Requirements / Company / Location / Employment Type]
    E2 --> E3[Analyze Resume + Job Context]
    E3 --> E4{Evidence Check}
    E4 -->|Supported by User Data| E5[Use / Reframe / Emphasize Evidence]
    E4 -->|Missing or Unsupported| E6[Show Gap / Ask for Clarification]
    E6 --> E7[Do Not Fabricate]
    E5 --> E8[Generate Tailoring Suggestions]
    E7 --> E8

    C2 --> F[User Review]
    D2 --> F
    E8 --> F

    F --> G{User Decision}
    G -->|Accept| H[Apply Selected Changes]
    G -->|Edit| I[User Modifies Suggestions]
    G -->|Reject| J[Keep Existing Resume]
    I --> H

    H --> K[Preview]
    K --> L{Save Result}
    L -->|Update Current| M[Update Existing Resume]
    L -->|Save as Variation| N[Create New Variation]
```

---

# 6. Job Context

Job tailoring does not require every field below.

```text
Job Context
├── Target Role(s)
├── Applied Position
├── Job Description
├── Requirements
├── Company
├── Location
└── Employment Type
```

Examples:

- Target Role only.
- Applied Position only.
- Job Description only.
- Applied Position + Job Description.
- Full Job Description + Requirements + Company information.

If the user provides only a Job Description and the role title is unclear, AI may infer a likely role, but the user should be able to confirm or edit it.

---

# 7. AI Truth Boundary

AI may:

- Rewrite.
- Summarize.
- Clarify.
- Reorganize.
- Improve grammar.
- Improve professional tone.
- Reorder sections.
- Emphasize relevant experience.
- Tailor wording to a job.
- Suggest improvements.

AI must **not fabricate unsupported career evidence**.

AI must not silently invent:

- Employers.
- Employment dates.
- Job titles.
- Certifications.
- Awards.
- Projects.
- Skills.
- Technologies.
- Qualifications.
- Transaction values.
- Revenue impact.
- Team sizes.
- KPIs.
- Achievements.
- Responsibilities presented as confirmed facts.

When useful information is missing, the system should:

1. Show the gap.
2. Ask the user for clarification where useful.
3. Continue using only supported information.

---

# 8. Resume Content Preservation

User-provided Resume content belongs to the Resume snapshot.

AI enhancement, Template selection, and localization must not silently delete user-provided data.

Examples include:

- Name.
- Email.
- Phone.
- Address.
- Education.
- Work Experience.
- Skills.
- NRC / Passport information.
- Age / DOB.
- Photo.
- Other regional personal information.

A Template may choose not to visually render a field if it has no supported slot, but the underlying Resume data should remain preserved.

The system should warn or recommend a more compatible Template instead of silently deleting content.

---

# 9. Template Workflow

```mermaid
flowchart LR
    A[Resume Content] --> B[Choose Template]
    B --> C[Render Preview]
    C --> D{User Decision}
    D -->|Keep| E[Use Template]
    D -->|Change| B
    E --> F[Export]
    B -. does not .-> G[Create Version]
    B -. does not .-> H[Create Variation]
```

Changing Template changes presentation only.

It does not:

- Create a new Version.
- Create a new Variation.
- Change factual Resume content.

---

# 10. Upload / Import Flow

```mermaid
flowchart TD
    A[Upload Existing Resume] --> B[PDF / DOCX / JPG / PNG]
    B --> C{Choose Import Path}
    C --> D[Use As-Is]
    C --> E[Extract / Rebuild]

    D --> F[Preview Original Resume]
    F --> G[Save / Register as Version]

    E --> H[Extract Structured Resume Data]
    H --> I{Extraction Confidence}
    I -->|Clear| J[Show Extracted Resume]
    I -->|Uncertain| K[Flag Low-Confidence Fields]
    K --> J
    J --> L[User Reviews / Corrects]
    L --> M[Select ResuMate Template]
    M --> N[Preview]
    N --> O[Save as Version]

    H --> P{Unusable / Unsupported File?}
    P -->|Yes| Q[Ask for Better File or Use Form / Chat]
```

Important:

**Upload ≠ Version**

The uploaded file becomes a persisted Version only after the user chooses to save/import it.

---

# 11. Active CV Flow

```mermaid
flowchart TD
    A[Saved Version / Variation] --> B[User Selects Set as Active CV]
    B --> C[Active CV]
    C --> D[Maximum One Active CV Per Personal User]
    C --> E{Newer Relevant Career Evidence Exists?}
    E -->|No| F[No Action]
    E -->|Possible| G[Show Recommendation]
    G --> H[Your Active CV may not include your latest career information]
    H --> I[User Decides]
    I --> J[Keep Current Active CV]
    I --> K[Update / Choose Another Resume]

    C --> L{Active Resume Deleted?}
    L -->|Yes| M[No Active CV]
    M --> N[Do Not Automatically Select Another Resume]
```

Active CV is optional.

Resume-building features must still work when the user has no Active CV.

---

# 12. Saved Resume — User Action Map

For any persisted **Version or Variation**, the user may be able to:

```text
Saved Resume
│
├── View
├── Direct Edit
├── Create Copy & Edit
├── AI Enhance
├── ATS / Quality Analysis
├── Tailor to Job
├── Preview
├── Change Template
├── Export / Download
├── Share
├── Set as Active CV
└── Delete
```

For a root Version, the user may additionally:

```text
Duplicate Version
→ New independent root Version
```

---

# 13. Edit Behavior

```mermaid
flowchart TD
    A[Open Saved Resume] --> B{Editing Choice}
    B --> C[Direct Edit]
    B --> D[Create Copy & Edit]

    C --> E[Edit Existing Resume]
    E --> F[Preview]
    F --> G[Update Current Resume]

    D --> H[Temporary Working State]
    H --> I[Edit]
    I --> J[Preview]
    J --> K[Save as Variation]
```

### Direct Edit

Updates the current Resume.

### Create Copy & Edit

Creates a temporary working copy. When saved, it becomes a new Variation under the same root Version.

---

# 14. Delete Behavior

Delete always requires confirmation.

### Delete a Variation

```text
Variation
→ Confirm Delete
→ Variation Removed
```

### Delete Version + All Variations

```text
Root Version
→ Confirm Delete Group
→ Root Version + All Variations Removed
```

### Delete Root Version but Preserve Variations

```text
Root Version
→ Confirm Delete Root Only
→ Oldest Variation Becomes New Root Version
→ Remaining Variations Stay in Group
```

If the deleted Resume was the Active CV:

```text
Active Resume Deleted
→ Active CV = Empty
```

The system must not automatically choose another Active CV.

---

# 15. Important Product Principles

## 15.1 User Control

AI suggestions are not automatically final. The user should be able to **review, accept, edit, or reject** them.

## 15.2 Evidence Protection

### Evidence-like fields

Examples:

- Employer.
- Position.
- Employment dates.
- Education.
- Certification.
- Project identity.
- Skills.
- Awards.
- Metrics.

### Narrative / presentation fields

Examples:

- Profile Summary.
- Experience Description.
- Bullet wording.
- Section ordering.
- Emphasis.

AI can improve narrative presentation, but it must not silently change factual evidence.

## 15.3 Preview Predictability

The user should be able to reasonably understand what the final exported Resume will look like from the editing and preview experience.

```text
Resume Data
    ↓
Editor
    ↓
Preview
    ↓
Export

Same source of content and presentation rules
```

Avoid:

```text
Editor says A
Preview shows B
Export produces C
```

## 15.4 AI Enhancement Is Not Maximum Expansion

AI should improve relevance and clarity, not simply make every section longer.

```text
Most Relevant Experience
→ More detail

Supporting Experience
→ Concise detail

Low-Relevance Experience
→ Minimal detail or omit when user chooses
```

The goal is **credible, concise, relevant, human-readable Resume content**, not maximum text generation.

---

# 16. MVP User Journey Summary

```mermaid
flowchart LR
    A[Enter ResuMate]
    --> B[Create or Import Resume]
    --> C[Review / Edit]
    --> D[Preview]
    --> E[Save Version]
    --> F[Enhance / Analyze / Tailor]
    --> G[User Review]
    --> H[Update Current or Save Variation]
    --> I[Choose Template]
    --> J[Preview]
    --> K[Export / Share]
```

---

# 17. Future Scope — Not Part of This Workflow Draft

- Full Portfolio system.
- Job Platform integration.
- Automatic job discovery.
- Automatic application submission.
- Application lifecycle tracking.
- Agency multi-client workflow.
- Organization / Workspace model.
- Custom Template Builder.
- Trash / Restore.
- Full revision history.
- Bulk Resume import.

---

# 18. Review Questions for Senior Feedback

1. Is the main user journey understandable without technical explanation?
2. Are Create, Import, Enhance, Analyze, Tailor, and Export clearly separated?
3. Is the difference between **Version** and **Variation** understandable?
4. Is Direct Edit vs Create Copy & Edit intuitive?
5. Should any important user action be added or removed?
6. Is the Upload → Review → Save workflow acceptable?
7. Is the Use As-Is path necessary in MVP?
8. Is Job Context flexible enough for real job applications?
9. Is user approval strong enough before AI changes become permanent?
10. Is Active CV useful in MVP, or should it remain hidden until job-seeking features arrive?
11. Are Template and Resume content clearly separated?
12. Are delete behaviors understandable and safe?
13. Are any steps too complex for beginner users?
14. Which flows should be simplified before technical architecture begins?

---

# 19. Status

**Document Status:** Draft for Senior Review  
**Phase:** Pre-Architecture Product Workflow  
**Next Step After Review:** Refine workflow → lock major user actions → map technical components and responsibilities during Architecture phase.
