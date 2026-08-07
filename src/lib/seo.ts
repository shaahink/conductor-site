/* Which social card a page carries, and the list of cards that exist.
   ---------------------------------------------------------------------------
   A social card is the one part of this site most readers see first and almost
   nobody on the team ever looks at, which is the exact shape of a thing that
   rots. Two ways it rots quietly, and this file exists to close the first:

   - **A page with no `og:image` at all.** Nothing on the page shows it. The
     link renders in a feed as a grey box with a domain under it, and the only
     way to find out is to post it. So no page opts in: `Base.astro` asks this
     file for a card and every page gets one, with `meta.ogImage` left as the
     override for a page that has earned its own.
   - **A card that is a picture of numbers that have since moved.** That one is
     `scripts/seo.mjs`, which re-renders the card's text at gate time and
     compares it to `src/data/og-cards.json` — the manifest written when the
     PNGs were last taken. A corpus that moves under a card turns the gate red
     rather than leaving a stale figure in circulation.

   The mapping is by canonical prefix rather than by a field on each entry,
   because the alternative is a per-entry `ogImage` that fourteen content files
   have to agree on and one of them eventually will not. A section is the right
   granularity: the card says which part of the site this is, and the title and
   description under it in the feed say which page.

   Pure on purpose — no `astro:content`, no `astro:assets` — so `node --test`
   can load it. */

/** One card. `key` is both the route segment that renders it and the file name
    of the PNG the renderer produced; `base` is the canonical prefix it covers. */
export interface OgCard {
  key: string;
  base: string;
}

/** The cards, longest prefix first — `/` is the fallback and must stay last.
    Adding a section means adding a line here and re-taking the PNGs; the gate
    will say so, because a card in this list with no PNG behind it fails. */
export const OG_CARDS: readonly OgCard[] = [
  { key: "concepts", base: "/concepts/" },
  { key: "articles", base: "/articles/" },
  { key: "runs", base: "/runs/" },
  { key: "home", base: "/" }
];

/** Where a card's PNG is served from. One place, because the route that
    renders the card, the layout that names it and the gate that checks it all
    have to spell it the same way. */
export function ogCardPath(key: string): string {
  return `/og/${key}.png`;
}

/** The card a canonical path falls under.
    ---------------------------------------------------------------------------
    Total by construction: `/` matches everything that starts with a slash, and
    a canonical that does not start with one is a bug the schema already
    refuses. It still throws rather than returning undefined, because a silent
    `undefined` here is exactly the missing `og:image` this file is for. */
export function ogCardFor(canonical: string): string {
  const card = OG_CARDS.find((entry) => canonical.startsWith(entry.base));
  if (!card) {
    throw new Error(
      `No social card covers "${canonical}". Every canonical is a site-relative path ` +
        `beginning with a slash, so the "/" fallback in OG_CARDS should have caught this — ` +
        `either the path is malformed or the fallback has been removed.`
    );
  }
  return ogCardPath(card.key);
}
