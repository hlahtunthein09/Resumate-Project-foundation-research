import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const presentation = fs.readFileSync("system-design-v1.html", "utf8");
const foundation = fs.readFileSync("index.html", "utf8");
const normalizedPresentation = presentation.replace(/\s+/g, " ");

test("contains every senior-review section", () => {
  for (const id of [
    "overview",
    "executive",
    "scope",
    "domain",
    "architecture",
    "ai",
    "pipeline",
    "security",
    "reliability",
    "scaling",
    "cost",
    "technology",
    "risks",
    "review",
    "readiness",
    "summary",
  ]) {
    assert.match(presentation, new RegExp(`id=["']${id}["']`));
  }
});

test("preserves decision statuses and non-negotiable invariants", () => {
  for (const content of [
    "LOCKED",
    "PROVISIONAL",
    "FUTURE",
    "REVIEW REQUIRED",
    "Application owns context. Models do not own context.",
    "AI may not fabricate unsupported career evidence.",
    "Scale from measured bottlenecks, not hypothetical future scale.",
  ])
    assert.match(presentation, new RegExp(content.replaceAll(".", "\\.")));
});

test("preserves planning-cost guardrails", () => {
  for (const content of [
    "~$50/month",
    "~$60–75/month",
    "~$100/month",
    "~$150/month",
    "~$250/month",
    "~$0.45",
  ])
    assert.ok(presentation.includes(content), `missing ${content}`);
});

test("includes all required technical diagrams", () => {
  for (const label of [
    "High-level system architecture",
    "Version / Variation relationship",
    "AI Harness flow",
    "Upload and extraction flow",
    "Public Profile publish flow",
    "Scaling progression",
    "Cost model",
  ])
    assert.ok(presentation.includes(label), `missing diagram: ${label}`);
});

test("covers the source-backed audit amendments", () => {
  for (const content of [
    "expectedRevision",
    "Stable section, block, and item IDs",
    "Active CV",
    "partial AI failure",
    "analysis version + model/config version",
    "prompt caching",
    "Malware scanning",
    "Secrets separation",
    "Pending uploads",
    "timeout classes",
    "no day-one JSONB GIN index",
    "AI / OCR / PDF",
    "~$25–50/month",
    "~$0.001",
    "~$0.03",
    "~$0.08",
    "if cost is reasonable",
    "current recommendation",
    "cross-device conflict",
    "sensitive-data leakage",
  ])
    assert.ok(
      normalizedPresentation.includes(content),
      `missing audited source detail: ${content}`,
    );
});

test("connects the system-design presentation to the research series", () => {
  assert.ok(
    foundation.includes('href="system-design-v1.html"'),
    "index.html must link to System Design V1",
  );
  for (const page of [
    "index.html",
    "domain-model.html",
    "product-workflow.html",
    "product-workflow-diagrams.html",
  ]) {
    assert.ok(
      presentation.includes(`href="${page}"`),
      `system-design-v1.html must link to ${page}`,
    );
  }
});
