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
  title: "Chris Lane Jones — Dev & Hiker",
  description:
    "Personal portfolio using a bento grid and Motion One animations. Developer who likes hiking.",
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
