"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LivingLogo from "./LivingLogo";
import { useCandidaStore } from "@/lib/store";
import { speakCandida } from "@/lib/speak";

type StagePhase =
  | "idle"
  | "listening"
  | "awakening"
  | "armed"
  | "thinking"
  | "speaking";

const WAKE_PATTERNS = [
  /hey\s*candida/i,
  /hey\s*canada/i,
  /hey\s*candid/i,
  /hi\s*candida/i,
  /hi\s*canada/i,
  /ok\s*candida/i,
  /okay\s*candida/i,
];

function stripWake(text: string): string {
  let t = text.trim();
  for (const p of WAKE_PATTERNS) {
    t = t.replace(p, "").trim();
  }
  return t.replace(/^[,\.\-–—:\s]+/, "").trim();
}

function hasWake(text: string): boolean {
  return WAKE_PATTERNS.some((p) => p.test(text));
}

export default function AgentStage() {
  const {
    messages,
    addMessage,
    setAgentActivity,
    setListening: setStoreListening,
  } = useCandidaStore();

  const [phase, setPhase] = useState<StagePhase>("idle");
  const [statusLine, setStatusLine] = useState("");
  const [interim, setInterim] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const armedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef = useRef(phase);
  const shouldListenRef = useRef(true);
  const awakenLockRef = useRef(false);
  phaseRef.current = phase;

  const resumeListen = useCallback(() => {
    shouldListenRef.current = true;
    awakenLockRef.current = false;
    try {
      recognitionRef.current?.start();
    } catch {
      /* may already be running */
    }
    setPhase("listening");
    setStoreListening(true);
    setStatusLine("");
    setAgentActivity("Listening");
  }, [setAgentActivity, setStoreListening]);

  /** ROSE-style awaken: logo expands, presence holds, then spoken Yes? */
  const awaken = useCallback(async (): Promise<void> => {
    if (awakenLockRef.current) return;
    awakenLockRef.current = true;

    shouldListenRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    setStoreListening(false);

    setPhase("awakening");
    setStatusLine("");
    setAgentActivity("Awakening");

    // Hold on the living logo — like ROSE opening
    await new Promise((r) => setTimeout(r, 1400));

    setPhase("speaking");
    setAgentActivity("Speaking");
    await speakCandida("Yes?");

    setPhase("armed");
    setAgentActivity("Armed");
    shouldListenRef.current = true;
    try {
      recognitionRef.current?.start();
    } catch {
      /* ignore */
    }
    setStoreListening(true);

    if (armedTimeoutRef.current) clearTimeout(armedTimeoutRef.current);
    armedTimeoutRef.current = setTimeout(() => {
      if (phaseRef.current === "armed") {
        awakenLockRef.current = false;
        resumeListen();
      }
    }, 12000);
  }, [resumeListen, setAgentActivity, setStoreListening]);

  /** Voice-only reply — no text on screen */
  const runDirective = useCallback(
    async (raw: string) => {
      const q = stripWake(raw) || raw.trim();
      if (!q) return;

      if (armedTimeoutRef.current) clearTimeout(armedTimeoutRef.current);
      setInterim("");

      shouldListenRef.current = false;
      try {
        recognitionRef.current?.stop();
      } catch {
        /* ignore */
      }
      setStoreListening(false);

      setPhase("thinking");
      setStatusLine("");
      setAgentActivity("Reasoning");

      addMessage({ role: "user", content: q });

      let content = "";
      try {
        const history = [
          ...messages
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => ({ role: m.role, content: m.content })),
          { role: "user" as const, content: q },
        ];

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });

        if (!res.ok) throw new Error(`API ${res.status}`);

        const data = await res.json();
        content =
          data.content ??
          "I heard you, but I could not form a reply.";
      } catch {
        content = "I am having trouble reaching my core. Try again in a moment.";
      }

      addMessage({ role: "assistant", content });

      // Brief presence beat, then speak only
      setPhase("awakening");
      await new Promise((r) => setTimeout(r, 600));

      setPhase("speaking");
      setAgentActivity("Speaking");
      await speakCandida(content);

      setAgentActivity(null);
      awakenLockRef.current = false;
      resumeListen();
    },
    [addMessage, messages, resumeListen, setAgentActivity, setStoreListening]
  );

  const handleDirective = useCallback(
    (raw: string) => {
      runDirective(raw);
    },
    [runDirective]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SR =
      window.SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition })
        .webkitSpeechRecognition;

    if (!SR) {
      setVoiceError("Voice needs Chrome or Edge");
      return;
    }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript;
        else interimText += transcript;
      }

      if (interimText) setInterim(interimText);

      if (finalText) {
        setInterim("");
        const text = finalText.trim();
        const current = phaseRef.current;

        if (current === "listening") {
          if (hasWake(text)) {
            const rest = stripWake(text);
            if (rest.length > 2) {
              // Wake + command in one go: awaken briefly then answer
              (async () => {
                await awaken();
                if (armedTimeoutRef.current) clearTimeout(armedTimeoutRef.current);
                await runDirective(rest);
              })();
            } else {
              awaken();
            }
          }
        } else if (current === "armed") {
          if (armedTimeoutRef.current) clearTimeout(armedTimeoutRef.current);
          handleDirective(text);
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") {
        setVoiceError("Allow microphone once — then say Hey Candida");
        setPhase("idle");
        setStoreListening(false);
      } else if (event.error !== "aborted" && event.error !== "no-speech") {
        setVoiceError(`Voice: ${event.error}`);
      }
    };

    recognition.onend = () => {
      if (
        shouldListenRef.current &&
        (phaseRef.current === "listening" || phaseRef.current === "armed")
      ) {
        try {
          recognition.start();
        } catch {
          /* already running */
        }
      }
    };

    recognitionRef.current = recognition;

    const boot = () => {
      shouldListenRef.current = true;
      try {
        recognition.start();
        setPhase("listening");
        setStoreListening(true);
        setAgentActivity("Listening");
        setVoiceError(null);
      } catch {
        const once = () => {
          try {
            recognition.start();
            setPhase("listening");
            setStoreListening(true);
            setAgentActivity("Listening");
            setVoiceError(null);
          } catch {
            setVoiceError("Tap once anywhere to enable the mic");
          }
          window.removeEventListener("click", once);
          window.removeEventListener("touchstart", once);
        };
        window.addEventListener("click", once);
        window.addEventListener("touchstart", once);
        setVoiceError("Tap once anywhere to enable the mic");
      }
    };

    const t = setTimeout(boot, 400);

    return () => {
      clearTimeout(t);
      shouldListenRef.current = false;
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
      if (armedTimeoutRef.current) clearTimeout(armedTimeoutRef.current);
    };
  }, [
    awaken,
    handleDirective,
    runDirective,
    setAgentActivity,
    setStoreListening,
  ]);

  const intensity =
    phase === "awakening" || phase === "speaking"
      ? 1.12
      : phase === "armed" || phase === "thinking"
      ? 1.06
      : 1;

  const glowStrong =
    phase === "awakening" || phase === "speaking" || phase === "armed";

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#030305]">
      {/* ROSE-style void — strengthens on awaken */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          opacity: 1,
        }}
        style={{
          background: glowStrong
            ? "radial-gradient(ellipse 50% 42% at 50% 44%, rgba(255,45,106,0.22) 0%, transparent 65%)"
            : "radial-gradient(ellipse 50% 42% at 50% 44%, rgba(255,45,106,0.07) 0%, transparent 65%)",
        }}
        transition={{ duration: 1.2 }}
      />

      {/* Scanline sweep on awaken */}
      <AnimatePresence>
        {phase === "awakening" && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-candida-magenta/80 to-transparent"
            initial={{ top: "20%", opacity: 0 }}
            animate={{ top: "80%", opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* Living logo — center stage, grows on awaken like ROSE */}
      <motion.div
        className="relative z-10"
        animate={{
          scale: intensity,
          filter:
            phase === "awakening"
              ? "brightness(1.25)"
              : phase === "speaking"
              ? "brightness(1.15)"
              : "brightness(1)",
        }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <LivingLogo size="xl" label="CANDIDA" active />
      </motion.div>

      {/* Minimal status — no reply text */}
      <div className="mt-12 min-h-[3rem] px-4 text-center">
        <AnimatePresence mode="wait">
          {(phase === "awakening" ||
            phase === "speaking" ||
            phase === "thinking" ||
            phase === "armed") && (
            <motion.p
              key={phase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-semibold uppercase tracking-[0.35em] text-candida-magenta/90"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {phase === "awakening"
                ? "Awakening"
                : phase === "speaking"
                ? "Speaking"
                : phase === "thinking"
                ? "…"
                : phase === "armed"
                ? "Listening"
                : ""}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Live transcript only while user is speaking — not her replies */}
        {interim && (phase === "listening" || phase === "armed") && (
          <p className="mt-2 text-xs text-zinc-600">…</p>
        )}

        {voiceError && (
          <p className="mt-3 text-xs text-amber-400/90">{voiceError}</p>
        )}
      </div>

      {/* No text input — pure voice presence like ROSE */}
    </div>
  );
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}
declare var SpeechRecognition: {
  new (): SpeechRecognition;
};
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}
