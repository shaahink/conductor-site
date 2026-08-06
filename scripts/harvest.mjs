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
   blended $/M, cap values — does not come from here. It comes from `conductor
   budget` and `conductor money`, which read the ledger properly. In August 2026
   those verbs were run against a hand-derived analysis of exactly these numbers
   and contradicted four of it: a cap benefit published as 4.0x measured 1.6x,
   because one window's cost had been divided by another window's checkpoints.
   `refuseBudgetShaped()` at the bottom of this file makes that a build failure
   rather than a comment somebody skims. */

import { DatabaseSync } from "node:sqlite";
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const repoRoot = join(here, "..");
export const corpusPath = join(repoRoot, "src", "data", "corpus.json");
export const anonymisePath = join(repoRoot, "anonymise.json");

/** Where a figure came from, spelled the way a reader could repeat it. */
const HISTORY = "conductor history --json --limit 0";
const STORE = "run.db, opened read-only";

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

  const gates = one(
    `select count(*) as total, coalesce(sum(passed), 0) as green
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
    bugsFiled: one(`select count(*) as n from bugs where run_id = ?`).n,
    ledgerEntries: one(`select count(*) as n from ledger where run_id = ?`).n,
    rollovers: one(
      `select count(*) as n from sessions where run_id = ? and outcome = 'RolledOver'`
    ).n,
    /* Sessions that recorded agent tokens. The corpus has 340 sessions and 315
       of them are costed; every rate on this site names which of the two it
       divided by, because both are defensible and a page that mixes them is
       wrong twice (SPEC Appendix A). */
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
          store: readStore(db, run.runId)
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
      rollovers: figure(s.rollovers, plain(s.rollovers), "rollovers", STORE),
      softBreaks: figure(s.softBreaks, plain(s.softBreaks), "soft breaks", STORE),
      ownerApprovals: figure(s.ownerApprovals, plain(s.ownerApprovals), "owner approvals", STORE),
      bugsFiled: figure(s.bugsFiled, plain(s.bugsFiled), "bugs filed", STORE),
      ledgerEntries: figure(s.ledgerEntries, plain(s.ledgerEntries), "ledger entries", STORE)
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

  const perSession = round2(cost / sessions);
  const perCheckpoint = round2(cost / done);

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
    totalTokensIn: figure(sum((r) => r.store.tokensIn), big(sum((r) => r.store.tokensIn)), "tokens in", STORE),
    totalTokensOut: figure(sum((r) => r.store.tokensOut), big(sum((r) => r.store.tokensOut)), "tokens out", STORE),
    totalCacheRead: figure(sum((r) => r.store.cacheRead), big(sum((r) => r.store.cacheRead)), "cache read", STORE),
    totalGatesGreen: figure(green, `${green}/${gates}`, "gates green", STORE),
    totalGatesRun: figure(gates, plain(gates), "gates run", STORE),
    totalGatesRed: figure(gates - green, plain(gates - green), "gates red", STORE),
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
          "not here: floors, median closers, wrap-up, rollover rates, tokens per checkpoint, " +
          "blended $/M and cap values come from `conductor budget` and `conductor money`"
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
    `conductor money`. If a later session reaches for one of these names here,
    it finds this instead of a plausible number. */
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

function refuseBudgetShaped(corpus, runs) {
  const keys = [
    ...Object.keys(corpus),
    ...Object.values(runs).flatMap((run) => Object.keys(run.figures))
  ];
  const offenders = [...new Set(keys)].filter((key) => BUDGET_SHAPED.some((re) => re.test(key)));
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
    if (payloadOf(existing) !== payloadOf(payload)) {
      console.error(
        "evidence: src/data/corpus.json is stale — the store no longer says what the committed " +
          "corpus says. Run `npm run harvest` and commit the result."
      );
      process.exit(1);
    }
    console.log(
      `evidence: corpus.json is current — ${corpus.totalRuns.display} runs, ` +
        `${corpus.totalSessions.display} sessions, ${corpus.totalCostUsd.display}.`
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
