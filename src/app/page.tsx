"use client";

import { useState } from "react";
import {
  Vivify,
  ReviverTextArea,
  ReviverObserver,
  ReviverDrawer,
  getSuggestions,
  rewriteContent,
} from "ai-reviver";
import { toast } from "sonner";
import { readStreamableValue } from "ai/rsc";
import { Nav } from "@/components/nav";
import {
  ArrowRight,
  Code2,
  MousePointerClick,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"write" | "analyze">("write");
  const [editorContent, setEditorContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorContent(e.target.value);
  };

  const handleGetSuggestions = async (
    content: string,
    options?: Record<string, unknown>
  ) => {
    try {
      setIsProcessing(true);
      return await getSuggestions(content, options);
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get suggestions";
      console.error("Error getting suggestions:", error);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRewrite = async (
    content: string,
    options?: Record<string, unknown>
  ) => {
    try {
      setIsProcessing(true);
      return await rewriteContent(content, options);
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to rewrite content";
      console.error("Error rewriting content:", error);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <ReviverObserver
        onDataCollected={(data) => {
          console.log("User interaction data:", data);
        }}
      />
      <Nav />
      <main className="min-h-screen">
        {/* Hero Section - Enhanced with better mobile responsiveness */}
        <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:16px_16px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-purple-500/30 animate-gradient" />
          <div className="container relative mx-auto px-4 py-16 sm:py-24 lg:py-32">
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <div className="mb-8 inline-flex items-center rounded-full bg-purple-400/10 px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium text-purple-100 ring-1 ring-inset ring-purple-400/20 backdrop-blur-sm">
                <Sparkles className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">
                  Seamless AI Integration for Next.js Applications
                </span>
              </div>
              <h1 className="bg-gradient-to-r from-purple-100 via-white to-purple-100 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl">
                Reimagine AI Integration{" "}
                <span className="relative whitespace-nowrap">
                  <span className="relative">Beyond Chatbots</span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 418 42"
                    className="absolute left-0 top-full mt-1 hidden h-[0.58em] w-full fill-purple-400/40 sm:block"
                    preserveAspectRatio="none"
                  >
                    <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                  </svg>
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-purple-50/90 sm:text-xl">
                Enhance your Next.js applications with AI capabilities that
                respect your UI/UX. No chatbots, no disruption—just seamless AI
                power right where you need it.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#demo"
                  className="group relative rounded-lg bg-white/10 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-white/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
                >
                  <span className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 transition-all group-hover:opacity-20" />
                  Try Interactive Demo
                </a>
                <a
                  href="https://github.com/rezashahnazar/reviver"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-x-2 text-sm font-semibold text-white"
                >
                  <span>View on GitHub</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 -bottom-1 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Philosophy Section - Enhanced with interactive elements */}
        <div className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Vivify>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                AI Integration,{" "}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Reimagined
                </span>
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                We believe AI should enhance your existing UI, not replace it.
                Our package provides developers with easy-to-use solutions that
                respect your design choices while adding powerful AI
                capabilities.
              </p>
            </Vivify>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="group relative rounded-2xl border bg-background p-6 shadow-md transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Zero Disruption</h3>
              <p className="text-muted-foreground">
                Integrate AI capabilities without changing your existing
                components or disrupting your UI/UX flow.
              </p>
            </div>
            <div className="group relative rounded-2xl border bg-background p-6 shadow-md transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                <Wand2 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Context-Aware AI</h3>
              <p className="text-muted-foreground">
                AI features that understand your application's context and
                enhance the user experience naturally.
              </p>
            </div>
            <div className="group relative rounded-2xl border bg-background p-6 shadow-md transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Modern Stack</h3>
              <p className="text-muted-foreground">
                Built for Next.js 15, React 19, TypeScript, and Tailwind CSS
                with Vercel AI SDK integration.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Section - Enhanced with interactive guides */}
        <div id="demo" className="relative border-t bg-muted/30">
          {/* Interactive Guide Overlay */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

          <div className="container mx-auto px-4 py-24">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-8 inline-flex items-center rounded-full bg-purple-600/10 px-6 py-2 text-sm font-medium text-purple-600 ring-1 ring-inset ring-purple-600/20 dark:text-purple-400 dark:ring-purple-400/20">
                <MousePointerClick className="mr-2 h-4 w-4" />
                Interactive Demo
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Experience the{" "}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Difference
                </span>
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Try our interactive demo to see how AI-Reviver enhances your
                content naturally, without disrupting the user experience.
              </p>
            </div>

            {/* Interactive Feature Guide */}
            <div className="mx-auto mt-12 max-w-2xl rounded-xl border bg-card/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-semibold">
                Available AI Features:
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-purple-100/50 p-4 dark:bg-purple-900/20">
                  <div className="mb-2 flex items-center gap-2 font-medium">
                    <MousePointerClick className="h-4 w-4" />
                    Right-Click Actions
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Right-click any text to access AI analysis, summarization,
                    and enhancement options
                  </p>
                </div>
                <div className="rounded-lg bg-blue-100/50 p-4 dark:bg-blue-900/20">
                  <div className="mb-2 flex items-center gap-2 font-medium">
                    <Wand2 className="h-4 w-4" />
                    Smart Suggestions
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get real-time AI suggestions as you type in the editor
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16">
              {/* Enhanced Tabs */}
              <div className="mb-8 flex justify-center space-x-4">
                <button
                  onClick={() => setActiveTab("write")}
                  className={`group relative rounded-lg px-6 py-3 font-medium transition-all ${
                    activeTab === "write"
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                      : "bg-background hover:bg-accent"
                  }`}
                >
                  <span className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 blur transition-all group-hover:opacity-20" />
                  <span className="relative flex items-center gap-2">
                    <Wand2 className="h-4 w-4" />
                    Smart Editor
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("analyze")}
                  className={`group relative rounded-lg px-6 py-3 font-medium transition-all ${
                    activeTab === "analyze"
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                      : "bg-background hover:bg-accent"
                  }`}
                >
                  <span className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 blur transition-all group-hover:opacity-20" />
                  <span className="relative flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Content Analyzer
                  </span>
                </button>
              </div>

              {/* Demo Content */}
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                  {activeTab === "write" ? (
                    <div className="group relative rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 transition-all group-hover:opacity-100" />
                      <div className="relative">
                        <div className="mb-4 flex items-center justify-between">
                          <h2 className="text-2xl font-semibold">
                            AI-Powered Editor
                          </h2>
                          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100/50 px-3 py-1 text-sm text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                            <Wand2 className="h-4 w-4" />
                            Real-time AI Suggestions
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div className="rounded-lg bg-muted/50 p-4">
                            <p className="text-sm text-muted-foreground">
                              Start typing in the editor below to experience
                              AI-powered suggestions. The editor will provide
                              real-time enhancements as you write, helping you
                              craft better content effortlessly.
                            </p>
                          </div>
                          <ReviverTextArea
                            label="Start writing your content"
                            name="content"
                            placeholder="Begin typing to get real-time AI suggestions... Try writing about AI integration in modern web applications!"
                            onChange={handleEditorChange}
                            className="min-h-[300px]"
                          />
                          <div className="rounded-lg bg-purple-100/50 p-4 dark:bg-purple-900/20">
                            <h4 className="mb-3 font-medium flex items-center gap-2">
                              <Sparkles className="h-4 w-4" />
                              Editor Features
                            </h4>
                            <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                              <li className="flex items-center gap-2">
                                <Wand2 className="h-3 w-3" />
                                Real-time suggestions
                              </li>
                              <li className="flex items-center gap-2">
                                <Sparkles className="h-3 w-3" />
                                Smart completions
                              </li>
                              <li className="flex items-center gap-2">
                                <Zap className="h-3 w-3" />
                                Instant improvements
                              </li>
                              <li className="flex items-center gap-2">
                                <Code2 className="h-3 w-3" />
                                Context-aware help
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                      <h2 className="mb-4 text-2xl font-semibold">
                        Content Analysis Demo
                      </h2>
                      <Vivify
                        additionalContext={{
                          style: "detailed",
                          format: "structured",
                          depth: "comprehensive",
                          audience: "professional",
                        }}
                      >
                        <div className="prose dark:prose-invert">
                          <h3>Reimagining AI Integration</h3>
                          <p>
                            The current trend of implementing AI through chatbot
                            interfaces has led to suboptimal user experiences.
                            While chatbots serve their purpose in certain
                            scenarios, they shouldn't be the default interface
                            for every AI integration.
                          </p>
                          <p>
                            Instead, we should focus on seamlessly embedding AI
                            capabilities within existing UI components,
                            preserving the natural flow of user interactions
                            while enhancing them with intelligent features.
                          </p>
                          <div className="mt-4 rounded-lg bg-muted/50 p-4">
                            <p className="text-sm text-muted-foreground">
                              Try right-clicking on any part of this text to see
                              AI-Reviver's context menu in action. You can
                              analyze, summarize, or enhance the content without
                              leaving your current context.
                            </p>
                          </div>
                        </div>
                      </Vivify>
                    </div>
                  )}

                  {/* Interactive Features Showcase */}
                  <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 text-2xl font-semibold">
                      Interactive Features
                    </h2>
                    <div className="space-y-4">
                      <Vivify>
                        <div className="rounded-lg bg-muted/50 p-4">
                          <h3 className="mb-2 font-medium">Hover Cards Demo</h3>
                          <p>
                            Hover over this text to see AI-powered insights
                            appear in a non-intrusive card. This demonstrates
                            how AI can provide context-aware information without
                            disrupting the user's flow.
                          </p>
                        </div>
                      </Vivify>

                      <div className="rounded-lg bg-purple-100/50 p-4 dark:bg-purple-900/20">
                        <Vivify
                          additionalContext={{
                            style: "technical",
                            format: "concise",
                          }}
                        >
                          <h3 className="mb-2 font-medium">
                            Context Menu Demo
                          </h3>
                          <p>
                            Right-click this text to see the context menu with
                            AI actions. Notice how the AI features integrate
                            naturally with the browser's native context menu.
                          </p>
                        </Vivify>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="group relative rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 transition-all group-hover:opacity-100" />
                    <div className="relative">
                      <h2 className="mb-4 text-2xl font-semibold">
                        Enhancement Tools
                      </h2>
                      <div>
                        <ReviverDrawer
                          trigger={
                            <button
                              className="group relative w-full rounded-lg bg-purple-600 px-6 py-3 font-medium text-white shadow-lg shadow-purple-600/20 transition-all hover:shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isProcessing || !editorContent.trim()}
                            >
                              <span className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 transition-all group-hover:opacity-20" />
                              <span className="relative flex items-center justify-center gap-2">
                                {isProcessing ? (
                                  <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <Wand2 className="h-4 w-4" />
                                    Enhance Content
                                  </>
                                )}
                              </span>
                            </button>
                          }
                          title="AI Enhancement Options"
                          description="Choose how you want to enhance your content"
                          isProcessing={isProcessing}
                        >
                          <div className="space-y-6">
                            <div className="space-y-4">
                              <button
                                onClick={async () => {
                                  try {
                                    const result = await handleGetSuggestions(
                                      editorContent,
                                      {
                                        maxSuggestions: 3,
                                        focus: "clarity and impact",
                                        stream: true,
                                      }
                                    );

                                    const resultDiv = document.querySelector(
                                      "[data-result-container]"
                                    );

                                    if (
                                      resultDiv &&
                                      result &&
                                      "object" in result
                                    ) {
                                      resultDiv.classList.remove("hidden");

                                      for await (const partialObject of readStreamableValue(
                                        result.object
                                      )) {
                                        if (partialObject?.suggestions) {
                                          const formattedSuggestions =
                                            partialObject.suggestions
                                              .map(
                                                (s: {
                                                  impact?: string;
                                                  suggestion: string;
                                                }) => `
                                              <div class="mb-4 rounded-lg border bg-card p-4">
                                                <h5 class="mb-2 font-medium text-purple-600 dark:text-purple-400">${
                                                  s.impact || "Improvement"
                                                }</h5>
                                                <div class="text-card-foreground">${
                                                  s.suggestion
                                                }</div>
                                              </div>
                                            `
                                              )
                                              .join("");

                                          resultDiv.innerHTML = `
                                            <div>
                                              <h5 class="mb-4 font-medium text-purple-600 dark:text-purple-400">Suggested Improvements</h5>
                                              ${formattedSuggestions}
                                            </div>
                                          `;
                                        }
                                      }
                                    }
                                  } catch (error) {
                                    // Error is already handled in handleGetSuggestions
                                  }
                                }}
                                className="w-full rounded-lg bg-purple-100 px-4 py-3 font-medium text-purple-700 transition hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30"
                              >
                                Get Smart Suggestions
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    const result = await handleRewrite(
                                      editorContent,
                                      {
                                        style: "professional",
                                        tone: "engaging",
                                      }
                                    );

                                    const resultDiv = document.querySelector(
                                      "[data-result-container]"
                                    );

                                    if (
                                      resultDiv &&
                                      result &&
                                      "textStream" in result
                                    ) {
                                      let content = "";
                                      const reader = (
                                        result.textStream as ReadableStream<string>
                                      ).getReader();

                                      while (true) {
                                        const { done, value } =
                                          await reader.read();
                                        if (done) break;
                                        content += value;
                                        resultDiv.innerHTML = `
                                          <div class="mb-4 rounded-lg border bg-card p-4">
                                            <h5 class="mb-2 font-medium text-purple-600 dark:text-purple-400">Enhanced Version</h5>
                                            <div class="text-card-foreground whitespace-pre-wrap">${content}</div>
                                          </div>
                                        `;
                                        resultDiv.classList.remove("hidden");
                                      }
                                    }
                                  } catch (error) {
                                    // Error is already handled in handleRewrite
                                  }
                                }}
                                className="w-full rounded-lg bg-purple-100 px-4 py-3 font-medium text-purple-700 transition hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30"
                              >
                                Enhance & Polish
                              </button>
                            </div>

                            <div
                              data-result-container
                              className="hidden mt-6 rounded-lg border bg-card/50 p-4 prose prose-sm dark:prose-invert max-w-none"
                            />
                          </div>
                        </ReviverDrawer>
                      </div>
                    </div>
                  </div>

                  {/* Feature Highlights */}
                  <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 text-2xl font-semibold">
                      Key Features in Action
                    </h2>
                    <div className="space-y-4">
                      <div className="rounded-lg bg-muted/50 p-4">
                        <h3 className="mb-2 font-medium">
                          Natural Integration
                        </h3>
                        <Vivify>
                          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                            <li>Context-aware AI suggestions</li>
                            <li>Non-intrusive hover insights</li>
                            <li>Native-feeling context menus</li>
                            <li>Seamless content enhancements</li>
                          </ul>
                        </Vivify>
                      </div>

                      <div className="rounded-lg bg-purple-100/50 p-4 dark:bg-purple-900/20">
                        <h3 className="mb-2 font-medium">Pro Tips</h3>
                        <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                          <li>Try right-clicking any text for AI analysis</li>
                          <li>Hover over text for quick insights</li>
                          <li>Use the editor for real-time suggestions</li>
                          <li>Experiment with different enhancement styles</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Installation Section - Enhanced with better code display */}
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Quick Start
            </h2>
            <div className="mt-8 sm:mt-12 rounded-xl border bg-card p-4 sm:p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-sm dark:bg-purple-900/20">
                      1
                    </span>
                    Install the package
                  </h3>
                  <CodeBlock language="bash" code="pnpm add ai-reviver" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-sm dark:bg-purple-900/20">
                      2
                    </span>
                    Wrap your app with ReviverProvider
                  </h3>
                  <CodeBlock
                    language="typescript"
                    code={`import { ReviverProvider } from 'ai-reviver';

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <ReviverProvider>
      {children}
    </ReviverProvider>
  );
}`}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-sm dark:bg-purple-900/20">
                      3
                    </span>
                    Use AI-enhanced components
                  </h3>
                  <CodeBlock
                    language="typescript"
                    code={`import { Vivify, ReviverTextArea } from 'ai-reviver';

// Add AI capabilities to any text
<Vivify
  additionalContext={{
    style: "professional",
    tone: "engaging"
  }}
>
  <p>Your content here</p>
</Vivify>

// Use AI-enhanced textarea
<ReviverTextArea
  label="Smart Editor"
  placeholder="Start typing..."
  onChange={(e) => {
    // Handle changes
  }}
/>`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Enhanced with better mobile layout */}
        <footer className="mt-16 sm:mt-24 border-t bg-muted/50">
          <div className="container mx-auto px-4 py-8 sm:py-12">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <h3 className="mb-4 text-base sm:text-lg font-semibold">
                  About AI-Reviver
                </h3>
                <p className="text-sm text-muted-foreground">
                  An open-source package that reimagines AI integration in
                  Next.js applications, moving beyond chatbots to provide
                  seamless, context-aware AI enhancements.
                </p>
              </div>
              <div>
                <h3 className="mb-4 text-base sm:text-lg font-semibold">
                  Contact
                </h3>
                <p className="text-sm text-muted-foreground">
                  Email: reza.shahnazar@gmail.com
                  <br />
                  GitHub: @rezashahnazar
                </p>
              </div>
              <div>
                <h3 className="mb-4 text-base sm:text-lg font-semibold">
                  Features
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    Seamless AI Integration
                  </li>
                  <li className="flex items-center gap-2">
                    <Wand2 className="h-3 w-3" />
                    Context-Aware Enhancements
                  </li>
                  <li className="flex items-center gap-2">
                    <Code2 className="h-3 w-3" />
                    Zero UI Disruption
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-3 w-3" />
                    Modern Tech Stack Support
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-base sm:text-lg font-semibold">
                  Resources
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2 hover:text-purple-600 transition-colors">
                    <ArrowRight className="h-3 w-3" />
                    Documentation
                  </li>
                  <li className="flex items-center gap-2 hover:text-purple-600 transition-colors">
                    <ArrowRight className="h-3 w-3" />
                    API Reference
                  </li>
                  <li className="flex items-center gap-2 hover:text-purple-600 transition-colors">
                    <ArrowRight className="h-3 w-3" />
                    Examples
                  </li>
                  <li className="flex items-center gap-2 hover:text-purple-600 transition-colors">
                    <ArrowRight className="h-3 w-3" />
                    GitHub Repository
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 sm:mt-12 border-t pt-6 sm:pt-8 text-center text-sm text-muted-foreground">
              <p>© 2025 AI-Reviver. Built with Next.js 15 and Vercel AI SDK.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
