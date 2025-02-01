import { createOpenAI } from "@ai-sdk/openai";
import { generateText as aiGenerateText } from "ai";

export interface OpenAIConfig {
  apiKey?: string;
  baseURL?: string;
}

export const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
  apiKey: process.env.OPENAI_API_KEY!,
  compatibility: "strict", // Required for OpenAI-compatible providers
});

// Cache for request deduplication
const pendingRequests = new Map();

export async function dedupedRequest<T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const promise = requestFn();
  pendingRequests.set(key, promise);

  try {
    const result = await promise;
    return result;
  } finally {
    pendingRequests.delete(key);
  }
}

export function createServerOpenAI(config?: {
  apiKey?: string;
  baseURL?: string;
}) {
  return createOpenAI({
    apiKey: config?.apiKey || process.env.OPENAI_API_KEY!,
    baseURL:
      config?.baseURL ||
      process.env.OPENAI_BASE_URL ||
      "https://api.openai.com/v1",
    compatibility: "strict",
  });
}

export async function generateText(
  openai: ReturnType<typeof createOpenAI>,
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
) {
  const { text } = await aiGenerateText({
    model: openai(options?.model || "gpt-4-turbo-preview"),
    prompt,
    temperature: options?.temperature,
    maxTokens: options?.maxTokens,
  });

  return text;
}

export async function generateSuggestions(
  openai: ReturnType<typeof createOpenAI>,
  content: string,
  count: number = 3
) {
  const prompt = `Generate ${count} alternative versions of the following text, each with a different style or tone. Return them as a JSON array where each item has 'title' and 'content' fields.

Text to rewrite:
${content}`;

  const { text } = await aiGenerateText({
    model: openai("gpt-4-turbo-preview"),
    prompt,
    temperature: 0.7,
  });

  const suggestions = JSON.parse(text);
  return suggestions;
}

export async function summarizeContent(
  openai: ReturnType<typeof createOpenAI>,
  content: string,
  options?: {
    style?: "concise" | "detailed";
    format?: "paragraph" | "bullets";
  }
) {
  const style = options?.style || "concise";
  const format = options?.format || "paragraph";

  const prompt = `Summarize the following content in a ${style} ${format} format:

${content}`;

  return generateText(openai, prompt, {
    temperature: 0.3,
  });
}

export async function explainContent(
  openai: ReturnType<typeof createOpenAI>,
  content: string,
  options?: {
    depth?: "basic" | "detailed" | "expert";
    audience?: "general" | "technical" | "expert";
  }
) {
  const depth = options?.depth || "detailed";
  const audience = options?.audience || "general";

  const prompt = `Explain the following content at a ${depth} level for a ${audience} audience:

${content}`;

  return generateText(openai, prompt, {
    temperature: 0.5,
  });
}

export async function extractKeyPoints(
  openai: ReturnType<typeof createOpenAI>,
  content: string,
  maxPoints: number = 5
) {
  const prompt = `Extract the ${maxPoints} most important key points from the following content and return them as a JSON array of strings:

${content}`;

  const { text } = await aiGenerateText({
    model: openai("gpt-4-turbo-preview"),
    prompt,
    temperature: 0.3,
  });

  const { points } = JSON.parse(text);
  return points.join("\n");
}
