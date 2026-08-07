/* Do the citations still point at anything?
   ---------------------------------------------------------------------------
   A concept page's `inConductor.citations` is the site's second kind of claim:
   not "this number came from the store" but "this mechanism is at this line of
   somebody else's source file". It is the most perishable fact the site
   publishes — a refactor in the engine moves it and nothing here would notice,
   because a line number that has drifted still renders perfectly.

   So this reads every citation out of the content, opens the file it names in a
   checkout of `shaahink/conductor`, and prints the line it actually landed on.
   A human still has to read that output and decide whether the line means what
   the note says it means; the script only proves the target exists and shows
   what is there. It exits non-zero when a path is missing or a line is past the
   end of its file, which are the two failures no reading is needed for.

   The engine checkout is NOT configured in this repo. It is a path on whoever's
   machine is running this, and this repository is public — so it comes from
   CONDUCTOR_REPO, or from the sibling directory, and neither is written down
   anywhere a commit can carry it.

       node scripts/citations.mjs                     # sibling ../conductor
       CONDUCTOR_REPO=/path/to/conductor node scripts/citations.mjs

   Print the engine's commit alongside the output when using it as evidence:
   "resolves" is only a claim about one revision. */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..");
const contentDir = join(repoRoot, "src", "content");

const engineRepo = resolve(process.env.CONDUCTOR_REPO ?? join(repoRoot, "..", "conductor"));

/** Every citation any entry makes, as [entry, path, line, note]. */
function citations() {
  const found = [];
  for (const collection of ["concepts", "articles", "reports"]) {
    const dir = join(contentDir, collection);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort()) {
      const entry = parseYaml(readFileSync(join(dir, file), "utf8"));
      for (const cite of entry?.inConductor?.citations ?? []) {
        found.push({ where: `${collection}/${file.replace(/\.yaml$/, "")}`, ...cite });
      }
    }
  }
  return found;
}

/** The engine revision these are being checked against, or null outside a checkout. */
function engineHead() {
  try {
    return execFileSync("git", ["-C", engineRepo, "rev-parse", "--short", "HEAD"], {
      encoding: "utf8"
    }).trim();
  } catch {
    return null;
  }
}

const files = new Map();
const readLines = (path) => {
  if (!files.has(path)) {
    const full = join(engineRepo, path);
    files.set(path, existsSync(full) ? readFileSync(full, "utf8").split(/\r?\n/) : null);
  }
  return files.get(path);
};

const all = citations();
const head = engineHead();
let broken = 0;

console.log(`citations: ${all.length} across the content, against the engine checkout`);
console.log(`engine revision: ${head ?? "unknown — not a git checkout"}`);
console.log("");

let current = "";
for (const cite of all) {
  if (cite.where !== current) {
    current = cite.where;
    console.log(`── ${current}`);
  }
  const lines = readLines(cite.path);
  if (lines === null) {
    broken++;
    console.log(`   MISSING  ${cite.path}:${cite.line} — no such file in the checkout`);
    continue;
  }
  if (cite.line > lines.length) {
    broken++;
    console.log(
      `   PAST END ${cite.path}:${cite.line} — the file has ${lines.length} lines`
    );
    continue;
  }
  console.log(`   ok       ${cite.path}:${cite.line}`);
  console.log(`            | ${lines[cite.line - 1].trim()}`);
}

console.log("");
if (broken > 0) {
  console.error(
    `citations: ${broken} of ${all.length} do not resolve. A citation that points at nothing ` +
      `is worse than no citation — it reads as checked.`
  );
  process.exit(1);
}
console.log(`citations: all ${all.length} resolve at ${head ?? "this checkout"}.`);
