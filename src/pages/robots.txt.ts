/* robots.txt, generated so the sitemap URL tracks astro.config's `site`.

   Three disallows, and each is a path that exists and is not content:

   - `/api/` is the feedback and editor machinery.
   - `/edit` is the owner's editor, behind Google sign-in, with nothing public
     on it. A site that builds with format "file" serves it at /edit.html and
     must say that here instead.
   - `/og/` is where the social cards are rendered so they can be
     screenshotted (src/pages/og/[card].astro). What gets shared is the PNG in
     /og/*.png, which is an image and is not affected by this line; the pages
     behind it are a rendering surface and would read, to a crawler, as four
     near-empty duplicates of pages it already has.

   The same three are the only things missing from the sitemap, and
   `scripts/seo.mjs` checks that the two lists agree — a page disallowed here
   but listed there is the contradiction neither file shows on its own. */

import type { APIRoute } from "astro";
import { absolute, robots } from "@shaahink/sitekit/seo";

export const GET: APIRoute = ({ site }) =>
  new Response(
    robots({ sitemap: absolute(site!, "/sitemap.xml"), disallow: ["/api/", "/edit", "/og/"] }),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
