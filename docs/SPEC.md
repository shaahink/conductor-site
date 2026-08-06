# conductor-site — a field guide to agentic engineering

**Status:** authored 2026-08-06, planning session. This document is the authority for the run.
Conductor never re-plans; it enforces what is written here.

**Plan bundle:** `conductor.plan.json` + [`TRACKER.md`](../TRACKER.md) + `plans/templates/`.
**Repo:** `shaahink/conductor-site` (PUBLIC), created from `shaahink/site-template`.
**Fleet:** Astro 7 + `@shaahink/sitekit` 0.27.0, same machinery as every other sk site.

---

## Part I — What this site is

### The one idea

> Ten concepts the market is hiring for, each one worked end to end in a real orchestrator,
> with what it cost.

The site explains **concepts**, not a product. Each concept page states the idea in plain
language a reader can use anywhere, then shows exactly how **Conductor** implements it, then
points at a **real run** where it happened and what that cost. Conductor is the worked example
and the evidence — it is not the pitch.

### Why this framing and not a product site

The owner asked for this explicitly: *"doesn't have to directly be marketing of the conductor,
but to be around the concepts with examples how these concepts are done in conductor."*

It is also the version that survives a cold reader. Someone who has never heard of Conductor can
land on `/concepts/context-engineering`, learn something true about context budgets, and leave
better informed. That reader is the target. A visitor who wants the tool itself gets one honest
`/conductor` page and the GitHub link.

### The three litmus tests

Apply these to every page. They settle arguments without appealing to taste.

1. **Every number is traceable.** If a figure appears on the site, a reader must be able to see
   where it came from, and the `evidence` gate must be able to recompute it from the run store.
   No rounded-up claims, no "10x", no invented benchmarks. See Part VI.
2. **The failures are on the page.** The differentiator is not that the runs worked. It is that
   the waste, the rollovers, the aborted runs and the bugs are published beside the wins. A page
   that reads like a case study has failed this test.
3. **A concept page is useful without Conductor.** If deleting the Conductor section leaves
   nothing worth reading, the concept half was not written — it was a feature description
   wearing a concept's name.

### Voice

Plain, specific, unhurried. Short sentences carrying real nouns. The reader is a working
engineer who is tired of hype in both directions — "agents will replace us" and "agents are
useless" are equally unwelcome. Assume competence, explain jargon once, never twice.

Never: "revolutionary", "game-changing", "seamless", "unlock", "supercharge", "the future of".
Never an em-dash-heavy rhetorical build. Never a sentence whose only content is enthusiasm.

---

## Part II — The face

### Theme: Conductor's own two schemes

Conductor's terminal Face ships four themes (`face-go/STYLE.md`). The site wears **the same two
the Face defaults to**, so the site and the tool are visibly one thing:

| | scheme | role |
|---|---|---|
| dark | **Catppuccin Mocha** | the default; matches `conductor-face` out of the box |
| light | **Catppuccin Latte** | the light mode, with the Face's own in-hue darkening (see below) |

Follow `prefers-color-scheme`, plus a visible toggle that persists to `localStorage`. Both
schemes are first-class: neither is a filtered version of the other.

**The sixteen roles, named not hexed.** Copy the role table from Conductor's `face-go/STYLE.md`
into CSS custom properties, and *use the role names in every rule*. A component that writes
`#CBA6F7` is correct in mocha and wrong in latte — the exact rule the Face enforces on itself.

```css
:root {                       /* mocha — the default */
  --accent:  #CBA6F7;  --blue:   #89B4FA;  --green:  #A6E3A1;  --red:     #F38BA8;
  --yellow:  #F9E2AF;  --peach:  #FAB387;  --teal:   #94E2D5;  --sky:     #89DCEB;
  --text:    #CDD6F4;  --overlay:#6C7086;  --pending:#585B70;  --skipped: #7F849C;
  --surface: #313244;  --selection:#45475A;--mantle: #181825;  --base:    #1E1E2E;
}
```

**Latte is not stock Catppuccin Latte.** Conductor darkens green/yellow/peach/teal/sky in-hue
because stock Latte's yellow sits at 2.3:1 on its base — invisible when painted as status text.
Take the shipped values from **`face-go/internal/widgets/style.go`** — the `themes` map, mocha at
`:58` and latte at `:84` — not from the Catppuccin site. (Corrected in session 1: `color.go` holds
only `Hex`, `Luminance` and `IsLight`, no palette.) Every role must clear the Face's own legibility
bar, which is `face-go/internal/widgets/theme_test.go:44-86`
(`TestEveryThemeIsLegibleOnItsBase`): text ≥4.5:1, semantics and overlay ≥3:1, quiet roles ≥1.5:1
and ordered so `pending` recedes furthest.

### Friendly, not a terminal cosplay

The owner asked for Conductor's vibe *"but friendly and easy to read"*. The resolution:

- **Body text is a humanist sans at a generous size** (17–18px, measure 62–72ch, line-height
  1.65). Long-form reading is the site's main job and a monospace wall defeats it.
- **Monospace is reserved for machine truth** — costs, token counts, run ids, gate names, CLI
  lines, checkpoint tables. When the reader sees mono, they are looking at something recomputed
  from the store. That makes the typeface itself carry meaning.
- **One accent, used where it means something.** Mauve marks the current thing. Semantic colours
  (green/red/yellow/peach) are for status only, never for decoration.
- **No gradients, no shadows, no rounded card soup.** Hairline rules in `--surface`, generous
  space. The Face's own discipline: "panels breathe".
- Fonts through Astro's Fonts API so they build same-origin (the template's CSP is same-origin
  only). **Consume the `cssVariable`, never the raw family name** — the built CSS hashes family
  names, and a token naming the raw family silently renders the fallback forever. This has
  already shipped once in this fleet.

### Layout

- A quiet top bar: wordmark, the three sections (Concepts · Articles · Runs), theme toggle.
- Concept and article pages are a single reading column with a sticky in-page table of contents
  on wide viewports.
- **The evidence strip** is the site's signature component: a monospace band that carries the
  run figures a page cites, rendered from harvested data, never hand-typed. It appears at the
  foot of every concept page and inline in articles.
- Reduced motion honoured; nothing animates that a reader did not ask for.

---

## Part III — The content model

Three collections beside the template's `homePage`. All YAML in `src/content`, schemas in
`src/content/schema.ts` (Zod only — no Astro imports, see the template's own note), loaders in
`src/content.config.ts`, and an entry in the `editable` map for each.

| collection | dir | what |
|---|---|---|
| `concepts` | `src/content/concepts/` | the ten concept pages |
| `articles` | `src/content/articles/` | the four long-form pieces |
| `reports` | `src/content/reports/` | the three anonymised run reports |

**Concept entry shape** (the spine of the site — every concept page is the same five moves):

```yaml
slug: context-engineering
order: 3
title: "Context engineering"
alsoKnownAs: ["context management", "prompt engineering at scale"]
oneLine: "Deciding what an agent is allowed to know, and paying for it."
theIdea:      # 3–6 paragraphs. True anywhere. No Conductor.
theProblem:   # what goes wrong without it, concretely
inConductor:  # the mechanism, with file:line citations into shaahink/conductor
  mechanism:
  citations: [{ path: "src/Conductor.Core/PromptBuilder.cs", line: 203, note: "…" }]
evidence:     # keys into the harvested corpus — NEVER literal numbers
  runs: ["sarban-face", "nine-streets"]
  figures: ["softBreaks", "rollovers"]
tryIt:        # 1–3 commands a reader can actually run
readNext: ["token-economics", "durable-execution"]
```

`evidence.figures` naming keys rather than values is the mechanism behind litmus test 1: a
number cannot be typed into content, only referenced, so it cannot drift.

Every page carries `data-sk-edit` annotations (the build fails on one that stops resolving) and
real `meta.description` / `meta.ogDescription` — **delete the template's two `allow:` escapes in
`astro.config.mjs` at S1**, so `checkPlaceholders` starts guarding this site properly.

---

## Part IV — The concept spine

Ten pages. Each names the market term *first* — these are the words in the job ads the owner's
research collected — then the mechanism, then the evidence.

| # | Concept | Conductor's answer | Evidence to cite |
|---|---|---|---|
| 1 | **Agentic engineering / AI-native development** | the session cycle mechanised: pick → spawn → watchdog → verify → record → repeat | the whole corpus: 18 runs, 340 sessions, $3,016.29 |
| 2 | **Multi-agent orchestration** | six session *kinds* (deliver, fix, resume, audit, verify, review) + a cheap advisor lane on a smaller model; satellite repos | `costs.category` splits agent $3,015 vs advisor $0.09 — orchestration is not "many big models" |
| 3 | **Context engineering** | `PromptBuilder` templates, read-order, packs, the knowledge ledger, handoff blocks; an unresolved `{token}` **throws** and parks the run | the rendered prompt is written to `logs/session-NNN.prompt.md` every session |
| 4 | **Token economics & context budgets** | `maxSessionTokens` ceiling (counts cache reads), `softBreakRatio` nudge, cooperative wrap-up, rollover — and the **floor rule**: a cap must sit above the tokens one session needs to orient, work and commit | 47.5M in / 17.8M out / **3.8B cache-read**; 123 soft breaks, 53 rollovers. **The headline: a cap set below the floor cost 25–54M per checkpoint against 20.0M uncapped** — see article 3 |
| 5 | **Evals, gates and acceptance** | the gate battery: real commands, real exit codes, per-stage tiers, cached per commit SHA, one unconditional retry | **648/677 gates green** across the corpus |
| 6 | **Independent verification (guardrails)** | the verifier is a *separate program*: an agent cannot flip a red build green; tracker claim ≠ confirmation; `DONE` vs `DONE ✓` | the phase gate is the only path that confirms a stage |
| 7 | **Durable execution & resumability** | event-sourced store, session boundaries, plan hot-swap mid-run, crash resume, rollover consuming no attempt | 53 rollovers recovered; a run resumed across a process restart |
| 8 | **Human-in-the-loop** | owner-gated stages, `blocked-until`, the owner queue, push-only remote notification | **7 owner approvals** across the corpus, each one recorded as an event |
| 9 | **Agent observability** | the event spine, `history` / `money` / `budget` / `journey`, the terminal Face | this site's own reports are built from that store — the loop closes |
| 10 | **Agent memory** | the knowledge ledger, lessons, and a **run-scoped bug ledger** — including the trap that an era's open bugs vanish when the next plan starts | **167 bugs filed** across the corpus |

Order is the reading order. Each page ends with `readNext`.

---

## Part V — The articles

Medium length (1,200–2,000 words). Concise, insight-dense, no filler. Each one must contain at
least one number nobody else publishes.

1. **"What an autonomous run actually costs"** — the P&L across 18 runs: $3,016.29, 340
   sessions, $9.37 a session, ~$10.85 a confirmed checkpoint. Then the waste: one stage that
   burned $51.98 (23% of its run) because the engine had no way to express *wait* while a deploy
   window was full, so it paid three agents to re-read a clock. The honest accounting is the
   article.
   ⚠️ **Re-verify `$51.98` and `23%` against `conductor money` before publishing** — they were
   hand-derived and have not been re-measured since the verbs shipped. Every other figure in this
   article comes from the harvest; these two do not yet.
2. **"Never believe the agent"** — why verification has to be a separate program with real exit
   codes, why a tracker claim is not evidence, and what `DONE` vs `DONE ✓` buys. The 29 red
   gates out of 677 are the point: they are the times the system caught something.
3. **"The nudge that sat below the median"** — how a token budget gets *measured* instead of
   guessed. **Corrected 2026-08-06 against `conductor budget`. The earlier draft of this entry
   carried three figures that are not in the ledger — "zero of eleven", "16.9M median" and
   "30.0M p90". None of them has a source. Use only what is below.**

   The engine's own run, capped at **8M with the nudge measured at 6.07M**, rolled over **10 of 33
   capped sessions (30%)**. That nudge sat at **1.30× the repo's floor** — which was the rule at
   the time, and the rule was wrong: 6.07M is **0.84× the 7.26M median session that actually
   closed a checkpoint**, so it was interrupting the *typical* session, not just the outsized one.
   Re-derived from the one run that had gone uncapped (median closer **17.5M**), the ceiling moved
   to **32M** with the measured nudge point at **22.5M** — headroom 9.46M at **5.0× the measured
   1.86M wrap-up**. Result: **zero rollovers in 26 costed sessions**, and the *cheapest* window of
   the three at **15.5M per checkpoint** against the capped 8M window's 17.0M.

   The counterintuitive half, and the reason the article exists: a static-site repo in the same
   fleet was capped at **6M — below its own floor** — and cost **25–54M per checkpoint against
   20.0M uncapped**. One stage spent **9 sessions and 53.8M tokens to close a single checkpoint**,
   7 of the 9 rolled over. **A cap below the floor is worse than no cap:** it does not save
   tokens, it buys churn. Raised to 9M the same repo fell to 12.8–15.3M and one stage rolled zero
   of six.

   Two rules a reader can copy: set the nudge to clear the **median closing session**, not the
   floor; and keep **headroom ≥1.5–2× the measured wrap-up**, because wrap-up cost is absolute
   while expressing the reserve as a *ratio* shrinks it exactly when it must stay constant.
4. **"The ledger that lied"** — when a run's own record of itself is wrong. A rolled-over session
   returned before its verdict pass (`SessionRunner.cs:411`), so it recorded neither its commits
   nor its claims. The ledger therefore says **no rollover ever committed** — 34 rollovers and 11
   rollovers across two runs, **zero** with a commit count. **That is an accounting artifact, not
   the truth.** Git ground truth over each rolled-over session's own start/end window says
   **19 of 34 (56%)** and **10 of 11 (91%)** left at least one agent commit. Rollovers usually
   *do* commit; what is always zero is the record of it — which is an excellent way to conclude a
   cap is destroying work when it is not. What it takes to trust your own telemetry.

---

## Part VI — The reports, and the anonymisation rule

### The rule

Run reports are **generalised into scenarios**, and the owner was explicit that this is *for the
reader*, not only for privacy: a reader should be able to map their own situation onto the
report. "A four-site web fleet with a shared component library" is more useful to a stranger
than a client's name, and it is also the safe form.

**Hard constraints — these are not stylistic:**

- **No client names, ever.** The site fleet's clients are private individuals with private
  repos. Not their names, not their domains, not their sites' names, not identifying detail.
- **No private repo names in report prose.** Public repos (`conductor`, `DevContext2`,
  `Shamshir`, `sitekit`, `site-template`) may be named. Everything else is described by shape.
- **Never quote `docs/dev/FIELD-NOTES-*.md`.** They are deliberately untracked private client
  content. Their *numbers*, recomputed from the run store, are fine; their prose is not.
- No tokens, no chat ids, no absolute paths from the owner's machine, no environment values.
- The reader-facing scenario must not be a thin disguise: if swapping the name back in is the
  only difference, generalise harder.

### The three reports

| report | the real run | published as |
|---|---|---|
| **A — the fleet round** | `sk-fleet round four`, 25/25, 28 sessions, $425.12 | "A four-site web fleet, one shared component library, one round of coordinated changes" |
| **B — the long build** | `NINE STREETS`, 45/46, 69 sessions, $421.46, 34 rollovers, 55 soft breaks, 3 owner approvals | "A large interactive feature built inside an existing site — the run that ended at 45 of 46, and why the last one did not close" |
| **C — the engine run** | `DevContext graph-v2`, 22/22, 26 sessions, $358.42, 72/81 gates | "A static-analysis engine for a compiled language, with an evaluation suite as the release gate" |

Report B ending one short of complete is **deliberately the one we publish**. It is the honest
case, and the site is worth more for carrying it.

Plus **`/runs`** — the corpus index: all 18 runs as a table, generalised labels, real numbers,
generated wholly from harvested data.

### The harvest pipeline

`scripts/harvest.mjs` → `src/data/corpus.json`, committed, regenerated by a gate.

**Authoritative sources, in this order:**

0. **`conductor budget` and `conductor money`** for anything budget-shaped — floors, median
   closers, wrap-up, rollover rates, tokens-per-checkpoint, blended $/M. **Do not re-derive these
   in SQL.** These verbs compute them from the ledger, and in August 2026 they were run against a
   hand-derived analysis of exactly these numbers and **contradicted four of it** — the cap's
   benefit had been published as 4.0× and measured 1.6×, because one window's cost had been
   divided by another window's checkpoints. Where a hand query and these verbs disagree, the verbs
   are the ones reading the data. Note the denominator: `budget` rates use **costed** sessions
   (those that recorded agent tokens), not all sessions.

   ⚠️ **`runs.limits_json` is NULL for every imported run.** The store does not record what a run's
   cap was, so no cap figure can be recomputed by the `evidence` gate. Either source caps from
   `conductor budget` (which reconstructs the windows from the data) or state on the page that the
   cap values come from the plan files and are not gate-verified. Do not publish a cap figure as
   though the harvest proved it.

1. **`conductor history --json --limit 0`** — the run-level truth: sessions, `checkpointsDone`
   / `checkpointsTotal`, `costUsd`, `tokens`, status, branch, engine version, `limits`.
   **Use this for checkpoint counts.** Raw SQL cannot reproduce them: the engine folds
   checkpoints out of the event log, and a naive `CheckpointConfirmed` count returns 65 where
   the engine's own answer is 287 of 300. This trap was hit during planning; do not re-derive it.
2. **Read-only SQLite** against each `runDb` for what the JSON does not expose: `costs` by
   `category` (agent / advisor / gate) with `tokens_in` / `tokens_out` / `tokens_cache`, `gates`
   pass rates, `bugs`, `scores`, `events` by `type`, and `sessions.outcome='RolledOver'`.
   Open with `mode=ro`. Never write.
3. **`anonymise.json`** — the hand-maintained map from run id → published scenario label. A run
   with no entry is **excluded from the site**, not published under its real name. Fail closed.

The `evidence` gate re-runs the harvest and fails if `corpus.json` is stale, and fails if any
published figure key is missing from it. That is this site keeping its own first litmus test —
the same bargain the fleet's `checkAnnotations` and `checkPlaceholders` gates already make.

---

## Part VII — The stages

Seven stages, 28 checkpoints. Detail in [`TRACKER.md`](../TRACKER.md).

| stage | what closes it |
|---|---|
| **S1 — The face** | both schemes, the role tokens, type scale, layout shell, theme toggle, contrast test passing |
| **S2 — The content model** | three collections, schemas, `editable` map, nav, index pages, annotations resolving |
| **S3 — The harvest** | `harvest.mjs`, `anonymise.json`, `corpus.json`, the evidence strip component, the `evidence` gate wired and red-when-stale |
| **S4 — The concept spine** | all ten concept pages, each passing the three litmus tests |
| **S5 — The articles** | all four, every figure keyed to the corpus |
| **S6 — The reports** | three reports + `/runs`, anonymisation rule enforced |
| **S7 — Ship** | SEO/OG, a11y pass, headers regenerated, Vercel project live, README, owner gate |

---

## Appendix A — The run corpus (measured 2026-08-06)

Consolidated into the machine state home during the planning session by importing seven legacy
`.conductor/run.db` files the conductor way (`conductor doctor -p <plan>` triggers
`StateMigration.ImportLegacy`, which **copies** and leaves the original in place).

```
18 runs · 7 repos · 340 sessions · 287/300 checkpoints · $3,016.29
47.5M tokens in · 17.8M out · 3.8B cache-read
648/677 gates green · 53 rollovers · 123 soft breaks · 7 owner approvals · 167 bugs filed
$9.37 per session · ~$10.85 per confirmed checkpoint
```

| run | repo | plan | ckpt | sess | cost | gates |
|---|---|---|---|---|---|---|
| `0031daaa` | conductor-baton | Maestro | – | 1 | $0.00 | 0/0 |
| `1e942d7e` | conductor-baton | Maestro | – | 3 | $0.17 | 0/4 |
| `02cf8280` | conductor-baton | Conductor UX | – | 1 | $0.00 | 0/0 |
| `1a7c1714` | conductor-baton | Conductor UX | 6/11 | 11 | $139.68 | 27/27 |
| `fc2e69df` | site-template | shared CI + 404 | 2/2 | 1 | $2.91 | 3/3 |
| `13a91f1d` | sk-platform | fleet 09.6 | 29/29 | 24 | $224.28 | 20/20 |
| `3dd4564a` | sk-platform | fleet round four | 25/25 | 28 | $425.12 | 32/32 |
| `e9e21d10` | conductor | Sarban core | 26/26 | 28 | $360.14 | 94/96 |
| `8cefa5de` | conductor | Sarban face | 24/24 | 41 | $297.24 | 104/110 |
| `a007ef6c` | sk-platform | fleet round five | 17/17 | 17 | $222.63 | 38/38 |
| `7951c3ca` | sk-studio | NINE STREETS | 45/46 | 69 | $421.46 | 59/59 |
| `bae63ba0` | DevContext2 | graph-v2 remainder | 22/22 | 26 | $358.42 | 72/81 |
| `1ddd2036` | sk-studio | THE SECOND REEL | 17/17 | 15 | $97.48 | 24/24 |
| `79cacf31` | conductor-cihealth | CI health | 20/20 | 12 | $37.99 | 23/28 |
| `df9c4af8` | conductor | Karvan core | 25/32 | 32 | $317.84 | 97/100 |
| `7195e538` | sk-studio | A NAME AND A WAY OUT | 20/20 | 15 | $110.93 | 43/43 |
| `f1c4d068` | *(temp)* | conductor-demo | 3/3 | 6 | $0.00 | 6/6 |
| `2349f46b` | *(temp)* | w5-rehearsal | 6/6 | 10 | $0.00 | 6/6 |

`Shamshir/.conductor/run.db` was inspected and **not** imported: it is a 4 KB stub with no
`runs` table — a store that was created and never written to.

**Three** runs marked `running` (`1a7c1714`, `1e942d7e`, `0031daaa`) are **abandoned, not live** —
July runs whose engine exited without closing the record. That is itself an honest data point
for concept 9, and the reports must not present them as in-flight. *(Said "Two" and listed three
until 2026-08-06. `TRACKER.md` S6.4 has always said three; three is correct.)*

⚠️ **Label the denominator on every per-session rate.** The corpus has **340 sessions**, but only
**315** recorded agent tokens. `conductor budget` divides by **costed** sessions and says so; the
`$9.37 per session` above divides by 340. Both are defensible, neither is self-describing, and a
page that mixes them is wrong twice. Pick one, name it in the evidence strip, and keep the whole
site on it.

---

## Appendix B — Traps this run will hit

Carried into the plan's `promptExtra`. Every one is already paid for.

1. **The engine on `PATH` is 0.4.0.** It is the published build, not any working tree. Fine
   here — this repo is not the engine — but `conductor` verbs are read-only against a store
   shared with other repos. Never run `conductor` verbs that write to another repo's run.
2. **A second conductor run may share this machine.** Before anything that touches ports, pids
   or installs: check. Never kill a "stale" dotnet/conductor process. Never run
   `tools/install.ps1` from the conductor repo during this run.
3. **`conductor plan set` drops every comment in the plan file**, and the plan *editor*
   re-serialises the whole file — silently changing `progress.kind`, gate timeouts, and dropping
   the JSONC header. `git diff` the plan file structurally before any reload.
4. **`templatesDir` resolves against the plan file's directory**, not the repo root. `tracker`
   and `planDoc` are repo-relative. They differ on purpose.
5. **`agent.model` is dropped silently unless `{model}` appears in BOTH `args` and
   `resumeArgs`.** Verify with `conductor journey` — the Model column must never read `(default)`.
6. **Checkpoint counts come from `conductor history --json`, not from SQL.** See Part VI.
7. **The Astro Fonts API hashes family names.** Consume `cssVariable`, never the raw name.
8. **The editor stylesheet is copied into `public/`, not imported** — importing it changes every
   page's CSP for no reason. `npm run editor` is the copier; the `generated` gate diffs it.
9. **Delete the two `allow:` lines in `astro.config.mjs`** at S1. They exist for the template.
10. **A stage id must match `[A-Za-z]+\d+`.** A letters-only id owns no tracker rows and fails
    silently — doctor says "declare no work items".
11. **Anonymisation fails closed.** A run absent from `anonymise.json` is excluded, never
    published under its real name.
12. **This site is PUBLIC from commit one.** Nothing private goes in, including in commit
    messages, evidence files and the tracker.
