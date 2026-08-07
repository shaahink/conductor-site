# Conductor — conductor-site - a field guide to agentic engineering run report

_Updated 2026-08-07 00:22 UTC · branch `main` · HEAD `5612369`_

**Status:** Idle
**Stage:** S3 —  · attempts used 0
**Checkpoints:** 12/28 done · **Sessions run:** 8 · **Cost:** $46.7545 (agent $46.7485 + gates $0.0060) · **Tokens:** 926,903 in / 383,678 out

## Stage progress

| Stage | Title | Progress | State |
|---|---|---|---|
| S1 |  | ██████████ 4/4 | done |
| S2 |  | ██████████ 4/4 | done |
| S3 |  | ██████████ 4/4 | done |
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
| S2.3 | Every page carries `data-sk-edit` annotations that resolve, real `meta.description` and `meta.ogDescription`, and `npm run check` reports zero errors | ✅ DONE | [`a6d5f98`](https://github.com/shaahink/conductor-site/commit/a6d5f98) |
| S2.4 | One concept page is written end to end as the worked example that proves the shape holds, and it passes all three litmus tests in SPEC Part I | ✅ DONE | [`a6d5f98`](https://github.com/shaahink/conductor-site/commit/a6d5f98) |

</details>

<details> ✅<summary>S3 —  (4/4)</summary>

| # | Title | Status | Commit |
|---|---|---|---|
| S3.1 | `scripts/harvest.mjs` reads `conductor history --json --limit 0` for run-level truth and read-only SQLite for what that does not expose (costs by category, gate pass rates, bugs, scores, event counts, rollovers), and writes `src/data/corpus.json` | ✅ DONE | - |
| S3.2 | `anonymise.json` maps run id → published scenario label, and the harvest **fails closed**: a run with no entry is excluded from the corpus rather than published under its real name, proven by a test that adds an unmapped run | ✅ DONE | - |
| S3.3 | The evidence strip component renders figures from `corpus.json` by key, and a page that names a key absent from the corpus fails the build rather than rendering blank | ✅ DONE | - |
| S3.4 | The `evidence` gate re-runs the harvest and goes red when `corpus.json` is stale or a cited key is missing, proven by a deliberate staleness both ways | ✅ DONE | - |

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
| 5 | S3 | Deliver | 1 | 08-06 22:20 | 0:19 | LimitBackoff |  | 0 |  | $6.9597 |  | 146,851/68,499 |
| 6 | S3 | Resume | 1 | 08-06 23:10 | 0:00 | LimitBackoff |  | 0 |  | $0.0000 |  |  |
| 7 | S3 | Resume | 1 | 08-06 23:40 | 0:00 | LimitBackoff |  | 0 |  | $0.0000 |  |  |
| 8 | S3 | Resume | 1 | 08-07 00:10 | 0:11 | Advanced | S3.3 S3.4 | 5 | site-fast:OK · generated:OK | $7.3490 | $0.0013 | 198,956/33,052 |

## Money

_What this run has cost, from its own `costs` rows. Same numbers as `conductor money`._

| scope | sessions | tokens | cache reads | cost | checkpoints | tok/ckpt | $/ckpt |
|---|---|---|---|---|---|---|---|
| **run total** | 7 | 47.9M | 97.7% | $39.40 | 8 | 5.98M | $4.93 |
| stage S1 | 2 | 19.7M | 98.0% | $15.40 | 4 | 4.92M | $3.85 |
| stage S2 | 2 | 20.4M | 97.7% | $17.04 | 4 | 5.09M | $4.26 |
| stage S3 | 3 | 7.79M | 97.2% | $6.96 | - | - | - |
| 2026-08 | 7 | 47.9M | 97.7% | $39.40 | 8 | 5.98M | $4.93 |

_Where the money goes: agent $39.40 (100%) · gate $0.00 (0%) · blended $0.82/M tokens._

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
```

## Health

_Execution-health signals, folded from the event log (`.conductor/events.jsonl`)._

```
sessions 8 · retries 0 (0 %) · overall Ok
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

## Last gate run

site-fast:OK · generated:OK

## Last session result

> **S3 complete — harvest, fail-closed anonymisation, evidence strip, and the gate red both ways**
> - All four checkpoints claimed with fresh evidence; battery green (0 errors, 42 tests, 10 pages, 63 annotations)
> - Harvest reproduces the measured corpus exactly and caught three unreproducible figures in the spec itself (bug #3)
> - The evidence gate caught a real store change unprompted before it was ever aimed at anything
>
> artefacts: scripts/harvest.mjs, anonymise.json, src/data/corpus.json, src/lib/evidence.ts, src/components/EvidenceStrip.astro, test/harvest.test.mjs
>
> evidence: docs/evidence/S3.1-harvest.txt, docs/evidence/S3.2-fails-closed.txt, docs/evidence/S3.3-evidence-strip.txt, docs/evidence/S3.4-evidence-gate.txt
>
> gaps: bug #3 (SPEC's per-session and per-checkpoint rates are arithmetic errors) is recorded, not fixed in SPEC — S5.1 must name keys, never retype `$9.37` or `~$10.85`

## Tracker handoff

```
last: **session 5** delivered all four of S3 — harvest (cb373bb), fail-closed (24bfb37,
  4cfdc00), strip (0f5f4c9, ddebdf6), gate (6ca4398, 3a97fd3). **S3 is complete.** QA of
  session 4: no findings. Its S2.4 page named `sessions`, `cacheRead`, `ledgerEntries` and all
  three resolved against a corpus built afterwards from the store, with nothing adjusted to fit.
now on disk: `npm run harvest` reads `conductor history --json --limit 0` plus each run.db
  read-only into `src/data/corpus.json`, and reproduces Appendix A to the digit — 18 runs, 7
  repos, 340 sessions, 287/300, $3,016.29, 47.5M/17.8M/3.8B, 648/677, 53 rollovers, 123 soft
  breaks, 7 approvals, 167 bugs. `npm run evidence` is the gate: red on a stale corpus (naming
  the field that moved) and red on a cited key or run label the corpus lacks. `EvidenceStrip`
  renders keys at the foot of concepts and inline in long-form; `ordered()` fails the build on a
  key that does not resolve. Battery: 0 errors, 42 tests, 10 pages, 63 annotations.
next: **S4.1** — concepts 1–3. `context-engineering` is already written (S2.4); agentic
  engineering and multi-agent orchestration are new. Corpus keys available to cite are printed by
  any failing build, or read `corpus` and any run's `figures` in corpus.json. Per-run and
  corpus-wide are **separate namespaces**: `sessions` is one run, `totalSessions` is the corpus,
  and a per-run key on a page naming no runs is refused.
open: **three published figures in SPEC do not reproduce and must never be retyped** — bug #3:
  Appendix A's `$9.37` a session is `$8.87` (3016.29/340) and `~$10.85` a checkpoint is `$10.51`
  (3016.29/287); its "315 costed sessions" is 314 under the definition the corpus states. The
  totals are all exact; only the divisions are wrong. S5.1 names the keys and gets the right
  ones. Bug #2 — `--overlay` prose ~3.3:1, S7.2's call. **S7.1 must re-confirm `site` against
  the deployed URL.** The wordmark and the footer's owner name are owner calls.
tooling: **never `git checkout --` a file whose new version is uncommitted** — commit first,
  break-test second. Write commit messages to a file and use `-F`. `conductor bg` cannot exec
  bare `npm` — use `npm.cmd`; the battery is ~15s, so foreground it. **A failed Astro build
  exits 0xC0000409 after a libuv assertion, not 1** — which is why the evidence gate is plain
  Node and not a build wrapper. `conductor history --json` emits a UTF-8 BOM on Windows; strip
  it before `JSON.parse`. **One run.db holds several runs** — filter every query by `run_id`.
```
