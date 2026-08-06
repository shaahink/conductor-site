# conductor-site - a field guide to agentic engineering Phase Tracker

**Plan:** conductor-site - a field guide to agentic engineering | **Branch:** `main` | **Design doc:** docs/SPEC.md

## Handoff (overwrite this block, ≤12 lines, no history)

last: **session 3** delivered S2.1 and S2.2, and fixed the planning session's `site` URL — the
  short alias belongs to a stranger's rail site, so canonicals now read
  `conductor-site-virid.vercel.app` (a68c0f3). **S7.1 must re-confirm that against the deployed
  URL, not against the config.** QA of session 2: every S1 claim holds on fresh runs — 0 errors,
  build green, generated files regenerate with no diff, all five evidence files present. No
  findings.
now on disk: four collections. `sectionPages` was added beyond the plan's three, because index
  copy written into a component is invisible to `checkPlaceholders` — the same hole the footer
  fell through. `src/lib/collections.ts` is the gate: `ordered()` throws on a slug that does not
  match its file name, on a duplicate `order`, and on a dangling `readNext`, and it runs because
  a page renders it. Two concepts exist so `readNext` resolves to something real. Build is 10
  pages, 56 annotations, 8 content entries placeholder-clean.
next: **S2.3** — every page's annotations already resolve and `check` is 0 errors, so most of it
  is auditing `meta.description` / `meta.ogDescription` on all eight entries and recording it.
  Then **S2.4**: write `context-engineering` end to end against SPEC Part I's three litmus tests
  — it is currently a real but short worked example. Do not render an evidence section; the
  corpus does not exist until S3.
open: bug #2 — `--overlay` prose is ~3.3:1: over the Face's own bar for the role, under WCAG AA
  for normal text; S7.2's call, not a CSS tweak. Evidence keys use **published** scenario labels
  (`the-long-build`, `the-engine-run`, `the-fleet-round`) — S3.2's `anonymise.json` must map run
  ids to exactly those. The wordmark `field guide` and the footer's owner name are owner calls.
tooling: `conductor bg` cannot exec bare `npm` here — use `npm.cmd`; the flag is `--purpose`, and
  it cannot take a quoted compound command, so run the battery in the foreground (it is ~10s).
  A failed Astro build exits 9, not 1. **Never spell a recursive glob inside a `/* */` comment in
  a .ts file** — it closes the comment and `astro sync` dies with PARSE_ERROR.


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
