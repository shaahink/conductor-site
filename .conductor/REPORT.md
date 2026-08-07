# Conductor — conductor-site - a field guide to agentic engineering run report

_Updated 2026-08-07 02:04 UTC · branch `main` · HEAD `ebde9fc`_

**Status:** Idle
**Stage:** S5 —  · attempts used 0 · working ▸ S5.4
**Checkpoints:** 19/28 done · **Sessions run:** 12 · **Cost:** $86.2030 (agent $86.1883 + gates $0.0147) · **Tokens:** 1,692,706 in / 698,268 out

## Stage progress

| Stage | Title | Progress | State |
|---|---|---|---|
| S1 |  | ██████████ 4/4 | done |
| S2 |  | ██████████ 4/4 | done |
| S3 |  | ██████████ 4/4 | done |
| S4 |  | ██████████ 4/4 | done |
| S5 |  | ████████░░ 3/4 | **← active** |
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
| S4.3 | Concepts 7–8 (durable execution, human-in-the-loop) written to the same bar | ✅ DONE | [`adbe41f`](https://github.com/shaahink/conductor-site/commit/adbe41f) |
| S4.4 | Concepts 9–10 (agent observability, agent memory) written, the spine reads in `order` end to end, and every `file:line` citation is verified to still resolve against `shaahink/conductor` at a named commit | ✅ DONE | [`adbe41f`](https://github.com/shaahink/conductor-site/commit/adbe41f) |

</details>

<details><summary>S5 —  (3/4)</summary>

| # | Title | Status | Commit |
|---|---|---|---|
| S5.1 | "What an autonomous run actually costs" — the corpus P&L including the waste, every figure keyed to `corpus.json` | ✅ DONE | [`1ef5db5`](https://github.com/shaahink/conductor-site/commit/1ef5db5) |
| S5.2 | "Never believe the agent" — verification as a separate program, built around the 29 red gates rather than the 648 green ones | ✅ DONE | [`1ef5db5`](https://github.com/shaahink/conductor-site/commit/1ef5db5) |
| S5.3 | "The nudge that sat below the median" — the measured-budget method, written so a reader can run it on their own store | ✅ DONE | - |
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
| 11 | S5 | Deliver | 1 | 08-07 01:09 | 0:25 | Advanced | S5.1 S5.2 | 2 | site-fast:OK · generated:OK · evidence:OK | $10.3443 | $0.0024 | 180,290/76,483 |
| 12 | S5 | Deliver | 1 | 08-07 01:36 | 0:27 | Advanced | S5.3 | 3 | site-fast:OK · generated:OK · evidence:OK | $10.4334 | $0.0033 | 190,206/83,979 |

## Money

_What this run has cost, from its own `costs` rows. Same numbers as `conductor money`._

| scope | sessions | tokens | cache reads | cost | checkpoints | tok/ckpt | $/ckpt |
|---|---|---|---|---|---|---|---|
| **run total** | 11 | 93M | 97.7% | $75.77 | 16 | 5.81M | $4.74 |
| stage S1 | 2 | 19.7M | 98.0% | $15.40 | 4 | 4.92M | $3.85 |
| stage S2 | 2 | 20.4M | 97.7% | $17.04 | 4 | 5.09M | $4.26 |
| stage S3 | 4 | 17.1M | 97.4% | $14.31 | 2 | 8.55M | $7.15 |
| stage S4 | 2 | 22.4M | 97.5% | $18.67 | 4 | 5.59M | $4.67 |
| stage S5 | 1 | 13.5M | 98.1% | $10.35 | 2 | 6.75M | $5.17 |
| 2026-08 | 11 | 93M | 97.7% | $75.77 | 16 | 5.81M | $4.74 |

_Where the money goes: agent $75.75 (100%) · gate $0.01 (0%) · blended $0.81/M tokens._

## Timeline

_Transitions with duration, from the event log (`.conductor/events.jsonl`)._

```
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
```

## Health

_Execution-health signals, folded from the event log (`.conductor/events.jsonl`)._

```
sessions 12 · retries 0 (0 %) · overall Ok
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
- **s11 (S5 Deliver)** — 2 commit(s):
  - [`1c56db4`](https://github.com/shaahink/conductor-site/commit/1c56db4) feat(articles): the twenty-nine that went red, and the four that never ran
  - [`1ef5db5`](https://github.com/shaahink/conductor-site/commit/1ef5db5) feat(articles): the bill, including the money that bought nothing
- **s12 (S5 Deliver)** — 3 commit(s):
  - [`ebde9fc`](https://github.com/shaahink/conductor-site/commit/ebde9fc) docs(tracker): S5.3 landed, handoff for S5.4
  - [`c33d05b`](https://github.com/shaahink/conductor-site/commit/c33d05b) feat(articles): the nudge that sat below the median
  - [`3896cb8`](https://github.com/shaahink/conductor-site/commit/3896cb8) feat(evidence): a window namespace, so a cap that moved can be compared

## Last gate run

site-fast:OK · generated:OK · evidence:OK

## Last session result

> **S5.3 landed — a window evidence namespace and the measured-budget article**
> - QA of session 11: no findings. Battery re-run green before any edit (0 errors, 49 tests, 306 annotations on 17 pages, evidence gate green over 13 entries); both prior articles on disk matched their claimed shape.
> - Built a third evidence namespace, `windows`, off `conductor budget <run> --json` — 22 windows, 8 under a measured ceiling, keyed `<run-label>-capped-<N>m`. A window is deliberately not required to carry every key (an uncapped one has no nud…
> - Article 3 written figure-free, 1,818 words, 14 evidence keys, six sections. Its number nobody else publishes: of 50 sessions killed at a ceiling, 50 had already been nudged and none stopped. Its method finding: a cap censors its own evidenc…
>
> artefacts: `src/content/articles/the-nudge-below-the-median.yaml`, `scripts/harvest.mjs` (readBudget/windowEntries/ceiling block), `src/lib/evidence.ts`, `src/content/schema.ts`, `test/harvest.test.mjs`, `src/data/corpus.json`; commits `3896cb8`, `c33d05b`, `ebde9fc`.
>
> evidence: `docs/evidence/S5.3-the-nudge-below-the-median.md` — astro check 0 errors, 57 tests pass, build 20 pages / 341 annotations resolve, evidence gate green over 14 cited entries, rendered strip 7 groups / 46 cells.
>
> gaps: S5.4 not started but fully measured — every figure is in the ledger note and the handoff, including the cause and fix at engine `1632b9f`; its git ground truth is in a private repo and must be described in words with no ratio published. SPEC Part V article 3's `26 costed` / `15.5M` are stale (now 30 / 16.8M) and corrected in the evidence file rather than on the page.

## Tracker handoff

```
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
```
