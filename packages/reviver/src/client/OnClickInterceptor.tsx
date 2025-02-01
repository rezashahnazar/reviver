"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OnClickInterceptorProps } from "../types";
import { cn } from "../utils/cn";
import { useReviverContext } from "./ReviverProvider";
import { UpdateIcon } from "@radix-ui/react-icons";
import ReactMarkdown from "react-markdown";
import { readStreamableValue } from "ai/rsc";
import { Suggestion } from "../types";

export function OnClickInterceptor({
  children,
  onOriginalClick,
  onInterceptOptions,
}: OnClickInterceptorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [currentOption, setCurrentOption] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { setLoadingActions } = useReviverContext();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setResult(null);
  };

  const handleOptionClick = async (
    option: (typeof onInterceptOptions)[number]
  ) => {
    setResult(null);
    setCurrentOption(option.label);
    startTransition(async () => {
      setLoadingActions((prev) => [...prev, `intercept-${option.label}`]);
      try {
        const content = option.data?.content as string;
        if (!content) return;

        const response = await option.action(content, option.data);

        if (response && "object" in response && response.object) {
          const stream = readStreamableValue(response.object);
          let currentSuggestions: Suggestion[] = [];

          for await (const partialObject of stream) {
            if (
              partialObject &&
              "suggestions" in partialObject &&
              Array.isArray(partialObject.suggestions)
            ) {
              currentSuggestions = partialObject.suggestions;
              const formattedSuggestions = currentSuggestions
                .map(
                  (s, i) =>
                    `${i + 1}. **${s.suggestion}** (Impact: ${s.impact})\n${
                      s.reasoning
                    }${
                      s.implementation
                        ? `\n\nImplementation: ${s.implementation}`
                        : ""
                    }`
                )
                .join("\n\n");
              setResult(formattedSuggestions);
            }
          }
        } else if (response && "textStream" in response) {
          let rewritten = "";
          const reader = response.textStream.getReader();
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              rewritten += value;
              setResult(rewritten);
            }
          } finally {
            reader.releaseLock();
          }
        }
      } catch (err: any) {
        console.error("Stream processing error:", err);
        setResult(`Error: ${err?.message || "An unexpected error occurred"}`);
      } finally {
        setLoadingActions((prev) =>
          prev.filter((a) => a !== `intercept-${option.label}`)
        );
        setCurrentOption(null);
      }
    });
  };

  const handleProceed = () => {
    handleClose();
    onOriginalClick();
  };

  return (
    <>
      <div onClick={handleClick}>{children}</div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40"
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className={cn(
                "relative bg-white w-[90vw] max-w-md",
                "rounded-lg shadow-xl p-6 space-y-4"
              )}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <h2 className="text-lg font-semibold text-gray-900">
                AI Options Available
              </h2>

              <div className="space-y-2">
                {onInterceptOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleOptionClick(option)}
                    disabled={isPending}
                    className={cn(
                      "w-full px-4 py-2 rounded-md text-left",
                      "bg-purple-50 hover:bg-purple-100",
                      "text-purple-700 hover:text-purple-800",
                      "transition-colors duration-150",
                      "flex items-center gap-2",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {isPending && option.label === currentOption && (
                      <UpdateIcon className="w-4 h-4 animate-spin" />
                    )}
                    {isPending && option.label === currentOption
                      ? "Processing..."
                      : option.label}
                  </button>
                ))}
              </div>

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-gray-50 rounded-md max-h-[60vh] overflow-y-auto"
                >
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-4">{children}</p>,
                        strong: ({ children }) => (
                          <strong className="font-semibold text-purple-700">
                            {children}
                          </strong>
                        ),
                      }}
                    >
                      {result}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleClose}
                  disabled={isPending}
                  className={cn(
                    "px-4 py-2 rounded-md",
                    "text-gray-700 hover:text-gray-900",
                    "transition-colors duration-150",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceed}
                  disabled={isPending}
                  className={cn(
                    "px-4 py-2 rounded-md",
                    "bg-purple-600 hover:bg-purple-700",
                    "text-white",
                    "transition-colors duration-150",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isPending ? "Processing..." : "Proceed"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
