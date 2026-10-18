"use client";

import { Lightbulb, X, ArrowRight, Zap, AlertCircle } from "lucide-react";
import { useCandidaStore, type Suggestion } from "@/lib/store";
import { clsx } from "clsx";

const urgencyStyles: Record<
  Suggestion["urgency"],
  { border: string; badge: string; icon: string }
> = {
  high: {
    border: "border-rose-500/30 hover:border-rose-500/50",
    badge: "bg-rose-500/15 text-rose-400",
    icon: "text-rose-400",
  },
  medium: {
    border: "border-amber-500/30 hover:border-amber-500/50",
    badge: "bg-amber-500/15 text-amber-400",
    icon: "text-amber-400",
  },
  low: {
    border: "border-candida-border hover:border-candida-accent/40",
    badge: "bg-zinc-700/50 text-zinc-400",
    icon: "text-candida-accent",
  },
};

export default function ProactiveFeed() {
  const { suggestions, dismissSuggestion, addMessage } = useCandidaStore();

  const handleAct = (s: Suggestion) => {
    addMessage({
      role: "user",
      content: `[Proactive] ${s.action}: ${s.title}`,
    });
    dismissSuggestion(s.id);
    // Mock acknowledgment
    setTimeout(() => {
      addMessage({
        role: "assistant",
        content: `Acknowledged. Queuing: "${s.title}". This will be fully executable once Phase 2 tool-calling is online.`,
      });
    }, 600);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-candida-border px-4 py-3">
        <Zap className="h-4 w-4 text-candida-accent" />
        <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
          Proactive Feed
        </h2>
        <span className="ml-auto rounded-full bg-candida-accent/10 px-2 py-0.5 text-[10px] font-medium text-candida-accent">
          {suggestions.length} active
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-4">
            <Lightbulb className="h-8 w-8 text-zinc-600" />
            <p className="text-sm text-zinc-500">No pending suggestions</p>
            <p className="text-xs text-zinc-600">
              C.A.N.D.I.D.A. will surface opportunities as context evolves.
            </p>
          </div>
        ) : (
          suggestions.map((s) => {
            const style = urgencyStyles[s.urgency];
            return (
              <div
                key={s.id}
                className={clsx(
                  "neural-panel group relative p-3 transition-all",
                  style.border
                )}
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className={clsx("h-4 w-4 mt-0.5 shrink-0", style.icon)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-zinc-200 truncate">
                        {s.title}
                      </h3>
                      <span
                        className={clsx(
                          "rounded px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider shrink-0",
                          style.badge
                        )}
                      >
                        {s.urgency}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-2">
                      {s.reason}
                    </p>
                    <button
                      onClick={() => handleAct(s)}
                      className="flex items-center gap-1.5 text-xs font-medium text-candida-accent hover:text-cyan-300 transition-colors"
                    >
                      {s.action}
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => dismissSuggestion(s.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-zinc-600 hover:text-zinc-300"
                    title="Dismiss"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-candida-border px-4 py-2 text-[10px] text-candida-muted">
        Ranked by context · memory · urgency — Phase 4 will fully automate this layer
      </div>
    </div>
  );
}
