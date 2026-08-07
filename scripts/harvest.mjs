#!/usr/bin/env node
/* The harvest: Conductor's run store in, src/data/corpus.json out.
   ---------------------------------------------------------------------------
   This is the machine behind the site's first litmus test. No figure on this
   site is ever typed into content — content names a KEY, and the value comes
   from the file this script writes. A number that cannot be typed cannot drift,
   and a number that came from here can be recomputed by anyone with the store.

   Run it:

     npm run harvest            # recompute and write src/data/corpus.json
     npm run harvest -- --check # recompute and diff, exit 1 if the file is stale

   Three rules govern what follows, and all three are load-bearing rather than
   stylistic. They are SPEC Part VI.

   1. **Run-level truth comes from `conductor history --json --limit 0`, never
      from SQL.** The engine folds checkpoints out of its event log; a naive
      `select count(*) from events where type='CheckpointConfirmed'` answers 65
      against the engine's own 295 of 328. Measured during planning, re-measured
      here. SQL is for what the JSON does not expose — costs by category, gate
      pass rates, bugs, ledger entries, event counts, rollovers.

   2. **Every store is opened read-only.** This machine's store is shared with
      other repos and with a run that is paused rather than finished. `readOnly:
      true` is SQLITE_OPEN_READONLY: the connection cannot write, so a bug here
      cannot damage somebody else's record of their own work.

   3. **Anonymisation fails closed.** A run in the store with no entry in
      `anonymise.json` is excluded from the corpus. Not renamed, not published
      with its id showing — excluded. The default for an unknown run is silence,
      which is the only default that stays safe when somebody forgets.

   And one rule this script enforces on its successors: anything budget-shaped —
   floors, median closers, wrap-up, rollover *rates*, tokens per checkpoint,
   blended $/M, cap values — is never computed from SQL here. It is *asked of*
   `conductor money` and `conductor budget`, which read the ledger properly, and
   what they answer is recorded with the command itself as the figure's source.
   In August 2026 those verbs were run against a hand-derived analysis of exactly
   these numbers and contradicted four of it: a cap benefit published as 4.0x
   measured 1.6x, because one window's cost had been divided by another window's
   checkpoints. `refuseBudgetShaped()` at the bottom of this file makes that a
   build failure rather than a comment somebody skims — a budget-shaped key whose
   source is not one of those two commands does not ship. */

import { DatabaseSync } from "node:sqlite";
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const here = dirname(fileURLToPath(import.meta.url));
export const repoRoot = join(here, "..");
export const corpusPath = join(repoRoot, "src", "data", "corpus.json");
export const anonymisePath = join(repoRoot, "anonymise.json");

/** Where a figure came from, spelled the way a reader could repeat it. */
const HISTORY = "conductor history --json --limit 0";
const STORE = "run.db, opened read-only";
/* The third source, and the one the rule at the top of this file points at.
   Anything money-shaped — a run's blended dollars per million tokens, its
   tokens per checkpoint, the split across its stages — is asked of the verb
   that reads the ledger properly rather than recomputed from SQL here.

   The placeholder is not laziness. The real command carries the run's id, and a
   run id is precisely what this site does not publish: runs appear under the
   label `anonymise.json` gave them, and a test refuses any id that reaches
   corpus.json — which is how the first draft of this line was caught. A reader
   repeating this runs it against their own run anyway. */
const MONEY = "conductor money --run <run> --json";

/* ---------------------------------------------------------------------------
   Collecting
   --------------------------------------------------------------------------- */

/** The engine's own answer about every run it has ever recorded.
    ---------------------------------------------------------------------------
    `--limit 0` means "all of them". The BOM strip is not superstition: the
    verb writes UTF-8 with a byte order mark on Windows and `JSON.parse` refuses
    it with a message that names the token rather than the cause. */
export function readHistory() {
  const raw = execSync(HISTORY, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return JSON.parse(raw.replace(/^﻿/, "")).runs;
}

/** What one run.db knows about one run.
    ---------------------------------------------------------------------------
    Every query filters on `run_id`, and that is the trap this function exists
    to close. A run.db is keyed by repo and plan, and the legacy import
    consolidated several runs into one file — the web fleet's three rounds share
    a single database. An unfiltered `select count(*) from bugs` answers 50
    where that run filed 23, and nothing about the number looks wrong.

    Two columns are here to be ignored on purpose:

    - `sessions.soft_break` is 0 for every row in the entire store. The
      cooperative break is recorded as an event, not as a column, so soft breaks
      are counted from `events.type = 'SoftBreakRequested'` — 125 store-wide,
      123 once this site's own run is excluded, which is what the corpus was
      measured at during planning. A harvest that read the column would publish
      zero and look correct.
    - `runs.limits_json` is NULL for every imported run. The store does not know
      what a run's cap was, so no cap figure can ever be recomputed here. See
      `refuseBudgetShaped`. */
function readStore(db, runId) {
  const one = (sql) => db.prepare(sql).get(runId);
  const all = (sql) => db.prepare(sql).all(runId);

  const costs = all(
    `select category,
            sum(tokens_in) as tokensIn, sum(tokens_out) as tokensOut,
            sum(tokens_cache) as cacheRead, sum(cost_usd) as costUsd
       from costs where run_id = ? group by category`
  );
  const byCategory = {};
  for (const row of costs) {
    byCategory[row.category] = {
      tokensIn: row.tokensIn ?? 0,
      tokensOut: row.tokensOut ?? 0,
      cacheRead: row.cacheRead ?? 0,
      costUsd: row.costUsd ?? 0
    };
  }

  /* Four counts, not one, because "29 red" is worth very little on its own.
     A gate battery can be green because everything passed or because half of
     it was optional and the other half was skipped — so the skipped and
     optional counts are what turn a pass rate into a claim. Both are zero
     across this whole corpus, which is the only reason the pass rate means
     what a reader will assume it means.

     `crashed` separates a command that ran and said no from one that never
     ran: an exit status the command did not choose — negative, or above the
     128 that marks a signal — is a process that died on the way up. Four of
     the corpus's red gates are that, at tens of milliseconds each, and they
     are the ones an agent's own "tests pass" would have sailed straight past. */
  const gates = one(
    `select count(*) as total,
            coalesce(sum(passed), 0) as green,
            coalesce(sum(skipped), 0) as skipped,
            coalesce(sum(optional), 0) as optional,
            coalesce(sum(case when passed = 0 and (exit_code < 0 or exit_code > 128)
                              then 1 else 0 end), 0) as crashed
       from gates where run_id = ?`
  );

  const events = {};
  for (const row of all(`select type, count(*) as n from events where run_id = ? group by type`)) {
    events[row.type] = row.n;
  }

  return {
    byCategory,
    tokensIn: sumOver(byCategory, "tokensIn"),
    tokensOut: sumOver(byCategory, "tokensOut"),
    cacheRead: sumOver(byCategory, "cacheRead"),
    gatesGreen: gates.green,
    gatesTotal: gates.total,
    gatesSkipped: gates.skipped,
    gatesOptional: gates.optional,
    gatesCrashed: gates.crashed,
    bugsFiled: one(`select count(*) as n from bugs where run_id = ?`).n,
    ledgerEntries: one(`select count(*) as n from ledger where run_id = ?`).n,
    rollovers: one(
      `select count(*) as n from sessions where run_id = ? and outcome = 'RolledOver'`
    ).n,
    /* Sessions that recorded agent tokens: 314 of the corpus's 340. Every rate
       on this site names which of the two it divided by, because both are
       defensible and a page that mixes them is wrong twice (SPEC Appendix A).

       The definition is the whole figure. Counting sessions with any agent cost
       row answers 326; counting those with cost above zero answers 325; this
       one, tokens above zero, answers 314. Appendix A's 315 is none of the
       three, which is why the note on the published figure says what it
       counted rather than repeating a number somebody else arrived at. */
    costedSessions: one(
      `select count(distinct session_number) as n from costs
        where run_id = ? and category = 'agent'
          and (tokens_in + tokens_out + tokens_cache) > 0`
    ).n,
    softBreaks: events.SoftBreakRequested ?? 0,
    ownerApprovals: events.OwnerApprovalGranted ?? 0,
    events
  };
}

const sumOver = (byCategory, field) =>
  Object.values(byCategory).reduce((total, row) => total + row[field], 0);

/** What `conductor money` says about one run, which SQL here may not answer.
    ---------------------------------------------------------------------------
    The rule at the top of this file says money-shaped figures come from the
    verb. This is that rule wired up rather than merely written down: one call
    per published run, scoped with `--run` because a run.db holds several runs
    and the bare positional argument prices the whole file — the web fleet's
    three rounds share one database, so an unscoped call answers for all three.

    Two fields of the verb's own output are deliberately dropped on the floor
    and never reach the returned object: `plan` and `repo`. They are a plan's
    real name and a path on somebody's machine, and this site publishes neither
    (SPEC Part VI). What comes back is numbers and a stage count.

    Stage labels are dropped for the same reason. A stage id is usually opaque —
    `S4`, `A1` — but "usually" is not a rule, and a plan is free to name a stage
    after the client it is for. The dearest stage is published as *a* stage of
    this run, which is all the argument needs. */
export function readMoney(runId) {
  const raw = execSync(`conductor money --run ${runId} --json`, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024
  });
  const priced = JSON.parse(raw.replace(/^﻿/, "")).runs?.find((run) => run.runId === runId);
  if (!priced) {
    throw new Error(
      `conductor money --run ${short(runId)} priced no run with that id. The verb is the only ` +
        `source this site allows for money-shaped figures, so a silent zero here would be a ` +
        `published claim with nothing behind it.`
    );
  }

  const total = priced.total ?? {};
  const stages = priced.stages ?? [];
  /* Ties go to the first stage, which is arbitrary and harmless: two stages
     that cost the same amount make the same point about the same run. */
  const dearest = stages.reduce((worst, stage) => (worst && worst.costUsd >= stage.costUsd ? worst : stage), null);

  return {
    stages: stages.length,
    costUsd: total.costUsd ?? 0,
    tokensPerCheckpoint: total.tokensPerCheckpoint ?? 0,
    costPerMillionTokens: total.costPerMillionTokens ?? 0,
    cacheReadShare: total.cacheReadShare ?? 0,
    dearestStage: dearest
      ? {
          costUsd: dearest.costUsd ?? 0,
          sessions: dearest.sessions ?? 0,
          checkpoints: dearest.checkpoints ?? 0,
          /* A run that cost nothing has no dearest stage worth a share, and
             dividing by its zero would publish NaN. */
          share: total.costUsd > 0 ? (dearest.costUsd ?? 0) / total.costUsd : 0
        }
      : { costUsd: 0, sessions: 0, checkpoints: 0, share: 0 }
  };
}

/** Every run the engine knows about, with its store read alongside it.
    ---------------------------------------------------------------------------
    Runs are grouped by database so each file is opened once, and only the runs
    that survived anonymisation are opened at all — which is also why the live
    run writing this very session is never touched. */
export function collect({ history = readHistory(), published } = {}) {
  const wanted = history.filter((run) => published(run));
  const byDb = new Map();
  for (const run of wanted) {
    if (!byDb.has(run.runDb)) byDb.set(run.runDb, []);
    byDb.get(run.runDb).push(run);
  }

  const collected = [];
  for (const [path, runs] of byDb) {
    const db = new DatabaseSync(path, { readOnly: true });
    try {
      for (const run of runs) {
        collected.push({
          runId: run.runId,
          status: run.status,
          startedUtc: run.startedUtc,
          endedUtc: run.endedUtc,
          repo: run.repo,
          sessions: run.sessions,
          checkpointsDone: run.checkpointsDone ?? 0,
          checkpointsTotal: run.checkpointsTotal ?? 0,
          costUsd: run.costUsd ?? 0,
          store: readStore(db, run.runId),
          money: readMoney(run.runId)
        });
      }
    } finally {
      db.close();
    }
  }
  return collected.sort((a, b) => a.startedUtc.localeCompare(b.startedUtc));
}

/* ---------------------------------------------------------------------------
   Shaping
   --------------------------------------------------------------------------- */

/** A figure: the number, the string a page prints, and where it came from.
    ---------------------------------------------------------------------------
    `source` is on every one of these because litmus test 1 is not "the number
    is right", it is "a reader can see where it came from". `note` carries the
    denominator wherever the figure is a rate, which is the other half of the
    same promise — `$9.37 a session` is two different claims depending on
    whether the divisor was 340 sessions or the 315 that recorded tokens. */
const figure = (value, display, label, source, note) => ({
  value,
  display,
  label,
  source,
  ...(note ? { note } : {})
});

const usd = (n) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const plain = (n) => n.toLocaleString("en-US");
const round2 = (n) => Math.round(n * 100) / 100;
/** A share of something, printed the way a reader reads one. */
const pct = (n) => `${round1(n * 100)}%`;

/** Token counts in the unit a reader can hold. 3,880,400,466 is unreadable;
    3.8B is the fact. The full number stays in `value` for recomputation. */
function big(n) {
  if (n >= 1e9) return `${round1(n / 1e9)}B`;
  if (n >= 1e6) return `${round1(n / 1e6)}M`;
  if (n >= 1e3) return `${round1(n / 1e3)}K`;
  return String(n);
}
const round1 = (n) => (Math.round(n * 10) / 10).toString();

/** One run, published under the name `anonymise.json` gave it. */
function runEntry(run, mapped) {
  const s = run.store;
  /* Required rather than defaulted. A missing money block means the verb was
     not asked, and the honest outcome of that is a failure here — a zeroed
     default would publish "$0.00 in the run's dearest stage" and look like a
     measurement. */
  if (!run.money) {
    throw new Error(
      `${mapped.label}: no money block. Money-shaped figures come from \`conductor money\`, so a ` +
        `run collected without it cannot be published.`
    );
  }
  const m = run.money;
  const money = MONEY;
  return {
    label: mapped.label,
    scenario: mapped.scenario,
    repoKey: mapped.repoKey,
    status: disposition(run, mapped),
    startedUtc: run.startedUtc,
    figures: {
      sessions: figure(run.sessions, plain(run.sessions), "sessions", HISTORY),
      checkpointsDone: figure(
        run.checkpointsDone,
        `${run.checkpointsDone}/${run.checkpointsTotal}`,
        "checkpoints closed",
        HISTORY
      ),
      checkpointsTotal: figure(
        run.checkpointsTotal,
        plain(run.checkpointsTotal),
        "checkpoints planned",
        HISTORY
      ),
      costUsd: figure(round2(run.costUsd), usd(round2(run.costUsd)), "spent", HISTORY),
      tokensIn: figure(s.tokensIn, big(s.tokensIn), "tokens in", STORE),
      tokensOut: figure(s.tokensOut, big(s.tokensOut), "tokens out", STORE),
      cacheRead: figure(s.cacheRead, big(s.cacheRead), "cache read", STORE),
      gatesGreen: figure(s.gatesGreen, `${s.gatesGreen}/${s.gatesTotal}`, "gates green", STORE),
      gatesTotal: figure(s.gatesTotal, plain(s.gatesTotal), "gates run", STORE),
      gatesRed: figure(
        s.gatesTotal - s.gatesGreen,
        plain(s.gatesTotal - s.gatesGreen),
        "gates red",
        STORE,
        "every one of them required: no gate in this corpus was skipped or optional"
      ),
      rollovers: figure(s.rollovers, plain(s.rollovers), "rollovers", STORE),
      softBreaks: figure(s.softBreaks, plain(s.softBreaks), "soft breaks", STORE),
      ownerApprovals: figure(s.ownerApprovals, plain(s.ownerApprovals), "owner approvals", STORE),
      bugsFiled: figure(s.bugsFiled, plain(s.bugsFiled), "bugs filed", STORE),
      ledgerEntries: figure(s.ledgerEntries, plain(s.ledgerEntries), "ledger entries", STORE),

      /* From the verb, not from here. See `MONEY` and `refuseBudgetShaped`. */
      tokensPerCheckpoint: figure(
        m.tokensPerCheckpoint,
        big(m.tokensPerCheckpoint),
        "tokens per checkpoint closed",
        money,
        `every token the run spent, over the ${run.checkpointsDone} checkpoints it closed`
      ),
      costPerMillionTokens: figure(
        m.costPerMillionTokens,
        usd(m.costPerMillionTokens),
        "per million tokens, blended",
        money,
        "what the run paid for a million tokens of any kind — the cache reads are most of them, and they are the cheap ones"
      ),
      cacheReadShare: figure(
        m.cacheReadShare,
        pct(m.cacheReadShare),
        "of the run's tokens were cache reads",
        money
      ),
      dearestStageCostUsd: figure(
        round2(m.dearestStage.costUsd),
        usd(round2(m.dearestStage.costUsd)),
        "in the run's dearest single stage",
        money,
        `the dearest of the ${m.stages} stages this run ran`
      ),
      dearestStageShare: figure(
        m.dearestStage.share,
        pct(m.dearestStage.share),
        "of the run, spent in that one stage",
        money
      ),
      dearestStageSessions: figure(
        m.dearestStage.sessions,
        plain(m.dearestStage.sessions),
        "sessions in that stage",
        money,
        `of the ${run.sessions} the whole run took`
      ),
      dearestStageCheckpoints: figure(
        m.dearestStage.checkpoints,
        plain(m.dearestStage.checkpoints),
        "checkpoints closed in it",
        money
      )
    }
  };
}

/** What a run's state actually was, which the store cannot always say.
    ---------------------------------------------------------------------------
    Four runs in this corpus are still marked `running`. Three are July runs
    whose engine exited without closing the record — abandoned, and the reports
    must not present them as in flight. The fourth is genuinely paused and
    somebody means to come back to it. Nothing in the store separates those two,
    so `anonymise.json` says which, and a `running` run without a `disposition`
    is refused rather than guessed at. */
function disposition(run, mapped) {
  if (run.status !== "running") return run.status.toLowerCase();
  if (!mapped.disposition) {
    throw new Error(
      `anonymise.json: run ${short(run.runId)} ("${mapped.label}") is still marked running in the ` +
        `store, so it needs a "disposition" — "abandoned" or "paused". The store cannot tell a ` +
        `July run whose engine exited from one somebody means to resume, and publishing the ` +
        `wrong one of those is publishing a lie about whether the work is finished.`
    );
  }
  return mapped.disposition;
}

const short = (runId) => runId.slice(0, 8);

/** Corpus-wide figures.
    ---------------------------------------------------------------------------
    Deliberately a different namespace from the per-run ones: `totalSessions` is
    the corpus, `sessions` is one run. `assertDisjoint` below refuses a key that
    lands in both, because a page naming `sessions` beside three runs and a page
    naming it alone would otherwise be asking for two different numbers under
    one word. */
function corpusFigures(runs, repoKeys) {
  const sum = (pick) => runs.reduce((total, run) => total + pick(run), 0);
  const sessions = sum((r) => r.sessions);
  const costed = sum((r) => r.store.costedSessions);
  const cost = round2(sum((r) => r.costUsd));
  const done = sum((r) => r.checkpointsDone);
  const planned = sum((r) => r.checkpointsTotal);
  const green = sum((r) => r.store.gatesGreen);
  const gates = sum((r) => r.store.gatesTotal);
  const runsRed = runs.filter((r) => r.store.gatesTotal > r.store.gatesGreen).length;

  const perSession = round2(cost / sessions);
  const perCheckpoint = round2(cost / done);

  const tokensIn = sum((r) => r.store.tokensIn);
  const tokensOut = sum((r) => r.store.tokensOut);
  const cacheRead = sum((r) => r.store.cacheRead);
  const allTokens = tokensIn + tokensOut + cacheRead;
  const cacheShare = allTokens > 0 ? cacheRead / allTokens : 0;

  /* The lanes. `costs.category` is how the store separates the delivering agent
     from the two cheap things beside it, and the split is the whole of what
     concept 2 has to say — an orchestrator is not many expensive models, it is
     one expensive model and some arithmetic. Three categories, not two: the
     plan document said "agent vs advisor" from a hand query and the store also
     carries `gate`. Publishing all three is what stops the page rounding the
     third one away. */
  const inCategory = (name) => round2(sum((r) => r.store.byCategory[name]?.costUsd ?? 0));

  return {
    totalRuns: figure(runs.length, plain(runs.length), "runs", HISTORY),
    totalRepos: figure(repoKeys.size, plain(repoKeys.size), "repositories", "anonymise.json"),
    totalSessions: figure(sessions, plain(sessions), "sessions", HISTORY),
    costedSessions: figure(
      costed,
      plain(costed),
      "sessions that recorded agent tokens",
      STORE,
      `of ${sessions} sessions in all; the rest recorded no agent spend at all`
    ),
    totalCheckpointsDone: figure(done, `${done}/${planned}`, "checkpoints closed", HISTORY),
    totalCheckpointsPlanned: figure(planned, plain(planned), "checkpoints planned", HISTORY),
    totalCostUsd: figure(cost, usd(cost), "spent across the corpus", HISTORY),
    totalAgentCostUsd: figure(
      inCategory("agent"),
      usd(inCategory("agent")),
      "on the delivering agent",
      STORE,
      "the sessions that did the work, metered by the agent CLI's own token accounting"
    ),
    totalGateCostUsd: figure(
      inCategory("gate"),
      usd(inCategory("gate")),
      "on running the gates",
      STORE,
      "the batteries themselves: real commands, real exit codes, no model in the loop"
    ),
    totalAdvisorCostUsd: figure(
      inCategory("advisor"),
      usd(inCategory("advisor")),
      "on the advisor lane",
      STORE,
      "priced by the engine at a flat rate per second of advisor wall-clock, not metered from the model — an estimate of a lane whose real cost is too small for the ledger to have measured"
    ),
    totalTokensIn: figure(tokensIn, big(tokensIn), "tokens in", STORE),
    totalTokensOut: figure(tokensOut, big(tokensOut), "tokens out", STORE),
    totalCacheRead: figure(cacheRead, big(cacheRead), "cache read", STORE),
    /* The shape of the bill rather than its size, and the one figure that
       explains why a corpus of billions of tokens cost thousands of dollars
       rather than tens of thousands. Numerator and denominator are both
       published above it, so a reader can do the division themselves — which
       is the only reason a derived share belongs on this site at all. */
    totalCacheReadShare: figure(
      cacheShare,
      pct(cacheShare),
      "of the corpus's tokens were cache reads",
      STORE,
      "cache read over cache read plus in plus out; the three counts are published beside it"
    ),
    totalGatesGreen: figure(green, `${green}/${gates}`, "gates green", STORE),
    totalGatesRun: figure(gates, plain(gates), "gates run", STORE),
    totalGatesRed: figure(gates - green, plain(gates - green), "gates red", STORE),
    /* The two zeros that make the pass rate mean anything. A battery can be
       green because it passed or because it was allowed not to run, and those
       look identical in a summary line. */
    totalGatesSkipped: figure(
      sum((r) => r.store.gatesSkipped),
      plain(sum((r) => r.store.gatesSkipped)),
      "gates skipped",
      STORE,
      "in the whole corpus — every gate that was configured, ran"
    ),
    totalGatesOptional: figure(
      sum((r) => r.store.gatesOptional),
      plain(sum((r) => r.store.gatesOptional)),
      "gates marked optional",
      STORE,
      "so every red one above was a gate somebody had to answer for"
    ),
    totalGatesCrashed: figure(
      sum((r) => r.store.gatesCrashed),
      plain(sum((r) => r.store.gatesCrashed)),
      "of the red gates never ran at all",
      STORE,
      "an exit status the command did not choose — a process that died starting up, in tens of milliseconds, rather than a check that ran and said no"
    ),
    runsWithARedGate: figure(
      runsRed,
      `${runsRed}/${runs.length}`,
      "runs that ever saw a red gate",
      STORE,
      "the other runs' batteries were green every time they ran"
    ),
    totalRollovers: figure(sum((r) => r.store.rollovers), plain(sum((r) => r.store.rollovers)), "rollovers", STORE),
    totalSoftBreaks: figure(
      sum((r) => r.store.softBreaks),
      plain(sum((r) => r.store.softBreaks)),
      "soft breaks",
      STORE,
      "counted from SoftBreakRequested events; the sessions table's own column is empty for every run in the store"
    ),
    totalOwnerApprovals: figure(
      sum((r) => r.store.ownerApprovals),
      plain(sum((r) => r.store.ownerApprovals)),
      "owner approvals",
      STORE
    ),
    totalBugsFiled: figure(sum((r) => r.store.bugsFiled), plain(sum((r) => r.store.bugsFiled)), "bugs filed", STORE),
    totalLedgerEntries: figure(
      sum((r) => r.store.ledgerEntries),
      plain(sum((r) => r.store.ledgerEntries)),
      "ledger entries",
      STORE
    ),
    costPerSession: figure(
      perSession,
      usd(perSession),
      "per session",
      HISTORY,
      `${usd(cost)} over all ${sessions} sessions, not only the ${costed} that recorded agent tokens`
    ),
    costPerCheckpoint: figure(
      perCheckpoint,
      usd(perCheckpoint),
      "per checkpoint closed",
      HISTORY,
      `${usd(cost)} over the ${done} checkpoints that closed, out of ${planned} planned`
    )
  };
}

/** The corpus, from what was collected and what the map allows.
    ---------------------------------------------------------------------------
    Pure: no store, no clock, no filesystem. That is what lets a test hand it a
    run that is not in the map and watch it disappear (S3.2) without going
    anywhere near somebody's real database. */
export function buildCorpus(collected, anonymise) {
  const map = anonymise.runs;
  const runs = {};
  const repoKeys = new Set();
  const kept = [];
  const excluded = [];

  for (const run of collected) {
    const mapped = map[short(run.runId)];
    if (!mapped) {
      excluded.push(short(run.runId));
      continue;
    }
    if (runs[mapped.label]) {
      throw new Error(
        `anonymise.json: two runs are both published as "${mapped.label}". A label is what content ` +
          `cites in evidence.runs, so it has to name exactly one run.`
      );
    }
    if (!mapped.repoKey) {
      throw new Error(
        `anonymise.json: "${mapped.label}" has no repoKey. Distinct repoKeys are what the site ` +
          `counts as repositories, so a missing one silently changes a published number.`
      );
    }
    repoKeys.add(mapped.repoKey);
    runs[mapped.label] = runEntry(run, mapped);
    kept.push(run);
  }

  /* Failing closed all the way down. With nothing published the corpus rates
     divide by zero and NaN reaches the page as the word "NaN", which is the one
     outcome worse than an empty site — a figure that is visibly wrong is at
     least visibly wrong; a figure that is quietly nonsense is what this whole
     mechanism exists to prevent. */
  if (kept.length === 0) {
    throw new Error(
      `anonymise.json publishes no runs: ${collected.length} run(s) were collected and none of ` +
        `them is in the map. Excluded: ${excluded.join(", ") || "(none collected)"}.`
    );
  }

  const corpus = corpusFigures(kept, repoKeys);
  assertDisjoint(corpus, runs);
  refuseBudgetShaped(corpus, runs);

  /* `excluded` is returned rather than written into the file, and that is not
     tidiness. The count of runs this machine happens to be holding changes
     whenever any other repo starts one, so a corpus.json carrying it would go
     stale for a reason that has nothing to do with anything published — and a
     gate that goes red for reasons nobody can act on is a gate that gets
     switched off. What ships is what was published. */
  return {
    excluded,
    payload: {
      corpus,
      runs,
      sources: {
        runLevel: HISTORY,
        store: `${STORE}; every query filtered by run_id`,
        labels: "anonymise.json — a run with no entry is excluded, never renamed",
        budgetShaped:
          "asked of the verbs, never computed here: tokens per checkpoint, blended $/M and the " +
          "stage split come from `conductor money --run <id> --json`; floors, median closers, " +
          "wrap-up and cap values come from `conductor budget`"
      }
    }
  };
}

/** One word, one meaning. See `corpusFigures`. */
function assertDisjoint(corpus, runs) {
  const perRun = new Set(Object.values(runs).flatMap((run) => Object.keys(run.figures)));
  const both = Object.keys(corpus).filter((key) => perRun.has(key));
  if (both.length > 0) {
    throw new Error(
      `These keys are both a corpus figure and a per-run figure: ${both.join(", ")}. ` +
        `A page names a key and gets a number; the same key cannot mean the whole corpus on one ` +
        `page and one run on the next.`
    );
  }
}

/** SPEC Part VI, rule zero, as a thrown error rather than a paragraph.
    ---------------------------------------------------------------------------
    `runs.limits_json` is NULL for every imported run, so this script cannot see
    a cap even if it wanted to; and the derived budget figures — floors, median
    closers, wrap-up, rollover rates, tokens per checkpoint, blended $/M — were
    measured wrong by hand once already. They belong to `conductor budget` and
    `conductor money`. A key matching one of these names may still be published,
    but only carrying one of those commands as its source: the test is where the
    number came from, not what it is called. A later session that reaches for one
    of these names over a SQL query finds this instead of a plausible number. */
const BUDGET_SHAPED = [
  /^floor/i,
  /median/i,
  /wrapUp/i,
  /Rate$/,
  /perMillion/i,
  /blended/i,
  /nudge/i,
  /cap$/i,
  /Cap[A-Z]/,
  /tokensPerCheckpoint/i,
  /headroom/i
];

/** Whether a figure was measured by a verb or computed here.
    ---------------------------------------------------------------------------
    `source` is the check because `source` is also the claim: it is the string
    the evidence strip prints under the number, so a figure that says it came
    from the verb and did not is already lying to a reader on the page. */
const fromAVerb = (figure) => /^conductor (money|budget)\b/.test(figure.source);

export function refuseBudgetShaped(corpus, runs) {
  const entries = [
    ...Object.entries(corpus),
    ...Object.values(runs).flatMap((run) => Object.entries(run.figures))
  ];
  const offenders = [
    ...new Set(
      entries
        .filter(([, figure]) => !fromAVerb(figure))
        .filter(([key]) => BUDGET_SHAPED.some((re) => re.test(key)))
        .map(([key]) => key)
    )
  ];
  if (offenders.length > 0) {
    throw new Error(
      `The harvest tried to mint budget-shaped keys from SQL: ${offenders.join(", ")}. ` +
        `Those come from \`conductor budget\` and \`conductor money\`, which read the ledger ` +
        `properly — a hand query of exactly these numbers was contradicted four times over in ` +
        `August 2026. The store cannot even see a cap: runs.limits_json is NULL for every ` +
        `imported run.`
    );
  }
}

/* ---------------------------------------------------------------------------
   The other half of the gate: what the pages actually cite
   ---------------------------------------------------------------------------
   Staleness is only one of the two ways this site's first litmus test fails. A
   corpus that matches the store exactly is still wrong for the page if the page
   names a key it does not have — and that half cannot be checked by looking at
   the corpus alone, because the claim lives in the content.

   `src/lib/evidence.ts` already refuses one at build time, and this is
   deliberately a second implementation of the same rule rather than a shared
   one. It has to be: that file is TypeScript imported by Astro, this runs as
   plain Node inside a gate, and the gate must be able to say "red" without
   Astro's build succeeding first. The build failure it duplicates exits with a
   crash code rather than 1, which is exactly why the gate does not simply
   wrap `npm run build`.
   --------------------------------------------------------------------------- */

const contentDir = join(repoRoot, "src", "content");

/** Every `evidence:` block in the content, with the file that wrote it. */
export function citedEvidence(dir = contentDir) {
  const cited = [];
  let looksLikeEvidence = 0;

  for (const item of readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (!item.isFile() || !item.name.endsWith(".yaml")) continue;
    const full = join(item.parentPath, item.name);
    const text = readFileSync(full, "utf8");
    if (/^evidence:/m.test(text)) looksLikeEvidence += 1;

    const data = parseYaml(text);
    if (!data?.evidence) continue;
    cited.push({
      where: posix.join(...full.slice(contentDir.length + 1).split(/[\\/]/)),
      runs: data.evidence.runs ?? [],
      figures: data.evidence.figures ?? []
    });
  }

  /* The failure mode of any scanner is under-reporting, and it is silent: a
     file whose evidence block the parser did not see produces a gate that says
     green about a page it never looked at. So the crude grep and the real parse
     have to agree on how many files are in play. */
  if (cited.length !== looksLikeEvidence) {
    throw new Error(
      `The evidence scan parsed ${cited.length} entries but ${looksLikeEvidence} content files ` +
        `have an "evidence:" line. A file the scan cannot see is a page this gate would pass ` +
        `without checking.`
    );
  }

  return cited.sort((a, b) => a.where.localeCompare(b.where));
}

/** Each cited key that has nothing behind it, said the way a writer can act on.
    ---------------------------------------------------------------------------
    Every problem is collected rather than thrown at the first one. A gate that
    reports one missing key, gets fixed, and then reports the next is a gate
    that costs a full run per mistake. */
export function unresolvedCitations(payload, cited = citedEvidence()) {
  const corpusKeys = new Set(Object.keys(payload.corpus));
  const runKeys = new Set(
    Object.values(payload.runs).flatMap((run) => Object.keys(run.figures))
  );
  const published = new Set(Object.keys(payload.runs));
  const problems = [];

  for (const entry of cited) {
    for (const label of entry.runs) {
      if (!published.has(label)) {
        problems.push(
          `${entry.where}: evidence.runs names "${label}", which the corpus does not publish. ` +
            `Either anonymise.json has no entry for that run — in which case it is excluded on ` +
            `purpose and cannot be cited — or the label is a typo.`
        );
      }
    }
    for (const key of entry.figures) {
      if (corpusKeys.has(key)) continue;
      if (runKeys.has(key)) {
        if (entry.runs.length === 0) {
          problems.push(
            `${entry.where}: evidence.figures names "${key}", a per-run figure, but the page ` +
              `names no runs.`
          );
        }
        continue;
      }
      problems.push(
        `${entry.where}: evidence.figures names "${key}", which is not in the corpus. A key with ` +
          `no figure behind it is a claim with no evidence behind it.`
      );
    }
  }
  return problems;
}

/* ---------------------------------------------------------------------------
   Running it
   --------------------------------------------------------------------------- */

export const readAnonymise = () => JSON.parse(readFileSync(anonymisePath, "utf8"));

/** Recompute the whole corpus from the store. */
export function harvest() {
  const anonymise = readAnonymise();
  const history = readHistory();

  /* Prefixes are what a person reads off `conductor history`, so they are what
     the map is keyed by — but only while they are unambiguous. */
  const seen = new Map();
  for (const run of history) {
    const prefix = short(run.runId);
    if (seen.has(prefix)) {
      throw new Error(
        `Two runs in the store share the id prefix ${prefix}. anonymise.json is keyed by prefix; ` +
          `lengthen both keys before either can be published.`
      );
    }
    seen.set(prefix, run.runId);
  }

  for (const prefix of Object.keys(anonymise.runs)) {
    if (!seen.has(prefix)) {
      throw new Error(
        `anonymise.json names run ${prefix}, which is not in this store. The map has drifted from ` +
          `the data; a label with no run behind it publishes nothing but is one edit away from ` +
          `publishing the wrong thing.`
      );
    }
  }

  /* Only mapped runs are collected, which is also why the live run writing this
     very session is never opened. Fail-closed is checked twice on purpose: here
     it decides which databases get touched at all, and again inside
     `buildCorpus`, which is the half a test can drive without a store. */
  const mapped = (run) => Boolean(anonymise.runs[short(run.runId)]);
  const collected = collect({ history, published: mapped });
  const built = buildCorpus(collected, anonymise);

  return {
    payload: built.payload,
    excluded: [...built.excluded, ...history.filter((run) => !mapped(run)).map((run) => short(run.runId))]
  };
}

/** The file, with the measurement time on it and the data underneath.
    ---------------------------------------------------------------------------
    `generatedAtUtc` is first and is excluded from the staleness comparison on
    purpose: a reader wants to know when the store was read, and a gate that
    failed because the clock moved would be a gate nobody could keep green. */
function serialise(corpus, generatedAtUtc) {
  return `${JSON.stringify({ generatedAtUtc, ...corpus }, null, 2)}\n`;
}

const payloadOf = (json) => {
  const { generatedAtUtc, ...rest } = json;
  return JSON.stringify(rest);
};

function main() {
  const check = process.argv.includes("--check");
  const { payload, excluded } = harvest();
  const corpus = payload.corpus;

  /* The gate, and it goes red two ways. Both are run before either is reported,
     because a session that fixes the staleness and then discovers the missing
     key on the next run has paid twice for one gate. */
  if (check) {
    let existing;
    try {
      existing = JSON.parse(readFileSync(corpusPath, "utf8"));
    } catch {
      console.error(
        "evidence: src/data/corpus.json is missing or unreadable. Run `npm run harvest`."
      );
      process.exit(1);
    }

    const stale = payloadOf(existing) !== payloadOf(payload);

    /* Cited keys are checked against what is COMMITTED, not against what was
       just recomputed. The committed file is what the site renders from, so
       when the two disagree it is the committed one whose holes a reader would
       see — and reporting against the fresh corpus would hide a key that the
       stale file is missing behind the staleness message. */
    const unresolved = unresolvedCitations(stale ? existing : payload);

    if (stale) {
      console.error(
        "evidence: src/data/corpus.json is STALE — the store no longer says what the committed " +
          "corpus says. Run `npm run harvest` and commit the result."
      );
      /* Naming what moved, down to the run and the key. "The file is stale" is
         true and useless; the next person needs to know whether a number
         changed, a run appeared, or a run left the corpus — those have three
         different causes and only one of them is "re-run the harvest". */
      const drift = (was, fresh, where) => {
        for (const [key, value] of Object.entries(fresh)) {
          const before = was?.[key];
          if (!before || before.value !== value.value) {
            console.error(
              `  ${where}${key}: committed ${before ? before.display : "(absent)"} → store ${value.display}`
            );
          }
        }
      };
      drift(existing.corpus, payload.corpus, "");
      for (const [label, run] of Object.entries(payload.runs)) {
        const was = existing.runs?.[label];
        if (!was) {
          console.error(`  ${label}: not in the committed corpus at all`);
          continue;
        }
        if (was.status !== run.status) {
          console.error(`  ${label}.status: committed ${was.status} → store ${run.status}`);
        }
        drift(was.figures, run.figures, `${label}.`);
      }
      for (const label of Object.keys(existing.runs ?? {})) {
        if (!payload.runs[label]) {
          console.error(`  ${label}: published, but the store no longer offers it`);
        }
      }
    }
    for (const problem of unresolved) console.error(`evidence: ${problem}`);

    if (stale || unresolved.length > 0) process.exit(1);

    console.log(
      `evidence: corpus.json is current — ${corpus.totalRuns.display} runs, ` +
        `${corpus.totalSessions.display} sessions, ${corpus.totalCostUsd.display}; and every ` +
        `key cited by ${citedEvidence().length} content entries resolves.`
    );
    return;
  }

  mkdirSync(dirname(corpusPath), { recursive: true });
  writeFileSync(corpusPath, serialise(payload, new Date().toISOString()), "utf8");
  console.log(
    `harvest: ${corpus.totalRuns.display} runs published, ${excluded.length} excluded by ` +
      `anonymise.json (${excluded.join(", ")}) · ${corpus.totalSessions.display} sessions · ` +
      `${corpus.totalCostUsd.display} · ${corpus.totalGatesGreen.display} gates green`
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
