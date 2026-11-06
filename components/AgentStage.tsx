"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import RoseInterface from "./RoseInterface";
import { useCandidaStore } from "@/lib/store";
import { speakCandida, moodFromLocalHour } from "@/lib/speak";

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
    setAgentActivity("Listening");
  }, [setAgentActivity, setStoreListening]);

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
    setAgentActivity("Awakening");

    await new Promise((r) => setTimeout(r, 1500));

    setPhase("speaking");
    setAgentActivity("Speaking");
    // Wake ack — sleepy at night, pro by day
    await speakCandida("Yes?", moodFromLocalHour());

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
          data.content ?? "I heard you, but I could not form a reply.";
      } catch {
        content = "I am having trouble reaching my core. Try again in a moment.";
      }

      addMessage({ role: "assistant", content });

      // Task-y replies → pro voice; pure time/chitchat late → sleepy
      const h = new Date().getHours();
      const late = h >= 22 || h < 5;
      const tasky = /(work|build|code|deploy|plan|research|deadline|email)/i.test(
        q
      );
      const mood = late && !tasky ? "sleepy" : "pro";

      setPhase("speaking");
      setAgentActivity("Speaking");
      await speakCandida(content, mood);

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

  return <RoseInterface phase={phase} interim={interim} voiceError={voiceError} />;
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
