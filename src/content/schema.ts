/* The content model. Everything an owner might one day edit lives in
   src/content as YAML, validated by these schemas — the editor generates
   itself from them, so shape each field for that: strings the owner would
   recognise, numbers only where the layout needs them.

   This file starts with one page collection as the pattern. Grow it to match
   the content the site actually has — not the CMS you can imagine
   (sessions/03-astro-pilot.md in shaahink/drydock, "Schema overreach").

   **Zod is the only import here, and that is the point.** content.config.ts
   wraps these in defineCollection() for the build; api/content.ts imports them
   directly for the editor. That second path is why the split exists:
   `astro:content` and `astro/loaders` are virtual modules that exist only
   inside Astro's build, and a site is a static build plus plain Vercel
   functions — a function can never import them. Keep this file free of
   anything Astro-shaped.

   That includes `image()`. If the site puts images through astro:assets, the
   validator only exists inside the build, so take the image type as a generic
   parameter and instantiate the schema twice — with `image()` in
   content.config.ts, with `z.string()` here. Generic, not `() => z.ZodType`: a
   widened return type erases ImageMetadata and every component reading
   `.width` off the parsed value stops typechecking. nimagiti does this; see
   its src/content/schema.ts.

   Bilingual sites keep one schema and per-locale entries — home.en.yaml and
   home.fr.yaml, looked up as `home.${locale}`. Pass generateId to the glob
   loader for dotted names: the default id generator slugs "home.fr" into
   "homefr" (elfine, session 4). Give each entry a name in `entryLabels` below,
   because "home.fr" only reads as "the French page" to someone who already
   knows.

   Localized alt texts and aria labels are content too — the French page
   describes photographs in French. */

import { z } from "zod";

/** Per-page <head> facts. og fields feed the social cards. */
export const meta = z.object({
  title: z.string(),
  description: z.string(),
  ogType: z.string().default("website"),
  ogDescription: z.string(),
  ogImage: z.string().optional(),
  canonical: z.string()
});

/* Name a field with `.meta({ title })` wherever its key is not already a word
   the owner would use. This is not cosmetic: the inline editor puts the label
   in the bar as "Changing {label}" while they type, and that sentence is the
   whole of what tells them which piece of text they have their finger on. A
   key like `p1`, `sub`, `cta` or `fa` produces "Changing P1" — a programmer's
   shorthand handed to a client. The keys themselves stay as they are, because
   they are what the YAML files spell. */
/** Whether a section is on the site.
    ---------------------------------------------------------------------------
    Put it on the sections that can genuinely come and go, and *only* on those.
    PLAN §3.9 draws the line here: whether a section the designer built appears
    at all is content and therefore the owner's; creating one, moving one, or
    changing how it looks is still a content-request issue.

    Deciding the list is per-site work, and it is judgement rather than a
    default. A hero, an about block and a contact block are what a page *is*; a
    seasonal offer, a gallery, a set of collaborators, anything advertising
    something that might end — those are what an owner wants a switch for.

    Defaulting to true means no content file needs changing and a section
    *without* the field simply cannot be hidden, which is the safe answer for
    anything structural. The editor lifts it out of the form and draws it as a
    switch at the head of the section, so it never sits among the words.

    It is on `notes` below so the pattern is here and working. Delete that
    section or keep it; keep the shape either way. */
export const visible = z.boolean().default(true);

/** A picture.
    ---------------------------------------------------------------------------
    **Spell it exactly like this and the owner gets a photo picker for free.**
    The kit recognises a picture from its shape — a `src` string beside `w` and
    `h` integers — rather than from anything a site declares, so a new site
    inherits the picker by following the convention. Choosing a photograph
    scales it in the browser, writes the file and both sizes, and holds Save
    until `alt` has been written.

    `w`/`h` belong in `omit` below. They are structure wearing a number's
    clothing and the layouts depend on them; omitting them hides them from the
    form, not from the picker, which reads this schema.

    Two shapes the picker cannot serve, and both exist in the fleet: images
    behind `astro:assets` (nimagiti), where the YAML holds a path Astro
    resolves inside the build; and pre-built responsive variants (elfine),
    where a new photograph would need a `srcset` of several files that do not
    exist yet. Either is a fine choice — `omit` the image field and leave new
    photographs to a content-request issue — but if the site can use this
    shape, use this shape. */
export const picture = z.object({
  src: z.string(),
  alt: z.string().default(""),
  w: z.number().int().positive(),
  h: z.number().int().positive()
});

export const homePageSchema = z.object({
  meta,
  hero: z.object({
    title: z.string(),
    tagline: z.string().meta({ title: "Tagline under the title" })
  }),
  /* A section that can be turned off — the working example of the pattern.
     index.astro renders it through `isVisible`, and a site that grows a nav
     filters that nav's links through `visibleOnly`. */
  notes: z.object({
    visible,
    title: z.string(),
    body: z.string().meta({ title: "The paragraph" })
  })
});

/* ---------------------------------------------------------------------------
   This site's own three collections (SPEC Part III).

   `concepts` is the spine: ten pages, each the same five moves — the idea, the
   problem, the mechanism in Conductor, the evidence, something to try.
   `articles` and `reports` are long-form, and a report is an article with a
   generalised scenario label on the front of it.
   --------------------------------------------------------------------------- */

/** A run of prose.
    ---------------------------------------------------------------------------
    An array rather than one string with blank lines in it, and the reason is
    the editor: the panel draws one box per element, so a writer moves a
    paragraph by moving a row instead of hunting for the right newline in a
    textarea the height of a phone. It is also what makes `data-sk-edit` able
    to name a single paragraph — `theIdea[1]` — rather than the whole block.

    The bounds are the shape of the page, not a style opinion. SPEC Part III
    says the idea is three to six paragraphs; a two-paragraph idea has not been
    explained and a nine-paragraph one is the article that concept should have
    been. */
const paragraphs = (min: number, max: number) =>
  z.array(z.string().min(1)).min(min).max(max);

/** A pointer into `shaahink/conductor`, which is public and therefore citable.
    ---------------------------------------------------------------------------
    `path` and `line` together are the claim — "the mechanism is here" — and
    `note` is what a reader is meant to see when they arrive. S4.4 re-verifies
    every one of these against a named commit, because a line number is the
    most perishable fact on the site. */
export const citation = z.object({
  path: z.string(),
  line: z.number().int().positive(),
  note: z.string()
});

/** An evidence KEY. Never a value.
    ---------------------------------------------------------------------------
    This regex is the mechanism behind the site's first litmus test. Content
    names a key; `src/data/corpus.json` — recomputed from the run store by the
    harvest — carries the number. A figure that cannot be typed cannot drift,
    and a page naming a key the corpus does not have fails the build (S3.3).

    Enforcing it here rather than trusting the comment above it matters,
    because the failure mode is a writer in a hurry doing the obvious thing.
    Every literal they might reach for is refused by shape: a key cannot start
    with a digit (`3016.29`, `18`), cannot carry currency or percent signs
    (`$425.12`, `30%`), and has no spaces or slashes (`18 runs`, `72/81`).
    What passes is an identifier: `softBreaks`, `rollovers`, `fleet-round-four`. */
export const evidenceKey = z
  .string()
  .regex(
    /^[a-z][A-Za-z0-9]*(?:[.-][A-Za-z0-9]+)*$/,
    "evidence names a key from the corpus, never a value"
  );

/** What a page cites: runs by their published label, figures by name. */
export const evidence = z.object({
  runs: z.array(evidenceKey).default([]),
  figures: z.array(evidenceKey).default([])
});

/** A heading and the prose under it. Long-form pages are a list of these, and
    the list is also what the in-page table of contents is built from. */
export const section = z.object({
  heading: z.string(),
  body: paragraphs(1, 12)
});

/** A concept page: the five moves, in order (SPEC Part III).
    ---------------------------------------------------------------------------
    `theIdea` comes first and mentions Conductor nowhere. That ordering is the
    third litmus test made structural — delete `inConductor` from an entry and
    what is left must still be worth reading, which is only true if the idea
    was written for a reader who has never heard of the tool. */
export const conceptSchema = z.object({
  meta,
  /* The file name is already the URL. This repeats it inside the file so a
     renamed file is caught by a test rather than silently re-routing a page
     that other entries link to by slug. */
  slug: z.string(),
  /** Reading order across the whole spine, which is also the nav order. */
  order: z.number().int().positive(),
  title: z.string(),
  /** The market's other names for the same idea — the words in the job ads.
      A reader who searched for "prompt engineering at scale" should find the
      page that answers it under a different heading. */
  alsoKnownAs: z.array(z.string()).default([]).meta({ title: "Also known as" }),
  oneLine: z.string().meta({ title: "The one-line summary" }),
  theIdea: paragraphs(3, 6).meta({ title: "The idea, with no Conductor in it" }),
  theProblem: paragraphs(1, 4).meta({ title: "What goes wrong without it" }),
  inConductor: z
    .object({
      mechanism: paragraphs(1, 4),
      citations: z.array(citation).min(1)
    })
    .meta({ title: "How Conductor does it" }),
  evidence,
  tryIt: z
    .array(z.object({ command: z.string(), note: z.string() }))
    .min(1)
    .max(3)
    .meta({ title: "Something the reader can run" }),
  /* Slugs of other concepts. Empty is allowed while the spine is being
     written; S2.2 adds the check that a non-empty one resolves to a real
     entry and fails the build when it does not. */
  readNext: z.array(z.string()).default([]).meta({ title: "Read next" })
});

/** A long-form piece (SPEC Part V). A standfirst and titled sections. */
export const articleSchema = z.object({
  meta,
  slug: z.string(),
  order: z.number().int().positive(),
  title: z.string(),
  standfirst: z.string().meta({ title: "The standfirst under the title" }),
  evidence,
  sections: z.array(section).min(1),
  readNext: z.array(z.string()).default([]).meta({ title: "Read next" })
});

/** A run report (SPEC Part VI).
    ---------------------------------------------------------------------------
    Same shape as an article plus `scenario`, and that extra field is the whole
    anonymisation rule wearing a schema's clothing: a report is published as a
    situation a stranger can map onto their own, never as the run it was. The
    rule is not enforced here — no regex knows a client's name — it is enforced
    by S6.1's grep over the built output and by the harvest failing closed on a
    run with no entry in `anonymise.json`. */
export const reportSchema = articleSchema.extend({
  scenario: z.string().meta({ title: "The published scenario label" })
});

/** A section of the site: the page that lists one collection.
    ---------------------------------------------------------------------------
    Three entries, one per section, and they are what the top bar is built
    from — so a section that exists and a section that is linked cannot
    disagree, which is what TopBar.astro's own comment asked for.

    It exists at all because of a failure this repo has already had: the footer
    printed a placeholder on every page for three sessions, and nothing caught
    it, because `checkPlaceholders` reads the `editable` map and a sentence
    written into a component is invisible to it. Index-page copy is copy. It
    goes in content, where the gate can see it.

    `meta.canonical` is the section's URL and the nav's href — one fact in one
    place rather than a `href` field that can drift away from the canonical the
    same page publishes. */
export const sectionPageSchema = z.object({
  meta,
  /** Which collection this page lists. */
  collection: z.enum(["concepts", "articles", "reports"]),
  /** Left-to-right order in the top bar. */
  order: z.number().int().positive(),
  navLabel: z.string().meta({ title: "Label in the top bar" }),
  title: z.string(),
  standfirst: z.string().meta({ title: "The standfirst under the title" })
});

/* Which YAML file backs which collection, for the editor.
   ---------------------------------------------------------------------------
   Astro's loaders know this too, but only inside the build — the handler needs
   it as plain data. `file` is a collection of exactly one entry; `dir` is one
   file per entry, and `entryLabels` names them.

   `omit` is what an owner should not be able to break from a form: image pixel
   sizes the layout depends on, `srcset` strings, `order` numbers. Anything that
   is structure wearing a value's clothing. Array items are spelled the way the
   form model spells them — `images[].w`, not `images[0].w` — and omitting a
   whole object is usually better than omitting its leaves, or the panel shows
   an empty box with its label still on it. */
export const editable = {
  homePage: {
    label: "Home page",
    schema: homePageSchema,
    file: "src/content/pages/home.yaml",
    /* Where this entry can be seen on the site, so the panel can offer to go
       and edit it on the page itself. It is the only route to inline editing
       that does not involve typing `?edit=1` onto the end of a URL, which is
       to say the only one that exists on a phone — so give every entry one.

       "/" because this template builds with format "directory"; a site with
       format "file" says "/index.html". A directory collection takes a
       pattern instead: entryUrl: "/projects/{entry}". Only site-relative
       paths; the kit drops anything else. */
    entryUrl: "/"
    // omit: ["hero.image.w", "hero.image.h"]
  },

  /* The three collections below are `dir` rather than `file`: one YAML per
     entry, and the file name is the entry id and the URL segment both.

     No `entryLabels`. It exists for ids that do not read as their own name —
     `home.fr` is the case it was built for — and these are already sentences:
     an owner scanning `context-engineering`, `what-a-run-costs` and
     `the-fleet-round` knows which is which. A hand-kept label per entry would
     be a second copy of `title` that goes stale on the day someone renames one
     and not the other.

     `omit` is the same judgement everywhere here: `slug` and `order` are
     structure wearing a value's clothing — `order` is the reading order of the
     spine and the nav, and `slug` is the URL. `evidence` is omitted whole
     rather than by its leaves, because it is not prose at all: those strings
     are keys into the corpus, and an owner who edits one does not get a
     different number, they get a build that fails. Same for the citations —
     `path` and `line` are a claim about someone else's source file, verified
     against a named commit at S4.4, and a form is the wrong place to change
     one. The prose beside them stays editable. */
  /* The three section pages. `entryUrl` is a map rather than a pattern here,
     because a section's URL is not its id — `reports` lives at `/runs/`, since
     a reader looking for what a run cost is not looking for a report. */
  sectionPages: {
    label: "Section pages",
    schema: sectionPageSchema,
    dir: "src/content/sections",
    entryUrl: { concepts: "/concepts/", articles: "/articles/", runs: "/runs/" },
    omit: ["collection", "order"]
  },

  concepts: {
    label: "Concepts",
    schema: conceptSchema,
    dir: "src/content/concepts",
    entryUrl: "/concepts/{entry}",
    omit: ["slug", "order", "evidence", "inConductor.citations"]
  },

  articles: {
    label: "Articles",
    schema: articleSchema,
    dir: "src/content/articles",
    entryUrl: "/articles/{entry}",
    omit: ["slug", "order", "evidence"]
  },

  reports: {
    label: "Run reports",
    schema: reportSchema,
    dir: "src/content/reports",
    entryUrl: "/runs/{entry}",
    omit: ["slug", "order", "evidence"]
  }
};
