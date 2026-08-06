# Token budget — the measured numbers

**Measured 2026-08-06** against `conductor history --json --limit 0` and read-only SQLite across
all 18 run stores, cross-checked against `conductor budget` output recorded in
`C:/code/conductor/docs/dev/TOKEN-BUDGET-TUNING.md` §9 (re-measured 2026-08-05, K7.1/K7.2).

**This file exists because the numbers in the first draft of SPEC Part V article 3 were not in the
ledger.** Article 3 and concept 4 must be written from this table, not from memory.

Repo names appear here because this is planning material, the same tier as `docs/SPEC.md`
Appendix A. **Published pages use generalised scenario labels** — see SPEC Part VI.

## The three-way split

The question this settles: *which project burned tokens, and which one kept rolling over?* They
were different projects, with opposite signatures.

| Run | Repo | Ceiling / nudge | Costed sess | Rollovers | Tokens / checkpoint |
| --- | --- | --- | --- | --- | --- |
| graph-v2 | DevContext2 | 20M / 15.0M | 26 | **0** | floor **13.81M**, wrap-up 2.63M |
| sarban-core | conductor | uncapped | 28 | 0 | 19.4M · floor 5.52M · median closer **17.5M** |
| sarban-face 1–8 | conductor | uncapped | 7 | 1/7 (14%) | 26.5M · median closer 23.4M |
| sarban-face 9–41 | conductor | **8M / 6.07M** | 33 | **10/33 (30%)** | 17.0M · floor 4.66M · **median closer 7.26M** · wrap-up 1.37M (n=20) |
| **karvan-core** | conductor | **32M / 22.5M** | 26 | **0** | **15.5M** · floor 3.27M · median closer 13.8M · wrap-up 1.86M (n=7) |
| NINE STREETS | sk-studio | 6M / 0.7 → 9M | 69 | **34 (49%)** | stages C/E/F **25–54M** |
| THE SECOND REEL | sk-studio | 9M / 0.7 | 15 | 6 (40%) | 12.8–15.3M |
| A NAME AND A WAY OUT | sk-studio | 9M → 16M | 15 | 1 (7%) | stage H **0 of 6** rollovers |
| round four / five | sk-platform | **no ceiling** | 28 / 17 | **0** | — |

**DevContext2 was the token-hungry one and never rolled over.** Its floor is ~2× conductor's and
~2.5× sk-studio's because its sessions build a large .NET solution, run gate batteries and analyse
multi-repo canary poles. It was sized correctly for an expensive repo.

**The site repo was the roller, because its cap was too low.** 6M sat *below* its own floor.

## The two headline findings

1. **A cap below the floor is worse than no cap.** sk-studio uncapped: **20.0M** per checkpoint.
   sk-studio at 6M: **25–54M**. Stage F spent **9 sessions and 53.8M tokens on one checkpoint**,
   7 of 9 rolled over. Below the floor nothing lands in one session, every session pays
   orientation again, and the total rises. *The cap did not save tokens; it bought churn.*
2. **A large correctly-placed ceiling beat a small one on both churn and cost.** 32M → 0 rollovers
   and 15.5M/checkpoint; 8M → 30% rollovers and 17.0M/checkpoint. Not a price effect — all three
   runs blend to **~$0.74/M at 98.3% cache reads**. Cost per turn rises with context while work
   per turn does not, so the saving is **work per token**.

## The rule that was wrong

Step 4 used to read *"set the nudge to clear the repo's floor."* sarban-face's nudge was
**1.30× its floor — comfortably clear** — and still bought 30% rollovers, because 6.07M is
**0.84× the 7.26M median closing session**. The floor is the *smallest* session that ever closed
anything; a nudge that only beats the floor still interrupts the median session.

Corrected rule: nudge = `max(1.05 × largest closer, floor + wrap-up)`, headroom **≥1.5–2× the
measured wrap-up**. `conductor budget` raises `NUDGE BELOW THE MEDIAN CLOSER` when nudge ÷ median
closer drops under 1.0×.

Headroom against observed rollover rate:

| configuration | headroom | wrap-up | rollover rate |
| --- | --- | --- | --- |
| sk-studio 6M / 0.7 | 1.8M | ~1–2M | **67%** (31 of 46) |
| conductor 8M / 0.76 | 1.93M (1.4×) | 1.37M | **30%** (10 of 33) |
| sk-studio 9M / 0.7 | 2.7M | ~1–2M | 22%; stage H 0 of 6 |
| DevContext2 20M / 0.75 | 5.0M | 2.63M | 0 |
| **conductor 32M / 0.70** | **9.46M (5.0×)** | **1.86M** | **0 of 26** |

## Two accounting artifacts — do not read these as facts

1. **The ledger says no rollover ever committed.** sk-studio 34 rollovers / 0 with commits;
   conductor 11 / 0. `SessionRunner.cs:411` sets the outcome and returns *before* the verdict pass
   that populates commit counts. **Git ground truth: 19 of 34 (56%) and 10 of 11 (91%) left at
   least one agent commit.** Rollovers usually do commit; what is always zero is the record.
2. **`runs.limits_json` is NULL for every imported run.** The store does not know what any run's
   cap was. Cap figures come from the plan files or from `conductor budget`'s window
   reconstruction — **never from the harvest**, and the `evidence` gate cannot verify them.

## The self-correction, which is the point of the site

`TOKEN-BUDGET-TUNING.md` was hand-derived on 2026-08-02. On 2026-08-05 the `conductor budget` verb
was run against it and **contradicted four of its published numbers.** The cap's benefit had been
written as **4.0×**; measured, **1.6×** — the old figure summed a whole run's dollars against a
checkpoint count from a different window, flattering the cap by 2.5×. The wrong values were struck
through with the measured ones beside them, never quietly deleted.

Rule inherited by this site: **where a hand query and `conductor budget` / `conductor money`
disagree, the verbs are the ones reading the data.**

## Denominators

18 runs · 7 repos · **340 sessions, of which 315 recorded agent tokens** · 287/300 checkpoints ·
$3,016.29 · 648/677 gates green · 53 rollovers · 123 soft breaks (`SoftBreakRequested` events) ·
7 owner approvals · 167 bugs.

`conductor budget` divides by **costed** sessions. SPEC Appendix A's `$9.37 per session` divides by
340. **Label whichever one the page uses.**

Cross-check: a naive `CheckpointConfirmed` event count returns **65** where the engine answers
**287 of 300** — confirmed by direct query, and the reason checkpoint counts come from
`conductor history --json`.

---

## `conductor budget --repo all`, run 2026-08-06 — the authoritative per-window split

This supersedes the hand-built table above wherever they differ. The verb splits each run at the
session where a ceiling first appears and divides each window's own tokens by its own closed
checkpoints — the exact error that flattered the original analysis by 2.5×.

| run · window | ceiling / nudge | sess | ckpt | tok/ckpt | floor | median closer | rollover | wrap-up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NINE STREETS 1–10 | uncapped | 9 | 10 | 13.0M | 6.95M | 15.4M | 0 | — |
| NINE STREETS 11–60 | **6M / 4.57M** | 50 | 15 | 19.5M | 0.68M | 5.36M | **32/50 (64%)** | 0.9M (n=15) |
| NINE STREETS 61–69 | 9M / 6.36M | 9 | 5 | 14.3M | 5.95M | 7.66M | 2/9 (22%) | 1.69M (n=6) |
| THE SECOND REEL | 9M / 6.38M | 14 | 12 | 9.85M | 6.99M | 8.16M | 5/14 (36%) | 1.94M (n=9) |
| A NAME AND A WAY OUT | 16M / 9.96M | 13 | 19 | 7.47M | 4.57M | 11.1M | 1/13 (8%) | 1.82M (n=9) |
| graph-v2 1–26 | uncapped | 20 | 20 | 24.6M | 13.8M | 24.9M | 0 | — |
| graph-v2 27–28 | 20M / 14.1M | 2 | 2 | 15.7M | 14.7M | 15.7M | 0 | 1.56M (n=2) |
| **conductor-site 1–2** | **16M / 10M** | **2** | **4** | **4.92M** | **8.01M** | **9.85M** | **0** | **1.63M (n=1)** |

Verdicts the verb printed, in its own words:

- NINE STREETS 6M → 9M: *"what the change bought: **1.4× better** tokens per delivered checkpoint."*
- graph-v2 uncapped → 20M: *"what the change bought: **1.6× better**."*
- **`THE RAIL IS DELIVERED AND IGNORED`** on all three site runs: *"all killed sessions had already
  been nudged and not one of them stopped. The cooperative break is the only path that ends a
  capped session on its own terms, and here it converted **zero**."* This is the measured fact
  article 3 should end on.
- **`NUDGE BELOW THE MEDIAN CLOSER`** fires on *every* capped window in the fleet except this
  repo's — 0.83×, 0.78×, 0.89×, 0.90×. It was a systematic error, not a one-off.

### This run's own tuning — applied 2026-08-06 mid-run

```
now: cap 16M · nudge 10M (0.63) · nudge vs floor 1.25x · vs median closer 1.02x · headroom 5.95M
  > the ceiling is right and the nudge is not: keep maxSessionTokens at 16M and move
    softBreakRatio 0.63 -> 0.75 - the nudge goes 10M -> 12M, which clears the 11.7M
    largest closer, headroom 4M is 2.4x the measured 1.63M wrap-up.
```

**Applied.** `softBreakRatio` 0.62 → **0.75**, ceiling held at 16M, `maxRunCostUsd` 400 → **550**.
Note the plan declared 0.62 and the rail's measured firing point was 0.63 — the hook rides a tool
call and lands on the first turn *past* the threshold, so always prefer the measured point.
