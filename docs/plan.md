# Reviver

AI Product Integration Reimagined

## **Background**

I think that the generative AI implementation and integration in products has been misdirected by bringing everything into chatbot interfaces and is so biased towards chatbots\! When we think about developing an AI product, ChatBot is the first, and mostly the only interface we imagine. Even the term “Generative UI” has been biased and limited to rendering various original business components and original UI within a chatbot UI , between some messages listed with a suboptimal or better to say awful user experience\! I think chatbot is a totally bad UI and UX choice for most of the current implementations and integration of generative AI capabilities with specific business domain use-cases. We should change our mindset and reimagine generative AI integrations with our products with an out-of-the box approach and redefine its use-cases and capabilities and integration strategies.

## **Introduction**

I think the correct, efficient and optimized way of integrating generative AI capabilities into products needs a fundamental guarantee of avoiding to displace business domain components from how they were originally designed to look, feel and be used by users. We must be conscious not to allow the “AI integration” to lead our UI and UX designs, and make sure it is the UI and UX design that makes use of “AI” as a tool, not the opposite\!  
I will describe some examples for what I imagine as correct use-cases of the generative AI integrations, in an e-commerce website scenario below. I want to emphasize this approach and promote this mindset by developing an open source npm typescript package that provides developers easy-to-use solutions to enhance different parts of their previously developed projects with generative AI augmented integrations with the least possible coding and migration overheads and no need for making any change on the codes and components previously developed. Technically, we consider everything to be based on Next.js 15 (App router, React 19\) with Typescript , Tailwind Css for styling, ShadCN and Radix-UI standard components and the Vercel AI SDK v. 4.1 (latest) as the AI library. Also aesthetically, we consider animated color-gradients with sharp and alive color hues that feels magical as the signature identifier of our Generative AI features and additions in the UI.

## Implementation Plan

A common approach is to set up a **monorepo** with two main folders:

```
/reviver-monorepo
  ├─ packages/
  │   └─ reviver/
  │       ├─ package.json
  │       ├─ src/
  │       │   ├─ index.ts
  │       │   ├─ client/
  │       │   │   ├─ Vivify.tsx
  │       │   │   ├─ OnClickInterceptor.tsx
  │       │   │   ├─ ReviverTextArea.tsx
  │       │   │   ├─ ReviverObserver.tsx
  │       │   │   ├─ GlobalOverlay.tsx
  │       │   │   └─ ...
  │       │   └─ server/
  │       │       ├─ openAI.ts
  │       │       ├─ reviverHelpers.ts
  │       │       └─ ...
  │       └─ tsconfig.json
  └─ apps/
      └─ reviver-demo/
          ├─ app/
          │   ├─ layout.tsx
          │   ├─ page.tsx
          │   ├─ api/
          │   │   └─ ...
          │   └─ ...
          ├─ package.json
          ├─ .env
          └─ ...
```

- **`packages/reviver/`**: The **library** that gets published to npm (`"name": "@yournamespace/reviver"`, for example).
- **`apps/reviver-demo/`**: A **Next.js 15** application that **installs** `@yournamespace/reviver` from the local monorepo (or from npm) to test, showcase, and demonstrate all of the library’s capabilities.

You can use tools like **pnpm workspaces**, **Yarn workspaces**, or **Nx** to manage the monorepo.

---

# 2. The “Reviver” Library (Installable Package)

Below is a **detailed breakdown** of the **`packages/reviver`** folder.

## 2.1. `package.json` Example

```jsonc
{
  "name": "@yournamespace/reviver",
  "version": "1.0.0",
  "description": "A React/Next.js 15 library for easily adding generative AI features without replacing your existing UI.",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc -w",
    "prepublishOnly": "tsc"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "ai": "^4.1.0", // Vercel AI SDK
    "@ai-sdk/openai": "^4.1.0",
    "@openrouter/ai-sdk-provider": "^1.0.0",
    "@shadcn/ui": "^0.1.0",
    "@radix-ui/react-icons": "^1.3.0"
    // plus any others needed
  },
  "peerDependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

> **Key Points**
>
> - `peerDependencies` for **Next.js**, **React**, etc. because the library must use the same versions as the host project.
> - The `build` script runs TypeScript to produce a `dist/` folder.

## 2.2. `tsconfig.json` Example

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["DOM", "ES2020"],
    "jsx": "react",
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "declaration": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules"]
}
```

## 2.3. `src/index.ts`

An **entry point** re-exporting your public API:

```ts
// packages/reviver/src/index.ts
export * from "./client/Vivify";
export * from "./client/OnClickInterceptor";
export * from "./client/ReviverTextArea";
export * from "./client/ReviverObserver";
export * from "./client/GlobalOverlay";
export * from "./client/ReviverProvider";

// Server-side helper functions
export * from "./server/openAI";
export * from "./server/reviverHelpers";
```

## 2.4. Client Components

Below is a **subset** of the main components. They closely resemble the earlier examples but are **generic** so they can be used in **any** Next.js 15 app.

### 2.4.1. `ReviverProvider.tsx`

```tsx
// packages/reviver/src/client/ReviverProvider.tsx
"use client";
import React, { createContext, useContext, useState } from "react";

/**
 * This context tracks loading states (active AI requests) or
 * any global UI states needed by reviver components.
 */
interface ReviverContextValue {
  loadingActions: string[];
  setLoadingActions: React.Dispatch<React.SetStateAction<string[]>>;
}

const ReviverContext = createContext<ReviverContextValue | null>(null);

export function useReviverContext() {
  const ctx = useContext(ReviverContext);
  if (!ctx) {
    throw new Error(
      "useReviverContext must be used within a <ReviverProvider>"
    );
  }
  return ctx;
}

export function ReviverProvider({ children }: { children: React.ReactNode }) {
  const [loadingActions, setLoadingActions] = useState<string[]>([]);

  return (
    <ReviverContext.Provider value={{ loadingActions, setLoadingActions }}>
      {children}
    </ReviverContext.Provider>
  );
}
```

> **Note**: We do **not** store any **API keys** here. Everything sensitive is done in server code.

### 2.4.2. `GlobalOverlay.tsx`

```tsx
// packages/reviver/src/client/GlobalOverlay.tsx
"use client";
import React from "react";
import { createPortal } from "react-dom";
import { useReviverContext } from "./ReviverProvider";

export function GlobalOverlay() {
  const { loadingActions } = useReviverContext();
  const isActive = loadingActions.length > 0;

  if (!isActive) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Example magical gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-30 animate-pulse" />
    </div>,
    document.body
  );
}
```

### 2.4.3. `Vivify.tsx`

```tsx
// packages/reviver/src/client/Vivify.tsx
"use client";
import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { VivifyContextMenu } from "./VivifyContextMenu";

interface VivifyProps {
  children: React.ReactNode;
  additionalContext?: Record<string, any>;
}

export function Vivify({ children, additionalContext }: VivifyProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const openMenu = () => setOpen(true);
  const closeMenu = () => setOpen(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openMenu();
  };

  return (
    <div
      ref={containerRef}
      className="relative group"
      onContextMenu={handleContextMenu}
    >
      {/* Magical ring on hover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0
                   group-hover:opacity-100
                   rounded-md border-2 border-dashed border-blue-300 transition-all"
      />

      {children}

      {/* AI icon at top-right corner (on hover) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          openMenu();
        }}
        className="absolute top-2 right-2 opacity-0
                   group-hover:opacity-100 bg-white
                   p-1 rounded-full shadow text-gray-600"
      >
        {/* Some icon */}
        <span>AI</span>
      </button>

      {/* Portal for context menu */}
      {open &&
        createPortal(
          <VivifyContextMenu
            parentRef={containerRef}
            onClose={closeMenu}
            additionalContext={additionalContext}
          />,
          document.body
        )}
    </div>
  );
}
```

#### `VivifyContextMenu.tsx`

```tsx
// packages/reviver/src/client/VivifyContextMenu.tsx
"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import { gatherTextContent } from "../utils/dom";
import { callSummarize } from "../server/reviverHelpers";
import { useReviverContext } from "./ReviverProvider";

interface ContextMenuProps {
  parentRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
  additionalContext?: Record<string, any>;
}

export function VivifyContextMenu({
  parentRef,
  onClose,
  additionalContext,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const { setLoadingActions } = useReviverContext();

  useLayoutEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [onClose]);

  async function handleSummarize() {
    if (!parentRef.current) return;
    const text = gatherTextContent(parentRef.current);
    setLoading(true);
    setLoadingActions((prev) => [...prev, "vivify-summarize"]);
    try {
      const summary = await callSummarize(text);
      setResult(summary);
    } finally {
      setLoading(false);
      setLoadingActions((prev) => prev.filter((i) => i !== "vivify-summarize"));
    }
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] bg-white border border-gray-200 p-4 rounded shadow-md w-[280px]"
      style={{ top: 120, left: 120 }} // In real usage, position near parentRef
    >
      <h3 className="font-semibold mb-2">AI Actions</h3>
      <button
        onClick={handleSummarize}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-1 rounded"
      >
        Summarize
      </button>
      {loading && <p className="text-sm text-gray-500 mt-2">Loading...</p>}
      {result && <p className="text-sm mt-2">{result}</p>}

      <button
        onClick={onClose}
        className="mt-4 text-sm text-gray-600 hover:text-gray-900"
      >
        Close
      </button>
    </div>
  );
}
```

> **Note**: We call a **client-side** function `callSummarize(...)` from `reviverHelpers.ts` which in turn calls the user’s server action. We’ll see how that is wired below in **server code** (the user’s project must define it).

### 2.4.4. `OnClickInterceptor.tsx`

```tsx
// packages/reviver/src/client/OnClickInterceptor.tsx
"use client";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useReviverContext } from "./ReviverProvider";
import { callGetProductSummary } from "../server/reviverHelpers";

interface InterceptOption {
  label: string;
  actionType: string;
  data?: Record<string, any>;
}

interface OnClickInterceptorProps {
  children: React.ReactNode;
  onOriginalClick: () => void;
  onInterceptOptions: InterceptOption[];
}

export function OnClickInterceptor({
  children,
  onOriginalClick,
  onInterceptOptions,
}: OnClickInterceptorProps) {
  const [open, setOpen] = useState(false);
  const [resp, setResp] = useState("");
  const [loading, setLoading] = useState(false);
  const { setLoadingActions } = useReviverContext();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    setOpen(true);
  }

  async function handleOptionClick(opt: InterceptOption) {
    setLoading(true);
    setResp("");
    setLoadingActions((prev) => [...prev, "onclick-intercept"]);
    try {
      if (opt.actionType === "summary") {
        // Example: product summary
        if (!opt.data?.productId) return;
        const productSummary = await callGetProductSummary(opt.data.productId);
        setResp(productSummary);
      }
      // More action types could go here...
    } finally {
      setLoading(false);
      setLoadingActions((prev) =>
        prev.filter((i) => i !== "onclick-intercept")
      );
    }
  }

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setOpen(false)}
      />
      <div className="relative bg-white w-[320px] p-4 rounded shadow-lg">
        <h2 className="text-lg font-semibold">AI Options</h2>
        <div className="mt-2 space-y-2">
          {onInterceptOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleOptionClick(opt)}
              className="w-full bg-blue-600 text-white py-1 rounded"
            >
              {opt.label}
            </button>
          ))}
        </div>
        {loading && <p className="text-sm mt-2 text-gray-600">Loading...</p>}
        {resp && <p className="text-sm mt-2">{resp}</p>}
        <button
          className="mt-4 bg-green-500 text-white px-4 py-1 rounded"
          onClick={() => {
            setOpen(false);
            onOriginalClick();
          }}
        >
          Proceed
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div onClick={handleClick}>{children}</div>
      {open && createPortal(modal, document.body)}
    </>
  );
}
```

### 2.4.5. `ReviverTextArea.tsx`

```tsx
// packages/reviver/src/client/ReviverTextArea.tsx
"use client";
import React, { useState } from "react";
import { useReviverContext } from "./ReviverProvider";
import { callRewriteText, callSuggestionChips } from "../server/reviverHelpers";

interface ReviverTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  name: string;
}

export function ReviverTextArea({
  label,
  name,
  ...rest
}: ReviverTextAreaProps) {
  const [value, setValue] = useState("");
  const [chips, setChips] = useState<Array<{ title: string; content: string }>>(
    []
  );
  const [loading, setLoading] = useState(false);
  const { setLoadingActions } = useReviverContext();

  async function handleRewrite() {
    setLoading(true);
    setLoadingActions((prev) => [...prev, "textarea-rewrite"]);
    try {
      const rewritten = await callRewriteText(value, "formal");
      setValue(rewritten);
    } finally {
      setLoading(false);
      setLoadingActions((prev) => prev.filter((i) => i !== "textarea-rewrite"));
    }
  }

  async function handleSuggestChips() {
    setLoading(true);
    setLoadingActions((prev) => [...prev, "textarea-chips"]);
    try {
      const suggestions = await callSuggestionChips(value);
      setChips(suggestions);
    } finally {
      setLoading(false);
      setLoadingActions((prev) => prev.filter((i) => i !== "textarea-chips"));
    }
  }

  const handleChipClick = (content: string) => {
    setValue((prev) => prev + " " + content);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block font-semibold">{label}</label>}
      <textarea
        {...rest}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleRewrite}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Rewrite
        </button>
        <button
          type="button"
          onClick={handleSuggestChips}
          disabled={loading}
          className="bg-purple-600 text-white px-3 py-1 rounded"
        >
          Suggest Chips
        </button>
      </div>
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {chips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleChipClick(chip.content)}
              className="bg-gray-200 px-2 py-1 text-sm rounded"
            >
              {chip.title}
            </button>
          ))}
        </div>
      )}
      {loading && <p className="text-sm text-gray-500 mt-1">Loading...</p>}
    </div>
  );
}
```

### 2.4.6. `ReviverObserver.tsx`

```tsx
// packages/reviver/src/client/ReviverObserver.tsx
"use client";
import React, { useEffect, useState } from "react";
import { callObserverData } from "../server/reviverHelpers";
import { useReviverContext } from "./ReviverProvider";

export function ReviverObserver() {
  const [timeSpent, setTimeSpent] = useState(0);
  const [idle, setIdle] = useState(false);
  const { setLoadingActions } = useReviverContext();

  useEffect(() => {
    let intervalId: any = null;
    let idleTimer: any = null;

    function resetIdle() {
      setIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIdle(true), 5000);
    }

    resetIdle();
    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("keydown", resetIdle);

    intervalId = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      clearInterval(intervalId);
      clearTimeout(idleTimer);
    };
  }, []);

  useEffect(() => {
    if (timeSpent > 0 && timeSpent % 15 === 0) {
      setLoadingActions((prev) => [...prev, "observer"]);
      callObserverData({ timeSpent, idle }).finally(() => {
        setLoadingActions((prev) => prev.filter((i) => i !== "observer"));
      });
    }
  }, [timeSpent, idle, setLoadingActions]);

  return null;
}
```

## 2.5. **Server-Side** Helpers (Non-Action, Generic Functions)

Since **Next.js 15** only allows **server actions** within the user’s project, we provide **helper functions** that do the actual AI call. Then the user’s project can define its own server actions that call these helpers, or we can provide a default **HTTP approach** (like `fetch` to a route handler).

### 2.5.1. `openAI.ts`

```ts
// packages/reviver/src/server/openAI.ts
import { createOpenAI } from "@ai-sdk/openai";

/**
 * A convenience to create an OpenAI provider purely on the server side.
 * We do NOT expose any keys here to the client. The user must pass them
 * from their environment to these helpers.
 */
export function createServerOpenAI(apiKey: string) {
  return createOpenAI({
    apiKey,
    baseURL: "https://api.openai.com/v1",
    compatibility: "strict",
  });
}
```

### 2.5.2. `reviverHelpers.ts` (Client ↔ Server bridging)

We can provide **client** “bridge” functions that call route handlers. Or the user can do their own. For example:

```ts
// packages/reviver/src/server/reviverHelpers.ts

/**
 * These are client-callable wrappers that hit the user's Next.js route
 * endpoints or server actions. The user must configure these endpoints
 * in their own project.
 */

/** Summarize text: calls /api/reviver/summarize */
export async function callSummarize(content: string): Promise<string> {
  const res = await fetch("/api/reviver/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to summarize");
  return await res.text();
}

/** Product summary: calls /api/reviver/product-summary */
export async function callGetProductSummary(
  productId: number
): Promise<string> {
  const res = await fetch("/api/reviver/product-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  if (!res.ok) throw new Error("Failed to get product summary");
  return await res.text();
}

/** Rewrite text: calls /api/reviver/rewrite */
export async function callRewriteText(
  content: string,
  style: string
): Promise<string> {
  const res = await fetch("/api/reviver/rewrite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, style }),
  });
  if (!res.ok) throw new Error("Rewrite failed");
  return await res.text();
}

/** Suggestion Chips: calls /api/reviver/suggestions */
export async function callSuggestionChips(
  content: string
): Promise<{ title: string; content: string }[]> {
  const res = await fetch("/api/reviver/suggestions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Suggestions failed");
  return await res.json();
}

/** Observer Data: calls /api/reviver/observer */
export async function callObserverData(data: {
  timeSpent: number;
  idle: boolean;
}) {
  await fetch("/api/reviver/observer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
```

> **Why**: This approach **centralizes** the default HTTP endpoints that the library expects. The user can adapt them as needed.

---

# 3. Next.js 15 Demo App

In **`apps/reviver-demo/`** we have a Next.js 15 project that **installs** `@yournamespace/reviver`. We place server actions or route handlers to handle these calls.

## 3.1. `package.json` (Demo App)

```jsonc
{
  "name": "reviver-demo",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "15.x",
    "react": "19.x",
    "react-dom": "19.x",
    "@yournamespace/reviver": "*"
    // plus others like tailwind, etc.
  }
}
```

## 3.2. `.env` in Demo

```
OPENAI_API_KEY="sk-SECRET-here"
```

> **No** `NEXT_PUBLIC_` prefix. We keep it purely server-side.

## 3.3. `app/layout.tsx`

```tsx
import "../globals.css";
import type { Metadata } from "next";
import { ReviverProvider, GlobalOverlay } from "@yournamespace/reviver";

export const metadata: Metadata = {
  title: "Reviver Demo",
  description: "Showcasing the Reviver library features",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap entire app with ReviverProvider */}
        <ReviverProvider>
          {children}
          <GlobalOverlay />
        </ReviverProvider>
      </body>
    </html>
  );
}
```

## 3.4. Route Handlers in `app/api/reviver/`

We define endpoints that use **server** code with the user’s real `process.env.OPENAI_API_KEY`.

### 3.4.1. `app/api/reviver/summarize/route.ts`

```ts
import { createServerOpenAI } from "@yournamespace/reviver/server/openAI";
import { generateText } from "ai";

export async function POST(req: Request) {
  const body = await req.json();
  const { content } = body as { content: string };

  const openAI = createServerOpenAI(process.env.OPENAI_API_KEY!);
  const { text } = await generateText({
    model: openAI("gpt-4-turbo"),
    prompt: `Summarize:\n\n${content}`,
  });

  return new Response(text);
}
```

### 3.4.2. `app/api/reviver/product-summary/route.ts`

```ts
import { createServerOpenAI } from "@yournamespace/reviver/server/openAI";
import { generateText } from "ai";

export async function POST(req: Request) {
  const body = await req.json();
  const { productId } = body;

  // Assume we fetch product details from DB
  const productDescription = `Product #${productId}: T-Shirt for demonstration.`;

  const openAI = createServerOpenAI(process.env.OPENAI_API_KEY!);
  const { text } = await generateText({
    model: openAI("gpt-4-turbo"),
    prompt: `Summarize the following product info:\n\n${productDescription}`,
  });

  return new Response(text);
}
```

### 3.4.3. `app/api/reviver/rewrite/route.ts`

```ts
import { createServerOpenAI } from "@yournamespace/reviver/server/openAI";
import { generateText } from "ai";

export async function POST(req: Request) {
  const body = await req.json();
  const { content, style } = body as { content: string; style: string };

  const openAI = createServerOpenAI(process.env.OPENAI_API_KEY!);
  const { text } = await generateText({
    model: openAI("gpt-4-turbo"),
    prompt: `Rewrite the following text in a ${style} style:\n\n${content}`,
  });

  return new Response(text);
}
```

### 3.4.4. `app/api/reviver/suggestions/route.ts`

```ts
import { createServerOpenAI } from "@yournamespace/reviver/server/openAI";
import { generateText } from "ai";

export async function POST(req: Request) {
  const body = await req.json();
  const { content } = body;

  const openAI = createServerOpenAI(process.env.OPENAI_API_KEY!);
  const { text } = await generateText({
    model: openAI("gpt-4-turbo"),
    prompt: `Generate 3 suggestion chips in JSON array form. 
             Each item has { "title": "", "content": "" } 
             relevant to text: "${content}".`,
  });

  // naive parse
  try {
    const arr = JSON.parse(text);
    return new Response(JSON.stringify(arr), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }
}
```

### 3.4.5. `app/api/reviver/observer/route.ts`

```ts
export async function POST(req: Request) {
  const body = await req.json();
  const { timeSpent, idle } = body;

  // In real usage, log or do something with these metrics
  console.log("Observer data:", { timeSpent, idle });

  return new Response("OK");
}
```

## 3.5. Using Components in `app/page.tsx` or other pages

```tsx
import {
  Vivify,
  OnClickInterceptor,
  ReviverTextArea,
  ReviverObserver,
} from "@yournamespace/reviver";

export default function HomePage() {
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Reviver Demo</h1>

      <ReviverObserver />

      <Vivify>
        <div className="bg-yellow-50 p-4 rounded">
          <p>Right-click or click AI icon for AI actions.</p>
        </div>
      </Vivify>

      <OnClickInterceptor
        onOriginalClick={() => alert("Go to product page")}
        onInterceptOptions={[
          {
            label: "Summarize product #123",
            actionType: "summary",
            data: { productId: 123 },
          },
        ]}
      >
        <button className="bg-blue-600 text-white px-3 py-1 rounded">
          Product Card
        </button>
      </OnClickInterceptor>

      <ReviverTextArea
        label="Write something..."
        name="testArea"
        placeholder="Type here..."
      />
    </main>
  );
}
```

---

# 4. Publishing & Usage

1. **Build** the library:

   ```bash
   cd packages/reviver
   pnpm build
   ```

   This compiles into `dist/`.

2. **Publish** (if desired) to npm:

   ```bash
   npm publish
   // or pnpm publish
   ```

   Make sure your `package.json` has the correct name, version, etc.

3. **Install** in your Next.js 15 project:
   ```bash
   npm install @yournamespace/reviver
   // or yarn add @yournamespace/reviver
   ```
   Then import and use the components as shown in the **demo**.

---

# 5. Key Considerations

1. **Server Actions vs. Route Handlers**

   - Because Next.js 15 **doesn’t** allow `server actions` to live in node_modules, we define **generic** server code in the library (like `createServerOpenAI`) and simple **client** bridging functions that call your project’s **HTTP endpoints** (e.g. `/api/reviver/summarize`).
   - You can also define a Next.js **server action** in your project that imports `createServerOpenAI(...)` from the library. For example:

     ```ts
     // app/summarize-action.ts
     "use server";
     import { createServerOpenAI } from "@yournamespace/reviver/server/openAI";
     import { generateText } from "ai";

     export async function summarizeAction(content: string) {
       const openAI = createServerOpenAI(process.env.OPENAI_API_KEY!);
       const { text } = await generateText({
         model: openAI("gpt-4-turbo"),
         prompt: `Summarize:\n\n${content}`,
       });
       return text;
     }
     ```

     Then in a client component you can do:

     ```tsx
     import { summarizeAction } from '../summarize-action';

     ...
     const summary = await summarizeAction(myContent);
     ...
     ```

     However, the library can only provide **helper** code—**actual** server actions must be written in the user’s project.

2. **No `NEXT_PUBLIC_` Keys**

   - All references to `OPENAI_API_KEY` remain exclusively in server code. The client’s library calls route endpoints for actual AI processing.
   - This ensures **API keys** are never exposed to the browser.

3. **Extensibility**

   - The library is structured so you can add new components, new server helpers, or advanced AI “tool” calls.
   - You can override or customize the fetch endpoints if your project’s routes differ.

4. **Customization**

   - The magical gradient overlay and ring are just **Tailwind** classes. Adjust or override them for your brand.
   - Each context menu or modal can be replaced with a ShadCN or Radix UI modal.

5. **Production Hardening**
   - Add **logging**, **monitoring**, **rate-limiting** (e.g., a Redis check in the route handlers) to avoid excessive usage or cost.
   - Validate user input to guard against prompt injection or malicious usage.

---

# 6. Conclusion

With this **two-part** setup—an **installable “Reviver” library** + a **Next.js 15 demo**—you achieve:

- **Clean separation**: The library is a generic toolkit with minimal assumptions.
- **Proper server security**: Keys remain on the server, and prompt logic resides in route handlers or server actions within the Next.js app.
- **Comprehensive feature set**:
  1. **Vivify** for non-interactive blocks,
  2. **OnClickInterceptor** for clickable elements,
  3. **ReviverTextArea** for AI text augmentation,
  4. **ReviverObserver** for idle/scroll watchers,
  5. **GlobalOverlay** for a unique loading experience, and
  6. **ReviverProvider** to manage global states.

This structure ensures the **best developer experience**, correct usage of **server actions** and **route handlers** for AI calls, and a **clean, maintainable** codebase that can be **published** on npm or any private registry—while also demonstrating all capabilities in a local Next.js 15 environment.

Enjoy extending and customizing Reviver to inject **generative AI** seamlessly into any Next.js product **without** sacrificing your existing UI/UX design!
