/* The content model's own gate.
   ---------------------------------------------------------------------------
   `astro check` already validates the YAML in src/content against these
   schemas. What it cannot see is the two ways the model goes wrong silently,
   and both are things this repo's own comments warn about:

     1. schema.ts growing an Astro-shaped import. The build would be perfectly
        happy — it is the editor's Vercel function, which imports the same file
        outside the build, that dies. Nothing in `npm run build` says a word.
     2. a collection added to content.config.ts and not to the `editable` map.
        It builds, it renders, and it is quietly uneditable. AGENTS.md calls
        this out as "miss the third and it silently is not editable"; this test
        is what makes that stop being true.

   The third block is the site's first litmus test made mechanical: a figure is
   named, never typed. If `evidenceKey` ever loosens, these are the assertions
   that go red.

   The schemas are imported straight from the .ts — Node strips the types — so
   this tests the file the build and the editor both load, not a copy of it. */
import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  articleSchema,
  conceptSchema,
  editable,
  evidenceKey,
  reportSchema
} from "../src/content/schema.ts";

const schemaSource = readFileSync(new URL("../src/content/schema.ts", import.meta.url), "utf8");
const configSource = readFileSync(new URL("../src/content.config.ts", import.meta.url), "utf8");

/** Every `from "…"` in a file, in source order. */
const importsOf = (source) =>
  [...source.matchAll(/^\s*(?:import|export)[\s\S]*?from\s+"([^"]+)"/gm)].map((m) => m[1]);

test("schema.ts imports nothing but Zod", () => {
  const specifiers = importsOf(schemaSource);
  assert.ok(specifiers.length > 0, "expected schema.ts to import something");
  assert.deepEqual(
    [...new Set(specifiers)],
    ["zod"],
    "api/content.ts imports this file from a Vercel function, where astro:content and " +
      "astro/loaders do not exist. Anything Astro-shaped here breaks the editor and " +
      "nothing in the build says so."
  );
});

test("every collection the build defines is also editable", () => {
  const exported = configSource.match(/export const collections = \{([^}]*)\}/);
  assert.ok(exported, "content.config.ts should export a `collections` object literal");

  const defined = exported[1]
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  assert.deepEqual(
    defined.slice().sort(),
    Object.keys(editable).sort(),
    "adding a collection touches three places — the schema, the loader, and the `editable` " +
      "map. This is the third one."
  );
});

test("every editable collection points at content that exists", () => {
  for (const [name, config] of Object.entries(editable)) {
    const path = config.file ?? config.dir;
    assert.ok(path, `${name} declares neither a file nor a dir`);
    assert.ok(existsSync(new URL(`../${path}`, import.meta.url)), `${name}: ${path} is missing`);

    /* A `dir` collection's entryUrl is a pattern with the entry id in it; a
       `file` collection's is one path. Either way it is site-relative, because
       the kit drops anything else and the owner's "edit it on the page" button
       silently stops existing. */
    const url = config.entryUrl;
    assert.equal(typeof url, "string", `${name} should declare an entryUrl`);
    assert.ok(url.startsWith("/"), `${name}: entryUrl ${url} is not site-relative`);
    if (config.dir) {
      assert.ok(url.includes("{entry}"), `${name}: a dir collection's entryUrl needs the entry id`);
    }
  }
});

test("evidence names a key, never a value", () => {
  for (const key of ["softBreaks", "rollovers", "the-long-build", "gates.green", "costPerSession"]) {
    assert.equal(evidenceKey.safeParse(key).success, true, `${key} should be a valid key`);
  }

  /* Everything a writer in a hurry would reach for instead. Each one is a
     figure that would then be frozen into the content and drift the moment the
     store changed, which is the exact failure the corpus exists to prevent. */
  for (const value of ["3016.29", "$425.12", "18 runs", "72/81", "30%", "1.6x average", ""]) {
    assert.equal(
      evidenceKey.safeParse(value).success,
      false,
      `${JSON.stringify(value)} is a value and should have been refused`
    );
  }
});

/** A concept with all five moves in it, used as the shape to break. */
const wholeConcept = () => ({
  meta: {
    title: "A concept",
    description: "What it is.",
    ogDescription: "What it is.",
    canonical: "/concepts/a-concept/"
  },
  slug: "a-concept",
  order: 1,
  title: "A concept",
  alsoKnownAs: ["another name for it"],
  oneLine: "One line about it.",
  theIdea: ["First.", "Second.", "Third."],
  theProblem: ["What goes wrong without it."],
  inConductor: {
    mechanism: ["How the engine does it."],
    citations: [{ path: "src/Conductor.Core/PromptBuilder.cs", line: 220, note: "Why." }]
  },
  evidence: { runs: ["the-long-build"], figures: ["rollovers"] },
  tryIt: [{ command: "conductor task --list", note: "Try this." }],
  readNext: []
});

test("a concept is the five moves, and every one of them is required", () => {
  assert.equal(conceptSchema.safeParse(wholeConcept()).success, true);

  for (const move of ["oneLine", "theIdea", "theProblem", "inConductor", "tryIt"]) {
    const missing = wholeConcept();
    delete missing[move];
    assert.equal(
      conceptSchema.safeParse(missing).success,
      false,
      `a concept without ${move} is not a concept page`
    );
  }
});

test("a concept's idea is three to six paragraphs, and cites at least one line", () => {
  const short = wholeConcept();
  short.theIdea = ["Only.", "Two."];
  assert.equal(conceptSchema.safeParse(short).success, false, "two paragraphs is not an idea");

  const long = wholeConcept();
  long.theIdea = Array.from({ length: 7 }, (_, i) => `Paragraph ${i}.`);
  assert.equal(conceptSchema.safeParse(long).success, false, "seven paragraphs is an article");

  const uncited = wholeConcept();
  uncited.inConductor.citations = [];
  assert.equal(
    conceptSchema.safeParse(uncited).success,
    false,
    "the mechanism half is a claim about someone else's source; it has to point at it"
  );
});

test("a concept cannot type a figure into its evidence", () => {
  const typed = wholeConcept();
  typed.evidence.figures = ["3016.29"];
  assert.equal(conceptSchema.safeParse(typed).success, false);
});

test("articles and reports are the same shape, and a report also names its scenario", () => {
  const article = {
    meta: {
      title: "A piece",
      description: "About something.",
      ogDescription: "About something.",
      canonical: "/articles/a-piece/"
    },
    slug: "a-piece",
    order: 1,
    title: "A piece",
    standfirst: "The line under the title.",
    evidence: { runs: [], figures: ["totalCostUsd"] },
    sections: [{ heading: "One", body: ["A paragraph."] }],
    readNext: []
  };

  assert.equal(articleSchema.safeParse(article).success, true);
  assert.equal(
    reportSchema.safeParse(article).success,
    false,
    "a report published without its generalised scenario label is a report published as the run"
  );
  assert.equal(
    reportSchema.safeParse({ ...article, scenario: "A four-site web fleet" }).success,
    true
  );
});
