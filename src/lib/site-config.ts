/**
 * Edit these values for your site. SITE_URL is the single source of truth
 * for all canonical URLs, Open Graph, and sitemap entries.
 *
 * Rules (see seo-guardrails.md):
 * 1. Every canonical, Open Graph URL, sitemap entry, and RSS feed URL derives from SITE_URL.
 * 2. No hardcoded domain anywhere else in the codebase.
 * 3. canonicalFor() respects the site's trailing-slash policy so canonical tags
 *    always match the actual served URL.
 * 4. Every page.tsx MUST export a metadata object with an explicit
 *    `alternates.canonical: canonicalFor("/path")` and
 *    `openGraph.url: canonicalFor("/path")`. The root layout intentionally
 *    does NOT set a canonical so pages cannot silently inherit the homepage.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Your Site Name";
export const SITE_DESCRIPTION =
  "Participant-driven experiences that change how your team works. Built by Learn2.";

// Set to true if your site uses trailing slashes. Verify with a real deploy.
export const TRAILING_SLASH = false;
// TODO: Add an OG image at public/images/og-default.jpg (1200x630px recommended)
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;
export const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

/**
 * Build a canonical URL from a pathname. Applies the site's trailing-slash
 * policy. Pass in pathnames like "/", "/sell", or "/blog/foo".
 */
export function canonicalFor(pathname: string): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const withoutTrailing = normalized.replace(/\/+$/, "");

  if (withoutTrailing === "") {
    return TRAILING_SLASH ? `${SITE_URL}/` : SITE_URL;
  }

  return TRAILING_SLASH
    ? `${SITE_URL}${withoutTrailing}/`
    : `${SITE_URL}${withoutTrailing}`;
}

/**
 * Build an absolute URL for an asset path (e.g. an image). Does not apply
 * trailing-slash policy — used for file URLs, not page URLs.
 */
export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
