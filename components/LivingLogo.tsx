"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type LivingLogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  active?: boolean;
  /** listening = rings only / name off-side; awakened = name settles in center like ROSE */
  mode?: "idle" | "listening" | "awakening" | "present";
  className?: string;
};

const sizes = {
  sm: 64,
  md: 110,
  lg: 180,
  xl: 280,
};

/** C.A.N.D.I.D.A. mark — particle orbitals + laser; name enters center on awaken */
export default function LivingLogo({
  size = "md",
  label = "CANDIDA",
  active = true,
  mode = "listening",
  className,
}: LivingLogoProps) {
  const px = sizes[size];
  const name = label.replace(/\./g, "");
  const centered = mode === "awakening" || mode === "present";
  const forming = mode === "awakening";

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: px * 1.7, height: px * 1.25 }}
    >
      <div
        className="relative"
        style={{
          width: px,
          height: px,
          perspective: px * 5,
        }}
      >
        {active && (
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: px * 1.2,
              height: px * 0.7,
              background:
                "radial-gradient(ellipse, rgba(255,45,106,0.35) 0%, transparent 70%)",
              filter: "blur(12px)",
            }}
          />
        )}

        <div
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(58deg)",
          }}
        >
          <OrbitalRing
            px={px}
            scale={1.15}
            z={-px * 0.15}
            duration={28}
            reverse
            color="rgba(255,255,255,0.55)"
            particleCount={48}
            active={active}
          />
          <OrbitalRing
            px={px}
            scale={0.92}
            z={0}
            duration={18}
            color="rgba(255,45,106,0.95)"
            particleCount={40}
            active={active}
            glow
          />
          <OrbitalRing
            px={px}
            scale={0.62}
            z={px * 0.12}
            duration={12}
            reverse
            color="rgba(255,120,160,0.7)"
            particleCount={28}
            active={active}
          />
          <div
            className="absolute inset-0"
            style={{
              transform: `rotateZ(55deg) translateZ(${px * 0.05}px)`,
              transformStyle: "preserve-3d",
            }}
          >
            <OrbitalRing
              px={px}
              scale={0.78}
              z={0}
              duration={20}
              color="rgba(200,220,255,0.45)"
              particleCount={32}
              active={active}
            />
          </div>
        </div>

        {/* Laser */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ width: px * 1.35, height: 2 }}
        >
          <div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,45,106,0.15) 15%, rgba(255,80,140,1) 45%, rgba(255,255,255,0.95) 50%, rgba(255,80,140,1) 55%, rgba(255,45,106,0.15) 85%, transparent 100%)",
              boxShadow: active
                ? "0 0 12px rgba(255,45,106,0.9), 0 0 28px rgba(255,45,106,0.5)"
                : undefined,
            }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: 6,
              height: 6,
              marginLeft: -3,
              marginTop: -3,
              background: "#fff",
              boxShadow: "0 0 10px #fff, 0 0 20px rgba(255,45,106,1)",
            }}
            animate={active ? { scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/*
          Name motion (ROSE): starts off to the side, slides into the center of the rings.
          Listening = faint / offset. Awakening = travels in. Present = locked center.
        */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
          initial={false}
          animate={{
            x: centered ? 0 : -px * 0.42,
            y: centered ? 0 : px * 0.06,
            opacity: centered ? 1 : mode === "idle" ? 0 : 0.25,
            scale: centered ? 1 : 0.85,
          }}
          transition={{
            duration: forming ? 1.35 : 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <span
            style={{
              fontFamily: "'Russo One', 'Orbitron', Impact, sans-serif",
              fontSize: Math.max(14, px * 0.13),
              letterSpacing: "0.14em",
              color: "#fff",
              textTransform: "uppercase",
              textShadow: centered
                ? "0 0 12px rgba(255,255,255,0.95), 0 0 28px rgba(255,45,106,1), 0 0 48px rgba(255,45,106,0.7)"
                : "0 0 8px rgba(255,45,106,0.4)",
              transform: "skewX(-5deg)",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

function OrbitalRing({
  px,
  scale,
  z,
  duration,
  reverse,
  color,
  particleCount,
  active,
  glow,
}: {
  px: number;
  scale: number;
  z: number;
  duration: number;
  reverse?: boolean;
  color: string;
  particleCount: number;
  active: boolean;
  glow?: boolean;
}) {
  const r = (px / 2) * scale;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        width: 0,
        height: 0,
        transform: `translateZ(${z}px)`,
      }}
      animate={active ? { rotateZ: reverse ? -360 : 360 } : {}}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {Array.from({ length: particleCount }).map((_, i) => {
        const a = (i / particleCount) * Math.PI * 2;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r * 0.42;
        const bright = i % 4 === 0;
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: x,
              top: y,
              width: bright ? 2.5 : 1.5,
              height: bright ? 2.5 : 1.5,
              marginLeft: bright ? -1.25 : -0.75,
              marginTop: bright ? -1.25 : -0.75,
              background: color,
              opacity: bright ? 1 : 0.55,
              boxShadow: glow || bright ? `0 0 6px ${color}` : undefined,
            }}
          />
        );
      })}
    </motion.div>
  );
}
