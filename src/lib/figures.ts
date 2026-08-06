/* The site's first rule, applied to prose.
   ---------------------------------------------------------------------------
   SPEC Part I, litmus test 1: if a figure appears on this site, the evidence
   gate must be able to recompute it from the run store. `evidenceKey` in
   src/content/schema.ts enforces that for the `evidence` field — a key can be
   named, a value cannot. But nothing stops a writer in a hurry from putting
   the number in the sentence instead, and that is the easier mistake to make,
   because it is what writing normally looks like.

   A typed figure is worse than a wrong one. It is right on the day it is
   written and silently stale afterwards, it looks identical to a figure that
   came from the corpus, and it is the exact claim a reader of this site is
   being invited to check. So the shapes a figure takes are refused in prose,
   and the writer has to name a key and let the strip render it.

   This is a shape check, not a semantic one, and the gap is worth stating: a
   single-digit count in a sentence ("7 owner approvals") is not caught, because
   a single digit is also how a version number and a part number are written and
   the false positives would make the gate unusable. Two digits and up, anything
   with a currency sign, a percent, a multiplier, a ratio, a decimal point or a
   thousands separator — those are refused. What is left uncaught is small, and
   naming it here is cheaper than pretending it is not there.

   No Astro import: src/lib/collections.ts calls this inside the build, and
   test/collections.test.mjs imports it directly. */

/** The shapes a figure takes, each named so the failure says which one fired. */
const shapes: { name: string; pattern: RegExp }[] = [
  /* Each pattern matches the WHOLE literal, not just enough of it to detect
     one: the failure prints what it matched, and "a percentage (3%)" pointing
     at 23% sends the writer looking for a number that is not there. */
  { name: "a currency amount", pattern: /[$€£¥]\s?\d[\d,]*(?:\.\d+)?/ },
  { name: "a percentage", pattern: /\d[\d,]*(?:\.\d+)?\s?%/ },
  { name: "a multiplier", pattern: /\b\d+(?:\.\d+)?\s?x\b/i },
  { name: "a ratio", pattern: /\b\d+\s*\/\s*\d+\b/ },
  { name: "a decimal", pattern: /\b\d[\d,]*\.\d/ },
  { name: "a thousands-separated number", pattern: /\b\d{1,3}(?:,\d{3})+\b/ },
  { name: "a count of two digits or more", pattern: /\b\d{2,}\b/ }
];

/** Every figure-shaped literal in one string, named by shape. */
export function figuresIn(text: string): string[] {
  return shapes
    .filter(({ pattern }) => pattern.test(text))
    .map(({ name, pattern }) => `${name} (${text.match(pattern)![0]})`);
}

/* Paths whose digits are not figures and never reach a reader as one: a
   command has a session number in it, a citation names a source file, and a
   canonical is a URL. Everything else in an entry is a sentence somebody
   reads. Spelled as the form model spells them, with the index generalised. */
const notProse = [
  /^tryIt\[\d+\]\.command$/,
  /^inConductor\.citations\[\d+\]\.path$/,
  /^meta\.(canonical|ogImage|ogType)$/,
  /^slug$/,
  /^evidence\./
];

/** Every string in an entry that a reader sees, as [path, text]. */
export function proseOf(data: unknown, path = ""): [string, string][] {
  if (typeof data === "string") {
    return notProse.some((skip) => skip.test(path)) ? [] : [[path, data]];
  }
  if (Array.isArray(data)) {
    return data.flatMap((item, index) => proseOf(item, `${path}[${index}]`));
  }
  if (data && typeof data === "object") {
    return Object.entries(data).flatMap(([key, value]) =>
      proseOf(value, path ? `${path}.${key}` : key)
    );
  }
  return [];
}

/** Throws naming the field, the shape and the literal, or returns quietly. */
export function refuseTypedFigures(label: string, data: unknown): void {
  for (const [path, text] of proseOf(data)) {
    const found = figuresIn(text);
    if (found.length === 0) continue;
    throw new Error(
      `${label}: ${path} types ${found.join(" and ")} into the prose. Every figure on this ` +
        `site is recomputed from the run store — name a key in \`evidence.figures\` and let the ` +
        `evidence strip render it, so it cannot go stale while the sentence still reads fine.`
    );
  }
}
