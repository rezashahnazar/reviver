"use server";

import { generateText, streamText, generateObject, streamObject } from "ai";
import { openai, dedupedRequest } from "./openAI";
import { createStreamableValue } from "ai/rsc";
import {
  SummarizeResponse,
  ExplainResponse,
  KeyPointsResponse,
  keyPointsSchema,
  suggestionsSchema,
  SuggestionsActionResponse,
  RewriteActionResponse,
} from "../types";
import { z } from "zod";

export async function summarizeContent(
  content: string,
  options?: { style?: string; format?: string }
): Promise<SummarizeResponse> {
  return dedupedRequest(
    `summarize:${content}:${JSON.stringify(options)}`,
    async () => {
      try {
        const { text } = await generateText({
          model: openai("gpt-4o-mini"),
          messages: [
            {
              role: "system",
              content:
                "You are a professional content summarizer. Your summaries are clear, accurate, and maintain the key points of the original content.",
            },
            {
              role: "user",
              content: `Summarize the following content in a ${
                options?.style || "concise"
              } ${options?.format || "paragraph"} format:

${content}`,
            },
          ],
          temperature: 0.3,
          maxTokens: 500,
        });

        return { success: true, summary: text };
      } catch (err: any) {
        return { success: false, error: err?.message || "An error occurred" };
      }
    }
  );
}

export async function explainContent(
  content: string,
  options?: { depth?: string; audience?: string }
): Promise<ExplainResponse> {
  try {
    const stream = streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content:
            "You are an expert at explaining complex topics in a clear and understandable way.",
        },
        {
          role: "user",
          content: `Explain the following content at a ${
            options?.depth || "detailed"
          } level for a ${options?.audience || "general"} audience:

${content}`,
        },
      ],
      temperature: 0.5,
      maxTokens: 1000,
    });

    return { success: true, stream: stream.textStream };
  } catch (err: any) {
    return { success: false, error: err?.message || "An error occurred" };
  }
}

export async function extractKeyPoints(
  content: string,
  maxPoints: number = 5
): Promise<KeyPointsResponse> {
  return dedupedRequest(`keyPoints:${content}:${maxPoints}`, async () => {
    try {
      const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: z.object({
          points: keyPointsSchema,
        }),
        messages: [
          {
            role: "system",
            content:
              "You are an expert at extracting and analyzing key points from content.",
          },
          {
            role: "user",
            content: `Extract the ${maxPoints} most important key points from the following content:

${content}`,
          },
        ],
        temperature: 0.3,
        maxTokens: 1000,
      });

      return { success: true, points: object.points };
    } catch (err: any) {
      console.error("Extract key points error:", err);
      return { success: false, error: err?.message || "An error occurred" };
    }
  });
}

export async function getSuggestions(
  content: string,
  options?: {
    maxSuggestions?: number;
    context?: string;
    focus?: string;
  }
): Promise<SuggestionsActionResponse> {
  try {
    const stream = createStreamableValue();

    (async () => {
      try {
        const { partialObjectStream } = await streamObject({
          model: openai("gpt-4o-mini"),
          schema: z.object({
            suggestions: suggestionsSchema,
          }),
          messages: [
            {
              role: "system",
              content:
                "You are an expert content optimization advisor. Analyze content and provide actionable suggestions for improvement.",
            },
            {
              role: "user",
              content: `Provide ${
                options?.maxSuggestions || 3
              } suggestions to improve the following content${
                options?.focus ? `, focusing on ${options.focus}` : ""
              }${options?.context ? `. Context: ${options.context}` : ""}:

${content}`,
            },
          ],
          temperature: 0.4,
          maxTokens: 1000,
        });

        for await (const partialObject of partialObjectStream) {
          stream.update(partialObject);
        }
        stream.done();
      } catch (error) {
        stream.error(error);
      }
    })();

    return { object: stream.value };
  } catch (err: any) {
    console.error("Get suggestions error:", err);
    throw new Error(err?.message || "An error occurred");
  }
}

export async function rewriteContent(
  content: string,
  options?: { style?: string; tone?: string; target?: string }
): Promise<RewriteActionResponse> {
  if (!content?.trim()) {
    throw new Error("Please provide content to rewrite");
  }

  try {
    const { textStream } = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content:
            "You are an expert content writer. Rewrite content while maintaining its core message and improving its effectiveness.",
        },
        {
          role: "user",
          content: `Rewrite the following content with a ${
            options?.style || "professional"
          } style and ${options?.tone || "neutral"} tone${
            options?.target ? `, optimized for ${options.target}` : ""
          }:

${content}`,
        },
      ],
      temperature: 0.4,
      maxTokens: 1000,
    });

    return { textStream };
  } catch (err: any) {
    console.error("Rewrite content error:", err);
    throw new Error(err?.message || "An error occurred");
  }
}

export async function getCompletion(content: string) {
  const { textStream } = await streamText({
    model: openai("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant that completes text naturally. Only provide the completion part that follows the user's input, without repeating their text. Keep completions concise and relevant. Never start with the user's text.",
      },
      {
        role: "user",
        content: `Complete this text naturally (only provide the completion part): ${content}`,
      },
    ],
    temperature: 0.4,
    maxTokens: 50,
    topP: 0.9,
    presencePenalty: 0.6,
    frequencyPenalty: 0.6,
  });

  // Transform the stream to ensure proper spacing
  const transformedStream = new TransformStream({
    transform(chunk, controller) {
      // If this is the first chunk and it doesn't start with a space, add one
      if (!chunk.startsWith(" ")) {
        controller.enqueue(" " + chunk);
      } else {
        controller.enqueue(chunk);
      }
    },
  });

  return textStream.pipeThrough(transformedStream);
}
