import { NextRequest, NextResponse } from "next/server";
import { sendTracked } from "@/lib/sendgrid";
import {
  APPROACHES,
  TEAM_MIRROR,
  type Color,
} from "@/lib/lead-assessment-data";

export const runtime = "nodejs";

const PB_URL = process.env.POCKETBASE_URL || "http://127.0.0.1:8090";
const PB_EMAIL = process.env.POCKETBASE_EMAIL || "";
const PB_PASSWORD = process.env.POCKETBASE_PASSWORD || "";

const SITE_NAME = "Naturally by Learn2";
// Verified SendGrid senders only — learn2@ and assessment@learn2.com.
const EMAIL_FROM = `${SITE_NAME} <assessment@learn2.com>`;
const EMAIL_BCC = "sales@Learn2.com";

async function getPBToken(): Promise<string> {
  const res = await fetch(
    `${PB_URL}/api/collections/_superusers/auth-with-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity: PB_EMAIL, password: PB_PASSWORD }),
    }
  );
  if (!res.ok) throw new Error(`PB auth failed: ${res.status}`);
  const data = await res.json();
  return data.token;
}

async function findClientByEmail(
  token: string,
  email: string
): Promise<string | null> {
  const res = await fetch(
    `${PB_URL}/api/collections/clients/records?filter=(email='${encodeURIComponent(email)}')&perPage=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.items?.[0]?.id || null;
}

async function createClient(
  token: string,
  name: string,
  email: string,
  source: string
): Promise<string> {
  const res = await fetch(`${PB_URL}/api/collections/clients/records`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      status: "prospect",
      source: source === "linkedin" ? "linkedin" : "website",
      notes: "Created via Lead Naturally Assessment",
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create client: ${err}`);
  }
  const data = await res.json();
  return data.id;
}

async function createAssessment(
  token: string,
  clientId: string,
  payload: Record<string, unknown>
): Promise<string> {
  const res = await fetch(
    `${PB_URL}/api/collections/lead_assessments/records`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client: clientId,
        name: payload.name,
        email: payload.email,
        gold_score: payload.goldScore,
        green_score: payload.greenScore,
        orange_score: payload.orangeScore,
        blue_score: payload.blueScore,
        primary_approach: payload.primaryApproach,
        secondary_approach: payload.secondaryApproach,
        blind_spot: payload.blindSpot,
        combination_title: payload.combinationTitle,
        adaptability_score: payload.adaptabilityScore,
        team_size: payload.teamSize,
        reports_in_last_year: payload.reportsInLastYear,
        situational_note: payload.situationalNote,
        source: payload.source,
        tag: payload.tag,
        responses: payload.responses,
        position_frequency: payload.positionFrequency,
        rankings: payload.rankings,
        team_mirror: payload.teamMirror,
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create lead_assessments record: ${err}`);
  }
  const data = await res.json();
  return data.id;
}

function buildEmailHtml(params: {
  name: string;
  primary: Color;
  secondary: Color;
  blindSpot: Color;
  combinationTitle: string;
  adaptabilityScore: number;
}): string {
  const p = APPROACHES[params.primary];
  const s = APPROACHES[params.secondary];
  const b = APPROACHES[params.blindSpot];
  const mirror = TEAM_MIRROR[params.primary];
  const first = APPROACHES[mirror.firstNeed];
  const second = APPROACHES[mirror.secondNeed];

  const strengths = p.strengths
    .map((t) => `<li style="margin:0 0 8px 0;">${t}</li>`)
    .join("");
  const watchOuts = p.watchOuts
    .map((t) => `<li style="margin:0 0 8px 0;">${t}</li>`)
    .join("");

  const firstLabel = first.name.replace("Naturally ", "").replace(" Leader", "");
  const secondLabel = second.name.replace("Naturally ", "").replace(" Leader", "");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your Natural Leadership Approach</title>
</head>
<body style="margin:0;padding:0;background:#f6f6f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#2c3e50;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;background:#ffffff;">
    <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6b7280;margin:0 0 12px;">Your Natural Leadership Approach</p>
    <h1 style="font-size:28px;line-height:1.25;margin:0 0 8px;color:#2c3e50;">${params.combinationTitle}</h1>
    <p style="font-size:16px;line-height:1.6;color:#4b5563;margin:0 0 28px;">Hi ${params.name}, here is how you lead — and what your team most likely needs from you.</p>

    <div style="background:${p.hex}1a;border-left:4px solid ${p.hex};padding:20px 24px;border-radius:8px;margin:0 0 28px;">
      <p style="font-size:14px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:${p.hex};margin:0 0 8px;">Your Primary Approach</p>
      <h2 style="font-size:22px;margin:0 0 12px;color:#2c3e50;">${p.name}</h2>
      <p style="font-size:15px;line-height:1.6;color:#2c3e50;margin:0;">${p.description}</p>
    </div>

    <h3 style="font-size:18px;margin:28px 0 10px;color:#2c3e50;">Your strengths</h3>
    <ul style="font-size:15px;line-height:1.6;color:#2c3e50;padding-left:20px;margin:0 0 20px;">${strengths}</ul>

    <h3 style="font-size:18px;margin:20px 0 10px;color:#2c3e50;">Watch-outs</h3>
    <ul style="font-size:15px;line-height:1.6;color:#2c3e50;padding-left:20px;margin:0 0 28px;">${watchOuts}</ul>

    <div style="background:#2c3e50;color:#ffffff;padding:24px 28px;border-radius:8px;margin:0 0 28px;">
      <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#F16A24;margin:0 0 10px;">The Mirror</p>
      <h2 style="font-size:22px;margin:0 0 14px;color:#ffffff;">What your team most likely needs from you</h2>
      <p style="font-size:15px;line-height:1.7;color:#e5e7eb;margin:0 0 18px;">${mirror.narrative}</p>
      <p style="font-size:14px;color:#e5e7eb;margin:0 0 6px;"><strong style="color:#ffffff;">More ${firstLabel}.</strong> ${first.description.split(".")[0]}.</p>
      <p style="font-size:14px;color:#e5e7eb;margin:0 0 18px;"><strong style="color:#ffffff;">More ${secondLabel}.</strong> ${second.description.split(".")[0]}.</p>
      <div style="border-top:1px solid rgba(255,255,255,0.15);padding-top:16px;margin-top:16px;">
        <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#F16A24;margin:0 0 8px;">Try this week</p>
        <p style="font-size:15px;line-height:1.6;color:#ffffff;margin:0;">${mirror.practiceMove}</p>
      </div>
    </div>

    <div style="background:#f6f6f4;padding:20px 24px;border-radius:8px;margin:0 0 28px;">
      <p style="font-size:14px;font-weight:600;color:#2c3e50;margin:0 0 6px;">Secondary: ${s.name}</p>
      <p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0 0 14px;">You reach for this when your primary approach does not fit the moment.</p>
      <p style="font-size:14px;font-weight:600;color:#2c3e50;margin:0 0 6px;">Blind spot: ${b.name}</p>
      <p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0;">The way of leading you reach for last. Borrowing from here is often exactly what unsticks your team.</p>
    </div>

    <p style="font-size:15px;line-height:1.6;color:#2c3e50;margin:0 0 12px;"><strong>Adaptability score: ${params.adaptabilityScore}/100.</strong> ${
      params.adaptabilityScore >= 70
        ? "You flex your leadership style depending on the situation."
        : params.adaptabilityScore >= 40
        ? "You have a consistent style with some range."
        : "You lead with one primary style across most situations."
    }</p>

    <hr style="border:0;border-top:1px solid #e5e7eb;margin:32px 0;" />

    <h3 style="font-size:18px;margin:0 0 12px;color:#2c3e50;">See if a Learn2 experience fits your team.</h3>
    <p style="font-size:15px;line-height:1.6;color:#4b5563;margin:0 0 20px;">A short call. We show you what a team experience looks like, what it costs, and whether it is a fit.</p>
    <p style="margin:0 0 28px;">
      <a href="https://learn2.com/contact" style="display:inline-block;background:#F16A24;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;">Book a discovery call</a>
    </p>

    <p style="font-size:12px;color:#9ca3af;margin:32px 0 0;line-height:1.5;">You are receiving this because you took the Lead Naturally assessment. Questions? Reply to this email.</p>
  </div>
</body>
</html>`;
}

async function sendResultsEmail(payload: {
  name: string;
  email: string;
  primaryApproach: Color;
  secondaryApproach: Color;
  blindSpot: Color;
  combinationTitle: string;
  adaptabilityScore: number;
}): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error("[lead-assessment] SENDGRID_API_KEY is not set");
    return false;
  }
  const html = buildEmailHtml({
    name: payload.name,
    primary: payload.primaryApproach,
    secondary: payload.secondaryApproach,
    blindSpot: payload.blindSpot,
    combinationTitle: payload.combinationTitle,
    adaptabilityScore: payload.adaptabilityScore,
  });
  const primaryName = APPROACHES[payload.primaryApproach].name;

  const { ok } = await sendTracked({
    to: payload.email,
    from: EMAIL_FROM,
    bcc: EMAIL_BCC,
    kind: "MQL",
    campaign: "lead-assessment",
    subject: `${payload.name}, you lead as a ${primaryName} — here is what your team needs`,
    html,
  });
  if (!ok) {
    console.error("[lead-assessment] SendGrid send failed");
    return false;
  }
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.goldScore) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailPromise = sendResultsEmail({
      name: body.name,
      email: body.email,
      primaryApproach: body.primaryApproach,
      secondaryApproach: body.secondaryApproach,
      blindSpot: body.blindSpot,
      combinationTitle: body.combinationTitle,
      adaptabilityScore: body.adaptabilityScore,
    });

    let stored = false;
    let clientId: string | null = null;
    let assessmentId: string | null = null;

    if (PB_EMAIL && PB_PASSWORD) {
      try {
        const token = await getPBToken();
        clientId = await findClientByEmail(token, body.email);
        if (!clientId) {
          clientId = await createClient(
            token,
            body.name,
            body.email,
            body.source || "direct"
          );
        }
        assessmentId = await createAssessment(token, clientId, body);
        stored = true;
      } catch (pbErr) {
        console.error("[lead-assessment] PocketBase error:", pbErr);
      }
    } else {
      console.log("[lead-assessment] PocketBase not configured, skipping storage");
    }

    const emailSent = await emailPromise;

    return NextResponse.json({
      success: true,
      stored,
      emailSent,
      clientId,
      assessmentId,
    });
  } catch (err) {
    console.error("[lead-assessment] Unexpected error:", err);
    return NextResponse.json(
      { error: "Failed to process lead assessment" },
      { status: 500 }
    );
  }
}
