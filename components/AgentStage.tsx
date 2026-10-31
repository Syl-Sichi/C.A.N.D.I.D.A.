"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send } from "lucide-react";
import LivingLogo from "./LivingLogo";
import ResearchReport, { DEMO_REPORT, type ResearchReportData } from "./ResearchReport";
import { useCandidaStore } from "@/lib/store";

type StagePhase = "idle" | "listening" | "working" | "report";

export default function AgentStage() {
  const { openResearchReport, closeResearchReport, researchReport, setAgentActivity } =
    useCandidaStore();
  const [phase, setPhase] = useState<StagePhase>("idle");
  const [input, setInput] = useState("");
  const [statusLine, setStatusLine] = useState("Awaiting directive");
  const [progress, setProgress] = useState({ blocks: 0, sources: 0 });

  // When store opens a report from elsewhere, sync phase
  useEffect(() => {
    if (researchReport) setPhase("report");
  }, [researchReport]);

  const runResearchSequence = async (query?: string) => {
    setPhase("working");
    setStatusLine(query ? `Researching: ${query}` : "Starting research agent");
    setAgentActivity("Research agent active");
    setProgress({ blocks: 0, sources: 0 });

    // Simulate agent work like the video
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
  };

  const handleSubmit = () => {
    const q = input.trim() || "State of VR";
    setInput("");
    runResearchSequence(q);
  };

  const handleCloseReport = () => {
    closeResearchReport();
    setPhase("idle");
    setStatusLine("Awaiting directive");
    setAgentActivity(null);
    setProgress({ blocks: 0, sources: 0 });
  };

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
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(255,45,106,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Living logo — center stage */}
      <motion.div
        className="relative z-10"
        animate={{
          scale: phase === "working" ? 1.08 : 1,
        }}
        transition={{ duration: 0.6 }}
      >
        <LivingLogo
          size="xl"
          label="CANDIDA"
          active={phase !== "idle" || true}
        />
      </motion.div>

      {/* Status under logo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={statusLine}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mt-8 text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-candida-magenta/90">
            {phase === "working" ? "Research // Active" : "C.A.N.D.I.D.A."}
          </p>
          <p className="mt-1.5 text-sm text-zinc-400">{statusLine}</p>
        </motion.div>
      </AnimatePresence>

      {/* Progress card — appears while working (like the video) */}
      <AnimatePresence>
        {phase === "working" && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-28 left-1/2 z-20 w-72 -translate-x-1/2 rounded-lg border border-candida-border bg-candida-panel/90 p-4 backdrop-blur-md"
            style={{
              boxShadow: "0 0 40px rgba(255, 45, 106, 0.15)",
            }}
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

      {/* Input bar — bottom, minimal */}
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-10 left-1/2 z-10 w-full max-w-md -translate-x-1/2 px-4"
        >
          <div className="flex items-center gap-2 rounded-full border border-candida-border/80 bg-candida-panel/70 px-4 py-2.5 backdrop-blur-md">
            <button
              className="text-zinc-500 transition hover:text-candida-magenta"
              title="Voice (Phase 4)"
            >
              <Mic className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Hey Candida, research something…"
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
            Press enter or click send — demo runs State of VR research HUD
          </p>
        </motion.div>
      )}
    </div>
  );
}
