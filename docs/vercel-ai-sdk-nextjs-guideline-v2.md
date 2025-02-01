# Vercel AI SDK Implementation with Next.js 15

## 1. Environment Setup

```typescript
// lib/ai-provider.ts
import { createOpenAI } from "@ai-sdk/openai";

export const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict", // Required for OpenAI-compatible providers
});
```

## 2. Server Actions Implementation

```typescript
// app/actions.ts
"use server";

import { openai } from "@/lib/ai-provider";
import { generateText, streamText, generateObject, streamObject } from "ai";
import { z } from "zod";

// Text Generation
export async function generateContent(prompt: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: "You are a helpful AI assistant",
      prompt,
    });
    return { success: true, data: text };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Text Streaming
export async function streamContent(prompt: string) {
  const stream = streamText({
    model: openai("gpt-4o-mini"),
    system: "Generate streaming content",
    prompt,
  });

  return stream.textStream;
}

// Structured Object Generation
const recipeSchema = z.object({
  title: z.string(),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
});

export async function generateStructuredRecipe(prompt: string) {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: recipeSchema,
    prompt: `Create recipe for: ${prompt}`,
  });

  return object;
}

// Streaming Object Generation
export async function streamStructuredData(prompt: string) {
  const stream = streamObject({
    model: openai("gpt-4o-mini"),
    schema: recipeSchema,
    prompt: `Stream recipe for: ${prompt}`,
  });

  return stream.objectStream;
}
```

## 3. UI Component Implementation

```typescript
// components/ai-form.tsx
"use client";

import { useState, useTransition } from "react";
import {
  generateContent,
  streamContent,
  generateStructuredRecipe,
  streamStructuredData,
} from "@/app/actions";

export function AIForm() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleGenerate = async () => {
    startTransition(async () => {
      const response = await generateContent(input);
      if (response.success) setResult(response.data);
    });
  };

  const handleStream = async () => {
    startTransition(async () => {
      const stream = await streamContent(input);
      let fullResponse = "";

      for await (const chunk of stream) {
        fullResponse += chunk;
        setResult(fullResponse);
      }
    });
  };

  return (
    <div className="space-y-4">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 w-full"
      />

      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          disabled={isPending}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {isPending ? "Generating..." : "Generate Text"}
        </button>

        <button
          onClick={handleStream}
          disabled={isPending}
          className="bg-green-500 text-white p-2 rounded"
        >
          {isPending ? "Streaming..." : "Stream Text"}
        </button>
      </div>

      {result && <div className="p-4 bg-gray-100 rounded">{result}</div>}
    </div>
  );
}
```

## 4. Loading State Handling

Implement React 19's `useTransition` for smooth loading states:

```typescript
// components/structured-generator.tsx
"use client";

import { useActionState } from "react";
import { generateStructuredRecipe } from "@/app/actions";

export function StructuredGenerator() {
  const [state, formAction] = useActionState(generateStructuredRecipe, null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    startTransition(() => formAction(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="prompt" required />
      <button type="submit" disabled={isPending}>
        {isPending ? "Generating..." : "Create Recipe"}
      </button>

      {state?.error && <p className="text-red-500">{state.error}</p>}
      {state?.data && (
        <div className="recipe-output">
          <h3>{state.data.title}</h3>
          <ul>
            {state.data.ingredients.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <ol>
            {state.data.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      )}
    </form>
  );
}
```

## 5. Best Practices

1. **Error Handling**:

   - Use try/catch blocks in server actions
   - Return standardized error formats
   - Implement error boundaries in UI components

2. **Streaming Optimization**:

   ```typescript
   // Optimized streaming implementation
   const handleStream = async () => {
     const stream = await streamContent(input);
     let buffer = "";

     for await (const chunk of stream) {
       buffer += chunk;
       // Batch updates for better performance
       if (buffer.length > 100 || chunk.endsWith(" ")) {
         setResult((prev) => prev + buffer);
         buffer = "";
       }
     }
     if (buffer) setResult((prev) => prev + buffer);
   };
   ```

3. **Type Safety**:

   - Use Zod for schema validation
   - Generate TypeScript types from schemas
   - Implement runtime validation in server actions

4. **Security**:

   ```typescript
   // Secure server actions
   "use server";

   import { auth } from "@/lib/auth";

   export async function secureGenerate(prompt: string) {
     const session = await auth();
     if (!session) throw new Error("Unauthorized");

     return generateContent(prompt);
   }
   ```

## 6. Advanced Usage

For streaming objects with real-time updates:

```typescript
// components/stream-object.tsx
'use client';

import { useActionState } from 'react';
import { streamStructuredData } from '@/app/actions';

export function StreamObject() {
  const [recipe, setRecipe] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleStream = async (prompt) => {
    startTransition(async () => {
      const stream = await streamStructuredData(prompt);

      for await (const partialRecipe of stream) {
        setRecipe(current => ({
          ...current,
          ...partialRecipe
        }));
      }
    });
  };

  return (
    // Component implementation
  );
}
```

## 7. Performance Considerations

1. Use React 19's `cache` API for repeated requests:

   ```typescript
   import { cache } from "react";

   export const getCachedResponse = cache(async (prompt) => {
     return generateContent(prompt);
   });
   ```

2. Implement request deduplication:

   ```typescript
   const pendingRequests = new Map();

   export async function dedupedRequest(prompt) {
     if (pendingRequests.has(prompt)) {
       return pendingRequests.get(prompt);
     }

     const promise = generateContent(prompt);
     pendingRequests.set(prompt, promise);

     try {
       const result = await promise;
       return result;
     } finally {
       pendingRequests.delete(prompt);
     }
   }
   ```

This implementation follows Next.js 15's latest patterns[14][38] and React 19's new features[40][69], ensuring optimal performance and security while leveraging Vercel AI SDK's full capabilities[1][35][60].
