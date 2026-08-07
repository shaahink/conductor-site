/* The corpus table's own gate (SPEC Part VI, `/runs`).
   ---------------------------------------------------------------------------
   `src/lib/corpus.ts` builds the table on `/runs` from `src/data/corpus.json`,
   and the three things it refuses to do are the three ways that page could
   publish a comfortable half-truth: a blank cell that reads as a zero, a
   subset of the corpus under a total that sums all of it, and a column headed
   by one question and totalled by another.

   None of those can be proven against the real corpus, because the real corpus
   is correct — so each is proven against an invented one, built here, wrong in
   exactly one way. That is the same bargain `test/anonymity.test.mjs` makes,
   and for the same reason: a check nobody has watched fail is a check nobody
   knows works.

   The last block is the other half, and it runs against the *real* corpus:
   every run in the file reaches the table, and the runs the store still marks
   `running` come out of it saying `abandoned`. That one is the checkpoint's
   own acceptance, so it is asserted from the shipped data rather than from a
   fixture that could be made to agree with anything. */
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

import { corpusIndex } from "../src/lib/corpus.ts";

const real = JSON.parse(readFileSync(new URL("../src/data/corpus.json", import.meta.url), "utf8"));

/** A figure the way the harvest writes one. */
const figure = (value, display, label, source = "a fixture") => ({
  value,
  display,
  label,
  source
});

/* An invented corpus of two runs, correct in every way, so that each test
   below can break exactly one thing and know that is what it measured. The
   numbers are made up and deliberately unlike anything in the real store. */
const fixture = () => ({
  generatedAtUtc: "2019-03-04T05:06:07.000Z",
  corpus: {
    totalRuns: figure(2, "2", "runs"),
    totalRepos: figure(1, "1", "repositories"),
    totalCheckpointsDone: figure(7, "7/9", "checkpoints closed"),
    totalSessions: figure(11, "11", "sessions"),
    totalCostUsd: figure(1.5, "$1.50", "spent across the corpus"),
    totalGatesGreen: figure(13, "13/14", "gates green")
  },
  runs: {
    "the-later-one": {
      label: "the-later-one",
      scenario: "A run that started second and therefore sorts second",
      repoKey: "a-repo",
      status: "completed",
      startedUtc: "2019-02-02T00:00:00.000Z",
      figures: {
        checkpointsDone: figure(4, "4/4", "checkpoints closed"),
        sessions: figure(6, "6", "sessions"),
        costUsd: figure(1, "$1.00", "spent"),
        gatesGreen: figure(8, "8/8", "gates green")
      }
    },
    "the-earlier-one": {
      label: "the-earlier-one",
      scenario: "A run the store never closed the record on",
      repoKey: "a-repo",
      status: "abandoned",
      startedUtc: "2019-01-01T00:00:00.000Z",
      figures: {
        checkpointsDone: figure(3, "3/5", "checkpoints closed"),
        sessions: figure(5, "5", "sessions"),
        costUsd: figure(0.5, "$0.50", "spent"),
        gatesGreen: figure(5, "5/6", "gates green")
      }
    }
  }
});

test("the table is every run in the corpus, oldest first", () => {
  const { rows } = corpusIndex(fixture());

  assert.deepEqual(
    rows.map((row) => row.label),
    ["the-earlier-one", "the-later-one"],
    "newest-first would open the table with the runs that went well and bury the dead " +
      "starts at the bottom; the order is the order the work happened in"
  );
});

test("a corpus with more runs than rows fails the build", () => {
  const data = fixture();
  data.corpus.totalRuns = figure(3, "3", "runs");

  assert.throws(
    () => corpusIndex(data),
    /2 rows but the corpus says 3 runs/,
    "a table showing some of the corpus under a total that sums all of it is wrong in the " +
      "quietest possible way — every number on screen is right and the page is not"
  );
});

test("a run missing a column's figure fails the build rather than printing a gap", () => {
  const data = fixture();
  delete data.runs["the-earlier-one"].figures.costUsd;

  assert.throws(
    () => corpusIndex(data),
    /the-earlier-one has no figure "costUsd"/,
    "an empty cell in a column of numbers reads as a zero, not as an absence"
  );
});

test("a corpus missing a column's total fails the build too", () => {
  const data = fixture();
  delete data.corpus.totalGatesGreen;

  assert.throws(() => corpusIndex(data), /the corpus has no figure "totalGatesGreen"/);
});

test("an empty corpus is a stale harvest, not an empty table", () => {
  const data = fixture();
  data.runs = {};
  data.corpus.totalRuns = figure(0, "0", "runs");

  assert.throws(() => corpusIndex(data), /publishes no runs/);
});

test("the column headings are the figures' own labels, not a list kept beside them", () => {
  const { headings, rows, totals } = corpusIndex(fixture());

  assert.deepEqual(headings, ["checkpoints closed", "sessions", "spent", "gates green"]);
  assert.equal(headings.length, rows[0].cells.length);
  assert.equal(
    headings.length,
    totals.cells.length,
    "a footer with a different number of cells from the header is a column totalled by " +
      "the answer to a different question"
  );
});

test("every cell is a display string from the corpus, never a value formatted here", () => {
  const { rows, totals } = corpusIndex(fixture());

  assert.deepEqual(
    rows[0].cells.map((cell) => cell.display),
    ["3/5", "5", "$0.50", "5/6"]
  );
  assert.deepEqual(
    totals.cells.map((cell) => cell.display),
    ["7/9", "11", "$1.50", "13/14"]
  );
});

test("the footer names its own population rather than saying total", () => {
  const { totals } = corpusIndex(fixture());

  assert.equal(
    totals.scenario,
    "2 runs across 1 repositories",
    "the footer is a different population from the rows above it and the reader is owed which"
  );
});

test("the sources are every distinct place the numbers came from", () => {
  const data = fixture();
  data.runs["the-later-one"].figures.sessions.source = "somewhere else";

  const { sources } = corpusIndex(data);
  assert.deepEqual(sources.slice().sort(), ["a fixture", "somewhere else"]);
});

/* ── and now against the corpus this site actually ships ──────────────────── */

test("every run the harvest published reaches the table", () => {
  const { rows } = corpusIndex(real);

  assert.deepEqual(
    rows.map((row) => row.label).sort(),
    Object.keys(real.runs).sort(),
    "a run in corpus.json and not on /runs is a corpus with a hole in it"
  );
  assert.equal(rows.length, real.corpus.totalRuns.value);
});

test("the runs the store never closed are named abandoned, not in-flight", () => {
  const { rows } = corpusIndex(real);
  const abandoned = rows.filter((row) => row.status === "abandoned");

  assert.ok(
    abandoned.length > 0,
    "the corpus carries July runs whose engine exited without closing the record; " +
      "anonymise.json's disposition is the only thing that knows they are not live"
  );
  for (const row of rows) {
    assert.notEqual(
      row.status,
      "running",
      `${row.label} would render as in-flight. The store's own status cannot tell an ` +
        `abandoned run from a paused one, so the harvest resolves it against ` +
        `anonymise.json before anything is published.`
    );
  }
});

test("no row in the shipped corpus has an unlabelled status", () => {
  const known = new Set(["completed", "abandoned", "paused", "aborted"]);
  for (const row of corpusIndex(real).rows) {
    assert.ok(
      known.has(row.status),
      `${row.label} has status "${row.status}", which RunTable.astro paints in no role — ` +
        `it would render as unstyled text beside runs whose state the page does colour`
    );
  }
});

test("every report is named after a run the corpus publishes", () => {
  const { rows } = corpusIndex(real);
  const labels = new Set(rows.map((row) => row.label));
  /* Read off disk rather than listed here, so a fourth report is covered by
     this the day it lands rather than the day somebody remembers. */
  const reports = readdirSync(new URL("../src/content/reports/", import.meta.url))
    .filter((name) => name.endsWith(".yaml"))
    .map((name) => name.replace(/\.yaml$/, ""));

  assert.ok(reports.length > 0, "expected src/content/reports to hold some reports");

  for (const slug of reports) {
    assert.ok(
      labels.has(slug),
      `/runs links the table row "${slug}" to its report by the two names agreeing. ` +
        `A report named after a run the corpus does not carry is a row that silently ` +
        `stops being a link.`
    );
  }
});
