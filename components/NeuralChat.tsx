"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useCandidaStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_REPLIES = [
  "Directive acknowledged. Analyzing cognitive context... Processing complete. How may I assist further?",
  "I've cross-referenced that with your active memory nodes. The pattern suggests prioritizing Phase 2 intelligence integration next.",
  "System integrity remains optimal. I can surface related insights from the Cognitive Memory panel if you'd like.",
  "Understood. Shall I queue a new routine in the Task Engine or expand on the current workspace context?",
  "Neural pathways aligned. I'm ready for multi-step reasoning, decision support, or automation directives.",
];

export default function NeuralChat() {
  const { messages, addMessage } = useCandidaStore();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isTyping) return;

    addMessage({ role: "user", content: text });
    setInput("");
    setIsTyping(true);

    // Mock adaptive response
    setTimeout(() => {
      const reply =
        MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
      addMessage({ role: "assistant", content: reply });
      setIsTyping(false);
    }, 900 + Math.random() * 800);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Chat header */}
      <div className="flex items-center gap-2 border-b border-candida-border px-4 py-3">
        <Sparkles className="h-4 w-4 text-candida-accent" />
        <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
          Neural Chat Interface
        </h2>
        <span className="ml-auto text-[10px] uppercase tracking-widest text-candida-muted">
          Context-aware · Adaptive
        </span>
      </div>

      {/* Messages */}
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
                className={`max-w-[75%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
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

      {/* Input */}
      <div className="border-t border-candida-border p-4">
        <div className="flex items-center gap-2 rounded-lg border border-candida-border bg-candida-bg/80 px-3 py-2 focus-within:border-candida-accent/50 focus-within:ring-1 focus-within:ring-candida-accent/20 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Issue a directive..."
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
      </div>
    </div>
  );
}
