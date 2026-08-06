# conductor-site

**A field guide to agentic engineering** — ten concepts the market is hiring for, each one worked
end to end in a real orchestrator, with what it cost.

The site explains concepts, not a product. Each concept page states the idea in plain language
you can use anywhere, then shows how [Conductor](https://github.com/shaahink/conductor)
implements it, then points at a real run and what it cost.
[Conductor](https://github.com/shaahink/conductor) is the worked example and the evidence — not
the pitch.

> **Status:** under construction. Built by Conductor driving this repo — see
> [`TRACKER.md`](TRACKER.md) for live progress and [`docs/SPEC.md`](docs/SPEC.md) for what it is
> meant to become.

## What is on it

| Section | What |
| --- | --- |
| `/concepts` | Ten concepts — agentic engineering, multi-agent orchestration, context engineering, token economics, evals and gates, independent verification, durable execution, human-in-the-loop, agent observability, agent memory |
| `/articles` | Four longer pieces, each carrying at least one number nobody else publishes |
| `/runs` | Anonymised reports from real autonomous runs, and the corpus they come from |

## The rule that shapes everything

**No figure is ever typed into content.** A page names an evidence *key*; the value is read from
`src/data/corpus.json`, which `scripts/harvest.mjs` recomputes from Conductor's run store. A page
citing a key that is not in the corpus fails the build, and the `evidence` gate goes red when the
corpus is stale.

That is the site keeping its own first rule: every number is traceable, or it does not ship.

The reports are **generalised into scenarios** — "a four-site web fleet with a shared component
library" rather than a client's name. That is for the reader as much as for privacy: you should be
able to map your own situation onto a report. Runs absent from `anonymise.json` are excluded, never
published under their real name.

## Development

```bash
npm install
npm run dev          # local dev server
npm run check        # astro check — must be 0 errors
npm run build        # must be green
npm run headers      # regenerate vercel.json from headers.config.mjs
npm run content      # normalise src/content
npm run editor       # copy the editor stylesheets into public/
```

Built on [Astro](https://astro.build) 7 and [`@shaahink/sitekit`](https://github.com/shaahink/sitekit),
the shared machinery behind the `sk` site fleet.

## Licence

Content © Shahin Kiassat. Code MIT — see [LICENSE](LICENSE).
