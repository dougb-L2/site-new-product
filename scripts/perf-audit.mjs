#!/usr/bin/env node
// scripts/perf-audit.mjs — static pre-build check for the 6 Learn2 PSI rules.
// Invoked per-site via `npm run prebuild` → `node ../../scripts/perf-audit.mjs .`
// Enforces the rules in 04-active-projects/learn2-website-redesign/seo-guardrails.md §6.
//
// Exits non-zero (fails the build) if any HARD rule is violated.
// Emits warnings for SOFT rules (missing remotePatterns on a site with no external images).
//
// Run locally: `node scripts/perf-audit.mjs 10-sites/naturally-site`

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const siteDir = process.argv[2];
if (!siteDir) {
  console.error("Usage: perf-audit.mjs <site-dir>");
  process.exit(2);
}

const repoRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
// Resolve relative paths from caller's cwd so `npm run prebuild` (cwd=site) and
// `node scripts/perf-audit.mjs 10-sites/foo` (cwd=repo root) both work.
const siteRoot = (isAbsolute(siteDir) ? resolve(siteDir) : resolve(process.cwd(), siteDir)).replace(/\/$/, "");
const errors = [];
const warnings = [];

const read = (p) => {
  try {
    return readFileSync(p, "utf8");
  } catch {
    return null;
  }
};

// ── Rule 1: layout.tsx has preconnect for third-party hosts ──────────────────
const layoutPath = join(siteRoot, "src/app/layout.tsx");
const layout = read(layoutPath);
if (!layout) {
  errors.push(`missing src/app/layout.tsx at ${relative(repoRoot, layoutPath)}`);
} else {
  const hostsUsed = {
    "www.googletagmanager.com": /googletagmanager|GTM-/i.test(layout) ||
      existsSync(join(siteRoot, "src/components/GoogleTagManager.tsx")),
    "www.google-analytics.com": /google-analytics|GoogleAnalytics/i.test(layout) ||
      existsSync(join(siteRoot, "src/components/GoogleAnalytics.tsx")),
    "i.ytimg.com": existsSync(join(siteRoot, "src/components/LiteYouTube.tsx")),
  };
  for (const [host, inUse] of Object.entries(hostsUsed)) {
    if (!inUse) continue;
    const re = new RegExp(
      `<link[^>]+rel=["']preconnect["'][^>]+href=["']https:\\/\\/${host.replace(
        /\./g,
        "\\.",
      )}["']`,
    );
    if (!re.test(layout)) {
      errors.push(
        `layout.tsx missing <link rel="preconnect" href="https://${host}"> (${host} is in use on this site)`,
      );
    }
  }
}

// ── Rule 2: next.config.ts has images.minimumCacheTTL on sites using <Image> ─
const nextConfigPath = join(siteRoot, "next.config.ts");
const nextConfig = read(nextConfigPath);
if (!nextConfig) {
  errors.push(`missing next.config.ts at ${relative(repoRoot, nextConfigPath)}`);
} else {
  const usesImage = grepSrc(siteRoot, /from\s+["']next\/image["']/);
  if (usesImage && !/minimumCacheTTL\s*:\s*31536000/.test(nextConfig)) {
    errors.push(
      "next.config.ts missing `images.minimumCacheTTL: 31536000` (site uses next/image)",
    );
  }
  // Rule 3: no custom Cache-Control on /_next/image (Next 16 warns)
  if (/\/_next\/image.*Cache-Control/s.test(nextConfig)) {
    errors.push(
      "next.config.ts sets a custom Cache-Control on /_next/image — Next.js 16 warns this breaks dev. Use images.minimumCacheTTL instead.",
    );
  }
  // Rule 4: if YouTube thumbnails are used, i.ytimg.com must be in remotePatterns
  if (
    existsSync(join(siteRoot, "src/components/LiteYouTube.tsx")) &&
    !/hostname:\s*["']i\.ytimg\.com["']/.test(nextConfig)
  ) {
    errors.push(
      "next.config.ts missing `images.remotePatterns` entry for i.ytimg.com (LiteYouTube component is present)",
    );
  }
}

// ── Rule 5: no raw <img> tags in src/components or src/app ──────────────────
const rawImgOffenders = [];
walk(join(siteRoot, "src"), (file) => {
  if (!/\.(tsx|jsx)$/.test(file)) return;
  const body = read(file);
  if (!body) return;
  const lines = body.split("\n");
  lines.forEach((line, i) => {
    // <img ... — tolerate trailing `<Image` and SVG `<image ` (lowercase-e + space-alphaN)
    if (/<img[\s>]/.test(line)) {
      rawImgOffenders.push(`${relative(repoRoot, file)}:${i + 1}`);
    }
  });
});
if (rawImgOffenders.length > 0) {
  errors.push(
    `raw <img> tag(s) found — use next/image instead:\n    ${rawImgOffenders.join("\n    ")}`,
  );
}

// ── Rule 6: no maxresdefault.jpg YouTube thumbnails (use hqdefault) ─────────
const maxresOffenders = [];
walk(join(siteRoot, "src"), (file) => {
  if (!/\.(tsx|jsx|ts|js)$/.test(file)) return;
  const body = read(file);
  if (!body) return;
  const lines = body.split("\n");
  lines.forEach((line, i) => {
    if (/maxresdefault\.jpg/.test(line)) {
      maxresOffenders.push(`${relative(repoRoot, file)}:${i + 1}`);
    }
  });
});
if (maxresOffenders.length > 0) {
  errors.push(
    `maxresdefault.jpg found (~100KB+) — use hqdefault.jpg (~20KB) instead:\n    ${maxresOffenders.join("\n    ")}`,
  );
}

// ── Rule 7: heavy AI-SDK chat components must be dynamic-imported ───────────
if (layout) {
  const chatComponent = findChatComponent(siteRoot);
  if (chatComponent) {
    // Eager default-import: `import ChatWidget from "@/components/ChatWidget"`
    const eagerRe = new RegExp(
      `^import\\s+${chatComponent}\\s+from\\s+["']@?/?components/${chatComponent}["']`,
      "m",
    );
    const dynamicRe = new RegExp(
      `dynamic\\s*\\(\\s*\\(\\s*\\)\\s*=>\\s*import\\s*\\(\\s*["'][^"']*${chatComponent}["']`,
    );
    if (eagerRe.test(layout) && !dynamicRe.test(layout)) {
      errors.push(
        `${chatComponent} is eagerly imported in layout.tsx — use next/dynamic() so the AI SDK bundle code-splits out of initial paint`,
      );
    }
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
const site = relative(repoRoot, siteRoot);
if (warnings.length > 0) {
  console.warn(`⚠  perf-audit warnings for ${site}:`);
  for (const w of warnings) console.warn(`   • ${w}`);
}
if (errors.length > 0) {
  console.error(`✗ perf-audit failed for ${site}:`);
  for (const e of errors) console.error(`   • ${e}`);
  console.error(
    `\nSee 04-active-projects/learn2-website-redesign/seo-guardrails.md §6.`,
  );
  process.exit(1);
}
console.log(`✓ perf-audit passed for ${site}`);

// ── helpers ──────────────────────────────────────────────────────────────────
function walk(dir, fn) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, fn);
    else fn(full);
  }
}

function grepSrc(dir, re) {
  let hit = false;
  walk(join(dir, "src"), (file) => {
    if (hit) return;
    if (!/\.(tsx|jsx|ts|js)$/.test(file)) return;
    const body = read(file);
    if (body && re.test(body)) hit = true;
  });
  return hit;
}

function findChatComponent(site) {
  const candidates = ["ChatWidget", "ChatWidgetLazy", "Chat"];
  for (const name of candidates) {
    if (existsSync(join(site, `src/components/${name}.tsx`))) return name;
  }
  return null;
}
