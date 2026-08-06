# Conductor — conductor-site - a field guide to agentic engineering run report

_Updated 2026-08-06 21:57 UTC · branch `main` · HEAD `e47bf88`_

**Status:** Idle
**Stage:** S2 —  · attempts used 0 · working ▸ S2.3
**Checkpoints:** 6/28 done · **Sessions run:** 3 · **Cost:** $24.4017 (agent $24.3983 + gates $0.0034) · **Tokens:** 421,445 in / 203,383 out

## Stage progress

| Stage | Title | Progress | State |
|---|---|---|---|
| S1 |  | ██████████ 4/4 | done |
| S2 |  | █████░░░░░ 2/4 | **← active** |
| S3 |  | ░░░░░░░░░░ 0/4 | todo |
| S4 |  | ░░░░░░░░░░ 0/4 | todo |
| S5 |  | ░░░░░░░░░░ 0/4 | todo |
| S6 |  | ░░░░░░░░░░ 0/4 | todo |
| S7 |  | ░░░░░░░░░░ 0/4 | todo |

<details> ✅<summary>S1 —  (4/4)</summary>

| # | Title | Status | Commit |
|---|---|---|---|
| S1.1 | The sixteen colour roles ship as CSS custom properties for both mocha and latte, lifted from the Face's own `color.go` rather than from upstream Catppuccin, with a test that fails when any role misses the Face's contrast bar (text ≥4.5:1, semantics and overlay ≥3:1, quiet roles ≥1.5:1 and ordered) | ✅ DONE | [`f11fe55`](https://github.com/shaahink/conductor-site/commit/f11fe55) |
| S1.2 | Typography and spacing: a humanist sans body at a 62–72ch measure through the Astro Fonts API consuming `cssVariable`, monospace reserved for machine truth, and a type scale used by name — no page hardcodes a size or a hex | ✅ DONE | [`f11fe55`](https://github.com/shaahink/conductor-site/commit/f11fe55) |
| S1.3 | The layout shell — top bar, three sections, reading column, sticky in-page TOC on wide viewports — plus a theme toggle that follows `prefers-color-scheme`, persists to `localStorage`, and survives first paint without a flash | ✅ DONE | [`f11fe55`](https://github.com/shaahink/conductor-site/commit/f11fe55) |
| S1.4 | The template's two `checkPlaceholders` `allow:` escapes are deleted and the build is green without them, so this site's own copy is guarded from here on | ✅ DONE | [`b05efc3`](https://github.com/shaahink/conductor-site/commit/b05efc3) |

</details>

<details><summary>S2 —  (2/4)</summary>

| # | Title | Status | Commit |
|---|---|---|---|
| S2.1 | `concepts`, `articles` and `reports` exist as typed collections — Zod-only schemas in `schema.ts`, loaders in `content.config.ts`, an entry each in the `editable` map — with the concept schema carrying the five-move shape from SPEC Part III including `evidence` as keys rather than values | ✅ DONE | [`a68c0f3`](https://github.com/shaahink/conductor-site/commit/a68c0f3) |
| S2.2 | The three index pages and the nav render from the collections, ordered by `order`, with `readNext` resolving to real entries and a build that fails on a dangling one | ✅ DONE | [`a68c0f3`](https://github.com/shaahink/conductor-site/commit/a68c0f3) |
| S2.3 | Every page carries `data-sk-edit` annotations that resolve, real `meta.description` and `meta.ogDescription`, and `npm run check` reports zero errors | ⬜ TODO | - |
| S2.4 | One concept page is written end to end as the worked example that proves the shape holds, and it passes all three litmus tests in SPEC Part I | ⬜ TODO | - |

</details>

<details><summary>S3 —  (0/4)</summary>

| # | Title | Status | Commit |
|---|---|---|---|
| S3.1 | `scripts/harvest.mjs` reads `conductor history --json --limit 0` for run-level truth and read-only SQLite for what that does not expose (costs by category, gate pass rates, bugs, scores, event counts, rollovers), and writes `src/data/corpus.json` | ⬜ TODO | - |
| S3.2 | `anonymise.json` maps run id → published scenario label, and the harvest **fails closed**: a run with no entry is excluded from the corpus rather than published under its real name, proven by a test that adds an unmapped run | ⬜ TODO | - |
| S3.3 | The evidence strip component renders figures from `corpus.json` by key, and a page that names a key absent from the corpus fails the build rather than rendering blank | ⬜ TODO | - |
| S3.4 | The `evidence` gate re-runs the harvest and goes red when `corpus.json` is stale or a cited key is missing, proven by a deliberate staleness both ways | ⬜ TODO | - |

</details>

<details><summary>S4 —  (0/4)</summary>

| # | Title | Status | Commit |
|---|---|---|---|
| S4.1 | Concepts 1–3 (agentic engineering, multi-agent orchestration, context engineering) written, each citing Conductor by `file:line` and each carrying evidence keys that resolve | ⬜ TODO | - |
| S4.2 | Concepts 4–6 (token economics, evals and gates, independent verification) written to the same bar | ⬜ TODO | - |
| S4.3 | Concepts 7–8 (durable execution, human-in-the-loop) written to the same bar | ⬜ TODO | - |
| S4.4 | Concepts 9–10 (agent observability, agent memory) written, the spine reads in `order` end to end, and every `file:line` citation is verified to still resolve against `shaahink/conductor` at a named commit | ⬜ TODO | - |

</details>

<details><summary>S5 —  (0/4)</summary>

| # | Title | Status | Commit |
|---|---|---|---|
| S5.1 | "What an autonomous run actually costs" — the corpus P&L including the waste, every figure keyed to `corpus.json` | ⬜ TODO | - |
| S5.2 | "Never believe the agent" — verification as a separate program, built around the 29 red gates rather than the 648 green ones | ⬜ TODO | - |
| S5.3 | "The nudge that sat below the median" — the measured-budget method, written so a reader can run it on their own store | ⬜ TODO | - |
| S5.4 | "The ledger that lied" — telemetry you cannot trust, and what it took to fix it | ⬜ TODO | - |

</details>

<details><summary>S6 —  (0/4)</summary>

| # | Title | Status | Commit |
|---|---|---|---|
| S6.1 | Report A, the fleet round, published as a scenario with no client name, no private repo name and no field-note prose — and a check that greps the built output for the forbidden list | ⬜ TODO | - |
| S6.2 | Report B, the long build that ended at 45 of 46, published with the shortfall as the subject rather than a footnote | ⬜ TODO | - |
| S6.3 | Report C, the engine run with an evaluation suite as its release gate | ⬜ TODO | - |
| S6.4 | `/runs` lists all 18 runs from harvested data with generalised labels and real numbers, and names the three abandoned July runs as abandoned rather than in-flight | ⬜ TODO | - |

</details>

<details><summary>S7 —  (0/4)</summary>

| # | Title | Status | Commit |
|---|---|---|---|
| S7.1 | SEO and social: canonicals, sitemap, robots, OG images per section, `astro.config` `site` pointing at the real production URL | ⬜ TODO | - |
| S7.2 | Accessibility and performance pass — keyboard reachable, landmarks, focus visible, reduced motion honoured, both themes legible, no layout shift on theme flip | ⬜ TODO | - |
| S7.3 | Generated files regenerated and clean (`npm run headers`, `npm run content`, `npm run editor`), README written, and the repo's CI green on `main` | ⬜ TODO | - |
| S7.4 | **ownerGated** — the Vercel project is linked and the site is live at its production URL, the owner has read the three reports for anonymisation, and the front page has been looked at in both themes | ⬜ TODO | - |

</details>

## Sessions

| # | Stage | Kind | Att | Started (UTC) | Dur | Outcome | New DONE | Commits | Gates | Cost | Overhead | Tokens |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | S1 | Deliver | 1 | 08-06 20:54 | 0:21 | Advanced | S1.1 S1.2 S1.3 | 3 | site-fast:OK · generated:OK | $9.0051 | $0.0010 | 141,057/74,548 |
| 2 | S1 | Deliver | 1 | 08-06 21:18 | 0:16 | Advanced | S1.4 | 5 | site-fast:OK · generated:OK | $6.3946 | $0.0010 | 119,085/51,110 |
| 3 | S2 | Deliver | 1 | 08-06 21:34 | 0:22 | Advanced | S2.1 S2.2 | 4 | site-fast:OK · generated:OK | $8.9986 | $0.0014 | 161,303/77,725 |

## Money

_What this run has cost, from its own `costs` rows. Same numbers as `conductor money`._

| scope | sessions | tokens | cache reads | cost | checkpoints | tok/ckpt | $/ckpt |
|---|---|---|---|---|---|---|---|
| **run total** | 3 | 30.8M | 98.0% | $24.40 | 6 | 5.14M | $4.07 |
| stage S1 | 2 | 19.7M | 98.0% | $15.40 | 4 | 4.92M | $3.85 |
| stage S2 | 1 | 11.1M | 97.8% | $9.00 | 2 | 5.56M | $4.50 |
| 2026-08 | 3 | 30.8M | 98.0% | $24.40 | 6 | 5.14M | $4.07 |

_Where the money goes: agent $24.40 (100%) · gate $0.00 (0%) · blended $0.79/M tokens._

## Timeline

_Transitions with duration, from the event log (`.conductor/events.jsonl`)._

```
08-06 21:54:06  ◆ run started · conductor-site - a field guide to agentic engineering
08-06 21:54:07  ▸ stage S1 entered
08-06 21:54:07  • session #1 S1 Deliver started (attempt 1/4)
08-06 22:16:06  ▪ gate site-fast pass [session]  (8.5s)
08-06 22:16:06  ▪ gate generated pass [session]  (1.6s)
08-06 22:16:08  • session #1 S1 → Advanced · done S1.1,S1.2,S1.3 · 3 commit(s)  (22m01s)
08-06 22:18:17  ◆ run resumed · conductor-site - a field guide to agentic engineering
08-06 22:18:18  • session #2 S1 Deliver started (attempt 1/4)
08-06 22:34:46  ▪ gate site-fast pass [session]  (8.3s)
08-06 22:34:46  ▪ gate generated pass [session]  (1.8s)
08-06 22:34:48  • session #2 S1 → Advanced · done S1.4 · 5 commit(s)  (16m30s)
08-06 22:34:48  ▸ stage S2 entered
08-06 22:34:48  • session #3 S2 Deliver started (attempt 1/4)
08-06 22:57:06  ▪ gate site-fast pass [session]  (11.7s)
08-06 22:57:06  ▪ gate generated pass [session]  (2.1s)
08-06 22:57:09  • session #3 S2 → Advanced · done S2.1,S2.2 · 4 commit(s)  (22m20s)
```

## Health

_Execution-health signals, folded from the event log (`.conductor/events.jsonl`)._

```
sessions 3 · retries 0 (0 %) · overall Ok
✓ no health concerns detected
```

## Repo

_Live git snapshot (branch, working tree, sync vs upstream)._

```
branch: main
working tree: M TRACKER.md
vs upstream: up to date
```

### Commits by session

- **s1 (S1 Deliver)** — 3 commit(s):
  - [`14ec19f`](https://github.com/shaahink/conductor-site/commit/14ec19f) feat(face): the layout shell, and a theme toggle that beats first paint
  - [`5377737`](https://github.com/shaahink/conductor-site/commit/5377737) feat(face): two faces, a named type scale, and a test that spends neither
  - [`f11fe55`](https://github.com/shaahink/conductor-site/commit/f11fe55) feat(face): the sixteen colour roles, both schemes, with the Face's own bar
- **s2 (S1 Deliver)** — 5 commit(s):
  - [`fcdd90e`](https://github.com/shaahink/conductor-site/commit/fcdd90e) docs(tracker): hand off with S1 complete
  - [`cb40575`](https://github.com/shaahink/conductor-site/commit/cb40575) fix(face): the footer says whose site this is, not "New Site"
  - [`2b33f93`](https://github.com/shaahink/conductor-site/commit/2b33f93) fix(face): the review widget wears the site's roles, in both schemes
  - [`b38f39e`](https://github.com/shaahink/conductor-site/commit/b38f39e) docs(evidence): S1.4 — the placeholder gate, proven by making it go red
  - [`b05efc3`](https://github.com/shaahink/conductor-site/commit/b05efc3) feat(content): a real front page, and the placeholder gate without its escapes
- **s3 (S2 Deliver)** — 4 commit(s):
  - [`6a3d334`](https://github.com/shaahink/conductor-site/commit/6a3d334) feat(pages): the three indexes, and a nav that cannot disagree with itself
  - [`0f81a26`](https://github.com/shaahink/conductor-site/commit/0f81a26) chore(plan): carry the run's own budget tuning into the tree
  - [`2ffa1bc`](https://github.com/shaahink/conductor-site/commit/2ffa1bc) feat(content): three collections, and evidence that cannot be typed
  - [`a68c0f3`](https://github.com/shaahink/conductor-site/commit/a68c0f3) fix(seo): the canonical points at this site, not a stranger's

## Last gate run

site-fast:OK · generated:OK

## Last session result

> **S2.1 and S2.2 landed with red-and-green proof; canonical URL corrected**
> - **S2.1** — `concepts`, `articles`, `reports` are typed collections wired in all three places (schema, loader, `editable` map). `evidenceKey` is a regex, not a comment: a leading digit, currency sign, space or slash is refused, so a figure c…
> - **S2.2** — the three index pages, the per-entry routes and the top bar all render from the collections in `order`. A fourth collection, `sectionPages`, carries each index page's own copy so `checkPlaceholders` can see it — the hole the foot…
> - **Correction applied (not claimed)** — `astro.config.mjs` `site` was publishing every canonical, og:url and sitemap entry under `conductor-site.vercel.app`, which is a stranger's rail-tracking site. Now `conductor-site-virid.vercel.app`. Th…
> - (+1 more outcomes not shown)
>
> artefacts: `src/content/schema.ts`, `src/content.config.ts`, `src/lib/collections.ts`, `src/lib/text.ts`, `src/layouts/SectionIndex.astro`, `src/layouts/LongForm.astro`, `src/components/EntryList.astro`, `src/components/ReadNext.astro`
>
> evidence: `docs/evidence/S2.1-collections.txt`, `docs/evidence/S2.2-indexes.txt` — each carries the deliberate reds and the green battery; build is 10 pages, 56 annotations resolving, 8 content entries placeholder-clean
>
> gaps: S2.3 and S2.4 not started — S2.3 is largely an audit of `meta.description`/`ogDescription` across the eight entries since annotations already resolve and check is 0 errors; S2.4 needs `context-engineering` written end to end against the three litmus tests. Bug #2 (`--overlay` at ~3.3:1) still open and still S7.2's call. No evidence section renders on concept pages by design — the corpus does not e…

## Tracker handoff

```
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
```
