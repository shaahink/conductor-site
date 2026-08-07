# conductor-site - a field guide to agentic engineering Phase Tracker

**Plan:** conductor-site - a field guide to agentic engineering | **Branch:** `main` | **Design doc:** docs/SPEC.md

## Handoff (overwrite this block, ≤12 lines, no history)

last: **session 18** delivered **S7.3** plus the front page. QA of session 17: **no findings** —
  the battery was green from the tree as inherited, before any edit. But **CI had been red on
  `main` for six commits** while every session reported a green local battery, and both were
  true. `node:path` `basename` is platform-specific: the run store records **Windows** paths, so
  on the Linux runner `basename("C:\code\conductor-site")` came back whole, this site's own run
  stopped being recognised as its own, and a private repo's name was never extracted from its
  path. 3 of 103 cases failed there and passed here. `lastSegment` splits on both separators;
  `d95f457` is the first green CI of this run. **Always check `gh run list`, not just the battery.**
now on disk: **bug #6 closed** by `.github/workflows/gates.yml` — `seo` and `a11y` run whole on
  the runner, plus two NEW store-free halves: **`npm run evidence:cited`** (every cited key
  resolves against the **committed** corpus; staleness needs the store) and
  **`npm run anonymity:shapes`** (the 8 secret-shape patterns; the derived name list is never
  written down, so it cannot travel). Each prints on every green run which half it did not do.
  Full `evidence`/`anonymity` unchanged — derived list byte-identical at 51/15/4/41. Both new
  halves proven **red** as well as green. Bug #6's premise was half wrong: the shared pipeline
  runs `npm run check`, which here is `astro check && node --test`, so the tests **do** run in CI.
  Also **SPEC Part VII requirement 2** — the front page — was owned by **no checkpoint** and was
  still the template's stub with every gate green on it. It now leads with the evidence strip then
  the ten concepts read from the collection in `order` (`d23da09`, bug #9 closed).
next: **S7.4, and it is the owner's**. HUMAN: the owner reads the three reports for anonymisation
  and looks at the front page in both themes. `docs/evidence/S7.4-home-mocha.png` and `-latte.png`
  were taken from production **before** the front page landed and now show the old stub —
  **re-take them once `d23da09` deploys**, then that pair is what the owner reviews.
open: **new bug #8** — there is **no favicon at all**: `public/` ships none of the four names
  sitekit looks for and `Base.astro` links no icon, so every tab shows the blank glyph and the
  editor's webmanifest is iconless (it warns on every build). Filed not fixed: the mark is a
  design decision. #3, #4, #5, #7 still open; #6 and #9 closed by this session. SPEC Part V
  article 3's `26 costed`/`15.5M` are stale (now **30**/**16.8M**). Article 1's `$52.06`/`23.2%`
  correction, concept 2's advisor split and concept 8's "push-only" still stand.
tooling-new: **`node:path` is platform-specific and the store is not** — any code reading a path
  out of `conductor history` must split on both separators, because those paths were recorded on
  Windows and CI is Linux. **The shared `evidence` Zod const must sit ABOVE every schema that uses
  it**: using it earlier fails as "Cannot access 'evidence' before initialization" reported against
  `astro.config.mjs`, which reads as a broken config rather than an ordering problem.
  **`EvidenceStrip` captions its own corpus group** with "N runs across N repositories", so citing
  `totalRuns`/`totalRepos` as figures prints them twice. `conductor task` has **no `--add`**.
tooling: an Astro comment is a JSX expression: it may not sit between </head> and <body>, may not contain an angle-bracketed tag, and one ts(2657) hides every other diagnostic in the file. Astro ships <!-- --> to the browser (2,632 bytes a page here) so use {/* */}, and any dist-scanning gate must strip comments first. npx cannot run under conductor bg (use node node_modules/astro/bin/astro.mjs preview --port 4321); bg start takes --purpose and bg stop takes the numeric pid. Never put backticks in a node -e string from the Bash tool, and never round-trip a content file through PowerShell Get-Content/Set-Content (mojibake + BOM) - mutate with node, write scratch under the repo, delete it. Commit messages to a file, then -F. Prose refuses any number of two digits or more. npm run content rewraps YAML, so run it before quoting your own lines back. A failed Astro build exits 0xC0000409, not 1. meta.description caps at 160 chars. Do not select * from sessions through run_query; conductor history --json emits a UTF-8 BOM on Windows; one run.db holds several runs, so filter by run_id. Battery is ~90s in the foreground. Chrome DevTools MCP takes the screenshots: resize_page then take_screenshot with filePath.


## Baseline numbers (from run.db)

| Metric | Value |
|---|---|
| Total checkpoints | 28 |
| Done | 0 |
| Claimed (unconfirmed) | 27 |

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
| S3.3 | The evidence strip component renders figures from `corpus.json` by key, and a page that names a key absent from the corpus fails the build rather than rendering blank | DONE | 0f5f4c9 | docs/evidence/S3.3-evidence-strip.txt |
| S3.4 | The `evidence` gate re-runs the harvest and goes red when `corpus.json` is stale or a cited key is missing, proven by a deliberate staleness both ways | DONE | 0f5f4c9 | docs/evidence/S3.4-evidence-gate.txt |

### S4 — 

| # | Checkpoint | Status | Commit | Evidence |
|---|-----------|--------|--------|----------|
| S4.1 | Concepts 1–3 (agentic engineering, multi-agent orchestration, context engineering) written, each citing Conductor by `file:line` and each carrying evidence keys that resolve | DONE | 690304d | docs/evidence/S4.1-concepts.md |
| S4.2 | Concepts 4–6 (token economics, evals and gates, independent verification) written to the same bar | DONE | 690304d | docs/evidence/S4.2-concepts.md |
| S4.3 | Concepts 7–8 (durable execution, human-in-the-loop) written to the same bar | DONE | adbe41f | docs/evidence/S4.3-concepts.md |
| S4.4 | Concepts 9–10 (agent observability, agent memory) written, the spine reads in `order` end to end, and every `file:line` citation is verified to still resolve against `shaahink/conductor` at a named commit | DONE | adbe41f | docs/evidence/S4.4-concepts.md |

### S5 — 

| # | Checkpoint | Status | Commit | Evidence |
|---|-----------|--------|--------|----------|
| S5.1 | "What an autonomous run actually costs" — the corpus P&L including the waste, every figure keyed to `corpus.json` | DONE | 1ef5db5 | docs/evidence/S5.1-what-a-run-costs.md |
| S5.2 | "Never believe the agent" — verification as a separate program, built around the 29 red gates rather than the 648 green ones | DONE | 1ef5db5 | docs/evidence/S5.2-never-believe-the-agent.md |
| S5.3 | "The nudge that sat below the median" — the measured-budget method, written so a reader can run it on their own store | DONE | 3896cb8 | docs/evidence/S5.3-the-nudge-below-the-median.md |
| S5.4 | "The ledger that lied" — telemetry you cannot trust, and what it took to fix it | DONE | 239d249 | docs/evidence/S5.4-the-ledger-that-lied.md |

### S6 — 

| # | Checkpoint | Status | Commit | Evidence |
|---|-----------|--------|--------|----------|
| S6.1 | Report A, the fleet round, published as a scenario with no client name, no private repo name and no field-note prose — and a check that greps the built output for the forbidden list | DONE | fcbbb72 | docs/evidence/S6.1-the-fleet-round.md |
| S6.2 | Report B, the long build that ended at 45 of 46, published with the shortfall as the subject rather than a footnote | DONE | fcbbb72 | docs/evidence/S6.2-the-long-build.md |
| S6.3 | Report C, the engine run with an evaluation suite as its release gate | DONE | fcbbb72 | docs/evidence/S6.3-the-engine-run.md |
| S6.4 | `/runs` lists all 18 runs from harvested data with generalised labels and real numbers, and names the three abandoned July runs as abandoned rather than in-flight | DONE | 9afde8c | docs/evidence/S6.4-the-corpus-index.md |

### S7 — 

| # | Checkpoint | Status | Commit | Evidence |
|---|-----------|--------|--------|----------|
| S7.1 | SEO and social: canonicals, sitemap, robots, OG images per section, `astro.config` `site` pointing at the real production URL | DONE | f7f7d6f | docs/evidence/S7.1-seo-and-social.md |
| S7.2 | Accessibility and performance pass — keyboard reachable, landmarks, focus visible, reduced motion honoured, both themes legible, no layout shift on theme flip | DONE | 9309485 | docs/evidence/S7.2-accessibility-and-performance.md |
| S7.3 | Generated files regenerated and clean (`npm run headers`, `npm run content`, `npm run editor`), README written, and the repo's CI green on `main` | DONE | d95f457 | docs/evidence/S7.3-generated-readme-ci.md |
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
