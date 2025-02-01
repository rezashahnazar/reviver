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

      <main className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 py-20">
            <Vivify>
              <h1 className="text-5xl font-bold mb-6">
                Transform Your Content with AI Power
              </h1>
              <p className="text-xl opacity-90">
                Experience the future of content creation with Reviver.
                Right-click or use the magic wand to analyze, enhance, and
                transform any text instantly.
              </p>
            </Vivify>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Tabs */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setActiveTab("write")}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                activeTab === "write"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Smart Editor
            </button>
            <button
              onClick={() => setActiveTab("analyze")}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                activeTab === "analyze"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Content Analyzer
            </button>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {activeTab === "write" ? (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">
                    AI-Powered Editor
                  </h2>
                  <ReviverTextArea
                    label="Start writing your content"
                    name="content"
                    placeholder="Begin typing to get real-time AI suggestions..."
                    onChange={handleEditorChange}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">
                    Content Analysis
                  </h2>
                  <Vivify
                    additionalContext={{
                      style: "detailed",
                      format: "structured",
                      depth: "comprehensive",
                      audience: "professional",
                    }}
                  >
                    <div className="prose">
                      <h3>Sample Technical Documentation</h3>
                      <p>
                        React Server Components (RSC) represent a paradigm shift
                        in how we build React applications. They enable
                        developers to write components that execute on the
                        server, reducing client-side JavaScript while
                        maintaining the component-based mental model we love
                        about React.
                      </p>
                      <p>
                        The key benefits include improved performance, better
                        SEO, and reduced client-side bundle sizes. By moving
                        complex data fetching and processing to the server, we
                        can deliver faster initial page loads and better core
                        web vitals.
                      </p>
                    </div>
                  </Vivify>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Interactive Features
                </h2>
                <div>
                  <ReviverDrawer
                    trigger={
                      <button
                        className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isProcessing || !editorContent.trim()}
                        onClick={async () => {
                          console.log("Trigger button clicked");
                          // You can add any initial action here if needed
                          return Promise.resolve();
                        }}
                      >
                        {isProcessing ? "Processing..." : "Publish Content"}
                      </button>
                    }
                    title="Publish Options"
                    description="Choose how you want to proceed with your content"
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

                              if (resultDiv && result && "object" in result) {
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
                                        <div class="mb-4">
                                          <h5 class="font-medium text-purple-700 dark:text-purple-300">${
                                            s.impact || "Improvement"
                                          }</h5>
                                          <div class="text-gray-700 dark:text-gray-300">${
                                            s.suggestion
                                          }</div>
                                        </div>
                                      `
                                        )
                                        .join("");

                                    resultDiv.innerHTML = `
                                      <div>
                                        <h5 class="font-medium text-purple-700 dark:text-purple-300 mb-4">Suggested Improvements</h5>
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
                          className="w-full bg-purple-100 text-purple-700 px-4 py-3 rounded-lg font-medium hover:bg-purple-200 transition"
                        >
                          Check for Improvements
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
                                  const { done, value } = await reader.read();
                                  if (done) break;
                                  content += value;
                                  resultDiv.innerHTML = `
                                    <div class="mb-4">
                                      <h5 class="font-medium text-purple-700 dark:text-purple-300">Enhanced Version</h5>
                                      <div class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">${content}</div>
                                    </div>
                                  `;
                                  resultDiv.classList.remove("hidden");
                                }
                              }
                            } catch (error) {
                              // Error is already handled in handleRewrite
                            }
                          }}
                          className="w-full bg-purple-100 text-purple-700 px-4 py-3 rounded-lg font-medium hover:bg-purple-200 transition"
                        >
                          Proofread & Enhance
                        </button>
                      </div>

                      <div
                        data-result-container
                        className="hidden mt-6 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg prose prose-sm dark:prose-invert max-w-none"
                      />
                    </div>
                  </ReviverDrawer>

                  <div className="mt-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Vivify>
                        <h3 className="font-medium mb-2">Pro Tips:</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                          <li>
                            Right-click any text to access AI analysis options
                          </li>
                          <li>Use the magic wand for quick enhancements</li>
                          <li>Try the real-time suggestions in the editor</li>
                          <li>
                            Experiment with different analysis depths and styles
                          </li>
                        </ul>
                      </Vivify>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Features Showcase
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {["Summarize", "Explain", "Key Points", "Rewrite"].map(
                    (feature) => (
                      <div key={feature} className="bg-white/80 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">{feature}</h3>
                        <p className="text-sm text-gray-600">
                          Try the {feature.toLowerCase()} feature by
                          right-clicking on any text
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
