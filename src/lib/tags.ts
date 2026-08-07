/* The tag vocabulary's reader-facing half.
   ---------------------------------------------------------------------------
   `src/content/schema.ts` owns the slugs, because that is where the build can
   refuse an unknown one. This file owns the words a reader sees: what the tag
   is called, and the sentence at the top of its page saying what they are
   looking at.

   The split is not ceremony. schema.ts is imported by `api/content.ts`, a plain
   Vercel function, and is held to Zod-and-nothing-else so it can be; this is
   ordinary site code that only the build reads. Keeping the two apart means the
   editor's form model never has to carry prose it does not use.

   `test/tags.test.mjs` holds them together: every slug in the enum has an entry
   here and every entry here is in the enum. A tag published with no sentence
   under it would be a page that says nothing, and the failure mode of the other
   direction is a description nobody can reach.

   A tag is a *cross-cutting* theme, never a synonym for one of the ten
   concepts. See the enum's own note for what earns one. */

/* The union is written out rather than derived from schema.ts's `TAGS`, and
   that is a deliberate duplication with a mechanical guard on it.

   Deriving it would mean a *value* import of `TAGS` into this file. Astro's
   build resolves that happily; `node --test` does not, because these tests run
   TypeScript through Node's own stripping and the `.js` specifier this repo
   writes has no `.ts` on disk to resolve to. Every other lib file here imports
   only *types* across that boundary, which erase. This one would not.

   So the two lists are written twice and `test/tags.test.mjs` asserts they are
   the same list, in both directions — a slug here that the schema would refuse,
   and a slug the schema accepts with no description here, each fail. The
   duplication is visible and checked, which is the trade this repo makes
   elsewhere for the same reason (see `citedEvidence` in scripts/harvest.mjs,
   deliberately a second implementation of `src/lib/evidence.ts`'s rule). */
export type Tag =
  | "cost"
  | "measurement"
  | "failure"
  | "verification"
  | "autonomy"
  | "context"
  | "orchestration"
  | "people";

export interface TagInfo {
  /** What it is called in a list of tags. Lower case: these sit inline in
      running text and among figures, and a capital reads as a proper noun. */
  label: string;
  /** The standfirst on `/tags/<slug>/` — what joins the pages underneath it.
      Written as a claim about the collection, not as a definition of the word. */
  blurb: string;
}

export const TAG_INFO: Record<Tag, TagInfo> = {
  cost: {
    label: "cost",
    blurb:
      "What the work actually came to, in money and in tokens. Every figure on these pages is recomputed from the run store rather than estimated, including the ones that are embarrassing."
  },
  measurement: {
    label: "measurement",
    blurb:
      "Instrumentation, provenance and the discipline of publishing a number you can point at. The pages here are mostly about how a figure was arrived at rather than what it turned out to be."
  },
  failure: {
    label: "failure",
    blurb:
      "The runs that stopped, the gates that went red, the caps set in the wrong place. Collected deliberately: a corpus that shows only the runs worth writing up is a portfolio."
  },
  verification: {
    label: "verification",
    blurb:
      "How a claim gets checked by something that is not the thing that made it. Gates, acceptance, and the difference between an agent saying the work is done and the work being done."
  },
  autonomy: {
    label: "autonomy",
    blurb:
      "Work that continues without anybody watching — across sessions, across crashes, across the night. What that requires, and what it costs when it goes wrong unattended."
  },
  context: {
    label: "context",
    blurb:
      "What the agent is allowed to know, what it carries between sessions, and what gets paid for on every turn to keep it there."
  },
  orchestration: {
    label: "orchestration",
    blurb:
      "Many sessions, several roles and more than one model, arranged so the expensive one does as little as possible. The plural is in the roles, not in the fleet."
  },
  people: {
    label: "people",
    blurb:
      "Where a human is genuinely in the loop: the approvals, the queues, the moments the machine stops on purpose and says exactly what would clear it."
  }
};

/** Every tag, in the order the vocabulary declares them. Read off `TAG_INFO`
    rather than kept as a third list, so there is nothing else to keep in step. */
export const allTags = (): Tag[] => Object.keys(TAG_INFO) as Tag[];

/** A tag's page. One place, so a renamed route moves in one edit. */
export const tagHref = (tag: Tag): string => `/tags/${tag}/`;
