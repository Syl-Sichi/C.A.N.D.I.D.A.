"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Mic, MicOff } from "lucide-react";
import { useCandidaStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

export default function NeuralChat() {
  const {
    messages,
    addMessage,
    isListening,
    setListening,
    agentActivity,
    setAgentActivity,
  } = useCandidaStore();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    addMessage({ role: "user", content: text });
    setInput("");
    setIsTyping(true);
    setAgentActivity("Reasoning…");

    try {
      // Build history for the API (exclude pure system for cleaner context)
      const history = [
        ...messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: text },
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) throw new Error(`API ${res.status}`);

      const data = await res.json();
      addMessage({
        role: "assistant",
        content: data.content ?? "No response from agent core.",
      });
    } catch {
      addMessage({
        role: "assistant",
        content:
          "Agent core unreachable. Check that the dev server is running and /api/chat is healthy.",
      });
    } finally {
      setIsTyping(false);
      setAgentActivity(null);
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      setListening(false);
      if (!input) {
        setInput("Voice capture placeholder — STT will land in Phase 4");
      }
    } else {
      setListening(true);
      setTimeout(() => setListening(false), 3000);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-candida-border px-4 py-3">
        <Sparkles className="h-4 w-4 text-candida-accent" />
        <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
          Neural Chat Interface
        </h2>
        {agentActivity && (
          <span className="ml-2 text-[10px] text-amber-400 animate-pulse">
            {agentActivity}
          </span>
        )}
        <span className="ml-auto text-[10px] uppercase tracking-widest text-candida-muted">
          Agent API · Phase 2
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role !== "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-candida-accent/30 bg-candida-accent/10">
                  <Bot className="h-4 w-4 text-candida-accent" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-candida-accent/15 border border-candida-accent/25 text-zinc-100"
                    : msg.role === "system"
                    ? "bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 italic"
                    : "bg-candida-panel border border-candida-border text-zinc-200"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-600 bg-zinc-800">
                  <User className="h-4 w-4 text-zinc-300" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-candida-accent/30 bg-candida-accent/10">
              <Bot className="h-4 w-4 text-candida-accent" />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-candida-border bg-candida-panel px-4 py-3">
              <span className="h-1.5 w-1.5 rounded-full bg-candida-accent animate-bounce [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-candida-accent animate-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-candida-accent animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-candida-border p-4">
        <div className="flex items-center gap-2 rounded-lg border border-candida-border bg-candida-bg/80 px-3 py-2 focus-within:border-candida-accent/50 focus-within:ring-1 focus-within:ring-candida-accent/20 transition-all">
          <button
            onClick={toggleVoice}
            title={isListening ? "Stop listening" : "Voice input (Phase 4 STT)"}
            className={clsx(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-all",
              isListening
                ? "bg-rose-500/20 text-rose-400 animate-pulse"
                : "text-zinc-500 hover:bg-white/5 hover:text-candida-accent"
            )}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={isListening ? "Listening..." : "Issue a directive..."}
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-candida-accent/20 text-candida-accent transition-all hover:bg-candida-accent/30 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        {isListening && (
          <p className="mt-1.5 text-[10px] text-rose-400/80">
            Voice capture active (mock) — real STT/TTS arrives in Phase 4
          </p>
        )}
      </div>
    </div>
  );
}
