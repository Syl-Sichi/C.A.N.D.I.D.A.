"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X } from "lucide-react";
import LivingLogo from "./LivingLogo";
import ResearchReport, { DEMO_REPORT } from "./ResearchReport";
import { useCandidaStore } from "@/lib/store";
import { speakCandida } from "@/lib/speak";

type StagePhase = "idle" | "listening" | "armed" | "thinking" | "answered" | "report";

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

function wantsResearchReport(q: string): boolean {
  return /research\s+report|full\s+report|hud\s+report|demo\s+report/i.test(q);
}

export default function AgentStage() {
  const {
    messages,
    addMessage,
    openResearchReport,
    closeResearchReport,
    researchReport,
    setAgentActivity,
    setListening: setStoreListening,
  } = useCandidaStore();

  const [phase, setPhase] = useState<StagePhase>("idle");
  const [input, setInput] = useState("");
  const [statusLine, setStatusLine] = useState('Say "Hey Candida"…');
  const [interim, setInterim] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [micReady, setMicReady] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const armedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef = useRef(phase);
  const shouldListenRef = useRef(true);
  phaseRef.current = phase;

  const resumeListen = useCallback(() => {
    shouldListenRef.current = true;
    try {
      recognitionRef.current?.start();
    } catch {
      /* may already be running */
    }
    setPhase("listening");
    setStoreListening(true);
    setStatusLine('Listening… say "Hey Candida"');
    setAgentActivity("Listening");
  }, [setAgentActivity, setStoreListening]);

  const runDirective = useCallback(
    async (raw: string) => {
      const q = stripWake(raw) || raw.trim();
      if (!q) return;

      setInput("");
      setLastQuery(q);
      setAnswer(null);
      setInterim("");

      if (wantsResearchReport(q)) {
        shouldListenRef.current = false;
        try {
          recognitionRef.current?.stop();
        } catch {
          /* ignore */
        }
        setStoreListening(false);
        setPhase("thinking");
        setStatusLine("Building research surface…");
        setAgentActivity("Report presentation");
        await new Promise((r) => setTimeout(r, 800));
        openResearchReport(DEMO_REPORT);
        setPhase("report");
        return;
      }

      shouldListenRef.current = false;
      try {
        recognitionRef.current?.stop();
      } catch {
        /* ignore */
      }
      setStoreListening(false);

      setPhase("thinking");
      setStatusLine("Reasoning…");
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
          "I received that, but the agent core returned an empty response.";

        addMessage({ role: "assistant", content });
        setAnswer(content);
        setPhase("answered");
        setStatusLine("Speaking…");
        setAgentActivity("Speaking");
        setSpeaking(true);

        // ROSE-class voice via ElevenLabs
        await speakCandida(content);
        setSpeaking(false);
        setStatusLine("Response ready");
        setAgentActivity(null);
      } catch {
        content =
          "Agent core unreachable. Check that the dev server is running and /api/chat is healthy.";
        addMessage({ role: "assistant", content });
        setAnswer(content);
        setPhase("answered");
        setStatusLine("Connection issue");
        setAgentActivity(null);
        setSpeaking(false);
      }

      setTimeout(() => {
        if (phaseRef.current === "answered") {
          resumeListen();
        }
      }, 4000);
    },
    [
      addMessage,
      messages,
      openResearchReport,
      resumeListen,
      setAgentActivity,
      setStoreListening,
    ]
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
              handleDirective(text);
            } else {
              setPhase("armed");
              setStatusLine("Yes?");
              setAgentActivity("Armed");
              if (armedTimeoutRef.current) clearTimeout(armedTimeoutRef.current);
              armedTimeoutRef.current = setTimeout(() => {
                if (phaseRef.current === "armed") {
                  setPhase("listening");
                  setStatusLine('Say "Hey Candida"…');
                  setAgentActivity("Listening");
                }
              }, 10000);
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
        setVoiceError("Allow microphone once — then just say Hey Candida");
        setMicReady(false);
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
        setMicReady(true);
        setPhase("listening");
        setStoreListening(true);
        setStatusLine('Listening… say "Hey Candida"');
        setAgentActivity("Listening");
        setVoiceError(null);
      } catch {
        const once = () => {
          try {
            recognition.start();
            setMicReady(true);
            setPhase("listening");
            setStoreListening(true);
            setStatusLine('Listening… say "Hey Candida"');
            setAgentActivity("Listening");
            setVoiceError(null);
          } catch {
            setVoiceError("Tap once anywhere to enable the mic, then say Hey Candida");
          }
          window.removeEventListener("click", once);
          window.removeEventListener("touchstart", once);
        };
        window.addEventListener("click", once);
        window.addEventListener("touchstart", once);
        setVoiceError("Tap once anywhere to enable the mic, then say Hey Candida");
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
  }, [handleDirective, setAgentActivity, setStoreListening]);

  useEffect(() => {
    if (researchReport) setPhase("report");
  }, [researchReport]);

  const handleSubmit = () => {
    const q = input.trim();
    if (!q) return;
    setInput("");
    runDirective(q);
  };

  const handleCloseReport = () => {
    closeResearchReport();
    setAgentActivity(null);
    resumeListen();
  };

  const dismissAnswer = () => {
    setAnswer(null);
    setLastQuery(null);
    resumeListen();
  };

  const isVoiceActive = phase === "listening" || phase === "armed";

  if (phase === "report" && researchReport) {
    return (
      <div className="relative h-full w-full">
        <ResearchReport data={researchReport} onClose={handleCloseReport} />
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#030305]">
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-700"
        style={{
          background: isVoiceActive || speaking
            ? "radial-gradient(ellipse 55% 45% at 50% 42%, rgba(255,45,106,0.14) 0%, transparent 70%)"
            : "radial-gradient(ellipse 55% 45% at 50% 42%, rgba(255,45,106,0.06) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="relative z-10"
        animate={{
          scale: phase === "thinking" || speaking ? 1.06 : phase === "armed" ? 1.04 : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        <LivingLogo size="xl" label="CANDIDA" active />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={statusLine + (interim || "")}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mt-10 max-w-lg px-4 text-center"
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.28em] text-candida-magenta/90"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {speaking
              ? "Speaking"
              : phase === "thinking"
              ? "Reasoning"
              : phase === "answered"
              ? "Response"
              : phase === "armed"
              ? "Armed"
              : phase === "listening"
              ? "Listening"
              : "C.A.N.D.I.D.A."}
          </p>
          <p className="mt-2 text-sm text-zinc-400">{statusLine}</p>
          {interim && (
            <p className="mt-2 text-xs italic text-candida-accent/80">“{interim}”</p>
          )}
          {voiceError && (
            <p className="mt-2 text-xs text-amber-400/90">{voiceError}</p>
          )}
          {micReady && phase === "listening" && !voiceError && (
            <p className="mt-3 text-[10px] text-zinc-600">
              Always listening — she answers and speaks (ElevenLabs).
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {(phase === "answered" || phase === "thinking") && (answer || lastQuery) && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            className="absolute bottom-28 left-1/2 z-20 w-[min(92vw,28rem)] -translate-x-1/2 rounded-xl border border-candida-border bg-candida-panel/95 p-4 backdrop-blur-md"
            style={{ boxShadow: "0 0 48px rgba(255, 45, 106, 0.12)" }}
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-candida-magenta">
                  {speaking
                    ? "Speaking"
                    : phase === "thinking"
                    ? "Processing"
                    : "C.A.N.D.I.D.A."}
                </p>
                {lastQuery && (
                  <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                    Re: {lastQuery}
                  </p>
                )}
              </div>
              {phase === "answered" && !speaking && (
                <button
                  onClick={dismissAnswer}
                  className="rounded p-1 text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {phase === "thinking" && !answer ? (
              <div className="flex items-center gap-2 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-candida-magenta [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-candida-magenta [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-candida-magenta [animation-delay:300ms]" />
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">
                {answer}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {(phase === "idle" || phase === "listening" || phase === "armed") && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-10 left-1/2 z-10 w-full max-w-md -translate-x-1/2 px-4"
        >
          <div
            className={`flex items-center gap-2 rounded-full border bg-candida-panel/60 px-4 py-2.5 backdrop-blur-md ${
              isVoiceActive
                ? "border-candida-magenta/50 shadow-[0_0_28px_rgba(255,45,106,0.2)]"
                : "border-candida-border/60"
            }`}
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                isVoiceActive ? "animate-pulse bg-candida-magenta" : "bg-zinc-600"
              }`}
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Ask Candida anything…"
              className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
            />
            <button
              onClick={handleSubmit}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-candida-magenta/20 text-candida-magenta transition hover:bg-candida-magenta/30"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
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
