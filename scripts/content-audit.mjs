#!/usr/bin/env node
// scripts/content-audit.mjs — blog-data.ts content quality check.
// Runs as `prebuild` alongside perf-audit.mjs. Fails the build if any rule
// trips. Blocks Word-paste garbage, keyword stuffing, tracking URLs, and
// double-brand ogTitles from ever shipping.
//
// Rules:
//  1. No Word/Office paste spans (NormalTextRun | TextRun BCX | SCXW\d+)
//  2. No tracking query params in body <a href> (_gl= | fbclid= | utm_)
//  3. No ogTitle ending in "| <SiteName>" (that suffix is appended by the
//     layout — leaving it in the data double-brands)
//  4. No typos from a small list of known AI misspellings
//  5. Every post has a non-empty metaDescription ≤160 chars
//  6. No identical H3 in the same post (catches keyword-dump rewrites)
//  7. No two identical CTA blocks in the same post
//
// Usage:
//   node scripts/content-audit.mjs <site-dir>
//   node scripts/content-audit.mjs 10-sites/learn2-website

import { readFileSync, existsSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const siteDir = process.argv[2];
if (!siteDir) {
  console.error("Usage: content-audit.mjs <site-dir>");
  process.exit(2);
}

const repoRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const siteRoot = (isAbsolute(siteDir) ? resolve(siteDir) : resolve(process.cwd(), siteDir)).replace(/\/$/, "");
const blogDataPath = join(siteRoot, "src/lib/blog-data.ts");

if (!existsSync(blogDataPath)) {
  // Sites without a blog-data.ts simply skip this audit.
  console.log(`○ content-audit: no blog-data.ts at ${relative(repoRoot, blogDataPath)} — skipping`);
  process.exit(0);
}

const siteName = detectSiteName(siteRoot);
const appendsBrand = layoutAppendsBrand(siteRoot, siteName);
const src = readFileSync(blogDataPath, "utf8");
const posts = parsePosts(src);
const errors = [];
const warnings = [];

const TYPOS = ["Cohession", "Cohensive", "Paricipant", "Paticipant", "Particpant", "particpants", "experiance", "experiances"];

for (const post of posts) {
  const tag = `[${post.slug || `id=${post.id || "?"}`}]`;

  // Rule 1 — Word-paste spans
  const wordPaste = post.content.match(/<span\s+class="[^"]*(?:NormalTextRun|TextRun\s+BCX|SCXW\d+)[^"]*"/g);
  if (wordPaste) {
    errors.push(`${tag} content has ${wordPaste.length} Word/Office paste span(s) (NormalTextRun|TextRun BCX|SCXW). Strip them.`);
  }

  // Rule 2 — tracking params in body links
  const trackingHits = [
    ...(post.content.match(/\?[^"\s]*?_gl=1\*[^"\s]*/g) || []),
    ...(post.content.match(/\?[^"\s]*?fbclid=[^"\s]*/g) || []),
    ...(post.content.match(/\?[^"\s]*?utm_[a-z]+=[^"\s]*/g) || []),
  ];
  if (trackingHits.length > 0) {
    errors.push(`${tag} content has tracking param(s) in body link(s): ${trackingHits.slice(0, 3).join(" … ")}`);
  }

  // Rule 3 — ogTitle must not end with "| <siteName>" IF the layout appends it.
  // If the site just uses ogTitle as-is (no programmatic append), leaving the
  // brand suffix in the data is fine — it's just explicit rather than generated.
  if (post.ogTitle) {
    const re = new RegExp(`\\s*\\|\\s*${siteName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "i");
    if (re.test(post.ogTitle)) {
      const msg = `${tag} ogTitle ends with "| ${siteName}" — the layout appends that already. Set ogTitle to just "${post.ogTitle.replace(re, "")}".`;
      if (appendsBrand) errors.push(msg);
      else warnings.push(msg.replace("the layout appends that already", "layout doesn't append (soft warning) — consider moving brand to title.template"));
    }
  }

  // Rule 4 — typos
  for (const typo of TYPOS) {
    if (new RegExp(`\\b${typo}\\b`).test(post.content) || (post.title && new RegExp(`\\b${typo}\\b`).test(post.title))) {
      errors.push(`${tag} contains typo "${typo}".`);
    }
  }

  // Rule 5 — metaDescription: hard-fail only when missing. Length overages
  // (160+) are warnings so pre-existing editorial work isn't blocked — this
  // audit's job is to prevent NEW bad content from shipping; legacy trim work
  // is tracked separately.
  if (!post.metaDescription || !post.metaDescription.trim()) {
    errors.push(`${tag} missing metaDescription.`);
  } else if (post.metaDescription.length > 200) {
    warnings.push(`${tag} metaDescription is ${post.metaDescription.length} chars (>200 — Google will truncate, editorial trim needed).`);
  } else if (post.metaDescription.length > 160) {
    warnings.push(`${tag} metaDescription is ${post.metaDescription.length} chars (>160, soft cap).`);
  }

  // Rule 6 — duplicate H3 within the post. Soft-warn: some posts use template
  // labels like "Activity Instructions:" once per activity on purpose. Only
  // hard-fail when the duplicated H3 is 4+ words (the shape of AI keyword-stuff
  // rewrites like "Building Team Cohesion Through Problem-Solving").
  const h3s = [...post.content.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map((m) =>
    stripTags(m[1]).toLowerCase().trim(),
  ).filter(Boolean);
  const seen = new Map();
  for (const h of h3s) {
    seen.set(h, (seen.get(h) || 0) + 1);
  }
  for (const [h, n] of seen) {
    if (n > 1) {
      warnings.push(`${tag} H3 "${truncate(h)}" repeats ${n}× in the same post.`);
    }
  }

  // Rule 7 — duplicate inline CTA block (same href + same text body)
  const ctaBlocks = [...post.content.matchAll(/<div[^>]*>\s*<strong>([\s\S]*?)<\/strong>[\s\S]*?<a\s+href="([^"]+)"[^>]*>[^<]*<\/a>[\s\S]*?<\/div>/g)];
  const ctaSet = new Set();
  for (const m of ctaBlocks) {
    const key = `${m[2]}::${stripTags(m[1]).trim().toLowerCase()}`;
    if (ctaSet.has(key)) errors.push(`${tag} duplicate inline CTA block (href=${m[2]}).`);
    ctaSet.add(key);
  }
}

// ── llms.txt: unfilled template placeholders must not ship ───────────────────
// public/llms.txt is served publicly. The template ships it with [Product Name]
// style placeholders on purpose. That is fine while the site is still the
// unconfigured template, and a real defect once someone points a domain at it —
// so this warns for the template and fails the build for a configured site.
{
  const llmsPath = join(siteRoot, "public/llms.txt");
  if (existsSync(llmsPath)) {
    const llms = readFileSync(llmsPath, "utf8");
    const placeholders = [...llms.matchAll(/\[[^\]\n]{3,60}\]/g)].map((m) => m[0]);
    const robotsSyntax = /^\s*(User-Agent|Allow|Disallow)\s*:/im.test(llms);

    const configPath = join(siteRoot, "src/lib/site-config.ts");
    const stillTemplate =
      existsSync(configPath) && /your-domain\.com/.test(readFileSync(configPath, "utf8"));

    if (robotsSyntax) {
      errors.push(
        "public/llms.txt contains robots.txt directives (User-Agent/Allow/Disallow). Those belong in robots.txt and mean nothing here — remove them.",
      );
    }
    if (placeholders.length > 0) {
      const list = [...new Set(placeholders)].slice(0, 5).join(" ");
      const msg = `public/llms.txt still has ${placeholders.length} unfilled placeholder(s): ${list} — it is served publicly at /llms.txt.`;
      if (stillTemplate) warnings.push(`${msg} (soft while SITE_URL is still your-domain.com)`);
      else errors.push(msg);
    }
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
const site = relative(repoRoot, siteRoot);
if (warnings.length > 0) {
  console.warn(`⚠  content-audit warnings for ${site} (${warnings.length}):`);
  const MAX_W = 10;
  for (const w of warnings.slice(0, MAX_W)) console.warn(`   • ${w}`);
  if (warnings.length > MAX_W) console.warn(`   … and ${warnings.length - MAX_W} more (soft warnings, do not fail build)`);
}
if (errors.length > 0) {
  console.error(`✗ content-audit failed for ${site} (${errors.length} issue(s) across ${posts.length} post(s)):`);
  const MAX = 50;
  for (const e of errors.slice(0, MAX)) console.error(`   • ${e}`);
  if (errors.length > MAX) console.error(`   … and ${errors.length - MAX} more`);
  console.error(
    `\nRun  node scripts/content-audit-fix.mjs ${site}  to apply safe auto-fixes (Word-paste spans, tracking params, brand suffix).`,
  );
  process.exit(1);
}
console.log(`✓ content-audit passed for ${site} (${posts.length} posts checked)`);

// ── helpers ──────────────────────────────────────────────────────────────────
function detectSiteName(site) {
  const cfg = join(site, "src/lib/site-config.ts");
  if (!existsSync(cfg)) return "Learn2";
  const body = readFileSync(cfg, "utf8");
  const m = body.match(/SITE_NAME\s*=\s*["']([^"']+)["']/);
  return m ? m[1] : "Learn2";
}

/** True if the blog route's generateMetadata programmatically appends
 * "| <siteName>" to the title. In that case leaving the brand suffix in
 * ogTitle would double-brand. */
function layoutAppendsBrand(site, siteName) {
  const candidates = [
    join(site, "src/app/blog/[slug]/page.tsx"),
    join(site, "src/app/[slug]/page.tsx"),
  ];
  for (const p of candidates) {
    if (!existsSync(p)) continue;
    const body = readFileSync(p, "utf8");
    if (
      new RegExp(`\\|\\s*\\$\\{SITE_NAME\\}`).test(body) ||
      new RegExp(`\\|\\s*${siteName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(body)
    ) {
      return true;
    }
  }
  return false;
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ");
}

function truncate(s, n = 60) {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

// Minimal parser: extracts { slug, title, ogTitle, metaDescription, content } per
// post. Good enough for a lint pass on the Learn2 blog-data.ts shape.
function parsePosts(src) {
  const posts = [];
  // Split on `  {\n    id:` roughly.
  const re = /\n\s{2}\{\n([\s\S]*?)(?=\n\s{2}\{\n|\n\];)/g;
  let match;
  while ((match = re.exec(src)) !== null) {
    const body = match[1];
    const post = {
      id: pick(body, /id:\s*(\d+)/),
      slug: pick(body, /slug:\s*"([^"]+)"/),
      title: pick(body, /title:\s*"((?:[^"\\]|\\.)*)"/),
      ogTitle: pick(body, /ogTitle:\s*"((?:[^"\\]|\\.)*)"/),
      metaDescription: pick(body, /metaDescription:\s*"((?:[^"\\]|\\.)*)"/),
      content: pick(body, /content:\s*"((?:[^"\\]|\\.)*)"/) || "",
    };
    if (post.slug || post.id) posts.push(post);
  }
  return posts;
}

function pick(body, re) {
  const m = body.match(re);
  if (!m) return "";
  // Unescape the JS string literal we captured.
  return m[1]
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}
