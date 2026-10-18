import type { LLMProvider, LLMMessage, LLMChatResponse } from "./types";
import { mockProvider } from "./providers/mock";

/**
 * Provider registry. Swap mock for real providers in Phase 2.
 * Order = preference. First healthy provider wins.
 */
const providers: LLMProvider[] = [mockProvider];

export function registerProvider(provider: LLMProvider) {
  const idx = providers.findIndex((p) => p.id === provider.id);
  if (idx >= 0) providers[idx] = provider;
  else providers.unshift(provider);
}

export function getActiveProvider(): LLMProvider {
  return providers[0] ?? mockProvider;
}

export function listProviders(): { id: string; name: string }[] {
  return providers.map((p) => ({ id: p.id, name: p.name }));
}

/**
 * Minimal chat path used by the API route.
 * Full agent loop (perceive → reason → plan → act → …) comes next.
 */
export async function runChat(
  messages: LLMMessage[]
): Promise<LLMChatResponse & { providerId: string }> {
  const provider = getActiveProvider();

  const system: LLMMessage = {
    role: "system",
    content: `You are C.A.N.D.I.D.A. — Cognitive Adaptive Neural Digital Intelligence & Decision Assistant.
You are the cognitive core of a Jarvis-class system. Be concise, proactive, and action-oriented.
Architecture: agent loop, memory tiers (working/episodic/semantic/procedural), Omni-Link tools.
Current stage: Phase 2 scaffolding. Real tool execution is coming online.`,
  };

  const response = await provider.chat({
    messages: [system, ...messages],
    temperature: 0.7,
  });

  return { ...response, providerId: provider.id };
}

export * from "./types";
