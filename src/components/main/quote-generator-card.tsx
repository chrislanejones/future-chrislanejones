"use client";

import { useState, useEffect } from "react";
import Card from "../page/card";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const QUOTES: ReactNode[] = [
  "My rambling 1",
  "My rambling 2",
  "I spent way too many hours building this site, let's bring back Geosites",
  "When I tried SQL for the first time I hit DROP TABLE attempting to download.",
  "Locked my fridge with a CAPTCHA to stop my midnight snacking.",
  'In 2017, three people called on the same day asking me "How can I learn to code?"',
  'I didn\'t code as a child because this "<!--[if !(IE 6)]>" scared me.',
  "I lock my computer at night to prevent my cats from online shopping",
  "Powered by coffee and deprecated APIs since 2015",
  "I tried to explain `git blame` to my wife. I'm now sleeping on the couch.",
  "I'm at the age where I avoid Starbuck's wooden chairs with square backrest at all costs",
];

interface QuotegeneratorcardProps {
  size?:
    | "small"
    | "medium"
    | "large"
    | "wide"
    | "hero"
    | "full"
    | "page-full"
    | "page-half"
    | "page-third";
  delay?: number;
}

export default function Quotegeneratorcard({
  size = "large",
  delay = 0.3,
}: QuotegeneratorcardProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * QUOTES.length));
  }, []);

  const nextQuote = () => {
    setIndex((prev) => {
      if (QUOTES.length <= 1) return prev;
      let newIndex = prev;
      while (newIndex === prev)
        newIndex = Math.floor(Math.random() * QUOTES.length);
      return newIndex;
    });
  };

  return (
    <Card
      size={size}
      padding="none"
      shadow="soft"
      border="thin"
      delay={delay}
      className="relative overflow-hidden flex flex-col"
    >
      {/* Top: quote area — bubble centered, no forced stretch */}
      <div className="relative flex-1 min-h-[200px] grid place-items-center px-4 py-6">
        {/* Important: no h-full here so the row doesn't stretch */}
        <div className="speech-bubble-container speech-bubble--compact w-full max-w-[min(720px,92%)] mx-auto">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              exit={{ opacity: 0, y: -8 }}
              className="text-center h4 leading-relaxed m-0"
            >
              {typeof QUOTES[index] === "string"
                ? `"${QUOTES[index]}"`
                : QUOTES[index]}
            </motion.blockquote>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom: footer bar (avatar, title, circular neutral icon button) */}
      <div className="p-6 grid grid-cols-[auto_1fr_auto] items-center gap-4">
        <Button
          asChild
          variant="neutral"
          size="icon"
          className="rounded-full h-11 w-11 p-0 overflow-hidden ring-2 ring-white/5 hover:shadow-glow transition-all hover:scale-105"
          aria-label="View About page"
        >
          <Link href="/about">
            <Image
              alt="Chris Lane Jones profile photo"
              className="h-full w-full object-cover"
              src="/Professional-Photo-of-Chris-Lane-Jones.webp"
              width={44}
              height={44}
              priority
            />
          </Link>
        </Button>

        <h3 className="text-ink text-center">My Ramblings</h3>

        <Button
          type="button"
          onClick={nextQuote}
          variant="neutral"
          size="icon"
          className="rounded-full h-11 w-11 justify-self-end shadow-sm transition hover:scale-105"
          aria-label="New quote"
        >
          <RefreshCcw className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
    </Card>
  );
}
