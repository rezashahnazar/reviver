"use client";

import { useEffect, useState, useRef } from "react";
import { ReviverObserverProps } from "../types";
import { useReviverContext } from "./ReviverProvider";
import { getSuggestions } from "../server/actions";
import { readStreamableValue } from "ai/rsc";

export function ReviverObserver({ onDataCollected }: ReviverObserverProps) {
  const [timeSpent, setTimeSpent] = useState(0);
  const [idle, setIdle] = useState(false);
  const [scrollDepth, setScrollDepth] = useState(0);
  const { setLoadingActions } = useReviverContext();
  const idleTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const dataCollectionTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    // Reset idle timer on user activity
    const resetIdleTimer = () => {
      setIdle(false);
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setIdle(true), 5000); // 5 seconds
    };

    // Track scroll depth
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const newScrollDepth = Math.round(
        (scrollTop / (documentHeight - windowHeight)) * 100
      );
      setScrollDepth(Math.min(100, Math.max(0, newScrollDepth)));
      resetIdleTimer();
    };

    // Track user activity
    const handleActivity = () => {
      resetIdleTimer();
    };

    // Start time tracking
    const startTime = Date.now();
    const timeInterval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    // Set up data collection interval
    dataCollectionTimerRef.current = setInterval(async () => {
      const data = {
        timeSpent,
        idle,
        scrollDepth,
      };

      setLoadingActions((prev) => [...prev, "observer-collect"]);
      try {
        const response = await getSuggestions(document.body.textContent || "", {
          context: `User spent ${timeSpent} seconds, ${
            idle ? "is" : "is not"
          } idle, and scrolled ${scrollDepth}% of the page.`,
        });

        if (response.object) {
          const stream = readStreamableValue(response.object);
          for await (const partialObject of stream) {
            if (partialObject?.suggestions) {
              onDataCollected?.({
                ...data,
                suggestions: partialObject.suggestions,
              });
            }
          }
        }
      } catch (err) {
        console.error("Observer data collection error:", err);
      } finally {
        setLoadingActions((prev) =>
          prev.filter((a) => a !== "observer-collect")
        );
      }
    }, 15000); // Every 15 seconds

    // Add event listeners
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    // Initial idle timer
    resetIdleTimer();

    // Cleanup
    return () => {
      clearInterval(timeInterval);
      clearTimeout(idleTimerRef.current);
      clearInterval(dataCollectionTimerRef.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [timeSpent, idle, scrollDepth, onDataCollected, setLoadingActions]);

  // This is a non-visual component
  return null;
}
