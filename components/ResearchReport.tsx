"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  ExternalLink,
  Layers,
  Source,
  Video,
  X,
} from "lucide-react";
import LivingLogo from "./LivingLogo";

export type ReportBlock = {
  id: string;
  title: string;
  body: string;
  type?: "text" | "chart" | "media" | "stat";
  value?: string;
  image?: string;
};

export type ResearchReportData = {
  title: string;
  subtitle?: string;
  blocks: ReportBlock[];
  sources: number;
  notes?: string[];
  status?: string;
};

type Props = {
  data: ResearchReportData;
  onClose?: () => void;
};

const demoBlocks: ReportBlock[] = [
  {
    id: "b1",
    title: "Market Overview",
    body: "Consumer VR installed base continues to concentrate around Meta Quest family. Standalone form factor remains dominant for volume.",
    type: "text",
  },
  {
    id: "b2",
    title: "Quest Shipments",
    body: "Estimated cumulative units",
    type: "stat",
    value: "≈20m",
  },
  {
    id: "b3",
    title: "Content Verticals",
    body: "Social, sandbox, fitness and rhythm titles drive engagement. Enterprise training growing from a smaller base.",
    type: "text",
  },
  {
    id: "b4",
    title: "Engagement Mix",
    body: "Relative time spent by category",
    type: "chart",
  },
  {
    id: "b5",
    title: "Hardware Momentum",
    body: "Next-gen headsets focus on pancake lenses, higher resolution, and lighter builds. Mixed-reality passthrough is table stakes.",
    type: "text",
  },
  {
    id: "b6",
    title: "Media Capture",
    body: "Sample session footage",
    type: "media",
  },
];

export const DEMO_REPORT: ResearchReportData = {
  title: "STATE OF VR",
  subtitle: "Research agent output · 13 blocks · 42 sources",
  blocks: demoBlocks,
  sources: 42,
  notes: [
    "Quest remains volume leader",
    "Fitness + social stickiest verticals",
    "Passthrough quality is the competitive frontier",
  ],
  status: "COMPLETE",
};

export default function ResearchReport({ data, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex h-full w-full flex-col overflow-hidden bg-void-radial"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-candida-border/80 px-5 py-3">
        <div className="flex items-center gap-4">
          <LivingLogo size="sm" label="CANDIDA" active />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-candida-magenta">
                Research // Active
              </span>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-candida-magenta" />
            </div>
            <h2 className="text-lg font-semibold tracking-wide text-white">
              {data.title}
            </h2>
            {data.subtitle && (
              <p className="text-[11px] text-candida-muted">{data.subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 text-[11px] text-candida-muted sm:flex">
            <span className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-candida-accent" />
              {data.blocks.length} blocks
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-candida-magenta" />
              {data.sources} sources
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-md border border-candida-border p-1.5 text-candida-muted transition hover:border-candida-magenta/50 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Report grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data.blocks.map((block, i) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.35 }}
              className="report-card hud-scanlines p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  {block.title}
                </h3>
                {block.type === "chart" && (
                  <BarChart3 className="h-3.5 w-3.5 text-candida-accent" />
                )}
                {block.type === "media" && (
                  <Video className="h-3.5 w-3.5 text-candida-magenta" />
                )}
                {block.type === "stat" && (
                  <Source className="h-3.5 w-3.5 text-candida-rose" />
                )}
              </div>

              {block.type === "stat" && block.value ? (
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,45,106,0.6)]">
                    {block.value}
                  </span>
                  <span className="mb-1 text-[10px] text-candida-muted">
                    {block.body}
                  </span>
                </div>
              ) : block.type === "chart" ? (
                <div className="mt-3 flex h-24 items-end gap-1.5">
                  {[62, 88, 45, 72, 55, 91, 38].map((h, idx) => (
                    <div
                      key={idx}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-candida-magenta/80 to-candida-accent/60"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              ) : block.type === "media" ? (
                <div className="mt-2 flex h-28 items-center justify-center rounded-md border border-candida-border/60 bg-black/40">
                  <div className="flex flex-col items-center gap-1 text-candida-muted">
                    <Video className="h-6 w-6 opacity-50" />
                    <span className="text-[10px]">Media preview</span>
                  </div>
                </div>
              ) : (
                <p className="text-[12px] leading-relaxed text-zinc-400">
                  {block.body}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Notes strip */}
        {data.notes && data.notes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 rounded-lg border border-candida-border/70 bg-candida-panel/60 p-3"
          >
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-candida-muted">
              Notes stacked
            </div>
            <ul className="space-y-1">
              {data.notes.map((n, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[12px] text-zinc-400"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-candida-magenta" />
                  {n}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {/* Footer status */}
      <div className="flex items-center justify-between border-t border-candida-border/80 px-5 py-2 text-[10px] text-candida-muted">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {data.status ?? "READY"}
        </span>
        <span className="flex items-center gap-1.5">
          <ExternalLink className="h-3 w-3" />
          Sources linked · HUD presentation mode
        </span>
      </div>
    </motion.div>
  );
}
