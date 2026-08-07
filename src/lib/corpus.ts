/* The corpus index: every published run, in one table.
   ---------------------------------------------------------------------------
   `evidence.ts` answers the question a report asks — "what is behind the keys
   this page named". This file answers the one `/runs` asks, which is the
   opposite: "what is in the corpus at all". The difference is worth a separate
   file, because a page that listed runs by naming them would be right on the
   day it was written and quietly short a run the first time the harvest
   published a nineteenth. So nothing here takes a list of runs as an argument.
   The table is whatever `corpus.json` carries, in the order the runs started,
   and a run added to `anonymise.json` appears on the page without a page being
   edited.

   Three things it refuses to do, each of them a way this page could publish a
   comfortable half-truth:

   - **It will not invent a cell.** A run missing a figure the table has a
     column for throws, the same bargain `resolveEvidence` makes. A blank cell
     in a column of numbers does not read as "unknown", it reads as zero.
   - **It will not quietly show a subset.** The row count is checked against
     the corpus's own `totalRuns`, so a filter that drops a run — the dead
     starts are the tempting ones — fails the build rather than publishing a
     corpus with a hole in it and a total that does not add up to what is
     above it.
   - **It will not total a column with a different question's answer.** Each
     column names both the per-run key it prints and the corpus-wide key that
     sums it, so the footer row cannot drift into being sessions under one
     heading and costed sessions under the next.

   The status column is why this is not simply a wider evidence strip. The
   store marks three July runs `running` and they are not running: their engine
   exited without ever closing the record. `anonymise.json` carries the
   disposition the store could not infer, the harvest refuses a `running` run
   that has none, and this table prints it. A corpus index that showed those
   three as live work would be this site failing its own first litmus test on
   the one page whose entire subject is the corpus.

   `corpus.json` is a parameter here rather than an import, for the reason
   `figures.ts` gives for the same choice: `test/corpus.test.mjs` imports this
   file directly, and a module that imports JSON at the top cannot be loaded by
   `node --test` at all. It also lets the tests feed it a corpus that is wrong
   in each of the three specific ways above and watch it refuse — which is the
   only way to know the refusals work, since the real corpus is correct. */
import type { Figure, RunEntry } from "./evidence.js";

/** As much of `src/data/corpus.json` as the table reads. */
export interface CorpusData {
  generatedAtUtc: string;
  corpus: Record<string, Figure>;
  runs: Record<string, RunEntry>;
}

/** A column of the table: the per-run key it prints, and the corpus-wide key
    that totals it in the footer. Both named here so they cannot drift apart.

    Four, not sixteen. The per-run namespace carries far more than this and a
    table with all of it would be a spreadsheet nobody reads — these are the
    four a stranger sizing up their own situation actually asks: how much did
    it close, how long did it take, what did it cost, and did the checks pass.
    Everything else is in the report, one click along the row. */
const columns = [
  { run: "checkpointsDone", total: "totalCheckpointsDone" },
  { run: "sessions", total: "totalSessions" },
  { run: "costUsd", total: "totalCostUsd" },
  { run: "gatesGreen", total: "totalGatesGreen" }
] as const;

/** One run's row. */
export interface RunRow {
  /** The published label, which is also the report's slug when it has one. */
  label: string;
  /** The sentence a reader maps their own situation onto. */
  scenario: string;
  /** The generalised repo identity — what the site counts as a repository. */
  repoKey: string;
  /** `completed`, or the word `anonymise.json`'s disposition says instead. */
  status: string;
  /** The date the run started, which is what puts the false starts first. */
  started: string;
  cells: Figure[];
}

export interface CorpusIndex {
  /** Column headings, taken from the figures' own labels rather than written. */
  headings: string[];
  rows: RunRow[];
  /** The footer row: the same four columns, summed across the corpus. */
  totals: { scenario: string; cells: Figure[] };
  /** Every distinct place these numbers came from. */
  sources: string[];
  generatedAtUtc: string;
}

/** A figure, or a build failure naming which row wanted it. */
function figureOf(where: string, figures: Record<string, Figure>, key: string): Figure {
  const figure = figures[key];
  if (!figure) {
    throw new Error(
      `/runs: ${where} has no figure "${key}", so the corpus table would print an empty cell ` +
        `in a column of numbers — which reads as a zero rather than as a gap. Every published ` +
        `run carries the same per-run keys, so this means the corpus is stale: run ` +
        `\`npm run harvest\`. Keys it does have: ${Object.keys(figures).sort().join(", ")}.`
    );
  }
  return figure;
}

/** Every run the corpus publishes, oldest first, with the footer that sums it.
    ---------------------------------------------------------------------------
    Oldest first is a decision rather than a default. Newest-first would open
    the table with the runs that went well and bury the two false starts and
    the abandoned prototype at the bottom, and those four are the honest part
    of the corpus — the same reason SPEC Part VI publishes the run that ended
    one checkpoint short. Read down the table and the fortnight happens in
    order. */
export function corpusIndex(data: CorpusData): CorpusIndex {
  const corpusFigures = data.corpus;
  const entries = Object.values(data.runs).sort((a, b) =>
    a.startedUtc.localeCompare(b.startedUtc)
  );

  const totalRuns = figureOf("the corpus", corpusFigures, "totalRuns");
  if (entries.length !== totalRuns.value) {
    throw new Error(
      `/runs: the corpus table has ${entries.length} rows but the corpus says ` +
        `${totalRuns.display} runs. A table that shows some of the corpus under a total that ` +
        `sums all of it is wrong in the quietest possible way — every number on screen is ` +
        `right and the page is not.`
    );
  }
  if (entries.length === 0) {
    throw new Error(`/runs: the corpus publishes no runs. Run \`npm run harvest\`.`);
  }

  const rows: RunRow[] = entries.map((run) => ({
    label: run.label,
    scenario: run.scenario,
    repoKey: run.repoKey,
    status: run.status,
    started: run.startedUtc.slice(0, 10),
    cells: columns.map((column) => figureOf(run.label, run.figures, column.run))
  }));

  const totals = {
    /* The same sentence the evidence strip puts above a corpus-wide group, for
       the same reason: the footer is not "total", it is a different population
       from the rows above it and the reader is owed which one. */
    scenario:
      `${totalRuns.display} runs across ` +
      `${figureOf("the corpus", corpusFigures, "totalRepos").display} repositories`,
    cells: columns.map((column) => figureOf("the corpus", corpusFigures, column.total))
  };

  /* Headings come off the first row's figures rather than out of a list of
     strings kept here. A label is part of a figure — "checkpoints closed",
     with the closed doing work — and writing it twice is how a column comes to
     be headed one thing and filled with another. */
  const headings = rows[0]!.cells.map((cell) => cell.label);

  const sources = [
    ...new Set([...rows.flatMap((row) => row.cells), ...totals.cells].map((cell) => cell.source))
  ];

  return { headings, rows, totals, sources, generatedAtUtc: data.generatedAtUtc };
}
