# Conductor — conductor-site - a field guide to agentic engineering run report

_Updated 2026-08-06 22:20 UTC · branch `main` · HEAD `8ada555`_

**Status:** Idle
**Stage:** S2 —  · attempts used 0
**Checkpoints:** 8/28 done · **Sessions run:** 4 · **Cost:** $32.4445 (agent $32.4399 + gates $0.0047) · **Tokens:** 581,096 in / 282,127 out

## Stage progress

| Stage | Title | Progress | State |
|---|---|---|---|
| S1 |  | ██████████ 4/4 | done |
| S2 |  | ██████████ 4/4 | done |
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

<details> ✅<summary>S2 —  (4/4)</summary>

| # | Title | Status | Commit |
|---|---|---|---|
| S2.1 | `concepts`, `articles` and `reports` exist as typed collections — Zod-only schemas in `schema.ts`, loaders in `content.config.ts`, an entry each in the `editable` map — with the concept schema carrying the five-move shape from SPEC Part III including `evidence` as keys rather than values | ✅ DONE | [`a68c0f3`](https://github.com/shaahink/conductor-site/commit/a68c0f3) |
| S2.2 | The three index pages and the nav render from the collections, ordered by `order`, with `readNext` resolving to real entries and a build that fails on a dangling one | ✅ DONE | [`a68c0f3`](https://github.com/shaahink/conductor-site/commit/a68c0f3) |
| S2.3 | Every page carries `data-sk-edit` annotations that resolve, real `meta.description` and `meta.ogDescription`, and `npm run check` reports zero errors | ✅ DONE | - |
| S2.4 | One concept page is written end to end as the worked example that proves the shape holds, and it passes all three litmus tests in SPEC Part I | ✅ DONE | - |

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
| 4 | S2 | Deliver | 1 | 08-06 21:57 | 0:23 | Advanced | S2.3 S2.4 | 4 | site-fast:OK · generated:OK | $8.0416 | $0.0013 | 159,651/78,744 |

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
08-06 22:57:09  ◆ plan reloaded — v1 · 7 stages · 3 gates
08-06 22:57:12  • session #4 S2 Deliver started (attempt 1/4)
08-06 23:20:33  ▪ gate site-fast pass [session]  (10.5s)
08-06 23:20:33  ▪ gate generated pass [session]  (2.2s)
```

## Health

_Execution-health signals, folded from the event log (`.conductor/events.jsonl`)._

```
sessions 4 · retries 0 (0 %) · overall Ok
✓ no health concerns detected
```

## Repo

_Live git snapshot (branch, working tree, sync vs upstream)._

```
branch: main
working tree: clean
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
- **s4 (S2 Deliver)** — 4 commit(s):
  - [`8ada555`](https://github.com/shaahink/conductor-site/commit/8ada555) docs(tracker): hand off with S2 complete
  - [`689854a`](https://github.com/shaahink/conductor-site/commit/689854a) docs(evidence): the three litmus tests, applied to the page that has to be right
  - [`bd66fc9`](https://github.com/shaahink/conductor-site/commit/bd66fc9) feat(concepts): context engineering, written end to end
  - [`a6d5f98`](https://github.com/shaahink/conductor-site/commit/a6d5f98) feat(content): the parts of a page nobody looks at, gated

## Last gate run

site-fast:OK · generated:OK

## Last session result

> **** S2 complete — S2.3 and S2.4 landed, three litmus tests turned into build gates**
> - **QA of session 3: both claims hold.** Re-broke the `readNext` gate on a fresh tree and the build died naming the entry, the bad slug and the known entries. One real finding, fixed: the concept cited `PromptBuilder.cs:276` for the ledger go…
> - **S2.3 (a6d5f98):** audited all eight heads and found two real defects — the articles index ran 186 chars and was being cut mid-clause in the snippet, and the home page sat exactly on 160. Both rewritten, then the bar moved somewhere it bit…
> - **S2.4 (bd66fc9 + 689854a):** `context-engineering` written end to end, six citations verified line by line against the engine at `1a55437`. Litmus 1 and 3 are now gates rather than intentions — `src/lib/figures.ts` fails the build on a fig…
>
> artefacts: `src/lib/figures.ts`, `test/meta.test.mjs`, `src/content/concepts/context-engineering.yaml`, `src/content/schema.ts`, `src/lib/collections.ts`
>
> evidence: `docs/evidence/S2.3-annotations-meta.txt`, `docs/evidence/S2.4-context-engineering.md` — check 0 errors / 33 tests, build 10 pages with 63 annotations resolving, five gates each broken on purpose and reverted, all three generated files regenerating with no diff
>
> gaps: no evidence strip renders yet (corpus arrives at S3); S3.1 now owes six keys — `sessions`, `cacheRead`, `ledgerEntries`, `tokensIn`, `tokensOut`, `costPerSession` — recorded in the ledger and the handoff, since S3.3 makes a page naming a missing key fail the build; bug #2 (`--overlay` contrast) still open for S7.2

## Tracker handoff

```
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
```
