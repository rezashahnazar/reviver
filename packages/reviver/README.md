# Reviver

A powerful AI-powered content enhancement toolkit for Next.js applications. Reviver provides a set of React components and server actions to seamlessly integrate AI-powered content analysis, enhancement, and interaction capabilities into your application.

## Features

- 🎯 **Smart Content Analysis** - Summarize, explain, and extract key points from any content
- 🔄 **Real-time Enhancement** - Get instant suggestions and improvements for your content
- 🎨 **Beautiful UI Components** - Pre-built components with smooth animations and modern design
- ⚡ **Server-first Architecture** - Built on Next.js 15 server actions for optimal performance
- 🔒 **Type-safe** - Full TypeScript support with Zod schema validation
- 📊 **User Behavior Analysis** - Track and analyze user interaction with content
- 🎭 **Flexible Configuration** - Customize every aspect of the components and AI behavior

## Requirements

- Next.js 15.1.6 or higher
- React 19.0.0 or higher
- Node.js 18.17.0 or higher
- TailwindCSS 3.4.1 or higher

## Installation

```bash
# Using pnpm (recommended)
pnpm add @rezashahnazar/reviver

# Using npm
npm install @rezashahnazar/reviver

# Using yarn
yarn add @rezashahnazar/reviver
```

## Quick Start

1. Set up your OpenAI API key in your environment variables:

```env
# Required - Your OpenAI API key or compatible provider key
OPENAI_API_KEY=your_api_key_here

# Optional - Override the default OpenAI API URL for compatible providers
OPENAI_BASE_URL=https://api.openai.com/v1
```

Note: The package uses the gpt-4o-mini model by default. This is hardcoded in the server actions and cannot be changed through configuration.

2. Add Reviver to your TailwindCSS config:

```js
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // ... your other content paths
    "./node_modules/@rezashahnazar/reviver/dist/**/*.{js,ts,jsx,tsx}",
  ],
  // ... rest of your config
};

export default config;
```

3. Wrap your application with the ReviverProvider:

```tsx
import { ReviverProvider, GlobalOverlay } from "@rezashahnazar/reviver";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReviverProvider>
      {children}
      <GlobalOverlay /> {/* Optional: Shows loading states */}
    </ReviverProvider>
  );
}
```

4. Start using Reviver components:

```tsx
import { Vivify, ReviverTextArea } from "@rezashahnazar/reviver";

export default function MyPage() {
  return (
    <div>
      {/* Make any content AI-powered */}
      <Vivify>
        <p>
          This content can now be summarized, explained, or analyzed with AI.
          Right-click or use the magic wand button to see options.
        </p>
      </Vivify>

      {/* AI-powered text area with real-time suggestions */}
      <ReviverTextArea
        label="Content"
        name="content"
        placeholder="Start typing to get AI suggestions..."
      />
    </div>
  );
}
```

## Components

### ReviverProvider

The root component that provides configuration and context to all Reviver components.

```tsx
import { ReviverProvider } from "@rezashahnazar/reviver";

// Default configuration
const config = {
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

<ReviverProvider config={config}>{children}</ReviverProvider>;
```

### Vivify

Makes any content AI-powered with context menu actions and a magic wand button.

```tsx
import { Vivify } from "@rezashahnazar/reviver";

// Basic usage
<Vivify>
  <p>Your content here</p>
</Vivify>

// With additional context for AI actions
<Vivify
  additionalContext={{
    style: "concise",
    format: "bullets",
    depth: "technical",
    audience: "expert",
    maxPoints: 3,
  }}
>
  <p>Your content here</p>
</Vivify>
```

### ReviverTextArea

An AI-powered textarea with real-time suggestions and enhancements. Includes rewrite and suggestion actions.

```tsx
import { ReviverTextArea } from "@rezashahnazar/reviver";

<ReviverTextArea
  label="Description"
  name="description"
  placeholder="Start typing..."
  className="custom-class"
  onChange={(e) => console.log(e.target.value)}
/>;
```

### OnClickInterceptor

Intercepts click events to provide AI-powered options before proceeding. Useful for enhancing buttons, links, or any clickable elements.

```tsx
import { OnClickInterceptor } from "@rezashahnazar/reviver";

<OnClickInterceptor
  onOriginalClick={() => console.log("Original action")}
  onInterceptOptions={[
    {
      label: "Summarize",
      actionType: "summarize",
      data: { content: "Content to analyze" },
    },
    {
      label: "Explain",
      actionType: "explain",
      data: { content: "Content to explain" },
    },
  ]}
>
  <button>Click me</button>
</OnClickInterceptor>;
```

### ReviverObserver

Tracks user interaction with content and provides AI-powered suggestions based on behavior.

```tsx
import { ReviverObserver } from "@rezashahnazar/reviver";

<ReviverObserver
  onDataCollected={(data) => {
    console.log("Time spent:", data.timeSpent);
    console.log("Is idle:", data.idle);
    console.log("Scroll depth:", data.scrollDepth);
    console.log("AI Suggestions:", data.suggestions);
  }}
/>;
```

### GlobalOverlay

Shows a beautiful loading overlay during AI operations with animated gradients.

```tsx
import { GlobalOverlay } from "@rezashahnazar/reviver";

<GlobalOverlay className="custom-overlay-class" />;
```

## Server Actions

Reviver provides several server actions for direct AI integration using the gpt-4o-mini model:

```tsx
import {
  summarizeContent,
  explainContent,
  extractKeyPoints,
  getSuggestions,
  rewriteContent,
} from "@rezashahnazar/reviver";

// Summarize content
const { success, summary } = await summarizeContent(content, {
  style: "concise",
  format: "paragraph",
});

// Get detailed explanation (streaming)
const { success, stream } = await explainContent(content, {
  depth: "technical",
  audience: "expert",
});

// Extract key points with importance ratings
const { success, points } = await extractKeyPoints(content, 5);

// Get improvement suggestions
const { success, suggestions } = await getSuggestions(content, {
  maxSuggestions: 3,
  focus: "clarity",
  context: "technical documentation",
});

// Rewrite content (streaming)
const { success, stream } = await rewriteContent(content, {
  style: "professional",
  tone: "friendly",
  target: "blog",
});
```

## TypeScript Support

Reviver is built with TypeScript and provides comprehensive type definitions. All components and functions are fully typed, and the package includes Zod schemas for runtime validation.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Reza Shahnazar](https://github.com/rezashahnazar)

## Support

- Email: reza.shahnazar@gmail.com
- Work Email (Digikala): r.shahnazar@digikala.com
- GitHub: [@rezashahnazar](https://github.com/rezashahnazar)
