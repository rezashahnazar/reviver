# ai-reviver

A powerful React/Next.js 15 library for seamlessly integrating generative AI features into your existing UI components. Reviver enhances your application with AI capabilities without replacing your current UI elements.

[![npm version](https://badge.fury.io/js/ai-reviver.svg)](https://www.npmjs.com/package/ai-reviver)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎨 **Non-Intrusive Integration**: Enhance your existing UI with AI features without replacing components
- 🔄 **Real-Time AI Suggestions**: Get instant AI-powered suggestions and improvements
- 🎯 **Smart Text Completion**: Intelligent text completion as you type
- 🔍 **Content Analysis**: Extract key points, summarize, and explain content
- 🎭 **Multiple AI Actions**: Various AI actions including rewriting, explaining, and summarizing
- 🌈 **Beautiful UI**: Smooth animations and modern design with Tailwind CSS
- ⚡ **Optimized Performance**: Efficient streaming responses and request deduplication
- 🛠️ **Highly Customizable**: Extensive configuration options for each component

## Installation

```bash
# Using pnpm (recommended)
pnpm add ai-reviver

# Using npm
npm install ai-reviver

# Using yarn
yarn add ai-reviver
```

### Prerequisites

Reviver requires the following peer dependencies:

```json
{
  "next": "15.1.6",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "tailwindcss": "^3.4.1"
}
```

## Setup

1. Add your OpenAI API key to your environment variables:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1 # Optional: Default OpenAI API URL
```

2. Configure your Tailwind CSS by adding Reviver's path to your content configuration:

```js
// tailwind.config.js or tailwind.config.ts
module.exports = {
  content: [
    // ... your other content paths
    "./node_modules/ai-reviver/**/*.{js,ts,jsx,tsx}",
  ],
  // ... rest of your config
};
```

3. Wrap your application with the ReviverProvider:

```tsx
import { ReviverProvider } from "ai-reviver";

function App({ children }) {
  return <ReviverProvider>{children}</ReviverProvider>;
}
```

## Components

### Vivify

Enhances text content with AI-powered actions through a context menu.

```tsx
import { Vivify } from "ai-reviver";

function MyComponent() {
  return (
    <Vivify>
      <p>Your content here that you want to enhance with AI capabilities.</p>
    </Vivify>
  );
}
```

### ReviverTextArea

An enhanced textarea with AI-powered suggestions and completions.

```tsx
import { ReviverTextArea } from "ai-reviver";

function MyForm() {
  return (
    <ReviverTextArea
      name="content"
      label="Content"
      placeholder="Start typing..."
      onChange={(e) => console.log(e.target.value)}
    />
  );
}
```

### OnClickInterceptor

Intercepts click events to provide AI-powered options before proceeding.

```tsx
import { OnClickInterceptor } from "ai-reviver";

function MyButton() {
  return (
    <OnClickInterceptor
      onOriginalClick={() => console.log("Original action")}
      onInterceptOptions={[
        {
          label: "Improve Content",
          action: async (content) => {
            // Your AI action here
          },
        },
      ]}
    >
      <button>Click me</button>
    </OnClickInterceptor>
  );
}
```

### ReviverDrawer

A modal-like drawer component for AI interactions.

```tsx
import { ReviverDrawer } from "ai-reviver";

function MyComponent() {
  return (
    <ReviverDrawer
      trigger={<button>Open AI Assistant</button>}
      title="AI Assistant"
      description="Let AI help you improve your content"
    >
      {/* Drawer content */}
    </ReviverDrawer>
  );
}
```

### GlobalOverlay

A beautiful overlay to indicate AI processing.

```tsx
import { GlobalOverlay } from "ai-reviver";

function MyApp() {
  return (
    <>
      <GlobalOverlay />
      {/* Your app content */}
    </>
  );
}
```

### ReviverObserver

Observes user interaction and provides AI suggestions.

```tsx
import { ReviverObserver } from "ai-reviver";

function MyComponent() {
  return (
    <ReviverObserver
      onDataCollected={(data) => {
        console.log("User interaction data:", data);
      }}
    />
  );
}
```

## Configuration

You can customize Reviver's behavior by passing a configuration object to the ReviverProvider:

```tsx
import { ReviverProvider } from "ai-reviver";

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

function App({ children }) {
  return <ReviverProvider config={config}>{children}</ReviverProvider>;
}
```

## Server Actions

Reviver provides several server actions for AI operations:

```tsx
import {
  summarizeContent,
  explainContent,
  extractKeyPoints,
  getSuggestions,
  rewriteContent,
} from "ai-reviver";

// Example usage
async function handleContent() {
  const summary = await summarizeContent("Your content here");
  const explanation = await explainContent("Your content here");
  const keyPoints = await extractKeyPoints("Your content here");
  const suggestions = await getSuggestions("Your content here");
  const rewritten = await rewriteContent("Your content here");
}
```

## Types

Reviver is written in TypeScript and exports all its types:

```tsx
import type {
  VivifyProps,
  OnClickInterceptorProps,
  ReviverTextAreaProps,
  ReviverObserverProps,
  GlobalOverlayProps,
  ReviverProviderProps,
  ReviverConfig,
} from "ai-reviver";
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/) © [Reza Shahnazar](https://github.com/rezashahnazar)

## Author

- **Reza Shahnazar** - [GitHub](https://github.com/rezashahnazar) - [Email](mailto:reza.shahnazar@gmail.com)

## Support

If you have any questions or need help, please open an issue on [GitHub](https://github.com/rezashahnazar/reviver/issues).
