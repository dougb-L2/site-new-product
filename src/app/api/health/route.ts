export const runtime = "nodejs";

export async function GET() {
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

  return Response.json({
    status: hasApiKey ? "ok" : "misconfigured",
    chat: hasApiKey ? "ready" : "ANTHROPIC_API_KEY not set",
    timestamp: new Date().toISOString(),
  });
}
