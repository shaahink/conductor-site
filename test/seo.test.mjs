/* The social-card map, and the parts of it a build cannot check.
   ---------------------------------------------------------------------------
   `scripts/seo.mjs` is the real gate and it checks the built output, which
   makes it the last thing to run and the slowest to tell you. These are the
   checks that can be made from the files on disk in a few milliseconds, and
   they are the ones that catch the mistake at the moment it is made:

   - a section added to `src/content/sections/` with no card behind it, which
     would silently serve that whole section the front page's card;
   - a card declared with no PNG behind it, which is the grey box;
   - the `/` fallback moved out of last place in `OG_CARDS`, which is a
     one-line edit that quietly gives every page on the site the home card,
     and which nothing on any rendered page would show.

   The manifest is checked here too, because a card list and a card manifest
   that disagree is a state the build is perfectly happy with. */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";
import { parse } from "yaml";

import { OG_CARDS, ogCardFor, ogCardPath } from "../src/lib/seo.ts";

const SECTIONS = new URL("../src/content/sections/", import.meta.url);
const PUBLIC = new URL("../public/", import.meta.url);
const MANIFEST = new URL("../src/data/og-cards.json", import.meta.url);

/** Every section page, as [file name, parsed entry]. */
const sections = readdirSync(SECTIONS)
  .filter((name) => name.endsWith(".yaml"))
  .map((name) => [name, parse(readFileSync(new URL(name, SECTIONS), "utf8"))]);

test("the / fallback is last, so it cannot swallow the sections above it", () => {
  const fallback = OG_CARDS.findIndex((card) => card.base === "/");
  assert.notEqual(fallback, -1, "OG_CARDS has no / fallback; a page could then have no card");
  assert.equal(
    fallback,
    OG_CARDS.length - 1,
    "the / card is not last in OG_CARDS. `find` takes the first match, so every canonical " +
      "would resolve to it and the whole site would share one card."
  );
});

test("no two cards share a key or a base", () => {
  const keys = OG_CARDS.map((card) => card.key);
  const bases = OG_CARDS.map((card) => card.base);
  assert.equal(new Set(keys).size, keys.length, `duplicate card key in ${keys.join(", ")}`);
  assert.equal(new Set(bases).size, bases.length, `duplicate card base in ${bases.join(", ")}`);
});

test("every section on the site has its own card", () => {
  for (const [file, section] of sections) {
    const base = section.meta.canonical;
    const card = OG_CARDS.find((entry) => entry.base === base);
    assert.ok(
      card,
      `sections/${file} publishes "${base}" and no card covers it, so every page in that ` +
        `section would be shared under the front page's card. Add { key, base: "${base}" } to ` +
        `OG_CARDS in src/lib/seo.ts and take the screenshot.`
    );
  }
});

test("a page inside a section gets that section's card, not the fallback", () => {
  for (const [, section] of sections) {
    const base = section.meta.canonical;
    const card = OG_CARDS.find((entry) => entry.base === base);
    assert.equal(ogCardFor(base), ogCardPath(card.key), `the ${base} index`);
    assert.equal(ogCardFor(`${base}some-entry/`), ogCardPath(card.key), `a page under ${base}`);
  }
});

test("the front page and the 404 fall back to the home card", () => {
  assert.equal(ogCardFor("/"), "/og/home.png");
  /* 404.astro passes its canonical straight to the layout rather than through
     the schema, so it is the one path on the site with no trailing slash. */
  assert.equal(ogCardFor("/404"), "/og/home.png");
});

test("every declared card has a PNG in public/og", () => {
  for (const card of OG_CARDS) {
    const file = new URL(`og/${card.key}.png`, PUBLIC);
    assert.ok(
      existsSync(file),
      `OG_CARDS declares "${card.key}" but public/og/${card.key}.png does not exist. Pages in ` +
        `that section already name it as their og:image, which renders in a feed as a grey ` +
        `box. docs/OG-CARDS.md is the four-step recipe.`
    );
  }
});

test("the card manifest covers exactly the declared cards", () => {
  assert.ok(existsSync(MANIFEST), "src/data/og-cards.json is missing; run `npm run seo:cards`");
  const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
  assert.deepEqual(
    Object.keys(manifest.cards).sort(),
    OG_CARDS.map((card) => card.key).sort(),
    "og-cards.json and OG_CARDS disagree about which cards exist. The manifest is what " +
      "`npm run seo` compares the rendered cards against, so a card missing from it is a card " +
      "whose figures can go stale unnoticed."
  );
  for (const card of OG_CARDS) {
    assert.equal(manifest.cards[card.key].png, ogCardPath(card.key));
    assert.ok(
      manifest.cards[card.key].text.length > 0,
      `og-cards.json has an empty text for "${card.key}"; the staleness check would pass on ` +
        `anything`
    );
  }
});
