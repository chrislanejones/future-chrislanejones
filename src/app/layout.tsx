import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

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

export const metadata: Metadata = {
  title: "Chris Lane Jones — UX/UI Web Design and Development - Dev & Hiker",
  description:
    "I Consult, Design, and Develop Web Interfaces for Businesses and Government Agencies.",
};

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
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
