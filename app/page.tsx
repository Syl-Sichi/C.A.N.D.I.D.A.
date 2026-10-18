"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NeuralChat from "@/components/NeuralChat";
import MemoryPanel from "@/components/MemoryPanel";
import TaskEngine from "@/components/TaskEngine";
import ProactiveFeed from "@/components/ProactiveFeed";
import { useCandidaStore } from "@/lib/store";
import { FolderKanban, Layers } from "lucide-react";

export default function CommandCenter() {
  const { activePanel, memories, tasks, suggestions } = useCandidaStore();
  const activeTasks = tasks.filter((t) => t.status === "running").length;

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
            {activePanel === "workspace" && <WorkspacePlaceholder />}
          </section>

          {/* Right rail when on chat: Proactive + Memory (or Tasks) */}
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
          <span className="hidden sm:inline">C.A.N.D.I.D.A. · Jarvis path · Cockpit deepened</span>
          <span className="text-candida-accent">v0.2.0</span>
        </div>
      </footer>
    </div>
  );
}

function WorkspacePlaceholder() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-candida-border bg-candida-panel">
        <FolderKanban className="h-8 w-8 text-candida-muted" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-zinc-200">Context-Aware Workspace</h2>
        <p className="mt-1 max-w-sm text-sm text-candida-muted">
          Project-specific intelligence surfaces. Connect repos, docs, and live
          context streams in Phase 2–3.
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-candida-border bg-candida-panel px-4 py-1.5 text-xs text-candida-muted">
        <Layers className="h-3.5 w-3.5" />
        Phase 2+ — Intelligence Integration
      </div>
    </div>
  );
}
