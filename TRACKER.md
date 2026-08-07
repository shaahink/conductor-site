# conductor-site - a field guide to agentic engineering Phase Tracker

**Plan:** conductor-site - a field guide to agentic engineering | **Branch:** `main` | **Design doc:** docs/SPEC.md

## Handoff (overwrite this block, ≤12 lines, no history)

last: **session 15** delivered **S6.4 — stage S6 is complete.** QA of session 14: **no findings.**
  Battery re-run green from a clean tree *before* any edit (0 errors, 73 tests, build exit 0 with
  474 annotations on 21 pages, evidence green, anonymity exit 0); all three evidence files on
  disk. One bookkeeping nit only: the database records commit `fcbbb72` for S6.1/S6.2/S6.3, but
  reports A, B and C actually landed in `c70d83b`, `29817f8` and `bc021ae` — `fcbbb72` is the
  anonymity-check commit. Nothing published depends on it.
now on disk: `/runs` carries the three reports and then **all 18 runs**, oldest first, from
  `corpus.json` alone. The three the store still marks `running` render **ABANDONED** in the
  Face's peach role; `>running<` appears **zero** times in `dist/`. New: **`src/lib/corpus.ts`**
  (pure — it takes the corpus as a **parameter**, not an import, because a module with a
  top-level JSON import **cannot be loaded by `node --test` at all**), `RunTable.astro`, a `<slot />`
  on `SectionIndex`, and **optional** `sectionPageSchema.corpusTable` (`checkAnnotations` does
  resolve an optional field — verified). `sectionPage()` now calls `refuseTypedFigures`, which
  `ordered()` never did for `sections`. Battery at head: **0 errors, 86 tests, build 23 pages /
  478 annotations on 21, evidence green over 17 entries, anonymity exit 0.** Evidence:
  `docs/evidence/S6.4-the-corpus-index.md` + two full-page screenshots.
next: **S7.1** — canonicals, sitemap, robots, OG images per section, and `astro.config`'s `site`
  pointing at the real production URL. **S7.1 must re-confirm `site`.**
open: bugs #2, #3, #4 still open. **Bug #5 filed this session**: `EvidenceStrip.astro`'s
  `.cell { min-inline-size: var(--mono-inline-size) }` misuses a token that is a *font-size*
  step-down (`0.9em`), so the strip's figure cells have no minimum width and do not line up. One
  token, cosmetic, untouched because it is outside S6.4. SPEC Part V article 3's `26 costed`/
  `15.5M` are stale (now **30**/**16.8M**); article 4's `19 of 34`/`10 of 11` and the S5.4 git
  ground truth are unpublished on purpose. Article 1's `$52.06`/`23.2%` correction, concept 2's
  advisor split and concept 8's "push-only" still stand.
tooling: **Astro strips the whitespace between sibling elements**, so inline spans carrying
  `white-space: nowrap` have **no break opportunity anywhere** — that made one table cell's
  min-content the whole line as a single 343px word. Use flex + `flex-wrap`, not inline +
  margin. **The 68ch measure is wrong for a table** read across; `RunTable` breaks out by
  `--space-3xl` either side above `64rem`, the one breakpoint this site already has. Prose
  refuses any number of two digits or more, and a currency/percent/decimal/ratio too — so a
  `file.cs:411` citation **cannot go in article prose**; name it in words. **Never round-trip a
  content file through PowerShell `Get-Content`/`Set-Content`** (mojibake + BOM); mutate with
  node — and `/tmp` is not reliable from the Bash tool here, write scratch files under the repo
  and delete them. `npm run content` rewraps YAML, so run it before quoting your own lines back.
  Commit messages to a file, then `-F`. Battery is ~60s. **A failed Astro build exits 0xC0000409,
  not 1.** `meta.description` caps at 160 chars and Astro reports it only as "does not match
  collection schema" until you re-run `npx astro check`. **Do not `select *` from `sessions`
  through `run_query`.** `conductor history --json` emits a UTF-8 BOM on Windows. **One run.db
  holds several runs** — filter by `run_id`; `conductor money` needs `--run`, `conductor budget`
  takes the run id positionally.


## Baseline numbers (from run.db)

| Metric | Value |
|---|---|
| Total checkpoints | 28 |
| Done | 0 |
| Claimed (unconfirmed) | 23 |

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
