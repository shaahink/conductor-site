/* The Face's legibility gate, run against this site's CSS.

   Conductor refuses to ship a terminal scheme whose roles cannot be read on
   its own base — `face-go/internal/widgets/theme_test.go:44`, and the
   thresholds below are that file's, copied with its reasoning. This site
   wears the same two schemes, so it inherits the same bar. If it did not, the
   site could publish a theme the tool it documents would reject.

   What is tested is `src/styles/tokens.css` itself, parsed, not a second copy
   of the palette living in this file. A test that re-declares the colours it
   is checking proves only that two literals agree.

   Run: `npm test` (and `npm run check`, which runs it). */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const TOKENS = fileURLToPath(new URL("../src/styles/tokens.css", import.meta.url));

/* The thresholds are not WCAG AA. They are the floor below which the Face's
   own frames stop being readable, chosen so all four curated schemes clear
   them as published — theme_test.go:47. They earn their keep on the fills:
   the active tab paints Base ON Accent and a search match paints Base ON
   Yellow, and contrast is symmetric, so one check covers both directions. */
const MIN_TEXT = 4.5; // primary text carries the frame
const MIN_SEMANTIC = 3.0; // status colours, the Accent/Yellow fills, muted text
const MIN_QUIET = 1.5; // deliberately receding, but never invisible

const TEXT_ROLES = ["text"];
const SEMANTIC_ROLES = ["accent", "blue", "green", "red", "yellow", "peach", "teal", "sky", "overlay"];
const QUIET_ROLES = ["pending", "skipped"];
const STRUCTURE_ROLES = ["base", "mantle", "surface", "selection"];
const ALL_ROLES = [...STRUCTURE_ROLES, ...TEXT_ROLES, ...SEMANTIC_ROLES, ...QUIET_ROLES];

/* Stock Catppuccin Latte, for the five roles the Face darkens in-hue. Present
   only so a test can assert the shipped values are NOT these — provenance,
   not a palette. Anyone who "fixes" latte from the Catppuccin website will
   land on this list and fail. */
const STOCK_LATTE = {
  green: "#40a02b",
  yellow: "#df8e1d",
  peach: "#fe640b",
  teal: "#179299",
  sky: "#04a5e5"
};

/* WCAG 2.x relative luminance and contrast ratio, ported from
   theme_test.go:17 and :29. 1.0 is identical, 21.0 is black on white. */
function relativeLuminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const channel = (v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return (
    0.2126 * channel((n >> 16) & 0xff) +
    0.7152 * channel((n >> 8) & 0xff) +
    0.0722 * channel(n & 0xff)
  );
}

function contrast(a, b) {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/* Parse the shipped CSS. Each palette block opens with a bang-comment naming
   its scheme, and a block runs from that marker to the next marker or to the
   end of the file. Deliberately dumber than a CSS parser: it reads
   what a person reading the file would read, so a token moved outside a
   marked block disappears from the test rather than being silently inferred. */
function parseSchemes(css) {
  const blocks = [];
  const marker = /\/\*!\s*scheme:([a-z]+)\s*\*\//g;
  let match;
  const starts = [];
  while ((match = marker.exec(css)) !== null) starts.push({ name: match[1], at: match.index });
  for (const [i, start] of starts.entries()) {
    const end = i + 1 < starts.length ? starts[i + 1].at : css.length;
    const body = css.slice(start.at, end);
    const roles = {};
    for (const decl of body.matchAll(/--([a-z-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g)) {
      roles[decl[1]] = decl[2].toLowerCase();
    }
    blocks.push({ name: start.name, roles });
  }
  return blocks;
}

const css = readFileSync(TOKENS, "utf8");
const blocks = parseSchemes(css);

test("tokens.css declares both of the Face's default schemes", () => {
  const names = new Set(blocks.map((b) => b.name));
  assert.deepEqual([...names].sort(), ["latte", "mocha"]);
});

test("every block declares all sixteen roles, and no role the Face does not have", () => {
  for (const block of blocks) {
    assert.deepEqual(
      Object.keys(block.roles).sort(),
      [...ALL_ROLES].sort(),
      `scheme ${block.name} does not declare exactly the sixteen roles`
    );
  }
});

/* Latte is declared twice — once under prefers-color-scheme, once under the
   toggle's explicit attribute — because CSS cannot express "either of these"
   in one rule. Duplication drifts, so the drift is what is tested. */
test("the repeated latte blocks are identical", () => {
  const latte = blocks.filter((b) => b.name === "latte");
  assert.ok(latte.length >= 2, "expected latte to be declared for both the media query and the toggle");
  for (const block of latte.slice(1)) {
    assert.deepEqual(block.roles, latte[0].roles, "the latte blocks have drifted apart");
  }
});

test("every role clears the Face's legibility bar on its own base", () => {
  for (const block of blocks) {
    const base = block.roles.base;
    const check = (role, min) => {
      const got = contrast(block.roles[role], base);
      assert.ok(
        got >= min,
        `scheme ${block.name}: ${role} is ${got.toFixed(2)}:1 against base, want >= ${min.toFixed(2)}:1`
      );
    };
    for (const role of TEXT_ROLES) check(role, MIN_TEXT);
    for (const role of SEMANTIC_ROLES) check(role, MIN_SEMANTIC);
    for (const role of QUIET_ROLES) check(role, MIN_QUIET);
  }
});

/* No absolute threshold catches a quiet role that is louder than muted text —
   only the ordering does. `pending` is the checkpoint nobody has reached and
   must recede furthest. theme_test.go:77. */
test("the quiet ladder is ordered: pending recedes furthest", () => {
  for (const { name, roles } of blocks) {
    const against = (role) => contrast(roles[role], roles.base);
    assert.ok(against("pending") < against("skipped"), `scheme ${name}: pending is not quieter than skipped`);
    assert.ok(against("pending") < against("overlay"), `scheme ${name}: pending is not quieter than overlay`);
  }
});

/* A test nothing can trip is decoration. This one pins both ends: the colour
   that motivated the bar must fail it, and the shipped replacement must pass.
   theme_test.go:94. */
test("the bar bites: stock Catppuccin Latte yellow fails it, the shipped yellow passes", () => {
  const latte = blocks.find((b) => b.name === "latte");
  const stock = contrast(STOCK_LATTE.yellow, latte.roles.base);
  assert.ok(
    stock < MIN_SEMANTIC,
    `stock Latte yellow is ${stock.toFixed(2)}:1 on latte base — if this now passes, the bar has been weakened`
  );
  const shipped = contrast(latte.roles.yellow, latte.roles.base);
  assert.ok(shipped >= MIN_SEMANTIC, `shipped latte yellow is ${shipped.toFixed(2)}:1, want >= ${MIN_SEMANTIC}:1`);
});

/* Provenance. If latte were re-copied from the Catppuccin website — the one
   mistake this site's brief calls out by name — these five roles would match
   stock again and the page would go quietly unreadable in light mode. */
test("latte's five darkened roles are the Face's values, not upstream Catppuccin's", () => {
  const latte = blocks.find((b) => b.name === "latte");
  for (const [role, stockHex] of Object.entries(STOCK_LATTE)) {
    assert.notEqual(
      latte.roles[role],
      stockHex,
      `latte ${role} is stock Catppuccin ${stockHex} — take it from face-go/internal/widgets/style.go instead`
    );
  }
});
