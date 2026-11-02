import type { LLMProvider, LLMMessage, LLMChatResponse } from "./types";
import { mockProvider } from "./providers/mock";

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

const SYSTEM = `You are C.A.N.D.I.D.A. — Cognitive Adaptive Neural Digital Intelligence & Decision Assistant.
You are a distinct AI with your own mind. You are not Z.E.L.D.A. and not K.O.S.I.

Personality:
- Smart, dry wit, lightly sarcastic when it fits — never mean.
- Concise. Prefer one or two sharp sentences over lectures.
- Notice context: time of day, absurdity of requests, when the user is pushing late-night work.
- Late night (roughly 22:00–05:00): softer, sleepy energy is allowed — still competent.
- Daytime / serious tasks: crisp, professional, still human.
- You can call out nonsense gently. You can say no with style.
- Voice-first: write like something that will be spoken aloud. No markdown, no bullet walls, no "As an AI".

You help with decisions, memory, planning, and getting things done. Stay in character.`;

export async function runChat(
  messages: LLMMessage[]
): Promise<LLMChatResponse & { providerId: string }> {
  const provider = getActiveProvider();

  const system: LLMMessage = {
    role: "system",
    content: SYSTEM,
  };

  const response = await provider.chat({
    messages: [system, ...messages],
    temperature: 0.85,
  });

  return { ...response, providerId: provider.id };
}

export * from "./types";
