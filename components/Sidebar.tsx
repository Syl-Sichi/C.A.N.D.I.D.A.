"use client";

import {
  Brain,
  LayoutDashboard,
  Radio,
  Database,
  ListTodo,
  FolderKanban,
  Settings,
  Terminal,
  Zap,
} from "lucide-react";
import { useCandidaStore } from "@/lib/store";
import { clsx } from "clsx";

const navItems = [
  { id: "chat" as const, label: "Agent Stage", icon: Radio },
  { id: "proactive" as const, label: "Proactive Feed", icon: Zap },
  { id: "memory" as const, label: "Cognitive Memory", icon: Database },
  { id: "tasks" as const, label: "Task Engine", icon: ListTodo },
  { id: "workspace" as const, label: "Workspace", icon: FolderKanban },
];

export default function Sidebar() {
  const { activePanel, setActivePanel, suggestions } = useCandidaStore();

  return (
    <aside className="flex w-52 shrink-0 flex-col border-r border-candida-border/80 bg-black/60">
      <div className="flex items-center gap-2 border-b border-candida-border/80 px-4 py-3">
        <LayoutDashboard className="h-4 w-4 text-candida-magenta" />
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Command Center
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activePanel === item.id || (item.id === "chat" && activePanel === "research");
          const showBadge = item.id === "proactive" && suggestions.length > 0;
          return (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.id)}
              className={clsx(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-all",
                active
                  ? "border border-candida-magenta/40 bg-candida-magenta/10 text-candida-magenta"
                  : "border border-transparent text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 font-medium">{item.label}</span>
              {showBadge && (
                <span className="rounded-full bg-candida-magenta/20 px-1.5 py-0.5 text-[9px] font-semibold text-candida-magenta">
                  {suggestions.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-candida-border/80 p-3">
        <div className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-candida-muted">
          <Brain className="h-3.5 w-3.5" />
          <span>Core v0.4.0</span>
        </div>
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-white/5 hover:text-zinc-400">
          <Terminal className="h-4 w-4" />
          <span>Console</span>
        </button>
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-white/5 hover:text-zinc-400">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
