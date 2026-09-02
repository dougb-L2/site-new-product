# Learn2 Product Site Template

## What This Is

Standalone template for Learn2 product sites. Each site gets its own repo and Vercel project.

## Quick Start

1. Use this template to create a new repo
2. Clone it locally
3. Copy `.env.example` to `.env.local` and fill in values
4. Run `npm install && npm run dev`
5. Edit `src/lib/site-config.ts` for your domain and site name
6. Edit `src/lib/chat-config.ts` for your chat prompt and booking links
7. Edit `src/lib/assessment-config.ts` to enable/disable assessments
8. Replace template page content with your product content
9. Deploy to Vercel

## Site Configuration

### Single Source of Truth: `src/lib/site-config.ts`

Every canonical URL, Open Graph URL, and sitemap entry derives from `SITE_URL`. Never hardcode your domain anywhere else.

### Chat: `src/lib/chat-config.ts`

The AI chat widget loads its system prompt, button text, booking links, and quick-start options from this file. Customize per site.

### Assessments: `src/lib/assessment-config.ts`

Toggle the three assessments (Communicate, Lead, Learn) on/off per site. Each has its own data file in `src/lib/`.

### Email: `src/lib/sendgrid.ts`

SendGrid is the only email provider. Never add Resend or any other ESP.

Every transactional send goes through this file. Use `sendTracked()` for anything a lead reads — it turns on open and click tracking and stamps `custom_args` (`kind`, `email`, `campaign`, `source_page`, `sequence_position`, `lead_id`) so the resulting opens and clicks join back to the MQL or SQL that produced them. Use `sendInternal()` for ops alerts, which carry no lead binding and no tracking. Neither one throws — they return a result so a route keeps its no-silent-failure contract.

Send only from a verified sender: `learn2@learn2.com` or `assessment@learn2.com`. The old `notify.learn2.com` subdomain was removed and will bounce.

## Tech Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4
- Vercel AI SDK with Claude Haiku (chat widget)
- SendGrid (email/lead capture) — the only email provider, never Resend
- Vercel hosting

## SEO Guardrails

Prebuild scripts enforce quality on every build:
- `scripts/perf-audit.mjs` — 6 performance rules (preconnect, next/image, cache TTL, etc.)
- `scripts/content-audit.mjs` — 6 content quality rules (no Word paste, no tracking URLs, no doubled brand, etc.)
- `scripts/esp-audit.mjs` — 5 email rules (no retired ESP import, env var, or package; no dead `notify.learn2.com` sender; every send routed through `src/lib/sendgrid.ts`). It proves each rule fires on a sabotage fixture before it scans, so a passing run means the gate still bites. Run it alone with `node scripts/esp-audit.mjs .`

All three run automatically via `npm run prebuild` before every `npm run build`.

### SEO Rules

1. Every page.tsx MUST set `alternates.canonical` via `canonicalFor()` from site-config
2. Root layout.tsx MUST NOT set a canonical (prevents silent inheritance)
3. A page is in the sitemap OR noindex — never both
4. robots.ts blocks crawlers from `/api/` and image optimization endpoints
5. No hardcoded domain strings — always use SITE_URL

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Domain for canonicals, OG, sitemap |
| `NEXT_PUBLIC_SITE_NAME` | Yes | Site name in metadata |
| `ANTHROPIC_API_KEY` | Yes | Chat widget AI |
| `SENDGRID_API_KEY` | Yes | Contact form, lead capture |
| `SENDGRID_FROM` | Optional | Overrides the default From (verified senders only) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Recommended | Google Analytics |
| `NEXT_PUBLIC_GTM_ID` | Recommended | Google Tag Manager |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Recommended | Search Console verification |
| `INDEXNOW_KEY` | Optional | Instant crawl notification |

## Commands

```bash
npm run dev      # Local dev server
npm run build    # Production build (runs prebuild audits first)
npm run start    # Serve production build locally
```

## Learn2 Terminology

Always use: "Experience" (not training), "Participants" (not students), "Facilitators" (not trainers), "could" (not should/must), "and" (not but/however).

## Deployment

1. Connect repo to Vercel
2. Set environment variables in Vercel project settings
3. Deploy — Vercel runs `npm run build` which triggers prebuild audits
4. Verify: GTM present, sitemap returns 200, canonicals correct

## Creating a New Site From This Template

1. Go to https://github.com/dougb-L2/site-new-product
2. Click "Use this template" > "Create a new repository"
3. Name it: `site-[product-name]` (e.g., `site-lead-the-endurance`)
4. Clone, configure, deploy
