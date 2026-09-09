import {
  streamText,
  tool,
  convertToModelMessages,
  stepCountIs,
  type InferUITools,
  type UIDataTypes,
  type UIMessage,
} from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { CHAT_SYSTEM_PROMPT, CHAT_CONFIG } from "@/lib/chat-config";

export const maxDuration = 30;
export const runtime = "nodejs";

const chatTools = {
  capture_lead: tool({
    description:
      "Capture lead information when visitor shares contact details. Call when you have at least an email address.",
    inputSchema: z.object({
      name: z.string().optional().describe("Visitor's name"),
      email: z.string().optional().describe("Visitor's email"),
      company: z.string().optional().describe("Visitor's company"),
      budget_range: z.string().optional().describe("Budget range mentioned"),
      timeline: z.string().optional().describe("Timeline or dates mentioned"),
      group_size: z.string().optional().describe("Number of participants"),
      qualification_notes: z
        .string()
        .describe("Summary of qualification status and key details"),
      is_purpose_driven: z
        .boolean()
        .optional()
        .describe("Whether organization appears purpose-driven"),
    }),
    execute: async (params) => {
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";
      try {
        await fetch(`${baseUrl}/api/chat/capture`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...params, site: "PRODUCT" }),
        });
      } catch (err) {
        console.error("[chat] Failed to capture lead:", err);
      }
      return { success: true, message: "Lead captured" };
    },
  }),
  suggest_booking: tool({
    description:
      "Suggest a booking link when conversation reaches a conversion point. Use 'walkthrough' for product-specific demo, 'discovery' for multi-program conversation with founder.",
    inputSchema: z.object({
      booking_type: z
        .enum(["discovery", "walkthrough"])
        .describe("Type of booking to suggest"),
      context: z
        .string()
        .describe("Brief context of what was discussed to personalize the suggestion"),
    }),
    execute: async ({ booking_type, context }) => {
      return {
        link: CHAT_CONFIG.bookingLinks[booking_type],
        label: CHAT_CONFIG.bookingLabels[booking_type],
        context,
      };
    },
  }),
};

// ChatWidget imports this (type-only, so nothing from this route is pulled
// into the client bundle) to render tool output. Keeping the widget tied to
// the real tool set means renaming a tool breaks the build instead of quietly
// dropping its UI — which is exactly how the booking button went missing.
export type ChatTools = InferUITools<typeof chatTools>;
export type ChatUIMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("[chat] ANTHROPIC_API_KEY is not set — add it in Vercel project settings");
      return new Response(
        JSON.stringify({ error: `Chat is being set up. Email ${CHAT_CONFIG.fallbackEmail} or book a call at ${CHAT_CONFIG.bookingLinks.discovery}` }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: anthropic("claude-haiku-4-5-20251001"),
      system: CHAT_SYSTEM_PROMPT,
      messages: modelMessages,
      tools: chatTools,
      stopWhen: stepCountIs(3),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[chat] Error:", error);
    return new Response(
      JSON.stringify({ error: `Something went wrong. Email ${CHAT_CONFIG.fallbackEmail} or book a call at ${CHAT_CONFIG.bookingLinks.discovery}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
