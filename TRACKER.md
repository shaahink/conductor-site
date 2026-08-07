# conductor-site - a field guide to agentic engineering Phase Tracker

**Plan:** conductor-site - a field guide to agentic engineering | **Branch:** `main` | **Design doc:** docs/SPEC.md

## Handoff (overwrite this block, ≤12 lines, no history)

last: **session 12** delivered **S5.3** — machinery in `3896cb8`, article in `c33d05b`. QA of
  session 11: **no findings** — battery re-run green before any edit (0 errors, 45→49 tests, build
  exit 0, 306 annotations on 17 pages, evidence green over 13 entries); both articles on disk
  match their claimed shape.
now on disk: articles 1–3, all figure-free. Battery at head: **0 errors, 57 tests, build 20 pages
  / 341 annotations, evidence gate green over 14 cited entries.** New: a **third evidence
  namespace, `windows`** — `conductor budget <run> --json` once per published run, 22 windows, 8
  under a measured ceiling. Content names them in **`evidence.windows`**. Window keys are
  `<run-label>-uncapped` / `<run-label>-capped-<N>m`. **A window need not carry every key** (an
  uncapped one has no nudge/headroom/wrap-up); the build fails only when *no named window* has a
  cited key. New corpus keys: `cappedWindows` 8/22, `sessionsUnderACeiling` 168, `nudgesDelivered`
  122, `nudgesHonoured` 72/122, `killedAtACeiling` 50, `killedAfterANudge` **50/50**.
next: **S5.4** ("The ledger that lied"), the last of stage S5. **It is fully measured — the ledger
  note has every figure, do not re-derive.** Corpus-wide: 53 rolled-over sessions, **0** with a
  commit, **0** with a gate summary, **0** with a claim, 4 with a result summary, **52 with a
  digest**; against 287 other sessions with 246 commits, 264 gate summaries, 203 claims, 273
  result summaries and only **139** digests. That inversion is the article. Cause and fix are both
  in the engine at `1632b9f`: the rollover branch in `SessionRunner.cs` (~424) now records the
  facts before the resume hint, via `RecordRolloverFacts` in `VerdictEngine.Claims.cs`. The corpus
  predates that fix. Needs ~7 new corpus keys off the `sessions` table (`commit_count`,
  `gate_summary`, `newly_done`, `result_summary`, `digest`) — source `STORE`, none budget-shaped.
open: git ground truth for S5.4 lives in a private repo — **describe it in words, publish no ratio
  for it**. SPEC Part V article 3's `26 costed`/`15.5M` are stale (now **30**/**16.8M**) and its
  `25–54M`/`12.8–15.3M` were stage-level, not windows — corrections are in
  `docs/evidence/S5.3-the-nudge-below-the-median.md`. Article 1's `$52.06`/`23.2%` correction,
  concept 2's advisor split and concept 8's "push-only" still stand. Bugs #2 and #3 still open.
  **S7.1 must re-confirm `site`.**
tooling: prose refuses any number of two digits or more, and a currency/percent/decimal/ratio
  too — so a `file.cs:411` citation **cannot go in article prose**, and articles have no
  `citations` field; name it in words. **Never round-trip a content file through PowerShell
  `Get-Content`/`Set-Content`** (mojibake + BOM); mutate with node. `npm run content` rewraps
  YAML, so run it before quoting your own lines back. Commit messages to a file, then `-F`.
  Battery is ~60s now (the harvest makes two verb calls per run). **A failed Astro build exits
  0xC0000409, not 1.** `conductor history --json` emits a UTF-8 BOM on Windows. **One run.db holds
  several runs** — filter by `run_id`; `conductor money` needs `--run`, `conductor budget` takes
  the run id positionally.


## Baseline numbers (from run.db)

| Metric | Value |
|---|---|
| Total checkpoints | 28 |
| Done | 0 |
| Claimed (unconfirmed) | 18 |

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
