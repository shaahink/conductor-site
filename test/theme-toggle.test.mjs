/* The theme toggle's box, which is a layout-shift bug wearing a CSS hat.

   The button showed `Theme` in the markup and `Dark` or `Light` once
   `theme.js` had run. Three different words in a box sized to its contents
   means the box changes width twice: once on load, when the script paints the
   real label — measured at 12px, which dragged the whole nav row with it — and
   again on every flip, `Dark` → `Light`, another 3px. Both are visible, and
   the first is a Cumulative Layout Shift on a page whose only other movement
   is the reader's.

   The fix is to size the button to the widest word it can ever show, before it
   shows any of them: every candidate label is stacked in one CSS grid cell,
   the extras hidden. It works exactly as long as the list of candidates in
   `TopBar.astro` stays equal to the list of words `theme.js` can write. Add a
   third state — `System`, say — to the script and forget the markup, and the
   shift comes back, silently, for that one label only.

   So this file reads both and compares them. It is the cheap half of the
   evidence; the measured half is a trace, in docs/evidence.

   Run: `npm test`, and `npm run check`, which runs it. */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const TOPBAR = readFileSync(fileURLToPath(new URL("../src/components/TopBar.astro", import.meta.url)), "utf8");
const THEME_JS = readFileSync(fileURLToPath(new URL("../src/scripts/theme.js", import.meta.url)), "utf8");

/** The candidate list the markup sizes itself against. */
function declaredLabels() {
  const match = /const LABELS\s*=\s*\[([^\]]*)\]/.exec(TOPBAR);
  assert.ok(match, "TopBar.astro no longer declares a LABELS array — the button has lost its sizer");
  return [...match[1].matchAll(/"([^"]*)"/g)].map((m) => m[1]);
}

/** Every string the script can put into the live label. Read out of the
    script's own LABEL map rather than from a copy kept here, because a copy is
    the thing that goes stale. */
function writtenLabels() {
  const map = /const LABEL\s*=\s*\{([^}]*)\}/.exec(THEME_JS);
  assert.ok(map, "theme.js no longer declares a LABEL map — this test is checking the wrong thing");
  const strings = [...map[1].matchAll(/"([^"]*)"/g)].map((m) => m[1]);
  assert.ok(strings.length >= 2, `expected the toggle to write at least two labels, found ${strings.length}`);
  assert.ok(
    new RegExp("textContent\\s*=\\s*LABEL\\[").test(THEME_JS),
    "theme.js declares a LABEL map but no longer paints from it"
  );
  return strings;
}

test("every label the script can write is one the button was sized for", () => {
  const declared = new Set(declaredLabels());
  for (const label of writtenLabels()) {
    assert.ok(
      declared.has(label),
      `theme.js writes "${label}", which is not in TopBar.astro's LABELS — the button will resize when it appears`
    );
  }
});

test("the label the markup ships is sized for too, and is the only extra one", () => {
  const declared = declaredLabels();
  const written = new Set(writtenLabels());
  const initial = /<span data-theme-label>\{([A-Z_]+)\}<\/span>/.exec(TOPBAR);
  assert.ok(initial, "TopBar.astro's live label is no longer rendered from a named constant");
  assert.equal(initial[1], "INITIAL", "the live label should render INITIAL, the first of LABELS");
  assert.equal(declared[0], "Theme", "INITIAL is LABELS[0]; the markup ships `Theme` before the script knows the scheme");

  const extras = declared.filter((label) => !written.has(label));
  assert.deepEqual(
    extras,
    [declared[0]],
    "LABELS carries a word the button can never show — a sizer for a label that does not exist only makes the button wider"
  );
});

/* The mistake this replaced: sizers for every label *except* the one the
   markup ships. It reads as the tidy version and it does nothing, because the
   first thing the script does is overwrite the live label — and with `Theme`
   gone from the document the track shrinks to `Dark`, which is the 12px shift
   the sizers were added to remove. Measured in a browser, not caught here,
   which is why the count is now asserted rather than the shape. */
test("there is a sizer for every candidate label, the live one included", () => {
  const loop = /LABELS([\s\S]{0,160}?)\.map\(\(label\)/.exec(TOPBAR);
  assert.ok(loop, "TopBar.astro no longer renders its sizers by mapping over LABELS");
  assert.equal(
    loop[1].trim(),
    "",
    `the sizer loop narrows LABELS (\`LABELS${loop[1].trim()}\`) before rendering. ` +
      "Every candidate needs a sizer, the live one included, or the box is only ever as wide as whatever the label currently says."
  );
});

/* The list being right is worth nothing if the CSS stopped stacking. These
   three declarations are the fix: one grid cell, every child in it, the
   extras out of the paint but still in the layout. */
test("the button still stacks its labels in a single grid cell", () => {
  const style = /<style>([\s\S]*)<\/style>/.exec(TOPBAR)[1];
  const has = (selector, declaration) => {
    const block = new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`).exec(style);
    assert.ok(block, `TopBar.astro has no \`${selector}\` rule`);
    assert.ok(
      block[1].includes(declaration),
      `\`${selector}\` no longer declares \`${declaration}\` — the labels are back to sizing the box one at a time`
    );
  };
  has(".theme-toggle", "display: inline-grid");
  has(".theme-toggle > *", "grid-area: 1 / 1");
  has(".theme-toggle .sizer", "visibility: hidden");
});

/* `visibility: hidden` already takes an element out of the accessibility tree,
   so this is belt and braces — but it is cheap belt and braces, and the
   failure it guards against is a screen reader announcing the button as
   "Theme Dark Light", which is worse than the shift the sizers fix. */
test("the sizers are hidden from assistive technology as well as from the paint", () => {
  const sizers = [...TOPBAR.matchAll(/<span class="sizer"([^>]*)>/g)].map((m) => m[1]);
  assert.equal(sizers.length, 1, "expected exactly one `sizer` span, rendered once per extra label");
  assert.ok(sizers[0].includes('aria-hidden="true"'), "the sizer spans are not aria-hidden");
});
