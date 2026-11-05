"use client";

import { motion, AnimatePresence } from "framer-motion";
import LivingLogo from "./LivingLogo";

type Phase = "idle" | "listening" | "awakening" | "armed" | "thinking" | "speaking";

export default function RoseInterface({ phase, interim, voiceError }: { phase: Phase; interim: string; voiceError: string | null }) {
  const active = phase === "awakening" || phase === "armed" || phase === "thinking" || phase === "speaking";
  const workspace = phase === "thinking" || phase === "speaking";
  const awake = phase === "awakening" || phase === "armed" || workspace;
  const mode = phase === "awakening" ? "awakening" : awake ? "present" : "listening";

  return (
    <div className="relative isolate flex h-full min-h-[560px] w-full flex-1 items-center justify-center overflow-hidden bg-[#020205] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(255,35,105,0.10),transparent_48%),linear-gradient(180deg,#030307_0%,#05050a_65%,#08050a_100%)]" />
      <div className="rose-grid pointer-events-none absolute inset-0 opacity-25" />
      <motion.div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-300/70 to-transparent" animate={{ opacity: [0.15, 0.55, 0.15], y: [0, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />

      <AnimatePresence>
        {phase === "awakening" && <>
          <motion.div key="wake-scan" className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-rose-400/10 to-transparent" initial={{ top: "-15%", opacity: 0 }} animate={{ top: "110%", opacity: [0, 1, 0] }} exit={{ opacity: 0 }} transition={{ duration: 1.55, ease: "easeInOut" }} />
          <motion.div key="wake-flash" className="pointer-events-none absolute left-1/2 top-1/2 h-[min(70vw,620px)] w-[min(70vw,620px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose-300/30" initial={{ scale: 0.2, opacity: 0 }} animate={{ scale: [0.2, 1.12, 1.5], opacity: [0, 0.8, 0] }} transition={{ duration: 1.5, ease: "easeOut" }} />
        </>}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[5%] top-[9%] text-[9px] tracking-[0.34em] text-rose-100/35">C.A.N.D.I.D.A. / NEURAL INTERFACE</div>
        <div className="absolute right-[5%] top-[9%] flex items-center gap-2 text-[9px] tracking-[0.2em] text-white/35"><span className="h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_9px_#fb4c89]" />{active ? "CORE ONLINE" : "STANDBY"}</div>
        <div className="absolute bottom-[7%] left-[5%] text-[9px] tracking-[0.2em] text-white/25">VOICE INTERFACE <span className="mx-2 text-rose-300/50">/</span> ENCRYPTED SESSION</div>
      </div>

      <AnimatePresence>
        {workspace && <motion.div key="workspace" className="absolute inset-0 z-10 grid grid-cols-12 gap-3 px-[5%] pb-[12%] pt-[15%] md:gap-4" initial={{ opacity: 0, y: 22, scale: 0.97, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, y: 12, scale: 0.98, filter: "blur(5px)" }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>
          <HudPanel className="col-span-7 row-span-2" title="ACTIVE CONTEXT" code="01 / CONTEXT">
            <div className="mt-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-400/10 text-lg text-rose-200">✳</div><div><div className="text-sm text-white/85">Listening to your request</div><div className="mt-1 text-[10px] text-white/35">Intent analysis in progress</div></div></div>
            <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/5"><motion.div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-200" animate={{ width: ["18%", "76%", "54%", "88%"] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} /></div>
            <div className="mt-2 flex justify-between text-[9px] tracking-wider text-white/30"><span>SEMANTIC PROCESSING</span><span>LIVE</span></div>
          </HudPanel>
          <HudPanel className="col-span-5" title="NEURAL ACTIVITY" code="02 / SIGNAL">
            <div className="mt-5 flex h-12 items-end gap-1">{Array.from({ length: 22 }).map((_, i) => <motion.span key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-rose-700/70 to-rose-200/90" animate={{ height: [8 + (i % 4) * 4, 15 + ((i * 7) % 28), 9 + (i % 5) * 5] }} transition={{ duration: 1.1 + (i % 5) * 0.16, repeat: Infinity, ease: "easeInOut", delay: i * 0.025 }} />)}</div>
            <div className="mt-3 text-[9px] tracking-wider text-white/35">SIGNAL STREAM ACTIVE</div>
          </HudPanel>
          <HudPanel className="col-span-5" title="SYSTEM STATUS" code="03 / CORE">
            <div className="mt-4 space-y-3">{["Voice channel", "Reasoning engine", "Memory interface"].map((item) => <div key={item} className="flex items-center justify-between text-[10px] text-white/55"><span>{item}</span><span className="flex items-center gap-1.5 text-rose-200/80"><i className="h-1.5 w-1.5 rounded-full bg-rose-400" />ACTIVE</span></div>)}</div>
          </HudPanel>
        </motion.div>}
      </AnimatePresence>

      <motion.div className="absolute z-20" animate={workspace ? { x: "min(35vw, 390px)", y: "min(28vh, 220px)", scale: 0.43 } : { x: 0, y: 0, scale: phase === "awakening" ? 1.12 : active ? 1.04 : 1 }} transition={{ duration: workspace ? 1.05 : 0.85, ease: [0.22, 1, 0.36, 1] }}>
        <LivingLogo size="xl" label="CANDIDA" active mode={mode} />
      </motion.div>

      <AnimatePresence>
        {!workspace && <motion.div key="voice-state" className="absolute bottom-[13%] z-30 flex min-h-12 flex-col items-center justify-center gap-2 px-5 text-center" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.35 }}>
          <div className="text-[10px] font-medium tracking-[0.38em] text-rose-100/65">{phase === "awakening" ? "INITIALISING" : phase === "armed" ? "I'M HERE" : phase === "listening" ? "AWAITING YOUR VOICE" : "C.A.N.D.I.D.A."}</div>
          {interim && <div className="max-w-[min(80vw,520px)] text-xs text-white/55">{interim}</div>}
          {voiceError && <div className="text-[11px] text-amber-300/80">{voiceError}</div>}
        </motion.div>}
        {workspace && <motion.div key="workspace-status" className="absolute bottom-[7%] left-[5%] z-30 text-[10px] tracking-[0.18em] text-rose-100/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{phase === "thinking" ? "PROCESSING YOUR REQUEST…" : "RESPONDING"}</motion.div>}
      </AnimatePresence>
    </div>
  );
}

function HudPanel({ children, title, code, className }: { children: React.ReactNode; title: string; code: string; className?: string }) {
  return <motion.section className={`relative min-h-0 overflow-hidden rounded-xl border border-rose-200/10 bg-[#0b0910]/75 p-4 shadow-[0_12px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-5 ${className ?? ""}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.12 }}>
    <div className="flex items-center justify-between border-b border-white/[0.06] pb-3"><span className="text-[9px] font-medium tracking-[0.22em] text-white/60">{title}</span><span className="text-[8px] tracking-widest text-rose-200/35">{code}</span></div>
    {children}<div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rose-300/20 to-transparent" />
  </motion.section>;
}
