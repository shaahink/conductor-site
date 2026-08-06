/* "No page hardcodes a size or a hex" is a promise, and a promise nothing
   checks is a preference. This is the check.

   It reads every stylesheet and every `<style>` block the site owns and fails
   on three things: a colour literal outside tokens.css, a size literal
   outside type.css, and a physical left/right property anywhere. The first
   two are the S1 acceptance. The third is the fleet's rule (AGENTS.md): the
   sites are bidirectional, so CSS stays on logical axes and RTL costs nothing
   later.

   It also checks the one trap that fails silently: Astro hashes font family
   names at build time, so a stylesheet naming a family renders the fallback
   forever and nothing complains. Every `cssVariable` astro.config declares
   must be consumed by name in type.css.

   Run: `npm test`, and `npm run check`, which runs it. */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative, sep } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "src");

/* The two files that are allowed literals, because they are where the site's
   literals live. Everything else spends them by name. */
const COLOUR_SOURCE = join("src", "styles", "tokens.css");
const SIZE_SOURCE = join("src", "styles", "type.css");

/* The review widget's chrome is the template's own sealed component: it
   re-declares every inherited property precisely so the site's CSS cannot
   leak in and its own cannot leak out, and it ships a deliberately neutral
   palette for a site to restyle later. Restyling it in this site's roles is
   real work, not a token sweep, and it is tracked as a bug rather than
   smuggled in here. */
const SEALED = [join("src", "scripts", "feedback-chrome.css")];

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/* Every piece of CSS this site owns, as {file, css} — whole stylesheets, plus
   the `<style>` blocks out of .astro files. */
function siteCss() {
  const out = [];
  for (const entry of readdirSync(SRC, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const full = join(entry.parentPath ?? entry.path, entry.name);
    const rel = relative(ROOT, full);
    if (SEALED.includes(rel)) continue;
    if (entry.name.endsWith(".css")) {
      out.push({ file: rel.split(sep).join("/"), css: readFileSync(full, "utf8") });
    } else if (entry.name.endsWith(".astro")) {
      const source = readFileSync(full, "utf8");
      const blocks = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
      if (blocks.length) out.push({ file: rel.split(sep).join("/"), css: blocks.join("\n") });
    }
  }
  return out;
}

const SHEETS = siteCss();

test("the site has stylesheets to check", () => {
  /* A scanner that silently finds nothing passes forever. */
  assert.ok(SHEETS.length >= 3, `expected to find the site's stylesheets, found ${SHEETS.length}`);
});

test("no colour literal outside tokens.css", () => {
  const literal = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|lab)\s*\(/g;
  for (const { file, css } of SHEETS) {
    if (file === COLOUR_SOURCE.split(sep).join("/")) continue;
    const found = [...stripComments(css).matchAll(literal)].map((m) => m[0]);
    assert.deepEqual(
      found,
      [],
      `${file} writes a colour literal (${found.join(", ")}). Colours are roles from tokens.css — a hex is correct in mocha and wrong in latte.`
    );
  }
});

test("no font-size literal outside type.css", () => {
  for (const { file, css } of SHEETS) {
    if (file === SIZE_SOURCE.split(sep).join("/")) continue;
    for (const decl of stripComments(css).matchAll(/font-size\s*:\s*([^;}]+)/g)) {
      const value = decl[1].trim();
      assert.ok(
        value.includes("var(") || value === "inherit",
        `${file} writes \`font-size: ${value}\`. Sizes are steps from type.css, asked for by name.`
      );
    }
  }
});

/* The trap: the built CSS says `font-family:"Source Sans 3-514be13c4afd4c18"`.
   A stylesheet that writes the plain family name matches nothing and renders
   the fallback, forever, without a warning. */
test("no font-family names a face; every family comes through a cssVariable", () => {
  for (const { file, css } of SHEETS) {
    for (const decl of stripComments(css).matchAll(/font-family\s*:\s*([^;}]+)/g)) {
      const value = decl[1].trim();
      assert.ok(
        value.includes("var(") || value === "inherit",
        `${file} writes \`font-family: ${value}\`. Astro hashes family names at build time, so a raw name silently renders the fallback. Consume the cssVariable.`
      );
    }
  }
});

test("every font cssVariable astro.config declares is consumed by type.css", () => {
  const config = readFileSync(join(ROOT, "astro.config.mjs"), "utf8");
  const declared = [...config.matchAll(/cssVariable:\s*"(--[a-z0-9-]+)"/g)].map((m) => m[1]);
  assert.ok(declared.length >= 2, "expected astro.config to declare a sans and a mono");
  const type = readFileSync(join(ROOT, SIZE_SOURCE), "utf8");
  for (const variable of declared) {
    assert.ok(
      type.includes(`var(${variable})`),
      `astro.config builds ${variable} but type.css never consumes it — the family it names is being downloaded and never used`
    );
  }
});

/* AGENTS.md: logical properties only, because the fleet's sites are
   bidirectional. This one is cheap to keep and expensive to retrofit. */
test("no physical left/right properties", () => {
  const physical =
    /(?:^|[\s;{])(?:margin|padding|border|inset|scroll-margin|scroll-padding)-(?:left|right)\s*:|(?:^|[\s;{])(?:left|right)\s*:|text-align\s*:\s*(?:left|right)\b|float\s*:\s*(?:left|right)\b/g;
  for (const { file, css } of SHEETS) {
    const found = [...stripComments(css).matchAll(physical)].map((m) => m[0].trim());
    assert.deepEqual(
      found,
      [],
      `${file} uses a physical property (${found.join(", ")}). Use the logical equivalent — inline-start/inline-end — so RTL costs nothing.`
    );
  }
});
