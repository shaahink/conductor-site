# conductor-site Phase Tracker

**Plan:** conductor-site - a field guide to agentic engineering | **Branch:** `main` | **Design doc:** docs/SPEC.md

## Handoff (overwrite this block, ≤12 lines, no history)

last: **planning session** (2026-08-06, by hand, no conductor session). Repo created from
  `shaahink/site-template`, `npm install` clean, `npm run check` 0 errors, `npm run build` green
  (3 pages). The 18-run corpus was consolidated into the machine state home first — seven legacy
  `.conductor/run.db` files imported the conductor way — so S3 has real data to harvest on day one.
  docs/SPEC.md is the authority and is complete: face, content model, the ten concepts, the four
  articles, the three reports, the anonymisation rule, and twelve traps in Appendix B.
do not re-derive: checkpoint counts come from `conductor history --json`, NOT from SQL — a naive
  `CheckpointConfirmed` count answers 65 where the engine answers 287/300 (SPEC Part VI).
  `Shamshir/.conductor/run.db` is an empty stub and was deliberately not imported.
next: **S1.1** — read docs/SPEC.md Part II, then lift the sixteen colour roles out of
  `C:/code/conductor/face-go/internal/widgets/color.go` for BOTH mocha and latte. Take latte from
  that file, never from the Catppuccin website: the shipped latte is darkened in-hue and stock
  latte fails the contrast bar this site inherits.

## Baseline numbers

| Metric | Value |
|---|---|
| Total checkpoints | 28 |
| Done | 0 |
| Stages | 7 |

## Checkpoints

Status ∈ TODO · IN PROGRESS · DONE · DONE ✓ (confirmed) · BLOCKED · SKIPPED. Evidence = an artifact path
produced by this run (a code path is not evidence). Agent claims are marked DONE; the engine confirms as DONE ✓.

### S1 — The face

| # | Checkpoint | Status | Commit | Evidence |
|---|-----------|--------|--------|----------|
| S1.1 | The sixteen colour roles ship as CSS custom properties for both mocha and latte, lifted from the Face's own `color.go` rather than from upstream Catppuccin, with a test that fails when any role misses the Face's contrast bar (text ≥4.5:1, semantics and overlay ≥3:1, quiet roles ≥1.5:1 and ordered) | TODO | - | - |
| S1.2 | Typography and spacing: a humanist sans body at a 62–72ch measure through the Astro Fonts API consuming `cssVariable`, monospace reserved for machine truth, and a type scale used by name — no page hardcodes a size or a hex | TODO | - | - |
| S1.3 | The layout shell — top bar, three sections, reading column, sticky in-page TOC on wide viewports — plus a theme toggle that follows `prefers-color-scheme`, persists to `localStorage`, and survives first paint without a flash | TODO | - | - |
| S1.4 | The template's two `checkPlaceholders` `allow:` escapes are deleted and the build is green without them, so this site's own copy is guarded from here on | TODO | - | - |

### S2 — The content model

| # | Checkpoint | Status | Commit | Evidence |
|---|-----------|--------|--------|----------|
| S2.1 | `concepts`, `articles` and `reports` exist as typed collections — Zod-only schemas in `schema.ts`, loaders in `content.config.ts`, an entry each in the `editable` map — with the concept schema carrying the five-move shape from SPEC Part III including `evidence` as keys rather than values | TODO | - | - |
| S2.2 | The three index pages and the nav render from the collections, ordered by `order`, with `readNext` resolving to real entries and a build that fails on a dangling one | TODO | - | - |
| S2.3 | Every page carries `data-sk-edit` annotations that resolve, real `meta.description` and `meta.ogDescription`, and `npm run check` reports zero errors | TODO | - | - |
| S2.4 | One concept page is written end to end as the worked example that proves the shape holds, and it passes all three litmus tests in SPEC Part I | TODO | - | - |

### S3 — The harvest

| # | Checkpoint | Status | Commit | Evidence |
|---|-----------|--------|--------|----------|
| S3.1 | `scripts/harvest.mjs` reads `conductor history --json --limit 0` for run-level truth and read-only SQLite for what that does not expose (costs by category, gate pass rates, bugs, scores, event counts, rollovers), and writes `src/data/corpus.json` | TODO | - | - |
| S3.2 | `anonymise.json` maps run id → published scenario label, and the harvest **fails closed**: a run with no entry is excluded from the corpus rather than published under its real name, proven by a test that adds an unmapped run | TODO | - | - |
| S3.3 | The evidence strip component renders figures from `corpus.json` by key, and a page that names a key absent from the corpus fails the build rather than rendering blank | TODO | - | - |
| S3.4 | The `evidence` gate re-runs the harvest and goes red when `corpus.json` is stale or a cited key is missing, proven by a deliberate staleness both ways | TODO | - | - |

### S4 — The concept spine

| # | Checkpoint | Status | Commit | Evidence |
|---|-----------|--------|--------|----------|
| S4.1 | Concepts 1–3 (agentic engineering, multi-agent orchestration, context engineering) written, each citing Conductor by `file:line` and each carrying evidence keys that resolve | TODO | - | - |
| S4.2 | Concepts 4–6 (token economics, evals and gates, independent verification) written to the same bar | TODO | - | - |
| S4.3 | Concepts 7–8 (durable execution, human-in-the-loop) written to the same bar | TODO | - | - |
| S4.4 | Concepts 9–10 (agent observability, agent memory) written, the spine reads in `order` end to end, and every `file:line` citation is verified to still resolve against `shaahink/conductor` at a named commit | TODO | - | - |

### S5 — The articles

| # | Checkpoint | Status | Commit | Evidence |
|---|-----------|--------|--------|----------|
| S5.1 | "What an autonomous run actually costs" — the corpus P&L including the waste, every figure keyed to `corpus.json` | TODO | - | - |
| S5.2 | "Never believe the agent" — verification as a separate program, built around the 29 red gates rather than the 648 green ones | TODO | - | - |
| S5.3 | "The nudge that sat below the median" — the measured-budget method, written so a reader can run it on their own store | TODO | - | - |
| S5.4 | "The ledger that lied" — telemetry you cannot trust, and what it took to fix it | TODO | - | - |

### S6 — The reports

| # | Checkpoint | Status | Commit | Evidence |
|---|-----------|--------|--------|----------|
| S6.1 | Report A, the fleet round, published as a scenario with no client name, no private repo name and no field-note prose — and a check that greps the built output for the forbidden list | TODO | - | - |
| S6.2 | Report B, the long build that ended at 45 of 46, published with the shortfall as the subject rather than a footnote | TODO | - | - |
| S6.3 | Report C, the engine run with an evaluation suite as its release gate | TODO | - | - |
| S6.4 | `/runs` lists all 18 runs from harvested data with generalised labels and real numbers, and names the three abandoned July runs as abandoned rather than in-flight | TODO | - | - |

### S7 — Ship

| # | Checkpoint | Status | Commit | Evidence |
|---|-----------|--------|--------|----------|
| S7.1 | SEO and social: canonicals, sitemap, robots, OG images per section, `astro.config` `site` pointing at the real production URL | TODO | - | - |
| S7.2 | Accessibility and performance pass — keyboard reachable, landmarks, focus visible, reduced motion honoured, both themes legible, no layout shift on theme flip | TODO | - | - |
| S7.3 | Generated files regenerated and clean (`npm run headers`, `npm run content`, `npm run editor`), README written, and the repo's CI green on `main` | TODO | - | - |
| S7.4 | **ownerGated** — the Vercel project is linked and the site is live at its production URL, the owner has read the three reports for anonymisation, and the front page has been looked at in both themes | TODO | - | - |

## Dependencies

```
S1 → S2 → S3 → S4 → S5 → S6 → S7
(S3 must land before S4: concept pages cite evidence keys that only exist once the corpus does)
```
