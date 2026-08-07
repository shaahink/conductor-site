# Re-taking the social cards

The four PNGs in `public/og/` are screenshots of pages this site renders. They
are checked in because a scraper needs a bitmap and this repo has no rasteriser
— not because they are art somebody drew. Everything about them comes from the
site: the palette from `src/styles/tokens.css`, the sizes from
`src/styles/type.css`, the words from the section's own `title` and
`meta.ogDescription`, and the three figures from `src/data/corpus.json` through
`resolveEvidence`, like every other figure here.

Which means they go stale, and `npm run seo` is what says so. It re-renders each
card's text and compares it to `src/data/og-cards.json`, the manifest written
the last time the PNGs were taken. When it goes red — after a harvest, after a
section is renamed, after a change to the card's markup — this is the recipe.

## The four steps

```bash
npm run build                     # renders /og/<card>/ for each card
npx astro preview --port 4321     # serves dist
# screenshot each card (below), then:
npm run build                     # copies the new PNGs from public/ into dist/
npm run seo:cards                 # rewrites src/data/og-cards.json from dist
npm run seo                       # green
```

Commit the PNGs and the manifest together. They are one fact.

## Taking the screenshot

Each card is at `http://localhost:4321/og/<key>/`, where `<key>` is from
`OG_CARDS` in `src/lib/seo.ts` — currently `home`, `concepts`, `articles`,
`runs`. Save to `public/og/<key>.png`.

**The viewport has to be exactly 1200×630**, which is what Facebook and X read
and what the card's own box is sized to. Not the window — the viewport. The gate
reads the PNG's IHDR chunk and fails on any other size, because a card
screenshotted at 1200×640 looks perfectly fine and crops wrong in every feed.

Any tool that can set a viewport and capture it will do. With Chrome DevTools:
resize the page to 1200×630, then capture the *viewport* (not the full page —
the card is exactly one viewport tall, so full-page capture adds the scrollbar's
worth of nothing).

## Changing what a card says

- **The words**: they are the section's `title` and `meta.ogDescription` in
  `src/content/sections/<name>.yaml`, or the home page's `hero.title` and
  `meta.ogDescription`. Edit the content; the card follows.
- **The figures**: `FIGURES` in `src/pages/og/[card].astro`, as corpus keys. A
  key the corpus does not carry fails the build rather than rendering blank.
- **A new section**: add `{ key, base }` to `OG_CARDS`, where `base` is the
  section index's canonical. `test/seo.test.mjs` fails until a section has a
  card and a card has a PNG, so the order does not matter — the tests will say
  what is still missing.

## Why the cards are mocha

A card is one image and cannot follow a reader's colour scheme. Mocha is the
default and what `conductor-face` shows out of the box (SPEC Part II), so the
card looks like the tool. `data-theme="dark"` on the card's `<html>` pins it:
without it, a renderer on a machine set to light is served latte through
`prefers-color-scheme` and half the cards in `public/og/` end up a different
colour from the other half depending on who took them.

## Why `/og/` is not in the sitemap

The card pages are a rendering surface, not content. They are disallowed in
`robots.txt`, absent from the sitemap, and `scripts/seo.mjs` checks that those
two agree. What gets shared is the PNG, which is an image and is unaffected by
either.
