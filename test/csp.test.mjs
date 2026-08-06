/* "Change one, change both" is a comment. This is the check.

   The layout carries one `is:inline` script — the two things that must happen
   before first paint — and Astro does not process inline scripts, so its
   sha256 is maintained by hand in astro.config's CSP block. Edit the snippet
   and forget the hash and nothing fails: not the typecheck, not the build,
   not the deploy. The browser silently refuses to run it, the `js` class
   never lands, and the site's chosen theme flashes on every page load for
   everyone. The only witness is a console the owner is not looking at.

   So the hash is recomputed here from the layout's own text, every run. */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

const layout = readFileSync(join(ROOT, "src", "layouts", "Base.astro"), "utf8");
const config = readFileSync(join(ROOT, "astro.config.mjs"), "utf8");

/* `is:inline` only. A bundled <script> is hashed by Astro itself and must not
   be pinned here — pinning it would rot on every build. */
const inlineScripts = [...layout.matchAll(/<script\s+is:inline\s*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);

const declaredHashes = [...config.matchAll(/"(sha256-[A-Za-z0-9+/=]+)"/g)].map((m) => m[1]);

function sha256(source) {
  return `sha256-${createHash("sha256").update(source, "utf8").digest("base64")}`;
}

test("the layout has an inline script to pin", () => {
  assert.equal(
    inlineScripts.length,
    1,
    `expected exactly one is:inline script in Base.astro, found ${inlineScripts.length} — every one of them needs its own hash in astro.config`
  );
});

test("every inline script's sha256 is declared in the CSP", () => {
  for (const source of inlineScripts) {
    const hash = sha256(source);
    assert.ok(
      declaredHashes.includes(hash),
      `Base.astro's inline script hashes to ${hash}, which astro.config does not list. The browser will refuse to run it and say so only in a console. Declared: ${declaredHashes.join(", ") || "(none)"}`
    );
  }
});

test("the CSP pins no hash that no longer belongs to a script", () => {
  const live = new Set(inlineScripts.map(sha256));
  for (const hash of declaredHashes) {
    assert.ok(
      live.has(hash),
      `astro.config pins ${hash}, which no inline script in Base.astro produces. A stale hash is a hole in the CSP.`
    );
  }
});

/* The snippet's whole reason for being inline is that it beats first paint.
   If it ever moves into a bundled module it stops doing that, and the theme
   flash comes back — silently, because everything still builds. */
test("the inline snippet still does the two things that must beat first paint", () => {
  const [snippet] = inlineScripts;
  assert.match(snippet, /classList\.add\("js"\)/, "the js class gates every progressive-enhancement style");
  assert.match(snippet, /localStorage\.getItem\("theme"\)/, "the stored theme must be applied before the first paint");
  assert.match(snippet, /dataset\.theme/, "the stored theme is applied by writing data-theme on <html>");
  assert.match(snippet, /catch/, "localStorage throws rather than returning null in a blocked context");
});
