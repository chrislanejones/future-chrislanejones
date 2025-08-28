import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const interphases = localFont({
  src: [
    {
      path: "../../public/fonts/TT-Interphases-Pro-Regular.ttf",
      weight: "400",
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
        className={`${interphases.className} bg-base text-ink`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
