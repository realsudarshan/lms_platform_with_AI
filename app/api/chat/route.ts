import { tutorAgent } from "@/lib/ai/tutor-agent";
import { auth } from "@clerk/nextjs/server";
import { createAgentUIStreamResponse, type UIMessage } from "ai";

export async function POST(request: Request) {
    console.log("=== [Chat API] Request received ===");

    // Verify user is authenticated and has Ultra plan
    const { has, userId } = await auth();
    console.log("[Chat API] User ID:", userId);
    console.log("[Chat API] Has Ultra plan:", has?.({ plan: "ultra" }));

    if (!userId) {
        console.log("[Chat API] ❌ Unauthorized - no user ID");
        return new Response("Unauthorized", { status: 401 });
    }

    if (!has?.({ plan: "ultra" })) {
        console.log("[Chat API] ❌ Forbidden - not Ultra member");
        return new Response("Ultra membership required", { status: 403 });
    }

    const { messages }: { messages: UIMessage[] } = await request.json();
    console.log("[Chat API] Messages count:", messages.length);
    console.log("[Chat API] Last message:", messages[messages.length - 1]);
    console.log("[Chat API] OpenRouter API Key exists:", !!process.env.OPENROUTER_API_KEY);
    console.log("[Chat API] OpenRouter API Key length:", process.env.OPENROUTER_API_KEY?.length || 0);

    try {
        console.log("[Chat API] Creating agent stream response...");
        const response = createAgentUIStreamResponse({
            agent: tutorAgent as any,
            uiMessages: messages,
        });
        console.log("[Chat API] ✅ Stream response created successfully");
        return response;
    } catch (error) {
        console.error("[Chat API] ❌ Error creating stream:", error);
        console.error("[Chat API] Error details:", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });
        throw error;
    }
}