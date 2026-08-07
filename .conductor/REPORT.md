# Conductor — conductor-site - a field guide to agentic engineering run report

_Updated 2026-08-07 03:14 UTC · branch `main` · HEAD `cb44186`_

**Status:** Idle
**Stage:** S6 —  · attempts used 0
**Checkpoints:** 24/28 done · **Sessions run:** 15 · **Cost:** $113.0415 (agent $113.0180 + gates $0.0234) · **Tokens:** 2,166,638 in / 912,079 out

## Stage progress

| Stage | Title | Progress | State |
|---|---|---|---|
| S1 |  | ██████████ 4/4 | done |
| S2 |  | ██████████ 4/4 | done |
| S3 |  | ██████████ 4/4 | done |
| S4 |  | ██████████ 4/4 | done |
| S5 |  | ██████████ 4/4 | done |
| S6 |  | ██████████ 4/4 | done |
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
| S4.3 | Concepts 7–8 (durable execution, human-in-the-loop) written to the same bar | ✅ DONE | [`adbe41f`](https://github.com/shaahink/conductor-site/commit/adbe41f) |
| S4.4 | Concepts 9–10 (agent observability, agent memory) written, the spine reads in `order` end to end, and every `file:line` citation is verified to still resolve against `shaahink/conductor` at a named commit | ✅ DONE | [`adbe41f`](https://github.com/shaahink/conductor-site/commit/adbe41f) |

</details>

<details> ✅<summary>S5 —  (4/4)</summary>

| # | Title | Status | Commit |
|---|---|---|---|
| S5.1 | "What an autonomous run actually costs" — the corpus P&L including the waste, every figure keyed to `corpus.json` | ✅ DONE | [`1ef5db5`](https://github.com/shaahink/conductor-site/commit/1ef5db5) |
| S5.2 | "Never believe the agent" — verification as a separate program, built around the 29 red gates rather than the 648 green ones | ✅ DONE | [`1ef5db5`](https://github.com/shaahink/conductor-site/commit/1ef5db5) |
| S5.3 | "The nudge that sat below the median" — the measured-budget method, written so a reader can run it on their own store | ✅ DONE | [`3896cb8`](https://github.com/shaahink/conductor-site/commit/3896cb8) |
| S5.4 | "The ledger that lied" — telemetry you cannot trust, and what it took to fix it | ✅ DONE | [`239d249`](https://github.com/shaahink/conductor-site/commit/239d249) |

</details>

<details> ✅<summary>S6 —  (4/4)</summary>

| # | Title | Status | Commit |
|---|---|---|---|
| S6.1 | Report A, the fleet round, published as a scenario with no client name, no private repo name and no field-note prose — and a check that greps the built output for the forbidden list | ✅ DONE | [`fcbbb72`](https://github.com/shaahink/conductor-site/commit/fcbbb72) |
| S6.2 | Report B, the long build that ended at 45 of 46, published with the shortfall as the subject rather than a footnote | ✅ DONE | [`fcbbb72`](https://github.com/shaahink/conductor-site/commit/fcbbb72) |
| S6.3 | Report C, the engine run with an evaluation suite as its release gate | ✅ DONE | [`fcbbb72`](https://github.com/shaahink/conductor-site/commit/fcbbb72) |
| S6.4 | `/runs` lists all 18 runs from harvested data with generalised labels and real numbers, and names the three abandoned July runs as abandoned rather than in-flight | ✅ DONE | - |

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
| 11 | S5 | Deliver | 1 | 08-07 01:09 | 0:25 | Advanced | S5.1 S5.2 | 2 | site-fast:OK · generated:OK · evidence:OK | $10.3443 | $0.0024 | 180,290/76,483 |
| 12 | S5 | Deliver | 1 | 08-07 01:36 | 0:27 | Advanced | S5.3 | 3 | site-fast:OK · generated:OK · evidence:OK | $10.4334 | $0.0033 | 190,206/83,979 |
| 13 | S5 | Deliver | 1 | 08-07 02:04 | 0:16 | Advanced | S5.4 | 2 | site-fast:OK · generated:OK · evidence:OK | $5.4673 | $0.0036 | 118,247/40,393 |
| 14 | S6 | Deliver | 1 | 08-07 02:21 | 0:27 | Advanced | S6.1 S6.2 S6.3 | 4 | site-fast:OK · generated:OK · evidence:OK | $11.1692 | $0.0025 | 194,497/101,053 |
| 15 | S6 | Deliver | 1 | 08-07 02:49 | 0:24 | Advanced | S6.4 | 3 | site-fast:OK · generated:OK · evidence:OK | $10.1932 | $0.0026 | 161,188/72,365 |

## Money

_What this run has cost, from its own `costs` rows. Same numbers as `conductor money`._

| scope | sessions | tokens | cache reads | cost | checkpoints | tok/ckpt | $/ckpt |
|---|---|---|---|---|---|---|---|
| **run total** | 14 | 126.5M | 97.8% | $102.85 | 21 | 6.03M | $4.90 |
| stage S1 | 2 | 19.7M | 98.0% | $15.40 | 4 | 4.92M | $3.85 |
| stage S2 | 2 | 20.4M | 97.7% | $17.04 | 4 | 5.09M | $4.26 |
| stage S3 | 4 | 17.1M | 97.4% | $14.31 | 2 | 8.55M | $7.15 |
| stage S4 | 2 | 22.4M | 97.5% | $18.67 | 4 | 5.59M | $4.67 |
| stage S5 | 3 | 33.3M | 97.9% | $26.25 | 4 | 8.33M | $6.56 |
| stage S6 | 1 | 13.7M | 97.8% | $11.17 | 3 | 4.56M | $3.72 |
| 2026-08 | 14 | 126.5M | 97.8% | $102.85 | 21 | 6.03M | $4.90 |

_Where the money goes: agent $102.82 (100%) · gate $0.02 (0%) · blended $0.81/M tokens._

## Timeline

_Transitions with duration, from the event log (`.conductor/events.jsonl`)._

```
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
08-07 02:09:50  • session #10 S4 → Advanced · done S4.3,S4.4 · 4 commit(s)  (22m56s)
08-07 02:09:50  ▸ stage S5 entered
08-07 02:09:50  • session #11 S5 Deliver started (attempt 1/4)
08-07 02:36:03  ▪ gate site-fast pass [session]  (12.1s)
08-07 02:36:03  ▪ gate generated pass [session]  (2.1s)
08-07 02:36:03  ▪ gate evidence pass [session]  (10.0s)
08-07 02:36:07  • session #11 S5 → Advanced · done S5.1,S5.2 · 2 commit(s)  (26m16s)
08-07 02:36:07  • session #12 S5 Deliver started (attempt 1/4)
08-07 03:04:03  ▪ gate site-fast pass [session]  (11.6s)
08-07 03:04:03  ▪ gate generated pass [session]  (2.3s)
08-07 03:04:03  ▪ gate evidence pass [session]  (19.2s)
08-07 03:04:06  • session #12 S5 → Advanced · done S5.3 · 3 commit(s)  (27m59s)
08-07 03:04:07  • session #13 S5 Deliver started (attempt 1/4)
08-07 03:21:20  ▪ gate site-fast pass [session]  (14.9s)
08-07 03:21:20  ▪ gate generated pass [session]  (2.5s)
08-07 03:21:20  ▪ gate evidence pass [session]  (18.4s)
08-07 03:21:23  • session #13 S5 → Advanced · done S5.4 · 2 commit(s)  (17m16s)
08-07 03:21:23  ▸ stage S6 entered
08-07 03:21:23  • session #14 S6 Deliver started (attempt 1/4)
08-07 03:49:45  ▪ gate site-fast pass [session]  (9.7s)
08-07 03:49:45  ▪ gate generated pass [session]  (1.7s)
08-07 03:49:45  ▪ gate evidence pass [session]  (13.7s)
08-07 03:49:47  • session #14 S6 → Advanced · done S6.1,S6.2,S6.3 · 4 commit(s)  (28m23s)
08-07 03:49:47  • session #15 S6 Deliver started (attempt 1/4)
08-07 04:14:40  ▪ gate site-fast pass [session]  (10.2s)
08-07 04:14:40  ▪ gate generated pass [session]  (1.8s)
08-07 04:14:40  ▪ gate evidence pass [session]  (14.0s)
```

## Health

_Execution-health signals, folded from the event log (`.conductor/events.jsonl`)._

```
sessions 15 · retries 0 (0 %) · overall Ok
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
- **s11 (S5 Deliver)** — 2 commit(s):
  - [`1c56db4`](https://github.com/shaahink/conductor-site/commit/1c56db4) feat(articles): the twenty-nine that went red, and the four that never ran
  - [`1ef5db5`](https://github.com/shaahink/conductor-site/commit/1ef5db5) feat(articles): the bill, including the money that bought nothing
- **s12 (S5 Deliver)** — 3 commit(s):
  - [`ebde9fc`](https://github.com/shaahink/conductor-site/commit/ebde9fc) docs(tracker): S5.3 landed, handoff for S5.4
  - [`c33d05b`](https://github.com/shaahink/conductor-site/commit/c33d05b) feat(articles): the nudge that sat below the median
  - [`3896cb8`](https://github.com/shaahink/conductor-site/commit/3896cb8) feat(evidence): a window namespace, so a cap that moved can be compared
- **s13 (S5 Deliver)** — 2 commit(s):
  - [`2359c5a`](https://github.com/shaahink/conductor-site/commit/2359c5a) feat(articles): the ledger that lied
  - [`239d249`](https://github.com/shaahink/conductor-site/commit/239d249) feat(evidence): what a session wrote down about itself, split by outcome
- **s14 (S6 Deliver)** — 4 commit(s):
  - [`bc021ae`](https://github.com/shaahink/conductor-site/commit/bc021ae) feat(reports): the engine run, whose release gate could disagree with it
  - [`29817f8`](https://github.com/shaahink/conductor-site/commit/29817f8) feat(reports): the long build, with the checkpoint that never closed as the subject
  - [`c70d83b`](https://github.com/shaahink/conductor-site/commit/c70d83b) feat(reports): the fleet round, read against the fleet either side of it
  - [`fcbbb72`](https://github.com/shaahink/conductor-site/commit/fcbbb72) feat(evidence): a forbidden list nobody is allowed to write down
- **s15 (S6 Deliver)** — 3 commit(s):
  - [`cb44186`](https://github.com/shaahink/conductor-site/commit/cb44186) chore: drop the commit-message scratch file
  - [`f5c751d`](https://github.com/shaahink/conductor-site/commit/f5c751d) feat(runs): the corpus table, once a real page had had a look at it
  - [`9afde8c`](https://github.com/shaahink/conductor-site/commit/9afde8c) feat(runs): every run in the corpus, including the ones that stopped

## Last gate run

site-fast:OK · generated:OK · evidence:OK

## Last session result

> **S6.4 landed — /runs lists all eighteen runs, three named abandoned. Stage S6 complete.**
> - QA of session 14: **PASS, no findings.** Battery re-run green from a clean tree before any edit (0 errors, 73 tests, build exit 0 / 474 annotations, evidence + anonymity green); all three evidence files on disk. Only nit: the database's com…
> - **S6.4 delivered and claimed.** `/runs` now carries the whole corpus below the three reports, oldest first, wholly from `corpus.json`: 20 `<tr>` (head + 18 runs + totals footer), `>running<` zero times in `dist/`, `abandoned` three times in…
> - **Two layout traps found only by looking at the built page**, both fixed and recorded in the ledger: Astro strips the whitespace between sibling elements, so `nowrap` inline spans left the row header with no break opportunity and a 343px mi…
>
> artefacts: `src/lib/corpus.ts`, `src/components/RunTable.astro`, `src/pages/runs/index.astro`, `src/layouts/SectionIndex.astro`, `src/content/schema.ts` (`corpusTable`), `src/content/sections/runs.yaml`, `src/lib/collections.ts`, `test/corpus.test.mjs`; commits `9afde8c`
>
> evidence: `docs/evidence/S6.4-the-corpus-index.md`, `docs/evidence/S6.4-runs-mocha.png`, `docs/evidence/S6.4-runs-latte.png` — battery at head 0 errors, 86 tests, build exit 0 with 478 annotations on 21 pages, `npm run evidence` and `npm run anonymity` both exit 0.
>
> gaps: bug #5 (EvidenceStrip cells have no minimum width) left open; bugs #2–#4 unchanged; `anonymity` still cannot check the quoted-prose half of the rule on a machine with no field notes; next action is S7.1, which must re-confirm `astro.config`'s `site`.

## Tracker handoff

```
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
```
