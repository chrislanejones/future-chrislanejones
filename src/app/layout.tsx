import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${interphases.className}`}
        suppressHydrationWarning
        style={{
          backgroundColor: "var(--color-base)",
          color: "var(--color-ink)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
