"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type LivingLogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  active?: boolean;
  className?: string;
};

const sizes = {
  sm: 48,
  md: 72,
  lg: 120,
  xl: 180,
};

export default function LivingLogo({
  size = "md",
  label = "C.A.N.D.I.D.A.",
  active = true,
  className,
}: LivingLogoProps) {
  const px = sizes[size];
  const center = px / 2;

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: px, height: px }}
    >
      {/* Outer orbital ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-candida-magenta/30"
        style={{
          boxShadow: active
            ? "0 0 28px rgba(255, 45, 106, 0.35), inset 0 0 20px rgba(255, 45, 106, 0.08)"
            : undefined,
        }}
        animate={active ? { rotate: 360 } : {}}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {/* Tick marks */}
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-0 h-1.5 w-px -translate-x-1/2 bg-candida-magenta/40"
            style={{
              transformOrigin: `0 ${center}px`,
              transform: `rotate(${i * 15}deg) translateY(0)`,
            }}
          />
        ))}
      </motion.div>

      {/* Mid orbital ring */}
      <motion.div
        className="absolute rounded-full border border-candida-accent/25"
        style={{
          inset: px * 0.12,
          boxShadow: active ? "0 0 16px rgba(0, 242, 255, 0.2)" : undefined,
        }}
        animate={active ? { rotate: -360 } : {}}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-0 h-1 w-0.5 -translate-x-1/2 rounded-full bg-candida-accent/50"
            style={{
              transformOrigin: `0 ${(px * 0.76) / 2}px`,
              transform: `rotate(${i * 30}deg)`,
            }}
          />
        ))}
      </motion.div>

      {/* Inner scanning arc */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: px * 0.22,
          background: `conic-gradient(from 0deg, transparent 0deg, rgba(255, 45, 106, 0.55) 40deg, transparent 80deg)`,
          mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
        }}
        animate={active ? { rotate: 360 } : {}}
        transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
      />

      {/* Core glow */}
      <div
        className={cn(
          "absolute rounded-full",
          active ? "rose-glow" : ""
        )}
        style={{
          inset: px * 0.28,
          background:
            "radial-gradient(circle, rgba(255, 45, 106, 0.25) 0%, rgba(255, 45, 106, 0.08) 45%, transparent 70%)",
        }}
      />

      {/* Core disc */}
      <div
        className="absolute flex items-center justify-center rounded-full border border-candida-magenta/60 bg-candida-bg/90"
        style={{
          inset: px * 0.32,
          boxShadow: active
            ? "0 0 24px rgba(255, 45, 106, 0.5), inset 0 0 12px rgba(255, 45, 106, 0.15)"
            : "inset 0 0 8px rgba(255, 45, 106, 0.1)",
        }}
      >
        <span
          className="font-bold tracking-tighter text-white"
          style={{
            fontSize: Math.max(9, px * 0.11),
            textShadow: active ? "0 0 12px rgba(255, 77, 141, 0.9)" : undefined,
            letterSpacing: "0.04em",
          }}
        >
          {label.length > 10 ? label.split(".").filter(Boolean).map((s) => s[0]).join("") : label}
        </span>
      </div>

      {/* Floating particles */}
      {active &&
        Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-candida-magenta"
            style={{
              left: center,
              top: center,
              boxShadow: "0 0 6px rgba(255, 45, 106, 0.9)",
            }}
            animate={{
              x: [
                Math.cos((i / 6) * Math.PI * 2) * (px * 0.38),
                Math.cos((i / 6) * Math.PI * 2 + 0.8) * (px * 0.42),
                Math.cos((i / 6) * Math.PI * 2) * (px * 0.38),
              ],
              y: [
                Math.sin((i / 6) * Math.PI * 2) * (px * 0.38),
                Math.sin((i / 6) * Math.PI * 2 + 0.8) * (px * 0.42),
                Math.sin((i / 6) * Math.PI * 2) * (px * 0.38),
              ],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
    </div>
  );
}
