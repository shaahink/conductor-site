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
import { figuresIn, proseOf, refuseTypedFigures } from "../src/lib/figures.ts";

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

    /* Every entry needs somewhere to be seen, or the owner's only route to
       inline editing is typing `?edit=1` onto a URL — which is to say, no
       route at all on a phone. Three shapes are legal: one path for a `file`
       collection, a pattern carrying the entry id for a `dir` one, and a map
       from entry id to path for a `dir` collection whose URLs are not its ids.
       All of them site-relative, because the kit drops anything else and the
       button silently stops existing rather than pointing somewhere wrong. */
    const url = config.entryUrl;
    assert.ok(url, `${name} should declare an entryUrl`);

    if (typeof url === "string") {
      assert.ok(url.startsWith("/"), `${name}: entryUrl ${url} is not site-relative`);
      if (config.dir) {
        assert.ok(
          url.includes("{entry}"),
          `${name}: a dir collection's entryUrl pattern needs the entry id in it`
        );
      }
      continue;
    }

    assert.ok(config.dir, `${name}: only a dir collection can map entryUrl per entry`);
    for (const [id, path] of Object.entries(url)) {
      assert.ok(path.startsWith("/"), `${name}/${id}: entryUrl ${path} is not site-relative`);
      assert.ok(
        existsSync(new URL(`../${config.dir}/${id}.yaml`, import.meta.url)),
        `${name}: entryUrl names "${id}", which has no file in ${config.dir}`
      );
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

/** A concept with all five moves in it, used as the shape to break.
    The head is written out rather than stubbed because `meta` carries its own
    bar now (test/meta.test.mjs) — a fixture with "What it is." in it would be
    refused before it reached the assertion it was built for. */
const wholeConcept = () => ({
  meta: {
    title: "A concept",
    description:
      "A stand-in concept used by the tests to break the shape on purpose, written out at the length the head bar in schema.ts asks for.",
    ogDescription: "A stand-in concept the tests use as the shape to break.",
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

test("nor into the sentence beside it", () => {
  /* The same rule one field over, and the easier mistake: naming a key is a
     thing you have to remember to do, writing the number is what writing is.
     src/lib/collections.ts runs this over every entry as the build renders it. */
  for (const figure of [
    "The corpus cost $3,016.29 across every run in it.",
    "It came in 23% under what the previous approach spent.",
    "That is a 1.6x improvement on tokens per delivered checkpoint.",
    "648/677 gates came back green.",
    "The blended rate worked out at 4.85 per million.",
    "Eighteen runs, 340 sessions, and not one of them free."
  ]) {
    assert.notDeepEqual(figuresIn(figure), [], `${JSON.stringify(figure)} should be refused`);
  }

  /* What must still be writable. A number spelled as a word is prose; a single
     digit is how a version and a part number are written; and the shape check
     says so rather than pretending the gap is not there. */
  for (const fine of [
    "Three moves do most of the work.",
    "Astro 7, and the schemas import nothing but Zod.",
    "SPEC Part I sets the three litmus tests this page is held to."
  ]) {
    assert.deepEqual(figuresIn(fine), [], `${JSON.stringify(fine)} should be allowed`);
  }
});

test("a command may carry digits; a sentence may not", () => {
  const entry = wholeConcept();
  entry.tryIt = [
    { command: "cat .conductor/logs/session-003.prompt.md", note: "The prompt, byte for byte." }
  ];
  entry.inConductor.citations = [
    { path: "src/Conductor.Core/PromptBuilder.cs", line: 220, note: "Why." }
  ];

  /* A session number in a command and a source path in a citation are the two
     places digits reach a reader as something other than a claim. Neither is
     prose, and the walk leaves both out. */
  const paths = proseOf(entry).map(([path]) => path);
  assert.ok(!paths.includes("tryIt[0].command"), "a command is not a claim about the corpus");
  assert.ok(!paths.includes("inConductor.citations[0].path"), "nor is a source file");
  assert.ok(paths.includes("tryIt[0].note"), "but the sentence under it is");

  assert.doesNotThrow(() => refuseTypedFigures("concepts/a-concept.yaml", entry));

  entry.theProblem = ["It wasted $51.98 doing it."];
  assert.throws(
    () => refuseTypedFigures("concepts/a-concept.yaml", entry),
    /theProblem\[0\] types a currency amount/,
    "the failure has to name the field, or the writer cannot act on it"
  );
});

test("articles and reports are the same shape, and a report also names its scenario", () => {
  const article = {
    meta: {
      title: "A piece",
      description:
        "A stand-in article used by the tests to prove that a report published without its scenario label is refused by the schema behind it.",
      ogDescription: "A stand-in article the tests use to check the report shape.",
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
