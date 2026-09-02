import { sendTracked } from "@/lib/sendgrid";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

export const runtime = "nodejs";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const ALLOWED_ROLES = new Set([
  "consultant",
  "internal-ld",
  "transitioning-leader",
  "team-leader",
  "other",
]);

const ROLE_LABELS: Record<string, string> = {
  "consultant": "Independent consultant / coach",
  "internal-ld": "Internal L&D / HR",
  "transitioning-leader": "Transitioning leader (severance / between roles)",
  "team-leader": "Team leader wanting to certify",
  "other": "Other",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role, context, _hp_email, pageUrl } = body;

    // Honeypot: if the hidden field has a value, it's a bot
    if (_hp_email) {
      return Response.json({ success: true });
    }

    // Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return Response.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !isValidEmail(email.trim())) {
      return Response.json({ error: "A valid email is required." }, { status: 400 });
    }
    if (!role || typeof role !== "string" || !ALLOWED_ROLES.has(role)) {
      return Response.json({ error: "Please select a role." }, { status: 400 });
    }

    if (!process.env.SENDGRID_API_KEY) {
      console.error("[cert-waitlist] SENDGRID_API_KEY is not set");
      return Response.json(
        { error: "Waitlist form is not configured. Please email sales@Learn2.com directly." },
        { status: 503 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = ROLE_LABELS[role] ?? role;
    const cleanContext = (context || "").trim();
    const source = pageUrl || SITE_URL + "/certification";

    // Internal SQL notice to sales@ via SendGrid — bind by recipient (sales@).
    const { ok, messageId } = await sendTracked({
      to: "sales@Learn2.com",
      replyTo: cleanEmail,
      kind: "SQL",
      campaign: "cert-waitlist",
      sourcePage: pageUrl || source,
      subject: `[Cohort Waitlist] ${cleanName} — ${cleanRole}`,
      text: [
        `New Cohort Certification Waitlist signup from ${SITE_NAME}`,
        `────────────────────────────────`,
        ``,
        `Name: ${cleanName}`,
        `Email: ${cleanEmail}`,
        `Role: ${cleanRole}`,
        ``,
        `Context:`,
        cleanContext || "(No context provided)",
        ``,
        `────────────────────────────────`,
        `Source: ${source}`,
        `Site: ${SITE_NAME}`,
        `Time: ${new Date().toLocaleString("en-US", { timeZone: "America/Toronto" })} ET`,
      ].join("\n"),
    });

    if (!ok) {
      console.error("[cert-waitlist] SendGrid send failed");
      return Response.json(
        { error: "Failed to join the waitlist. Please email sales@Learn2.com directly." },
        { status: 500 }
      );
    }

    console.log("[cert-waitlist] Signup:", JSON.stringify({
      id: messageId,
      site: SITE_NAME,
      from: cleanEmail,
      name: cleanName,
      role: cleanRole,
    }));

    return Response.json({ success: true });
  } catch (error) {
    console.error("[cert-waitlist] Unexpected error:", error);
    return Response.json(
      { error: "Something went wrong. Please email sales@Learn2.com directly." },
      { status: 500 }
    );
  }
}
