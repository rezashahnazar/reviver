"use client";

import React, { useState, useRef, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VivifyProps } from "../types";
import { cn } from "../utils/cn";
import { useReviverContext } from "./ReviverProvider";
import { MagicWandIcon, UpdateIcon } from "@radix-ui/react-icons";
import ReactMarkdown from "react-markdown";
import {
  summarizeContent,
  explainContent,
  extractKeyPoints,
} from "../server/actions";

export function Vivify({ children, additionalContext }: VivifyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  const { setLoadingActions } = useReviverContext();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setResult(null);
  };

  const handleAction = async (action: string) => {
    const content = containerRef.current?.textContent || "";
    if (!content.trim()) return;

    // Clear result immediately when starting a new action
    setResult(null);
    setCurrentAction(action);
    startTransition(async () => {
      setLoadingActions((prev) => [...prev, `vivify-${action}`]);
      try {
        const context = additionalContext
          ? `Additional context: ${JSON.stringify(additionalContext)}`
          : "";

        switch (action) {
          case "summarize": {
            const response = await summarizeContent(content, {
              style: additionalContext?.style as string,
              format: additionalContext?.format as string,
            });
            if (response.success) {
              setResult(response.summary || "No summary available");
            }
            break;
          }
          case "explain": {
            const response = await explainContent(content, {
              depth: additionalContext?.depth as string,
              audience: additionalContext?.audience as string,
            });
            if (response.success && response.stream) {
              let explanation = "";
              const reader = response.stream.getReader();
              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  // Handle both string and Uint8Array responses
                  if (typeof value === "string") {
                    explanation += value;
                  } else if (value instanceof Uint8Array) {
                    explanation += new TextDecoder().decode(value);
                  }
                  setResult(explanation);
                }
              } finally {
                reader.releaseLock();
              }
            }
            break;
          }
          case "keyPoints": {
            const response = await extractKeyPoints(
              content,
              (additionalContext?.maxPoints as number) || 5
            );
            if (response.success && response.points) {
              setResult(
                response.points
                  .map(
                    (p) => `* **${p.point}**\n  *(Importance: ${p.importance})*`
                  )
                  .join("\n\n")
              );
            }
            break;
          }
        }
      } catch (err: any) {
        console.error("Action error:", err);
        setResult(`Error: ${err.message}`);
      } finally {
        setLoadingActions((prev) =>
          prev.filter((a) => a !== `vivify-${action}`)
        );
        setCurrentAction(null);
      }
    });
  };

  return (
    <div
      ref={containerRef}
      onContextMenu={handleContextMenu}
      className="relative group"
    >
      {/* Magical ring on hover */}
      <motion.div
        initial={false}
        animate={{
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.95,
        }}
        className={cn(
          "absolute -inset-1 rounded-lg",
          "bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20",
          "group-hover:opacity-100 opacity-0 transition-opacity duration-300",
          "pointer-events-none"
        )}
      />

      {children}

      {/* AI action button */}
      <button
        onClick={() => setIsOpen(true)}
        className="opacity-0 group-hover:opacity-100 transition absolute -right-6 top-0 p-1.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700"
        aria-label="Open AI actions"
      >
        <MagicWandIcon className="w-4 h-4" />
      </button>

      {/* Context menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 right-0 z-50 w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">AI Actions</h3>
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>

              <div className="space-y-2">
                {["summarize", "explain", "keyPoints"].map((action) => (
                  <button
                    key={action}
                    onClick={() => handleAction(action)}
                    disabled={isPending}
                    className={cn(
                      "w-full px-4 py-2 text-left rounded-lg transition",
                      "bg-purple-50 hover:bg-purple-100",
                      "text-purple-700 hover:text-purple-800",
                      "flex items-center gap-2",
                      isPending && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isPending && action === currentAction && (
                      <UpdateIcon className="w-4 h-4 animate-spin" />
                    )}
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                  </button>
                ))}
              </div>

              {result && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg max-h-[60vh] overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
