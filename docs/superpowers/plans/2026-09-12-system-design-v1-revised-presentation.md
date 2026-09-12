# System Design V1 Revised Presentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a standalone senior-review website for the post-review ResuMate V1 architecture and connect it to the existing research presentation series.

**Architecture:** `system-design-v1-revised.html` is a self-contained semantic HTML/CSS/JavaScript presentation. It has a source-coverage test that verifies revised terminology, direct LLM extraction, explicitly deferred infrastructure, cost guardrails, quality policy, and bidirectional navigation.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js built-in test runner.

**Spec:** `RESUMATE-SYSTEM-DESIGN-V1-REVISED-AFTER-SENIOR-REVIEW.md`

## Global Constraints

- The revised Markdown is the current source of truth for this page.
- Preserve `system-design-v1.html` unchanged as the prior Stage 1–7 presentation.
- Add no dependencies, remote assets, frameworks, or external image generation.
- Represent ProcessingJob, workers, queues, Redis/BullMQ, PaddleOCR, and dedicated OCR as DEFERRED—not V1 components.
- Use Resume / Variant terminology; ROOT remains implementation-only.
- Keep source-backed APPROVED, ADOPTED FOR V1, PREFERRED CANDIDATE, and DEFERRED status distinctions visible.

---

### Task 1: Add a failing revised-source coverage test

**Files:**
- Create: `tests/system-design-revised-presentation.test.mjs`

**Interfaces:**
- Consumes: `system-design-v1-revised.html` and `index.html` as UTF-8 text.
- Produces: Node tests that establish the revised presentation content and navigation contract.

- [ ] **Step 1: Write the failing test**

Assert required sections, Resume/Variant terminology, direct multimodal LLM extraction, direct-request runtime, extracted-quality thresholds, all deferred components, exact AI/infrastructure budgets, and index/page navigation links.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/system-design-revised-presentation.test.mjs`

Expected: FAIL because the revised presentation file does not exist.

### Task 2: Build the revised standalone review page

**Files:**
- Create: `system-design-v1-revised.html`
- Modify: `index.html`
- Test: `tests/system-design-revised-presentation.test.mjs`

**Interfaces:**
- Consumes: revised Markdown and Task 1’s presentation content contract.
- Produces: a linked, responsive review page with CSS diagrams and concise interaction.

- [ ] **Step 1: Create source-accurate sections**

Build overview, senior-review outcomes, Resume/Variant model, direct runtime, extraction strategy/rules/quality, AI harness, security, direct-request scaling, costs, technology status, deferred evolution, Stage 8 readiness, and final checkpoint sections.

- [ ] **Step 2: Add diagrams and navigation**

Render Resume/Variant lineage, direct V1 architecture, extraction/review pipeline, AI harness, direct capacity controls, and deferred evolution path with HTML/CSS. Link the revised page to all existing research pages and add the revised link to `index.html`.

- [ ] **Step 3: Verify test passes**

Run: `node --test tests/system-design-revised-presentation.test.mjs`

Expected: PASS.

### Task 3: Format and verify

**Files:**
- Verify: `system-design-v1-revised.html`
- Verify: `index.html`
- Verify: `tests/system-design-revised-presentation.test.mjs`

- [ ] **Step 1: Format changed HTML/test files**

Run Prettier on the new page, revised test, and index page.

- [ ] **Step 2: Re-run revised source-coverage tests**

Run: `node --test tests/system-design-revised-presentation.test.mjs`

Expected: PASS with 0 failures.

- [ ] **Step 3: Verify all source links**

Run: `rg -n 'system-design-v1-revised\.html|index\.html|domain-model\.html|product-workflow\.html|product-workflow-diagrams\.html' index.html system-design-v1-revised.html`

Expected: revised page is linked from the research foundation and links back to all series artifacts.
