"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GA_ID = "G-4RZ5XQXZ9Y";
const IDLE_MS = 10_000;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type PostHog = typeof import("posthog-js").default;
let starting: Promise<PostHog> | null = null;
// Pageviews that happen before analytics start are sent, in order, once they do.
const pending: string[] = [];

// Analytics wait for the first scroll, tap, click, or key press (or 10 s of
// idle), so they never compete with the page itself for the phone's CPU.
function start(): Promise<PostHog> {
  if (starting) return starting;
  starting = (async () => {
    const { default: posthog } = await import("posthog-js");
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
      capture_pageview: false,
      capture_pageleave: true,
    });
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { send_page_view: false });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
    for (const url of pending.splice(0)) send(posthog, url);
    return posthog;
  })();
  return starting;
}

function send(posthog: PostHog, url: string) {
  posthog.capture("$pageview", { $current_url: url });
  window.gtag?.("event", "page_view", { page_location: url });
}

function pageview(url: string) {
  if (starting) starting.then((posthog) => send(posthog, url));
  else pending.push(url);
}

export function DeferredAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    const go = () => {
      events.forEach((name) => window.removeEventListener(name, go));
      clearTimeout(timer);
      start();
    };
    const timer = setTimeout(go, IDLE_MS);
    events.forEach((name) => window.addEventListener(name, go, { passive: true }));
    return () => {
      events.forEach((name) => window.removeEventListener(name, go));
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!pathname) return;
    const query = searchParams?.toString();
    const url = window.origin + pathname + (query ? `?${query}` : "");
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}
