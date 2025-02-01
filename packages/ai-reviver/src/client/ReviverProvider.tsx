"use client";

import { createContext, useContext, useState } from "react";
import {
  ReviverContextValue,
  ReviverProviderProps,
  ReviverConfig,
} from "../types";
import { deepMerge } from "../utils";

const defaultConfig: ReviverConfig = {
  vivify: {
    actions: ["summarize", "explain", "keyPoints"],
    contextMenu: true,
    hoverCard: true,
  },
  interceptor: {
    showConfirmation: true,
    position: "bottom",
  },
  textArea: {
    suggestions: true,
    autoComplete: true,
    enhancementActions: ["rewrite", "suggestions"],
  },
};

const ReviverContext = createContext<ReviverContextValue | null>(null);

export function useReviverContext() {
  const context = useContext(ReviverContext);
  if (!context) {
    throw new Error("useReviverContext must be used within a ReviverProvider");
  }
  return context;
}

export function ReviverProvider({
  children,
  config = {},
}: ReviverProviderProps) {
  const [loadingActions, setLoadingActions] = useState<string[]>([]);

  // Merge default config with user provided config
  const mergedConfig = deepMerge(defaultConfig, config) as ReviverConfig;

  return (
    <ReviverContext.Provider
      value={{ loadingActions, setLoadingActions, config: mergedConfig }}
    >
      {children}
    </ReviverContext.Provider>
  );
}
