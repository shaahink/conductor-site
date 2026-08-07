# Conductor — conductor-site - a field guide to agentic engineering run report

_Updated 2026-08-07 01:09 UTC · branch `main` · HEAD `88ab238`_

**Status:** Idle
**Stage:** S4 —  · attempts used 0
**Checkpoints:** 16/28 done · **Sessions run:** 10 · **Cost:** $65.4196 (agent $65.4106 + gates $0.0090) · **Tokens:** 1,322,210 in / 537,806 out

## Stage progress

| Stage | Title | Progress | State |
|---|---|---|---|
| S1 |  | ██████████ 4/4 | done |
| S2 |  | ██████████ 4/4 | done |
| S3 |  | ██████████ 4/4 | done |
| S4 |  | ██████████ 4/4 | done |
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
| S2.3 | Every page carries `data-sk-edit` annotations that resolve, real `meta.description` and `meta.ogDescription`, and `npm run check` reports zero errors | ✅ DONE | [`a6d5f98`](https://github.com/shaahink/conductor-site/commit/a6d5f98) |
| S2.4 | One concept page is written end to end as the worked example that proves the shape holds, and it passes all three litmus tests in SPEC Part I | ✅ DONE | [`a6d5f98`](https://github.com/shaahink/conductor-site/commit/a6d5f98) |

</details>

<details> ✅<summary>S3 —  (4/4)</summary>

| # | Title | Status | Commit |
|---|---|---|---|
| S3.1 | `scripts/harvest.mjs` reads `conductor history --json --limit 0` for run-level truth and read-only SQLite for what that does not expose (costs by category, gate pass rates, bugs, scores, event counts, rollovers), and writes `src/data/corpus.json` | ✅ DONE | - |
| S3.2 | `anonymise.json` maps run id → published scenario label, and the harvest **fails closed**: a run with no entry is excluded from the corpus rather than published under its real name, proven by a test that adds an unmapped run | ✅ DONE | - |
| S3.3 | The evidence strip component renders figures from `corpus.json` by key, and a page that names a key absent from the corpus fails the build rather than rendering blank | ✅ DONE | [`0f5f4c9`](https://github.com/shaahink/conductor-site/commit/0f5f4c9) |
| S3.4 | The `evidence` gate re-runs the harvest and goes red when `corpus.json` is stale or a cited key is missing, proven by a deliberate staleness both ways | ✅ DONE | [`0f5f4c9`](https://github.com/shaahink/conductor-site/commit/0f5f4c9) |

</details>

<details> ✅<summary>S4 —  (4/4)</summary>

| # | Title | Status | Commit |
|---|---|---|---|
| S4.1 | Concepts 1–3 (agentic engineering, multi-agent orchestration, context engineering) written, each citing Conductor by `file:line` and each carrying evidence keys that resolve | ✅ DONE | [`690304d`](https://github.com/shaahink/conductor-site/commit/690304d) |
| S4.2 | Concepts 4–6 (token economics, evals and gates, independent verification) written to the same bar | ✅ DONE | [`690304d`](https://github.com/shaahink/conductor-site/commit/690304d) |
| S4.3 | Concepts 7–8 (durable execution, human-in-the-loop) written to the same bar | ✅ DONE | - |
| S4.4 | Concepts 9–10 (agent observability, agent memory) written, the spine reads in `order` end to end, and every `file:line` citation is verified to still resolve against `shaahink/conductor` at a named commit | ✅ DONE | - |

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
| 5 | S3 | Deliver | 1 | 08-06 22:20 | 0:19 | LimitBackoff |  | 0 |  | $6.9597 |  | 146,851/68,499 |
| 6 | S3 | Resume | 1 | 08-06 23:10 | 0:00 | LimitBackoff |  | 0 |  | $0.0000 |  |  |
| 7 | S3 | Resume | 1 | 08-06 23:40 | 0:00 | LimitBackoff |  | 0 |  | $0.0000 |  |  |
| 8 | S3 | Resume | 1 | 08-07 00:10 | 0:11 | Advanced | S3.3 S3.4 | 5 | site-fast:OK · generated:OK | $7.3490 | $0.0013 | 198,956/33,052 |
| 9 | S4 | Deliver | 1 | 08-07 00:22 | 0:24 | Advanced | S4.1 S4.2 | 4 | site-fast:OK · generated:OK · evidence:OK | $10.4796 | $0.0015 | 208,409/76,148 |
| 10 | S4 | Deliver | 1 | 08-07 00:46 | 0:22 | Advanced | S4.3 S4.4 | 4 | site-fast:OK · generated:OK · evidence:OK | $8.1825 | $0.0015 | 186,898/77,980 |

## Money

_What this run has cost, from its own `costs` rows. Same numbers as `conductor money`._

| scope | sessions | tokens | cache reads | cost | checkpoints | tok/ckpt | $/ckpt |
|---|---|---|---|---|---|---|---|
| **run total** | 9 | 70.4M | 97.7% | $57.24 | 12 | 5.87M | $4.77 |
| stage S1 | 2 | 19.7M | 98.0% | $15.40 | 4 | 4.92M | $3.85 |
| stage S2 | 2 | 20.4M | 97.7% | $17.04 | 4 | 5.09M | $4.26 |
| stage S3 | 4 | 17.1M | 97.4% | $14.31 | 2 | 8.55M | $7.15 |
| stage S4 | 1 | 13.3M | 97.9% | $10.48 | 2 | 6.63M | $5.24 |
| 2026-08 | 9 | 70.4M | 97.7% | $57.24 | 12 | 5.87M | $4.77 |

_Where the money goes: agent $57.23 (100%) · gate $0.01 (0%) · blended $0.81/M tokens._

## Timeline

_Transitions with duration, from the event log (`.conductor/events.jsonl`)._

```
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
08-06 23:20:36  • session #4 S2 → Advanced · done S2.3,S2.4 · 4 commit(s)  (23m24s)
08-06 23:20:36  ▸ stage S3 entered
08-06 23:20:36  • session #5 S3 Deliver started (attempt 1/4)
08-06 23:40:13  • session #5 S3 → LimitBackoff  (19m36s)
08-07 00:10:10  • session #6 S3 Resume started (attempt 1/4)
08-07 00:10:19  • session #6 S3 → LimitBackoff  (8.7s)
08-07 00:40:17  • session #7 S3 Resume started (attempt 1/4)
08-07 00:40:22  • session #7 S3 → LimitBackoff  (5.6s)
08-07 01:10:22  • session #8 S3 Resume started (attempt 1/4)
08-07 01:22:20  ▪ gate site-fast pass [session]  (10.7s)
08-07 01:22:20  ▪ gate generated pass [session]  (2.4s)
08-07 01:22:24  • session #8 S3 → Advanced · done S3.3,S3.4 · 5 commit(s)  (12m01s)
08-07 01:22:24  ▸ stage S4 entered
08-07 01:22:24  • session #9 S4 Deliver started (attempt 1/4)
08-07 01:46:51  ▪ gate site-fast pass [session]  (11.7s)
08-07 01:46:51  ▪ gate generated pass [session]  (2.0s)
08-07 01:46:51  ▪ gate evidence pass [session]  (1.4s)
08-07 01:46:54  • session #9 S4 → Advanced · done S4.1,S4.2 · 4 commit(s)  (24m29s)
08-07 01:46:54  • session #10 S4 Deliver started (attempt 1/4)
08-07 02:09:47  ▪ gate site-fast pass [session]  (11.7s)
08-07 02:09:47  ▪ gate generated pass [session]  (1.9s)
08-07 02:09:47  ▪ gate evidence pass [session]  (1.5s)
```

## Health

_Execution-health signals, folded from the event log (`.conductor/events.jsonl`)._

```
sessions 10 · retries 0 (0 %) · overall Ok
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
- **s8 (S3 Resume)** — 5 commit(s):
  - [`5612369`](https://github.com/shaahink/conductor-site/commit/5612369) docs(tracker): hand off with S3 complete
  - [`3a97fd3`](https://github.com/shaahink/conductor-site/commit/3a97fd3) docs(evidence): the gate, red both ways, and the one it found by itself
  - [`6ca4398`](https://github.com/shaahink/conductor-site/commit/6ca4398) feat(evidence): the gate goes red two ways, and caught one on its own
  - [`ddebdf6`](https://github.com/shaahink/conductor-site/commit/ddebdf6) docs(evidence): what the strip prints, and the two ways it refuses to
  - [`0f5f4c9`](https://github.com/shaahink/conductor-site/commit/0f5f4c9) feat(evidence): the strip, and a key with nothing behind it fails the build
- **s9 (S4 Deliver)** — 4 commit(s):
  - [`6ec3467`](https://github.com/shaahink/conductor-site/commit/6ec3467) docs(tracker): hand off with the spine written through six
  - [`931a40f`](https://github.com/shaahink/conductor-site/commit/931a40f) feat(concepts): what a gate is, and why the checker cannot be the worker
  - [`2a0e93e`](https://github.com/shaahink/conductor-site/commit/2a0e93e) feat(concepts): the loop, the roles, and a citation that has to point somewhere
  - [`690304d`](https://github.com/shaahink/conductor-site/commit/690304d) feat(evidence): the three lanes a run pays for, split out of the store
- **s10 (S4 Deliver)** — 4 commit(s):
  - [`88ab238`](https://github.com/shaahink/conductor-site/commit/88ab238) docs(evidence): S4.4 proved clause by clause, and stage S4 closed
  - [`f1bbf09`](https://github.com/shaahink/conductor-site/commit/f1bbf09) feat(concepts): what you can ask afterwards, and what is worth carrying forward
  - [`06ca43b`](https://github.com/shaahink/conductor-site/commit/06ca43b) docs(evidence): S4.3 proved, and the gate made to bite before it was believed
  - [`adbe41f`](https://github.com/shaahink/conductor-site/commit/adbe41f) feat(concepts): work that outlives its worker, and the stop only a person clears

## Last gate run

site-fast:OK · generated:OK · evidence:OK

## Last session result

> **** Stage S4 closed — concepts seven through ten written, spine gated, all citations verified**
> - **S4.3** (`adbe41f`) — durable execution and human-in-the-loop, 17 new citations. Carries two measured corrections against the SPEC: the notification lane is not push-only (it long-polls and handles callbacks that write `control.json`), and…
> - **S4.4** (`f1bbf09`) — agent observability and agent memory, 20 new citations including the Face. New gate `test/spine.test.mjs` catches three defects a dangling-slug check cannot: a repeated or gapped `order`, a slug that stopped matching …
> - **QA of session 9: no findings.** Battery re-run from a clean tree before any edit — 0 errors, 42 tests, 14 pages, 154 annotations, 8 cited entries, 37 citations, all green. Session 9's claims hold as written.

## Tracker handoff

```
last: **session 10** delivered **S4.3** (adbe41f) and **S4.4** (f1bbf09) — **stage S4 is
  complete**. QA of session 9: **no findings**; battery re-run green from a clean tree before any
  edit (0 errors, 42 tests, 14 pages, 154 annotations, 8 cited entries, 37 citations).
now on disk: all ten concept pages. Battery: 0 errors, **45 tests**, 18 pages, 255 annotations,
  evidence gate green over 12 cited entries, **all 74 citations resolve at engine `1632b9f`**.
  New gate `test/spine.test.mjs` — `order` a permutation of one to ten, slug equals file name,
  and the first `readNext` walking the whole spine. Both gates proven red by mutation this
  session and restored: a bogus `totalOwnerApprovalsX` on concept 8, and all three spine defects.
next: **S5** — the four articles. Two of them already have their evidence: article 2 is the
  twenty-nine red gates (all required, none skipped or optional in the corpus), article 3 is the
  measured-budget method. **Anything budget-shaped comes from `conductor budget` / `conductor
  money`, never hand SQL** — and `runs.limits_json` is NULL on every imported run, so no cap
  value can be gate-verified; say so on the page.
open: **two SPEC figures corrected by measurement, do not retype either.** Part IV concept 2 says
  agent $3,015 vs advisor $0.09; the store has **three** categories — agent $3,014.80, gate
  $1.26, advisor $0.24 — and the advisor line is priced from elapsed seconds, not metered. Part
  IV concept 8's "push-only" is wrong and concept 8 now says so on the page. Bug #3 (Appendix
  A's `$9.37` and `~$10.85` divisions) and bug #2 (`--overlay` contrast) still stand. **S7.1
  must re-confirm `site`.** Anonymisation trap for S5/S6: `SqliteRunStore.Bugs.cs:26` names a
  private repo in its own comment — cite the line, paraphrase the measurement, never quote it.
tooling: prose refuses any number of two digits or more — spell small quantities as words, and
  never write a decimal, a ratio or a currency amount into content. **Never `git checkout --` a
  file whose new version is uncommitted.** Commit messages to a file, then `-F`. The battery is
  ~20s, so foreground it. **A failed Astro build exits 0xC0000409, not 1.** `conductor history
  --json` emits a UTF-8 BOM on Windows. **One run.db holds several runs** — filter by `run_id`.
```
