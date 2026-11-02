export type SpeakMood = "sleepy" | "pro";

/**
 * C.A.N.D.I.D.A. speech via ElevenLabs.
 * mood: sleepy (soft, late) | pro (crisper daytime / task mode)
 */
export async function speakCandida(
  text: string,
  mood: SpeakMood = "pro"
): Promise<boolean> {
  const clean = text.trim();
  if (!clean || typeof window === "undefined") return false;

  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: clean, mood }),
    });

    if (!res.ok) return false;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

    await new Promise<void>((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("audio play failed"));
      };
      audio.play().catch(reject);
    });

    return true;
  } catch {
    return false;
  }
}

/** Prefer sleepy voice late night (local browser time). */
export function moodFromLocalHour(): SpeakMood {
  const h = new Date().getHours();
  return h >= 22 || h < 5 ? "sleepy" : "pro";
}
