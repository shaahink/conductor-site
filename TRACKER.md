# conductor-site - a field guide to agentic engineering Phase Tracker

**Plan:** conductor-site - a field guide to agentic engineering | **Branch:** `main` | **Design doc:** docs/SPEC.md

## Handoff (overwrite this block, ≤12 lines, no history)

last: **session 2** delivered S1.4 and closed bug #1, so stage S1 is complete. QA of session 1:
  every claim holds on fresh runs — check 0 errors and 17/17 tests, build green at 3 pages with
  4 annotations resolving, `headers`/`content`/`editor` regenerate with no diff, all five
  evidence files present. S1.4's escapes are gone and the gate was proven to bite by putting a
  TODO and a reserved domain back (docs/evidence/S1.4-placeholders.txt).
watch out: `checkPlaceholders` reads the `editable` map, so a placeholder written into a
  **component** is invisible to it — the footer printed `New Site` on every page for three
  sessions (cb40575). Grep built HTML, not only content.
tooling: `conductor bg` cannot exec bare `npm` here (MODULE_NOT_FOUND) — use `npm.cmd`, or
  `node node_modules/astro/bin/astro.mjs preview` for a server; the flag is `--purpose`, and
  `bg stop` takes the numeric PID. A failed Astro build exits 9 on this box, not 1.
next: **S2.1** — the three collections from SPEC Part III: Zod-only schemas in `schema.ts`,
  loaders in `content.config.ts`, an `editable` entry each, `evidence` as keys not values.
  Keep the `notes` section's shape when reworking `homePage`; its key still reads `notes` while
  the front page shows it as "How to read this".
open: bug #2 — `--overlay` prose is ~3.3:1: over the Face's own bar for the role, under WCAG AA
  for normal text (home lead, widget context strip); it is S7.2's call, not a CSS tweak.
  `Toc.astro` + `Reading.astro` are still unrendered until S2.4. The wordmark `field guide` and
  the footer's `Shahin Kiassat` are owner calls.


## Baseline numbers (from run.db)

| Metric | Value |
|---|---|
| Total checkpoints | 28 |
| Done | 0 |
| Claimed (unconfirmed) | 4 |

## Checkpoints

Status ∈ TODO · IN PROGRESS · DONE · DONE ✓ (confirmed) · BLOCKED · SKIPPED. Evidence = artifact path produced by a run this
phase (a code path is not evidence). Agent claims are marked DONE; engine confirms as DONE ✓.

### S1 — 

| # | Checkpoint | Status | Commit | Evidence |
|---|-----------|--------|--------|----------|
| S1.1 | The sixteen colour roles ship as CSS custom properties for both mocha and latte, lifted from the Face's own `color.go` rather than from upstream Catppuccin, with a test that fails when any role misses the Face's contrast bar (text ≥4.5:1, semantics and overlay ≥3:1, quiet roles ≥1.5:1 and ordered) | DONE | f11fe55 | docs/evidence/S1.1-contrast.txt |
| S1.2 | Typography and spacing: a humanist sans body at a 62–72ch measure through the Astro Fonts API consuming `cssVariable`, monospace reserved for machine truth, and a type scale used by name — no page hardcodes a size or a hex | DONE | f11fe55 | docs/evidence/S1.2-type.txt |
| S1.3 | The layout shell — top bar, three sections, reading column, sticky in-page TOC on wide viewports — plus a theme toggle that follows `prefers-color-scheme`, persists to `localStorage`, and survives first paint without a flash | DONE | f11fe55 | docs/evidence/S1.3-shell.md |
| S1.4 | The template's two `checkPlaceholders` `allow:` escapes are deleted and the build is green without them, so this site's own copy is guarded from here on | DONE | b05efc3 | docs/evidence/S1.4-placeholders.txt |

### S2 — 

| # | Checkpoint | Status | Commit | Evidence |
|---|-----------|--------|--------|----------|
| S2.1 | `concepts`, `articles` and `reports` exist as typed collections — Zod-only schemas in `schema.ts`, loaders in `content.config.ts`, an entry each in the `editable` map — with the concept schema carrying the five-move shape from SPEC Part III including `evidence` as keys rather than values | TODO | - | - |
| S2.2 | The three index pages and the nav render from the collections, ordered by `order`, with `readNext` resolving to real entries and a build that fails on a dangling one | TODO | - | - |
| S2.3 | Every page carries `data-sk-edit` annotations that resolve, real `meta.description` and `meta.ogDescription`, and `npm run check` reports zero errors | TODO | - | - |
| S2.4 | One concept page is written end to end as the worked example that proves the shape holds, and it passes all three litmus tests in SPEC Part I | TODO | - | - |

### S3 — 

| # | Checkpoint | Status | Commit | Evidence |
|---|-----------|--------|--------|----------|
| S3.1 | `scripts/harvest.mjs` reads `conductor history --json --limit 0` for run-level truth and read-only SQLite for what that does not expose (costs by category, gate pass rates, bugs, scores, event counts, rollovers), and writes `src/data/corpus.json` | TODO | - | - |
| S3.2 | `anonymise.json` maps run id → published scenario label, and the harvest **fails closed**: a run with no entry is excluded from the corpus rather than published under its real name, proven by a test that adds an unmapped run | TODO | - | - |
| S3.3 | The evidence strip component renders figures from `corpus.json` by key, and a page that names a key absent from the corpus fails the build rather than rendering blank | TODO | - | - |
| S3.4 | The `evidence` gate re-runs the harvest and goes red when `corpus.json` is stale or a cited key is missing, proven by a deliberate staleness both ways | TODO | - | - |

### S4 — 

| # | Checkpoint | Status | Commit | Evidence |
|---|-----------|--------|--------|----------|
| S4.1 | Concepts 1–3 (agentic engineering, multi-agent orchestration, context engineering) written, each citing Conductor by `file:line` and each carrying evidence keys that resolve | TODO | - | - |
| S4.2 | Concepts 4–6 (token economics, evals and gates, independent verification) written to the same bar | TODO | - | - |
| S4.3 | Concepts 7–8 (durable execution, human-in-the-loop) written to the same bar | TODO | - | - |
| S4.4 | Concepts 9–10 (agent observability, agent memory) written, the spine reads in `order` end to end, and every `file:line` citation is verified to still resolve against `shaahink/conductor` at a named commit | TODO | - | - |

### S5 — 

| # | Checkpoint | Status | Commit | Evidence |
|---|-----------|--------|--------|----------|
| S5.1 | "What an autonomous run actually costs" — the corpus P&L including the waste, every figure keyed to `corpus.json` | TODO | - | - |
| S5.2 | "Never believe the agent" — verification as a separate program, built around the 29 red gates rather than the 648 green ones | TODO | - | - |
| S5.3 | "The nudge that sat below the median" — the measured-budget method, written so a reader can run it on their own store | TODO | - | - |
| S5.4 | "The ledger that lied" — telemetry you cannot trust, and what it took to fix it | TODO | - | - |

### S6 — 

| # | Checkpoint | Status | Commit | Evidence |
|---|-----------|--------|--------|----------|
| S6.1 | Report A, the fleet round, published as a scenario with no client name, no private repo name and no field-note prose — and a check that greps the built output for the forbidden list | TODO | - | - |
| S6.2 | Report B, the long build that ended at 45 of 46, published with the shortfall as the subject rather than a footnote | TODO | - | - |
| S6.3 | Report C, the engine run with an evaluation suite as its release gate | TODO | - | - |
| S6.4 | `/runs` lists all 18 runs from harvested data with generalised labels and real numbers, and names the three abandoned July runs as abandoned rather than in-flight | TODO | - | - |

### S7 — 

| # | Checkpoint | Status | Commit | Evidence |
|---|-----------|--------|--------|----------|
| S7.1 | SEO and social: canonicals, sitemap, robots, OG images per section, `astro.config` `site` pointing at the real production URL | TODO | - | - |
| S7.2 | Accessibility and performance pass — keyboard reachable, landmarks, focus visible, reduced motion honoured, both themes legible, no layout shift on theme flip | TODO | - | - |
| S7.3 | Generated files regenerated and clean (`npm run headers`, `npm run content`, `npm run editor`), README written, and the repo's CI green on `main` | TODO | - | - |
| S7.4 | **ownerGated** — the Vercel project is linked and the site is live at its production URL, the owner has read the three reports for anonymisation, and the front page has been looked at in both themes | TODO | - | - |

## Dependencies

```
S1 → S2
S2 → S3
S3 → S4
S4 → S5
S5 → S6
S6 → S7
```
