/* The SEO gate: everything a crawler and a feed see, recomputed from `dist/`.
   ---------------------------------------------------------------------------
   Every fact this checks is invisible on the rendered page. A canonical
   pointing at the wrong URL, an `og:image` naming a file that was never
   written, a sitemap listing one of twenty-one pages, a robots.txt whose
   Sitemap: line still carries the previous domain — none of them shows up in a
   browser, in `npm run check`, or in a build log. They show up in a search
   result, weeks later, or in a link somebody posted that rendered as a grey
   box. That is the same shape of problem the evidence gate exists for, so it
   gets the same answer: recompute it from the artifact, and go red.

       node scripts/seo.mjs            # check  (npm run seo)
       node scripts/seo.mjs --cards    # rewrite the card manifest from dist

   Six things, in the order they can go wrong:

   1. **One origin.** `astro.config`'s `site` is the only place the hostname
      lives. Every absolute URL in the built output has to use it — and the
      value itself was confirmed at S7.1 against the live deployment rather
      than against the plan file.
   2. **Canonicals.** Every public page carries exactly one, and it is the URL
      that page is actually served at. A page whose canonical points at another
      page tells a crawler to index the other one.
   3. **The sitemap is the site.** Its URL set equals the set of public pages,
      both ways. A missing page is a page that does not get crawled; an extra
      one is a 404 handed to Google on purpose.
   4. **robots.txt agrees with the sitemap.** The paths disallowed here are
      exactly the ones absent there. Neither file shows the contradiction.
   5. **Social cards exist.** Every `og:image` names a file that is in `dist`,
      at 1200×630, and every card in `OG_CARDS` is used by at least one page.
      An `og:image` naming a missing file is the grey box.
   6. **Social cards are not stale.** This is the one that needs a manifest.
      A card is a *picture of numbers*, taken once; the numbers underneath it
      keep moving. So `--cards` records the text each card rendered when the
      PNGs were taken, and the check re-renders it and compares. A harvest that
      moves a figure under a card turns this red, and the fix is to re-take the
      four screenshots — see docs/OG-CARDS.md.

   Runs against `dist/`, so it goes after `npm run build`. No dependencies: it
   parses the handful of tags it needs rather than pulling in a DOM. */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { OG_CARDS, ogCardPath } from "../src/lib/seo.ts";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const DIST = join(ROOT, "dist");
const MANIFEST = join(ROOT, "src", "data", "og-cards.json");
const CORPUS = join(ROOT, "src", "data", "corpus.json");

const problems = [];
const fail = (message) => problems.push(message);

/* ── the one origin ─────────────────────────────────────────────────────── */

const config = readFileSync(join(ROOT, "astro.config.mjs"), "utf8");
const siteMatch = /^\s*site:\s*"([^"]+)"/m.exec(config);
if (!siteMatch) {
  console.error("seo: astro.config.mjs has no `site:` line. Everything below derives from it.");
  process.exit(1);
}
const ORIGIN = siteMatch[1].replace(/\/$/, "");

if (!existsSync(DIST)) {
  console.error("seo: no dist/. Run `npm run build` first — this gate reads the built output.");
  process.exit(1);
}

/* ── what is in dist ────────────────────────────────────────────────────── */

/** Every built HTML file, as [served path, absolute file path]. */
function builtPages() {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith(".html")) {
        const rel = relative(DIST, full).split(sep).join("/");
        /* build.format "directory": foo/index.html is served at /foo/, and the
           one loose file is 404.html, which is served at /404. */
        const path = rel === "404.html" ? "/404" : `/${rel.replace(/index\.html$/, "")}`;
        out.push([path, full]);
      }
    }
  };
  walk(DIST);
  return out.sort(([a], [b]) => a.localeCompare(b));
}

/** The three prefixes that are built but are not content. Kept here as one
    list so robots.txt, the sitemap and this gate cannot disagree about it. */
const NOT_CONTENT = ["/edit/", "/og/"];
const NOT_CRAWLED = ["/api/", "/edit", "/og/"];

const pages = builtPages();
const publicPages = pages.filter(([path]) => !NOT_CONTENT.some((p) => path.startsWith(p)));
/* /404 is a public page — it carries a canonical and a card like any other —
   but it is not a destination, so it is the one public page not in the map. */
const listedPages = publicPages.filter(([path]) => path !== "/404");

/* ── reading the handful of tags this needs ─────────────────────────────── */

const decode = (text) =>
  text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const attr = (html, pattern) => {
  const found = [...html.matchAll(pattern)].map((m) => decode(m[1]));
  return found;
};

const canonicalsIn = (html) => attr(html, /<link rel="canonical" href="([^"]*)"/g);
const metaIn = (html, name) =>
  attr(
    html,
    new RegExp(`<meta (?:property|name)="${name}" content="([^"]*)"`, "g")
  );

/** The text a card renders, normalised — what the manifest stores and what the
    freshness check compares. The body of a card page is the card. */
function cardText(html) {
  const body = /<body[^>]*>([\s\S]*)<\/body>/.exec(html);
  if (!body) return null;
  return decode(
    body[1]
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

/** A PNG's declared size, straight out of the IHDR chunk. Catches a screenshot
    taken at the wrong viewport, which otherwise looks like a fine picture. */
function pngSize(file) {
  const buf = readFileSync(file);
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

/* ── 2. canonicals, og:url, og:image ────────────────────────────────────── */

const usedCards = new Set();

for (const [path, file] of publicPages) {
  const html = readFileSync(file, "utf8");
  const where = `${path}`;

  const canonicals = canonicalsIn(html);
  if (canonicals.length !== 1) {
    fail(`${where}: ${canonicals.length} <link rel="canonical"> tags; every page needs exactly 1.`);
    continue;
  }
  const canonical = canonicals[0];

  if (!canonical.startsWith(`${ORIGIN}/`)) {
    fail(`${where}: canonical is "${canonical}", which is not on the site origin ${ORIGIN}.`);
    continue;
  }
  const canonicalPath = canonical.slice(ORIGIN.length);
  if (canonicalPath !== path) {
    fail(
      `${where}: canonical says this page lives at "${canonicalPath}", but it is served at ` +
        `"${path}". A crawler believes the canonical, so this page would be dropped in favour ` +
        `of a URL that may not exist.`
    );
  }

  const ogUrl = metaIn(html, "og:url");
  if (ogUrl.length !== 1 || ogUrl[0] !== canonical) {
    fail(`${where}: og:url is ${JSON.stringify(ogUrl)}, which is not the canonical ${canonical}.`);
  }

  const ogImage = metaIn(html, "og:image");
  const twitterImage = metaIn(html, "twitter:image");
  if (ogImage.length !== 1) {
    fail(`${where}: ${ogImage.length} og:image tags; every page needs exactly 1.`);
  } else {
    if (twitterImage.length !== 1 || twitterImage[0] !== ogImage[0]) {
      fail(`${where}: twitter:image is ${JSON.stringify(twitterImage)}, not the og:image.`);
    }
    if (!ogImage[0].startsWith(`${ORIGIN}/`)) {
      fail(`${where}: og:image "${ogImage[0]}" is not on the site origin ${ORIGIN}. Scrapers ` +
        `reject a relative og:image outright.`);
    } else {
      const imagePath = ogImage[0].slice(ORIGIN.length);
      const imageFile = join(DIST, imagePath.split("/").join(sep));
      if (!existsSync(imageFile)) {
        /* Named per page, because which pages are affected is the useful half
           — a missing card breaks a whole section at once. */
        fail(
          `${where}: og:image names "${imagePath}", which is not in dist. This is the grey box ` +
            `in a feed, and nothing on the page shows it.`
        );
      } else if (!usedCards.has(imagePath)) {
        /* The picture itself, once, however many pages share it. Repeating a
           fact about one file per page that cites it buries the other
           problems under it. */
        const size = pngSize(imageFile);
        if (!size) {
          fail(`${imagePath}: not a PNG.`);
        } else if (size.width !== 1200 || size.height !== 630) {
          fail(
            `${imagePath}: ${size.width}×${size.height}. The cards are 1200×630 — re-take the ` +
              `screenshot with the viewport at that size (docs/OG-CARDS.md).`
          );
        }
      }
      usedCards.add(imagePath);
    }
  }
}

/* ── 3. the sitemap is the site ─────────────────────────────────────────── */

const sitemapFile = join(DIST, "sitemap.xml");
if (!existsSync(sitemapFile)) {
  fail("dist/sitemap.xml was not built.");
} else {
  const xml = readFileSync(sitemapFile, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]));

  const offOrigin = locs.filter((loc) => !loc.startsWith(`${ORIGIN}/`));
  if (offOrigin.length > 0) {
    fail(`sitemap.xml: ${offOrigin.length} URL(s) not on ${ORIGIN}, e.g. ${offOrigin[0]}.`);
  }

  const inMap = new Set(locs.map((loc) => loc.slice(ORIGIN.length)));
  const expected = new Set(listedPages.map(([path]) => path));

  for (const path of expected) {
    if (!inMap.has(path)) {
      fail(`sitemap.xml is missing "${path}". A page not in the sitemap is a page not crawled.`);
    }
  }
  for (const path of inMap) {
    if (!expected.has(path)) {
      fail(
        `sitemap.xml lists "${path}", which dist does not serve. Handing a crawler a 404 on ` +
          `purpose is worse than omitting the URL.`
      );
    }
  }
  if (locs.length !== inMap.size) {
    fail(`sitemap.xml has ${locs.length} <loc> entries but only ${inMap.size} distinct URLs.`);
  }
}

/* ── 4. robots.txt agrees with it ───────────────────────────────────────── */

const robotsFile = join(DIST, "robots.txt");
if (!existsSync(robotsFile)) {
  fail("dist/robots.txt was not built.");
} else {
  const text = readFileSync(robotsFile, "utf8");
  const sitemapLine = /^Sitemap:\s*(\S+)\s*$/m.exec(text);
  if (!sitemapLine) {
    fail("robots.txt has no Sitemap: line.");
  } else if (sitemapLine[1] !== `${ORIGIN}/sitemap.xml`) {
    fail(
      `robots.txt points at "${sitemapLine[1]}" but the site is ${ORIGIN}. A Sitemap: line on ` +
        `the previous domain is the quietest way to publish a sitemap nobody reads.`
    );
  }
  const disallowed = [...text.matchAll(/^Disallow:\s*(\S+)\s*$/gm)].map((m) => m[1]).sort();
  const wanted = [...NOT_CRAWLED].sort();
  if (disallowed.join(" ") !== wanted.join(" ")) {
    fail(
      `robots.txt disallows [${disallowed.join(", ")}]; the built paths that are not content are ` +
        `[${wanted.join(", ")}]. Change src/pages/robots.txt.ts, or NOT_CRAWLED in this file if ` +
        `the site really did grow a new non-content prefix.`
    );
  }
  for (const path of listedPages.map(([p]) => p)) {
    const blocked = disallowed.find((rule) => path.startsWith(rule));
    if (blocked) {
      fail(`robots.txt disallows "${blocked}", which blocks "${path}" — a page in the sitemap.`);
    }
  }
}

/* ── 5 & 6. the cards exist, and they are not pictures of old numbers ───── */

const rendered = {};
for (const card of OG_CARDS) {
  const page = join(DIST, "og", card.key, "index.html");
  if (!existsSync(page)) {
    fail(`og/${card.key}: no rendered card at dist/og/${card.key}/index.html.`);
    continue;
  }
  const text = cardText(readFileSync(page, "utf8"));
  if (!text) {
    fail(`og/${card.key}: the rendered card has no <body>.`);
    continue;
  }
  rendered[card.key] = text;

  if (!usedCards.has(ogCardPath(card.key))) {
    fail(
      `og/${card.key}: OG_CARDS declares this card and it renders, but no page names ` +
        `${ogCardPath(card.key)} as its og:image. Either a section lost its pages or the card ` +
        `is left over.`
    );
  }
}

if (process.argv.includes("--cards")) {
  const corpus = JSON.parse(readFileSync(CORPUS, "utf8"));
  const manifest = {
    /* Which corpus the pictures were taken from. Not used by the check — the
       text comparison is what actually catches staleness — but it is the first
       thing anyone reading a red gate wants to know. */
    corpusGeneratedAtUtc: corpus.generatedAtUtc,
    cards: Object.fromEntries(
      OG_CARDS.map((card) => [card.key, { png: ogCardPath(card.key), text: rendered[card.key] }])
    )
  };
  writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(
    `seo: wrote src/data/og-cards.json for ${OG_CARDS.length} card(s) from a corpus harvested ` +
      `${corpus.generatedAtUtc}. Commit it with the PNGs.`
  );
  if (problems.length > 0) {
    console.error(`\nseo: ${problems.length} problem(s) remain:\n  ${problems.join("\n  ")}`);
    process.exit(1);
  }
  process.exit(0);
}

if (!existsSync(MANIFEST)) {
  fail("src/data/og-cards.json is missing. Take the cards, then `npm run seo:cards`.");
} else {
  const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
  const known = new Set(Object.keys(manifest.cards));
  for (const card of OG_CARDS) {
    const recorded = manifest.cards[card.key];
    known.delete(card.key);
    if (!recorded) {
      fail(`og-cards.json has no entry for "${card.key}". Re-take the cards and run seo:cards.`);
      continue;
    }
    if (rendered[card.key] && recorded.text !== rendered[card.key]) {
      fail(
        `og/${card.key} is stale. The PNG in public/og was taken from a corpus harvested ` +
          `${manifest.corpusGeneratedAtUtc}, and the card renders differently now:\n` +
          `    was: ${recorded.text}\n` +
          `    now: ${rendered[card.key]}\n` +
          `    The picture in circulation still shows the old figures. Re-take the four ` +
          `screenshots — docs/OG-CARDS.md.`
      );
    }
  }
  for (const leftover of known) {
    fail(`og-cards.json records a card "${leftover}" that OG_CARDS no longer declares.`);
  }
}

/* ── the verdict ────────────────────────────────────────────────────────── */

if (problems.length > 0) {
  console.error(`seo: ${problems.length} problem(s).\n  ${problems.join("\n  ")}`);
  process.exit(1);
}

console.log(
  `seo: ${ORIGIN} — ${publicPages.length} public page(s) all carry their own canonical, og:url ` +
    `and og:image; the sitemap lists exactly the ${listedPages.length} crawlable one(s); ` +
    `robots.txt disallows only [${NOT_CRAWLED.join(", ")}]; and ${OG_CARDS.length} social ` +
    `card(s) at 1200×630 still render the text their PNGs were taken from.`
);
