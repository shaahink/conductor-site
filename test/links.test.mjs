/* The prose linker's five rules, one test each.
   ---------------------------------------------------------------------------
   `src/lib/links.ts` is what makes the site cross-reference itself, and it is
   the kind of code that is either invisible or embarrassing: right, and nobody
   notices; wrong, and a paragraph about a garden gate links to an evals page in
   front of every reader.

   Each rule is asserted against a hand-built term index rather than against the
   real one, so a test fails because the rule broke and not because somebody
   added a concept. The last block is the exception and runs against the real
   content, because two properties are about the vocabulary rather than the
   matcher: that no term is so common it would link on nearly every page, and
   that the linked phrases still resolve to pages that exist. */
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";
import { parse } from "yaml";

import { buildIndex, escapeHtml, linkTerms, pageContext } from "../src/lib/links.ts";

const index = buildIndex([
  { text: "context engineering", href: "/concepts/context-engineering/" },
  { text: "context", href: "/concepts/context/" },
  { text: "gate", href: "/concepts/evals-and-gates/" },
  { text: "gates", href: "/concepts/evals-and-gates/" },
  { text: "ceiling", href: "/concepts/token-economics/" }
]);

const link = (text, self) => linkTerms(text, index, pageContext(self));

test("rule 1: the longest term wins, so the specific beats the general", () => {
  const out = link("We do context engineering here.");

  assert.match(out, /href="\/concepts\/context-engineering\/">context engineering<\/a>/);
  assert.doesNotMatch(
    out,
    /href="\/concepts\/context\/"/,
    'matching "context" first would leave "engineering" dangling beside a link to the wrong page'
  );
});

test("rule 2: one link per destination per page, whatever the spelling", () => {
  /* "gate" and "gates" are two index entries pointing at one page. Counting
     first-mentions by phrase would link the same concept twice in one line,
     which is the failure this rule exists to prevent. */
  const out = link("A gate is a command. The gates run on every commit.");

  assert.equal(
    (out.match(/class="term"/g) ?? []).length,
    1,
    "a reader is owed one route to a page, not one route per spelling of its name"
  );
});

test("rule 2, continued: the rule holds across paragraphs of one page", () => {
  const context = pageContext();
  const first = linkTerms("The ceiling was picked by feel.", index, context);
  const second = linkTerms("That ceiling cost money.", index, context);

  assert.match(first, /class="term"/);
  assert.doesNotMatch(second, /class="term"/, "the fourth mention is noise, not navigation");
});

test("rule 3: a page never links to itself", () => {
  const out = link("Context engineering is the subject here.", "/concepts/context-engineering/");

  assert.doesNotMatch(
    out,
    /class="term"/,
    "a page saying its own title is not offering to take the reader anywhere"
  );
});

test("rule 4: whole words only", () => {
  const out = link("The delegates arrived and the gateway opened.");

  assert.doesNotMatch(
    out,
    /class="term"/,
    '"gate" must not match inside "delegates" or "gateway"'
  );
});

test("rule 4, continued: a hyphen is a word character, not a boundary", () => {
  const out = link("A gate-shaped hole.");

  assert.doesNotMatch(out, /class="term"/, '"gate-shaped" is one word, not "gate" plus a suffix');
});

test("rule 5: the text is escaped, and the anchors survive it", () => {
  const out = link('A ceiling & a <script> tag and a "quote".');

  assert.match(out, /class="term"/, "escaping must not eat the links");
  assert.match(out, /&amp;/);
  assert.match(out, /&lt;script&gt;/);
  assert.doesNotMatch(out, /<script>/, "prose is plain text and this is where it becomes HTML");
});

test("the reader's own capitals and plurals survive being linked", () => {
  const out = link("Gates are the subject.");

  assert.match(
    out,
    />Gates<\/a>/,
    "the link is an addition to the prose, never a correction of it"
  );
});

test("escapeHtml leaves ordinary prose alone", () => {
  assert.equal(escapeHtml("a plain sentence, with punctuation."), "a plain sentence, with punctuation.");
});

test("the index drops duplicates deterministically rather than by load order", () => {
  const built = buildIndex([
    { text: "same", href: "/first/" },
    { text: "Same", href: "/second/" }
  ]);

  assert.equal(built.length, 1, "two pages claiming one phrase must not both be in the index");
});

/* ── and now against the content this site actually ships ─────────────────── */

const entries = ["concepts", "articles", "reports"].flatMap((dir) =>
  readdirSync(new URL(`../src/content/${dir}`, import.meta.url)).map((file) => ({
    dir,
    id: file.replace(/\.yaml$/, ""),
    data: parse(readFileSync(new URL(`../src/content/${dir}/${file}`, import.meta.url), "utf8"))
  }))
);

test("no linked phrase is so common it would link on nearly every page", () => {
  const prose = entries.map((entry) =>
    [
      ...(entry.data.theIdea ?? []),
      ...(entry.data.theProblem ?? []),
      ...(entry.data.inConductor?.mechanism ?? []),
      ...(entry.data.sections ?? []).flatMap((section) => section.body)
    ]
      .join("  ")
      .toLowerCase()
  );

  const tooCommon = [];
  for (const entry of entries) {
    for (const phrase of entry.data.linkAs ?? []) {
      const pages = prose.filter((text) =>
        new RegExp(`\\b${phrase.toLowerCase().replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`).test(
          text
        )
      ).length;
      /* Two thirds of the corpus. "Checkpoint" is in 13 of 17 and is
         deliberately unclaimed; a phrase that links on almost every page is a
         decoration rather than a cross-reference, and it is how auto-linking
         gets switched off six months later. */
      if (pages > entries.length * (2 / 3)) tooCommon.push(`${phrase} (${pages} pages)`);
    }
  }

  assert.deepEqual(
    tooCommon,
    [],
    "a phrase this common belongs to no single page — leave it unclaimed"
  );
});

test("every linked phrase belongs to exactly one page", () => {
  const owners = new Map();
  for (const entry of entries) {
    for (const phrase of entry.data.linkAs ?? []) {
      const key = phrase.toLowerCase();
      if (!owners.has(key)) owners.set(key, []);
      owners.get(key).push(`${entry.dir}/${entry.id}`);
    }
  }

  const contested = [...owners.entries()]
    .filter(([, pages]) => pages.length > 1)
    .map(([phrase, pages]) => `"${phrase}" claimed by ${pages.join(" and ")}`);

  assert.deepEqual(
    contested,
    [],
    "two pages claiming one phrase resolves deterministically but arbitrarily — decide it here"
  );
});
