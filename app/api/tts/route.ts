import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * C.A.N.D.I.D.A. only — ElevenLabs TTS
 * Soft / sleepy delivery (not shared with Z.E.L.D.A. or K.O.S.I.)
 *
 * Env:
 *   ELEVENLABS_API_KEY
 *   ELEVENLABS_VOICE_ID  (optional)
 *   ELEVENLABS_MODEL_ID  (optional)
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
  try {
    const body = await req.json();
    text = String(body.text ?? "").trim();
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
        // Sleepy / soft: high stability, low style, no hard boost
        voice_settings: {
          stability: 0.78,
          similarity_boost: 0.65,
          style: 0.12,
          use_speaker_boost: false,
        },
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
