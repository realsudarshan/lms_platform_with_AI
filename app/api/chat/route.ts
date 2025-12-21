import { tutorAgent } from "@/lib/ai/tutor-agent";
import { auth } from "@clerk/nextjs/server";
import { createAgentUIStreamResponse, type UIMessage } from "ai";

export async function POST(request: Request) {
    // Verify user is authenticated and has Ultra plan
    const { has, userId } = await auth();

    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    if (!has?.({ plan: "ultra" })) {
        return new Response("Ultra membership required", { status: 403 });
    }

    const { messages }: { messages: UIMessage[] } = await request.json();

    try {
        return createAgentUIStreamResponse({
            agent: tutorAgent as any,
            uiMessages: messages,
        });
    } catch (error) {
        console.error("[Chat API] Error:", error);
        throw error;
    }
}