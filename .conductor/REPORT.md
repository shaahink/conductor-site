# Conductor — conductor-site - a field guide to agentic engineering run report

_Updated 2026-08-06 21:16 UTC · branch `main` · HEAD `14ec19f`_

**Status:** Idle
**Stage:** S1 —  · attempts used 0 · working ▸ S1.4
**Checkpoints:** 3/28 done · **Sessions run:** 1 · **Cost:** $9.0061 (agent $9.0051 + gates $0.0010) · **Tokens:** 141,057 in / 74,548 out

## Stage progress

| Stage | Title | Progress | State |
|---|---|---|---|
| S1 |  | ████████░░ 3/4 | **← active** |
| S2 |  | ░░░░░░░░░░ 0/4 | todo |
| S3 |  | ░░░░░░░░░░ 0/4 | todo |
| S4 |  | ░░░░░░░░░░ 0/4 | todo |
| S5 |  | ░░░░░░░░░░ 0/4 | todo |
| S6 |  | ░░░░░░░░░░ 0/4 | todo |
| S7 |  | ░░░░░░░░░░ 0/4 | todo |

<details><summary>S1 —  (3/4)</summary>

| # | Title | Status | Commit |
|---|---|---|---|
| S1.1 | The sixteen colour roles ship as CSS custom properties for both mocha and latte, lifted from the Face's own `color.go` rather than from upstream Catppuccin, with a test that fails when any role misses the Face's contrast bar (text ≥4.5:1, semantics and overlay ≥3:1, quiet roles ≥1.5:1 and ordered) | ✅ DONE | - |
| S1.2 | Typography and spacing: a humanist sans body at a 62–72ch measure through the Astro Fonts API consuming `cssVariable`, monospace reserved for machine truth, and a type scale used by name — no page hardcodes a size or a hex | ✅ DONE | - |
| S1.3 | The layout shell — top bar, three sections, reading column, sticky in-page TOC on wide viewports — plus a theme toggle that follows `prefers-color-scheme`, persists to `localStorage`, and survives first paint without a flash | ✅ DONE | - |
| S1.4 | The template's two `checkPlaceholders` `allow:` escapes are deleted and the build is green without them, so this site's own copy is guarded from here on | ⬜ TODO | - |

</details>

<details><summary>S2 —  (0/4)</summary>

| # | Title | Status | Commit |
|---|---|---|---|
| S2.1 | `concepts`, `articles` and `reports` exist as typed collections — Zod-only schemas in `schema.ts`, loaders in `content.config.ts`, an entry each in the `editable` map — with the concept schema carrying the five-move shape from SPEC Part III including `evidence` as keys rather than values | ⬜ TODO | - |
| S2.2 | The three index pages and the nav render from the collections, ordered by `order`, with `readNext` resolving to real entries and a build that fails on a dangling one | ⬜ TODO | - |
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

## Timeline

_Transitions with duration, from the event log (`.conductor/events.jsonl`)._

```
08-06 21:54:06  ◆ run started · conductor-site - a field guide to agentic engineering
08-06 21:54:07  ▸ stage S1 entered
08-06 21:54:07  • session #1 S1 Deliver started (attempt 1/4)
08-06 22:16:06  ▪ gate site-fast pass [session]  (8.5s)
08-06 22:16:06  ▪ gate generated pass [session]  (1.6s)
```

## Health

_Execution-health signals, folded from the event log (`.conductor/events.jsonl`)._

```
sessions 1 · retries 0 (0 %) · overall Ok
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

## Last gate run

site-fast:OK · generated:OK

## Last session result

> **Three of S1's four checkpoints landed — colour roles, type, and shell — all green.**
> - **S1.1** — the sixteen roles for mocha and latte lifted from Conductor's own theme registry (`face-go/internal/widgets/style.go`, not `color.go` as the brief said); `test/contrast.test.mjs` parses the shipped CSS and enforces the Face's bar…
> - **S1.2** — Source Sans 3 for reading, JetBrains Mono reserved for machine truth, a named type/space scale; `test/tokens.test.mjs` fails on any hex, size literal, raw font family or physical left/right property in site CSS, proven red on a p…
> - **S1.3** — top bar, reading column, sticky TOC component, and a theme toggle verified in a real browser: both schemes from `prefers-color-scheme` alone, the stored choice surviving a reload against an opposite system preference, and `html.j…
>
> artefacts: `src/styles/tokens.css`, `src/styles/type.css`, `src/styles/styles.css`, `src/components/TopBar.astro`, `src/components/Toc.astro`, `src/layouts/Reading.astro`, `src/scripts/theme.js`, `test/{contrast
>
> evidence: `docs/evidence/S1.1-contrast.txt`, `docs/evidence/S1.2-type.txt`, `docs/evidence/S1.3-shell.md` + `S1.3-latte.png`, `S1.3-mocha.png`. Final battery: `npm run check` 0 errors / 17 tests pass, `npm run build` green 3 pages, generated files clean.
>
> gaps: S1.4 not started — the two `checkPlaceholders` `allow:` lines still stand because `home.yaml` still carries `New Site` and two `TODO:` strings; deleting them requires writing the real copy first. `Toc.astro` and `Reading.astro` are compile-proven only; no page uses a reading layout until S2.4. Astro's container API cannot render `.astro` under bare `node --test`, so component-level tests await a f…

## Tracker handoff

```
last: **session 1** delivered S1.1, S1.2, S1.3. QA of the planning session: its claims hold —
  check 0 errors, build green 3 pages, generated clean, and the store answers 19 runs (18 + this).
  `npm run check` now runs `astro check` **and** `node --test`, so the existing check-build gate
  enforces 17 tests with no new gate. All green at handoff; working tree clean.
correction: the sixteen roles are in `face-go/internal/widgets/style.go` (mocha :58, latte :84),
  NOT `color.go` — that file is only Hex/Luminance/IsLight. The contrast bar copied into
  `test/contrast.test.mjs` is `theme_test.go:44-86`.
do not re-derive: checkpoint counts come from `conductor history --json`, NOT from SQL (SPEC
  Part VI). Windows PowerShell mangles `git commit -m` here-strings containing double quotes —
  use `git commit -F <file>`. `node --test` needs the glob form, a bare directory arg fails.
next: **S1.4** — delete the two `allow:` lines in `astro.config.mjs` and write real
  `meta.description` / `meta.ogDescription` (and a real title/hero) into
  `src/content/pages/home.yaml`; `New Site` and both `TODO:` lines are what the escapes are
  hiding. Then `npm run build` must be green without them. After that S2.
open: `Toc.astro` + `Reading.astro` typecheck and build but no page uses a reading layout yet —
  check the TOC in a browser when S2.4's concept page lands. Bug #1: the review widget's chrome
  still wears the template's neutral palette. The wordmark reads `field guide` — owner may rename.
```
