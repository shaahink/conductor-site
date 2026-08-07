/* Anonymisation, held to failing closed.
   ---------------------------------------------------------------------------
   The rule (SPEC Part VI): a run in Conductor's store with no entry in
   anonymise.json is EXCLUDED from this site. Not renamed, not published with
   its id showing, not "we'll label it later" — absent. The default for an
   unknown run is silence.

   That rule is only worth the sentence if the failure direction is right. A map
   lookup that returns undefined and carries on publishing looks identical, in
   every log, to one that excluded the run — right up until the day somebody
   points a browser at it. So these tests do the thing that actually goes wrong:
   they hand the builder a run nobody mapped and check that it is gone, and that
   nothing it was carrying leaked into a total on the way out.

   `buildCorpus` is pure for exactly this reason. No store is opened here, no
   `conductor` verb runs, and no real run is involved — which means this file
   can fabricate the situation nobody wants to wait for. */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { buildCorpus, refuseBudgetShaped } from "../scripts/harvest.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const corpusJson = JSON.parse(readFileSync(join(root, "src", "data", "corpus.json"), "utf8"));
const anonymise = JSON.parse(readFileSync(join(root, "anonymise.json"), "utf8"));

/** A run shaped the way `collect()` returns them, with numbers chosen so that
    anything of theirs reaching a total is unmistakable. */
function fakeRun(runId, overrides = {}) {
  return {
    runId,
    status: "Completed",
    startedUtc: "2026-07-01T00:00:00Z",
    endedUtc: "2026-07-02T00:00:00Z",
    repo: "C:/somewhere/private",
    sessions: 100,
    checkpointsDone: 10,
    checkpointsTotal: 10,
    costUsd: 1000,
    ...overrides,
    store: {
      byCategory: {},
      tokensIn: 1_000_000,
      tokensOut: 500_000,
      cacheRead: 9_000_000,
      gatesGreen: 20,
      gatesTotal: 20,
      bugsFiled: 7,
      ledgerEntries: 40,
      rollovers: 3,
      costedSessions: 90,
      softBreaks: 5,
      ownerApprovals: 1,
      events: {},
      ...(overrides.store ?? {})
    },
    /* What `conductor money --run <id> --json` answers, in the shape
       `readMoney` reduces it to. Fabricated here for the same reason the store
       is: these tests are about what the anonymisation map lets through, and
       nothing in them should need a verb, a database or somebody's real run. */
    money: {
      stages: 4,
      costUsd: 1000,
      tokensPerCheckpoint: 1_050_000,
      costPerMillionTokens: 0.5,
      cacheReadShare: 0.9,
      dearestStage: { costUsd: 400, sessions: 30, checkpoints: 2, share: 0.4 },
      ...(overrides.money ?? {})
    },
    /* And what `conductor budget <run> --json` answers, reduced the way
       `readBudget` reduces it. Two windows by default because one window is the
       uninteresting case: the whole point of the namespace is a run whose
       ceiling moved. */
    budget: {
      capPayoff: null,
      windows: [fakeWindow({ capMeasured: false }), fakeWindow({})],
      ...(overrides.budget ?? {})
    }
  };
}

/** One window, shaped the way `readBudget` returns them. */
function fakeWindow(overrides = {}) {
  return {
    capTokens: 8_000_000,
    capMeasured: true,
    nudgeTokens: 6_000_000,
    nudgeRatio: 0.75,
    headroomTokens: 2_000_000,
    firstSession: 1,
    lastSession: 10,
    sessions: 10,
    costedSessions: 10,
    tokens: 60_000_000,
    checkpoints: 5,
    tokensPerCheckpoint: 12_000_000,
    rollovers: 4,
    rolloverRate: 0.4,
    nudged: 9,
    nudgedAndEndedClean: 5,
    closers: 5,
    floorTokens: 2_000_000,
    medianCloserTokens: 7_000_000,
    maxCloserTokens: 7_500_000,
    wrapUpTokens: 1_000_000,
    wrapUpSamples: 5,
    ...overrides
  };
}

const mapOf = (entries) => ({ runs: entries });

test("a run with no entry in anonymise.json is excluded from the corpus", () => {
  const built = buildCorpus(
    [fakeRun("aaaaaaaa1111"), fakeRun("bbbbbbbb2222")],
    mapOf({
      aaaaaaaa: { label: "the-mapped-one", scenario: "A run somebody named", repoKey: "one" }
    })
  );

  assert.deepEqual(Object.keys(built.payload.runs), ["the-mapped-one"]);
  assert.deepEqual(built.excluded, ["bbbbbbbb"]);
});

test("an excluded run contributes nothing to any corpus total", () => {
  const both = mapOf({
    aaaaaaaa: { label: "the-mapped-one", scenario: "A run somebody named", repoKey: "one" },
    bbbbbbbb: { label: "the-other-one", scenario: "A run somebody also named", repoKey: "two" }
  });
  const onlyFirst = mapOf({ aaaaaaaa: both.runs.aaaaaaaa });
  const runs = [fakeRun("aaaaaaaa1111"), fakeRun("bbbbbbbb2222")];

  const withBoth = buildCorpus(runs, both).payload.corpus;
  const withOne = buildCorpus(runs, onlyFirst).payload.corpus;

  /* Not just "the label is missing" — the numbers have to be missing too. An
     exclusion that dropped the name and kept the spend would still be
     publishing the run, in the only form that matters to the person whose run
     it is. */
  assert.equal(withBoth.totalRuns.value, 2);
  assert.equal(withOne.totalRuns.value, 1);
  assert.equal(withOne.totalSessions.value, 100);
  assert.equal(withOne.totalCostUsd.value, 1000);
  assert.equal(withOne.totalRepos.value, 1);
  assert.equal(withOne.totalBugsFiled.value, 7);
  assert.equal(withOne.totalRollovers.value, 3);
  assert.equal(withOne.totalCacheRead.value, 9_000_000);
});

test("publishing nothing at all is refused rather than divided by zero", () => {
  assert.throws(
    () => buildCorpus([fakeRun("aaaaaaaa1111")], mapOf({})),
    /publishes no runs/
  );
});

test("a run still marked running has to say whether it was abandoned or paused", () => {
  const running = [fakeRun("aaaaaaaa1111", { status: "running", endedUtc: null })];
  assert.throws(
    () =>
      buildCorpus(
        running,
        mapOf({ aaaaaaaa: { label: "the-mapped-one", scenario: "s", repoKey: "one" } })
      ),
    /disposition/
  );

  const built = buildCorpus(
    running,
    mapOf({
      aaaaaaaa: { label: "the-mapped-one", scenario: "s", repoKey: "one", disposition: "abandoned" }
    })
  );
  assert.equal(built.payload.runs["the-mapped-one"].status, "abandoned");
});

test("two runs cannot be published under one label, and a label needs a repoKey", () => {
  const same = { label: "the-same-name", scenario: "s", repoKey: "one" };
  assert.throws(
    () =>
      buildCorpus(
        [fakeRun("aaaaaaaa1111"), fakeRun("bbbbbbbb2222")],
        mapOf({ aaaaaaaa: same, bbbbbbbb: { ...same } })
      ),
    /both published as/
  );

  assert.throws(
    () =>
      buildCorpus([fakeRun("aaaaaaaa1111")], mapOf({ aaaaaaaa: { label: "x", scenario: "s" } })),
    /no repoKey/
  );
});

/* --------------------------------------------------------------------------
   And the same rule, checked against what is actually committed.
   -------------------------------------------------------------------------- */

test("no run id reaches the published corpus", () => {
  /* The ids are how the owner finds a run again; they are not how a reader
     meets one. anonymise.json is the only file in this repo that holds them,
     and the corpus is built from labels, so an id appearing in corpus.json
     would mean some code path started copying the source through. */
  const serialised = JSON.stringify(corpusJson);
  for (const prefix of Object.keys(anonymise.runs)) {
    assert.ok(
      !serialised.includes(prefix),
      `corpus.json contains the run id ${prefix}. Runs are published under their anonymise.json ` +
        `label; the id stays in the map.`
    );
  }
});

test("nothing path-shaped or machine-shaped reaches the published corpus", () => {
  const serialised = JSON.stringify(corpusJson) + JSON.stringify(anonymise);
  for (const forbidden of ["AppData", "C:\\\\", "C:/", "/Users/", "\\\\Users\\\\", ".conductor"]) {
    assert.ok(
      !serialised.includes(forbidden),
      `"${forbidden}" appears in a published file. This repo is public from commit one.`
    );
  }
});

test("every mapped run is published, and every published run was mapped", () => {
  const labels = Object.values(anonymise.runs).map((entry) => entry.label).sort();
  assert.deepEqual(Object.keys(corpusJson.runs).sort(), labels);
});

test("a corpus key and a run key never share a name", () => {
  const perRun = new Set(
    Object.values(corpusJson.runs).flatMap((run) => Object.keys(run.figures))
  );
  const clashes = Object.keys(corpusJson.corpus).filter((key) => perRun.has(key));
  assert.deepEqual(clashes, [], "one key, one meaning: see corpusFigures() in scripts/harvest.mjs");
});

/* --------------------------------------------------------------------------
   Where a money-shaped number is allowed to come from.
   --------------------------------------------------------------------------
   The rule (SPEC Part VI, and the note at the top of the harvest): tokens per
   checkpoint, blended dollars per million and the stage split are asked of
   `conductor money`, never recomputed from SQL here. A hand query of exactly
   these numbers was contradicted four times over in August 2026.

   The guard used to refuse the NAMES, which was easy to check and slightly
   wrong: it also refused the verb's own answers, so the figures the rule points
   at could never be published at all. It now tests the source, which is the
   claim the strip prints under the number — so these two tests are the same
   key twice, passing once and failing once on nothing but where it came from.
   -------------------------------------------------------------------------- */

const figureFrom = (source) => ({ value: 1, display: "1", label: "per checkpoint", source });

test("a budget-shaped figure the harvest computed itself is refused", () => {
  assert.throws(
    () => refuseBudgetShaped({ tokensPerCheckpoint: figureFrom("run.db, opened read-only") }, {}),
    /tokensPerCheckpoint/
  );
});

test("the same figure measured by the verb is published", () => {
  refuseBudgetShaped({ tokensPerCheckpoint: figureFrom("conductor money --run <run> --json") }, {});
  refuseBudgetShaped(
    {},
    { "a-run": { figures: { medianCloserTokens: figureFrom("conductor budget --json") } } }
  );
});

/* --------------------------------------------------------------------------
   The window namespace.
   --------------------------------------------------------------------------
   A window is one stretch of a run's sessions under one ceiling. It exists as
   its own namespace because the whole cap argument is a comparison between two
   windows of the SAME run — average them together and the comparison is gone.
   The three things worth a test are the three that would fail silently: a
   window published under a name a page cannot cite, a cap-shaped figure invented
   for a window that had no cap, and a window's figures leaking into a run's.
   -------------------------------------------------------------------------- */

test("a window is keyed by its run and the ceiling it ran under", () => {
  const built = buildCorpus(
    [fakeRun("aaaaaaaa1111")],
    mapOf({ aaaaaaaa: { label: "the-mapped-one", scenario: "A run", repoKey: "one" } })
  );

  assert.deepEqual(Object.keys(built.payload.windows).sort(), [
    "the-mapped-one-capped-8m",
    "the-mapped-one-uncapped"
  ]);
  assert.equal(built.payload.windows["the-mapped-one-capped-8m"].run, "the-mapped-one");
});

test("a window with no ceiling carries no nudge, no headroom and no wrap-up", () => {
  /* Zero would be a measurement, and it is not one: nothing was ever asked to
     wrap up, so there is nothing to have measured. The absent key is the fact. */
  const built = buildCorpus(
    [fakeRun("aaaaaaaa1111")],
    mapOf({ aaaaaaaa: { label: "the-mapped-one", scenario: "A run", repoKey: "one" } })
  );
  const uncapped = built.payload.windows["the-mapped-one-uncapped"].figures;
  const capped = built.payload.windows["the-mapped-one-capped-8m"].figures;

  for (const key of ["windowCap", "windowNudge", "windowHeadroom", "windowWrapUp"]) {
    assert.ok(!(key in uncapped), `an uncapped window published ${key}`);
    assert.ok(key in capped, `a capped window is missing ${key}`);
  }
  /* What both do carry, because both measured it. */
  assert.equal(uncapped.windowMedianCloser.value, 7_000_000);
});

test("a capped window that nobody ever nudged publishes no wrap-up", () => {
  const built = buildCorpus(
    [
      fakeRun("aaaaaaaa1111", {
        budget: { capPayoff: null, windows: [fakeWindow({ wrapUpTokens: null, wrapUpSamples: 0 })] }
      })
    ],
    mapOf({ aaaaaaaa: { label: "the-mapped-one", scenario: "A run", repoKey: "one" } })
  );
  const figures = built.payload.windows["the-mapped-one-capped-8m"].figures;

  assert.ok("windowNudge" in figures);
  assert.ok(!("windowWrapUp" in figures), "a wrap-up was published with nothing measured behind it");
  assert.ok(!("windowHeadroomVsWrapUp" in figures), "a ratio was published against an assumption");
});

test("two windows of one run cannot collide on a key", () => {
  assert.throws(
    () =>
      buildCorpus(
        [fakeRun("aaaaaaaa1111", { budget: { capPayoff: null, windows: [fakeWindow({}), fakeWindow({})] } })],
        mapOf({ aaaaaaaa: { label: "the-mapped-one", scenario: "A run", repoKey: "one" } })
      ),
    /both be published as/
  );
});

test("an excluded run takes its windows with it", () => {
  const built = buildCorpus(
    [fakeRun("aaaaaaaa1111"), fakeRun("bbbbbbbb2222")],
    mapOf({ aaaaaaaa: { label: "the-mapped-one", scenario: "A run", repoKey: "one" } })
  );
  assert.ok(
    Object.keys(built.payload.windows).every((key) => key.startsWith("the-mapped-one")),
    "a window of an unmapped run reached the corpus"
  );
});

test("the corpus ceiling block counts only what ran under a measured ceiling", () => {
  const corpus = buildCorpus(
    [fakeRun("aaaaaaaa1111")],
    mapOf({ aaaaaaaa: { label: "the-mapped-one", scenario: "A run", repoKey: "one" } })
  ).payload.corpus;

  /* One capped window of the fixture's two: 10 sessions, 9 nudged, 5 of them
     clean, 4 killed. The uncapped window's identical numbers must not appear. */
  assert.equal(corpus.cappedWindows.value, 1);
  assert.equal(corpus.sessionsUnderACeiling.value, 10);
  assert.equal(corpus.nudgesDelivered.value, 9);
  assert.equal(corpus.nudgesHonoured.value, 5);
  assert.equal(corpus.killedAtACeiling.value, 4);
  assert.equal(corpus.killedAfterANudge.value, 4);
});

test("a run key and a window key never share a name", () => {
  const perRun = new Set(
    Object.values(corpusJson.runs).flatMap((run) => Object.keys(run.figures))
  );
  const perWindow = new Set(
    Object.values(corpusJson.windows).flatMap((window) => Object.keys(window.figures))
  );
  const clashes = [...perWindow].filter((key) => perRun.has(key));
  assert.deepEqual(clashes, [], "one key, one meaning: see assertDisjoint() in scripts/harvest.mjs");
  assert.deepEqual(
    Object.keys(corpusJson.corpus).filter((key) => perWindow.has(key)),
    []
  );
});

test("every window figure in the committed corpus came from conductor budget", () => {
  /* Not a name check: a window figure that says it was measured by the verb and
     was not is already lying on the page, because `source` is what the strip
     prints under the number. `runs.limits_json` is NULL for every imported run,
     so nothing here could have been recomputed from the store anyway. */
  for (const [label, window] of Object.entries(corpusJson.windows)) {
    for (const [key, figure] of Object.entries(window.figures)) {
      assert.match(
        figure.source,
        /^conductor budget\b/,
        `${label}.${key} says it came from ${figure.source}`
      );
    }
  }
});

test("every money-shaped figure in the committed corpus names the verb", () => {
  /* The other direction, against what actually shipped: no figure may carry a
     money-shaped name unless a verb answered it. */
  const moneyShaped = /perCheckpoint|perMillion|dearestStage/i;
  for (const [label, run] of Object.entries(corpusJson.runs)) {
    for (const [key, figure] of Object.entries(run.figures)) {
      if (!moneyShaped.test(key)) continue;
      assert.match(
        figure.source,
        /^conductor (money|budget)\b/,
        `${label}.${key} is money-shaped but says it came from ${figure.source}`
      );
    }
  }
});

test("a run collected without asking the verb cannot be published", () => {
  const run = fakeRun("aaaaaaaa1111");
  delete run.money;
  assert.throws(
    () => buildCorpus([run], mapOf({ aaaaaaaa: { label: "the-one", scenario: "A run", repoKey: "one" } })),
    /money/
  );
});
