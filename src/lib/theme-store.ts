"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

// One store for the whole page. The header and the link page each render a
// toggle; before this they each held their own useState and could disagree
// after one of them was clicked.
const listeners = new Set<() => void>();

// Cached so getSnapshot stays pure and referentially stable between changes.
let current: Theme | null = null;

function readInitialTheme(): Theme {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyToDocument(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  // Only follow the system when the visitor has not made an explicit choice.
  const onSystemChange = (e: MediaQueryListEvent) => {
    if (localStorage.getItem("theme")) return;
    current = e.matches ? "dark" : "light";
    applyToDocument(current);
    emit();
  };
  mediaQuery.addEventListener("change", onSystemChange);

  // Keep other tabs in step.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== "theme") return;
    current = e.newValue === "light" ? "light" : "dark";
    applyToDocument(current);
    emit();
  };
  window.addEventListener("storage", onStorage);

  applyToDocument(getSnapshot());

  return () => {
    listeners.delete(onStoreChange);
    mediaQuery.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Theme {
  current ??= readInitialTheme();
  return current;
}

// The server has no localStorage and no media query; dark is the site default.
const getServerSnapshot = (): Theme => "dark";

export function setTheme(theme: Theme) {
  current = theme;
  localStorage.setItem("theme", theme);
  applyToDocument(theme);
  emit();
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
