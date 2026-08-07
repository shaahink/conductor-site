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
    }
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
