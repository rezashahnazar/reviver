import { Plus_Jakarta_Sans } from "next/font/google";
import {
  ReviverProvider,
  GlobalOverlay,
  type ReviverConfig,
  type ReviverAction,
} from "ai-reviver";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

const reviverConfig: Partial<ReviverConfig> = {
  vivify: {
    actions: [
      "summarize",
      "explain",
      "keyPoints",
      "enhance",
      "simplify",
    ] as ReviverAction[],
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
    enhancementActions: [
      "rewrite",
      "suggestions",
      "improve",
      "analyze",
    ] as ReviverAction[],
  },
};

export const metadata = {
  title: "Reviver - AI-Powered Content Enhancement",
  description:
    "Transform your content with AI-powered suggestions, analysis, and improvements.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${plusJakarta.className} min-h-screen bg-background antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReviverProvider config={reviverConfig}>
            {children}
            <GlobalOverlay />
          </ReviverProvider>
          <Toaster position="top-center" expand={true} richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
