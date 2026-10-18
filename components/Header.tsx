"use client";

import { Activity, Cpu, Shield, Zap } from "lucide-react";
import { useCandidaStore } from "@/lib/store";
import { useEffect, useState } from "react";

export default function Header() {
  const systemStatus = useCandidaStore((s) => s.systemStatus);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const statusColor =
    systemStatus === "online"
      ? "text-emerald-400"
      : systemStatus === "syncing"
      ? "text-amber-400"
      : "text-red-400";

  return (
    <header className="flex items-center justify-between border-b border-candida-border bg-candida-panel/80 px-5 py-3 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-candida-accent/40 bg-candida-accent/10 accent-glow">
          <Cpu className="h-5 w-5 text-candida-accent" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-wider text-white">
            C.A.N.D.I.D.A.
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-candida-muted">
            Cognitive Adaptive Neural Digital Intelligence
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden items-center gap-4 sm:flex">
          <StatusPill icon={Activity} label="Neural" value="Active" />
          <StatusPill icon={Shield} label="Integrity" value="100%" />
          <StatusPill icon={Zap} label="Latency" value="12ms" />
        </div>

        <div className="flex items-center gap-2 rounded-md border border-candida-border bg-candida-bg/60 px-3 py-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${statusColor === "text-emerald-400" ? "bg-emerald-400" : statusColor === "text-amber-400" ? "bg-amber-400" : "bg-red-400"} animate-pulse`} />
          <span className={`text-xs font-medium uppercase tracking-wider ${statusColor}`}>
            {systemStatus}
          </span>
        </div>

        <div className="font-mono text-sm tabular-nums text-candida-accent">
          {time || "--:--:--"}
        </div>
      </div>
    </header>
  );
}

function StatusPill({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-candida-muted">
      <Icon className="h-3.5 w-3.5 text-candida-accent/70" />
      <span>{label}</span>
      <span className="font-medium text-zinc-300">{value}</span>
    </div>
  );
}
