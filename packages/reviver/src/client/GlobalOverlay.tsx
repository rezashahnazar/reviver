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
          {/* Magical gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          />

          {/* Radial pulse effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
