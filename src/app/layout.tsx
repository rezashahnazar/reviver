import { Inter } from "next/font/google";
import {
  ReviverProvider,
  GlobalOverlay,
  type ReviverConfig,
  type ReviverAction,
} from "ai-reviver";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

const reviverConfig: Partial<ReviverConfig> = {
  vivify: {
    actions: ["summarize", "explain", "keyPoints"] as ReviverAction[],
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
    enhancementActions: ["rewrite", "suggestions"] as ReviverAction[],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}
      >
        <ReviverProvider config={reviverConfig}>
          {children}
          <GlobalOverlay />
        </ReviverProvider>
        <Toaster />
      </body>
    </html>
  );
}
