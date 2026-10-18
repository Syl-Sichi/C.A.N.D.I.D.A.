import type { LLMProvider, LLMChatOptions, LLMChatResponse } from "../types";

const REPLIES = [
  "Directive received. I've consulted working and semantic memory. Next logical step is wiring a real LLM provider — K.O.S.I. is noted as preferred.",
  "Cross-referenced with your architecture. The agent loop is defined; this response is still mock. Phase 2 will replace me with a live model.",
  "Acknowledged. Tool-calling skeleton is in place. Once a provider is connected, I can plan and act instead of only reply.",
  "System ready. Memory tiers and Omni-Link contracts are formalized. Standing by for real inference.",
];

/**
 * Mock provider — used until OpenAI / Anthropic / K.O.S.I. is configured.
 * Keeps the chat API and agent loop testable offline.
 */
export const mockProvider: LLMProvider = {
  id: "mock",
  name: "C.A.N.D.I.D.A. Mock Reasoner",

  async chat(options: LLMChatOptions): Promise<LLMChatResponse> {
    // Simulate latency
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));

    const lastUser = [...options.messages]
      .reverse()
      .find((m) => m.role === "user");

    const content =
      REPLIES[Math.floor(Math.random() * REPLIES.length)] +
      (lastUser
        ? `\n\n(Re: "${lastUser.content.slice(0, 80)}${lastUser.content.length > 80 ? "…" : ""}")`
        : "");

    return {
      content,
      finishReason: "stop",
      usage: { promptTokens: 120, completionTokens: 64 },
    };
  },
};
