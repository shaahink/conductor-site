/* The concept spine, checked as a sequence rather than as ten separate files.
   ---------------------------------------------------------------------------
   S2.2 already made a dangling `readNext` fail the build, and that is the check
   that catches a typo. It is not the check that catches the spine going wrong,
   because every failure below leaves every slug resolving:

   - two pages claiming the same `order`, so the index quietly picks one of them
     to print first and the other reader-facing number is a lie;
   - a gap in `order`, which is what a page deleted or renamed looks like from
     the outside, and which nothing else notices;
   - a `readNext` that resolves but points sideways or backwards, which is how a
     placeholder written while the spine was half-finished survives into the
     published site. S4.3 shipped exactly that on purpose — concept eight was
     pointed at concept one because a dangling slug fails the build and an empty
     `readNext` says nothing — and the only thing that was going to catch it
     later was somebody remembering.

   So: the numbering is a permutation of one..N, the file name is the slug, and
   following the first `readNext` from the first page visits every page in
   `order`. The last page is allowed to point anywhere, because it has to point
   somewhere and there is nothing after it. */

import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";
import { parse } from "yaml";

const DIR = new URL("../src/content/concepts/", import.meta.url);

/** Every concept, as [file name, parsed entry], read off disk rather than
    through `astro:content` — a test that went through the loader would be
    testing the loader. */
const concepts = readdirSync(DIR)
  .filter((name) => name.endsWith(".yaml"))
  .map((name) => [name, parse(readFileSync(new URL(name, DIR), "utf8"))]);

test("the spine is numbered from one with no gap and no repeat", () => {
  const orders = concepts.map(([, entry]) => entry.order).sort((a, b) => a - b);
  const expected = concepts.map((_, i) => i + 1);

  assert.deepEqual(
    orders,
    expected,
    `concept \`order\` is the reading order and the nav order, so it has to be a permutation of ` +
      `1..${concepts.length}. Got [${orders.join(", ")}]. A repeat makes the index pick one of ` +
      `the two arbitrarily; a gap is what a deleted page looks like from outside.`
  );
});

test("a concept's file name is its slug", () => {
  for (const [name, entry] of concepts) {
    assert.equal(
      entry.slug,
      name.replace(/\.yaml$/, ""),
      `${name} declares slug "${entry.slug}". The file name is already the URL, so a disagreement ` +
        `re-routes the page while every other entry goes on linking to it by the old slug.`
    );
  }
});

test("following readNext from the first page walks the whole spine in order", () => {
  const byOrder = [...concepts].sort(([, a], [, b]) => a.order - b.order).map(([, e]) => e);
  const bySlug = new Map(byOrder.map((entry) => [entry.slug, entry]));

  const walked = [];
  let at = byOrder[0];
  while (at && !walked.includes(at.slug)) {
    walked.push(at.slug);
    at = bySlug.get(at.readNext?.[0]);
  }

  assert.deepEqual(
    walked,
    byOrder.map((entry) => entry.slug),
    `starting at order ${byOrder[0].order} and following the first \`readNext\` each time has to ` +
      `reach every concept in \`order\`. It stopped after [${walked.join(" → ")}]. A page whose ` +
      `first readNext points anywhere but the next one is a reader sent backwards, and it fails ` +
      `no other check because the slug resolves.`
  );

  /* The last page is the exception and is left alone on purpose: it has to name
     something, and everything it can name is behind it. */
  const last = byOrder.at(-1);
  assert.ok(
    last.readNext.length > 0,
    `${last.slug} is the end of the spine and names nothing to read next, which leaves the reader ` +
      `at a full stop. Point it back into the spine.`
  );
});
