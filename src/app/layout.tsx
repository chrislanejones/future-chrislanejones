import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-base text-ink`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
