# Bug #1 — the review widget's chrome, restyled in the site's roles

Session 2, 2026-08-06. Verified against **built output** (`astro build` then
`astro preview` on :4321), driven in Chrome at 1280×820 with `?review=qa`.
Screenshots beside this file: `bug1-widget-mocha.png`, `bug1-widget-latte.png`.

## What was wrong

`src/scripts/feedback-chrome.css` is this repo's file — the kit ships the
widget's mechanics, the site owns its face — and it still carried the
template's neutral grey: `#101010`, `#f4f4f4`, `#666666`, `#9a9a9a` and eleven
`rgba(0, 0, 0, …)` shadows. 66 colour literals. A fixed dark chrome is correct
in mocha and a hole punched in the page in latte, which is the exact failure
the Face's own rule exists to prevent.

`test/tokens.test.mjs` could not see any of it: the file was in a `SEALED`
list that skipped it from all three rules.

## What it wears now

Every rule names a role. Measured in the browser, from the built CSS:

| element | role | mocha | latte |
|---|---|---|---|
| launcher pill | `--accent` on `--base` ink | `rgb(203, 166, 247)` | `rgb(136, 57, 239)` |
| picking state | `--yellow` | `rgb(249, 226, 175)` | *(same rule)* |
| composer sheet | `--surface` | `rgb(49, 50, 68)` | `rgb(204, 208, 218)` |
| sheet hairline | `--selection` | `rgb(69, 71, 90)` | `rgb(188, 192, 204)` |
| scrim | `--mantle` at 80% | `srgb 0.094 0.094 0.145 / 0.8` | `srgb 0.902 0.914 0.937 / 0.8` |
| input | `--base` under `--text` | — | `rgb(239, 241, 245)` / `rgb(76, 79, 105)` |
| Send | `--accent` on `--base` ink | — | `rgb(136, 57, 239)` / `rgb(239, 241, 245)` |
| box-shadow | none | `none` | `none` |

`--green` is the success check and its progress bar; `--blue` is the link in
the toast; nothing else is coloured. Semantic roles carry status only, which is
SPEC Part II.

The widget's font now comes through the site's variables, so it renders the
downloaded face rather than a fallback — the launcher's computed family is
`"Source Sans 3-514be13c4afd4c18"`, the hashed name, which is the same trap
S1.2 measured. `--mono` carries the three pieces of machine truth in the
widget: the picked element's name, the note count badge, the pin numbers.

Shadows are gone rather than re-coloured (SPEC Part II says no shadows). A
floating panel still has to separate from arbitrary page content, so the lift
is `--surface` plus a hairline in `--selection`. A black blur has no role name,
which is how the literals would have come back.

## The gate that missed it now covers it

`test/tokens.test.mjs` no longer skips the file. The `SEALED` list (skip all
three rules) became `SIZE_EXEMPT` (skip the *size* rule only) — 16px on an
input is what stops iOS zooming the page when it takes focus, and a 12px badge
is not a step in a prose scale. Colours and font families are checked like
every other stylesheet. Net: one rule less strict on nothing, two rules more
strict on a 420-line file.

Proven by making it fail. One `var(--blue)` was replaced with the literal it
used to be:

```
$ npm test
✖ no colour literal outside tokens.css
  AssertionError: src/scripts/feedback-chrome.css writes a colour literal
  (#89b4fa). Colours are roles from tokens.css — a hex is correct in mocha and
  wrong in latte.
  ℹ pass 16 · fail 1
```

Reverted; `npm run check` is 17/17 and `npm run build` is green with 4
annotations resolving.

## Found while looking, not fixed here

- **The footer shipped `New Site` on every page.** `checkPlaceholders` reads
  the `editable` map, and a name written into a component is not content, so
  the gate never saw it. Fixed in the same session, separate commit.
- **`--overlay` prose sits near 3.3:1** on its base in both schemes — over the
  Face's own bar for the role (≥3:1, `theme_test.go:44-86`) and under WCAG AA
  for normal-size text. It is the widget's context strip and the home page's
  lead paragraph. Filed as bug #2 for the S7.2 accessibility pass rather than
  changed here: the value is the Face's, and lifting it is a decision about
  this site's relationship to the Face, not a CSS tweak.
