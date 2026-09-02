/**
 * The single SendGrid send helper for every transactional email in this repo.
 *
 * SendGrid is the ONLY email provider (Doug, 2026-07-18 — pinned decision
 * bhhk19355r89gps, memory feedback_sendgrid_only_never_resend). The previous ESP
 * is retired. The nurture drips run on SendGrid via n8n and are NOT touched here
 * — this helper is only the transactional half (captures, confirmations,
 * give-to-get delivery, lead alerts).
 *
 * Every send:
 *  - goes through @sendgrid/mail with SENDGRID_API_KEY,
 *  - turns ON open + click tracking (click tracking also rewrites text links), and
 *  - stamps custom_args that BIND the send to its exact MQL/SQL, so when SendGrid
 *    posts the open/click/bounce back to an events webhook it can land in
 *    `email_events` joined to the lead (kind, campaign, source_page, lead_id).
 *
 * Never throws to the caller — returns { ok, messageId } so a route can preserve
 * its no-silent-failure / no-silent-success contract around it.
 */
import sgMail, { type MailDataRequired } from "@sendgrid/mail";

let configured = false;
function ensureConfigured(): boolean {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) return false;
  if (!configured) {
    sgMail.setApiKey(key);
    configured = true;
  }
  return true;
}

// Verified SendGrid sender. Only learn2@learn2.com and assessment@learn2.com are
// verified — notify.learn2.com was the old ESP's subdomain and no longer exists.
const DEFAULT_FROM = process.env.SENDGRID_FROM || "Learn2 <learn2@learn2.com>";

export type TrackedSend = {
  to: string | string[];
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  headers?: Record<string, string>; // custom SMTP headers (e.g. inbox-filter tags)

  // ── MQL/SQL binding — the whole reason this helper exists ──
  kind: "MQL" | "SQL";
  campaign: string; // e.g. "contact", "lead-assessment", "cert-waitlist"
  sourcePage?: string; // the page the lead came from
  sequencePosition?: string; // free tag; transactional sends use the campaign step
  leadId?: string; // the PocketBase record id of the captured lead

  /**
   * The email address the resulting open/click events should JOIN to. Defaults
   * to `to` when `to` is a single address. Pass it explicitly for a send whose
   * recipient is not the lead (e.g. an internal sales notice) so the lead's own
   * events stay clean.
   */
  email?: string;
};

export type SendResult = { ok: boolean; messageId: string };

export async function sendTracked(opts: TrackedSend): Promise<SendResult> {
  if (!ensureConfigured()) {
    console.error(
      `[sendgrid] SENDGRID_API_KEY is not set — cannot send (${opts.campaign})`
    );
    return { ok: false, messageId: "" };
  }

  const bindEmail = (
    opts.email ||
    (typeof opts.to === "string" ? opts.to : opts.to[0]) ||
    ""
  )
    .trim()
    .toLowerCase();

  // custom_args values MUST be non-empty strings — omit blanks so SendGrid
  // doesn't reject the send. `kind` is always present.
  const customArgs: Record<string, string> = { kind: opts.kind };
  if (bindEmail) customArgs.email = bindEmail;
  if (opts.campaign) customArgs.campaign = opts.campaign;
  if (opts.sourcePage) {
    customArgs.source_page = opts.sourcePage;
    customArgs.sourcePage = opts.sourcePage; // tolerate either casing downstream
  }
  if (opts.sequencePosition) customArgs.sequence_position = opts.sequencePosition;
  if (opts.leadId) customArgs.lead_id = opts.leadId;

  // Cast: a caller passes text OR html (or both); MailDataRequired's union can't
  // be proven statically from the conditional spread, so assert it here.
  const msg = {
    to: opts.to,
    from: opts.from || DEFAULT_FROM,
    subject: opts.subject,
    ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    ...(opts.cc ? { cc: opts.cc } : {}),
    ...(opts.bcc ? { bcc: opts.bcc } : {}),
    ...(opts.text ? { text: opts.text } : {}),
    ...(opts.html ? { html: opts.html } : {}),
    ...(opts.headers ? { headers: opts.headers } : {}),
    trackingSettings: {
      openTracking: { enable: true },
      clickTracking: { enable: true, enableText: true },
    },
    customArgs,
  } as MailDataRequired;

  try {
    const [res] = await sgMail.send(msg);
    const messageId =
      ((res?.headers?.["x-message-id"] ||
        res?.headers?.["X-Message-Id"]) as string) || "";
    const ok = (res?.statusCode ?? 500) < 300;
    if (!ok) {
      console.error(
        `[sendgrid] non-2xx (${res?.statusCode}) for ${opts.campaign} → ${bindEmail}`
      );
    }
    return { ok, messageId };
  } catch (err) {
    // SendGrid puts the useful detail on err.response.body.
    const anyErr = err as { response?: { body?: unknown } };
    const detail = anyErr?.response?.body
      ? JSON.stringify(anyErr.response.body)
      : String(err);
    console.error(
      `[sendgrid] send failed (${opts.campaign} → ${bindEmail}): ${detail}`
    );
    return { ok: false, messageId: "" };
  }
}

/**
 * Minimal internal SendGrid send for OPS alerts (capture failures, dropped
 * events). No lead custom_args and no open/click tracking — these are ops mail,
 * not lead engagement, so they must never pollute email_events with a lead
 * binding. Best-effort: returns false instead of throwing so the caller's other
 * alert legs (Telegram, console) still fire if SendGrid is the thing that's down.
 */
export async function sendInternal(opts: {
  to: string;
  subject: string;
  text: string;
  from?: string;
}): Promise<boolean> {
  if (!ensureConfigured()) return false;
  try {
    const [res] = await sgMail.send({
      to: opts.to,
      from: opts.from || DEFAULT_FROM,
      subject: opts.subject,
      text: opts.text,
      trackingSettings: {
        openTracking: { enable: false },
        clickTracking: { enable: false },
      },
      mailSettings: { bypassListManagement: { enable: true } },
    });
    return (res?.statusCode ?? 500) < 300;
  } catch (err) {
    console.error("[sendgrid] internal alert send failed:", String(err));
    return false;
  }
}
