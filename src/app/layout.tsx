// src/app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { PHProvider, PostHogPageView } from "@/providers/PostHogProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Suspense } from "react";

const interphases = localFont({
  src: [
    {
      path: "../../public/fonts/TT-Interphases-Pro-Regular.ttf",
      weight: "400",
      style: "regular",
    },
    {
      path: "../../public/fonts/TT-Interphases-Pro-Bold.ttf",
      weight: "700",
      style: "bold",
    },
    {
      path: "../../public/fonts/TT-Interphases-Pro-Black.ttf",
      weight: "900",
      style: "black",
    },
  ],
  variable: "--font-interphases",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#4ade80",
          colorBackground: "#0b0d10",
          colorInputBackground: "#111418",
          colorInputText: "#f3f4f6",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${interphases.className}`}
          suppressHydrationWarning
          style={{
            backgroundColor: "var(--color-base)",
            color: "var(--color-ink)",
          }}
        >
          <PHProvider>
            <ConvexClientProvider>
              <Suspense fallback={null}>
                <PostHogPageView />
              </Suspense>
              {children}
            </ConvexClientProvider>
          </PHProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
