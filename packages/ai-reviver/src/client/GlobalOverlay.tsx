"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useReviverContext } from "./ReviverProvider";
import { GlobalOverlayProps } from "../types";
import { cn } from "../utils/cn";

export function GlobalOverlay({ className }: GlobalOverlayProps) {
  const { loadingActions } = useReviverContext();
  const isActive = loadingActions.length > 0;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed inset-0 z-[9999] pointer-events-none",
            className
          )}
        >
          {/* SVG Filters for magical AI flow effects */}
          <svg className="fixed inset-0 w-0 h-0">
            <defs>
              <filter id="magical-flow-primary">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.008 0.006"
                  numOctaves="4"
                  seed="1"
                >
                  <animate
                    attributeName="baseFrequency"
                    dur="30s"
                    keyTimes="0;0.25;0.5;0.75;1"
                    values="0.008 0.006;0.012 0.008;0.008 0.01;0.01 0.008;0.008 0.006"
                    repeatCount="indefinite"
                  />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" scale="120" />
                <feGaussianBlur stdDeviation="4" />
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0
                          0 1 0 0 0
                          0 0 1 0 0
                          0 0 0 0.8 0"
                />
              </filter>

              <filter id="magical-flow-secondary">
                <feTurbulence
                  type="turbulence"
                  baseFrequency="0.015 0.012"
                  numOctaves="3"
                  seed="2"
                >
                  <animate
                    attributeName="baseFrequency"
                    dur="25s"
                    keyTimes="0;0.33;0.66;1"
                    values="0.015 0.012;0.008 0.015;0.012 0.008;0.015 0.012"
                    repeatCount="indefinite"
                  />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" scale="40" />
                <feGaussianBlur stdDeviation="2" />
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0
                          0 1 0 0 0
                          0 0 1 0 0
                          0 0 0 0.6 0"
                />
              </filter>

              <filter id="magical-glow">
                <feGaussianBlur stdDeviation="6" />
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0.2
                          0 1 0 0 0.1
                          0 0 1 0 0.3
                          0 0 0 1 0"
                />
              </filter>
            </defs>
          </svg>

          {/* Magical gradient overlay with enhanced mask */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              backgroundSize: "200% 200%",
              maskImage: `radial-gradient(
                ellipse 95% 85% at 50% 50%,
                transparent 30%,
                rgba(0, 0, 0, 0.2) 45%,
                rgba(0, 0, 0, 0.4) 50%,
                black 65%
              )`,
              WebkitMaskImage: `radial-gradient(
                ellipse 95% 85% at 50% 50%,
                transparent 30%,
                rgba(0, 0, 0, 0.2) 45%,
                rgba(0, 0, 0, 0.4) 50%,
                black 65%
              )`,
              filter: "url(#magical-flow-primary)",
            }}
          />

          {/* Secondary magical flow layer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"
            animate={{
              backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              backgroundSize: "200% 200%",
              maskImage: `radial-gradient(
                ellipse 95% 85% at 50% 50%,
                transparent 30%,
                rgba(0, 0, 0, 0.2) 45%,
                rgba(0, 0, 0, 0.4) 50%,
                black 65%
              )`,
              WebkitMaskImage: `radial-gradient(
                ellipse 95% 85% at 50% 50%,
                transparent 30%,
                rgba(0, 0, 0, 0.2) 45%,
                rgba(0, 0, 0, 0.4) 50%,
                black 65%
              )`,
              filter: "url(#magical-flow-secondary)",
              mixBlendMode: "soft-light",
            }}
          />

          {/* Ethereal glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-300/10 to-blue-400/10"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.15, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              maskImage: `radial-gradient(
                ellipse 95% 85% at 50% 50%,
                transparent 30%,
                rgba(0, 0, 0, 0.2) 45%,
                rgba(0, 0, 0, 0.4) 50%,
                black 65%
              )`,
              WebkitMaskImage: `radial-gradient(
                ellipse 95% 85% at 50% 50%,
                transparent 30%,
                rgba(0, 0, 0, 0.2) 45%,
                rgba(0, 0, 0, 0.4) 50%,
                black 65%
              )`,
              filter: "url(#magical-glow)",
              mixBlendMode: "screen",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
