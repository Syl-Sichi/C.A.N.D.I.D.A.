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
  sm: 56,
  md: 96,
  lg: 160,
  xl: 260,
};

export default function LivingLogo({
  size = "md",
  label = "CANDIDA",
  active = true,
  className,
}: LivingLogoProps) {
  const px = sizes[size];
  const display =
    label.length > 12
      ? label
          .split(".")
          .filter(Boolean)
          .map((s) => s[0])
          .join("")
      : label.replace(/\./g, "");

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{
        width: px * 1.55,
        height: px * 1.35,
        perspective: px * 4,
      }}
    >
      {/* Ambient bloom */}
      {active && (
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            width: px * 1.4,
            height: px * 1.4,
            background:
              "radial-gradient(circle, rgba(255,45,106,0.28) 0%, rgba(255,45,106,0.08) 40%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
      )}

      <div
        className="relative"
        style={{
          width: px,
          height: px,
          transformStyle: "preserve-3d",
          transform: "rotateX(18deg) rotateZ(-2deg)",
        }}
      >
        {/* Layer 0 — distant faint ellipse */}
        <motion.div
          className="absolute rounded-full border border-white/10"
          style={{
            inset: -px * 0.12,
            transform: `translateZ(${-px * 0.4}px) scaleX(1.25) scaleY(0.92)`,
          }}
          animate={active ? { rotateZ: 360 } : {}}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />

        {/* Layer 1 — outer dashed orbital */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            transform: `translateZ(${-px * 0.22}px) scaleX(1.12)`,
            border: "1.5px dashed rgba(255,45,106,0.35)",
            boxShadow: active
              ? "0 0 40px rgba(255,45,106,0.25)"
              : undefined,
          }}
          animate={active ? { rotateZ: -360 } : {}}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-0 -translate-x-1/2"
              style={{
                width: i % 3 === 0 ? 2 : 1,
                height: i % 3 === 0 ? 6 : 3,
                background:
                  i % 3 === 0
                    ? "rgba(255,45,106,0.9)"
                    : "rgba(255,255,255,0.25)",
                transformOrigin: `center ${px / 2}px`,
                transform: `rotate(${i * 10}deg)`,
                borderRadius: 1,
              }}
            />
          ))}
        </motion.div>

        {/* Layer 2 — solid magenta ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: px * 0.04,
            transform: `translateZ(${-px * 0.08}px)`,
            border: "2px solid rgba(255,45,106,0.75)",
            boxShadow: active
              ? "0 0 28px rgba(255,45,106,0.55), inset 0 0 20px rgba(255,45,106,0.12)"
              : "inset 0 0 10px rgba(255,45,106,0.08)",
          }}
          animate={active ? { rotateZ: 360 } : {}}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-0 h-2.5 w-0.5 -translate-x-1/2 rounded-sm bg-candida-magenta"
              style={{
                transformOrigin: `center ${(px * 0.92) / 2}px`,
                transform: `rotate(${i * 30}deg)`,
                boxShadow: "0 0 6px rgba(255,45,106,0.9)",
              }}
            />
          ))}
        </motion.div>

        {/* Layer 3 — cyan counter-ring */}
        <motion.div
          className="absolute rounded-full border border-cyan-400/35"
          style={{
            inset: px * 0.14,
            transform: `translateZ(${px * 0.02}px) scaleX(1.04)`,
            boxShadow: active ? "0 0 16px rgba(0,242,255,0.2)" : undefined,
          }}
          animate={active ? { rotateZ: -360 } : {}}
          transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
        />

        {/* Corner brackets — ROSE HUD chrome */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ transform: `translateZ(${px * 0.06}px)` }}
        >
          {(
            [
              { t: 0, l: 0, b: "border-t border-l", ox: -2, oy: -2 },
              { t: 0, r: 0, b: "border-t border-r", ox: 2, oy: -2 },
              { btm: 0, l: 0, b: "border-b border-l", ox: -2, oy: 2 },
              { btm: 0, r: 0, b: "border-b border-r", ox: 2, oy: 2 },
            ] as const
          ).map((c, i) => (
            <div
              key={i}
              className={`absolute h-4 w-4 border-candida-magenta/80 ${c.b}`}
              style={{
                top: "t" in c ? c.t : undefined,
                left: "l" in c ? c.l : undefined,
                right: "r" in c ? c.r : undefined,
                bottom: "btm" in c ? c.btm : undefined,
                transform: `translate(${c.ox}px, ${c.oy}px)`,
              }}
            />
          ))}
        </div>

        {/* Crosshair */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ transform: `translateZ(${px * 0.08}px)` }}
        >
          <div
            className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
            style={{
              background:
                "linear-gradient(90deg, transparent 8%, rgba(255,45,106,0.95) 30%, rgba(255,255,255,0.7) 50%, rgba(255,45,106,0.95) 70%, transparent 92%)",
            }}
          />
          <div
            className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2"
            style={{
              background:
                "linear-gradient(180deg, transparent 8%, rgba(255,45,106,0.55) 35%, rgba(255,45,106,0.55) 65%, transparent 92%)",
            }}
          />
          {/* center notch ticks */}
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-candida-magenta/60" />
        </div>

        {/* Fast scan arc */}
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: px * 0.18,
            transform: `translateZ(${px * 0.12}px)`,
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(255,45,106,0.85) 35deg, rgba(255,255,255,0.4) 55deg, transparent 90deg)",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 1px))",
            WebkitMask:
              "radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 1px))",
          }}
          animate={active ? { rotateZ: 360 } : {}}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
        />

        {/* Pulsing core glow */}
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: px * 0.24,
            transform: `translateZ(${px * 0.18}px)`,
            background:
              "radial-gradient(circle, rgba(255,77,141,0.5) 0%, rgba(255,45,106,0.18) 45%, transparent 72%)",
          }}
          animate={
            active
              ? {
                  opacity: [0.7, 1, 0.7],
                  scale: [0.96, 1.04, 0.96],
                }
              : {}
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Core disc */}
        <div
          className="absolute flex items-center justify-center rounded-full"
          style={{
            inset: px * 0.28,
            transform: `translateZ(${px * 0.26}px)`,
            background:
              "radial-gradient(circle at 40% 35%, #1a0a12 0%, #0a0508 55%, #050305 100%)",
            border: "1.5px solid rgba(255,45,106,0.85)",
            boxShadow: active
              ? "0 0 36px rgba(255,45,106,0.7), 0 0 60px rgba(255,45,106,0.3), inset 0 0 24px rgba(255,45,106,0.25)"
              : "inset 0 0 12px rgba(255,45,106,0.15)",
          }}
        >
          {/* Inner ring on core */}
          <div
            className="absolute rounded-full border border-candida-magenta/30"
            style={{ inset: "12%" }}
          />

          <span
            style={{
              fontFamily: "'Russo One', 'Orbitron', Impact, sans-serif",
              fontSize: Math.max(12, px * 0.125),
              letterSpacing: size === "xl" ? "0.12em" : "0.08em",
              color: "#fff",
              textShadow: active
                ? "0 0 10px rgba(255,255,255,0.9), 0 0 22px rgba(255,77,141,1), 0 0 40px rgba(255,45,106,0.8)"
                : "0 0 8px rgba(255,45,106,0.5)",
              textTransform: "uppercase",
              fontWeight: 400,
              transform: "skewX(-6deg)",
              lineHeight: 1,
            }}
          >
            {display}
          </span>
        </div>

        {/* Orbiting energy nodes */}
        {active &&
          Array.from({ length: 10 }).map((_, i) => {
            const angle = (i / 10) * Math.PI * 2;
            const r = px * 0.5;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  width: i % 2 === 0 ? 4 : 3,
                  height: i % 2 === 0 ? 4 : 3,
                  marginLeft: -2,
                  marginTop: -2,
                  background:
                    i % 3 === 0
                      ? "rgba(0,242,255,0.95)"
                      : "rgba(255,45,106,1)",
                  boxShadow:
                    i % 3 === 0
                      ? "0 0 10px rgba(0,242,255,1)"
                      : "0 0 10px rgba(255,45,106,1)",
                  transform: `translateZ(${px * 0.1}px)`,
                }}
                animate={{
                  x: [
                    Math.cos(angle) * r,
                    Math.cos(angle + 1.1) * (r * 1.06),
                    Math.cos(angle) * r,
                  ],
                  y: [
                    Math.sin(angle) * r * 0.78,
                    Math.sin(angle + 1.1) * (r * 0.82),
                    Math.sin(angle) * r * 0.78,
                  ],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 3.2 + i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
      </div>
    </div>
  );
}
