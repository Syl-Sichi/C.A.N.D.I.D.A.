"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send } from "lucide-react";
import LivingLogo from "./LivingLogo";
import ResearchReport, { DEMO_REPORT } from "./ResearchReport";
import { useCandidaStore } from "@/lib/store";

type StagePhase = "idle" | "listening" | "armed" | "working" | "report";

// Wake phrases — include common mishears
const WAKE_PATTERNS = [
  /hey\s*candida/i,
  /hey\s*canada/i,
  /hey\s*candid/i,
  /hi\s*candida/i,
  /ok\s*candida/i,
  /okay\s*candida/i,
];

function stripWake(text: string): string {
  let t = text.trim();
  for (const p of WAKE_PATTERNS) {
    t = t.replace(p, "").trim();
  }
  // drop leading punctuation / filler
  t = t.replace(/^[,\.\-–—:\s]+/, "").trim();
  return t;
}

function hasWake(text: string): boolean {
  return WAKE_PATTERNS.some((p) => p.test(text));
}

export default function AgentStage() {
  const {
    openResearchReport,
    closeResearchReport,
    researchReport,
    setAgentActivity,
    setListening: setStoreListening,
  } = useCandidaStore();

  const [phase, setPhase] = useState<StagePhase>("idle");
  const [input, setInput] = useState("");
  const [statusLine, setStatusLine] = useState('Say "Hey Candida" or type a directive');
  const [progress, setProgress] = useState({ blocks: 0, sources: 0 });
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [interim, setInterim] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const armedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const runResearchSequence = useCallback(
    async (query?: string) => {
      // stop listening while working
      try {
        recognitionRef.current?.stop();
      } catch {
        /* ignore */
      }
      setStoreListening(false);

      setPhase("working");
      setStatusLine(query ? `Researching: ${query}` : "Starting research agent");
      setAgentActivity("Research agent active");
      setProgress({ blocks: 0, sources: 0 });
      setInterim("");

      const steps = [
        { delay: 600, blocks: 0, sources: 0, line: "Starting research agent" },
        { delay: 900, blocks: 2, sources: 8, line: "Gathering sources…" },
        { delay: 800, blocks: 5, sources: 18, line: "Synthesizing blocks…" },
        { delay: 700, blocks: 9, sources: 31, line: "Building report surface…" },
        { delay: 600, blocks: 13, sources: 42, line: "Report complete" },
      ];

      for (const step of steps) {
        await new Promise((r) => setTimeout(r, step.delay));
        setProgress({ blocks: step.blocks, sources: step.sources });
        setStatusLine(step.line);
      }

      await new Promise((r) => setTimeout(r, 400));
      openResearchReport(DEMO_REPORT);
      setPhase("report");
      setAgentActivity("Report presentation");
    },
    [openResearchReport, setAgentActivity, setStoreListening]
  );

  const handleDirective = useCallback(
    (raw: string) => {
      const q = stripWake(raw) || raw.trim() || "State of VR";
      setInput("");
      runResearchSequence(q);
    },
    [runResearchSequence]
  );

  // Init Web Speech API
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SR =
      window.SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition })
        .webkitSpeechRecognition;

    if (!SR) {
      setVoiceSupported(false);
      setVoiceError("Voice not supported in this browser — use Chrome or Edge");
      return;
    }

    setVoiceSupported(true);
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
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
              // wake + command in one utterance
              handleDirective(text);
            } else {
              // wake only — arm for command
              setPhase("armed");
              setStatusLine("Listening for directive…");
              setAgentActivity("Armed — speak your directive");
              if (armedTimeoutRef.current) clearTimeout(armedTimeoutRef.current);
              armedTimeoutRef.current = setTimeout(() => {
                if (phaseRef.current === "armed") {
                  setPhase("listening");
                  setStatusLine('Say "Hey Candida" or type a directive');
                  setAgentActivity(null);
                }
              }, 8000);
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
        setVoiceError("Microphone permission denied");
        setPhase("idle");
        setStoreListening(false);
      } else if (event.error !== "aborted" && event.error !== "no-speech") {
        setVoiceError(`Voice error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      // Auto-restart if we should still be listening
      if (phaseRef.current === "listening" || phaseRef.current === "armed") {
        try {
          recognition.start();
        } catch {
          /* already started */
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
      if (armedTimeoutRef.current) clearTimeout(armedTimeoutRef.current);
    };
  }, [handleDirective, setAgentActivity, setStoreListening]);

  // Sync report phase from store
  useEffect(() => {
    if (researchReport) setPhase("report");
  }, [researchReport]);

  const startListening = () => {
    setVoiceError(null);
    if (!recognitionRef.current) {
      setVoiceError("Voice not available");
      return;
    }
    try {
      recognitionRef.current.start();
      setPhase("listening");
      setStoreListening(true);
      setStatusLine('Listening… say "Hey Candida"');
      setAgentActivity("Voice active");
    } catch {
      // already running
      setPhase("listening");
      setStoreListening(true);
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    setPhase("idle");
    setStoreListening(false);
    setStatusLine('Say "Hey Candida" or type a directive');
    setAgentActivity(null);
    setInterim("");
    if (armedTimeoutRef.current) clearTimeout(armedTimeoutRef.current);
  };

  const toggleVoice = () => {
    if (phase === "listening" || phase === "armed") {
      stopListening();
    } else if (phase === "idle") {
      startListening();
    }
  };

  const handleSubmit = () => {
    const q = input.trim() || "State of VR";
    setInput("");
    runResearchSequence(q);
  };

  const handleCloseReport = () => {
    closeResearchReport();
    setPhase("idle");
    setStatusLine('Say "Hey Candida" or type a directive');
    setAgentActivity(null);
    setProgress({ blocks: 0, sources: 0 });
  };

  const isVoiceActive = phase === "listening" || phase === "armed";

  // Full report takeover
  if (phase === "report" && researchReport) {
    return (
      <div className="relative h-full w-full">
        <ResearchReport data={researchReport} onClose={handleCloseReport} />
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#030305]">
      {/* Subtle radial void */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isVoiceActive
            ? "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(255,45,106,0.12) 0%, transparent 70%)"
            : "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(255,45,106,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Living logo — center stage */}
      <motion.div
        className="relative z-10"
        animate={{
          scale: phase === "working" ? 1.08 : isVoiceActive ? 1.04 : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        <LivingLogo size="xl" label="CANDIDA" active />
      </motion.div>

      {/* Status under logo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={statusLine + (interim || "")}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mt-8 max-w-md px-4 text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-candida-magenta/90">
            {phase === "working"
              ? "Research // Active"
              : phase === "armed"
              ? "Armed"
              : phase === "listening"
              ? "Listening"
              : "C.A.N.D.I.D.A."}
          </p>
          <p className="mt-1.5 text-sm text-zinc-400">{statusLine}</p>
          {interim && (
            <p className="mt-2 text-xs italic text-candida-accent/80">“{interim}”</p>
          )}
          {voiceError && (
            <p className="mt-2 text-xs text-amber-400">{voiceError}</p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress card — working */}
      <AnimatePresence>
        {phase === "working" && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-28 left-1/2 z-20 w-72 -translate-x-1/2 rounded-lg border border-candida-border bg-candida-panel/90 p-4 backdrop-blur-md"
            style={{ boxShadow: "0 0 40px rgba(255, 45, 106, 0.15)" }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-candida-magenta">
                Research // Active
              </span>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-candida-magenta" />
            </div>
            <p className="text-xs font-medium text-zinc-200">STATE OF VR</p>
            <p className="mt-0.5 text-[10px] text-candida-muted">{statusLine}</p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-zinc-800">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-candida-magenta to-candida-accent"
                initial={{ width: "0%" }}
                animate={{ width: `${(progress.blocks / 13) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-candida-muted">
              <span>{progress.blocks} blocks</span>
              <span>{progress.sources} sources</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input + mic bar */}
      {(phase === "idle" || phase === "listening" || phase === "armed") && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-10 left-1/2 z-10 w-full max-w-md -translate-x-1/2 px-4"
        >
          <div
            className={`flex items-center gap-2 rounded-full border bg-candida-panel/70 px-4 py-2.5 backdrop-blur-md ${
              isVoiceActive
                ? "border-candida-magenta/60 shadow-[0_0_24px_rgba(255,45,106,0.25)]"
                : "border-candida-border/80"
            }`}
          >
            <button
              onClick={toggleVoice}
              title={isVoiceActive ? "Stop listening" : "Start voice — Hey Candida"}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                isVoiceActive
                  ? "bg-candida-magenta/25 text-candida-magenta animate-pulse"
                  : "text-zinc-500 hover:bg-white/5 hover:text-candida-magenta"
              }`}
            >
              {isVoiceActive ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={
                isVoiceActive
                  ? phase === "armed"
                    ? "Speak your directive…"
                    : 'Listening for "Hey Candida"…'
                  : "Hey Candida, research something…"
              }
              className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
            />
            <button
              onClick={handleSubmit}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-candida-magenta/20 text-candida-magenta transition hover:bg-candida-magenta/30"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-zinc-600">
            {voiceSupported
              ? isVoiceActive
                ? 'Wake: "Hey Candida" · then say your research request'
                : "Tap the mic, then say \"Hey Candida, research state of VR\""
              : "Type a directive and press enter (voice needs Chrome/Edge)"}
          </p>
        </motion.div>
      )}
    </div>
  );
}

// Minimal types for Web Speech API (not always in TS lib)
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
