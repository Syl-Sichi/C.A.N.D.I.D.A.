import type { LLMProvider, LLMChatOptions, LLMChatResponse, LLMMessage } from "../types";

/**
 * C.A.N.D.I.D.A.'s own model — OpenAI-compatible chat completions.
 * Env (C.A.N.D.I.D.A. only — not K.O.S.I. / Z.E.L.D.A.):
 *   CANDIDA_LLM_API_KEY   (or OPENAI_API_KEY)
 *   CANDIDA_LLM_BASE_URL  (default https://api.openai.com/v1)
 *   CANDIDA_LLM_MODEL     (default gpt-4o-mini)
 */
export function createCandidaLLMProvider(): LLMProvider | null {
  const apiKey =
    process.env.CANDIDA_LLM_API_KEY?.trim() ||
    process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  const baseURL = (
    process.env.CANDIDA_LLM_BASE_URL?.trim() || "https://api.openai.com/v1"
  ).replace(/\/$/, "");
  const model =
    process.env.CANDIDA_LLM_MODEL?.trim() || "gpt-4o-mini";

  return {
    id: "candida-llm",
    name: `C.A.N.D.I.D.A. LLM (${model})`,

    async chat(options: LLMChatOptions): Promise<LLMChatResponse> {
      const messages = options.messages.map((m: LLMMessage) => ({
        role: m.role === "tool" ? "assistant" : m.role,
        content: m.content,
      }));

      const res = await fetch(`${baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options.temperature ?? 0.85,
          max_tokens: options.maxTokens ?? 600,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        console.error("[candida-llm]", res.status, errBody.slice(0, 400));
        throw new Error(`C.A.N.D.I.D.A. LLM error ${res.status}`);
      }

      const data = await res.json();
      const choice = data.choices?.[0];
      const content =
        choice?.message?.content?.trim() ||
        "I drew a blank. Say that again?";

      return {
        content,
        finishReason:
          choice?.finish_reason === "length" ? "length" : "stop",
        usage: data.usage
          ? {
              promptTokens: data.usage.prompt_tokens ?? 0,
              completionTokens: data.usage.completion_tokens ?? 0,
            }
          : undefined,
      };
    },
  };
}
