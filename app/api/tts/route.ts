import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * C.A.N.D.I.D.A. only — ElevenLabs TTS
 * body: { text, mood?: "sleepy" | "pro" }
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "ELEVENLABS_API_KEY not set",
        hint: "Add it to .env.local and restart the dev server",
      },
      { status: 503 }
    );
  }

  let text = "";
  let mood: "sleepy" | "pro" = "pro";
  try {
    const body = await req.json();
    text = String(body.text ?? "").trim();
    if (body.mood === "sleepy" || body.mood === "pro") mood = body.mood;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!text) {
    return NextResponse.json({ error: "text required" }, { status: 400 });
  }

  const clipped = text.slice(0, 2500);
  const voiceId =
    process.env.ELEVENLABS_VOICE_ID?.trim() || "21m00Tcm4TlvDq8ikWAM";
  const modelId =
    process.env.ELEVENLABS_MODEL_ID?.trim() || "eleven_turbo_v2_5";

  // Sleepy = soft / low energy. Pro = clearer, more present.
  const voice_settings =
    mood === "sleepy"
      ? {
          stability: 0.82,
          similarity_boost: 0.6,
          style: 0.08,
          use_speaker_boost: false,
        }
      : {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.35,
          use_speaker_boost: true,
        };

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: clipped,
        model_id: modelId,
        voice_settings,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[api/tts] ElevenLabs", res.status, errText.slice(0, 400));
      return NextResponse.json(
        {
          error: "ElevenLabs request failed",
          status: res.status,
          detail: errText.slice(0, 200),
        },
        { status: 502 }
      );
    }

    const audio = await res.arrayBuffer();
    return new NextResponse(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[api/tts]", err);
    return NextResponse.json({ error: "TTS upstream error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "C.A.N.D.I.D.A. TTS",
    provider: "ElevenLabs",
    configured: Boolean(process.env.ELEVENLABS_API_KEY),
    voiceId: process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM",
  });
}
