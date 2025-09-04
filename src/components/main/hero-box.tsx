"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { MountainSnow } from "lucide-react";

export default function HeroCard() {
  const [isAnimated, setIsAnimated] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Trigger animation after component mounts with a small delay
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const replayAnimation = () => {
    setIsAnimated(false);
    setAnimationKey((prev) => prev + 1);
    setTimeout(() => {
      setIsAnimated(true);
    }, 100);
  };
  return (
    <motion.article
      className="md:col-span-4 md:row-span-2 card rounded-3xl glass p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute -right-10 -top-10 opacity-20"
          viewBox="0 0 800 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className={`transition-none ${isAnimated ? "animate-draw" : ""}`}
            d="M-9.05,235.51c52.17-15.14,138.62,217.07,239.05,200.49,52.13-8.61,82.91-80.11,118-67,25.08,9.37,17.97,49.11,46,63,33.34,16.52,86.6-18.27,117-47,58.81-55.56,42.05-97.81,100-198,32.61-56.37,67.11-116.03,126-127,60.12-11.2,113.75,34.29,118,38,108.76,94.91,92.44,393.71-60,546-214.44,214.23-674.9,115.23-802-111-68.57-122.05-42.68-285.69-2.05-297.49Z"
            fill="transparent"
            stroke="#8de36b"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeDasharray="6 8"
            strokeDashoffset={isAnimated ? "0" : "1150"}
            pathLength="1150"
            style={{
              transition: isAnimated
                ? "stroke-dashoffset 5000ms ease-in-out"
                : "none",
            }}
          />
        </svg>
      </div>

      {/* Content */}
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl md:text-4xl font-black leading-tight">
            UX/UI Web Design and Development
          </h1>
          <h2 className="text-xl md:text-xl font-bold leading-tight">
            I Consult, Design, and Develop Web Interfaces for Businesses and
            Government Agencies.
          </h2>
          <p className="text-regular max-w-prose">
            I Build with React and WordPress — then escape to the Mountains. 🏔️
          </p>
        </div>

        {/* Buttons pinned to bottom-left */}
        <div className="mt-auto flex items-center gap-3">
          <Button asChild variant="base">
            <a href="#contact">See My Calendar</a>
          </Button>
          <Button variant="base" onClick={replayAnimation}>
            <MountainSnow className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
