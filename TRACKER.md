# conductor-site - a field guide to agentic engineering Phase Tracker

**Plan:** conductor-site - a field guide to agentic engineering | **Branch:** `main` | **Design doc:** docs/SPEC.md

## Handoff (overwrite this block, ≤12 lines, no history)

last: **session 4** delivered S2.3 (a6d5f98) and S2.4 (bd66fc9, evidence 689854a). **S2 is
  complete.** QA of session 3: both its claims hold on fresh artifacts — I re-broke the
  `readNext` gate and the build died naming the entry, the bad slug and the known entries. One
  real finding, fixed: the concept cited `PromptBuilder.cs:276` for the ledger going in first,
  and that line is the *comment* describing it, not the code. Now `:283`, plus
  `PromptBattery.cs:55` beside it, because "goes in first" means nothing until you can see the
  cap cuts from the end.
now on disk: three litmus tests that used to be intentions are gates, all inside `ordered()` so
  they run because a page renders. `src/lib/figures.ts` refuses a figure typed into prose
  (currency, percent, multiplier, ratio, decimal, thousands separator, any count of two digits
  or more — a *single* digit still gets through, and the header says so). `theIdea` naming
  Conductor fails the build. `meta` carries its own bar in `schema.ts` (description 60–160, og
  45–120, neither may be the title, canonical shape-checked) and `collections.ts` holds each
  entry's canonical against the route it is served at, using the section page's own canonical as
  the base. `test/meta.test.mjs` adds annotation **coverage** — and a correction worth having:
  `checkAnnotations` does not ignore an unannotated page, it warns twice and passes. Battery is
  0 errors, 33 tests, 63 annotations on 8 pages, 10 pages built.
next: **S3.1**, the harvest. It now owes five keys, because S3.3 makes a page naming a missing
  one fail the build: `sessions`, `cacheRead`, `ledgerEntries` (context-engineering) and
  `tokensIn`, `tokensOut`, `costPerSession` (token-economics). `ledgerEntries` is countable —
  the store has its own `ledger` table (`SqliteRunStore.Sessions.cs:188`). Checkpoint counts
  come from `conductor history --json --limit 0`, never SQL; anything budget-shaped from
  `conductor budget` / `conductor money`; open every run.db `mode=ro`.
open: bug #2 — `--overlay` prose is ~3.3:1: over the Face's own bar for the role, under WCAG AA
  for normal text; S7.2's call, not a CSS tweak. Published scenario labels are `the-long-build`,
  `the-engine-run`, `the-fleet-round` — S3.2's `anonymise.json` must map run ids to exactly
  those. **S7.1 must re-confirm `site` against the deployed URL, not the config.** The wordmark
  `field guide` and the footer's owner name are owner calls.
tooling: **never `git checkout --` a file whose new version is uncommitted** — it restores HEAD,
  not what you were holding, and it silently reverted a finished page here (the tell was the
  annotation count dropping back). Commit first, break-test second. A `git commit -m` here-string
  breaks on embedded double quotes; write the message to a file and use `-F`. `conductor bg`
  cannot exec bare `npm` — use `npm.cmd`; the battery is ~10s, so run it in the foreground. A
  failed Astro build does not exit 1. **Never spell a recursive glob inside a block comment in a
  .ts file** — it closes the comment and `astro sync` dies with PARSE_ERROR.


## Baseline numbers (from run.db)

| Metric | Value |
|---|---|
| Total checkpoints | 28 |
| Done | 0 |
| Claimed (unconfirmed) | 10 |

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
| S2.1 | `concepts`, `articles` and `reports` exist as typed collections — Zod-only schemas in `schema.ts`, loaders in `content.config.ts`, an entry each in the `editable` map — with the concept schema carrying the five-move shape from SPEC Part III including `evidence` as keys rather than values | DONE | a68c0f3 | docs/evidence/S2.1-collections.txt |
| S2.2 | The three index pages and the nav render from the collections, ordered by `order`, with `readNext` resolving to real entries and a build that fails on a dangling one | DONE | a68c0f3 | docs/evidence/S2.2-indexes.txt |
| S2.3 | Every page carries `data-sk-edit` annotations that resolve, real `meta.description` and `meta.ogDescription`, and `npm run check` reports zero errors | DONE | a6d5f98 | docs/evidence/S2.3-annotations-meta.txt |
| S2.4 | One concept page is written end to end as the worked example that proves the shape holds, and it passes all three litmus tests in SPEC Part I | DONE | a6d5f98 | docs/evidence/S2.4-context-engineering.md |

### S3 — 

| # | Checkpoint | Status | Commit | Evidence |
|---|-----------|--------|--------|----------|
| S3.1 | `scripts/harvest.mjs` reads `conductor history --json --limit 0` for run-level truth and read-only SQLite for what that does not expose (costs by category, gate pass rates, bugs, scores, event counts, rollovers), and writes `src/data/corpus.json` | DONE | - | docs/evidence/S3.1-harvest.txt |
| S3.2 | `anonymise.json` maps run id → published scenario label, and the harvest **fails closed**: a run with no entry is excluded from the corpus rather than published under its real name, proven by a test that adds an unmapped run | DONE | - | docs/evidence/S3.2-fails-closed.txt |
| S3.3 | The evidence strip component renders figures from `corpus.json` by key, and a page that names a key absent from the corpus fails the build rather than rendering blank | IN PROGRESS | - | - |
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
