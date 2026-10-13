// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { PHProvider, PostHogPageView } from "@/providers/PostHogProvider";
import { Suspense } from "react";
import { PERSON, SITE_URL, jsonLd, siteGraph } from "@/lib/structured-data";

const HOME_TITLE = "Chris Lane Jones | Senior Web Engineer, React & Rust/WASM";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: "%s | Chris Lane Jones",
  },
  description:
    PERSON.description,
  authors: [{ name: "Chris Lane Jones", url: "https://www.chrislanejones.com" }],
  creator: "Chris Lane Jones",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.chrislanejones.com",
    siteName: "Chris Lane Jones",
    title: HOME_TITLE,
    description:
      PERSON.description,
    images: [
      {
        url: "/Professional-Photo-of-Chris-Lane-Jones.webp",
        width: 1200,
        height: 630,
        alt: `${PERSON.name}, ${PERSON.jobTitle}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cljwebdev",
    creator: "@cljwebdev",
    title: HOME_TITLE,
    description:
      PERSON.description,
    images: ["/Professional-Photo-of-Chris-Lane-Jones.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "HxJxP6aNuDpL80nAArN4i3BtkyY32mDzWc8Q7jubP4E",
  },
};

const interphases = localFont({
  src: [
    {
      path: "../../public/fonts/TT-Interphases-Pro-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/TT-Interphases-Pro-DemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/TT-Interphases-Pro-Bold.woff2",
      weight: "700",
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
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${interphases.className} ${interphases.variable} antialiased`}
          suppressHydrationWarning
          style={{
            backgroundColor: "var(--color-base)",
            color: "var(--color-ink)",
          }}
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd(siteGraph()) }}
          />
          <PHProvider>
            <ConvexClientProvider>
              <Suspense fallback={null}>
                <PostHogPageView />
              </Suspense>

              {/* 👇 Global page container */}
              <div className="site-shell mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </ConvexClientProvider>
          </PHProvider>
          <Script async src="https://www.googletagmanager.com/gtag/js?id=G-4RZ5XQXZ9Y" strategy="lazyOnload" />
          <Script id="google-analytics" strategy="lazyOnload">
            {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4RZ5XQXZ9Y');`}
          </Script>
        </body>
      </html>
  );
}
