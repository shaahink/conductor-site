/* The site linking itself: the first mention of a concept becomes a link to it.
   ---------------------------------------------------------------------------
   The problem this solves is the one every growing site has. An article says
   "context budget" in its third paragraph; the concept page explaining context
   budgets is two clicks away and the reader never learns it exists. The usual
   answer is to write the links by hand, which works until there are forty pages
   and the person adding the forty-first does not know what the other thirty-nine
   say.

   So the links are derived instead. Every concept contributes its title and
   every name in its `alsoKnownAs` to a term index; every article and report
   contributes its title. Prose is run through `linkTerms`, and the first
   mention of any indexed term becomes a link to the page that owns it. Adding
   "prompt engineering at scale" to a concept's `alsoKnownAs` wires that phrase
   site-wide, in pages written before the concept existed.

   Five rules keep it from becoming a sea of blue, and each one is load-bearing:

   1. **Longest term first.** "context engineering" must not be matched as
      "context" with "engineering" left dangling beside it. The index is sorted
      by length descending and the scan takes the first hit, so the specific
      term always beats the general one.
   2. **Once per page, and counted by destination rather than by phrase.** A
      reader needs the link the first time they meet the idea. The fourth time
      it is noise, and by then they have either clicked it or decided not to.
      Counting by phrase is the version that looks right and is not: "exit code"
      and "exit codes" are two entries pointing at one page, and a paragraph
      that used both linked the same concept twice in three lines. What the
      reader is owed is one route to a page, not one route per spelling.
   3. **Never to the page you are on.** A concept page saying its own title is
      not offering to take you anywhere.
   4. **Whole words only.** "gates" must not match inside "delegates", and the
      Unicode-free `\b` is not enough on its own for terms that end in a
      hyphenated word, so the boundary is asserted on both sides explicitly.
   5. **Text is escaped first, then linked.** Content is plain text and the
      output is HTML, so this function is the boundary where one becomes the
      other. Escaping after linking would eat the anchors; not escaping at all
      would put an `&` in a paragraph through as an entity fragment.

   **The cost, stated plainly.** A paragraph that comes out of here with an
   anchor in it has element children, so `@shaahink/sitekit`'s inline editor
   moves it from edit-in-place to the side panel — its own `formatting` /
   "wraps other elements" branch, which exists for exactly this and is why the
   trade is acceptable. Nothing becomes uneditable; some paragraphs become
   editable in the panel rather than on the page. Rule 2 is what keeps that to a
   minority of them.

   Pure, and takes its index as an argument, so `test/links.test.mjs` can feed
   it a term list and assert each rule separately. */

/** A term the prose can mention, and where mentioning it should go. */
export interface Term {
  /** The phrase as it might be written. Matched case-insensitively. */
  text: string;
  /** Where it points. */
  href: string;
}

/** What one page needs to link its own prose. */
export interface LinkContext {
  /** The page's own href, so it never links to itself. */
  self?: string;
  /** Destinations already linked on this page — hrefs, not phrases. Mutated:
      pass one context per page, and the "once per page" rule holds across every
      paragraph on it. See rule 2 for why this counts pages and not spellings. */
  seen: Set<string>;
}

const ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};

/** Plain text as HTML text. See rule 5. */
export const escapeHtml = (text: string): string => text.replace(/[&<>"]/g, (c) => ESCAPE[c]!);

/* A word character for boundary purposes. Deliberately includes the digits and
   the hyphen, so "human-in-the-loop" does not match inside
   "human-in-the-loop-ish" and "gate" does not match inside "gates" — plurals
   are separate index entries when they are wanted, rather than a stemming rule
   nobody can predict the behaviour of. */
const WORDY = /[A-Za-z0-9-]/;

const isBoundary = (text: string, index: number): boolean =>
  index < 0 || index >= text.length || !WORDY.test(text[index]!);

/** Build the index once per build, sorted so the most specific term wins.
    ---------------------------------------------------------------------------
    Duplicates are dropped by first-wins after the sort, so two pages claiming
    the same phrase resolve to the longer-titled one rather than to whichever
    the collection happened to yield first — deterministic either way, which is
    what stops a link target moving between builds. */
export function buildIndex(terms: Term[]): Term[] {
  const byText = new Map<string, Term>();
  const sorted = [...terms].sort(
    (a, b) => b.text.length - a.text.length || a.text.localeCompare(b.text)
  );
  for (const term of sorted) {
    const key = term.text.toLowerCase();
    if (!byText.has(key) && term.text.trim()) byText.set(key, term);
  }
  return [...byText.values()];
}

/** One run of prose, escaped, with the first mention of each term linked.
    ---------------------------------------------------------------------------
    Returns an HTML string for `set:html`. The scan walks the text once and
    advances past whatever it matched, so a term can never be linked inside the
    text of a link it has already produced. */
export function linkTerms(text: string, index: Term[], context: LinkContext): string {
  let out = "";
  let i = 0;
  const lower = text.toLowerCase();

  while (i < text.length) {
    /* The longest term that matches here, disqualified or not — and finding it
       *before* asking whether it may be linked is what keeps rules 1 and 3 from
       fighting each other. A concept page whose title is "Context engineering"
       has that phrase disqualified by rule 3, and a scan that merely skipped it
       would fall through to the shorter "context" and link the first word of
       the page's own title to somewhere else, which is precisely the dangling
       fragment rule 1 exists to prevent. So a disqualified match consumes its
       span as plain text rather than yielding it to the runner-up. */
    let matched: { term: Term; length: number } | undefined;

    for (const term of index) {
      const key = term.text.toLowerCase();
      if (!lower.startsWith(key, i)) continue;
      if (!isBoundary(text, i - 1) || !isBoundary(text, i + key.length)) continue;
      matched = { term, length: key.length };
      break;
    }

    if (!matched) {
      out += escapeHtml(text[i]!);
      i += 1;
      continue;
    }

    const disqualified =
      context.seen.has(matched.term.href) ||
      (context.self !== undefined && matched.term.href === context.self);

    if (disqualified) {
      out += escapeHtml(text.slice(i, i + matched.length));
      i += matched.length;
      continue;
    }

    context.seen.add(matched.term.href);
    /* The reader's own words are kept, not the index's: an article that wrote
       "Context engineering" at the start of a sentence keeps its capital, and
       one that wrote the plural keeps the plural. The link is an addition to
       the prose, never a correction of it. */
    const surface = text.slice(i, i + matched.length);
    out += `<a class="term" href="${escapeHtml(matched.term.href)}">${escapeHtml(surface)}</a>`;
    i += matched.length;
  }

  return out;
}

/** A fresh context for one page. */
export const pageContext = (self?: string): LinkContext => ({ self, seen: new Set() });
