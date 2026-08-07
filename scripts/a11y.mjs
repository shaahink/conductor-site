/* The accessibility gate: the structural half, recomputed from `dist/`.
   ---------------------------------------------------------------------------
   Accessibility on a static site splits cleanly in two, and the split is worth
   naming because it decides what can be a gate at all.

   The *rendered* half — contrast ratios, focus rings, what actually moves when
   the theme flips — needs a browser, and this repo checks it with one: a
   Lighthouse pass in each scheme and a layout-shift trace, run by hand and
   filed in `docs/evidence`. That is a measurement, not a gate; it happens when
   somebody remembers.

   The *structural* half does not need a browser at all. A skip link whose
   target id does not exist, a page that lost its `<main>`, a `lang` that went
   missing, a button that renders as an unlabelled square to a screen reader —
   every one of those is a fact about the built HTML, and every one of them is
   invisible in a browser to anyone not using the thing it breaks. Those are
   what this file holds, so that the parts a keyboard reader depends on cannot
   quietly regress between Lighthouse runs.

       node scripts/a11y.mjs           # npm run a11y

   Seven things:

   1. **`lang`.** A screen reader picks its voice from it; without one it
      guesses, and a guess is a page read in the wrong language.
   2. **One `<main>`, and it has an id.** The landmark a reader jumps to, and
      the thing the skip link needs a name for.
   3. **The skip link works.** It is the first link in the body, it has text,
      and its `#target` is an id that exists *on that page*. A skip link
      pointing at nothing is silent in every browser — it takes focus, does
      nothing, and the reader is left where they were.
   4. **The other landmarks.** `<header>`, a labelled `<nav>`, `<footer>`.
      Labelled because "navigation" twice over is a list a reader cannot tell
      apart.
   5. **Every control has a name.** An `<a>` or `<button>` with no text and no
      `aria-label` is announced as "link" or "button" and nothing else.
   6. **Every image has `alt`.** Including the empty one, which is a decision;
      a missing attribute is the absence of a decision.
   7. **No positive `tabindex`.** It does not add anything to the tab order, it
      *reorders* it — usually away from the reading order, and always in a way
      the next person to add an element will not know about.

   Runs against `dist/`, so it goes after `npm run build`. No dependencies: it
   parses the handful of tags it needs rather than pulling in a DOM, the same
   way `scripts/seo.mjs` does. */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const DIST = join(ROOT, "dist");

const problems = [];
const fail = (message) => problems.push(message);

if (!existsSync(DIST)) {
  console.error("a11y: no dist/. Run `npm run build` first — this gate reads the built output.");
  process.exit(1);
}

/** Every built HTML file, as [served path, absolute file path]. Same walk as
    the SEO gate's, and the same reason for the 404 special case: `build.format`
    is "directory", so `foo/index.html` is served at `/foo/`. */
function builtPages() {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".html")) {
        const rel = relative(DIST, full).split(sep).join("/");
        out.push([rel === "404.html" ? "/404" : `/${rel.replace(/index\.html$/, "")}`, full]);
      }
    }
  };
  walk(DIST);
  return out.sort(([a], [b]) => a.localeCompare(b));
}

/* `/edit/` is the kit's page, injected by `editorRoute()` and not this repo's
   code to fix (AGENTS.md). `/og/` is a rendering surface for the social cards:
   1200×630 pictures that are screenshotted once and served as PNGs, with no
   reader, no keyboard and no tab order. Neither is a page anybody browses, and
   holding them to a skip link would be a gate about nothing. */
const NOT_A_PAGE = ["/edit/", "/og/"];

const pages = builtPages().filter(([path]) => !NOT_A_PAGE.some((prefix) => path.startsWith(prefix)));

if (pages.length === 0) {
  console.error("a11y: dist/ holds no readable pages. Something is wrong with the build, not with this gate.");
  process.exit(1);
}

/** The body, so a `<link>` in the head is never mistaken for the first link on
    the page. Falls back to the whole document rather than throwing, so a page
    built without a `<body>` tag fails a real check below instead of this one.

    Comments come out first, and they have to: Astro keeps `<!-- -->` in the
    output, and this gate found its own author's prose — a comment in
    `Base.astro` explaining the skip link, which mentions `<main>` — and
    reported every page as having two of them. A commented-out element is not
    in the DOM, so it is not this gate's business either. */
const bodyOf = (html) => {
  const match = /<body[^>]*>([\s\S]*)<\/body>/.exec(html);
  return (match ? match[1] : html).replace(/<!--[\s\S]*?-->/g, "");
};

/** Text a reader would hear, with tags and entities out of the way. */
const textOf = (markup) =>
  markup
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Every id on the page, for the skip link's target. */
const idsIn = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

const named = (attrs, inner) =>
  /\saria-label="[^"]+"/.test(attrs) ||
  /\saria-labelledby="[^"]+"/.test(attrs) ||
  /\stitle="[^"]+"/.test(attrs) ||
  textOf(inner).length > 0 ||
  /<img[^>]+alt="[^"]+"/.test(inner);

let controls = 0;
let images = 0;

for (const [path, file] of pages) {
  const html = readFileSync(file, "utf8");
  const body = bodyOf(html);
  const at = (message) => fail(`${path}: ${message}`);

  /* 1 — lang */
  const lang = /<html[^>]*\slang="([^"]*)"/.exec(html);
  if (!lang || !lang[1].trim()) at("<html> has no lang. A screen reader has to guess the language.");

  /* 2 — one main, with an id */
  const mains = [...body.matchAll(/<main([^>]*)>/g)];
  if (mains.length !== 1) {
    at(`has ${mains.length} <main> element(s), want exactly 1 — the landmark a reader jumps to.`);
  } else if (!/\sid="([^"]+)"/.test(mains[0][1])) {
    at("<main> has no id, so the skip link has nothing to name.");
  }

  /* 3 — the skip link, first in the body and pointing at something real */
  const links = [...body.matchAll(/<a\s([^>]*)>([\s\S]*?)<\/a>/g)];
  const first = links[0];
  if (!first) {
    at("has no links at all in its body — including the skip link.");
  } else {
    const href = /\shref="([^"]*)"/.exec(first[1]);
    const target = href && href[1].startsWith("#") ? href[1].slice(1) : null;
    if (!target) {
      at(
        `the first link in the tab order is \`${href ? href[1] : "(no href)"}\`, not a skip link. ` +
          "A reader on a keyboard walks the whole top bar on every page."
      );
    } else {
      if (!textOf(first[2])) at("the skip link has no text, so it is announced as an empty link.");
      const ids = idsIn(body);
      if (!ids.has(target)) {
        at(`the skip link points at #${target}, and no element on this page has that id. It takes focus and does nothing.`);
      }
    }
  }

  /* 4 — the other landmarks */
  if (!/<header[\s>]/.test(body)) at("has no <header> landmark.");
  if (!/<footer[\s>]/.test(body)) at("has no <footer> landmark.");
  const navs = [...body.matchAll(/<nav([^>]*)>/g)];
  if (navs.length === 0) at("has no <nav> landmark.");
  for (const [, attrs] of navs) {
    if (!/\saria-label="[^"]+"/.test(attrs) && !/\saria-labelledby="[^"]+"/.test(attrs)) {
      at("has an unlabelled <nav>. Two navigations announced as 'navigation' cannot be told apart.");
    }
  }

  /* 5 — every control has a name */
  for (const [, attrs, inner] of links) {
    controls += 1;
    if (!named(attrs, inner)) at(`has a link with no accessible name: <a ${attrs.trim()}>`);
  }
  for (const [, attrs, inner] of body.matchAll(/<button\s([^>]*)>([\s\S]*?)<\/button>/g)) {
    controls += 1;
    if (!named(attrs, inner)) at(`has a button with no accessible name: <button ${attrs.trim()}>`);
  }

  /* 6 — every image decides about alt */
  for (const [, attrs] of body.matchAll(/<img([^>]*)>/g)) {
    images += 1;
    if (!/\salt="/.test(attrs)) at(`has an <img> with no alt attribute: <img ${attrs.trim()}>`);
  }

  /* 7 — no positive tabindex */
  for (const [, value] of body.matchAll(/\stabindex="([^"]*)"/g)) {
    if (Number(value) > 0) at(`sets tabindex="${value}", which reorders the tab order away from the reading order.`);
  }
}

if (problems.length) {
  console.error(`a11y: ${problems.length} problem(s) across ${pages.length} page(s).\n`);
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error("");
  process.exit(1);
}

console.log(
  `a11y: ${pages.length} readable page(s) each carry a lang, one identified <main>, a working skip link ` +
    `as their first link, and header/nav/footer landmarks; ${controls} control(s) have an accessible name, ` +
    `${images} image(s) declare alt, and no page reorders the tab order. ` +
    "NOT CHECKED here: contrast, focus visibility and layout shift, which need a browser — " +
    "see docs/evidence for the Lighthouse and trace runs."
);
