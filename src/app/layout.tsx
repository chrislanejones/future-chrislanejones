// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { PHProvider, PostHogPageView } from "@/providers/PostHogProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Suspense } from "react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

const interphases = localFont({
  src: [
    {
      path: "../../public/fonts/TT-Interphases-Pro-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/TT-Interphases-Pro-DemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/TT-Interphases-Pro-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/TT-Interphases-Pro-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-interphases",
});

// src/app/layout.tsx
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
          className={`${interphases.className} ${interphases.variable} antialiased`}
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

              {/* 👇 Global page container */}
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </ConvexClientProvider>
          </PHProvider>
          <Script async src="https://www.googletagmanager.com/gtag/js?id=G-4RZ5XQXZ9Y" strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4RZ5XQXZ9Y');`}
          </Script>
        </body>
      </html>
    </ClerkProvider>
  );
}
