import { sendTracked } from "@/lib/sendgrid";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      company,
      budget_range,
      timeline,
      group_size,
      qualification_notes,
      is_purpose_driven,
      site,
    } = body;

    if (!process.env.SENDGRID_API_KEY) {
      console.error("[chat-capture] SENDGRID_API_KEY not set");
      return Response.json({ error: "Not configured" }, { status: 503 });
    }

    // Build qualification tags for subject line
    const tags: string[] = [];
    if (budget_range) tags.push(`Budget: ${budget_range}`);
    if (timeline) tags.push(`Date: ${timeline}`);
    if (group_size) tags.push(`${group_size} people`);
    if (is_purpose_driven) tags.push("Purpose-driven");

    const tagString = tags.length > 0 ? ` — ${tags.join(", ")}` : "";
    const siteLabel = site || "Learn2 Site";

    // Internal SQL notice to sales@ via SendGrid — bind by recipient (sales@).
    const { ok } = await sendTracked({
      to: "sales@Learn2.com",
      replyTo: email || undefined,
      kind: "SQL",
      campaign: "chat-capture",
      subject: `${siteLabel} Lead${tagString}${name ? ` from ${name}` : ""}`,
      text: [
        `New chat lead from Learn2 Site`,
        `────────────────────────────────`,
        ``,
        `Name: ${name || "Not provided"}`,
        `Email: ${email || "Not provided"}`,
        `Company: ${company || "Not provided"}`,
        `Budget Range: ${budget_range || "Not discussed"}`,
        `Timeline: ${timeline || "Not discussed"}`,
        `Group Size: ${group_size || "Not discussed"}`,
        `Purpose-Driven: ${is_purpose_driven ? "Yes" : "Unknown"}`,
        ``,
        `Qualification Notes:`,
        qualification_notes || "(none)",
        ``,
        `────────────────────────────────`,
        `Site: Learn2 Site`,
        `Time: ${new Date().toLocaleString("en-US", { timeZone: "America/Toronto" })} ET`,
      ].join("\n"),
    });

    if (!ok) {
      console.error("[chat-capture] SendGrid send failed");
      return Response.json({ error: "Failed to send" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("[chat-capture] Error:", error);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
