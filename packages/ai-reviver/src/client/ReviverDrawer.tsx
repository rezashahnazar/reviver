"use client";

import { ReactNode, useState, useEffect, useRef, useMemo } from "react";
import { Drawer } from "vaul";
import { cn } from "../utils";
import { toast } from "sonner";
import React from "react";

export interface ReviverDrawerProps {
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

export function ReviverDrawer({
  trigger,
  title,
  description,
  children,
  isProcessing = false,
  className,
  shouldScaleBackground = true,
  onClearResults,
  streamResult,
}: Omit<ReviverDrawerProps, "onAction">) {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [localStreamResult, setLocalStreamResult] = useState<ReactNode>(null);
  const [shouldShowLoading, setShouldShowLoading] = useState(false);
  const hasToastShown = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const originalHandlerRef = useRef<{
    handler: Function | null;
    element: HTMLElement | null;
  }>({ handler: null, element: null });

  // Extract the original click handler from the trigger
  useEffect(() => {
    if (!React.isValidElement(trigger)) return;

    const triggerElement = trigger as React.ReactElement<{
      onClick?: Function;
      disabled?: boolean;
    }>;

    if (triggerElement.props.onClick) {
      originalHandlerRef.current = {
        handler: triggerElement.props.onClick,
        element: null, // We'll set this when clicked
      };
    }
  }, [trigger]);

  // Capture the original click handler from the trigger
  const wrappedTrigger = useMemo(() => {
    if (!React.isValidElement(trigger)) return trigger;

    const triggerElement = trigger as React.ReactElement<{
      onClick?: Function;
      disabled?: boolean;
    }>;

    return React.cloneElement(triggerElement, {
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        // Update the element reference when clicked
        if (originalHandlerRef.current.handler) {
          originalHandlerRef.current.element = e.currentTarget;
        }
        // Don't call the original handler here, just open the drawer
        setIsOpen(true);
      },
      // Pass through the disabled state
      disabled: triggerElement.props.disabled || isActionLoading,
    });
  }, [trigger, isActionLoading]);

  // Handle loading state with fade
  useEffect(() => {
    if (isProcessing || isActionLoading) {
      setShouldShowLoading(true);
      hasToastShown.current = false;
    } else {
      const timeout = setTimeout(() => {
        setShouldShowLoading(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isProcessing, isActionLoading]);

  // Handle stream updates
  useEffect(() => {
    if (streamResult !== undefined) {
      setLocalStreamResult(streamResult);
      if (!isProcessing) {
        setIsActionLoading(false);
      }
    }
  }, [streamResult, isProcessing]);

  const clearContent = () => {
    setLocalStreamResult(null);
    setIsActionLoading(false);
    setShouldShowLoading(false);
    hasToastShown.current = false;
    onClearResults?.();
  };

  const handleAction = async () => {
    const { handler, element } = originalHandlerRef.current;

    if (!handler) {
      toast.error("Action not available", {
        description: "The action handler was not properly initialized.",
      });
      return;
    }

    try {
      setIsActionLoading(true);

      // Create a synthetic event that matches the original click event
      const syntheticEvent = {
        currentTarget: element || document.createElement("button"),
        preventDefault: () => {},
        stopPropagation: () => {},
        type: "click",
      };

      // Call the original handler with the synthetic event
      const result = await Promise.resolve(handler(syntheticEvent));

      // Only show success toast and close if the action succeeds
      toast.success("Successfully published!", {
        description: "Your content has been published successfully.",
      });

      // Reset states and close modal
      clearContent();
      setIsOpen(false);

      return result;
    } catch (error: any) {
      console.error("Action failed:", error);
      setIsActionLoading(false);
      setShouldShowLoading(false);

      toast.error("Failed to publish", {
        description:
          error?.message || "An error occurred while publishing your content.",
      });
      throw error; // Re-throw to allow error handling up the chain
    }
  };

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          clearContent();
        }
      }}
      shouldScaleBackground={shouldScaleBackground}
    >
      <Drawer.Trigger asChild>{wrappedTrigger}</Drawer.Trigger>
      <Drawer.Portal>
        <div className="fixed inset-0 z-50">
          <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="fixed inset-0 overflow-hidden">
            <div className="flex min-h-full items-center justify-center p-4">
              <Drawer.Content
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "42rem",
                  height: "85vh",
                }}
                className={cn(
                  // Base styles
                  "flex flex-col",
                  "bg-white dark:bg-gray-900",
                  "rounded-xl",
                  "border border-gray-200 dark:border-gray-800",
                  "shadow-xl",
                  "focus:outline-none",
                  // Animation
                  "transition-all duration-200",
                  "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
                  "data-[state=open]:translate-y-0 data-[state=closed]:translate-y-2",
                  "data-[state=open]:scale-100 data-[state=closed]:scale-98",
                  // Override Vaul's default positioning
                  "[&[data-vaul-drawer]]:relative [&[data-vaul-drawer]]:w-full",
                  "[&[data-vaul-drawer-direction]]:transform-none",
                  "[&[data-vaul-drawer][data-vaul-drawer-direction=bottom]::after]:hidden",
                  className
                )}
              >
                {/* Main Content Area with fixed height */}
                <div className="flex flex-col flex-1 min-h-0">
                  {/* Header */}
                  <div className="shrink-0 p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                    {title && (
                      <Drawer.Title className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                        {title}
                      </Drawer.Title>
                    )}
                    {description && (
                      <Drawer.Description className="text-gray-600 dark:text-gray-400">
                        {description}
                      </Drawer.Description>
                    )}
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-6 min-h-0">
                    <div className="relative h-full">
                      <div
                        className={cn(
                          "absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg z-10",
                          "transition-opacity duration-1000 ease-in-out",
                          shouldShowLoading
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none"
                        )}
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 animate-gradient"
                          style={{ backgroundSize: "200% 200%" }}
                        />
                      </div>
                      <div className="space-y-4">
                        {children}
                        {!isActionLoading && localStreamResult}
                      </div>
                    </div>
                  </div>

                  {/* Fixed Footer */}
                  <div className="shrink-0 border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900 rounded-b-xl">
                    <div className="flex justify-end gap-3">
                      <Drawer.Close asChild>
                        <button
                          onClick={clearContent}
                          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                        >
                          Close
                        </button>
                      </Drawer.Close>
                      <button
                        onClick={handleAction}
                        disabled={isActionLoading}
                        className={cn(
                          "px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg transition-colors",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          "hover:bg-purple-700"
                        )}
                      >
                        {isActionLoading ? "Publishing..." : "Publish"}
                      </button>
                    </div>
                  </div>
                </div>
              </Drawer.Content>
            </div>
          </div>
        </div>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
