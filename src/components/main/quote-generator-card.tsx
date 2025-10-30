"use client";

import { useState, useEffect } from "react";
import Card from "../page/card";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { ReactNode } from "react";

const QUOTES: ReactNode[] = [
  "My rambling 1",
  "My rambling 2",
  "My rambling 3",
  "My rambling 4",
  "Locked my fridge with a CAPTCHA to stop my midnight snacking.",
  'In 2017, three people called on the same day asking me "How can I learn to code?"',
  'I didn\'t code as a child because this "<!--[if !(IE 6)]>" scared me.',
  "I lock my computer at night to prevent my cats from online shopping",
  <>
    If there was no code, I would become a{" "}
    <a
      href="https://www.linkedin.com/in/aaronwitt/"
      target="_blank"
      rel="nofollow noopener noreferrer"
      className="underline"
    >
      Dirt Nerd
    </a>
  </>,
  "Powered by coffee and deprecated APIs since 2015",
  "I tried to explain `git blame` to my wife. I'm now sleeping on the couch.",
  <>
    I once met{" "}
    <a
      href="https://x.com/tannerlinsley"
      target="_blank"
      rel="nofollow noopener noreferrer"
      className="underline"
    >
      Tanner Linsley
    </a>
    . The following week I learned he was the creator of Tanstack.
  </>,
  <>
    I will apply to any tech company that swaps JavaScript questions for{" "}
    <a
      href="https://www.youtube.com/technologyconnections"
      target="_blank"
      rel="nofollow noopener noreferrer"
      className="underline"
    >
      Technology Connections
    </a>{" "}
    questions.
  </>,
  "My code reviews have been described as 'thorough' and 'why are you like this?'",
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
  const [isClient, setIsClient] = useState(false);

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
    <Card
      size={size}
      padding="medium"
      shadow="soft"
      border="thin"
      delay={delay}
      className="relative overflow-hidden flex flex-col gap-6"
    >
      <div className="speech-bubble-container">
        <Image
          alt="avatar"
          className="h-20 w-20 rounded-2xl ring-2 ring-white/5 object-cover justify-self-start"
          src="/Professional-Photo-of-Chris-Lane-Jones.webp"
          width={80}
          height={80}
        />
        <div className="flex flex-col justify-center">
          <div className="font-bold text-xl text-white drop-shadow-sm">
            Chris Lane Jones
          </div>
          <div className="text-white/90 text-sm drop-shadow-sm">
            UX/UI Web Design and Development
          </div>
        </div>
      </div>

      <div
        className="grid place-items-center px-2 py-3 flex-1"
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={index}
            exit={{ opacity: 0, y: -8 }}
            className="text-center text-xl leading-relaxed text-ink"
          >
            {typeof QUOTES[index] === "string"
              ? `"${QUOTES[index]}"`
              : QUOTES[index]}
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <Button
        type="button"
        onClick={nextQuote}
        variant="neutral"
        size="icon"
        round={true}
        className="absolute bottom-5 right-5"
        aria-label="Show another quote"
        title="New quote"
      >
        <RefreshCcw className="h-5 w-5" aria-hidden="true" />
      </Button>
    </Card>
  );
}
