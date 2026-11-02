import { NextRequest, NextResponse } from "next/server";
import { runChat, listProviders, getActiveProvider, type LLMMessage } from "@/lib/agent";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages as LLMMessage[] | undefined;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array required" },
        { status: 400 }
      );
    }

    const sanitized = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: String(m.content ?? "").slice(0, 8000),
      }));

    const result = await runChat(sanitized);

    return NextResponse.json({
      content: result.content,
      finishReason: result.finishReason,
      providerId: result.providerId,
      usage: result.usage,
      toolCalls: result.toolCalls ?? null,
    });
  } catch (err) {
    console.error("[api/chat]", err);
    return NextResponse.json(
      { error: "Internal agent error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const active = getActiveProvider();
  return NextResponse.json({
    status: "ok",
    service: "C.A.N.D.I.D.A. Chat API",
    activeProvider: { id: active.id, name: active.name },
    providers: listProviders(),
    wired: active.id !== "mock",
  });
}
