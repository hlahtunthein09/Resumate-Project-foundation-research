# System Design V1 Presentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone senior-review HTML presentation that accurately communicates the ResuMate System Design V1 Stages 1–7 checkpoint.

**Architecture:** A single semantic HTML document contains the review content, CSS architecture diagrams, responsive styles, and minimal navigation/detail JavaScript. A dependency-free Node test validates the source-of-truth labels, core invariants, exact cost figures, required sections, and diagrams.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js built-in test runner.

**Spec:** `RESUMATE-SYSTEM-DESIGN-V1-STAGE-1-7.md`

## Global Constraints

- Treat `RESUMATE-SYSTEM-DESIGN-V1-STAGE-1-7.md` as the sole source of truth.
- Add no external dependencies, image assets, frameworks, or CDN resources.
- Preserve exact planning guardrails: infrastructure ~$50/month, ~$60–75/month, ~$100/month; AI ~$100/month, ~$150/month, ~$250/month; ~$0.45 active-user/month.
- Clearly separate LOCKED / PROVISIONAL / FUTURE / REVIEW REQUIRED content.
- Do not alter existing research documents or unrelated files.
- Desktop presentation quality is primary; support tablet and mobile layouts.

---

### Task 1: Add source-of-truth presentation checks

**Files:**
- Create: `tests/system-design-presentation.test.mjs`

**Interfaces:**
- Consumes: `system-design-v1.html` as UTF-8 text.
- Produces: a Node test suite that fails until the presentation exists and contains required review content.

- [ ] **Step 1: Write the failing test**

Create Node tests that assert the presentation contains the title, all required review sections, decision-state labels, the three core invariant statements, the five exact planning-cost figures, and seven named diagrams.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/system-design-presentation.test.mjs`

Expected: FAIL because `system-design-v1.html` does not exist.

- [ ] **Step 3: Commit**

Do not commit independently because the workspace contains user-owned untracked files. Keep the test paired with the implementation for review.

### Task 2: Build the standalone presentation

**Files:**
- Create: `system-design-v1.html`
- Test: `tests/system-design-presentation.test.mjs`

**Interfaces:**
- Consumes: the Stage 1–7 Markdown source and the Task 1 content contract.
- Produces: a self-contained browser presentation with nav targets that match the test contract.

- [ ] **Step 1: Write minimal semantic structure and source-accurate content**

Create the overview, executive summary, product scope, domain/data, architecture, AI, document pipeline, security, reliability, scaling, cost, technology, risks, senior review, readiness, and final-summary sections.

- [ ] **Step 2: Add CSS diagrams and responsive review layout**

Implement high-level architecture, Version/Variation, AI harness, upload/extraction, public publish, scaling progression, and cost model diagrams in HTML/CSS. Add responsive layout rules and keyboard-visible navigation focus.

- [ ] **Step 3: Add minimal navigation interaction**

Implement active-section navigation and native disclosure elements for detail that benefits from collapse; do not add nonessential motion.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/system-design-presentation.test.mjs`

Expected: PASS.

### Task 3: Validate presentation behavior

**Files:**
- Verify: `system-design-v1.html`
- Verify: `tests/system-design-presentation.test.mjs`

**Interfaces:**
- Consumes: the completed standalone presentation.
- Produces: verified source-content coverage and readable local rendering.

- [ ] **Step 1: Re-run the source-content test**

Run: `node --test tests/system-design-presentation.test.mjs`

Expected: PASS with no failures.

- [ ] **Step 2: Inspect anchors and source references**

Run: `rg -n 'id="(overview|executive|scope|domain|architecture|ai|pipeline|security|reliability|scaling|cost|technology|risks|review|readiness|summary)"|href="#' system-design-v1.html`

Expected: all navigation targets exist and are linked.

- [ ] **Step 3: Inspect the page locally**

Open the static file in a local browser and check desktop/tablet widths, diagram legibility, status labels, and disclosure behavior.

- [ ] **Step 4: Commit**

Do not create a commit without the user’s explicit request because this workspace’s content is all untracked/user-owned.
