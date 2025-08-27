"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const QUOTES = [
  "My rambling 1",
  "My rambling 2",
  "My rambling 3",
  "My rambling 4",
  "My rambling 5",
  "My rambling 6",
  "My rambling 7",
  "My rambling 8",
  "My rambling 9",
  "My rambling 10",
  "My rambling 11",
  "My rambling 12",
  "My rambling 13",
  "My rambling 14",
  "My rambling 15",
  "My rambling 16",
  "My rambling 17",
  "My rambling 18",
  "My rambling 19",
  "My rambling 20",
  "My rambling 21",
  "My rambling 22",
  "My rambling 23",
  "My rambling 24",
  "My rambling 25",
  "My rambling 26",
  "My rambling 27",
  "My rambling 28",
  "My rambling 29",
  "My rambling 30",
] as const;

export default function QuoteGeneratorCard() {
  const [index, setIndex] = useState(0); // Start with first quote to avoid hydration mismatch
  const [isClient, setIsClient] = useState(false);

  // Only randomize after client-side hydration
  useEffect(() => {
    setIsClient(true);
    setIndex(Math.floor(Math.random() * QUOTES.length));
  }, []);

  const nextQuote = () => {
    setIndex((prev) => {
      if (QUOTES.length <= 1) return prev;
      let newIndex = prev;
      while (newIndex === prev) {
        newIndex = Math.floor(Math.random() * QUOTES.length);
      }
      return newIndex;
    });
  };

  return (
    <motion.article
      className="md:col-span-2 md:row-span-2 card rounded-3xl bg-panel p-6 relative overflow-hidden flex flex-col gap-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Top: Avatar + Name */}
      <div className="flex items-center gap-4">
        <Image
          alt="avatar"
          className="h-14 w-14 rounded-2xl ring-2 ring-white/10 object-cover"
          src="/Professional-Photo-of-Chris-Lane-Jones.webp"
          width={56}
          height={56}
        />
        <div>
          <div className="font-semibold">Chris Lane Jones</div>
          <div className="text-muted text-sm">Full-stack • Hiking enjoyer</div>
        </div>
      </div>

      {/* Middle: Rotating Quote */}
      <div
        className="grid place-items-center px-2 py-3 flex-1"
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-center text-2xl leading-relaxed text-ink/90"
          >
            "{QUOTES[index]}"
          </motion.blockquote>
        </AnimatePresence>
      </div>

      {/* Bottom-right: Round Refresh Button */}
      <Button
        type="button"
        onClick={nextQuote}
        variant="neutral"
        className="absolute bottom-5 right-5 h-11 w-11 p-0 rounded-full grid place-items-center shadow-passive hover:shadow-glow focus-ring"
        aria-label="Show another quote"
        title="New quote"
      >
        <RefreshCcw className="h-5 w-5" aria-hidden="true" />
      </Button>
    </motion.article>
  );
}
