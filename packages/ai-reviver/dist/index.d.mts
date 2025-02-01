import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';
import { z } from 'zod';
import { StreamableValue } from 'ai/rsc';
import * as _ai_sdk_openai from '@ai-sdk/openai';

declare const keyPointSchema: z.ZodObject<{
    point: z.ZodString;
    importance: z.ZodNumber;
    context: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    point: string;
    importance: number;
    context?: string | undefined;
}, {
    point: string;
    importance: number;
    context?: string | undefined;
}>;
declare const keyPointsSchema: z.ZodArray<z.ZodObject<{
    point: z.ZodString;
    importance: z.ZodNumber;
    context: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    point: string;
    importance: number;
    context?: string | undefined;
}, {
    point: string;
    importance: number;
    context?: string | undefined;
}>, "many">;
declare const suggestionSchema: z.ZodObject<{
    suggestion: z.ZodString;
    impact: z.ZodEnum<["high", "medium", "low"]>;
    reasoning: z.ZodString;
    implementation: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    suggestion: string;
    impact: "high" | "medium" | "low";
    reasoning: string;
    implementation?: string | undefined;
}, {
    suggestion: string;
    impact: "high" | "medium" | "low";
    reasoning: string;
    implementation?: string | undefined;
}>;
declare const suggestionsSchema: z.ZodArray<z.ZodObject<{
    suggestion: z.ZodString;
    impact: z.ZodEnum<["high", "medium", "low"]>;
    reasoning: z.ZodString;
    implementation: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    suggestion: string;
    impact: "high" | "medium" | "low";
    reasoning: string;
    implementation?: string | undefined;
}, {
    suggestion: string;
    impact: "high" | "medium" | "low";
    reasoning: string;
    implementation?: string | undefined;
}>, "many">;
interface BaseResponse {
    success: boolean;
    error?: string;
}
interface SummarizeResponse extends BaseResponse {
    summary?: string;
}
interface ExplainResponse extends BaseResponse {
    stream?: ReadableStream;
}
type KeyPoint = z.infer<typeof keyPointSchema>;
type KeyPoints = z.infer<typeof keyPointsSchema>;
interface KeyPointsResponse extends BaseResponse {
    points?: KeyPoints;
}
type Suggestion = z.infer<typeof suggestionSchema>;
type Suggestions = z.infer<typeof suggestionsSchema>;
interface SuggestionsResponse extends BaseResponse {
    suggestions?: Suggestions;
}
type StreamingSuggestionsResponse = {
    object: StreamableValue<{
        suggestions: Suggestion[];
    }>;
};
type StreamingRewriteResponse = {
    textStream: ReadableStream<string>;
};
type SuggestionsActionResponse = StreamingSuggestionsResponse;
type RewriteActionResponse = StreamingRewriteResponse;
interface InterceptOption {
    label: string;
    action: (content: string, options?: Record<string, any>) => Promise<SuggestionsActionResponse | RewriteActionResponse>;
    data?: Record<string, any>;
}
type ReviverAction = "summarize" | "explain" | "keyPoints" | "suggestions" | "rewrite";
type InterceptorPosition = "top" | "bottom" | "left" | "right";
interface ReviverConfig {
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
interface ReviverContextValue {
    loadingActions: string[];
    setLoadingActions: React.Dispatch<React.SetStateAction<string[]>>;
    config: ReviverConfig;
}
interface VivifyProps {
    children: ReactNode;
    additionalContext?: Record<string, any>;
}
interface OnClickInterceptorProps {
    children: ReactNode;
    onOriginalClick: () => void;
    onInterceptOptions: InterceptOption[];
}
interface ReviverTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    name: string;
}
interface ReviverObserverProps {
    onDataCollected?: (data: ObserverData) => void;
}
interface ObserverData {
    timeSpent: number;
    idle: boolean;
    scrollDepth?: number;
    suggestions?: Suggestions;
}
interface GlobalOverlayProps {
    className?: string;
}
interface ReviverProviderProps {
    children: ReactNode;
    config?: Partial<ReviverConfig>;
}

declare function Vivify({ children, additionalContext }: VivifyProps): react_jsx_runtime.JSX.Element;

declare function OnClickInterceptor({ children, onOriginalClick, onInterceptOptions, }: OnClickInterceptorProps): react_jsx_runtime.JSX.Element;

declare function ReviverTextArea({ label, name, className, value: propValue, onChange, ...props }: ReviverTextAreaProps): react_jsx_runtime.JSX.Element;

declare function ReviverObserver({ onDataCollected }: ReviverObserverProps): null;

declare function GlobalOverlay({ className }: GlobalOverlayProps): react_jsx_runtime.JSX.Element;

declare function useReviverContext(): ReviverContextValue;
declare function ReviverProvider({ children, config, }: ReviverProviderProps): react_jsx_runtime.JSX.Element;

interface ReviverDrawerProps {
    trigger: ReactNode;
    title?: string;
    description?: string;
    children: ReactNode;
    isProcessing?: boolean;
    className?: string;
    shouldScaleBackground?: boolean;
    onAction?: () => Promise<void>;
    onClearResults?: () => void;
    streamResult?: ReactNode;
}
declare function ReviverDrawer({ trigger, title, description, children, isProcessing, className, shouldScaleBackground, onClearResults, streamResult, }: Omit<ReviverDrawerProps, "onAction">): react_jsx_runtime.JSX.Element;

declare function summarizeContent(content: string, options?: {
    style?: string;
    format?: string;
}): Promise<SummarizeResponse>;
declare function explainContent(content: string, options?: {
    depth?: string;
    audience?: string;
}): Promise<ExplainResponse>;
declare function extractKeyPoints(content: string, maxPoints?: number): Promise<KeyPointsResponse>;
declare function getSuggestions(content: string, options?: {
    maxSuggestions?: number;
    context?: string;
    focus?: string;
}): Promise<SuggestionsActionResponse>;
declare function rewriteContent(content: string, options?: {
    style?: string;
    tone?: string;
    target?: string;
}): Promise<RewriteActionResponse>;

declare const openai: _ai_sdk_openai.OpenAIProvider;
declare function dedupedRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T>;

export { type BaseResponse, type ExplainResponse, GlobalOverlay, type GlobalOverlayProps, type InterceptOption, type InterceptorPosition, type KeyPoint, type KeyPoints, type KeyPointsResponse, type ObserverData, OnClickInterceptor, type OnClickInterceptorProps, type ReviverAction, type ReviverConfig, type ReviverContextValue, ReviverDrawer, type ReviverDrawerProps, ReviverObserver, type ReviverObserverProps, ReviverProvider, type ReviverProviderProps, ReviverTextArea, type ReviverTextAreaProps, type RewriteActionResponse, type StreamingRewriteResponse, type StreamingSuggestionsResponse, type Suggestion, type Suggestions, type SuggestionsActionResponse, type SuggestionsResponse, type SummarizeResponse, Vivify, type VivifyProps, dedupedRequest, explainContent, extractKeyPoints, getSuggestions, keyPointSchema, keyPointsSchema, openai, rewriteContent, suggestionSchema, suggestionsSchema, summarizeContent, useReviverContext };
