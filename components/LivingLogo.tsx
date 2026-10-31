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
  md: 88,
  lg: 140,
  xl: 220,
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
        width: px * 1.35,
        height: px * 1.15,
        perspective: px * 3,
      }}
    >
      {/* 3D scene — rings separated in depth like ROSE open */}
      <div
        className="relative"
        style={{
          width: px,
          height: px,
          transformStyle: "preserve-3d",
          transform: "rotateX(12deg)",
        }}
      >
        {/* Far ring — deepest */}
        <motion.div
          className="absolute inset-0 rounded-full border border-white/15"
          style={{
            transform: `translateZ(${-px * 0.28}px) scale(1.18)`,
            boxShadow: active ? "0 0 40px rgba(255,45,106,0.12)" : undefined,
          }}
          animate={active ? { rotateZ: 360 } : {}}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-0 h-1 w-px -translate-x-1/2 bg-white/25"
              style={{
                transformOrigin: `center ${px / 2}px`,
                transform: `rotate(${i * 11.25}deg)`,
              }}
            />
          ))}
        </motion.div>

        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-candida-magenta/50"
          style={{
            transform: `translateZ(${-px * 0.12}px)`,
            boxShadow: active
              ? "0 0 32px rgba(255,45,106,0.45), inset 0 0 24px rgba(255,45,106,0.1)"
              : undefined,
          }}
          animate={active ? { rotateZ: -360 } : {}}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-0 h-2 w-0.5 -translate-x-1/2 rounded-full bg-candida-magenta/70"
              style={{
                transformOrigin: `center ${px / 2}px`,
                transform: `rotate(${i * 18}deg)`,
              }}
            />
          ))}
        </motion.div>

        {/* Mid ring — cyan */}
        <motion.div
          className="absolute rounded-full border border-candida-accent/40"
          style={{
            inset: px * 0.1,
            transform: `translateZ(${px * 0.02}px)`,
            boxShadow: active ? "0 0 18px rgba(0,242,255,0.25)" : undefined,
          }}
          animate={active ? { rotateZ: 360 } : {}}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        {/* Laser crosshair lines (ROSE-style) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ transform: `translateZ(${px * 0.05}px)` }}
        >
          <div
            className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
            style={{
              background:
                "linear-gradient(90deg, transparent 5%, rgba(255,45,106,0.85) 35%, rgba(255,45,106,0.85) 65%, transparent 95%)",
            }}
          />
          <div
            className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2"
            style={{
              background:
                "linear-gradient(180deg, transparent 5%, rgba(255,45,106,0.5) 40%, rgba(255,45,106,0.5) 60%, transparent 95%)",
            }}
          />
        </div>

        {/* Inner scan ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: px * 0.2,
            transform: `translateZ(${px * 0.1}px)`,
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(255,45,106,0.7) 50deg, transparent 100deg)",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
            WebkitMask:
              "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
          }}
          animate={active ? { rotateZ: 360 } : {}}
          transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
        />

        {/* Core glow */}
        <div
          className="absolute rounded-full"
          style={{
            inset: px * 0.26,
            transform: `translateZ(${px * 0.16}px)`,
            background:
              "radial-gradient(circle, rgba(255,45,106,0.35) 0%, rgba(255,45,106,0.1) 50%, transparent 70%)",
            boxShadow: active ? "0 0 50px rgba(255,77,141,0.55)" : undefined,
          }}
        />

        {/* Core disc + ROSE-style wordmark */}
        <div
          className="absolute flex items-center justify-center rounded-full border border-candida-magenta/70 bg-[#0a0a0c]/95"
          style={{
            inset: px * 0.3,
            transform: `translateZ(${px * 0.22}px)`,
            boxShadow: active
              ? "0 0 28px rgba(255,45,106,0.6), inset 0 0 16px rgba(255,45,106,0.2)"
              : "inset 0 0 8px rgba(255,45,106,0.12)",
          }}
        >
          <span
            style={{
              fontFamily: "'Russo One', 'Orbitron', sans-serif",
              fontSize: Math.max(11, px * 0.13),
              letterSpacing: "0.06em",
              color: "#fff",
              textShadow: active
                ? "0 0 14px rgba(255,77,141,1), 0 0 28px rgba(255,45,106,0.7)"
                : "0 0 6px rgba(255,45,106,0.4)",
              textTransform: "uppercase",
              fontWeight: 400,
              transform: "skewX(-4deg)",
            }}
          >
            {display}
          </span>
        </div>

        {/* Floating particles on outer path */}
        {active &&
          Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const r = px * 0.48;
            return (
              <motion.div
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-candida-magenta"
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: -3,
                  marginTop: -3,
                  boxShadow: "0 0 8px rgba(255,45,106,1)",
                  transform: `translateZ(${px * 0.08}px)`,
                }}
                animate={{
                  x: [
                    Math.cos(angle) * r,
                    Math.cos(angle + 0.9) * (r * 1.05),
                    Math.cos(angle) * r,
                  ],
                  y: [
                    Math.sin(angle) * r * 0.85,
                    Math.sin(angle + 0.9) * (r * 0.9),
                    Math.sin(angle) * r * 0.85,
                  ],
                  opacity: [0.35, 1, 0.35],
                }}
                transition={{
                  duration: 2.8 + i * 0.25,
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
