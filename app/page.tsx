"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NeuralChat from "@/components/NeuralChat";
import MemoryPanel from "@/components/MemoryPanel";
import TaskEngine from "@/components/TaskEngine";
import { useCandidaStore } from "@/lib/store";
import { FolderKanban, Layers } from "lucide-react";

export default function CommandCenter() {
  const activePanel = useCandidaStore((s) => s.activePanel);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neural-grid">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main content area */}
        <main className="flex flex-1 overflow-hidden">
          {/* Primary panel (chat or selected view) */}
          <section className="flex flex-1 flex-col border-r border-candida-border bg-candida-bg/40">
            {activePanel === "chat" && <NeuralChat />}
            {activePanel === "memory" && <MemoryPanel />}
            {activePanel === "tasks" && <TaskEngine />}
            {activePanel === "workspace" && <WorkspacePlaceholder />}
          </section>

          {/* Right rail — always visible secondary panels when on chat */}
          {activePanel === "chat" && (
            <aside className="hidden w-80 shrink-0 flex-col border-l border-candida-border lg:flex">
              <div className="h-1/2 border-b border-candida-border overflow-hidden">
                <MemoryPanel />
              </div>
              <div className="h-1/2 overflow-hidden">
                <TaskEngine />
              </div>
            </aside>
          )}
        </main>
      </div>

      {/* Bottom status bar */}
      <footer className="flex items-center justify-between border-t border-candida-border bg-candida-panel/80 px-4 py-1.5 text-[10px] text-candida-muted backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <span>
            Module: <span className="text-zinc-400">{activePanel}</span>
          </span>
          <span>
            Memory nodes: <span className="text-zinc-400">4</span>
          </span>
          <span>
            Active tasks: <span className="text-zinc-400">1</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">C.A.N.D.I.D.A. · Phase 1 Core Interface</span>
          <span className="text-candida-accent">v0.1.0</span>
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
          Project-specific intelligence surfaces will live here in Phase 2.
          Connect repositories, docs, and live context streams.
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-candida-border bg-candida-panel px-4 py-1.5 text-xs text-candida-muted">
        <Layers className="h-3.5 w-3.5" />
        Coming in Phase 2 — Intelligence Integration
      </div>
    </div>
  );
}
