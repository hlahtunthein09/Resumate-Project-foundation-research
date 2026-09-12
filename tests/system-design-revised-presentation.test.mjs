import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const presentation = fs.readFileSync("system-design-v1-revised.html", "utf8");
const foundation = fs.readFileSync("index.html", "utf8");
const normalized = presentation.replace(/\s+/g, " ");

test("contains the revised senior-review sections", () => {
  for (const id of [
    "overview",
    "outcome",
    "model",
    "runtime",
    "extraction",
    "ai",
    "security",
    "scaling",
    "cost",
    "technology",
    "deferred",
    "stage-8",
    "summary",
  ])
    assert.match(presentation, new RegExp(`id=["']${id}["']`));
});

test("preserves revised V1 terminology and runtime", () => {
  for (const content of [
    "Resume / Variant",
    "rootResumeId",
    "sourceResumeId",
    "Direct service call",
    "Multimodal LLM extraction",
    "DocumentExtractionService",
    "OpenAIDocumentExtractor",
    "Extraction is not enhancement",
    "Missing data is safer than fabricated data.",
    "~80%+",
    "~50–79%",
    "&lt; ~50%",
  ])
    assert.ok(
      normalized.includes(content),
      `missing revised detail: ${content}`,
    );
});

test("marks non-V1 infrastructure as deferred", () => {
  for (const content of [
    "ProcessingJob",
    "Background worker",
    "PaddleOCR",
    "Redis/BullMQ",
    "Durable queue",
    "Job polling",
    "DEFERRED",
  ])
    assert.ok(
      normalized.includes(content),
      `missing deferred component: ${content}`,
    );
});

test("preserves revised budgets and direct-request safeguards", () => {
  for (const content of [
    "~$50/month",
    "~$100/month",
    "~$150/month",
    "~$250/month",
    "429 / Retry-After",
    "High demand.",
    "bounded concurrent AI operations",
    "DOCUMENT_EXTRACTION",
  ])
    assert.ok(
      normalized.includes(content),
      `missing revised guardrail: ${content}`,
    );
});

test("preserves the audited truth, retention, and revision-control boundaries", () => {
  for (const content of [
    "AI may transform, organize, clarify, and professionally express user-supported facts",
    "must not fabricate unsupported career evidence",
    "must not rely only on a model's self-reported confidence score",
    "Use-As-Is original Resume file remains durable while the Resume exists",
    "Extract &amp; Edit source upload uses limited retention by default",
    "Generated PDFs are short-lived unless explicitly preserved",
    "short-lived signed URLs",
    "Private-by-default",
    "published snapshot",
    "PDF is a derived artifact, never the Resume source of truth",
    "debounced server-backed Working Draft",
    "expectedRevision",
    "extraction result schema",
  ])
    assert.ok(
      normalized.includes(content),
      `missing audited revised boundary: ${content}`,
    );
});

test("connects the revised checkpoint to the research series", () => {
  assert.ok(foundation.includes('href="system-design-v1-revised.html"'));
  for (const page of [
    "index.html",
    "domain-model.html",
    "product-workflow.html",
    "product-workflow-diagrams.html",
    "system-design-v1.html",
  ])
    assert.ok(presentation.includes(`href="${page}"`), `missing link: ${page}`);
});

test("uses dark ink for extraction-step descriptions on white cards", () => {
  assert.match(presentation, /\.steps span\s*\{[^}]*color:\s*var\(--ink\);/s);
});
