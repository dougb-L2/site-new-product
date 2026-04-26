import { Resend } from "resend";
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

    if (!process.env.RESEND_API_KEY) {
      console.error("[cert-waitlist] RESEND_API_KEY is not set");
      return Response.json(
        { error: "Waitlist form is not configured. Please email sales@Learn2.com directly." },
        { status: 503 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = ROLE_LABELS[role] ?? role;
    const cleanContext = (context || "").trim();
    const source = pageUrl || SITE_URL + "/certification";

    const { data, error } = await resend.emails.send({
      from: `${SITE_NAME} <noreply@notify.learn2.com>`,
      to: "sales@Learn2.com",
      replyTo: cleanEmail,
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

    if (error) {
      console.error("[cert-waitlist] Resend error:", JSON.stringify(error));
      return Response.json(
        { error: "Failed to join the waitlist. Please email sales@Learn2.com directly." },
        { status: 500 }
      );
    }

    console.log("[cert-waitlist] Signup:", JSON.stringify({
      id: data?.id,
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
