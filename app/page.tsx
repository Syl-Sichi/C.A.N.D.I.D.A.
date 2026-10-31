"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NeuralChat from "@/components/NeuralChat";
import MemoryPanel from "@/components/MemoryPanel";
import TaskEngine from "@/components/TaskEngine";
import ProactiveFeed from "@/components/ProactiveFeed";
import ResearchReport, { DEMO_REPORT } from "@/components/ResearchReport";
import { useCandidaStore } from "@/lib/store";
import { FolderKanban, Layers, Sparkles } from "lucide-react";

export default function CommandCenter() {
  const {
    activePanel,
    memories,
    tasks,
    suggestions,
    researchReport,
    openResearchReport,
    closeResearchReport,
  } = useCandidaStore();
  const activeTasks = tasks.filter((t) => t.status === "running").length;

  // Full-screen research mode takes over the main area
  if (activePanel === "research" && researchReport) {
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-neural-grid">
        <Header />
        <div className="flex-1 overflow-hidden">
          <ResearchReport data={researchReport} onClose={closeResearchReport} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neural-grid">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex flex-1 overflow-hidden">
          <section className="flex flex-1 flex-col border-r border-candida-border bg-candida-bg/40">
            {activePanel === "chat" && <NeuralChat />}
            {activePanel === "proactive" && <ProactiveFeed />}
            {activePanel === "memory" && <MemoryPanel />}
            {activePanel === "tasks" && <TaskEngine />}
            {activePanel === "workspace" && <WorkspacePlaceholder onDemo={() => openResearchReport(DEMO_REPORT)} />}
          </section>

          {activePanel === "chat" && (
            <aside className="hidden w-80 shrink-0 flex-col border-l border-candida-border lg:flex">
              <div className="h-1/2 border-b border-candida-border overflow-hidden">
                <ProactiveFeed />
              </div>
              <div className="h-1/2 overflow-hidden">
                <MemoryPanel />
              </div>
            </aside>
          )}
        </main>
      </div>

      <footer className="flex items-center justify-between border-t border-candida-border bg-candida-panel/80 px-4 py-1.5 text-[10px] text-candida-muted backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <span>
            Module: <span className="text-zinc-400">{activePanel}</span>
          </span>
          <span>
            Memory: <span className="text-zinc-400">{memories.length}</span>
          </span>
          <span>
            Running: <span className="text-zinc-400">{activeTasks}</span>
          </span>
          <span>
            Suggestions: <span className="text-zinc-400">{suggestions.length}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openResearchReport(DEMO_REPORT)}
            className="flex items-center gap-1.5 rounded border border-candida-magenta/40 bg-candida-magenta/10 px-2 py-0.5 text-[10px] text-candida-magenta transition hover:bg-candida-magenta/20"
          >
            <Sparkles className="h-3 w-3" />
            Demo Research HUD
          </button>
          <span className="hidden sm:inline">C.A.N.D.I.D.A. · ROSE language · v0.3.0</span>
          <span className="text-candida-accent">v0.3.0</span>
        </div>
      </footer>
    </div>
  );
}

function WorkspacePlaceholder({ onDemo }: { onDemo: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-candida-border bg-candida-panel magenta-glow">
        <FolderKanban className="h-8 w-8 text-candida-magenta" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-zinc-200">Context-Aware Workspace</h2>
        <p className="mt-1 max-w-sm text-sm text-candida-muted">
          Project-specific intelligence surfaces. Connect repos, docs, and live
          context streams in Phase 2–3.
        </p>
      </div>
      <button
        onClick={onDemo}
        className="flex items-center gap-2 rounded-full border border-candida-magenta/50 bg-candida-magenta/10 px-4 py-1.5 text-xs text-candida-magenta transition hover:bg-candida-magenta/20"
      >
        <Layers className="h-3.5 w-3.5" />
        Launch Research Report Demo
      </button>
    </div>
  );
}
