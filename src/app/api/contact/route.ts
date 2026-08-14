import { sendTracked } from "@/lib/sendgrid";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

export const runtime = "nodejs";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, message, _hp_email, pageUrl } = body;

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

    if (!process.env.SENDGRID_API_KEY) {
      console.error("[contact-form] SENDGRID_API_KEY is not set");
      return Response.json(
        { error: "Contact form is not configured. Please email sales@Learn2.com directly." },
        { status: 503 }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanCompany = (company || "").trim();
    const cleanMessage = (message || "").trim();
    const source = pageUrl || SITE_URL + "/contact";

    // Internal SQL notice to sales@ via SendGrid — bind by recipient (sales@),
    // not the lead, so the lead's own engagement row stays clean.
    const { ok, messageId } = await sendTracked({
      to: "sales@Learn2.com",
      replyTo: cleanEmail,
      kind: "SQL",
      campaign: "contact",
      sourcePage: pageUrl || source,
      subject: `[${SITE_NAME}] Contact from ${cleanName}${cleanCompany ? ` at ${cleanCompany}` : ""}`,
      text: [
        `New contact form submission from ${SITE_NAME}`,
        `────────────────────────────────`,
        ``,
        `Name: ${cleanName}`,
        `Email: ${cleanEmail}`,
        `Company: ${cleanCompany || "Not provided"}`,
        ``,
        `Message:`,
        cleanMessage || "(No message provided)",
        ``,
        `────────────────────────────────`,
        `Source: ${source}`,
        `Site: ${SITE_NAME}`,
        `Time: ${new Date().toLocaleString("en-US", { timeZone: "America/Toronto" })} ET`,
      ].join("\n"),
    });

    if (!ok) {
      console.error("[contact-form] SendGrid send failed");
      return Response.json(
        { error: "Failed to send your message. Please email sales@Learn2.com directly." },
        { status: 500 }
      );
    }

    console.log("[contact-form] Sent successfully:", JSON.stringify({
      id: messageId,
      site: SITE_NAME,
      from: cleanEmail,
      name: cleanName,
    }));

    return Response.json({ success: true });
  } catch (error) {
    console.error("[contact-form] Unexpected error:", error);
    return Response.json(
      { error: "Something went wrong. Please email sales@Learn2.com directly." },
      { status: 500 }
    );
  }
}
