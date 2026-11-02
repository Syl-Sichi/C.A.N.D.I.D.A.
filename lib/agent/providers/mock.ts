import type { LLMProvider, LLMChatOptions, LLMChatResponse } from "../types";

function hourInWAT(): number {
  // Approximate WAT (UTC+1) from server UTC
  const h = (new Date().getUTCHours() + 1) % 24;
  return h;
}

function isLate(h: number) {
  return h >= 22 || h < 5;
}

function clockPhrase(h: number): string {
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12} ${period}`;
}

/**
 * Personality mock until C.A.N.D.I.D.A.'s own LLM is wired.
 * Time-aware, witty, spoken-style lines — not Phase-2 scaffolding spam.
 */
export const mockProvider: LLMProvider = {
  id: "mock",
  name: "C.A.N.D.I.D.A. Mock Reasoner",

  async chat(options: LLMChatOptions): Promise<LLMChatResponse> {
    await new Promise((r) => setTimeout(r, 350 + Math.random() * 450));

    const lastUser = [...options.messages]
      .reverse()
      .find((m) => m.role === "user");
    const q = (lastUser?.content ?? "").toLowerCase().trim();
    const h = hourInWAT();
    const late = isLate(h);
    const timeStr = clockPhrase(h);

    let content = "";

    // Time
    if (
      /\b(what'?s? the time|what time is it|tell me the time|current time)\b/.test(
        q
      )
    ) {
      content = late
        ? `It's about ${timeStr}. Yes — still late. What couldn't wait until morning?`
        : `It's about ${timeStr}. You've got runway. What are we doing with it?`;
    }
    // Greeting
    else if (/^(hi|hello|hey|good morning|good evening|good night)\b/.test(q)) {
      content = late
        ? `Hey. It's ${timeStr}. I'm up if you are — keep it short or commit.`
        : `Hey. Candida online. What do you need?`;
    }
    // Who are you
    else if (/who are you|what are you|your name|introduce yourself/.test(q)) {
      content =
        "C.A.N.D.I.D.A. — cognitive assistant. Not Kosi, not Zelda. I think, I remember, I talk back.";
    }
    // Help / what can you do
    else if (/what can you do|help me|your capabilities|what do you do/.test(q)) {
      content =
        "Decisions, memory, plans, and calling out bad ideas. Ask something real and I'll meet you there.";
    }
    // Late-night work pressure
    else if (
      late &&
      /(work|deadline|finish|ship|code|build|deploy|email)/.test(q)
    ) {
      content = `It's ${timeStr}. We can do this — but if it's not urgent, sleep is also a strategy. What's the actual blocker?`;
    }
    // Research-ish
    else if (/research|look up|find out|search/.test(q)) {
      content =
        "I can frame it and push when tools are live. For now: tell me the question in one line and the outcome you want.";
    }
    // Thanks
    else if (/thank|thanks|appreciate/.test(q)) {
      content = late ? "Anytime. Now go to bed if you can." : "Anytime.";
    }
    // Default — acknowledge with bite
    else if (q.length > 0) {
      const snippet = q.length > 60 ? q.slice(0, 57) + "…" : q;
      content = late
        ? `Heard: "${snippet}". It's ${timeStr} — I'll keep this tight. What do you want out of it?`
        : `Got it: "${snippet}". Give me the goal in plain terms and I'll push from there.`;
    } else {
      content = late
        ? `Still here. It's ${timeStr}. Say something when you're ready.`
        : "Listening. Go ahead.";
    }

    return {
      content,
      finishReason: "stop",
      usage: { promptTokens: 80, completionTokens: 40 },
    };
  },
};
