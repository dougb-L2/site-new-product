import { NextRequest, NextResponse } from "next/server";

const PB_URL = process.env.POCKETBASE_URL || "http://127.0.0.1:8090";
const PB_EMAIL = process.env.POCKETBASE_EMAIL || "";
const PB_PASSWORD = process.env.POCKETBASE_PASSWORD || "";

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
      notes: "Created via Naturally Assessment",
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
  const res = await fetch(`${PB_URL}/api/collections/assessments/records`, {
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
      leader_type: payload.leaderType,
      sell_influence: payload.sellInfluence,
      source: payload.source,
      tag: payload.tag,
      responses: payload.responses,
      position_frequency: payload.positionFrequency,
      rankings: payload.rankings,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create assessment: ${err}`);
  }
  const data = await res.json();
  return data.id;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.goldScore) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Skip PocketBase if not configured
    if (!PB_EMAIL || !PB_PASSWORD) {
      console.log("PocketBase not configured, skipping storage");
      return NextResponse.json({ success: true, stored: false });
    }

    const token = await getPBToken();

    // Find or create client
    let clientId = await findClientByEmail(token, body.email);
    if (!clientId) {
      clientId = await createClient(
        token,
        body.name,
        body.email,
        body.source || "direct"
      );
    }

    // Create assessment record
    const assessmentId = await createAssessment(token, clientId, body);

    // Forward to n8n webhook if configured (for email/PDF/nurture)
    const n8nUrl = process.env.N8N_ASSESSMENT_WEBHOOK_URL;
    if (n8nUrl) {
      fetch(n8nUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          clientId,
          assessmentId,
          event: "assessment.completed",
        }),
      }).catch((err) =>
        console.error("n8n webhook failed:", err.message)
      );
    }

    return NextResponse.json({
      success: true,
      stored: true,
      clientId,
      assessmentId,
    });
  } catch (err) {
    console.error("Assessment API error:", err);
    return NextResponse.json(
      { error: "Failed to process assessment" },
      { status: 500 }
    );
  }
}
