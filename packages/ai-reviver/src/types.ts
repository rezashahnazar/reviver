import { ReactNode } from "react";
import { z } from "zod";
import { StreamableValue } from "ai/rsc";

// Zod Schemas
export const keyPointSchema = z.object({
  point: z.string(),
  importance: z.number().min(1).max(10),
  context: z.string().optional(),
});

export const keyPointsSchema = z.array(keyPointSchema);

export const suggestionSchema = z.object({
  suggestion: z.string(),
  impact: z.enum(["high", "medium", "low"]),
  reasoning: z.string(),
  implementation: z.string().optional(),
});

export const suggestionsSchema = z.array(suggestionSchema);

// Server Action Response Types
export interface BaseResponse {
  success: boolean;
  error?: string;
}

export interface SummarizeResponse extends BaseResponse {
  summary?: string;
}

export interface ExplainResponse extends BaseResponse {
  stream?: ReadableStream;
}

export type KeyPoint = z.infer<typeof keyPointSchema>;
export type KeyPoints = z.infer<typeof keyPointsSchema>;

export interface KeyPointsResponse extends BaseResponse {
  points?: KeyPoints;
}

export type Suggestion = z.infer<typeof suggestionSchema>;
export type Suggestions = z.infer<typeof suggestionsSchema>;

export interface SuggestionsResponse extends BaseResponse {
  suggestions?: Suggestions;
}

export type StreamingSuggestionsResponse = {
  object: StreamableValue<{ suggestions: Suggestion[] }>;
};

export type StreamingRewriteResponse = {
  textStream: ReadableStream<string>;
};

export type SuggestionsActionResponse = StreamingSuggestionsResponse;
export type RewriteActionResponse = StreamingRewriteResponse;

export interface InterceptOption {
  label: string;
  action: (
    content: string,
    options?: Record<string, any>
  ) => Promise<SuggestionsActionResponse | RewriteActionResponse>;
  data?: Record<string, any>;
}

export type ReviverAction =
  | "summarize"
  | "explain"
  | "keyPoints"
  | "suggestions"
  | "rewrite";

export type InterceptorPosition = "top" | "bottom" | "left" | "right";

export interface ReviverConfig {
  vivify: {
    actions: ReviverAction[];
    contextMenu: boolean;
    hoverCard: boolean;
  };
  interceptor: {
    showConfirmation: boolean;
    position: InterceptorPosition;
  };
  textArea: {
    suggestions: boolean;
    autoComplete: boolean;
    enhancementActions: ReviverAction[];
  };
}

// Component Props Types
export interface ReviverContextValue {
  loadingActions: string[];
  setLoadingActions: React.Dispatch<React.SetStateAction<string[]>>;
  config: ReviverConfig;
}

export interface VivifyProps {
  children: ReactNode;
  additionalContext?: Record<string, any>;
}

export interface OnClickInterceptorProps {
  children: ReactNode;
  onOriginalClick: () => void;
  onInterceptOptions: InterceptOption[];
}

export interface ReviverTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  name: string;
}

export interface ReviverObserverProps {
  onDataCollected?: (data: ObserverData) => void;
}

export interface ObserverData {
  timeSpent: number;
  idle: boolean;
  scrollDepth?: number;
  suggestions?: Suggestions;
}

export interface GlobalOverlayProps {
  className?: string;
}

export interface ReviverProviderProps {
  children: ReactNode;
  config?: Partial<ReviverConfig>;
}
