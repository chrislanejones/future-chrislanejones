export function PageSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-muted text-sm">{label}</p>
      </div>
    </div>
  );
}
