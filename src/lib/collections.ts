/* Reading the collections, and the checks that come with it.
   ---------------------------------------------------------------------------
   Every page that lists or renders a collection entry goes through here, and
   that is the point: the checks below run because the build renders a page,
   not because someone remembered to run them. A dangling `readNext` fails
   `npm run build` with the entry and the missing slug named.

   This file may import `astro:content` — it is site code that only ever runs
   inside the build. `src/content/schema.ts` may not, because the editor's
   Vercel function imports that one from outside the build. The two are
   deliberately different jobs. */
import { getCollection, type CollectionEntry } from "astro:content";
import { refuseTypedFigures } from "./figures.js";

/** The collections a reader browses. `homePage` and `sectionPages` are the
    site's own furniture and are not listed anywhere. */
export type Listed = "concepts" | "articles" | "reports";

/** One entry of any listed collection. All three share the fields the index
    pages and the nav need: `slug`, `order`, `title`, `meta`, `readNext`. */
export type ListedEntry = CollectionEntry<Listed>;

/** The top bar, built from the section pages rather than from a list kept
    beside them.
    ---------------------------------------------------------------------------
    A section whose collection has no entries yet is left out. The alternative
    is a link to an index of nothing, and an empty page a reader clicked on is
    a worse answer than a bar with two things in it — the site is being written
    in public and the nav should say what is actually there. */
export async function navSections() {
  const pages = (await getCollection("sectionPages")).sort(
    (a, b) => a.data.order - b.data.order
  );

  const filled = [];
  for (const page of pages) {
    const entries = await getCollection(page.data.collection);
    if (entries.length === 0) continue;
    filled.push({
      href: page.data.meta.canonical,
      label: page.data.navLabel,
      count: entries.length
    });
  }
  return filled;
}

/** The section page behind one of the three indexes. */
export async function sectionPage(collection: Listed) {
  const pages = await getCollection("sectionPages");
  const page = pages.find((entry) => entry.data.collection === collection);
  if (!page) {
    throw new Error(
      `No section page lists "${collection}". Add src/content/sections/<name>.yaml ` +
        `with collection: "${collection}".`
    );
  }
  return page;
}

/** One collection in reading order, with everything about it that can be wrong
    checked on the way past.
    ---------------------------------------------------------------------------
    Four failures, all of them silent otherwise:

    - a file renamed without its `slug`, which leaves every `readNext` pointing
      at it broken and the page itself still building perfectly;
    - two entries claiming the same `order`, which makes the reading order —
      the whole shape of the spine — depend on the order the loader happened to
      read the directory in;
    - a `readNext` naming an entry that does not exist, which is a dead link
      published at the exact moment a reader has decided to keep going;
    - a `meta.canonical` that is not the URL the page is served at, which is the
      quietest of the four. Nothing on the rendered page shows it. The canonical
      link, the `og:url` and the sitemap entry are all built from it, so one
      stale path tells every crawler and every social card that the page it just
      read lives somewhere else.

    The route half of that last one is not a constant here. It comes from the
    section page that lists the collection, whose own `meta.canonical` is the
    index URL and the nav's href — so `/runs/the-fleet-round/` is checked
    against the `/runs/` that `runs.yaml` publishes, and a section that moves
    moves its entries with it rather than leaving them behind.

    Each throws with the entry and the offending value named, because a build
    failure a reader of the log cannot act on is only half a gate. */
export async function ordered<C extends Listed>(collection: C): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(collection);
  const ids = new Set(entries.map((entry) => entry.id));
  const seenOrder = new Map<number, string>();
  const base = (await sectionPage(collection)).data.meta.canonical;

  for (const entry of entries) {
    const { slug, order, readNext } = entry.data;

    /* SPEC Part I, litmus test 1, made mechanical for the prose as well as for
       the `evidence` field. See src/lib/figures.ts for what counts and for the
       one gap it leaves. */
    refuseTypedFigures(`${collection}/${entry.id}.yaml`, entry.data);

    /* And litmus test 3, made structural. "A concept page is useful without
       Conductor": delete `inConductor` from an entry and what is left has to
       still be worth reading, which is only true if the idea was written for
       someone who has never heard of the tool. schema.ts already puts `theIdea`
       first for this reason; this is the half that can actually be checked.

       Only `theIdea`. `theProblem` is a judgement — a failure is sometimes
       clearest told as one that happened — and SPEC Part III asks for the
       tool-free discipline on the idea specifically. */
    if ("theIdea" in entry.data) {
      const index = entry.data.theIdea.findIndex((para) => /conductor/i.test(para));
      if (index >= 0) {
        throw new Error(
          `${collection}/${entry.id}.yaml: theIdea[${index}] names Conductor. The idea has to ` +
            `read for someone who has never heard of it — the mechanism belongs in ` +
            `inConductor, which is the section a reader is allowed to skip.`
        );
      }
    }

    const expected = `${base}${entry.id}/`;
    if (entry.data.meta.canonical !== expected) {
      throw new Error(
        `${collection}/${entry.id}.yaml says canonical: "${entry.data.meta.canonical}", but the ` +
          `page is served at "${expected}". The canonical is also the og:url and the sitemap ` +
          `entry, so nothing on the page shows this being wrong.`
      );
    }

    if (slug !== entry.id) {
      throw new Error(
        `${collection}/${entry.id}.yaml says slug: "${slug}". The file name is the URL and ` +
          `the name other entries link to, so the two have to agree.`
      );
    }

    const taken = seenOrder.get(order);
    if (taken) {
      throw new Error(
        `${collection}: "${entry.id}" and "${taken}" both claim order ${order}. ` +
          `Reading order is the shape of this section; it cannot be a tie.`
      );
    }
    seenOrder.set(order, entry.id);

    for (const next of readNext) {
      if (next === entry.id) {
        throw new Error(`${collection}/${entry.id}: readNext points at itself.`);
      }
      if (!ids.has(next)) {
        throw new Error(
          `${collection}/${entry.id}: readNext names "${next}", which is not an entry in ` +
            `${collection}. Known entries: ${[...ids].sort().join(", ")}.`
        );
      }
    }
  }

  return entries.sort((a, b) => a.data.order - b.data.order);
}

/** The entries one page's `readNext` points at, in the order it named them.
    `ordered()` has already refused the build if any of them is missing, so
    this cannot return a hole. */
export async function readNextOf<C extends Listed>(
  collection: C,
  entry: CollectionEntry<C>
): Promise<CollectionEntry<C>[]> {
  const all = await ordered(collection);
  return entry.data.readNext.map((slug) => all.find((other) => other.id === slug)!);
}
