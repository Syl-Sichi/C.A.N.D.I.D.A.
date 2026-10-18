"use client";

import {
  Brain,
  LayoutDashboard,
  MessageSquare,
  Database,
  ListTodo,
  FolderKanban,
  Settings,
  Terminal,
} from "lucide-react";
import { useCandidaStore } from "@/lib/store";
import { clsx } from "clsx";

const navItems = [
  { id: "chat" as const, label: "Neural Chat", icon: MessageSquare },
  { id: "memory" as const, label: "Cognitive Memory", icon: Database },
  { id: "tasks" as const, label: "Task Engine", icon: ListTodo },
  { id: "workspace" as const, label: "Workspace", icon: FolderKanban },
];

export default function Sidebar() {
  const { activePanel, setActivePanel } = useCandidaStore();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-candida-border bg-candida-panel/60">
      <div className="flex items-center gap-2 border-b border-candida-border px-4 py-3">
        <LayoutDashboard className="h-4 w-4 text-candida-accent" />
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Command Center
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activePanel === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.id)}
              className={clsx(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-all",
                active
                  ? "bg-candida-accent/10 text-candida-accent border border-candida-accent/30 accent-glow"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-candida-border p-3 space-y-1">
        <div className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-candida-muted">
          <Brain className="h-3.5 w-3.5" />
          <span>Core v0.1.0</span>
        </div>
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors">
          <Terminal className="h-4 w-4" />
          <span>Console</span>
        </button>
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
