"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Reveals follow the reading order; reduced motion keeps every section still.
// The Web Animations API plays the same rise as before without shipping a
// motion library to every page that uses it.
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        el.animate(
          [
            { transform: "translateY(16px)", opacity: 0.6 },
            { transform: "none", opacity: 1 },
          ],
          { duration: 650, delay: delay * 1000, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" },
        );
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
