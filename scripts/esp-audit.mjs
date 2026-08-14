#!/usr/bin/env node
// scripts/esp-audit.mjs — SendGrid-only email provider gate.
//
// SendGrid is the ONLY email provider (Doug, 2026-07-18 — pinned decision
// bhhk19355r89gps, memory feedback_sendgrid_only_never_resend). This template
// shipped the retired ESP until 2026-08-14, so every site scaffolded from it
// inherited the wrong provider silently. A prose rule in CLAUDE.md could not
// stop that. This gate can: it fails the build.
//
// Runs as `prebuild` alongside perf-audit.mjs and content-audit.mjs.
//
// Rules — each one FAILS the build:
//  1. No retired-ESP import   (from "resend" / require("resend") / new Resend()
//  2. No retired-ESP env var  (RESEND_API_KEY, RESEND_WEBHOOK_SECRET, ...)
//  3. No retired-ESP package  ("resend" in dependencies/devDependencies)
//  4. No dead sender domain   (notify.learn2.com — removed in the migration)
//  5. Every email send goes through src/lib/sendgrid.ts (no direct @sendgrid/mail
//     import outside it, which would skip the MQL/SQL custom_args binding)
//
// Deliberately NOT a rule: the word "Resend" in prose. The prohibition text in
// CLAUDE.md and .env.example is the guardrail — banning the word would delete
// the rule that keeps the next site clean. This gate matches USAGE, not mentions.
//
// Usage:
//   node scripts/esp-audit.mjs <site-dir>
//   node scripts/esp-audit.mjs .
//   node scripts/esp-audit.mjs . --selftest   # prove the detectors actually fire

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { isAbsolute, join, relative, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const siteDir = process.argv[2];
if (!siteDir) {
  console.error("Usage: esp-audit.mjs <site-dir> [--selftest]");
  process.exit(2);
}

const repoRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const siteRoot = (
  isAbsolute(siteDir) ? resolve(siteDir) : resolve(process.cwd(), siteDir)
).replace(/\/$/, "");

// The one file allowed to import the SendGrid SDK directly.
const SENDGRID_LIB = "src/lib/sendgrid.ts";

/**
 * Every rule is a pure (text, relPath) -> violation[] function, so the same
 * detector that guards the repo can be fired at a sabotage fixture in
 * --selftest. A gate that cannot demonstrate it still bites is decoration.
 */
const RULES = [
  {
    id: "esp-import",
    label: 'retired ESP import (from "resend" / new Resend())',
    test: (text) => [
      ...text.matchAll(/(?:from\s+["']resend["']|require\(\s*["']resend["']\s*\)|new\s+Resend\s*\()/g),
    ],
    fix: 'Use sendTracked() / sendInternal() from "@/lib/sendgrid" instead.',
  },
  {
    id: "esp-env",
    label: "retired ESP env var (RESEND_*)",
    test: (text) => [...text.matchAll(/\bRESEND_[A-Z0-9_]+/g)],
    fix: "Use SENDGRID_API_KEY (and optionally SENDGRID_FROM).",
  },
  {
    id: "esp-dep",
    label: 'retired ESP package ("resend" dependency)',
    test: (text, rel) =>
      rel === "package.json" ? [...text.matchAll(/"resend"\s*:/g)] : [],
    fix: 'Remove "resend" and depend on "@sendgrid/mail" instead.',
  },
  {
    id: "dead-sender",
    label: "dead sender domain (notify.learn2.com)",
    // Prose that names the domain to warn about it is fine; an address is not.
    test: (text) => [...text.matchAll(/@notify\.learn2\.com/g)],
    fix: "Send only from a verified sender: learn2@learn2.com or assessment@learn2.com.",
  },
  {
    id: "unwrapped-sdk",
    label: `direct @sendgrid/mail import outside ${SENDGRID_LIB}`,
    // package.json names the package as a dependency — that is the declaration,
    // not an import, and it must stay.
    test: (text, rel) =>
      rel === SENDGRID_LIB || rel === "package.json"
        ? []
        : [...text.matchAll(/["']@sendgrid\/mail["']/g)],
    fix: `Route the send through sendTracked() in ${SENDGRID_LIB} so it carries the MQL/SQL custom_args.`,
  },
];

// ── --selftest: prove each detector fires on sabotage, and stays quiet on the
// prose it is supposed to tolerate. Runs BEFORE the real scan on every build.
const SABOTAGE = {
  "esp-import": { rel: "src/app/api/x/route.ts", text: 'import { Resend } from "resend";' },
  "esp-env": { rel: "src/app/api/x/route.ts", text: "if (!process.env.RESEND_API_KEY) return;" },
  "esp-dep": { rel: "package.json", text: '{ "dependencies": { "resend": "^6.10.0" } }' },
  "dead-sender": { rel: "src/app/api/x/route.ts", text: 'from: "Site <noreply@notify.learn2.com>",' },
  "unwrapped-sdk": { rel: "src/app/api/x/route.ts", text: 'import sgMail from "@sendgrid/mail";' },
};

// Prose the gate must NOT flag — the prohibition text is the guardrail.
const TOLERATE = [
  { rel: "CLAUDE.md", text: "SendGrid is the only email provider. Never add Resend or any other ESP." },
  { rel: ".env.example", text: "# SendGrid is the ONLY email provider — never Resend." },
  { rel: "src/lib/sendgrid.ts", text: 'import sgMail from "@sendgrid/mail";' },
  { rel: "package.json", text: '{ "dependencies": { "@sendgrid/mail": "^8.1.4" } }' },
  { rel: "src/lib/sendgrid.ts", text: "// notify.learn2.com was the old ESP's subdomain and no longer exists." },
];

function selftest() {
  const proved = [];
  for (const rule of RULES) {
    const s = SABOTAGE[rule.id];
    if (!s) {
      console.error(`✗ esp-audit selftest: rule "${rule.id}" has no sabotage fixture`);
      process.exit(1);
    }
    if (rule.test(s.text, s.rel).length === 0) {
      console.error(
        `✗ esp-audit selftest: rule "${rule.id}" did NOT fire on sabotage — the gate is hollow.\n  fixture: ${s.text}`
      );
      process.exit(1);
    }
    proved.push(rule.id);
  }
  for (const t of TOLERATE) {
    for (const rule of RULES) {
      if (rule.test(t.text, t.rel).length > 0) {
        console.error(
          `✗ esp-audit selftest: rule "${rule.id}" false-positived on allowed text in ${t.rel}:\n  ${t.text}`
        );
        process.exit(1);
      }
    }
  }
  return proved;
}

// ── scan ──
const SCAN_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const SKIP_DIR = new Set(["node_modules", ".next", ".git", "out", "dist", "public"]);

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    if (SKIP_DIR.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (SCAN_EXT.has(extname(name))) acc.push(full);
  }
  return acc;
}

const targets = [
  ...walk(join(siteRoot, "src")),
  ...["package.json", ".env.example", "CLAUDE.md"]
    .map((f) => join(siteRoot, f))
    .filter((f) => existsSync(f)),
];

const proved = selftest();

const violations = [];
for (const file of targets) {
  const rel = relative(siteRoot, file);
  const text = readFileSync(file, "utf8");
  const lines = text.split("\n");
  for (const rule of RULES) {
    for (const m of rule.test(text, rel)) {
      const line = text.slice(0, m.index).split("\n").length;
      violations.push({
        rule: rule.id,
        label: rule.label,
        fix: rule.fix,
        where: `${rel}:${line}`,
        snippet: (lines[line - 1] || "").trim().slice(0, 120),
      });
    }
  }
}

const siteLabel = relative(repoRoot, siteRoot) || ".";

if (violations.length) {
  console.error(`✗ esp-audit FAILED for ${siteLabel} (${violations.length}):`);
  for (const v of violations) {
    console.error(`   • [${v.rule}] ${v.where} — ${v.label}`);
    console.error(`     ${v.snippet}`);
    console.error(`     → ${v.fix}`);
  }
  console.error(
    "\n   SendGrid is the ONLY email provider. See src/lib/sendgrid.ts and CLAUDE.md."
  );
  process.exit(1);
}

// Say what was actually proved — a bare "✓" cannot tell an enforcing gate from
// a hollow one (memory feedback_gates_must_prove_themselves).
console.log(
  `✓ esp-audit passed for ${siteLabel} — ${targets.length} files scanned, ` +
    `${RULES.length} rules each proved to fire on sabotage first (${proved.join(", ")})`
);
