/* Turning the keys a page names into the numbers it shows.
   ---------------------------------------------------------------------------
   This is the reading half of the site's first litmus test. `schema.ts` refuses
   a value in the `evidence` field, `figures.ts` refuses one in the prose, and
   `scripts/harvest.mjs` recomputes every value from Conductor's run store into
   `src/data/corpus.json`. What is left is the lookup — and the lookup is where
   the rule would quietly stop being true.

   A key the corpus does not have has exactly one honest outcome, and it is a
   failed build. The alternatives all look fine on screen: an empty cell, a
   dash, the key rendered as its own name. Each of them publishes a page that
   claims evidence and shows none, and none of them is visible to anyone who is
   not looking for it. So `assertEvidenceResolves` throws, `ordered()` calls it
   for every entry on the way past, and the failure names the key, the entry and
   what the corpus actually holds.

   Two namespaces, deliberately disjoint (see `corpusFigures` in the harvest): a
   corpus key like `totalSessions` is the whole corpus, a run key like `sessions`
   is one run and needs the page to have named which runs. One word, one
   meaning. */
import corpus from "../data/corpus.json";

export interface Figure {
  value: number;
  display: string;
  label: string;
  source: string;
  note?: string;
}

interface RunEntry {
  label: string;
  scenario: string;
  repoKey: string;
  status: string;
  startedUtc: string;
  figures: Record<string, Figure>;
}

/** What a page names in its `evidence` field. */
export interface Evidence {
  runs: string[];
  figures: string[];
}

/** One block of the strip: the corpus, or one run. */
export interface EvidenceGroup {
  /** The run label, or `null` for the corpus-wide block. */
  run: string | null;
  /** The sentence a reader maps their own situation onto. */
  scenario: string;
  /** `abandoned` and `paused` say what the store could not. */
  status?: string;
  cells: Figure[];
}

export interface ResolvedEvidence {
  groups: EvidenceGroup[];
  /** Every distinct place these numbers came from, for the strip's footer. */
  sources: string[];
  generatedAtUtc: string;
}

const corpusFigures = corpus.corpus as Record<string, Figure>;
const runs = corpus.runs as Record<string, RunEntry>;

const known = {
  corpus: Object.keys(corpusFigures).sort(),
  run: [...new Set(Object.values(runs).flatMap((run) => Object.keys(run.figures)))].sort(),
  runs: Object.keys(runs).sort()
};

/** The corpus behind a key, or a build failure naming what is actually there.
    ---------------------------------------------------------------------------
    `where` is the entry the key came from, because the useful half of this
    failure is not "softbreaks is missing" — it is which file said it. */
export function resolveEvidence(where: string, evidence: Evidence): ResolvedEvidence {
  const named: RunEntry[] = evidence.runs.map((label) => {
    const run = runs[label];
    if (!run) {
      throw new Error(
        `${where}: evidence.runs names "${label}", which the corpus does not publish. ` +
          `Either anonymise.json has no entry for that run — in which case it is excluded on ` +
          `purpose and cannot be cited — or the label is a typo. Published runs: ` +
          `${known.runs.join(", ")}.`
      );
    }
    return run;
  });

  const corpusKeys: string[] = [];
  const runKeys: string[] = [];

  for (const key of evidence.figures) {
    if (key in corpusFigures) {
      corpusKeys.push(key);
      continue;
    }
    if (known.run.includes(key)) {
      if (named.length === 0) {
        throw new Error(
          `${where}: evidence.figures names "${key}", which is a per-run figure, but the page ` +
            `names no runs. Add the run to evidence.runs, or use a corpus-wide key: ` +
            `${known.corpus.join(", ")}.`
        );
      }
      runKeys.push(key);
      continue;
    }
    throw new Error(
      `${where}: evidence.figures names "${key}", which is not in the corpus. Nothing on this ` +
        `site is typed in, so a key with no figure behind it is a claim with no evidence behind ` +
        `it. Run \`npm run harvest\` if the corpus is stale; otherwise the key is wrong.\n` +
        `  corpus-wide keys: ${known.corpus.join(", ")}\n` +
        `  per-run keys:     ${known.run.join(", ")}`
    );
  }

  const groups: EvidenceGroup[] = [];

  if (corpusKeys.length > 0) {
    groups.push({
      run: null,
      scenario: `${corpusFigures.totalRuns!.display} runs across ${corpusFigures.totalRepos!.display} repositories`,
      cells: corpusKeys.map((key) => corpusFigures[key]!)
    });
  }

  /* A run named with no per-run figure still earns its line. The page is
     saying "this is where I saw it", and the scenario is the part a reader
     needs in order to know whether their own situation is anything like it. */
  for (const run of named) {
    groups.push({
      run: run.label,
      scenario: run.scenario,
      status: run.status,
      cells: runKeys.map((key) => {
        const figure = run.figures[key];
        if (!figure) {
          throw new Error(
            `${where}: "${run.label}" has no figure "${key}". Every published run carries the ` +
              `same per-run keys, so this means the corpus is stale — run \`npm run harvest\`.`
          );
        }
        return figure;
      })
    });
  }

  const sources = [...new Set(groups.flatMap((group) => group.cells.map((cell) => cell.source)))];

  return { groups, sources, generatedAtUtc: corpus.generatedAtUtc };
}

/** Every evidence key an entry names, resolved for its side effect.
    ---------------------------------------------------------------------------
    Called from `ordered()` so it runs because a page renders rather than
    because somebody remembered — the same bargain the canonical, `readNext` and
    typed-figure checks already make. An index page that lists an entry fails
    the build on that entry's bad key, before a reader ever reaches the page
    that would have shown the hole. */
export function assertEvidenceResolves(where: string, data: unknown): void {
  const evidence = (data as { evidence?: Evidence }).evidence;
  if (!evidence) return;
  resolveEvidence(where, evidence);
}
