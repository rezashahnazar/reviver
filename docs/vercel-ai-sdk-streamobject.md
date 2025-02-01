Here's a complete implementation guide for using `streamObject` with Vercel AI SDK 4.1+ using modern patterns and loading state management:

```typescript
// .env.local
OPENAI_BASE_URL = "your-custom-endpoint";
OPENAI_API_KEY = "your-key";
```

```typescript
// lib/openai.ts
import { createOpenAI } from "@ai-sdk/openai";

export const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});
```

```typescript
// app/api/chat/actions.ts
"use server";

import { streamObject } from "ai";
import { openai } from "@/lib/openai";
import { z } from "zod";
import { createStreamableValue } from "ai/rsc";

// Define schema for structured output
const notificationSchema = z.object({
  notifications: z.array(
    z.object({
      name: z.string(),
      message: z.string(),
      minutesAgo: z.number(),
    })
  ),
});

export async function generateNotifications(input: string) {
  const stream = createStreamableValue();

  (async () => {
    try {
      const { partialObjectStream } = await streamObject({
        model: openai("gpt-4-turbo"),
        system: "Generate app notifications",
        prompt: input,
        schema: notificationSchema,
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
}
```

```typescript
// app/components/notification-generator.tsx
"use client";

import { useObject } from "ai/react";
import { generateNotifications } from "@/app/api/chat/actions";
import { notificationSchema } from "@/app/api/chat/actions";

export function NotificationGenerator() {
  const { object, submit, isLoading, error } = useObject({
    api: generateNotifications,
    schema: notificationSchema,
  });

  return (
    <div className="space-y-4">
      <button
        onClick={() => submit("Generate urgent notifications")}
        disabled={isLoading}
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Spinner />
            Generating...
          </div>
        ) : (
          "Generate Notifications"
        )}
      </button>

      {error && (
        <div className="text-red-500 p-2 rounded bg-red-50">
          Error: {error.message}
        </div>
      )}

      <div className="space-y-2">
        {object?.notifications?.map((notification, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded">
            <h3 className="font-medium">{notification.name}</h3>
            <p>{notification.message}</p>
            <span className="text-sm text-gray-500">
              {notification.minutesAgo} minutes ago
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Spinner component
function Spinner() {
  return (
    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
  );
}
```

Key implementation details[1][6][12][31]:

1. **Custom OpenAI Provider**:
   - Uses `createOpenAI` with custom base URL

- Configured through environment variables
- Shared across server/client via lib module

2. **Structured Streaming**:

   - Zod schema ensures type-safe output
   - `streamObject` handles partial updates[6]
   - Real-time updates with `partialObjectStream`

3. **Loading State**:

   - Built-in `isLoading` from `useObject`[12]
   - Disabled button state during generation
   - Visual spinner feedback

4. **Error Handling**:

   - try/catch in server action
   - Error boundary in UI
   - Stream error propagation

5. **Performance**:
   - Server-side streaming reduces client load
   - Edge-ready architecture

- Automatic request cancellation on unmount

For production deployment, ensure your `next.config.js` includes:

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

module.exports = nextConfig;
```

This implementation follows Vercel's recommended patterns for[10][31]:

- Type-safe schema validation
- Real-time UI updates
- Optimized loading states
- Error resilience
- Custom provider configuration

To handle long-running generations (>30s), add to your server component:

```typescript
export const maxDuration = 60; // Up to 60 seconds
```
