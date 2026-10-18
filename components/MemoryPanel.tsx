"use client";

import { Database, Folder, Lightbulb, Repeat, Clock } from "lucide-react";
import { useCandidaStore, type MemoryItem, type MemoryTier } from "@/lib/store";
import { clsx } from "clsx";

const typeConfig: Record<
  MemoryItem["type"],
  { icon: React.ComponentType<{ className?: string }>; color: string; label: string }
> = {
  project: { icon: Folder, color: "text-sky-400", label: "Project" },
  knowledge: { icon: Database, color: "text-violet-400", label: "Knowledge" },
  insight: { icon: Lightbulb, color: "text-amber-400", label: "Insight" },
  routine: { icon: Repeat, color: "text-emerald-400", label: "Routine" },
};

const tierStyles: Record<MemoryTier, string> = {
  working: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  episodic: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  semantic: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  procedural: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

export default function MemoryPanel() {
  const memories = useCandidaStore((s) => s.memories);
  const sorted = [...memories].sort((a, b) => (b.strength ?? 0) - (a.strength ?? 0));

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-candida-border px-4 py-3">
        <Database className="h-4 w-4 text-candida-accent" />
        <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
          Cognitive Memory
        </h2>
        <span className="ml-auto rounded-full bg-candida-accent/10 px-2 py-0.5 text-[10px] font-medium text-candida-accent">
          {memories.length} nodes
        </span>
      </div>

      {/* Tier legend */}
      <div className="flex flex-wrap gap-1.5 border-b border-candida-border px-3 py-2">
        {(["working", "episodic", "semantic", "procedural"] as MemoryTier[]).map(
          (tier) => (
            <span
              key={tier}
              className={clsx(
                "rounded border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider",
                tierStyles[tier]
              )}
            >
              {tier}
            </span>
          )
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sorted.map((item) => {
          const cfg = typeConfig[item.type];
          const Icon = cfg.icon;
          const strength = item.strength ?? 50;
          return (
            <button
              key={item.id}
              className="neural-panel group flex w-full flex-col gap-1.5 p-3 text-left transition-all hover:border-candida-accent/40 hover:bg-candida-accent/5"
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                <span className="text-[10px] uppercase tracking-wider text-candida-muted">
                  {cfg.label}
                </span>
                <span
                  className={clsx(
                    "rounded border px-1 py-0.5 text-[8px] font-medium uppercase tracking-wider",
                    tierStyles[item.tier]
                  )}
                >
                  {item.tier}
                </span>
                <span className="ml-auto flex items-center gap-1 text-[10px] text-zinc-600">
                  <Clock className="h-3 w-3" />
                  {item.updatedAt}
                </span>
              </div>
              <h3 className="text-sm font-medium text-zinc-200 group-hover:text-white">
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed text-zinc-500 line-clamp-2">
                {item.preview}
              </p>
              {/* Activation strength */}
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-candida-accent/70 transition-all"
                    style={{ width: `${strength}%` }}
                  />
                </div>
                <span className="text-[9px] tabular-nums text-zinc-600 w-6 text-right">
                  {strength}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="border-t border-candida-border p-3">
        <button className="w-full rounded-md border border-dashed border-candida-border py-2 text-xs text-candida-muted transition-colors hover:border-candida-accent/40 hover:text-candida-accent">
          + Encode new memory node
        </button>
      </div>
    </div>
  );
}
