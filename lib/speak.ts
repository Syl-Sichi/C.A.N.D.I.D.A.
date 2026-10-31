/**
 * Play C.A.N.D.I.D.A. speech via ElevenLabs (/api/tts).
 * Returns false if TTS is unavailable so callers can fall back silently.
 */
export async function speakCandida(text: string): Promise<boolean> {
  const clean = text.trim();
  if (!clean || typeof window === "undefined") return false;

  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: clean }),
    });

    if (!res.ok) {
      // 503 = key missing — fail quietly in UI
      return false;
    }

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
