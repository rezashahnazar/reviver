"use client";

import React, {
  useState,
  useTransition,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReviverTextAreaProps } from "../types";
import { cn } from "../utils/cn";
import { useReviverContext } from "./ReviverProvider";
import { MagicWandIcon, ReloadIcon } from "@radix-ui/react-icons";
import { readStreamableValue } from "ai/rsc";
import {
  rewriteContent,
  getSuggestions,
  getCompletion,
} from "../server/actions";

interface Suggestion {
  impact: string;
  suggestion: string;
}

export function ReviverTextArea({
  label,
  name,
  className,
  value: propValue,
  onChange,
  ...props
}: ReviverTextAreaProps) {
  const [internalValue, setInternalValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<
    Array<{ title: string; content: string }>
  >([]);
  const [inlineCompletion, setInlineCompletion] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { setLoadingActions } = useReviverContext();
  const suggestionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const completionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isControlled = propValue !== undefined;

  // Use either the prop value or internal value
  const value =
    isControlled && typeof propValue === "string" ? propValue : internalValue;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab" && inlineCompletion) {
        e.preventDefault();
        const newValue = inlineCompletion;
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.({
          target: { value: newValue },
        } as React.ChangeEvent<HTMLTextAreaElement>);
        setInlineCompletion(null);
      }
    },
    [inlineCompletion, isControlled, onChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;

      // Always update internal state if not controlled
      if (!isControlled) {
        setInternalValue(newValue);
      }
      setError(null);
      setInlineCompletion(null);

      // Call parent onChange if provided
      onChange?.(e);

      // Clear previous timeouts
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }

      // Set new timeout for inline completion
      if (newValue.trim().length > 3) {
        completionTimeoutRef.current = setTimeout(async () => {
          try {
            const stream = await getCompletion(newValue);
            let buffer = "";

            const reader = stream.getReader();
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // For Uint8Array responses
                const chunk =
                  typeof value === "string"
                    ? value
                    : new TextDecoder().decode(value);

                buffer += chunk;

                // Show completion immediately for any non-empty chunk
                if (buffer) {
                  // Check if we're in the middle of a word
                  const lastChar = newValue[newValue.length - 1];
                  const isInWord = lastChar && /\w/.test(lastChar);
                  const completion = isInWord ? buffer : ` ${buffer}`;
                  setInlineCompletion(newValue + completion);
                }
              }

              // No need for final buffer handling since we're updating immediately
            } finally {
              reader.releaseLock();
            }
          } catch (err) {
            console.error("Inline completion error:", err);
            setInlineCompletion(null);
          }
        }, 300);
      } else {
        setInlineCompletion(null);
      }

      // Set new timeout for suggestions
      if (newValue.trim().length > 10) {
        suggestionTimeoutRef.current = setTimeout(async () => {
          setLoadingActions((prev) => [...prev, "textarea-suggest"]);

          try {
            const response = await getSuggestions(newValue, {
              maxSuggestions: 3,
            });

            if (response.object) {
              const stream = readStreamableValue(response.object);
              for await (const partialObject of stream) {
                if (partialObject?.suggestions) {
                  const serializedSuggestions = partialObject.suggestions.map(
                    (s: Suggestion) => ({
                      title: String(s.impact).toUpperCase(),
                      content: String(s.suggestion),
                    })
                  );
                  setSuggestions(serializedSuggestions);
                }
              }
            }
          } catch (err: unknown) {
            setError(
              err instanceof Error
                ? err.message
                : "An unexpected error occurred"
            );
          } finally {
            setLoadingActions((prev) =>
              prev.filter((a) => a !== "textarea-suggest")
            );
          }
        }, 1000);
      } else {
        setSuggestions([]);
      }
    },
    [isControlled, onChange, setLoadingActions]
  );

  const handleRewrite = useCallback(async () => {
    if (!value || typeof value !== "string") return;

    startTransition(async () => {
      setLoadingActions((prev) => [...prev, "textarea-rewrite"]);
      try {
        const response = await rewriteContent(value);
        if (response.textStream) {
          let rewritten = "";
          const reader = response.textStream.getReader();
          try {
            while (true) {
              const { done, value: chunk } = await reader.read();
              if (done) break;
              rewritten += chunk;
              if (!isControlled) {
                setInternalValue(rewritten);
              }
              onChange?.({
                target: { value: rewritten },
              } as React.ChangeEvent<HTMLTextAreaElement>);
            }
          } finally {
            reader.releaseLock();
          }
        }
      } catch (err: any) {
        setError(err?.message || "An unexpected error occurred");
      } finally {
        setLoadingActions((prev) =>
          prev.filter((a) => a !== "textarea-rewrite")
        );
      }
    });
  }, [value, isControlled, onChange, setLoadingActions]);

  const handleSuggest = useCallback(async () => {
    if (!value || typeof value !== "string") return;

    startTransition(async () => {
      setLoadingActions((prev) => [...prev, "textarea-suggest"]);
      try {
        const response = await getSuggestions(value, { maxSuggestions: 3 });
        if (response.object) {
          const stream = readStreamableValue(response.object);
          for await (const partialObject of stream) {
            if (partialObject?.suggestions) {
              const serializedSuggestions = partialObject.suggestions.map(
                (s: Suggestion) => ({
                  title: String(s.impact).toUpperCase(),
                  content: String(s.suggestion),
                })
              );
              setSuggestions(serializedSuggestions);
            }
          }
        }
      } catch (err: any) {
        setError(err?.message || "An unexpected error occurred");
      } finally {
        setLoadingActions((prev) =>
          prev.filter((a) => a !== "textarea-suggest")
        );
      }
    });
  }, [value, setLoadingActions]);

  const handleSuggestionClick = useCallback(
    (content: string) => {
      if (!isControlled) {
        setInternalValue(content);
      }
      onChange?.({
        target: { value: content },
      } as React.ChangeEvent<HTMLTextAreaElement>);
      setSuggestions([]);
    },
    [isControlled, onChange]
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-2" style={{ marginBottom: "2rem" }}>
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
      </div>

      <div className="relative">
        <div className="relative font-mono">
          <textarea
            {...props}
            ref={textareaRef}
            name={name}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full h-full px-3 py-2 pb-12 rounded-lg ",
              "border border-gray-300",
              "focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:ring-offset-0",
              "transition duration-150",
              "resize-y",
              "font-mono",
              "bg-transparent",
              className
            )}
            style={{
              caretColor: "black",
              height: "150px",
            }}
          />
          {inlineCompletion && (
            <div
              aria-hidden="true"
              className="absolute top-0 inset-0 pointer-events-none"
              style={{
                overflow: "hidden",
                height: "100%",
              }}
            >
              <div
                className="px-3 py-2 pb-12 h-full"
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                <span className="invisible">{value}</span>
                <span className="text-gray-400/70">
                  {inlineCompletion?.slice(String(value).length)}
                </span>
              </div>
            </div>
          )}

          <div className="absolute bottom-3 right-3 flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-md p-1">
            {inlineCompletion && (
              <p className="text-xs text-gray-500">
                Press{" "}
                <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                  Tab
                </kbd>{" "}
                to accept
              </p>
            )}
            <div className="flex gap-2">
              <motion.button
                type="button"
                onClick={handleRewrite}
                disabled={
                  isPending ||
                  !value ||
                  typeof value !== "string" ||
                  !value.trim()
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "p-1.5 rounded-full",
                  "bg-purple-100 text-purple-700",
                  "hover:bg-purple-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition duration-150"
                )}
              >
                <ReloadIcon className="w-3.5 h-3.5" />
              </motion.button>

              <motion.button
                type="button"
                onClick={handleSuggest}
                disabled={
                  isPending ||
                  !value ||
                  typeof value !== "string" ||
                  !value.trim()
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "p-1.5 rounded-full",
                  "bg-purple-100 text-purple-700",
                  "hover:bg-purple-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition duration-150"
                )}
              >
                <MagicWandIcon className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-2 p-2 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {/* Suggestions - More Compact Version */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="mt-2 flex flex-col gap-1.5"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSuggestionClick(suggestion.content)}
                className={cn(
                  "py-1.5 px-2 rounded-md cursor-pointer",
                  "bg-white/50 border border-gray-200",
                  "hover:bg-gray-50",
                  "transition duration-150",
                  "flex items-center gap-2"
                )}
              >
                <span
                  className={cn(
                    "text-[10px] font-medium px-1.5 py-0.5 rounded",
                    suggestion.title === "HIGH" && "bg-red-100 text-red-700",
                    suggestion.title === "MEDIUM" &&
                      "bg-yellow-100 text-yellow-700",
                    suggestion.title === "LOW" && "bg-green-100 text-green-700"
                  )}
                >
                  {suggestion.title}
                </span>
                <p className="text-xs text-gray-600 line-clamp-1">
                  {suggestion.content}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
