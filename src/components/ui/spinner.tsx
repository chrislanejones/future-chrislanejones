import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// The one loading indicator. Coastal route-level loading.tsx files use
// CoastalPageLoading instead, so their skeleton matches the page shell.
export function Spinner({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn("flex flex-col items-center justify-center py-12", className)}
    >
      <Loader2
        className="w-8 h-8 animate-spin text-(--color-accent) mb-3"
        aria-hidden="true"
      />
      <p className="text-muted">{label}</p>
    </div>
  );
}
