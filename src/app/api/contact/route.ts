import { Resend } from "resend";
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

    if (!process.env.RESEND_API_KEY) {
      console.error("[contact-form] RESEND_API_KEY is not set");
      return Response.json(
        { error: "Contact form is not configured. Please email sales@Learn2.com directly." },
        { status: 503 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanCompany = (company || "").trim();
    const cleanMessage = (message || "").trim();
    const source = pageUrl || SITE_URL + "/contact";

    const { data, error } = await resend.emails.send({
      from: `${SITE_NAME} <noreply@notify.learn2.com>`,
      to: "sales@Learn2.com",
      replyTo: cleanEmail,
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

    if (error) {
      console.error("[contact-form] Resend error:", JSON.stringify(error));
      return Response.json(
        { error: "Failed to send your message. Please email sales@Learn2.com directly." },
        { status: 500 }
      );
    }

    console.log("[contact-form] Sent successfully:", JSON.stringify({
      id: data?.id,
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
