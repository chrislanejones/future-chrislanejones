"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

// Helper component for inline code styling
const Code = ({ children }: { children: ReactNode }) => (
  <code className="bg-black/20 px-1.5 py-0.5 rounded text-sm font-mono">
    {children}
  </code>
);

// CSS tribute to the dearly departed <marquee> tag
const MarqueeQuote = ({ children }: { children: ReactNode }) => (
  <span
    className="marquee-container"
    aria-label="I still mourn the death of the marquee tag."
  >
    <span className="marquee-inner" aria-hidden="true">
      {children}
    </span>
  </span>
);

// Helper component for quote images (250px square webp)
const QuoteImage = ({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src}
    alt={alt}
    width={150}
    height={150}
    className="rounded-lg mx-auto my-2"
  />
);

const MARQUEE_INDEX = 0; // index of the scrolling marquee quote

const QUOTES: ReactNode[] = [
  <MarqueeQuote>
    I still mourn the death of the <Code>&lt;marquee&gt;</Code> tag.
  </MarqueeQuote>,
  <>The mountains don't judge my code. That's why I live here.</>,
  <>
    Expected Website Completion Date: May 20, 1999
    <QuoteImage
      src="/gallery/Under-Construction.webp"
      alt="Under Construction"
    />
  </>,
  <>
    In high school, If there was a song missing from Limewire, I was the guy to
    call.
    <QuoteImage src="/gallery/Limewire.webp" alt="Under Construction" />
  </>,
  <>
    2010: I was learning After Effects
    <br />
    2025: I am learning Effect.ts
  </>,
  <>
    The first time I used SQL I hit <Code>DROP TABLE</Code> thinking it would
    download the file.
  </>,
  <>
    My <Code>.env</Code> file knows more secrets than my therapist.
  </>,
  <>
    I didn't code as a child because this <Code>&lt;!--[if !(IE 6)]&gt;</Code>{" "}
    scared me.
  </>,
  <>
    I tried to explain <Code>git blame</Code> to my wife.
    <br />
    <br />
    I'm now sleeping on the couch.
  </>,
  <>
    <Code>alias adulting='echo "not today"'</Code>
  </>,
  <>
    I spent way too many hours building this site, let's bring back Geocities
  </>,
  <>Locked my fridge with a CAPTCHA to stop my midnight snacking.</>,
  <>
    Dear Guy/Gal with 47 tabs open,{" "}
    <a
      href="https://blog.google/products-and-platforms/products/chrome/manage-tabs-with-google-chrome/"
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-accent transition-colors"
    >
      Group tabs
    </a>{" "}
    will change your life trust me
  </>,
  <>I lock my computer at night to prevent my cats from online shopping</>,
  <>Powered by coffee and deprecated APIs since 2015</>,
  <>
    In 2017, three people called on the same day asking me 'How can I learn to
    code tonight?
  </>,
  <>I should have went into the business of building COVID WFH sheds.</>,
];

export default function QuoteContent() {
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

  // Marquee quote gets 3 full passes (42s) before auto-advancing; others 20s
  useEffect(() => {
    const delay = index === MARQUEE_INDEX ? 7000 * 3 : 18000;
    const timer = setTimeout(() => {
      setIndex((prev) => {
        if (QUOTES.length <= 1) return prev;
        let next = prev;
        while (next === prev) next = Math.floor(Math.random() * QUOTES.length);
        return next;
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="relative h-full flex flex-col">
      {/* Top: quote area */}
      <div className="relative flex-1 grid place-items-center">
        <div className="speech-bubble-container speech-bubble--compact w-full max-w-[min(720px,92%)] mx-auto">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              exit={{ opacity: 0, y: -8 }}
              className="text-center leading-relaxed m-0 min-w-0 w-full"
            >
              <h4>
                {typeof QUOTES[index] === "string"
                  ? `"${QUOTES[index]}"`
                  : QUOTES[index]}
              </h4>
            </motion.blockquote>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom: footer bar */}
      <div className="pt-6 grid grid-cols-[auto_1fr_auto] items-center gap-4">
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
    </div>
  );
}
