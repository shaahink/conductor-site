/* The tag vocabulary, held together across the two files that own halves of it.
   ---------------------------------------------------------------------------
   `src/content/schema.ts` owns the slugs, because that is where the build can
   refuse an unknown one; `src/lib/tags.ts` owns the label and the sentence a
   reader sees. Split for a reason the schema's own header gives — but a split
   pair is a pair that can drift, and both directions of drift ship something
   broken: a slug with no description is a tag page with nothing on it, and a
   description with no slug is a paragraph nobody can reach.

   The last two run against the content, and they are about whether the
   vocabulary is doing its job rather than whether it is consistent. A tag that
   lands on one page is a page; a tag on everything is a mood. */
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";
import { parse } from "yaml";

import { TAGS } from "../src/content/schema.ts";
import { TAG_INFO, allTags, tagHref } from "../src/lib/tags.ts";

const entries = ["concepts", "articles", "reports"].flatMap((dir) =>
  readdirSync(new URL(`../src/content/${dir}`, import.meta.url)).map((file) => ({
    dir,
    id: file.replace(/\.yaml$/, ""),
    data: parse(readFileSync(new URL(`../src/content/${dir}/${file}`, import.meta.url), "utf8"))
  }))
);

test("the two halves of the vocabulary are the same list", () => {
  /* `src/lib/tags.ts` writes its `Tag` union out by hand rather than deriving
     it from `TAGS`, because a value import across that boundary does not
     resolve under `node --test` — its own header explains why. This is the
     guard that duplication was traded for, and it has to run in both
     directions: a slug the schema would refuse, and a slug the schema accepts
     with nothing to say about it. */
  assert.deepEqual(
    Object.keys(TAG_INFO).slice().sort(),
    TAGS.slice().sort(),
    "the enum and the descriptions have drifted apart"
  );
});

test("every slug in the vocabulary has a label and a sentence", () => {
  const missing = TAGS.filter((tag) => !TAG_INFO[tag]);

  assert.deepEqual(missing, [], "a tag with no description publishes a page that says nothing");

  for (const tag of TAGS) {
    assert.ok(TAG_INFO[tag].label.trim(), `${tag} has an empty label`);
    assert.ok(
      TAG_INFO[tag].blurb.length > 60,
      `${tag}'s blurb is a stub — it is the standfirst of a whole page`
    );
  }
});

test("every description belongs to a slug the schema will accept", () => {
  const orphans = Object.keys(TAG_INFO).filter((tag) => !TAGS.includes(tag));

  assert.deepEqual(orphans, [], "a description with no slug is a paragraph nobody can reach");
});

test("the tag route is built in one place", () => {
  assert.equal(tagHref("cost"), "/tags/cost/");
  assert.equal(allTags().length, TAGS.length);
});

test("every entry carries at least one tag", () => {
  const untagged = entries
    .filter((entry) => !(entry.data.tags ?? []).length)
    .map((entry) => `${entry.dir}/${entry.id}`);

  assert.deepEqual(
    untagged,
    [],
    "an untagged entry is reachable only from its own section — which is the situation tags exist to fix"
  );
});

test("no tag is empty, and none is on everything", () => {
  const counts = new Map(TAGS.map((tag) => [tag, 0]));
  for (const entry of entries) {
    for (const tag of entry.data.tags ?? []) counts.set(tag, counts.get(tag) + 1);
  }

  const empty = [...counts].filter(([, n]) => n === 0).map(([tag]) => tag);
  assert.deepEqual(empty, [], "a tag nothing carries is a promise the vocabulary has not kept");

  const everywhere = [...counts]
    .filter(([, n]) => n > entries.length * 0.8)
    .map(([tag, n]) => `${tag} (${n}/${entries.length})`);
  assert.deepEqual(
    everywhere,
    [],
    "a tag on nearly everything separates nothing from anything — it is a mood, not a subject"
  );
});

test("a tag joins more than one collection, which is the whole point of having one", () => {
  const spread = new Map(TAGS.map((tag) => [tag, new Set()]));
  for (const entry of entries) {
    for (const tag of entry.data.tags ?? []) spread.get(tag).add(entry.dir);
  }

  const stuck = [...spread]
    .filter(([, dirs]) => dirs.size < 2)
    .map(([tag, dirs]) => `${tag} (only ${[...dirs].join(", ")})`);

  assert.deepEqual(
    stuck,
    [],
    "a tag confined to one collection duplicates that section's index; it earns its place by " +
      "joining pages the navigation keeps apart"
  );
});
