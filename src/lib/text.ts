/** An id for a heading that came from content rather than from markdown.
    ---------------------------------------------------------------------------
    Markdown pages get these from Astro's `getHeadings()`. This site's long-form
    pages are YAML, so the anchor and the table of contents entry are computed
    from the same string in the same place — call it once per heading and hand
    the result to both, never compute it twice and hope they agree.

    Deliberately narrow: lowercase, accents folded away, everything else to
    single hyphens. Anything a heading of English prose contains lands
    somewhere predictable, and two headings that differ only in punctuation
    collide — but two headings that differ only in punctuation are a content
    problem, and `ordered()` is not the place to catch it. */
export function slugify(heading: string): string {
  return heading
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
