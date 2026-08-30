const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const requireText = (text, fragment, message) => {
  if (!text.includes(fragment)) throw new Error(message);
};

const diagramPage = read("product-workflow-diagrams.html");
const index = read("index.html");
const workflow = read("product-workflow.html");

requireText(
  diagramPage,
  "Product / User Journey",
  "The visual companion needs the product journey diagram.",
);
requireText(
  diagramPage,
  "Resume Lifecycle &amp; User Actions",
  "The visual companion needs the lifecycle diagram.",
);
requireText(
  diagramPage,
  "AI Enhancement &amp; Job Tailoring",
  "The visual companion needs the AI and tailoring diagram.",
);
requireText(
  diagramPage,
  "Do not fabricate",
  "The visual companion must retain the evidence-protection boundary.",
);
requireText(
  diagramPage,
  "Active CV (0..1)",
  "The visual companion must retain Active CV cardinality.",
);
requireText(
  diagramPage,
  "Duplicate Version",
  "The visual companion must distinguish independent duplicate Versions.",
);
requireText(
  diagramPage,
  "Save as Variation",
  "The visual companion must distinguish saved Variations.",
);
requireText(
  index,
  'href="product-workflow-diagrams.html"',
  "The research foundation must link to the visual workflow companion.",
);
requireText(
  workflow,
  'href="product-workflow-diagrams.html"',
  "The narrative workflow must link to the visual workflow companion.",
);

console.log("Product workflow diagram page and navigation verified.");
