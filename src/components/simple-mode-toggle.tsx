"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMounted } from "@/lib/use-is-mounted";
import { setTheme, useTheme } from "@/lib/theme-store";

export function SimpleModeToggle() {
  const theme = useTheme();
  const mounted = useIsMounted();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  if (!mounted) {
    return (
      <Button
        variant="neutral"
        size="icon"
        round={true}
        className="shrink-0"
        disabled
        aria-label="Loading theme toggle"
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  return (
    <Button
      variant="neutral"
      size="icon"
      round={true}
      onClick={toggleTheme}
      className="shrink-0"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
